import * as THREE from "https://esm.sh/three";
import * as CANNON from "https://esm.sh/cannon-es";

let scene, camera, renderer, world;
let diceObjects = [];
let isHolding = false;
let needsResultCheck = false;
let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
let canvasContainer = null;
let resultFallbackTimer = null;

const FRUSTUM_SIZE = 23;
let dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -15);

const uiResult = document.getElementById("result-board");
const uiTotal = document.getElementById("total-score");
const uiDetail = document.getElementById("detail-score");

const palette = [
  "#EAA14D", "#E05A47", "#4D9BEA", "#5FB376", 
  "#D869A8", "#F2C94C", "#9B51E0", "#FFFFFF" 
];

const commonColors = {
  outline: "#725349",
  shadow: "#F3BD2E"
};

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const D20_RAW_VERTICES = [
  [-1, GOLDEN_RATIO, 0], [1, GOLDEN_RATIO, 0], [-1, -GOLDEN_RATIO, 0], [1, -GOLDEN_RATIO, 0],
  [0, -1, GOLDEN_RATIO], [0, 1, GOLDEN_RATIO], [0, -1, -GOLDEN_RATIO], [0, 1, -GOLDEN_RATIO],
  [GOLDEN_RATIO, 0, -1], [GOLDEN_RATIO, 0, 1], [-GOLDEN_RATIO, 0, -1], [-GOLDEN_RATIO, 0, 1]
];
const D20_FACES = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
];
const D20_FACE_VALUES = [
  20, 2, 14, 8, 12,
  6, 16, 4, 18, 10,
  7, 15, 3, 19, 11,
  13, 5, 17, 1, 9
];
let d20FaceNormals = [];

export function initDiceRoller() {
  canvasContainer = document.querySelector('.dice-canvas-area');
  if (!canvasContainer) return; // Não inicializa se o container não existir

  scene = new THREE.Scene();
  scene.background = new THREE.Color("#F6F3EB");

  const containerWidth = canvasContainer.clientWidth;
  const containerHeight = canvasContainer.clientHeight;
  const aspect = containerWidth / containerHeight;
  
  camera = new THREE.OrthographicCamera(
    (FRUSTUM_SIZE * aspect) / -2,
    (FRUSTUM_SIZE * aspect) / 2,
    FRUSTUM_SIZE / 2,
    FRUSTUM_SIZE / -2,
    1,
    1000
  );
  
  camera.position.set(50, 50, 50); 
  camera.lookAt(0, 0, 0); 

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(containerWidth, containerHeight);
  renderer.domElement.style.touchAction = 'none'; 
  renderer.domElement.style.userSelect = 'none';
  renderer.domElement.style.display = 'block';
  canvasContainer.appendChild(renderer.domElement);

  world = new CANNON.World();
  world.gravity.set(0, -40, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 20;
  world.allowSleep = true; 

  const wallMat = new CANNON.Material();
  const diceMat = new CANNON.Material();
  world.addContactMaterial(
    new CANNON.ContactMaterial(wallMat, diceMat, {
      friction: 0.3,
      restitution: 0.6
    })
  );

  createPhysicsWalls(wallMat);
  updateDiceCount(3);

  // Usar ResizeObserver para monitorar mudanças no container
  const resizeObserver = new ResizeObserver(() => onWindowResize());
  resizeObserver.observe(canvasContainer);

  // Event listeners para canvas e window
  renderer.domElement.addEventListener("mousedown", onInputStart);
  window.addEventListener("mousemove", onInputMove);
  window.addEventListener("mouseup", onInputEnd);
  renderer.domElement.addEventListener("mouseleave", onInputEnd);
  renderer.domElement.addEventListener("touchstart", onInputStart, { passive: false });
  window.addEventListener("touchmove", onInputMove, { passive: false });
  window.addEventListener("touchend", onInputEnd);

  const countSelect = document.getElementById("diceCount");
  if(countSelect) {
      countSelect.addEventListener("change", (e) => {
        updateDiceCount(parseInt(e.target.value));
      });
  }

  animate();
}

function createPhysicsWalls(material) {
  const floorBody = new CANNON.Body({ mass: 0, material: material });
  floorBody.addShape(new CANNON.Plane());
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  world.addBody(floorBody);

  const wallDistance = 12;
  const createWall = (x, z, rot) => {
    const body = new CANNON.Body({ mass: 0, material: material });
    body.addShape(new CANNON.Plane());
    body.position.set(x, 0, z);
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rot);
    world.addBody(body);
  };
  createWall(wallDistance, 0, -Math.PI / 2);
  createWall(-wallDistance, 0, Math.PI / 2);
  createWall(0, -wallDistance, 0);
  createWall(0, wallDistance, Math.PI);
}

function createD20FaceTexture(number, colorHex) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, size, size);

  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "rgba(255,255,255,.28)");
  gradient.addColorStop(1, "rgba(0,0,0,.18)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(114,83,73,.65)";
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, size - 12, size - 12);

  ctx.fillStyle = colorHex === "#FFFFFF" ? "#331e18" : "#FFFFFF";
  ctx.font = "900 104px Inter, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(number), size / 2, size * 0.58);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createD20Geometry(radius) {
  const normalizedVertices = D20_RAW_VERTICES.map(([x, y, z]) => {
    const length = Math.hypot(x, y, z);
    return new THREE.Vector3(
      (x / length) * radius,
      (y / length) * radius,
      (z / length) * radius
    );
  });
  const positions = [];
  const uvs = [];

  d20FaceNormals = D20_FACES.map(face => {
    const [a, b, c] = face.map(index => normalizedVertices[index]);
    positions.push(
      a.x, a.y, a.z,
      b.x, b.y, b.z,
      c.x, c.y, c.z
    );
    uvs.push(.5, 1, 0, 0, 1, 0);
    return a.clone().add(b).add(c).normalize();
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  D20_FACES.forEach((_, index) => geometry.addGroup(index * 3, 3, index));

  return { geometry, normalizedVertices };
}

function updateDiceCount(count) {
  diceObjects.forEach((obj) => {
    scene.remove(obj.mesh);
    scene.remove(obj.outline);
    scene.remove(obj.shadow);
    world.removeBody(obj.body);
    if (obj.mesh.material) {
      obj.mesh.material.forEach((m) => {
        if (m.map) m.map.dispose();
        m.dispose();
      });
    }
  });
  diceObjects = [];
  if(uiResult) uiResult.classList.remove("show");

  const radius = 2.05;
  const { geometry, normalizedVertices } = createD20Geometry(radius);
  const outlineGeo = geometry.clone();
  const shadowGeo = new THREE.CircleGeometry(radius * 0.75, 32);
  const shape = new CANNON.ConvexPolyhedron({
    vertices: normalizedVertices.map(vertex => new CANNON.Vec3(vertex.x, vertex.y, vertex.z)),
    faces: D20_FACES.map(face => [...face])
  });
  
  const outlineMat = new THREE.MeshBasicMaterial({ color: commonColors.outline, side: THREE.BackSide });
  const shadowMat = new THREE.MeshBasicMaterial({ color: commonColors.shadow, transparent: true, opacity: 0.2 });

  for (let i = 0; i < count; i++) {
    const randomColor = palette[Math.floor(Math.random() * palette.length)];
    const diceMaterials = D20_FACE_VALUES.map(value => new THREE.MeshBasicMaterial({
      map: createD20FaceTexture(value, randomColor)
    }));
    const mesh = new THREE.Mesh(geometry, diceMaterials);
    scene.add(mesh);

    const outline = new THREE.Mesh(outlineGeo, outlineMat);
    outline.position.copy(mesh.position);
    outline.scale.setScalar(1.06);
    scene.add(outline);

    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.01;
    scene.add(shadow);

    const columns = Math.min(count, 5);
    const row = Math.floor(i / columns);
    const column = i % columns;
    const rowCount = Math.min(columns, count - row * columns);
    const startX = (column - (rowCount - 1) / 2) * 3.15;
    const startZ = (row - Math.floor((count - 1) / columns) / 2) * 3.15;
    const body = new CANNON.Body({
      mass: 5,
      shape: shape,
      position: new CANNON.Vec3(startX, radius + 1, startZ),
      sleepSpeedLimit: 0.5
    });
    body.quaternion.setFromEuler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    world.addBody(body);

    diceObjects.push({ mesh, outline, shadow, body, spinOffset: 0, isReturning: false });
  }
}

function updateMousePosition(e) {
  let x, y;
  if (e.changedTouches) {
    x = e.changedTouches[0].clientX;
    y = e.changedTouches[0].clientY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }
  
  // Calcular coordenadas relativas ao container
  if (canvasContainer) {
    const rect = canvasContainer.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;
    
    mouse.x = (relX / canvasContainer.clientWidth) * 2 - 1;
    mouse.y = -(relY / canvasContainer.clientHeight) * 2 + 1;
  }
}

function onInputStart(e) {
  if (
    e.target.tagName === "SELECT" ||
    e.target.tagName === "LABEL" ||
    e.target.closest(".dice-controls")
  )
    return;

  if(e.preventDefault) e.preventDefault();

  isHolding = true;
  needsResultCheck = false;
  if(uiResult) uiResult.classList.remove("show");
  updateMousePosition(e);

  diceObjects.forEach(obj => {
      obj.body.wakeUp(); 
      obj.spinOffset = Math.random() * 100; 
      obj.isReturning = false;
  });
}

function onInputMove(e) {
  if (!isHolding) return;
  if(e.preventDefault) e.preventDefault();
  updateMousePosition(e);
}

function onInputEnd(e) {
  if (!isHolding) return;
  isHolding = false;
  releaseDice();
}

function releaseDice() {
  const SAFE_LIMIT = 9;

  diceObjects.forEach((obj) => {
    const { body } = obj;
    
    const isOutside = 
      Math.abs(body.position.x) > SAFE_LIMIT || 
      Math.abs(body.position.z) > SAFE_LIMIT;

    if (isOutside) {
      obj.isReturning = true;
    } else {
      body.wakeUp();
      applyThrowForce(body);
    }
  });

  setTimeout(() => {
    needsResultCheck = true;
  }, 500);

  clearTimeout(resultFallbackTimer);
  resultFallbackTimer = setTimeout(() => {
    if (!isHolding && needsResultCheck) calculateResult();
  }, 4500);
}

function applyThrowForce(body) {
  const xDist = -body.position.x;
  const zDist = -body.position.z;
  
  body.velocity.set(
    xDist * 1.5 + (Math.random() - 0.5) * 15, 
    -15 - Math.random() * 10,
    zDist * 1.5 + (Math.random() - 0.5) * 15  
  );

  body.angularVelocity.set(
    (Math.random() - 0.5) * 35,
    (Math.random() - 0.5) * 35,
    (Math.random() - 0.5) * 35
  );
}

function calculateResult() {
  let total = 0;
  let details = [];

  diceObjects.forEach(({ mesh }) => {
    let maxDot = -Infinity;
    let resultValue = 1;

    d20FaceNormals.forEach((normal, index) => {
      const worldNormal = normal.clone().applyQuaternion(mesh.quaternion);
      if (worldNormal.y > maxDot) {
        maxDot = worldNormal.y;
        resultValue = D20_FACE_VALUES[index];
      }
    });

    total += resultValue;
    details.push(resultValue);
  });

  if(uiTotal) uiTotal.innerText = total;
  if(uiDetail) uiDetail.innerText = details.length > 1 ? `(${details.join(" + ")})` : "";
  if(uiResult) uiResult.classList.add("show");
  needsResultCheck = false;
  clearTimeout(resultFallbackTimer);
}

function animate() {
  requestAnimationFrame(animate);

  if (isHolding) {
    raycaster.setFromCamera(mouse, camera);
    const targetPoint = new THREE.Vector3();
    const intersect = raycaster.ray.intersectPlane(dragPlane, targetPoint);

    if (intersect) {
        const time = performance.now() * 0.01;

        diceObjects.forEach((obj, i) => {
            const offsetX = Math.sin(time + i) * 1.0; 
            const offsetZ = Math.cos(time + i * 2) * 1.0;

            obj.body.position.x += (targetPoint.x + offsetX - obj.body.position.x) * 0.25;
            obj.body.position.y += (15 - obj.body.position.y) * 0.25; 
            obj.body.position.z += (targetPoint.z + offsetZ - obj.body.position.z) * 0.25;

            obj.body.quaternion.setFromEuler(
                time * 2 + obj.spinOffset,
                time * 3 + obj.spinOffset,
                time * 1.5
            );

            obj.body.velocity.set(0, 0, 0);
            obj.body.angularVelocity.set(0, 0, 0);
            obj.isReturning = false;
        });
    }
  } else {
    const time = performance.now() * 0.01;
    
    diceObjects.forEach((obj) => {
      if (obj.isReturning) {
        obj.body.position.x += (0 - obj.body.position.x) * 0.15;
        obj.body.position.z += (0 - obj.body.position.z) * 0.15;
        obj.body.position.y += (12 - obj.body.position.y) * 0.1;

        obj.body.quaternion.setFromEuler(time * 5, time * 5, 0);

        obj.body.velocity.set(0, 0, 0);
        obj.body.angularVelocity.set(0, 0, 0);

        if (Math.abs(obj.body.position.x) < 9 && Math.abs(obj.body.position.z) < 9) {
          obj.isReturning = false;
          obj.body.wakeUp();
          applyThrowForce(obj.body);
        }
      }
    });

    world.step(1 / 60);
  }

  for (let i = 0; i < diceObjects.length; i++) {
    const { mesh, outline, shadow, body } = diceObjects[i];

    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);

    outline.position.copy(mesh.position);
    outline.quaternion.copy(mesh.quaternion);

    shadow.position.x = body.position.x;
    shadow.position.z = body.position.z;

    const height = Math.max(0, body.position.y - 1);
    const scale = Math.max(0.5, 1 - height * 0.04);
    const opacity = Math.max(0, 0.2 - height * 0.01);

    shadow.scale.setScalar(scale);
    shadow.material.opacity = opacity;
  }

  if (needsResultCheck) {
    let allStopped = true;
    for (let o of diceObjects) {
      if (o.isReturning) {
        allStopped = false;
        break;
      }
      if (
        o.body.velocity.lengthSquared() > 0.1 ||
        o.body.angularVelocity.lengthSquared() > 0.1
      ) {
        allStopped = false;
        break;
      }
    }
    if (allStopped) calculateResult();
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  if (!canvasContainer) return;
  
  const containerWidth = canvasContainer.clientWidth;
  const containerHeight = canvasContainer.clientHeight;
  const aspect = containerWidth / containerHeight;
  
  camera.left = (-FRUSTUM_SIZE * aspect) / 2;
  camera.right = (FRUSTUM_SIZE * aspect) / 2;
  camera.top = FRUSTUM_SIZE / 2;
  camera.bottom = -FRUSTUM_SIZE / 2;

  camera.updateProjectionMatrix();
  renderer.setSize(containerWidth, containerHeight);
}
