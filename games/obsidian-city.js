import * as THREE from "./lib/three/three.module.js";
import { registerGame } from "../arcade.js";

export const OBSIDIAN_CITY_HTML = String.raw`
<style>
  .obsidian-city {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 520px;
    overflow: hidden;
    background: #05070a;
    border-radius: 18px;
    touch-action: none;
    user-select: none;
  }

  .obsidian-city canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    touch-action: none;
  }

  .city-hud {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 5;
    padding: 10px 13px;
    border-radius: 12px;
    background: rgba(5, 8, 14, .72);
    border: 1px solid rgba(255,255,255,.12);
    backdrop-filter: blur(10px);
    color: white;
    font-family: Arial, sans-serif;
    pointer-events: none;
  }

  .city-title {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: .8px;
  }

  .city-status {
    margin-top: 4px;
    font-size: 11px;
    color: rgba(255,255,255,.7);
  }

  .city-controls {
    position: absolute;
    right: 12px;
    bottom: 12px;
    z-index: 6;
    display: flex;
    flex-direction: column;
    gap: 7px;
    align-items: flex-end;
  }

  .city-row {
    display: flex;
    gap: 7px;
  }

  .city-btn {
    width: 48px;
    height: 48px;
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 13px;
    background: rgba(8,11,18,.76);
    color: white;
    font-size: 19px;
    font-weight: 800;
    box-shadow: 0 5px 20px rgba(0,0,0,.28);
    backdrop-filter: blur(8px);
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  .city-btn:active {
    transform: scale(.94);
    background: rgba(35,40,52,.9);
  }

  .city-hint {
    position: absolute;
    left: 50%;
    bottom: 13px;
    transform: translateX(-50%);
    z-index: 4;
    padding: 7px 10px;
    border-radius: 10px;
    background: rgba(0,0,0,.42);
    color: rgba(255,255,255,.7);
    font: 11px Arial, sans-serif;
    pointer-events: none;
    white-space: nowrap;
  }

  @media (max-width: 600px) {
    .obsidian-city {
      min-height: 430px;
    }

    .city-hint {
      display: none;
    }

    .city-btn {
      width: 45px;
      height: 45px;
    }
  }
</style>

<div class="obsidian-city">
  <canvas class="city-canvas"></canvas>

  <div class="city-hud">
    <div class="city-title">OBSIDIAN CITY 3D</div>
    <div class="city-status">Carregando cidade...</div>
  </div>

  <div class="city-hint">
    Arraste para olhar • Pinça para aproximar
  </div>

  <div class="city-controls">
    <button class="city-btn city-up" type="button">▲</button>

    <div class="city-row">
      <button class="city-btn city-left" type="button">◀</button>
      <button class="city-btn city-down" type="button">▼</button>
      <button class="city-btn city-right" type="button">▶</button>
    </div>

    <div class="city-row">
      <button class="city-btn city-zoom-in" type="button">＋</button>
      <button class="city-btn city-zoom-out" type="button">−</button>
      <button class="city-btn city-camera" type="button">⟳</button>
    </div>
  </div>
</div>
`;

function createCity(container) {
  const root = container.querySelector(".obsidian-city");
  const canvas = root.querySelector(".city-canvas");
  const status = root.querySelector(".city-status");

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    58,
    1,
    0.1,
    5000
  );

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 1.8)
  );

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.setClearColor(0x78a6c7);

  const ambient = new THREE.HemisphereLight(
    0xb9dcff,
    0x29301f,
    1.8
  );

  scene.add(ambient);

  const sun = new THREE.DirectionalLight(
    0xfff0cf,
    3.0
  );

  sun.position.set(250, 500, 180);
  sun.castShadow = true;

  sun.shadow.mapSize.width = 1024;
  sun.shadow.mapSize.height = 1024;

  sun.shadow.camera.left = -900;
  sun.shadow.camera.right = 900;
  sun.shadow.camera.top = 900;
  sun.shadow.camera.bottom = -900;

  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 2500;

  scene.add(sun);

  const moon = new THREE.DirectionalLight(
    0x7d9dff,
    0.35
  );

  moon.position.set(-250, 350, -300);
  scene.add(moon);

  const world = new THREE.Group();
  scene.add(world);

  const cars = [];
  const animatedLights = [];
  const disposableMaterials = [];
  const disposableGeometries = [];

  const citySize = 1900;
  const roadWidth = 90;
  const blockSize = 300;

  const clock = new THREE.Clock();

  let running = true;
  let animationFrame = 0;

  let dayTime = 8.5;

  let cameraTarget = new THREE.Vector3(0, 0, 0);
  let cameraYaw = Math.PI * 0.72;
  let cameraPitch = 0.72;
  let cameraDistance = 720;

  const defaultCamera = {
    yaw: Math.PI * 0.72,
    pitch: 0.72,
    distance: 720,
    targetX: 0,
    targetZ: 0
  };

  const keys = new Set();

  const pointer = {
    active: false,
    x: 0,
    y: 0
  };

  const touches = new Map();

  let pinchDistance = null;

  function material(color, roughness = 0.82, metalness = 0.02) {
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness
    });

    disposableMaterials.push(mat);

    return mat;
  }

  function cube(
    x,
    y,
    z,
    sx,
    sy,
    sz,
    color,
    options = {}
  ) {
    const geometry = new THREE.BoxGeometry(
      sx,
      sy,
      sz
    );

    disposableGeometries.push(geometry);

    const mat = options.material || material(
      color,
      options.roughness ?? 0.82,
      options.metalness ?? 0.02
    );

    const mesh = new THREE.Mesh(
      geometry,
      mat
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = options.castShadow !== false;
    mesh.receiveShadow = options.receiveShadow !== false;

    if (options.rotationY) {
      mesh.rotation.y = options.rotationY;
    }

    world.add(mesh);

    return mesh;
  }

  function cylinder(
    x,
    y,
    z,
    radius,
    height,
    color,
    segments = 10
  ) {
    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      height,
      segments
    );

    disposableGeometries.push(geometry);

    const mesh = new THREE.Mesh(
      geometry,
      material(color)
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    world.add(mesh);

    return mesh;
  }

  function cone(
    x,
    y,
    z,
    radius,
    height,
    color
  ) {
    const geometry = new THREE.ConeGeometry(
      radius,
      height,
      8
    );

    disposableGeometries.push(geometry);

    const mesh = new THREE.Mesh(
      geometry,
      material(color)
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    world.add(mesh);

    return mesh;
  }

  function createGround() {
    const geometry = new THREE.PlaneGeometry(
      citySize,
      citySize
    );

    disposableGeometries.push(geometry);

    const ground = new THREE.Mesh(
      geometry,
      material(0x344235)
    );

    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;

    ground.receiveShadow = true;

    world.add(ground);
  }

  function createRoads() {
    const roadMaterial = material(
      0x202328,
      0.95
    );

    const sidewalkMaterial = material(
      0x686b68,
      0.95
    );

    const roadPositions = [];

    for (
      let p = -900;
      p <= 900;
      p += blockSize
    ) {
      roadPositions.push(p);
    }

    for (const p of roadPositions) {
      cube(
        p,
        1,
        0,
        roadWidth,
        2,
        citySize,
        roadMaterial,
        {
          castShadow: false
        }
      );

      cube(
        0,
        1.1,
        p,
        citySize,
        2,
        roadWidth,
        roadMaterial,
        {
          castShadow: false
        }
      );

      const side = roadWidth / 2 + 9;

      cube(
        p - side,
        2,
        0,
        12,
        4,
        citySize,
        sidewalkMaterial,
        {
          castShadow: false
        }
      );

      cube(
        p + side,
        2,
        0,
        12,
        4,
        citySize,
        sidewalkMaterial,
        {
          castShadow: false
        }
      );

      cube(
        0,
        2,
        p - side,
        citySize,
        4,
        12,
        sidewalkMaterial,
        {
          castShadow: false
        }
      );

      cube(
        0,
        2,
        p + side,
        citySize,
        4,
        12,
        sidewalkMaterial,
        {
          castShadow: false
        }
      );
    }

    const lineMaterial = material(
      0xd9c56a,
      0.8
    );

    for (
      let p = -900;
      p <= 900;
      p += blockSize
    ) {
      for (
        let n = -850;
        n <= 850;
        n += 70
      ) {
        cube(
          p,
          3,
          n,
          4,
          0.5,
          35,
          lineMaterial,
          {
            castShadow: false
          }
        );

        cube(
          n,
          3,
          p,
          35,
          0.5,
          4,
          lineMaterial,
          {
            castShadow: false
          }
        );
      }
    }
  }

  function createBuilding(
    x,
    z,
    width,
    depth,
    height,
    color
  ) {
    const base = cube(
      x,
      height / 2 + 4,
      z,
      width,
      height,
      depth,
      color
    );

    const roof = cube(
      x,
      height + 9,
      z,
      width + 7,
      10,
      depth + 7,
      0x282c32
    );

    roof.castShadow = true;

    const windowMaterial = new THREE.MeshStandardMaterial({
      color: 0x9fc5df,
      emissive: 0x31495a,
      emissiveIntensity: 0.12,
      roughness: 0.28,
      metalness: 0.08
    });

    disposableMaterials.push(windowMaterial);

    const floors = Math.max(
      2,
      Math.floor(height / 42)
    );

    const rows = Math.max(
      2,
      Math.floor(depth / 30)
    );

    for (let floor = 0; floor < floors; floor++) {
      const wy = 20 + floor * 40;

      if (wy > height - 10) {
        continue;
      }

      const count = Math.max(
        2,
        Math.floor(width / 30)
      );

      for (let i = 0; i < count; i++) {
        const wx =
          x -
          width / 2 +
          18 +
          i *
            ((width - 36) /
              Math.max(1, count - 1));

        const front = cube(
          wx,
          wy,
          z + depth / 2 + 0.8,
          10,
          13,
          1.2,
          0x8caebc,
          {
            material: windowMaterial,
            castShadow: false
          }
        );

        front.userData.isWindow = true;

        const back = cube(
          wx,
          wy,
          z - depth / 2 - 0.8,
          10,
          13,
          1.2,
          0x8caebc,
          {
            material: windowMaterial,
            castShadow: false
          }
        );

        back.userData.isWindow = true;
      }
    }

    base.userData.building = true;

    return base;
  }

  function createHouse(
    x,
    z,
    width,
    depth
  ) {
    const height = 42;

    cube(
      x,
      height / 2 + 4,
      z,
      width,
      height,
      depth,
      0xb9a486
    );

    const roofGeometry =
      new THREE.ConeGeometry(
        Math.max(width, depth) * 0.72,
        30,
        4
      );

    disposableGeometries.push(
      roofGeometry
    );

    const roof = new THREE.Mesh(
      roofGeometry,
      material(0x653c31)
    );

    roof.position.set(
      x,
      height + 19,
      z
    );

    roof.rotation.y =
      Math.PI / 4;

    roof.castShadow = true;
    roof.receiveShadow = true;

    world.add(roof);

    const door = cube(
      x,
      12,
      z + depth / 2 + 0.8,
      12,
      24,
      2,
      0x3c2922
    );

    door.castShadow = false;
  }

  function createTrees() {
    const positions = [
      [-850, -820],
      [-700, -820],
      [-550, -820],
      [-390, -820],
      [390, -820],
      [550, -820],
      [700, -820],
      [850, -820],

      [-820, -700],
      [-820, -540],
      [-820, -380],
      [820, -700],
      [820, -540],
      [820, -380],

      [-820, 380],
      [-820, 540],
      [-820, 700],
      [820, 380],
      [820, 540],
      [820, 700],

      [-850, 820],
      [-700, 820],
      [-550, 820],
      [-390, 820],
      [390, 820],
      [550, 820],
      [700, 820],
      [850, 820]
    ];

    for (const [x, z] of positions) {
      cylinder(
        x,
        27,
        z,
        7,
        54,
        0x5b3a26,
        8
      );

      cone(
        x,
        72,
        z,
        28,
        58,
        0x2c6738
      );

      cone(
        x,
        100,
        z,
        21,
        45,
        0x347a40
      );
    }
  }

  function createStreetLights() {
    const poleMaterial = material(
      0x34383d,
      0.5,
      0.45
    );

    const lampMaterial =
      new THREE.MeshStandardMaterial({
        color: 0xffe9a6,
        emissive: 0xffb52d,
        emissiveIntensity: 0.2,
        roughness: 0.25
      });

    disposableMaterials.push(
      lampMaterial
    );

    for (
      let road = -900;
      road <= 900;
      road += blockSize
    ) {
      for (
        let p = -750;
        p <= 750;
        p += 150
      ) {
        createLamp(
          road + 34,
          0,
          p,
          poleMaterial,
          lampMaterial
        );

        createLamp(
          p,
          0,
          road - 34,
          poleMaterial,
          lampMaterial
        );
      }
    }
  }

  function createLamp(
    x,
    y,
    z,
    poleMaterial,
    lampMaterial
  ) {
    const pole = cube(
      x,
      42,
      z,
      4,
      84,
      4,
      0x34383d,
      {
        material: poleMaterial
      }
    );

    const arm = cube(
      x + 12,
      82,
      z,
      25,
      4,
      4,
      0x34383d,
      {
        material: poleMaterial
      }
    );

    const lamp = cube(
      x + 24,
      77,
      z,
      8,
      6,
      8,
      0xffe6a0,
      {
        material: lampMaterial
      }
    );

    const point = new THREE.PointLight(
      0xffc65b,
      0,
      130,
      2
    );

    point.position.set(
      x + 24,
      75,
      z
    );

    scene.add(point);

    animatedLights.push(point);

    return {
      pole,
      arm,
      lamp,
      point
    };
  }

  function createCityBuildings() {
    const colors = [
      0x707984,
      0x8b8177,
      0x667078,
      0x917c68,
      0x73706c,
      0x5e6973,
      0x83766d,
      0x6d767c
    ];

    let index = 0;

    for (
      let bx = -750;
      bx <= 750;
      bx += blockSize
    ) {
      for (
        let bz = -750;
        bz <= 750;
        bz += blockSize
      ) {
        const nearCenter =
          Math.abs(bx) < 170 &&
          Math.abs(bz) < 170;

        if (nearCenter) {
          continue;
        }

        const width =
          95 +
          ((index * 37) % 90);

        const depth =
          85 +
          ((index * 53) % 95);

        const height =
          70 +
          ((index * 67) % 210);

        const x =
          bx +
          ((index * 41) % 55) -
          27;

        const z =
          bz +
          ((index * 29) % 55) -
          27;

        createBuilding(
          x,
          z,
          width,
          depth,
          height,
          colors[index % colors.length]
        );

        index++;
      }
    }

    createHouse(
      -210,
      -210,
      95,
      80
    );

    createHouse(
      210,
      -210,
      105,
      90
    );

    createHouse(
      -210,
      210,
      90,
      80
    );

    createHouse(
      210,
      210,
      110,
      85
    );
  }

  function createCar(
    color,
    lane,
    axis,
    direction,
    speed
  ) {
    const group = new THREE.Group();

    const bodyMaterial = material(
      color,
      0.32,
      0.3
    );

    const bodyGeometry =
      new THREE.BoxGeometry(
        30,
        11,
        56
      );

    disposableGeometries.push(
      bodyGeometry
    );

    const body = new THREE.Mesh(
      bodyGeometry,
      bodyMaterial
    );

    body.position.y = 10;
    body.castShadow = true;
    body.receiveShadow = true;

    group.add(body);

    const cabinMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x222b34,
        roughness: 0.22,
        metalness: 0.05
      });

    disposableMaterials.push(
      cabinMaterial
    );

    const cabinGeometry =
      new THREE.BoxGeometry(
        25,
        12,
        27
      );

    disposableGeometries.push(
      cabinGeometry
    );

    const cabin = new THREE.Mesh(
      cabinGeometry,
      cabinMaterial
    );

    cabin.position.y = 19;
    cabin.castShadow = true;

    group.add(cabin);

    const wheelMaterial =
      material(0x111214, 0.95);

    const wheelGeometry =
      new THREE.CylinderGeometry(
        7,
        7,
        5,
        12
      );

    disposableGeometries.push(
      wheelGeometry
    );

    const wheelPositions = [
      [-16, 8, -18],
      [16, 8, -18],
      [-16, 8, 18],
      [16, 8, 18]
    ];

    for (const [
      wx,
      wy,
      wz
    ] of wheelPositions) {
      const wheel =
        new THREE.Mesh(
          wheelGeometry,
          wheelMaterial
        );

      wheel.rotation.z =
        Math.PI / 2;

      wheel.position.set(
        wx,
        wy,
        wz
      );

      wheel.castShadow = true;

      group.add(wheel);
    }

    const headlightMaterial =
      new THREE.MeshStandardMaterial({
        color: 0xfff7cf,
        emissive: 0xfff0a0,
        emissiveIntensity: 1.8
      });

    disposableMaterials.push(
      headlightMaterial
    );

    const lightGeometry =
      new THREE.BoxGeometry(
        7,
        4,
        2
      );

    disposableGeometries.push(
      lightGeometry
    );

    const leftLight =
      new THREE.Mesh(
        lightGeometry,
        headlightMaterial
      );

    leftLight.position.set(
      -8,
      12,
      29
    );

    group.add(leftLight);

    const rightLight =
      new THREE.Mesh(
        lightGeometry,
        headlightMaterial
      );

    rightLight.position.set(
      8,
      12,
      29
    );

    group.add(rightLight);

    group.position.y = 3;

    if (axis === "x") {
      group.rotation.y =
        direction > 0
          ? Math.PI / 2
          : -Math.PI / 2;
    } else {
      group.rotation.y =
        direction > 0
          ? 0
          : Math.PI;
    }

    world.add(group);

    cars.push({
      group,
      lane,
      axis,
      direction,
      speed
    });
  }

  function createCars() {
    const colors = [
      0xb32626,
      0x1c4d86,
      0x151719,
      0xd0a43c,
      0xeeeeee,
      0x4e686d,
      0x7b283e,
      0x263f27
    ];

    let i = 0;

    for (
      let lane = -900;
      lane <= 900;
      lane += blockSize
    ) {
      createCar(
        colors[i++ % colors.length],
        lane - 25,
        "x",
        1,
        65 + (i % 3) * 12
      );

      createCar(
        colors[i++ % colors.length],
        lane + 25,
        "x",
        -1,
        60 + (i % 4) * 11
      );

      createCar(
        colors[i++ % colors.length],
        lane - 25,
        "z",
        -1,
        58 + (i % 3) * 13
      );

      createCar(
        colors[i++ % colors.length],
        lane + 25,
        "z",
        1,
        62 + (i % 4) * 10
      );
    }

    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];

      if (car.axis === "x") {
        car.group.position.set(
          -900 + (i * 183) % 1800,
          0,
          car.lane
        );
      } else {
        car.group.position.set(
          car.lane,
          0,
          -900 + (i * 157) % 1800
        );
      }
    }
  }

  function createCentralPark() {
    const parkGround = cube(
      0,
      4,
      0,
      220,
      8,
      220,
      0x4b7040,
      {
        castShadow: false
      }
    );

    parkGround.receiveShadow = true;

    for (
      let x = -80;
      x <= 80;
      x += 40
    ) {
      for (
        let z = -80;
        z <= 80;
        z += 40
      ) {
        if (
          Math.abs(x) < 45 &&
          Math.abs(z) < 45
        ) {
          continue;
        }

        cylinder(
          x,
          25,
          z,
          5,
          50,
          0x5a3a25,
          8
        );

        cone(
          x,
          67,
          z,
          23,
          48,
          0x2f713c
        );
      }
    }

    const fountain =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          35,
          35,
          5,
          32
        ),
        material(0x788b92)
      );

    fountain.position.y = 7;

    disposableGeometries.push(
      fountain.geometry
    );

    world.add(fountain);

    const water =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          28,
          28,
          1,
          32
        ),
        material(0x3f91c4, 0.15, 0.15)
      );

    water.position.y = 10;

    disposableGeometries.push(
      water.geometry
    );

    world.add(water);
  }

  function buildCity() {
    createGround();
    createRoads();
    createCentralPark();
    createCityBuildings();
    createTrees();
    createStreetLights();
    createCars();
  }

  function updateCamera() {
    const horizontal =
      Math.cos(cameraPitch) *
      cameraDistance;

    const x =
      cameraTarget.x +
      Math.sin(cameraYaw) *
      horizontal;

    const y =
      cameraTarget.y +
      Math.sin(cameraPitch) *
      cameraDistance;

    const z =
      cameraTarget.z +
      Math.cos(cameraYaw) *
      horizontal;

    camera.position.set(
      x,
      y,
      z
    );

    camera.lookAt(
      cameraTarget.x,
      cameraTarget.y,
      cameraTarget.z
    );
  }

  function updateTime(delta) {
    dayTime += delta * 0.045;

    if (dayTime >= 24) {
      dayTime -= 24;
    }

    const sunAngle =
      (dayTime / 24) *
      Math.PI * 2 -
      Math.PI / 2;

    const sunHeight =
      Math.sin(sunAngle);

    const daylight =
      Math.max(
        0,
        Math.min(
          1,
          sunHeight * 0.95 + 0.25
        )
      );

    const warm =
      Math.max(
        0,
        1 - daylight
      );

    sun.position.set(
      Math.cos(sunAngle) * 600,
      Math.max(80, sunHeight * 800),
      Math.sin(sunAngle) * 600
    );

    sun.intensity =
      0.35 +
      daylight * 2.8;

    ambient.intensity =
      0.35 +
      daylight * 1.55;

    moon.intensity =
      0.05 +
      warm * 0.45;

    const skyDay =
      new THREE.Color(
        0x78a6c7
      );

    const skyNight =
      new THREE.Color(
        0x050918
      );

    const sky =
      skyNight
        .clone()
        .lerp(
          skyDay,
          daylight
        );

    renderer.setClearColor(
      sky
    );

    sun.color
      .setRGB(
        1,
        0.76 + daylight * 0.2,
        0.56 + daylight * 0.4
      );

    for (
      const light of animatedLights
    ) {
      light.intensity =
        warm * 1.8;
    }

    scene.traverse(
      (object) => {
        if (
          object.userData &&
          object.userData.isWindow
        ) {
          const mat =
            object.material;

          if (
            mat &&
            mat.emissiveIntensity !==
              undefined
          ) {
            mat.emissiveIntensity =
              0.08 +
              warm * 1.8;
          }
        }
      }
    );

    const hour =
      Math.floor(dayTime);

    const minute =
      Math.floor(
        (dayTime - hour) * 60
      );

    status.textContent =
      String(hour).padStart(2, "0") +
      ":" +
      String(minute).padStart(2, "0") +
      " • " +
      (
        daylight > 0.35
          ? "Dia"
          : "Noite"
      );
  }

  function updateCars(delta) {
    const limit = 980;

    for (const car of cars) {
      const distance =
        car.speed *
        delta *
        car.direction;

      if (car.axis === "x") {
        car.group.position.x +=
          distance;

        if (
          car.group.position.x >
          limit
        ) {
          car.group.position.x =
            -limit;
        }

        if (
          car.group.position.x <
          -limit
        ) {
          car.group.position.x =
            limit;
        }
      } else {
        car.group.position.z +=
          distance;

        if (
          car.group.position.z >
          limit
        ) {
          car.group.position.z =
            -limit;
        }

        if (
          car.group.position.z <
          -limit
        ) {
          car.group.position.z =
            limit;
        }
      }
    }
  }

  function updateMovement(delta) {
    const amount =
      260 * delta;

    const forwardX =
      -Math.sin(cameraYaw);

    const forwardZ =
      -Math.cos(cameraYaw);

    const rightX =
      Math.cos(cameraYaw);

    const rightZ =
      -Math.sin(cameraYaw);

    if (
      keys.has("w") ||
      keys.has("arrowup")
    ) {
      cameraTarget.x +=
        forwardX * amount;

      cameraTarget.z +=
        forwardZ * amount;
    }

    if (
      keys.has("s") ||
      keys.has("arrowdown")
    ) {
      cameraTarget.x -=
        forwardX * amount;

      cameraTarget.z -=
        forwardZ * amount;
    }

    if (
      keys.has("a") ||
      keys.has("arrowleft")
    ) {
      cameraTarget.x -=
        rightX * amount;

      cameraTarget.z -=
        rightZ * amount;
    }

    if (
      keys.has("d") ||
      keys.has("arrowright")
    ) {
      cameraTarget.x +=
        rightX * amount;

      cameraTarget.z +=
        rightZ * amount;
    }

    cameraTarget.x =
      THREE.MathUtils.clamp(
        cameraTarget.x,
        -800,
        800
      );

    cameraTarget.z =
      THREE.MathUtils.clamp(
        cameraTarget.z,
        -800,
        800
      );
  }

  function resize() {
    const width =
      root.clientWidth || 1;

    const height =
      root.clientHeight || 1;

    camera.aspect =
      width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
      width,
      height,
      false
    );
  }

  function resetCamera() {
    cameraYaw =
      defaultCamera.yaw;

    cameraPitch =
      defaultCamera.pitch;

    cameraDistance =
      defaultCamera.distance;

    cameraTarget.set(
      defaultCamera.targetX,
      0,
      defaultCamera.targetZ
    );

    updateCamera();
  }

  function zoom(amount) {
    cameraDistance =
      THREE.MathUtils.clamp(
        cameraDistance + amount,
        260,
        1300
      );

    updateCamera();
  }

  function pointerDown(event) {
    pointer.active = true;
    pointer.x = event.clientX;
    pointer.y = event.clientY;

    try {
      canvas.setPointerCapture(
        event.pointerId
      );
    } catch {}
  }

  function pointerMove(event) {
    if (!pointer.active) {
      return;
    }

    const dx =
      event.clientX -
      pointer.x;

    const dy =
      event.clientY -
      pointer.y;

    pointer.x =
      event.clientX;

    pointer.y =
      event.clientY;

    cameraYaw -=
      dx * 0.006;

    cameraPitch +=
      dy * 0.004;

    cameraPitch =
      THREE.MathUtils.clamp(
        cameraPitch,
        0.32,
        1.35
      );

    updateCamera();
  }

  function pointerUp(event) {
    pointer.active = false;

    try {
      canvas.releasePointerCapture(
        event.pointerId
      );
    } catch {}
  }

  function touchStart(event) {
    for (
      const touch of event.changedTouches
    ) {
      touches.set(
        touch.identifier,
        {
          x: touch.clientX,
          y: touch.clientY
        }
      );
    }

    if (touches.size === 2) {
      const values =
        Array.from(
          touches.values()
        );

      pinchDistance =
        Math.hypot(
          values[0].x -
            values[1].x,
          values[0].y -
            values[1].y
        );
    }
  }

  function touchMove(event) {
    event.preventDefault();

    for (
      const touch of event.changedTouches
    ) {
      if (
        touches.has(
          touch.identifier
        )
      ) {
        touches.set(
          touch.identifier,
          {
            x: touch.clientX,
            y: touch.clientY
          }
        );
      }
    }

    if (touches.size === 2) {
      const values =
        Array.from(
          touches.values()
        );

      const distance =
        Math.hypot(
          values[0].x -
            values[1].x,
          values[0].y -
            values[1].y
        );

      if (
        pinchDistance !== null
      ) {
        const difference =
          pinchDistance -
          distance;

        cameraDistance =
          THREE.MathUtils.clamp(
            cameraDistance +
              difference * 1.2,
            260,
            1300
          );

        updateCamera();
      }

      pinchDistance =
        distance;
    }
  }

  function touchEnd(event) {
    for (
      const touch of event.changedTouches
    ) {
      touches.delete(
        touch.identifier
      );
    }

    if (touches.size < 2) {
      pinchDistance = null;
    }
  }

  function pressMove(direction) {
    const distance = 100;

    const forwardX =
      -Math.sin(cameraYaw);

    const forwardZ =
      -Math.cos(cameraYaw);

    const rightX =
      Math.cos(cameraYaw);

    const rightZ =
      -Math.sin(cameraYaw);

    if (
      direction === "up"
    ) {
      cameraTarget.x +=
        forwardX * distance;

      cameraTarget.z +=
        forwardZ * distance;
    }

    if (
      direction === "down"
    ) {
      cameraTarget.x -=
        forwardX * distance;

      cameraTarget.z -=
        forwardZ * distance;
    }

    if (
      direction === "left"
    ) {
      cameraTarget.x -=
        rightX * distance;

      cameraTarget.z -=
        rightZ * distance;
    }

    if (
      direction === "right"
    ) {
      cameraTarget.x +=
        rightX * distance;

      cameraTarget.z +=
        rightZ * distance;
    }

    cameraTarget.x =
      THREE.MathUtils.clamp(
        cameraTarget.x,
        -800,
        800
      );

    cameraTarget.z =
      THREE.MathUtils.clamp(
        cameraTarget.z,
        -800,
        800
      );

    updateCamera();
  }

  function animate() {
    if (!running) {
      return;
    }

    animationFrame =
      requestAnimationFrame(
        animate
      );

    const delta =
      Math.min(
        clock.getDelta(),
        0.05
      );

    updateTime(delta);
    updateCars(delta);
    updateMovement(delta);
    updateCamera();

    renderer.render(
      scene,
      camera
    );
  }

  function onKeyDown(event) {
    const key =
      String(
        event.key
      ).toLowerCase();

    keys.add(key);
  }

  function onKeyUp(event) {
    const key =
      String(
        event.key
      ).toLowerCase();

    keys.delete(key);
  }

  function bindButton(
    selector,
    direction
  ) {
    const button =
      root.querySelector(
        selector
      );

    if (!button) {
      return;
    }

    const handler =
      () => pressMove(
        direction
      );

    button.addEventListener(
      "click",
      handler
    );

    cleanup.push(
      () =>
        button.removeEventListener(
          "click",
          handler
        )
    );
  }

  const cleanup = [];

  buildCity();
  resetCamera();
  resize();

  window.addEventListener(
    "resize",
    resize
  );

  window.addEventListener(
    "keydown",
    onKeyDown
  );

  window.addEventListener(
    "keyup",
    onKeyUp
  );

  canvas.addEventListener(
    "pointerdown",
    pointerDown
  );

  canvas.addEventListener(
    "pointermove",
    pointerMove
  );

  canvas.addEventListener(
    "pointerup",
    pointerUp
  );

  canvas.addEventListener(
    "pointercancel",
    pointerUp
  );

  canvas.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();

      zoom(
        event.deltaY * 0.35
      );
    },
    {
      passive: false
    }
  );

  canvas.addEventListener(
    "touchstart",
    touchStart,
    {
      passive: false
    }
  );

  canvas.addEventListener(
    "touchmove",
    touchMove,
    {
      passive: false
    }
  );

  canvas.addEventListener(
    "touchend",
    touchEnd
  );

  canvas.addEventListener(
    "touchcancel",
    touchEnd
  );

  bindButton(
    ".city-up",
    "up"
  );

  bindButton(
    ".city-down",
    "down"
  );

  bindButton(
    ".city-left",
    "left"
  );

  bindButton(
    ".city-right",
    "right"
  );

  const zoomIn =
    root.querySelector(
      ".city-zoom-in"
    );

  const zoomOut =
    root.querySelector(
      ".city-zoom-out"
    );

  const cameraButton =
    root.querySelector(
      ".city-camera"
    );

  zoomIn.addEventListener(
    "click",
    () => zoom(-100)
  );

  zoomOut.addEventListener(
    "click",
    () => zoom(100)
  );

  cameraButton.addEventListener(
    "click",
    resetCamera
  );

  cleanup.push(
    () =>
      zoomIn.removeEventListener(
        "click",
        () => zoom(-100)
      )
  );

  cleanup.push(
    () =>
      zoomOut.removeEventListener(
        "click",
        () => zoom(100)
      )
  );

  cleanup.push(
    () =>
      cameraButton.removeEventListener(
        "click",
        resetCamera
      )
  );

  animate();

  return () => {
    running = false;

    cancelAnimationFrame(
      animationFrame
    );

    window.removeEventListener(
      "resize",
      resize
    );

    window.removeEventListener(
      "keydown",
      onKeyDown
    );

    window.removeEventListener(
      "keyup",
      onKeyUp
    );

    canvas.removeEventListener(
      "pointerdown",
      pointerDown
    );

    canvas.removeEventListener(
      "pointermove",
      pointerMove
    );

    canvas.removeEventListener(
      "pointerup",
      pointerUp
    );

    canvas.removeEventListener(
      "pointercancel",
      pointerUp
    );

    canvas.removeEventListener(
      "touchstart",
      touchStart
    );

    canvas.removeEventListener(
      "touchmove",
      touchMove
    );

    canvas.removeEventListener(
      "touchend",
      touchEnd
    );

    canvas.removeEventListener(
      "touchcancel",
      touchEnd
    );

    cleanup.forEach(
      (fn) => {
        try {
          fn();
        } catch {}
      }
    );

    for (
      const geometry of
      disposableGeometries
    ) {
      try {
        geometry.dispose();
      } catch {}
    }

    for (
      const mat of
      disposableMaterials
    ) {
      try {
        mat.dispose();
      } catch {}
    }

    renderer.dispose();
    scene.clear();
  };
}

registerGame({
  id: "obsidian-city",
  name: "Obsidian City",
  category: "Cidade",
  icon: "🏙️",

  init({ container }) {
    container.innerHTML =
      OBSIDIAN_CITY_HTML;

    return createCity(
      container
    );
  }
});
