import * as THREE from "https://esm.sh/three";
import * as CANNON from "https://esm.sh/cannon-es";

const fallbackPalette = ["#EAA14D", "#E05A47", "#4D9BEA", "#5FB376", "#D869A8", "#F2C94C", "#9B51E0"];
const allowedSides = [4, 6, 8, 10, 12, 20, 100];
const pool = new Map(allowedSides.map(sides => [sides, sides === 20 ? 1 : 0]));

let scene;
let camera;
let renderer;
let world;
let canvasContainer;
let diceObjects = [];
let isHolding = false;
let needsResultCheck = false;
let pendingRoll = null;
let resultFallbackTimer = null;
let audioContext = null;
let lastCollisionSound = 0;
let lastLiveTotal = null;

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -14);
const FRUSTUM_SIZE = 24;

const uiResult = document.getElementById("result-board");
const uiTotal = document.getElementById("total-score");
const uiDetail = document.getElementById("detail-score");
const uiBadge = document.getElementById("diceTypeBadge");
const uiRollText = document.getElementById("rollResult");

export function initDiceRoller() {
  canvasContainer = document.querySelector(".dice-canvas-area");
  if (!canvasContainer) return;

  scene = new THREE.Scene();
  scene.background = new THREE.Color("#f1f0eb");
  camera = new THREE.OrthographicCamera();
  camera.position.set(42, 42, 42);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.touchAction = "none";
  canvasContainer.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x777777, 2.5));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(8, 18, 12);
  scene.add(keyLight);

  world = new CANNON.World();
  world.gravity.set(0, -32, 0);
  world.allowSleep = true;
  world.solver.iterations = 18;
  const surfaceMaterial = new CANNON.Material("surface");
  const diceMaterial = new CANNON.Material("dice");
  world.addContactMaterial(new CANNON.ContactMaterial(surfaceMaterial, diceMaterial, {
    friction: .42,
    restitution: .42
  }));
  createPhysicsBounds(surfaceMaterial);

  new ResizeObserver(onResize).observe(canvasContainer);
  renderer.domElement.addEventListener("pointerdown", onInputStart);
  window.addEventListener("pointermove", onInputMove);
  window.addEventListener("pointerup", onInputEnd);
  window.addEventListener("dice-theme-change", () => {
    const specs = groupDiceObjects();
    createDiceSet(specs.length ? specs : getPoolSpecs().length ? getPoolSpecs() : [{ sides: 20, count: 1 }]);
  });

  document.querySelectorAll("[data-pool-action]").forEach(button => {
    button.addEventListener("click", () => {
      const row = button.closest("[data-pool-die]");
      const sides = Number(row.dataset.poolDie);
      const delta = button.dataset.poolAction === "add" ? 1 : -1;
      const total = getPoolSpecs().reduce((sum, die) => sum + die.count, 0);
      if (delta > 0 && total >= 12) return;
      pool.set(sides, Math.max(0, (pool.get(sides) || 0) + delta));
      refreshPool();
    });
  });
  document.getElementById("rollPoolButton")?.addEventListener("click", () => rollDicePool());
  document.getElementById("clearPoolButton")?.addEventListener("click", () => {
    allowedSides.forEach(sides => pool.set(sides, 0));
    refreshPool();
  });

  refreshPool();
  onResize();
  animate();
}

export function rollDice({ sides = 20, count = 1, modifier = 0, label = "", onComplete = null } = {}) {
  const normalized = normalizeSides(sides);
  rollSpecs([{ sides: normalized, count: Math.max(1, Number(count) || 1) }], modifier, label, onComplete);
}

export function rollDicePool() {
  const specs = getPoolSpecs();
  if (!specs.length) return;
  rollSpecs(specs, 0, specs.map(formatSpec).join(" + "), null);
}

function rollSpecs(specs, modifier, label, onComplete) {
  if (!world || !scene) return;
  createDiceSet(specs);
  pendingRoll = { specs, modifier, label, onComplete, startedAt: performance.now() };
  lastLiveTotal = null;
  setBadge(specs);
  updateLiveResult(true);
  throwDice();
}

function normalizeSides(sides) {
  return allowedSides.includes(Number(sides)) ? Number(sides) : 20;
}

function getPoolSpecs() {
  return allowedSides
    .map(sides => ({ sides, count: pool.get(sides) || 0 }))
    .filter(die => die.count > 0);
}

function formatSpec({ sides, count }) {
  return `${count}d${sides}`;
}

function setBadge(specs) {
  if (uiBadge) uiBadge.textContent = specs.length === 1 ? formatSpec(specs[0]).toUpperCase() : "POOL";
}

function refreshPool() {
  document.querySelectorAll("[data-pool-die]").forEach(row => {
    const count = pool.get(Number(row.dataset.poolDie)) || 0;
    row.querySelector("span").textContent = count;
    row.classList.toggle("active", count > 0);
  });
  const specs = getPoolSpecs();
  const summary = specs.length ? specs.map(formatSpec).join(" + ") : "Escolha pelo menos um dado";
  document.getElementById("poolSummary").textContent = summary;
  document.getElementById("rollPoolButton").disabled = specs.length === 0;
  setBadge(specs.length ? specs : [{ sides: 20, count: 1 }]);
  createDiceSet(specs.length ? specs : [{ sides: 20, count: 1 }]);
}

function createPhysicsBounds(material) {
  const floor = new CANNON.Body({ mass: 0, material });
  floor.addShape(new CANNON.Plane());
  floor.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  world.addBody(floor);
  [[12, 0, -Math.PI / 2], [-12, 0, Math.PI / 2], [0, -12, 0], [0, 12, Math.PI]].forEach(([x, z, rotation]) => {
    const wall = new CANNON.Body({ mass: 0, material });
    wall.addShape(new CANNON.Plane());
    wall.position.set(x, 0, z);
    wall.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotation);
    world.addBody(wall);
  });
}

function createDiceSet(specs) {
  if (!scene || !world) return;
  disposeDice();
  const flatSpecs = specs.flatMap(spec => Array.from({ length: spec.count }, () => spec.sides));
  const count = flatSpecs.length;
  const radius = count > 8 ? 1.18 : count > 5 ? 1.4 : count > 3 ? 1.65 : 2.05;
  const theme = getThemeColors();

  flatSpecs.forEach((sides, index) => {
    const geometry = createGeometry(sides, radius);
    const color = theme.face || (index % 2 ? theme.secondary : theme.primary);
    const material = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: .11,
      roughness: .42,
      metalness: .08,
      flatShading: true,
      transparent: theme.opacity < 1,
      opacity: theme.opacity
    });
    const mesh = new THREE.Mesh(geometry, material);
    addLinework(mesh, geometry, theme, radius);
    const faceLabels = addFaceNumbers(mesh, geometry, sides, radius);
    scene.add(mesh);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(radius * .82, 28),
      new THREE.MeshBasicMaterial({ color: theme.secondary, transparent: true, opacity: .22 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = .02;
    scene.add(shadow);

    const columns = Math.min(count, 5);
    const row = Math.floor(index / columns);
    const column = index % columns;
    const rowCount = Math.min(columns, count - row * columns);
    const x = (column - (rowCount - 1) / 2) * radius * 2.05;
    const z = (row - Math.floor((count - 1) / columns) / 2) * radius * 2.05;
    const body = new CANNON.Body({
      mass: 3,
      shape: new CANNON.Sphere(radius * .78),
      position: new CANNON.Vec3(x, radius + 1, z),
      linearDamping: .22,
      angularDamping: .25,
      sleepSpeedLimit: .22,
      sleepTimeLimit: .8
    });
    body.quaternion.setFromEuler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    body.addEventListener("collide", event => {
      const impact = event.contact?.getImpactVelocityAlongNormal?.() || body.velocity.length();
      playCollisionSound(impact);
    });
    world.addBody(body);
    diceObjects.push({ mesh, shadow, body, radius, sides, faceLabels, spinOffset: Math.random() * 100 });
  });
}

function getThemeColors() {
  const styles = getComputedStyle(document.documentElement);
  return {
    primary: styles.getPropertyValue("--blue").trim() || fallbackPalette[2],
    secondary: styles.getPropertyValue("--orange").trim() || fallbackPalette[0],
    face: styles.getPropertyValue("--dice-face").trim(),
    number: styles.getPropertyValue("--dice-number").trim() || "#fffbe8",
    outline: styles.getPropertyValue("--dice-outline").trim() || "#050505",
    opacity: Number(styles.getPropertyValue("--dice-opacity").trim()) || 1
  };
}

function addLinework(mesh, geometry, theme, radius) {
  const edgeGeometry = new THREE.EdgesGeometry(geometry, 10);
  const glow = new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({
    color: theme.secondary, transparent: true, opacity: .32
  }));
  glow.scale.setScalar(1.045);
  const core = new THREE.LineSegments(edgeGeometry.clone(), new THREE.LineBasicMaterial({
    color: 0x382f36, transparent: true, opacity: .88
  }));
  core.scale.setScalar(1.012);
  mesh.add(glow, core);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius * .58, radius * .018, 8, 48),
    new THREE.MeshBasicMaterial({ color: theme.secondary, transparent: true, opacity: .7 })
  );
  ring.rotation.x = Math.PI / 2;
  mesh.add(ring);
}

function addFaceNumbers(mesh, geometry, sides, radius) {
  const faces = collectFaces(geometry);
  const theme = getThemeColors();
  const labels = sides === 100
    ? ["00", "10", "20", "30", "40", "50", "60", "70", "80", "90"]
    : Array.from({ length: Math.min(sides, faces.length) }, (_, index) => String(index + 1));
  const faceLabels = [];
  faces.slice(0, labels.length).forEach((face, index) => {
    const faceNumber = createFaceNumber(labels[index], face, radius, theme);
    faceLabels.push({ label: labels[index], normal: face.normal.clone(), number: faceNumber });
    mesh.add(faceNumber);
  });
  return faceLabels;
}

function collectFaces(geometry) {
  const source = geometry.index ? geometry.toNonIndexed() : geometry;
  const positions = source.getAttribute("position");
  const faces = [];
  for (let index = 0; index < positions.count; index += 3) {
    const a = new THREE.Vector3().fromBufferAttribute(positions, index);
    const b = new THREE.Vector3().fromBufferAttribute(positions, index + 1);
    const c = new THREE.Vector3().fromBufferAttribute(positions, index + 2);
    const cross = new THREE.Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a));
    const area = cross.length() * .5;
    const normal = cross.normalize();
    const centroid = a.clone().add(b).add(c).divideScalar(3);
    if (normal.dot(centroid) < 0) normal.negate();
    const existing = faces.find(face => face.normal.dot(normal) > .995);
    if (existing) {
      existing.centroid.addScaledVector(centroid, area);
      existing.area += area;
    } else {
      faces.push({ normal, centroid: centroid.multiplyScalar(area), area });
    }
  }
  faces.forEach(face => face.centroid.divideScalar(face.area));
  if (source !== geometry) source.dispose();
  return faces;
}

function createFaceNumber(text, face, radius, theme = getThemeColors()) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `900 ${text.length > 1 ? 96 : 116}px Inter, Arial, sans-serif`;
  context.lineJoin = "round";
  context.miterLimit = 2;
  context.shadowColor = "rgba(0,0,0,.9)";
  context.shadowBlur = 9;
  context.strokeStyle = theme.outline;
  context.lineWidth = 22;
  context.strokeText(text, 128, 134);
  context.shadowColor = "rgba(255,247,176,.75)";
  context.shadowBlur = 18;
  context.strokeStyle = theme.outline;
  context.lineWidth = 8;
  context.strokeText(text, 128, 134);
  context.fillStyle = theme.number;
  context.fillText(text, 128, 134);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const size = Math.min(radius * .72, Math.sqrt(face.area) * .72);
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthTest: true,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  );
  label.position.copy(face.centroid).addScaledVector(face.normal, radius * .018);
  label.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), face.normal);
  label.renderOrder = 4;
  return label;
}

function createGeometry(sides, radius) {
  switch (sides) {
    case 4: return new THREE.TetrahedronGeometry(radius);
    case 6: return new THREE.BoxGeometry(radius * 1.55, radius * 1.55, radius * 1.55);
    case 8: return new THREE.OctahedronGeometry(radius);
    case 10: return createBipyramidGeometry(5, radius);
    case 12: return new THREE.DodecahedronGeometry(radius);
    case 100: return createBipyramidGeometry(5, radius);
    default: return new THREE.IcosahedronGeometry(radius);
  }
}

function createBipyramidGeometry(segments, radius) {
  const vertices = [0, radius * 1.18, 0, 0, -radius * 1.18, 0];
  const indices = [];
  for (let index = 0; index < segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    vertices.push(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
  }
  for (let index = 0; index < segments; index += 1) {
    const current = 2 + index;
    const next = 2 + ((index + 1) % segments);
    indices.push(0, current, next, 1, next, current);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function disposeDice() {
  diceObjects.forEach(({ mesh, shadow, body }) => {
    mesh.traverse(child => {
      child.geometry?.dispose?.();
      child.material?.map?.dispose?.();
      child.material?.dispose?.();
    });
    shadow.geometry.dispose();
    shadow.material.dispose();
    scene.remove(mesh, shadow);
    world.removeBody(body);
  });
  diceObjects = [];
}

function updatePointer(event) {
  const rect = canvasContainer.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function onInputStart(event) {
  if (!event.target.closest("canvas") || !diceObjects.length) return;
  event.preventDefault();
  updatePointer(event);
  isHolding = true;
  needsResultCheck = false;
  const specs = groupDiceObjects();
  pendingRoll = { specs, modifier: 0, label: specs.map(formatSpec).join(" + "), onComplete: null, startedAt: performance.now() };
  diceObjects.forEach(({ body }) => body.wakeUp());
}

function groupDiceObjects() {
  return allowedSides.map(sides => ({
    sides,
    count: diceObjects.filter(die => die.sides === sides).length
  })).filter(die => die.count);
}

function onInputMove(event) {
  if (!isHolding) return;
  event.preventDefault();
  updatePointer(event);
}

function onInputEnd() {
  if (!isHolding) return;
  isHolding = false;
  throwDice();
}

function throwDice() {
  playThrowSound();
  needsResultCheck = false;
  diceObjects.forEach(({ body }) => {
    body.wakeUp();
    body.velocity.set(-body.position.x * 1.3 + (Math.random() - .5) * 13, 10 + Math.random() * 7, -body.position.z * 1.3 + (Math.random() - .5) * 13);
    body.angularVelocity.set((Math.random() - .5) * 28, (Math.random() - .5) * 28, (Math.random() - .5) * 28);
  });
  window.setTimeout(() => { needsResultCheck = true; }, 650);
  clearTimeout(resultFallbackTimer);
  resultFallbackTimer = window.setTimeout(finishRoll, 4200);
}

function getAudioContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioContext) audioContext = new AudioCtx();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function playImpact({ frequency = 120, duration = .055, gain = .08, type = "triangle" } = {}) {
  const context = getAudioContext();
  if (!context) return;
  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const envelope = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, frequency * .45), context.currentTime + duration);
  filter.type = "lowpass";
  filter.frequency.value = 900;
  envelope.gain.setValueAtTime(gain, context.currentTime);
  envelope.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
  oscillator.connect(filter).connect(envelope).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
}

function playThrowSound() {
  playImpact({ frequency: 170 + Math.random() * 60, duration: .09, gain: .06, type: "sawtooth" });
}

function playCollisionSound(impact) {
  const now = performance.now();
  if (impact < 1.7 || now - lastCollisionSound < 38) return;
  lastCollisionSound = now;
  const clamped = Math.min(14, impact);
  playImpact({
    frequency: 90 + clamped * 18 + Math.random() * 25,
    duration: .035 + clamped * .003,
    gain: Math.min(.12, .025 + clamped * .006),
    type: "triangle"
  });
}

function finishRoll() {
  if (!pendingRoll || isHolding) return;
  const forced = performance.now() - Number(pendingRoll.startedAt || 0) > 12000;
  if (!forced && !diceAreSettled()) {
    clearTimeout(resultFallbackTimer);
    resultFallbackTimer = window.setTimeout(finishRoll, 260);
    return;
  }
  if (forced) freezeDice();
  syncDiceMeshes();
  const snapshot = getCurrentRollSnapshot();
  if (!snapshot) return;
  const { groupedResults, results, rawTotal, total, modifier, detail, modifierText } = snapshot;
  writeResult(total, `${pendingRoll.label || detail} · ${detail}${modifierText}`, false);
  uiResult?.classList.add("show");
  pendingRoll.onComplete?.({ results, groupedResults, rawTotal, total, modifier });
  pendingRoll = null;
  needsResultCheck = false;
  lastLiveTotal = total;
  clearTimeout(resultFallbackTimer);
}

function diceAreSettled() {
  return diceObjects.every(({ body }) => (
    body.sleepState === CANNON.Body.SLEEPING
    || (body.velocity.length() < .16 && body.angularVelocity.length() < .16 && body.position.y < 3.8)
  ));
}

function freezeDice() {
  diceObjects.forEach(({ body }) => {
    body.velocity.setZero();
    body.angularVelocity.setZero();
    body.sleep();
  });
}

function syncDiceMeshes() {
  diceObjects.forEach(({ mesh, body }) => {
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
  });
}

function getDisplayedFaceValue(die) {
  return getFaceValue(getDisplayedFace(die)?.label, die.sides);
}

function getFaceValue(label, sides) {
  if (!label) return Math.floor(Math.random() * sides) + 1;
  if (label === "00") return 100;
  return Number(label) || 1;
}

function getBestFace(die, direction) {
  if (!die.faceLabels?.length) return null;
  let bestFace = die.faceLabels[0];
  let bestScore = -Infinity;
  die.faceLabels.forEach(face => {
    const worldNormal = face.normal.clone().applyQuaternion(die.mesh.quaternion).normalize();
    const score = worldNormal.dot(direction);
    if (score > bestScore) {
      bestScore = score;
      bestFace = face;
    }
  });
  return { ...bestFace, score: bestScore };
}

function getDisplayedFace(die) {
  if (!camera || !die?.mesh) return getBestFace(die, new THREE.Vector3(0, 1, 0));
  const towardCamera = camera.position.clone().sub(die.mesh.position).normalize();
  return getBestFace(die, towardCamera);
}

function getCurrentRollSnapshot() {
  if (!pendingRoll) return null;
  const availableDice = [...diceObjects];
  const groupedResults = pendingRoll.specs.map(spec => {
    const results = [];
    for (let index = 0; index < spec.count; index += 1) {
      const dieIndex = availableDice.findIndex(die => die.sides === spec.sides);
      const [die] = dieIndex >= 0 ? availableDice.splice(dieIndex, 1) : [];
      results.push(die ? getDisplayedFaceValue(die) : Math.floor(Math.random() * spec.sides) + 1);
    }
    return { ...spec, results };
  });
  const results = groupedResults.flatMap(group => group.results);
  const rawTotal = results.reduce((sum, value) => sum + value, 0);
  const modifier = Number(pendingRoll.modifier || 0);
  const total = rawTotal + modifier;
  const detail = groupedResults.map(group => `d${group.sides} [${group.results.join(", ")}]`).join(" + ");
  const modifierText = modifier ? ` ${modifier > 0 ? "+" : "-"} ${Math.abs(modifier)}` : "";
  return { groupedResults, results, rawTotal, total, modifier, detail, modifierText };
}

function writeResult(total, detail, live = false) {
  if (uiTotal && uiTotal.textContent !== String(total)) {
    uiTotal.textContent = total;
    uiTotal.classList.remove("tick");
    void uiTotal.offsetWidth;
    uiTotal.classList.add("tick");
  }
  if (uiDetail) uiDetail.textContent = detail;
  if (uiRollText) uiRollText.textContent = live ? `Rolando... ${detail}` : `Resultado final: ${detail}`;
  uiResult?.classList.toggle("rolling", live);
}

function updateLiveResult(force = false) {
  if (!pendingRoll) return;
  const snapshot = getCurrentRollSnapshot();
  if (!snapshot) return;
  if (!force && snapshot.total === lastLiveTotal) return;
  lastLiveTotal = snapshot.total;
  writeResult(snapshot.total, `${pendingRoll.label || snapshot.detail} · ${snapshot.detail}${snapshot.modifierText}`, true);
}

function updateFaceHighlights() {
  const up = new THREE.Vector3(0, 1, 0);
  diceObjects.forEach(die => {
    const topFace = getBestFace(die, up);
    const frontFace = getDisplayedFace(die);
    die.faceLabels?.forEach(face => {
      const isTop = face.label === topFace?.label;
      const isFront = face.label === frontFace?.label;
      if (face.number?.material) {
        const targetOpacity = isTop || isFront ? 1 : .72;
        face.number.material.opacity += (targetOpacity - face.number.material.opacity) * .28;
      }
      if (face.number) {
        const targetScale = isFront ? 1.16 : isTop ? 1.08 : 1;
        face.number.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), .25);
      }
    });
  });
}

if (typeof window !== "undefined") {
  window.__diceRollerDebug = {
    getSnapshot: getCurrentRollSnapshot,
    getDice: () => diceObjects.map(die => ({
      sides: die.sides,
      displayed: getDisplayedFaceValue(die),
      displayedLabel: getDisplayedFace(die)?.label || "",
      top: getFaceValue(getBestFace(die, new THREE.Vector3(0, 1, 0))?.label, die.sides)
    }))
  };
}

function animate() {
  requestAnimationFrame(animate);
  if (isHolding) {
    raycaster.setFromCamera(mouse, camera);
    const target = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(dragPlane, target)) {
      const time = performance.now() * .01;
      diceObjects.forEach((object, index) => {
        object.body.position.x += (target.x + Math.sin(time + index) - object.body.position.x) * .22;
        object.body.position.y += (13 - object.body.position.y) * .22;
        object.body.position.z += (target.z + Math.cos(time + index * 2) - object.body.position.z) * .22;
        object.body.quaternion.setFromEuler(time * 1.7 + object.spinOffset, time * 2.4 + object.spinOffset, time * 1.3);
        object.body.velocity.setZero();
        object.body.angularVelocity.setZero();
      });
    }
  } else {
    world.step(1 / 60);
  }
  diceObjects.forEach(({ mesh, shadow, body }) => {
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
    shadow.position.x = body.position.x;
    shadow.position.z = body.position.z;
    const height = Math.max(0, body.position.y - 1);
    shadow.scale.setScalar(Math.max(.45, 1 - height * .04));
    shadow.material.opacity = Math.max(.04, .22 - height * .012);
  });
  updateFaceHighlights();
  if (pendingRoll && !isHolding) updateLiveResult();
  if (needsResultCheck && diceObjects.every(({ body }) => body.sleepState === CANNON.Body.SLEEPING)) finishRoll();
  renderer.render(scene, camera);
}

function onResize() {
  if (!canvasContainer || !renderer || !camera) return;
  const width = Math.max(1, canvasContainer.clientWidth);
  const height = Math.max(1, canvasContainer.clientHeight);
  const aspect = width / height;
  camera.left = (-FRUSTUM_SIZE * aspect) / 2;
  camera.right = (FRUSTUM_SIZE * aspect) / 2;
  camera.top = FRUSTUM_SIZE / 2;
  camera.bottom = -FRUSTUM_SIZE / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}
