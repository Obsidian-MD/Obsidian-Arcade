import * as THREE from "./lib/three/three.module.js";
import { registerGame } from "../arcade.js";

export const SNAKE2_HTML = String.raw`
<style>
  *{
    box-sizing:border-box;
    -webkit-tap-highlight-color:transparent;
    user-select:none;
  }

  html,body{
    margin:0;
    padding:0;
    width:100%;
    height:100%;
    overflow:hidden;
    background:#020308;
    font-family:Arial,Helvetica,sans-serif;
  }

  #snakeGame2{
    position:relative;
    width:100%;
    height:100%;
    min-height:100%;
    overflow:hidden;
    background:#020308;
    touch-action:none;
  }

  #snakeCanvas2{
    position:absolute;
    inset:0;
    width:100%;
    height:100%;
    display:block;
    touch-action:none;
  }

  .snakeHud2{
    position:absolute;
    top:10px;
    left:10px;
    right:10px;
    z-index:20;
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:8px;
    pointer-events:none;
  }

  .snakeStats2{
    display:flex;
    flex-wrap:wrap;
    gap:6px;
    max-width:calc(100% - 65px);
  }

  .snakeStat2{
    padding:7px 9px;
    border-radius:10px;
    background:rgba(4,7,15,.78);
    border:1px solid rgba(255,255,255,.12);
    color:#fff;
    font-size:11px;
    font-weight:700;
    backdrop-filter:blur(8px);
    box-shadow:0 4px 18px rgba(0,0,0,.3);
  }

  .snakeStat2 b{
    color:#67e8f9;
    margin-left:3px;
  }

  .snakeActions2{
    display:flex;
    gap:6px;
    pointer-events:auto;
  }

  .snakeBtn2{
    width:43px;
    height:43px;
    border:1px solid rgba(255,255,255,.16);
    border-radius:12px;
    background:rgba(5,8,17,.84);
    color:#fff;
    font-size:18px;
    display:flex;
    align-items:center;
    justify-content:center;
    box-shadow:0 5px 18px rgba(0,0,0,.35);
  }

  .snakeBtn2:active{
    transform:scale(.94);
    background:rgba(30,40,65,.95);
  }

  .snakeMinimap2{
    position:absolute;
    top:68px;
    right:10px;
    z-index:18;
    width:118px;
    padding:6px;
    border-radius:12px;
    background:rgba(3,6,13,.82);
    border:1px solid rgba(255,255,255,.13);
    backdrop-filter:blur(8px);
    box-shadow:0 6px 24px rgba(0,0,0,.4);
    pointer-events:none;
  }

  .snakeMinimapTitle2{
    text-align:center;
    color:#dbeafe;
    font-size:8px;
    font-weight:900;
    letter-spacing:1.3px;
    margin-bottom:4px;
  }

  #snakeMinimapCanvas2{
    width:106px;
    height:106px;
    display:block;
    border-radius:8px;
    background:#050913;
  }

  .snakeLegend2{
    display:flex;
    flex-wrap:wrap;
    justify-content:center;
    gap:2px 5px;
    margin-top:4px;
    color:#cbd5e1;
    font-size:6px;
    font-weight:700;
  }

  .legendItem2{
    display:flex;
    align-items:center;
    gap:2px;
  }

  .legendDot2{
    width:5px;
    height:5px;
    border-radius:50%;
  }

  .snakeRanking2{
    position:absolute;
    left:10px;
    bottom:10px;
    z-index:18;
    width:165px;
    max-width:calc(100% - 20px);
    padding:9px;
    border-radius:13px;
    background:rgba(3,6,13,.78);
    border:1px solid rgba(255,255,255,.11);
    backdrop-filter:blur(8px);
    color:#fff;
    pointer-events:none;
  }

  .rankingTitle2{
    font-size:9px;
    font-weight:900;
    letter-spacing:1px;
    color:#94a3b8;
    margin-bottom:5px;
  }

  .rankingRow2{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:8px;
    font-size:9px;
    padding:2px 0;
  }

  .rankingName2{
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }

  .rankingScore2{
    color:#67e8f9;
    font-weight:900;
  }

  .snakeBoost2{
    position:absolute;
    left:50%;
    top:68px;
    transform:translateX(-50%);
    z-index:19;
    padding:7px 12px;
    border-radius:999px;
    background:rgba(255,140,0,.18);
    border:1px solid rgba(255,190,60,.4);
    color:#ffe7a3;
    font-size:10px;
    font-weight:900;
    letter-spacing:.5px;
    opacity:0;
    transition:opacity .18s ease;
    pointer-events:none;
  }

  .snakeBoost2.show{
    opacity:1;
  }

  .snakeOverlay2{
    position:absolute;
    inset:0;
    z-index:50;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    background:rgba(0,0,0,.72);
    backdrop-filter:blur(7px);
  }

  .snakeOverlay2.hidden{
    display:none;
  }

  .snakePanel2{
    width:min(390px,92vw);
    padding:25px 20px;
    border-radius:22px;
    text-align:center;
    background:linear-gradient(145deg,rgba(9,15,28,.97),rgba(2,5,12,.97));
    border:1px solid rgba(103,232,249,.22);
    box-shadow:0 20px 70px rgba(0,0,0,.65);
    color:#fff;
  }

  .snakeLogo2{
    font-size:48px;
    margin-bottom:7px;
  }

  .snakePanel2 h1{
    margin:0 0 8px;
    font-size:25px;
  }

  .snakePanel2 p{
    margin:7px 0;
    color:#94a3b8;
    font-size:12px;
    line-height:1.55;
  }

  .snakeStart2{
    margin-top:16px;
    width:100%;
    min-height:48px;
    border:0;
    border-radius:13px;
    background:linear-gradient(135deg,#06b6d4,#2563eb);
    color:#fff;
    font-size:14px;
    font-weight:900;
    box-shadow:0 7px 25px rgba(37,99,235,.32);
  }

  .snakeStart2:active{
    transform:scale(.98);
  }

  .gameOverScore2{
    font-size:34px;
    font-weight:900;
    color:#67e8f9;
    margin:12px 0;
  }

  .snakeHint2{
    position:absolute;
    left:50%;
    bottom:14px;
    transform:translateX(-50%);
    z-index:15;
    padding:6px 10px;
    border-radius:999px;
    color:rgba(255,255,255,.48);
    background:rgba(0,0,0,.25);
    font-size:8px;
    pointer-events:none;
    white-space:nowrap;
  }

  @media(max-width:520px){
    .snakeMinimap2{
      width:100px;
    }

    #snakeMinimapCanvas2{
      width:88px;
      height:88px;
    }

    .snakeStats2{
      max-width:calc(100% - 60px);
    }

    .snakeStat2{
      font-size:9px;
      padding:6px 7px;
    }

    .snakeRanking2{
      width:145px;
    }
  }
</style>

<div id="snakeGame2">

  <canvas id="snakeCanvas2"></canvas>

  <div class="snakeHud2">
    <div class="snakeStats2">
      <div class="snakeStat2">Tamanho <b id="snakeSize2">7</b></div>
      <div class="snakeStat2">Comida <b id="snakeFood2">0</b></div>
      <div class="snakeStat2">Inimigos <b id="snakeEnemies2">5</b></div>
    </div>

    <div class="snakeActions2">
      <button class="snakeBtn2" id="snakePause2" type="button">Ⅱ</button>
    </div>
  </div>

  <div class="snakeBoost2" id="snakeBoost2">⚡ TURBO</div>

  <div class="snakeMinimap2">
    <div class="snakeMinimapTitle2">MAPA</div>
    <canvas id="snakeMinimapCanvas2" width="200" height="200"></canvas>
    <div class="snakeLegend2">
      <span class="legendItem2"><i class="legendDot2" style="background:#ff4d4d"></i>Comum</span>
      <span class="legendItem2"><i class="legendDot2" style="background:#42d9ff"></i>Rara</span>
      <span class="legendItem2"><i class="legendDot2" style="background:#ffd42a"></i>Turbo</span>
      <span class="legendItem2"><i class="legendDot2" style="background:#ff6420"></i>Especial</span>
      <span class="legendItem2"><i class="legendDot2" style="background:#ff55ff"></i>Lendária</span>
    </div>
  </div>

  <div class="snakeRanking2">
    <div class="rankingTitle2">RANKING</div>
    <div id="snakeRankingList2"></div>
  </div>

  <div class="snakeHint2">Arraste para virar • Pinça para aproximar/afastar</div>

  <div class="snakeOverlay2" id="snakeStartOverlay2">
    <div class="snakePanel2">
      <div class="snakeLogo2">🐍</div>
      <h1>Snake 3D 2.0</h1>
      <p>Agora sua cobra é lisa de verdade e engorda conforme cresce. Qualquer batida entre cobras é fatal para as duas — e quem morre vira uma nuvem de restos que dá pra comer.</p>
      <p>Arraste o dedo na direção desejada para virar.</p>
      <button class="snakeStart2" id="snakeStart2" type="button">COMEÇAR</button>
    </div>
  </div>

  <div class="snakeOverlay2 hidden" id="snakeGameOver2">
    <div class="snakePanel2">
      <div class="snakeLogo2">💀</div>
      <h1>Fim de jogo</h1>
      <div class="gameOverScore2" id="snakeFinalScore2">0</div>
      <p id="snakeFinalText2">Sua cobra foi eliminada.</p>
      <button class="snakeStart2" id="snakeRestart2" type="button">JOGAR NOVAMENTE</button>
    </div>
  </div>

</div>
`;

registerGame({
  id: "snake2",
  name: "Snake 3D 2.0",
  category: "Arcade",
  icon: "🐍",

  init({ container }) {
    container.innerHTML = SNAKE2_HTML;

    const canvas = container.querySelector("#snakeCanvas2");
    const minimapCanvas = container.querySelector("#snakeMinimapCanvas2");
    const minimapCtx = minimapCanvas.getContext("2d");

    const sizeEl = container.querySelector("#snakeSize2");
    const foodEl = container.querySelector("#snakeFood2");
    const enemiesEl = container.querySelector("#snakeEnemies2");
    const rankingEl = container.querySelector("#snakeRankingList2");
    const boostEl = container.querySelector("#snakeBoost2");
    const startOverlay = container.querySelector("#snakeStartOverlay2");
    const gameOverOverlay = container.querySelector("#snakeGameOver2");
    const startButton = container.querySelector("#snakeStart2");
    const restartButton = container.querySelector("#snakeRestart2");
    const pauseButton = container.querySelector("#snakePause2");
    const finalScoreEl = container.querySelector("#snakeFinalScore2");
    const finalTextEl = container.querySelector("#snakeFinalText2");

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setSize(canvas.clientWidth || window.innerWidth, canvas.clientHeight || window.innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02050b);

    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 3000);
    camera.position.set(0, 44, 0.01);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0x9ddcff, 0x07101d, 1.7));

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.1);
    directionalLight.position.set(30, 70, 20);
    scene.add(directionalLight);

    const fillLight = new THREE.PointLight(0x2f8cff, 2.5, 180);
    fillLight.position.set(0, 20, 0);
    scene.add(fillLight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(10000, 10000),
      new THREE.MeshStandardMaterial({ color: 0x05080d, roughness: 1, metalness: 0 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.35;
    scene.add(ground);

    const worldGlow = new THREE.Mesh(
      new THREE.CircleGeometry(1500, 96),
      new THREE.MeshBasicMaterial({ color: 0x07111f, transparent: true, opacity: 0.5 })
    );
    worldGlow.rotation.x = -Math.PI / 2;
    worldGlow.position.y = -0.3;
    scene.add(worldGlow);

    const FOOD_TYPES = [
      { id: "common", name: "Comum", color: 0xff4d4d, glow: 0xff1e1e, value: 1, growth: 1, speed: 1, duration: 0, size: 0.48, weight: 48 },
      { id: "rare", name: "Rara", color: 0x42d9ff, glow: 0x008cff, value: 3, growth: 2, speed: 1, duration: 0, size: 0.56, weight: 25 },
      { id: "turbo", name: "Turbo", color: 0xffd42a, glow: 0xff8a00, value: 2, growth: 1, speed: 1.42, duration: 5, size: 0.53, weight: 14 },
      { id: "special", name: "Especial", color: 0xff6420, glow: 0xff1600, value: 5, growth: 3, speed: 1.16, duration: 4, size: 0.62, weight: 9 },
      { id: "legendary", name: "Lendária", color: 0xff55ff, glow: 0xff00ff, value: 10, growth: 5, speed: 1.25, duration: 6, size: 0.74, weight: 4 },
    ];

    const PLAYER_SPEED = 8.4;
    const ENEMY_SPEED = 6.3;
    const MAX_FOOD = 32;
    const ENEMY_COUNT = 5;
    const MINIMAP_RANGE = 85;
    const SEGMENT_SPACING = 1.18;
    const RADIAL_SEGMENTS = 12;
    const RADIUS_GROWTH_PER_SEGMENT = 0.018;
    const PLAYER_BASE_RADIUS = 0.55;
    const PLAYER_MAX_RADIUS = 1.3;
    const ENEMY_BASE_RADIUS = 0.5;
    const ENEMY_MAX_RADIUS = 1.05;
    const INITIAL_LENGTH = 7;

    let running = false;
    let paused = false;
    let destroyed = false;
    let animationId = null;
    let lastTime = performance.now();
    let cameraDistance = 44;
    let playerBoostUntil = 0;
    let playerSpeedMultiplier = 1;
    let foodCollected = 0;
    let score = 0;
    let swiping = false;
    let pinchActive = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let pinchStartDistance = 0;
    let pinchStartCameraDistance = cameraDistance;

    const desiredDirection = new THREE.Vector3(1, 0, 0);

    const player = {
      spine: [],
      direction: new THREE.Vector3(1, 0, 0),
      radius: PLAYER_BASE_RADIUS,
      growthQueue: 0,
      bodyMesh: null,
    };

    const foods = [];
    const enemies = [];
    const deathClouds = [];

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function distance2D(a, b) {
      const dx = a.x - b.x;
      const dz = a.z - b.z;
      return Math.sqrt(dx * dx + dz * dz);
    }

    function circlesOverlap(a, b, ra, rb) {
      const dx = a.x - b.x;
      const dz = a.z - b.z;
      const minDist = ra + rb;
      return dx * dx + dz * dz < minDist * minDist;
    }

    function computeRadius(length, base, max) {
      return Math.min(max, base + Math.max(0, length - INITIAL_LENGTH) * RADIUS_GROWTH_PER_SEGMENT);
    }

    function weightedFoodType() {
      const total = FOOD_TYPES.reduce((sum, item) => sum + item.weight, 0);
      let value = Math.random() * total;
      for (const type of FOOD_TYPES) {
        value -= type.weight;
        if (value <= 0) return type;
      }
      return FOOD_TYPES[0];
    }

    function createFoodAt(x, z, forcedType) {
      const type = forcedType || weightedFoodType();
      const geometry = new THREE.IcosahedronGeometry(type.size, 1);
      const material = new THREE.MeshStandardMaterial({
        color: type.color,
        emissive: type.glow,
        emissiveIntensity: 1.7,
        roughness: 0.3,
        metalness: 0.25,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, 0.4, z);
      mesh.userData.foodType = type;
      mesh.userData.phase = Math.random() * Math.PI * 2;
      mesh.userData.baseY = 0.4;
      scene.add(mesh);
      foods.push(mesh);
      return mesh;
    }

    function createFood() {
      const angle = Math.random() * Math.PI * 2;
      const radius = random(7, 105);
      const origin = player.spine[0] || { x: 0, z: 0 };
      return createFoodAt(origin.x + Math.cos(angle) * radius, origin.z + Math.sin(angle) * radius);
    }

    function ensureFoodCount() {
      while (foods.length < MAX_FOOD) createFood();
    }

    function disposeFood(food) {
      if (!food) return;
      scene.remove(food);
      food.geometry.dispose();
      food.material.dispose();
    }

    function respawnFood(food) {
      const index = foods.indexOf(food);
      if (index !== -1) {
        disposeFood(food);
        foods.splice(index, 1);
      }
      createFood();
    }

    // Constrói um tubo liso e fluido ao longo da coluna da cobra (via curva
    // Catmull-Rom, reamostrada em mais pontos que os "vértebras" reais para
    // não ficar facetado), com cauda afinando e tampas nas duas pontas.
    // colorFn recebe t em [0,1] (0 = cabeça, 1 = cauda).
    function buildSnakeGeometry(spine, radius, colorFn) {
      const count = spine.length;
      if (count < 2) return null;

      const curve = new THREE.CatmullRomCurve3(spine, false, "catmullrom", 0.5);
      const divisions = Math.max(count * 3, 18);
      const points = curve.getPoints(divisions);
      const total = points.length;

      const tailTaperFraction = Math.min(4, count - 1) / Math.max(count - 1, 1);

      function radiusAt(t) {
        if (t < 0.035) return radius * 1.05;
        if (t > 1 - tailTaperFraction) {
          const localT = (1 - t) / tailTaperFraction;
          return radius * (0.16 + 0.84 * localT);
        }
        return radius;
      }

      const up = new THREE.Vector3(0, 1, 0);
      const positions = [];
      const normals = [];
      const colors = [];
      const indices = [];

      for (let i = 0; i < total; i++) {
        const point = points[i];
        const prev = points[Math.max(0, i - 1)];
        const next = points[Math.min(total - 1, i + 1)];
        const tangent = new THREE.Vector3(next.x - prev.x, 0, next.z - prev.z);
        if (tangent.lengthSq() < 0.0001) tangent.set(1, 0, 0);
        tangent.normalize();

        let normal = new THREE.Vector3().crossVectors(up, tangent);
        if (normal.lengthSq() < 0.0001) normal.set(1, 0, 0);
        else normal.normalize();
        const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

        const t = i / (total - 1);
        const r = radiusAt(t);
        const color = colorFn ? colorFn(t) : null;

        for (let j = 0; j < RADIAL_SEGMENTS; j++) {
          const angle = (j / RADIAL_SEGMENTS) * Math.PI * 2;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const nx = normal.x * cos + binormal.x * sin;
          const ny = normal.y * cos + binormal.y * sin;
          const nz = normal.z * cos + binormal.z * sin;

          positions.push(point.x + nx * r, (point.y || 0.5) + ny * r, point.z + nz * r);
          normals.push(nx, ny, nz);
          if (color) colors.push(color.r, color.g, color.b);
        }
      }

      for (let i = 0; i < total - 1; i++) {
        for (let j = 0; j < RADIAL_SEGMENTS; j++) {
          const a = i * RADIAL_SEGMENTS + j;
          const b = i * RADIAL_SEGMENTS + ((j + 1) % RADIAL_SEGMENTS);
          const c = (i + 1) * RADIAL_SEGMENTS + j;
          const d = (i + 1) * RADIAL_SEGMENTS + ((j + 1) % RADIAL_SEGMENTS);
          indices.push(a, c, b, b, c, d);
        }
      }

      // tampa da cabeça (t=0) — fica coberta pela cabeça/olhos extra
      const frontColor = colorFn ? colorFn(0) : null;
      const frontTangent = new THREE.Vector3(points[1].x - points[0].x, 0, points[1].z - points[0].z).normalize();
      const frontCenterIndex = positions.length / 3;
      positions.push(points[0].x, points[0].y || 0.5, points[0].z);
      normals.push(-frontTangent.x, -frontTangent.y, -frontTangent.z);
      if (frontColor) colors.push(frontColor.r, frontColor.g, frontColor.b);
      for (let j = 0; j < RADIAL_SEGMENTS; j++) {
        const a = j;
        const b = (j + 1) % RADIAL_SEGMENTS;
        indices.push(frontCenterIndex, b, a);
      }

      // tampa da cauda (t=1)
      const backColor = colorFn ? colorFn(1) : null;
      const backTangent = new THREE.Vector3(
        points[total - 1].x - points[total - 2].x,
        0,
        points[total - 1].z - points[total - 2].z
      ).normalize();
      const backRingStart = (total - 1) * RADIAL_SEGMENTS;
      const backCenterIndex = positions.length / 3;
      positions.push(points[total - 1].x, points[total - 1].y || 0.5, points[total - 1].z);
      normals.push(backTangent.x, backTangent.y, backTangent.z);
      if (backColor) colors.push(backColor.r, backColor.g, backColor.b);
      for (let j = 0; j < RADIAL_SEGMENTS; j++) {
        const a = backRingStart + j;
        const b = backRingStart + ((j + 1) % RADIAL_SEGMENTS);
        indices.push(backCenterIndex, a, b);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
      if (colors.length) geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      geometry.setIndex(indices);
      return geometry;
    }

    function createBodyMaterial() {
      return new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.35,
        metalness: 0.15,
        side: THREE.DoubleSide,
      });
    }

    function updateSnakeBody(snake, colorFn) {
      const geometry = buildSnakeGeometry(snake.spine, snake.radius, colorFn);
      if (!geometry) return;
      if (snake.bodyMesh.geometry) snake.bodyMesh.geometry.dispose();
      snake.bodyMesh.geometry = geometry;
    }

    function playerColorAt(t) {
      const color = new THREE.Color();
      color.setHSL((0.48 + t * 0.34) % 1, 0.9, 0.52);
      return color;
    }

    // Cabeça e olhos são meshes à parte que seguem a ponta da cobra —
    // sem eles o tubo sozinho fica sem "cara" e difícil de orientar.
    const headGeometry = new THREE.SphereGeometry(1, 14, 10);
    const eyeGeometry = new THREE.SphereGeometry(1, 8, 6);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x0a0a10, roughness: 0.35, metalness: 0.1 });

    function createSnakeHead(color) {
      const headMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.32, metalness: 0.18 });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      scene.add(head, leftEye, rightEye);
      return { head, leftEye, rightEye };
    }

    function updateSnakeHead(headParts, headPoint, direction, radius) {
      const headRadius = radius * 1.05;
      headParts.head.position.set(headPoint.x, headPoint.y || 0.5, headPoint.z);
      headParts.head.scale.setScalar(headRadius);

      const up = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(direction, up).normalize();
      const eyeRadius = Math.max(0.05, radius * 0.17);
      const base = new THREE.Vector3(headPoint.x, (headPoint.y || 0.5) + radius * 0.32, headPoint.z).addScaledVector(
        direction,
        radius * 0.64
      );

      headParts.leftEye.position.copy(base).addScaledVector(right, radius * 0.48);
      headParts.rightEye.position.copy(base).addScaledVector(right, -radius * 0.48);
      headParts.leftEye.scale.setScalar(eyeRadius);
      headParts.rightEye.scale.setScalar(eyeRadius);
    }

    function setSnakeHeadVisible(headParts, visible) {
      headParts.head.visible = visible;
      headParts.leftEye.visible = visible;
      headParts.rightEye.visible = visible;
    }

    function disposeSnakeHead(headParts) {
      scene.remove(headParts.head, headParts.leftEye, headParts.rightEye);
      headParts.head.material.dispose();
    }

    function makeSpine(originX, originZ, direction, length) {
      const spine = [];
      for (let i = 0; i < length; i++) {
        spine.push(new THREE.Vector3(originX - direction.x * i * SEGMENT_SPACING, 0.5, originZ - direction.z * i * SEGMENT_SPACING));
      }
      return spine;
    }

    function createPlayer() {
      if (player.bodyMesh) {
        scene.remove(player.bodyMesh);
        if (player.bodyMesh.geometry) player.bodyMesh.geometry.dispose();
        player.bodyMesh.material.dispose();
      }

      player.direction.set(1, 0, 0);
      desiredDirection.set(1, 0, 0);
      player.growthQueue = 0;
      player.spine = makeSpine(0, 0, player.direction, INITIAL_LENGTH);
      player.radius = computeRadius(player.spine.length, PLAYER_BASE_RADIUS, PLAYER_MAX_RADIUS);

      player.bodyMesh = new THREE.Mesh(new THREE.BufferGeometry(), createBodyMaterial());
      scene.add(player.bodyMesh);
      updateSnakeBody(player, playerColorAt);

      if (!player.headParts) player.headParts = createSnakeHead(0x20e6d0);
      updateSnakeHead(player.headParts, player.spine[0], player.direction, player.radius);
      setSnakeHeadVisible(player.headParts, true);
    }

    function enemyColor(index) {
      const colors = [0xff3b81, 0x8b5cf6, 0x22c55e, 0xf97316, 0x38bdf8];
      return colors[index % colors.length];
    }

    function getEnemySpawnPosition(index) {
      let position = new THREE.Vector3();
      const playerHead = player.spine[0] || { x: 0, z: 0 };

      for (let attempt = 0; attempt < 30; attempt++) {
        const angle = (index / ENEMY_COUNT) * Math.PI * 2 + random(-0.45, 0.45);
        const radius = random(14, 27);
        position.set(playerHead.x + Math.cos(angle) * radius, 0, playerHead.z + Math.sin(angle) * radius);

        if (distance2D(position, playerHead) > 11) {
          let valid = true;
          for (const enemy of enemies) {
            if (enemy.alive && distance2D(position, enemy.spine[0]) < 8) {
              valid = false;
              break;
            }
          }
          if (valid) return position;
        }
      }

      return position;
    }

    function createEnemy(index) {
      const enemyColorValue = enemyColor(index);
      const enemy = {
        id: index,
        name: "Cobra " + (index + 1),
        color: enemyColorValue,
        colorObj: new THREE.Color(enemyColorValue),
        spine: [],
        direction: new THREE.Vector3(1, 0, 0),
        target: new THREE.Vector3(),
        alive: false,
        respawnTimer: 0,
        radius: ENEMY_BASE_RADIUS,
        initialLength: INITIAL_LENGTH,
        growthQueue: 0,
        score: 0,
        food: 0,
        boostUntil: 0,
        speedMultiplier: 1,
        turnTimer: 0,
        wanderTimer: 0,
        bodyMesh: new THREE.Mesh(new THREE.BufferGeometry(), createBodyMaterial()),
        headParts: null,
      };

      scene.add(enemy.bodyMesh);
      enemy.headParts = createSnakeHead(enemyColorValue);
      enemies.push(enemy);
      respawnEnemy(enemy);
      return enemy;
    }

    function respawnEnemy(enemy) {
      const spawn = getEnemySpawnPosition(enemy.id);
      const playerHead = player.spine[0] || { x: 0, z: 0 };
      const angle = Math.atan2(playerHead.z - spawn.z, playerHead.x - spawn.x);

      enemy.direction.set(Math.cos(angle), 0, Math.sin(angle));
      if (Math.random() < 0.5) enemy.direction.multiplyScalar(-1);
      enemy.direction.normalize();

      const length = 7 + Math.floor(Math.random() * 3);
      enemy.initialLength = length;
      enemy.spine = makeSpine(spawn.x, spawn.z, enemy.direction, length);
      enemy.radius = computeRadius(length, ENEMY_BASE_RADIUS, ENEMY_MAX_RADIUS);

      enemy.target.copy(spawn);
      enemy.alive = true;
      enemy.respawnTimer = 0;
      enemy.growthQueue = 0;
      enemy.boostUntil = 0;
      enemy.speedMultiplier = 1;
      enemy.turnTimer = random(0.4, 1.4);
      enemy.wanderTimer = random(0.5, 2);
      enemy.bodyMesh.visible = true;

      updateSnakeBody(enemy, () => enemy.colorObj);
      updateSnakeHead(enemy.headParts, enemy.spine[0], enemy.direction, enemy.radius);
      setSnakeHeadVisible(enemy.headParts, true);
    }

    function killEnemy(enemy) {
      if (!enemy.alive) return;
      spawnDeathCloud(enemy.spine, enemy.color);
      enemy.alive = false;
      enemy.bodyMesh.visible = false;
      setSnakeHeadVisible(enemy.headParts, false);
      enemy.respawnTimer = 1.8 + Math.random() * 1.8;
    }

    function spawnDeathCloud(spine, color) {
      if (!spine || !spine.length) return;
      const center = spine[Math.floor(spine.length / 2)];
      const cloudRadius = Math.max(1.6, spine.length * 0.32);

      const puff = new THREE.Mesh(
        new THREE.SphereGeometry(cloudRadius, 14, 10),
        new THREE.MeshBasicMaterial({ color: color || 0x9fb4c7, transparent: true, opacity: 0.3, depthWrite: false })
      );
      puff.position.set(center.x, 0.7, center.z);
      scene.add(puff);
      deathClouds.push({ mesh: puff, life: 2.4, maxLife: 2.4 });

      const orbCount = Math.min(16, Math.max(3, Math.round(spine.length / 1.5)));
      for (let i = 0; i < orbCount; i++) {
        const source = spine[Math.floor((i / orbCount) * spine.length)] || center;
        const type = i % 4 === 0 ? FOOD_TYPES[1] : FOOD_TYPES[0];
        createFoodAt(source.x + random(-0.7, 0.7), source.z + random(-0.7, 0.7), type);
      }
    }

    function updateDeathClouds(delta) {
      for (let i = deathClouds.length - 1; i >= 0; i--) {
        const cloud = deathClouds[i];
        cloud.life -= delta;
        const t = Math.max(0, cloud.life / cloud.maxLife);
        cloud.mesh.material.opacity = 0.3 * t;
        cloud.mesh.scale.setScalar(1 + (1 - t) * 0.6);
        if (cloud.life <= 0) {
          scene.remove(cloud.mesh);
          cloud.mesh.geometry.dispose();
          cloud.mesh.material.dispose();
          deathClouds.splice(i, 1);
        }
      }
    }

    function moveSpine(spine, direction, speed, delta) {
      const head = spine[0];
      head.x += direction.x * speed * delta;
      head.z += direction.z * speed * delta;
      head.y = 0.5;

      for (let i = 1; i < spine.length; i++) {
        const current = spine[i];
        const previous = spine[i - 1];
        const dx = previous.x - current.x;
        const dz = previous.z - current.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > SEGMENT_SPACING) {
          const ratio = (dist - SEGMENT_SPACING) / Math.max(dist, 0.0001);
          current.x += dx * ratio;
          current.z += dz * ratio;
        }
        current.y = 0.5;
      }
    }

    function steerSmoothly(current, target, amount) {
      const angleCurrent = Math.atan2(current.z, current.x);
      const angleTarget = Math.atan2(target.z, target.x);
      let difference = angleTarget - angleCurrent;

      while (difference > Math.PI) difference -= Math.PI * 2;
      while (difference < -Math.PI) difference += Math.PI * 2;

      const next = angleCurrent + difference * Math.min(1, amount);
      current.set(Math.cos(next), 0, Math.sin(next));
      current.normalize();
    }

    function turnPlayer(screenX, screenY) {
      const length = Math.sqrt(screenX * screenX + screenY * screenY);
      if (length < 0.001) return;
      screenX /= length;
      screenY /= length;

      const cameraRight = new THREE.Vector3();
      const cameraUp = new THREE.Vector3();
      const cameraForward = new THREE.Vector3();
      camera.matrixWorld.extractBasis(cameraRight, cameraUp, cameraForward);
      cameraRight.y = 0;
      cameraRight.normalize();

      const screenUpGround = new THREE.Vector3().crossVectors(cameraRight, new THREE.Vector3(0, 1, 0));
      screenUpGround.y = 0;
      if (screenUpGround.lengthSq() < 0.001) screenUpGround.set(0, 0, 1);
      screenUpGround.normalize();

      const direction = new THREE.Vector3();
      direction.addScaledVector(cameraRight, screenX);
      direction.addScaledVector(screenUpGround, screenY);
      direction.y = 0;
      if (direction.lengthSq() < 0.001) return;
      direction.normalize();
      desiredDirection.copy(direction);
    }

    function growPlayerIfNeeded() {
      if (player.growthQueue <= 0) return;
      const last = player.spine[player.spine.length - 1];
      player.spine.push(last.clone());
      player.growthQueue--;
      player.radius = computeRadius(player.spine.length, PLAYER_BASE_RADIUS, PLAYER_MAX_RADIUS);
    }

    function growEnemyIfNeeded(enemy) {
      if (enemy.growthQueue <= 0) return;
      const last = enemy.spine[enemy.spine.length - 1];
      enemy.spine.push(last.clone());
      enemy.growthQueue--;
      enemy.radius = computeRadius(enemy.spine.length, ENEMY_BASE_RADIUS, ENEMY_MAX_RADIUS);
    }

    function updatePlayer(delta, time) {
      if (!player.spine.length) return;

      steerSmoothly(player.direction, desiredDirection, Math.min(1, delta * 9));

      const boostActive = time < playerBoostUntil;
      const speed = PLAYER_SPEED * (boostActive ? playerSpeedMultiplier : 1);

      moveSpine(player.spine, player.direction, speed, delta);
      growPlayerIfNeeded();
      updateSnakeBody(player, playerColorAt);
      updateSnakeHead(player.headParts, player.spine[0], player.direction, player.radius);

      if (!boostActive) {
        playerSpeedMultiplier = 1;
        boostEl.classList.remove("show");
      }
    }

    function findNearestFood(position) {
      let nearest = null;
      let nearestDistance = Infinity;
      for (const food of foods) {
        const distance = distance2D(position, food.position);
        if (distance < nearestDistance) {
          nearest = food;
          nearestDistance = distance;
        }
      }
      return nearest;
    }

    function updateEnemy(enemy, delta, time) {
      if (!enemy.alive || !enemy.spine.length) return;

      const head = enemy.spine[0];
      enemy.turnTimer -= delta;
      enemy.wanderTimer -= delta;

      const nearestFood = findNearestFood(head);
      if (nearestFood) enemy.target.copy(nearestFood.position);

      const playerHead = player.spine[0];
      if (playerHead && distance2D(head, playerHead) < 18) {
        const away = new THREE.Vector3(head.x - playerHead.x, 0, head.z - playerHead.z);
        if (away.lengthSq() > 0.001) {
          away.normalize();
          enemy.target.set(head.x + away.x * 18, 0, head.z + away.z * 18);
        }
      }

      if (enemy.turnTimer <= 0) {
        const desired = new THREE.Vector3(enemy.target.x - head.x, 0, enemy.target.z - head.z);
        if (desired.lengthSq() > 0.001) {
          desired.normalize();
          steerSmoothly(enemy.direction, desired, delta * 2.8);
        }
        enemy.turnTimer = random(0.35, 0.9);
      }

      if (enemy.wanderTimer <= 0) {
        const randomAngle = random(-0.8, 0.8);
        const x = enemy.direction.x;
        const z = enemy.direction.z;
        enemy.direction.set(x * Math.cos(randomAngle) - z * Math.sin(randomAngle), 0, x * Math.sin(randomAngle) + z * Math.cos(randomAngle));
        enemy.direction.normalize();
        enemy.wanderTimer = random(1, 2.8);
      }

      const speed = ENEMY_SPEED * (time < enemy.boostUntil ? enemy.speedMultiplier : 1);
      moveSpine(enemy.spine, enemy.direction, speed, delta);
      growEnemyIfNeeded(enemy);
      updateSnakeBody(enemy, () => enemy.colorObj);
      updateSnakeHead(enemy.headParts, enemy.spine[0], enemy.direction, enemy.radius);

      if (playerHead && head.distanceTo(playerHead) > 500) {
        respawnEnemy(enemy);
      }
    }

    function applyFoodEffect(food, isPlayer, enemy, time) {
      const type = food.userData.foodType;
      if (!type) return;

      if (isPlayer) {
        score += type.value;
        foodCollected++;
        player.growthQueue += type.growth;
        if (type.duration > 0) {
          playerBoostUntil = time + type.duration;
          playerSpeedMultiplier = type.speed;
        }
        arcadeSound(type.id === "turbo" ? "score" : type.id === "legendary" ? "win" : "eat");
        respawnFood(food);
        return;
      }

      if (enemy) {
        enemy.score += type.value;
        enemy.food++;
        enemy.growthQueue += type.growth;
        if (type.duration > 0) {
          enemy.boostUntil = time + type.duration;
          enemy.speedMultiplier = type.speed;
        }
        respawnFood(food);
      }
    }

    function checkFoodCollisions(time) {
      const playerHead = player.spine[0];
      if (!playerHead) return;

      for (let i = foods.length - 1; i >= 0; i--) {
        const food = foods[i];
        if (playerHead.distanceTo(food.position) < player.radius + food.userData.foodType.size + 0.35) {
          applyFoodEffect(food, true, null, time);
        }
      }

      for (const enemy of enemies) {
        if (!enemy.alive) continue;
        const head = enemy.spine[0];
        for (let i = foods.length - 1; i >= 0; i--) {
          const food = foods[i];
          if (head.distanceTo(food.position) < enemy.radius + food.userData.foodType.size + 0.3) {
            applyFoodEffect(food, false, enemy, time);
          }
        }
      }
    }

    // Regra de cobrinha clássica: quem bate a CABEÇA em algo morre.
    // - Cabeça encosta no corpo de outra cobra → só quem bateu a cabeça morre,
    //   o dono do corpo tocado não sofre nada.
    // - Cabeça encosta em cabeça (choque frontal) → as duas morrem.
    function checkPlayerEnemyCollisions() {
      if (!player.spine.length) return false;
      const playerHead = player.spine[0];

      for (const enemy of enemies) {
        if (!enemy.alive) continue;
        const enemyHead = enemy.spine[0];

        // Choque frontal: cabeça com cabeça, as duas morrem.
        if (circlesOverlap(playerHead, enemyHead, player.radius, enemy.radius)) {
          killEnemy(enemy);
          return true;
        }

        // Jogador bateu a cabeça no corpo do inimigo: só o jogador morre.
        for (let i = 1; i < enemy.spine.length; i++) {
          if (circlesOverlap(playerHead, enemy.spine[i], player.radius, enemy.radius)) {
            return true;
          }
        }

        // O inimigo bateu a cabeça no corpo do jogador: só o inimigo morre.
        for (let i = 1; i < player.spine.length; i++) {
          if (circlesOverlap(enemyHead, player.spine[i], enemy.radius, player.radius)) {
            killEnemy(enemy);
            break;
          }
        }
      }

      return false;
    }

    // Mesma regra entre duas cobras inimigas.
    function checkEnemyEnemyCollisions() {
      for (let a = 0; a < enemies.length; a++) {
        const first = enemies[a];
        if (!first.alive) continue;

        for (let b = a + 1; b < enemies.length; b++) {
          const second = enemies[b];
          if (!second.alive) continue;

          const firstHead = first.spine[0];
          const secondHead = second.spine[0];

          if (circlesOverlap(firstHead, secondHead, first.radius, second.radius)) {
            killEnemy(first);
            killEnemy(second);
            break; // "first" morreu, não faz sentido testá-la contra as próximas
          }

          let firstHitSecondBody = false;
          for (let i = 1; i < second.spine.length; i++) {
            if (circlesOverlap(firstHead, second.spine[i], first.radius, second.radius)) {
              firstHitSecondBody = true;
              break;
            }
          }
          if (firstHitSecondBody) {
            killEnemy(first);
            break;
          }

          for (let i = 1; i < first.spine.length; i++) {
            if (circlesOverlap(secondHead, first.spine[i], second.radius, first.radius)) {
              killEnemy(second);
              break;
            }
          }
        }
      }
    }

    function updateEnemyRespawns(delta) {
      for (const enemy of enemies) {
        if (enemy.alive) continue;
        enemy.respawnTimer -= delta;
        if (enemy.respawnTimer <= 0) respawnEnemy(enemy);
      }
    }

    function animateFoods(time) {
      for (const food of foods) {
        const type = food.userData.foodType;
        const phase = food.userData.phase;

        food.rotation.x += 0.018;
        food.rotation.y += 0.025;
        food.position.y = food.userData.baseY + Math.sin(time * 3 + phase) * 0.12;

        if (type.id === "legendary") {
          const hue = (time * 0.12 + phase * 0.1) % 1;
          const color = new THREE.Color();
          color.setHSL(hue, 0.95, 0.55);
          food.material.color.copy(color);
          food.material.emissive.copy(color);
          food.scale.setScalar(1 + Math.sin(time * 5 + phase) * 0.12);
        } else {
          food.scale.setScalar(1);
        }
      }
    }

    function updateCamera() {
      const head = player.spine[0];
      if (!head) return;

      camera.position.x = head.x;
      camera.position.y = head.y + cameraDistance;
      camera.position.z = head.z + 0.01;
      camera.lookAt(head.x, 0, head.z);
    }

    function drawMinimap() {
      const ctx = minimapCtx;
      const width = minimapCanvas.width;
      const height = minimapCanvas.height;
      const head = player.spine[0];
      if (!head) return;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#050913";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const scale = width / (MINIMAP_RANGE * 2);

      ctx.strokeStyle = "rgba(255,255,255,.06)";
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        const radius = (MINIMAP_RANGE * scale) * (i / 4);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(255,255,255,.045)";
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      function mapX(worldX) {
        return centerX + (worldX - head.x) * scale;
      }
      function mapY(worldZ) {
        return centerY + (worldZ - head.z) * scale;
      }

      for (const food of foods) {
        const type = food.userData.foodType;
        const dx = food.position.x - head.x;
        const dz = food.position.z - head.z;
        if (Math.abs(dx) > MINIMAP_RANGE || Math.abs(dz) > MINIMAP_RANGE) continue;

        const x = mapX(food.position.x);
        const y = mapY(food.position.z);
        let color = "#" + type.color.toString(16).padStart(6, "0");

        if (type.id === "legendary") {
          const hue = (performance.now() / 1500) % 1;
          const rainbow = new THREE.Color();
          rainbow.setHSL(hue, 1, 0.58);
          color = "#" + rainbow.getHexString();
        }

        ctx.fillStyle = color;
        const radius = type.id === "legendary" ? 4 : type.id === "special" ? 3.4 : 2.6;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        if (type.id === "legendary") {
          ctx.strokeStyle = "rgba(255,255,255,.8)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      for (const enemy of enemies) {
        if (!enemy.alive || !enemy.spine.length) continue;

        const enemyHead = enemy.spine[0];
        const dx = enemyHead.x - head.x;
        const dz = enemyHead.z - head.z;
        if (Math.abs(dx) > MINIMAP_RANGE || Math.abs(dz) > MINIMAP_RANGE) continue;

        ctx.strokeStyle = "#" + enemy.color.toString(16).padStart(6, "0");
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 2.4;
        ctx.beginPath();

        const visibleSegments = Math.min(enemy.spine.length, 10);
        for (let i = 0; i < visibleSegments; i++) {
          const point = enemy.spine[i];
          const x = mapX(point.x);
          const y = mapY(point.z);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;

        const hx = mapX(enemyHead.x);
        const hy = mapY(enemyHead.z);
        ctx.fillStyle = "#" + enemy.color.toString(16).padStart(6, "0");
        ctx.beginPath();
        ctx.arc(hx, hy, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.translate(centerX, centerY);
      const angle = Math.atan2(player.direction.z, player.direction.x);
      ctx.rotate(angle);
      ctx.fillStyle = "#20e6d0";
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-6, -5);
      ctx.lineTo(-3.5, 0);
      ctx.lineTo(-6, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = "rgba(32,230,208,.55)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    function updateHUD() {
      sizeEl.textContent = String(player.spine.length);
      foodEl.textContent = String(foodCollected);

      const aliveEnemies = enemies.filter((enemy) => enemy.alive).length;
      enemiesEl.textContent = String(aliveEnemies);

      const ranking = [{ name: "Você", length: player.spine.length, player: true }];

      for (const enemy of enemies) {
        if (enemy.alive) {
          ranking.push({ name: enemy.name, length: enemy.spine.length, player: false, color: enemy.color });
        }
      }

      ranking.sort((a, b) => b.length - a.length);

      rankingEl.innerHTML = ranking
        .slice(0, 6)
        .map((item, index) => {
          const color = item.player ? "#20e6d0" : "#" + item.color.toString(16).padStart(6, "0");
          return `
            <div class="rankingRow2">
              <span class="rankingName2" style="color:${color}">${index + 1}. ${item.name}</span>
              <span class="rankingScore2">${item.length}</span>
            </div>
          `;
        })
        .join("");
    }

    function arcadeSound(type) {
      try {
        if (window.arcade && typeof window.arcade.playSound === "function") {
          window.arcade.playSound(type);
        }
      } catch {}
    }

    function resize() {
      if (destroyed) return;
      const width = canvas.clientWidth || container.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || container.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    }

    function getTouchDistance(touchA, touchB) {
      const dx = touchA.clientX - touchB.clientX;
      const dy = touchA.clientY - touchB.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function handleTouchStart(event) {
      if (!running || paused) return;

      if (event.touches.length >= 2) {
        pinchActive = true;
        swiping = false;
        pinchStartDistance = getTouchDistance(event.touches[0], event.touches[1]);
        pinchStartCameraDistance = cameraDistance;
        event.preventDefault();
        return;
      }

      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      swiping = true;
    }

    function handleTouchMove(event) {
      if (!running || paused) return;

      if (event.touches.length >= 2) {
        pinchActive = true;
        swiping = false;
        const distance = getTouchDistance(event.touches[0], event.touches[1]);
        if (pinchStartDistance > 0) {
          const scale = distance / pinchStartDistance;
          cameraDistance = Math.max(18, Math.min(90, pinchStartCameraDistance / scale));
        }
        event.preventDefault();
        return;
      }

      if (swiping) event.preventDefault();
    }

    function handleTouchEnd(event) {
      if (pinchActive) {
        if (event.touches && event.touches.length < 2) pinchActive = false;
        swiping = false;
        return;
      }

      if (!swiping || !running || paused) {
        swiping = false;
        return;
      }

      if (!event.changedTouches || event.changedTouches.length !== 1) {
        swiping = false;
        return;
      }

      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      swiping = false;

      if (distance < 22) return;
      turnPlayer(dx, dy);
    }

    function handleTouchCancel() {
      swiping = false;
      pinchActive = false;
    }

    function togglePause() {
      if (!running) return;
      paused = !paused;
      pauseButton.textContent = paused ? "▶" : "Ⅱ";
    }

    function startGame() {
      score = 0;
      foodCollected = 0;
      playerBoostUntil = 0;
      playerSpeedMultiplier = 1;
      cameraDistance = 44;
      paused = false;
      pauseButton.textContent = "Ⅱ";

      createPlayer();

      for (const enemy of enemies) {
        scene.remove(enemy.bodyMesh);
        if (enemy.bodyMesh.geometry) enemy.bodyMesh.geometry.dispose();
        enemy.bodyMesh.material.dispose();
        disposeSnakeHead(enemy.headParts);
      }
      enemies.length = 0;
      for (let i = 0; i < ENEMY_COUNT; i++) createEnemy(i);

      for (const food of foods) disposeFood(food);
      foods.length = 0;
      ensureFoodCount();

      for (const cloud of deathClouds) {
        scene.remove(cloud.mesh);
        cloud.mesh.geometry.dispose();
        cloud.mesh.material.dispose();
      }
      deathClouds.length = 0;

      running = true;
      startOverlay.classList.add("hidden");
      gameOverOverlay.classList.add("hidden");
      lastTime = performance.now();

      updateCamera();
      updateHUD();
      arcadeSound("click");
    }

    function gameOver(reason) {
      if (!running) return;
      running = false;
      paused = false;
      pauseButton.textContent = "Ⅱ";

      finalScoreEl.textContent = String(score);
      finalTextEl.textContent = reason || "Sua cobra foi eliminada.";
      gameOverOverlay.classList.remove("hidden");
      arcadeSound("lose");

      try {
        if (window.arcade) {
          window.arcade.addPlayed("snake2");
          window.arcade.setRecord("snake2", score);
        }
      } catch {}
    }

    function updateBoostUI(time) {
      if (time < playerBoostUntil) {
        const remaining = Math.max(0, playerBoostUntil - time);
        boostEl.textContent = "⚡ TURBO " + remaining.toFixed(1) + "s";
        boostEl.classList.add("show");
      } else {
        boostEl.classList.remove("show");
      }
    }

    function update(delta, time) {
      if (!running || paused) return;

      updatePlayer(delta, time);
      for (const enemy of enemies) updateEnemy(enemy, delta, time);

      checkFoodCollisions(time);
      checkEnemyEnemyCollisions();
      updateEnemyRespawns(delta);
      updateDeathClouds(delta);

      if (checkPlayerEnemyCollisions()) {
        spawnDeathCloud(player.spine, 0x20e6d0);
        gameOver("Colisão fatal com outra cobra.");
        return;
      }

      animateFoods(time);
      updateCamera();
      updateBoostUI(time);
      updateHUD();
      drawMinimap();

      const head = player.spine[0];
      ground.position.x = head.x;
      ground.position.z = head.z;
      worldGlow.position.x = head.x;
      worldGlow.position.z = head.z;
    }

    function loop(now) {
      if (destroyed) return;
      animationId = requestAnimationFrame(loop);
      const delta = Math.min(0.033, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;
      update(delta, now / 1000);
      renderer.render(scene, camera);
    }

    startButton.addEventListener("click", startGame);
    restartButton.addEventListener("click", startGame);
    pauseButton.addEventListener("click", togglePause);

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    canvas.addEventListener("touchcancel", handleTouchCancel, { passive: true });
    window.addEventListener("resize", resize);

    resize();
    createPlayer();
    for (let i = 0; i < ENEMY_COUNT; i++) createEnemy(i);
    ensureFoodCount();
    updateCamera();
    updateHUD();
    drawMinimap();
    loop(performance.now());

    return () => {
      destroyed = true;
      running = false;
      if (animationId !== null) cancelAnimationFrame(animationId);

      window.removeEventListener("resize", resize);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchCancel);

      if (player.bodyMesh) {
        scene.remove(player.bodyMesh);
        if (player.bodyMesh.geometry) player.bodyMesh.geometry.dispose();
        player.bodyMesh.material.dispose();
      }

      for (const enemy of enemies) {
        scene.remove(enemy.bodyMesh);
        if (enemy.bodyMesh.geometry) enemy.bodyMesh.geometry.dispose();
        enemy.bodyMesh.material.dispose();
      }
      enemies.length = 0;

      for (const food of foods) disposeFood(food);
      foods.length = 0;

      for (const cloud of deathClouds) {
        scene.remove(cloud.mesh);
        cloud.mesh.geometry.dispose();
        cloud.mesh.material.dispose();
      }
      deathClouds.length = 0;

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material.dispose();
        }
      });

      renderer.dispose();
    };
  },
});
