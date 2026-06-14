import * as THREE from "https://esm.sh/three";
import * as CANNON from "https://esm.sh/cannon-es";

const palette = [
  "#EAA14D", "#E05A47", "#4D9BEA", "#5FB376",
  "#D869A8", "#F2C94C", "#9B51E0", "#F8FAFC"
];

let scene;
let camera;
let renderer;
let world;
let canvasContainer;
let diceObjects = [];
let selectedSides = 20;
let isHolding = false;
let needsResultCheck = false;
let pendingRoll = null;
let resultFallbackTimer = null;
let resizeObserver;

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -14);
const FRUSTUM_SIZE = 24;

const uiResult = document.getElementById("result-board");
const uiTotal = document.getElementById("total-score");
const uiDetail = document.getElementById("detail-score");
const uiBadge = document.getElementById("diceTypeBadge");

export function initDiceRoller() {
  canvasContainer = document.querySelector(".dice-canvas-area");
  if (!canvasContainer) return;

  scene = new THREE.Scene();
  scene.background = new THREE.Color("#F6F3EB");

  camera = new THREE.OrthographicCamera();
  camera.position.set(42, 42, 42);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.touchAction = "none";
  renderer.domElement.style.userSelect = "none";
  canvasContainer.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x777777, 2.3));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2);
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

  resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(canvasContainer);

  renderer.domElement.addEventListener("pointerdown", onInputStart);
  window.addEventListener("pointermove", onInputMove);
  window.addEventListener("pointerup", onInputEnd);

  document.getElementById("diceCount")?.addEventListener("change", event => {
    createDiceSet(selectedSides, Number(event.target.value) || 1);
  });

  document.querySelectorAll("[data-die]").forEach(button => {
    button.addEventListener("click", () => {
      const sides = Number(button.dataset.die);
      rollDice({
        sides,
        count: getSelectedCount(),
        label: `Rolagem de d${sides}`
      });
    });
  });

  createDiceSet(selectedSides, getSelectedCount());
  onResize();
  animate();
}

export function setDiceType(sides) {
  selectedSides = normalizeSides(sides);
  if (uiBadge) uiBadge.textContent = `D${selectedSides}`;
  document.querySelectorAll("[data-die]").forEach(button => {
    button.classList.toggle("active", Number(button.dataset.die) === selectedSides);
  });
}

export function rollDice({
  sides = selectedSides,
  count = 1,
  modifier = 0,
  label = "",
  onComplete = null
} = {}) {
  if (!world || !scene) return;

  setDiceType(sides);
  const countSelect = document.getElementById("diceCount");
  if (countSelect && [...countSelect.options].some(option => Number(option.value) === count)) {
    countSelect.value = String(count);
  }

  createDiceSet(selectedSides, count);
  pendingRoll = { sides: selectedSides, count, modifier, label, onComplete };
  throwDice();
}

function normalizeSides(sides) {
  const available = [4, 6, 8, 10, 12, 20, 100];
  return available.includes(Number(sides)) ? Number(sides) : 20;
}

function getSelectedCount() {
  return Number(document.getElementById("diceCount")?.value) || 1;
}

function createPhysicsBounds(material) {
  const floor = new CANNON.Body({ mass: 0, material });
  floor.addShape(new CANNON.Plane());
  floor.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  world.addBody(floor);

  const distance = 12;
  const walls = [
    [distance, 0, -Math.PI / 2],
    [-distance, 0, Math.PI / 2],
    [0, -distance, 0],
    [0, distance, Math.PI]
  ];
  walls.forEach(([x, z, rotation]) => {
    const wall = new CANNON.Body({ mass: 0, material });
    wall.addShape(new CANNON.Plane());
    wall.position.set(x, 0, z);
    wall.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotation);
    world.addBody(wall);
  });
}

function createDiceSet(sides, count) {
  disposeDice();
  const radius = count > 6 ? 1.35 : count > 3 ? 1.65 : 2.05;

  for (let index = 0; index < count; index += 1) {
    const geometry = createGeometry(sides, radius);
    const color = palette[index % palette.length];
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: .55,
      metalness: .05,
      flatShading: true
    });
    const mesh = new THREE.Mesh(geometry, material);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry, 12),
      new THREE.LineBasicMaterial({ color: 0x725349, transparent: true, opacity: .85 })
    );
    mesh.add(edges);
    mesh.add(createLabelSprite(`d${sides}`, color === "#F8FAFC" ? "#331e18" : "#ffffff", radius));
    scene.add(mesh);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(radius * .78, 28),
      new THREE.MeshBasicMaterial({ color: 0xf3bd2e, transparent: true, opacity: .2 })
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
    world.addBody(body);

    diceObjects.push({
      mesh,
      shadow,
      body,
      radius,
      spinOffset: Math.random() * 100
    });
  }
}

function createGeometry(sides, radius) {
  switch (sides) {
    case 4:
      return new THREE.TetrahedronGeometry(radius);
    case 6:
      return new THREE.BoxGeometry(radius * 1.55, radius * 1.55, radius * 1.55);
    case 8:
      return new THREE.OctahedronGeometry(radius);
    case 10:
      return createBipyramidGeometry(5, radius);
    case 12:
      return new THREE.DodecahedronGeometry(radius);
    case 100:
      return createBipyramidGeometry(10, radius);
    case 20:
    default:
      return new THREE.IcosahedronGeometry(radius);
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

function createLabelSprite(text, color, radius) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  context.fillStyle = "rgba(68,68,68,.78)";
  context.beginPath();
  context.roundRect(20, 24, 216, 80, 22);
  context.fill();
  context.fillStyle = color;
  context.font = "900 52px Inter, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, 128, 66);

  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(canvas),
    transparent: true,
    depthTest: false
  }));
  sprite.scale.set(radius * 1.25, radius * .62, 1);
  sprite.position.set(0, radius * .72, 0);
  sprite.renderOrder = 4;
  return sprite;
}

function disposeDice() {
  diceObjects.forEach(({ mesh, shadow, body }) => {
    mesh.traverse(child => {
      child.geometry?.dispose?.();
      if (child.material?.map) child.material.map.dispose();
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
  if (!event.target.closest("canvas")) return;
  event.preventDefault();
  updatePointer(event);
  isHolding = true;
  needsResultCheck = false;
  pendingRoll = {
    sides: selectedSides,
    count: diceObjects.length,
    modifier: 0,
    label: `Rolagem de d${selectedSides}`,
    onComplete: null
  };
  diceObjects.forEach(({ body }) => body.wakeUp());
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
  needsResultCheck = false;
  diceObjects.forEach(({ body }) => {
    body.wakeUp();
    body.velocity.set(
      -body.position.x * 1.3 + (Math.random() - .5) * 13,
      10 + Math.random() * 7,
      -body.position.z * 1.3 + (Math.random() - .5) * 13
    );
    body.angularVelocity.set(
      (Math.random() - .5) * 28,
      (Math.random() - .5) * 28,
      (Math.random() - .5) * 28
    );
  });

  window.setTimeout(() => {
    needsResultCheck = true;
  }, 650);
  clearTimeout(resultFallbackTimer);
  resultFallbackTimer = window.setTimeout(finishRoll, 4200);
}

function finishRoll() {
  if (!pendingRoll || isHolding) return;

  const results = Array.from({ length: pendingRoll.count }, () => {
    return Math.floor(Math.random() * pendingRoll.sides) + 1;
  });
  const rawTotal = results.reduce((sum, value) => sum + value, 0);
  const total = rawTotal + Number(pendingRoll.modifier || 0);
  const modifierText = pendingRoll.modifier
    ? ` ${pendingRoll.modifier > 0 ? "+" : "-"} ${Math.abs(pendingRoll.modifier)}`
    : "";

  if (uiTotal) uiTotal.textContent = total;
  if (uiDetail) {
    uiDetail.textContent = `${pendingRoll.label || `d${pendingRoll.sides}`} · [${results.join(" + ")}]${modifierText}`;
  }
  uiResult?.classList.add("show");
  pendingRoll.onComplete?.({ results, rawTotal, total, modifier: pendingRoll.modifier });
  pendingRoll = null;
  needsResultCheck = false;
  clearTimeout(resultFallbackTimer);
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
        object.body.quaternion.setFromEuler(
          time * 1.7 + object.spinOffset,
          time * 2.4 + object.spinOffset,
          time * 1.3
        );
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

  if (needsResultCheck && diceObjects.every(({ body }) => body.sleepState === CANNON.Body.SLEEPING)) {
    finishRoll();
  }

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
