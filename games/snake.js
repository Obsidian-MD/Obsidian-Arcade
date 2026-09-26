import * as THREE from "./lib/three/three.module.js";
import { registerGame } from "../arcade.js";

export const SNAKE_HTML = String.raw`
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

  #snakeGame{
    position:relative;
    width:100%;
    height:100%;
    min-height:100%;
    overflow:hidden;
    background:#020308;
    touch-action:none;
  }

  #snakeCanvas{
    position:absolute;
    inset:0;
    width:100%;
    height:100%;
    display:block;
    touch-action:none;
  }

  .snakeHud{
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

  .snakeStats{
    display:flex;
    flex-wrap:wrap;
    gap:6px;
    max-width:calc(100% - 65px);
  }

  .snakeStat{
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

  .snakeStat b{
    color:#67e8f9;
    margin-left:3px;
  }

  .snakeActions{
    display:flex;
    gap:6px;
    pointer-events:auto;
  }

  .snakeBtn{
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

  .snakeBtn:active{
    transform:scale(.94);
    background:rgba(30,40,65,.95);
  }

  .snakeMinimap{
    position:absolute;
    top:68px;
    right:10px;
    z-index:18;
    width:174px;
    padding:7px;
    border-radius:14px;
    background:rgba(3,6,13,.82);
    border:1px solid rgba(255,255,255,.13);
    backdrop-filter:blur(8px);
    box-shadow:0 6px 24px rgba(0,0,0,.4);
    pointer-events:none;
  }

  .snakeMinimapTitle{
    text-align:center;
    color:#dbeafe;
    font-size:9px;
    font-weight:900;
    letter-spacing:1.5px;
    margin-bottom:5px;
  }

  #snakeMinimapCanvas{
    width:158px;
    height:158px;
    display:block;
    border-radius:9px;
    background:#050913;
  }

  .snakeLegend{
    display:flex;
    flex-wrap:wrap;
    justify-content:center;
    gap:3px 7px;
    margin-top:5px;
    color:#cbd5e1;
    font-size:7px;
    font-weight:700;
  }

  .legendItem{
    display:flex;
    align-items:center;
    gap:3px;
  }

  .legendDot{
    width:6px;
    height:6px;
    border-radius:50%;
  }

  .snakeRanking{
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

  .rankingTitle{
    font-size:9px;
    font-weight:900;
    letter-spacing:1px;
    color:#94a3b8;
    margin-bottom:5px;
  }

  .rankingRow{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:8px;
    font-size:9px;
    padding:2px 0;
  }

  .rankingName{
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }

  .rankingScore{
    color:#67e8f9;
    font-weight:900;
  }

  .snakeBoost{
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

  .snakeBoost.show{
    opacity:1;
  }

  .snakeOverlay{
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

  .snakeOverlay.hidden{
    display:none;
  }

  .snakePanel{
    width:min(390px,92vw);
    padding:25px 20px;
    border-radius:22px;
    text-align:center;
    background:linear-gradient(145deg,rgba(9,15,28,.97),rgba(2,5,12,.97));
    border:1px solid rgba(103,232,249,.22);
    box-shadow:0 20px 70px rgba(0,0,0,.65);
    color:#fff;
  }

  .snakeLogo{
    font-size:48px;
    margin-bottom:7px;
  }

  .snakePanel h1{
    margin:0 0 8px;
    font-size:25px;
  }

  .snakePanel p{
    margin:7px 0;
    color:#94a3b8;
    font-size:12px;
    line-height:1.55;
  }

  .snakeStart{
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

  .snakeStart:active{
    transform:scale(.98);
  }

  .gameOverScore{
    font-size:34px;
    font-weight:900;
    color:#67e8f9;
    margin:12px 0;
  }

  .snakeHint{
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
    .snakeMinimap{
      width:148px;
    }

    #snakeMinimapCanvas{
      width:132px;
      height:132px;
    }

    .snakeStats{
      max-width:calc(100% - 60px);
    }

    .snakeStat{
      font-size:9px;
      padding:6px 7px;
    }

    .snakeRanking{
      width:145px;
    }
  }
</style>

<div id="snakeGame">

  <canvas id="snakeCanvas"></canvas>

  <div class="snakeHud">
    <div class="snakeStats">
      <div class="snakeStat">
        Tamanho <b id="snakeSize">5</b>
      </div>

      <div class="snakeStat">
        Comida <b id="snakeFood">0</b>
      </div>

      <div class="snakeStat">
        Inimigos <b id="snakeEnemies">5</b>
      </div>
    </div>

    <div class="snakeActions">
      <button
        class="snakeBtn"
        id="snakePause"
        type="button"
      >
        Ⅱ
      </button>
    </div>
  </div>

  <div
    class="snakeBoost"
    id="snakeBoost"
  >
    ⚡ TURBO
  </div>

  <div class="snakeMinimap">
    <div class="snakeMinimapTitle">
      MAPA
    </div>

    <canvas
      id="snakeMinimapCanvas"
      width="316"
      height="316"
    ></canvas>

    <div class="snakeLegend">
      <span class="legendItem">
        <i
          class="legendDot"
          style="background:#ff4d4d"
        ></i>
        Comum
      </span>

      <span class="legendItem">
        <i
          class="legendDot"
          style="background:#42d9ff"
        ></i>
        Rara
      </span>

      <span class="legendItem">
        <i
          class="legendDot"
          style="background:#ffd42a"
        ></i>
        Turbo
      </span>

      <span class="legendItem">
        <i
          class="legendDot"
          style="background:#ff6420"
        ></i>
        Especial
      </span>

      <span class="legendItem">
        <i
          class="legendDot"
          style="background:#ff55ff"
        ></i>
        Lendária
      </span>
    </div>
  </div>

  <div class="snakeRanking">
    <div class="rankingTitle">
      RANKING
    </div>

    <div id="snakeRankingList"></div>
  </div>

  <div class="snakeHint">
    Arraste para virar • Pinça para aproximar/afastar
  </div>

  <div
    class="snakeOverlay"
    id="snakeStartOverlay"
  >
    <div class="snakePanel">

      <div class="snakeLogo">
        🐍
      </div>

      <h1>
        Snake 3D
      </h1>

      <p>
        Cresça comendo diferentes tipos de comida,
        encontre as cobrinhas inimigas e acompanhe
        tudo pelo mapa.
      </p>

      <p>
        Arraste o dedo na direção desejada para virar.
      </p>

      <button
        class="snakeStart"
        id="snakeStart"
        type="button"
      >
        COMEÇAR
      </button>

    </div>
  </div>

  <div
    class="snakeOverlay hidden"
    id="snakeGameOver"
  >
    <div class="snakePanel">

      <div class="snakeLogo">
        💀
      </div>

      <h1>
        Fim de jogo
      </h1>

      <div
        class="gameOverScore"
        id="snakeFinalScore"
      >
        0
      </div>

      <p id="snakeFinalText">
        Sua cobra foi eliminada.
      </p>

      <button
        class="snakeStart"
        id="snakeRestart"
        type="button"
      >
        JOGAR NOVAMENTE
      </button>

    </div>
  </div>

</div>
`;

registerGame({
  id: "snake",
  name: "Snake 3D",
  category: "Arcade",
  icon: "🐍",

  init({ container }) {
    container.innerHTML =
      SNAKE_HTML;

    const canvas =
      container.querySelector(
        "#snakeCanvas"
      );

    const minimapCanvas =
      container.querySelector(
        "#snakeMinimapCanvas"
      );

    const minimapCtx =
      minimapCanvas.getContext(
        "2d"
      );

    const sizeEl =
      container.querySelector(
        "#snakeSize"
      );

    const foodEl =
      container.querySelector(
        "#snakeFood"
      );

    const enemiesEl =
      container.querySelector(
        "#snakeEnemies"
      );

    const rankingEl =
      container.querySelector(
        "#snakeRankingList"
      );

    const boostEl =
      container.querySelector(
        "#snakeBoost"
      );

    const startOverlay =
      container.querySelector(
        "#snakeStartOverlay"
      );

    const gameOverOverlay =
      container.querySelector(
        "#snakeGameOver"
      );

    const startButton =
      container.querySelector(
        "#snakeStart"
      );

    const restartButton =
      container.querySelector(
        "#snakeRestart"
      );

    const pauseButton =
      container.querySelector(
        "#snakePause"
      );

    const finalScoreEl =
      container.querySelector(
        "#snakeFinalScore"
      );

    const finalTextEl =
      container.querySelector(
        "#snakeFinalText"
      );

    const renderer =
      new THREE.WebGLRenderer({
        canvas,
        antialias:true,
        powerPreference:
          "high-performance",
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        1.8
      )
    );

    renderer.setSize(
      canvas.clientWidth ||
        window.innerWidth,
      canvas.clientHeight ||
        window.innerHeight,
      false
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    const scene =
      new THREE.Scene();

    scene.background =
      new THREE.Color(
        0x02050b
      );

    const camera =
      new THREE.PerspectiveCamera(
        58,
        1,
        0.1,
        3000
      );

    camera.position.set(
      0,
      44,
      0.01
    );

    camera.lookAt(
      0,
      0,
      0
    );

    const ambientLight =
      new THREE.HemisphereLight(
        0x9ddcff,
        0x07101d,
        1.7
      );

    scene.add(
      ambientLight
    );

    const directionalLight =
      new THREE.DirectionalLight(
        0xffffff,
        2.1
      );

    directionalLight.position.set(
      30,
      70,
      20
    );

    scene.add(
      directionalLight
    );

    const fillLight =
      new THREE.PointLight(
        0x2f8cff,
        2.5,
        180
      );

    fillLight.position.set(
      0,
      20,
      0
    );

    scene.add(
      fillLight
    );

    const groundMaterial =
      new THREE.MeshStandardMaterial({
        color:0x05080d,
        roughness:1,
        metalness:0,
      });

    const ground =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          10000,
          10000
        ),
        groundMaterial
      );

    ground.rotation.x =
      -Math.PI / 2;

    ground.position.y =
      -0.35;

    scene.add(
      ground
    );

    const worldGlowMaterial =
      new THREE.MeshBasicMaterial({
        color:0x07111f,
        transparent:true,
        opacity:0.5,
      });

    const worldGlow =
      new THREE.Mesh(
        new THREE.CircleGeometry(
          1500,
          96
        ),
        worldGlowMaterial
      );

    worldGlow.rotation.x =
      -Math.PI / 2;

    worldGlow.position.y =
      -0.3;

    scene.add(
      worldGlow
    );

    const FOOD_TYPES = [
      {
        id:"common",
        name:"Comum",
        color:0xff4d4d,
        glow:0xff1e1e,
        value:1,
        growth:1,
        speed:1,
        duration:0,
        size:0.48,
        weight:48,
      },

      {
        id:"rare",
        name:"Rara",
        color:0x42d9ff,
        glow:0x008cff,
        value:3,
        growth:2,
        speed:1,
        duration:0,
        size:0.56,
        weight:25,
      },

      {
        id:"turbo",
        name:"Turbo",
        color:0xffd42a,
        glow:0xff8a00,
        value:2,
        growth:1,
        speed:1.42,
        duration:5,
        size:0.53,
        weight:14,
      },

      {
        id:"special",
        name:"Especial",
        color:0xff6420,
        glow:0xff1600,
        value:5,
        growth:3,
        speed:1.16,
        duration:4,
        size:0.62,
        weight:9,
      },

      {
        id:"legendary",
        name:"Lendária",
        color:0xff55ff,
        glow:0xff00ff,
        value:10,
        growth:5,
        speed:1.25,
        duration:6,
        size:0.74,
        weight:4,
      },
    ];

    const PLAYER_SPEED =
      8.4;

    const ENEMY_SPEED =
      6.3;

    const MAX_FOOD =
      32;

    const ENEMY_COUNT =
      5;

    const MINIMAP_RANGE =
      85;

    let running =
      false;

    let paused =
      false;

    let destroyed =
      false;

    let animationId =
      null;

    let lastTime =
      performance.now();

    let cameraDistance =
      44;

    let playerBoostUntil =
      0;

    let playerSpeedMultiplier =
      1;

    let foodCollected =
      0;

    let score =
      0;

    let swiping =
      false;

    let pinchActive =
      false;

    let touchStartX =
      0;

    let touchStartY =
      0;

    let pinchStartDistance =
      0;

    let pinchStartCameraDistance =
      cameraDistance;

    const desiredDirection =
      new THREE.Vector3(
        1,
        0,
        0
      );

    const playerDirection =
      new THREE.Vector3(
        1,
        0,
        0
      );

    const player = {
      head:null,

      segments:[],

      position:
        new THREE.Vector3(
          0,
          0,
          0
        ),

      direction:
        playerDirection.clone(),

      radius:0.72,

      growthQueue:0,
    };

    const foods = [];

    const enemies = [];

    const tempVector =
      new THREE.Vector3();

    const tempVector2 =
      new THREE.Vector3();

    const tempVector3 =
      new THREE.Vector3();

    function random(
      min,
      max
    ) {
      return (
        Math.random() *
          (max - min) +
        min
      );
    }

    function distance2D(
      a,
      b
    ) {
      const dx =
        a.x - b.x;

      const dz =
        a.z - b.z;

      return Math.sqrt(
        dx * dx +
        dz * dz
      );
    }

    function normalizeDirection(
      direction
    ) {
      direction.y = 0;

      if (
        direction.lengthSq() <
        0.00001
      ) {
        direction.set(
          1,
          0,
          0
        );

        return direction;
      }

      direction.normalize();

      return direction;
    }

    function weightedFoodType() {
      const total =
        FOOD_TYPES.reduce(
          (
            sum,
            item
          ) =>
            sum +
            item.weight,
          0
        );

      let value =
        Math.random() *
        total;

      for (
        const type
        of FOOD_TYPES
      ) {
        value -=
          type.weight;

        if (
          value <= 0
        ) {
          return type;
        }
      }

      return FOOD_TYPES[0];
    }

    function createFood() {
      const type =
        weightedFoodType();

      const geometry =
        new THREE.IcosahedronGeometry(
          type.size,
          1
        );

      const material =
        new THREE.MeshStandardMaterial({
          color:type.color,
          emissive:type.glow,
          emissiveIntensity:1.7,
          roughness:0.3,
          metalness:0.25,
        });

      const mesh =
        new THREE.Mesh(
          geometry,
          material
        );

      const angle =
        Math.random() *
        Math.PI *
        2;

      const radius =
        random(
          7,
          105
        );

      mesh.position.set(
        player.position.x +
          Math.cos(angle) *
            radius,

        0.4,

        player.position.z +
          Math.sin(angle) *
            radius
      );

      mesh.userData.foodType =
        type;

      mesh.userData.phase =
        Math.random() *
        Math.PI *
        2;

      mesh.userData.baseY =
        0.4;

      scene.add(
        mesh
      );

      foods.push(
        mesh
      );

      return mesh;
    }

    function ensureFoodCount() {
      while (
        foods.length <
        MAX_FOOD
      ) {
        createFood();
      }
    }

    function disposeFood(
      food
    ) {
      if (!food) {
        return;
      }

      scene.remove(
        food
      );

      if (
        food.geometry
      ) {
        food.geometry.dispose();
      }

      if (
        food.material
      ) {
        food.material.dispose();
      }
    }

    function respawnFood(
      food
    ) {
      const index =
        foods.indexOf(
          food
        );

      if (
        index !== -1
      ) {
        disposeFood(
          food
        );

        foods.splice(
          index,
          1
        );
      }

      createFood();
    }

    function createSnakeMaterial(
      color
    ) {
      return new THREE.MeshStandardMaterial({
        color,
        emissive:color,
        emissiveIntensity:0.34,
        roughness:0.34,
        metalness:0.18,
      });
    }

    function createSnakeSegment(
      position,
      radius,
      color
    ) {
      const geometry =
        new THREE.SphereGeometry(
          radius,
          12,
          10
        );

      const mesh =
        new THREE.Mesh(
          geometry,
          createSnakeMaterial(
            color
          )
        );

      mesh.position.copy(
        position
      );

      scene.add(
        mesh
      );

      return mesh;
    }

    function playerColorAt(
      index
    ) {
      const length =
        Math.max(
          player.segments.length -
            1,
          1
        );

      const t =
        index /
        length;

      const color =
        new THREE.Color();

      color.setHSL(
        (
          0.48 +
          t * 0.34
        ) % 1,
        0.9,
        0.52
      );

      return color;
    }

    function refreshPlayerColors() {
      for (
        let i = 0;
        i <
        player.segments.length;
        i++
      ) {
        const mesh =
          player.segments[i];

        const color =
          playerColorAt(
            i
          );

        mesh.material.color.copy(
          color
        );

        mesh.material.emissive.copy(
          color
        );
      }
    }

    function clearPlayer() {
      for (
        const segment
        of player.segments
      ) {
        scene.remove(
          segment
        );

        segment.geometry.dispose();

        segment.material.dispose();
      }

      player.segments.length =
        0;

      player.head =
        null;
    }

    function createPlayer() {
      clearPlayer();

      player.position.set(
        0,
        0,
        0
      );

      player.direction.set(
        1,
        0,
        0
      );

      desiredDirection.set(
        1,
        0,
        0
      );

      player.growthQueue =
        0;

      const initialLength =
        7;

      for (
        let i = 0;
        i <
        initialLength;
        i++
      ) {
        const position =
          new THREE.Vector3(
            -i * 1.25,
            0.5,
            0
          );

        const segment =
          createSnakeSegment(
            position,
            player.radius,
            0x20e6d0
          );

        player.segments.push(
          segment
        );
      }

      player.head =
        player.segments[0];

      refreshPlayerColors();
    }

    function enemyColor(
      index
    ) {
      const colors = [
        0xff3b81,
        0x8b5cf6,
        0x22c55e,
        0xf97316,
        0x38bdf8,
      ];

      return colors[
        index %
          colors.length
      ];
    }

    function clearEnemy(
      enemy
    ) {
      for (
        const segment
        of enemy.segments
      ) {
        scene.remove(
          segment
        );

        if (
          segment.geometry
        ) {
          segment.geometry.dispose();
        }

        if (
          segment.material
        ) {
          segment.material.dispose();
        }
      }

      enemy.segments.length =
        0;

      enemy.head =
        null;
    }

    function getEnemySpawnPosition(
      index
    ) {
      let position =
        new THREE.Vector3();

      for (
        let attempt = 0;
        attempt < 30;
        attempt++
      ) {
        const angle =
          (
            index /
              ENEMY_COUNT
          ) *
            Math.PI *
            2 +
          random(
            -0.45,
            0.45
          );

        const radius =
          random(
            14,
            27
          );

        position.set(
          player.position.x +
            Math.cos(angle) *
              radius,

          0,

          player.position.z +
            Math.sin(angle) *
              radius
        );

        if (
          distance2D(
            position,
            player.position
          ) >
          11
        ) {
          let valid =
            true;

          for (
            const enemy
            of enemies
          ) {
            if (
              enemy.alive &&
              distance2D(
                position,
                enemy.position
              ) <
                8
            ) {
              valid =
                false;

              break;
            }
          }

          if (
            valid
          ) {
            return position;
          }
        }
      }

      return position;
    }

    function createEnemy(
      index
    ) {
      const enemy = {
        id:index,

        name:
          "Cobra " +
          (index + 1),

        color:
          enemyColor(
            index
          ),

        segments:[],

        head:null,

        position:
          new THREE.Vector3(),

        direction:
          new THREE.Vector3(
            1,
            0,
            0
          ),

        target:
          new THREE.Vector3(),

        alive:false,

        respawnTimer:0,

        radius:0.68,

        growthQueue:0,

        score:0,

        food:0,

        boostUntil:0,

        speedMultiplier:1,

        turnTimer:0,

        wanderTimer:0,
      };

      enemies.push(
        enemy
      );

      respawnEnemy(
        enemy,
        true
      );

      return enemy;
    }

    function respawnEnemy(
      enemy,
      immediate = false
    ) {
      clearEnemy(
        enemy
      );

      const spawn =
        getEnemySpawnPosition(
          enemy.id
        );

      enemy.position.copy(
        spawn
      );

      const angle =
        Math.atan2(
          player.position.z -
            spawn.z,

          player.position.x -
            spawn.x
        );

      enemy.direction.set(
        Math.cos(angle),
        0,
        Math.sin(angle)
      );

      if (
        Math.random() <
        0.5
      ) {
        enemy.direction.multiplyScalar(
          -1
        );
      }

      enemy.direction.normalize();

      enemy.target.copy(
        enemy.position
      );

      const length =
        7 +
        Math.floor(
          Math.random() *
            3
        );

      for (
        let i = 0;
        i < length;
        i++
      ) {
        const position =
          spawn.clone().add(
            enemy.direction
              .clone()
              .multiplyScalar(
                -i * 1.18
              )
          );

        position.y =
          0.5;

        const segment =
          createSnakeSegment(
            position,
            enemy.radius,
            enemy.color
          );

        enemy.segments.push(
          segment
        );
      }

      enemy.head =
        enemy.segments[0];

      enemy.alive =
        true;

      enemy.respawnTimer =
        0;

      enemy.growthQueue =
        0;

      enemy.boostUntil =
        0;

      enemy.speedMultiplier =
        1;

      enemy.turnTimer =
        random(
          0.4,
          1.4
        );

      enemy.wanderTimer =
        random(
          0.5,
          2
        );

      if (
        !immediate
      ) {
        enemy.score =
          Math.max(
            0,
            enemy.score - 1
          );
      }
    }

    function killEnemy(
      enemy
    ) {
      if (
        !enemy.alive
      ) {
        return;
      }

      clearEnemy(
        enemy
      );

      enemy.alive =
        false;

      enemy.respawnTimer =
        1.8 +
        Math.random() *
          1.8;
    }

    function moveSegments(
      segments,
      direction,
      speed,
      delta
    ) {
      if (
        !segments.length
      ) {
        return;
      }

      const head =
        segments[0];

      const movement =
        direction
          .clone()
          .multiplyScalar(
            speed *
              delta
          );

      head.position.add(
        movement
      );

      head.position.y =
        0.52;

      for (
        let i = 1;
        i <
        segments.length;
        i++
      ) {
        const current =
          segments[i];

        const previous =
          segments[i - 1];

        const dx =
          previous.position.x -
          current.position.x;

        const dz =
          previous.position.z -
          current.position.z;

        const distance =
          Math.sqrt(
            dx * dx +
            dz * dz
          );

        const wanted =
          1.18;

        if (
          distance >
          wanted
        ) {
          const ratio =
            Math.min(
              1,
              (
                distance -
                wanted
              ) /
                Math.max(
                  distance,
                  0.001
                )
            );

          current.position.x +=
            dx * ratio;

          current.position.z +=
            dz * ratio;
        }

        current.position.y =
          0.5;
      }

      return head.position;
    }

    function steerSmoothly(
      current,
      target,
      amount
    ) {
      const angleCurrent =
        Math.atan2(
          current.z,
          current.x
        );

      const angleTarget =
        Math.atan2(
          target.z,
          target.x
        );

      let difference =
        angleTarget -
        angleCurrent;

      while (
        difference >
        Math.PI
      ) {
        difference -=
          Math.PI * 2;
      }

      while (
        difference <
        -Math.PI
      ) {
        difference +=
          Math.PI * 2;
      }

      const next =
        angleCurrent +
        difference *
          Math.min(
            1,
            amount
          );

      current.set(
        Math.cos(next),
        0,
        Math.sin(next)
      );

      current.normalize();
    }

    function turnPlayer(
      screenX,
      screenY
    ) {
      const length =
        Math.sqrt(
          screenX *
            screenX +
          screenY *
            screenY
        );

      if (
        length <
        0.001
      ) {
        return;
      }

      screenX /=
        length;

      screenY /=
        length;

      /*
       * A câmera está sempre exatamente
       * acima do campo.
       *
       * Isso deixa o gesto independente
       * da direção atual da cobra.
       */

      const cameraRight =
        new THREE.Vector3();

      const cameraUp =
        new THREE.Vector3();

      const cameraForward =
        new THREE.Vector3();

      camera.matrixWorld.extractBasis(
        cameraRight,
        cameraUp,
        cameraForward
      );

      cameraRight.y =
        0;

      cameraRight.normalize();

      /*
       * Vetor correspondente
       * ao "cima" da tela no chão.
       */
      const screenUpGround =
        new THREE.Vector3()
          .crossVectors(
            cameraRight,
            new THREE.Vector3(
              0,
              1,
              0
            )
          );

      screenUpGround.y =
        0;

      if (
        screenUpGround.lengthSq() <
        0.001
      ) {
        screenUpGround.set(
          0,
          0,
          1
        );
      }

      screenUpGround.normalize();

      const direction =
        new THREE.Vector3();

      direction.addScaledVector(
        cameraRight,
        screenX
      );

      direction.addScaledVector(
        screenUpGround,
        screenY
      );

      direction.y =
        0;

      if (
        direction.lengthSq() <
        0.001
      ) {
        return;
      }

      direction.normalize();

      desiredDirection.copy(
        direction
      );
    }

    function updatePlayer(
      delta,
      time
    ) {
      if (
        !player.head
      ) {
        return;
      }

      steerSmoothly(
        player.direction,
        desiredDirection,
        Math.min(
          1,
          delta * 9
        )
      );

      const boostActive =
        time <
        playerBoostUntil;

      const speed =
        PLAYER_SPEED *
        (
          boostActive
            ? playerSpeedMultiplier
            : 1
        );

      moveSegments(
        player.segments,
        player.direction,
        speed,
        delta
      );

      player.position.copy(
        player.head.position
      );

      if (
        player.growthQueue >
        0
      ) {
        const last =
          player.segments[
            player.segments.length - 1
          ];

        const segment =
          createSnakeSegment(
            last.position.clone(),
            player.radius,
            0x20e6d0
          );

        player.segments.push(
          segment
        );

        player.growthQueue--;

        refreshPlayerColors();
      }

      if (
        !boostActive
      ) {
        playerSpeedMultiplier =
          1;

        boostEl.classList.remove(
          "show"
        );
      }
    }

    function findNearestFood(
      position
    ) {
      let nearest =
        null;

      let nearestDistance =
        Infinity;

      for (
        const food
        of foods
      ) {
        const distance =
          distance2D(
            position,
            food.position
          );

        if (
          distance <
          nearestDistance
        ) {
          nearest =
            food;

          nearestDistance =
            distance;
        }
      }

      return nearest;
    }

    function updateEnemy(
      enemy,
      delta,
      time
    ) {
      if (
        !enemy.alive ||
        !enemy.head
      ) {
        return;
      }

      const head =
        enemy.head;

      enemy.position.copy(
        head.position
      );

      enemy.turnTimer -=
        delta;

      enemy.wanderTimer -=
        delta;

      const nearestFood =
        findNearestFood(
          enemy.position
        );

      if (
        nearestFood
      ) {
        enemy.target.copy(
          nearestFood.position
        );
      }

      if (
        distance2D(
          enemy.position,
          player.position
        ) <
        18
      ) {
        const away =
          enemy.position
            .clone()
            .sub(
              player.position
            );

        away.y = 0;

        if (
          away.lengthSq() >
          0.001
        ) {
          away.normalize();

          enemy.target
            .copy(
              enemy.position
            )
            .addScaledVector(
              away,
              18
            );
        }
      }

      if (
        enemy.turnTimer <=
        0
      ) {
        const desired =
          enemy.target
            .clone()
            .sub(
              enemy.position
            );

        desired.y = 0;

        if (
          desired.lengthSq() >
          0.001
        ) {
          desired.normalize();

          steerSmoothly(
            enemy.direction,
            desired,
            delta * 2.8
          );
        }

        enemy.turnTimer =
          random(
            0.35,
            0.9
          );
      }

      if (
        enemy.wanderTimer <=
        0
      ) {
        const randomAngle =
          random(
            -0.8,
            0.8
          );

        const x =
          enemy.direction.x;

        const z =
          enemy.direction.z;

        enemy.direction.set(
          x *
              Math.cos(
                randomAngle
              ) -
            z *
              Math.sin(
                randomAngle
              ),

          0,

          x *
              Math.sin(
                randomAngle
              ) +
            z *
              Math.cos(
                randomAngle
              )
        );

        enemy.direction.normalize();

        enemy.wanderTimer =
          random(
            1,
            2.8
          );
      }

      const speed =
        ENEMY_SPEED *
        (
          time <
          enemy.boostUntil
            ? enemy.speedMultiplier
            : 1
        );

      moveSegments(
        enemy.segments,
        enemy.direction,
        speed,
        delta
      );

      enemy.position.copy(
        enemy.head.position
      );

      if (
        enemy.growthQueue >
        0
      ) {
        const last =
          enemy.segments[
            enemy.segments.length - 1
          ];

        const segment =
          createSnakeSegment(
            last.position.clone(),
            enemy.radius,
            enemy.color
          );

        enemy.segments.push(
          segment
        );

        enemy.growthQueue--;
      }

      if (
        enemy.position.distanceTo(
          player.position
        ) >
        500
      ) {
        respawnEnemy(
          enemy
        );
      }
    }

    function applyFoodEffect(
      food,
      isPlayer,
      enemy = null,
      time = 0
    ) {
      const type =
        food.userData.foodType;

      if (!type) {
        return;
      }

      if (
        isPlayer
      ) {
        score +=
          type.value;

        foodCollected++;

        player.growthQueue +=
          type.growth;

        if (
          type.duration >
          0
        ) {
          playerBoostUntil =
            time +
            type.duration;

          playerSpeedMultiplier =
            type.speed;
        }

        arcadeSound(
          type.id ===
            "turbo"
            ? "score"
            : type.id ===
              "legendary"
              ? "win"
              : "eat"
        );

        respawnFood(
          food
        );

        return;
      }

      if (
        enemy
      ) {
        enemy.score +=
          type.value;

        enemy.food++;

        enemy.growthQueue +=
          type.growth;

        if (
          type.duration >
          0
        ) {
          enemy.boostUntil =
            time +
            type.duration;

          enemy.speedMultiplier =
            type.speed;
        }

        respawnFood(
          food
        );
      }
    }

    function checkFoodCollisions(
      time
    ) {
      if (
        !player.head
      ) {
        return;
      }

      for (
        let i =
          foods.length - 1;
        i >= 0;
        i--
      ) {
        const food =
          foods[i];

        if (
          player.head.position.distanceTo(
            food.position
          ) <
          player.radius +
            food.userData.foodType.size +
            0.35
        ) {
          applyFoodEffect(
            food,
            true,
            null,
            time
          );
        }
      }

      for (
        const enemy
        of enemies
      ) {
        if (
          !enemy.alive ||
          !enemy.head
        ) {
          continue;
        }

        for (
          let i =
            foods.length - 1;
          i >= 0;
          i--
        ) {
          const food =
            foods[i];

          if (
            enemy.head.position.distanceTo(
              food.position
            ) <
            enemy.radius +
              food.userData.foodType.size +
              0.3
          ) {
            applyFoodEffect(
              food,
              false,
              enemy,
              time
            );
          }
        }
      }
    }

    function checkEnemyCollisions() {
      if (
        !player.head
      ) {
        return false;
      }

      for (
        const enemy
        of enemies
      ) {
        if (
          !enemy.alive ||
          !enemy.head
        ) {
          continue;
        }

        const headDistance =
          player.head.position.distanceTo(
            enemy.head.position
          );

        if (
          headDistance <
          player.radius +
            enemy.radius
        ) {
          if (
            player.segments.length >=
            enemy.segments.length
          ) {
            killEnemy(
              enemy
            );

            player.growthQueue +=
              Math.max(
                2,
                Math.floor(
                  enemy.segments.length /
                    3
                )
              );

            score +=
              5;

            arcadeSound(
              "win"
            );
          } else {
            return true;
          }
        }

        for (
          let i = 1;
          i <
          enemy.segments.length;
          i++
        ) {
          if (
            player.head.position.distanceTo(
              enemy.segments[i].position
            ) <
            player.radius +
              enemy.radius *
                0.85
          ) {
            return true;
          }
        }
      }

      return false;
    }

    function checkEnemyEnemyCollisions() {
      for (
        let a = 0;
        a <
        enemies.length;
        a++
      ) {
        const first =
          enemies[a];

        if (
          !first.alive ||
          !first.head
        ) {
          continue;
        }

        for (
          let b = a + 1;
          b <
          enemies.length;
          b++
        ) {
          const second =
            enemies[b];

          if (
            !second.alive ||
            !second.head
          ) {
            continue;
          }

          if (
            first.head.position.distanceTo(
              second.head.position
            ) <
            first.radius +
              second.radius
          ) {
            if (
              first.segments.length >=
              second.segments.length
            ) {
              first.growthQueue +=
                Math.max(
                  1,
                  Math.floor(
                    second.segments.length /
                      4
                  )
                );

              killEnemy(
                second
              );
            } else {
              second.growthQueue +=
                Math.max(
                  1,
                  Math.floor(
                    first.segments.length /
                      4
                  )
                );

              killEnemy(
                first
              );
            }
          }
        }
      }
    }

    function updateEnemyRespawns(
      delta
    ) {
      for (
        const enemy
        of enemies
      ) {
        if (
          enemy.alive
        ) {
          continue;
        }

        enemy.respawnTimer -=
          delta;

        if (
          enemy.respawnTimer <=
          0
        ) {
          respawnEnemy(
            enemy
          );
        }
      }
    }

    function animateFoods(
      time
    ) {
      for (
        const food
        of foods
      ) {
        const type =
          food.userData.foodType;

        const phase =
          food.userData.phase;

        food.rotation.x +=
          0.018;

        food.rotation.y +=
          0.025;

        food.position.y =
          food.userData.baseY +
          Math.sin(
            time * 3 +
              phase
          ) *
            0.12;

        if (
          type.id ===
          "legendary"
        ) {
          const hue =
            (
              time * 0.12 +
              phase * 0.1
            ) % 1;

          const color =
            new THREE.Color();

          color.setHSL(
            hue,
            0.95,
            0.55
          );

          food.material.color.copy(
            color
          );

          food.material.emissive.copy(
            color
          );

          const pulse =
            1 +
            Math.sin(
              time * 5 +
                phase
            ) *
              0.12;

          food.scale.setScalar(
            pulse
          );
        } else {
          food.scale.setScalar(
            1
          );
        }
      }
    }

    function updateCamera() {
      if (
        !player.head
      ) {
        return;
      }

      /*
       * Câmera SEMPRE de cima.
       * Não existe mais modo alternativo.
       */

      camera.position.x =
        player.position.x;

      camera.position.y =
        player.position.y +
        cameraDistance;

      camera.position.z =
        player.position.z +
        0.01;

      camera.lookAt(
        player.position.x,
        0,
        player.position.z
      );
    }

    function drawMinimap() {
      const ctx =
        minimapCtx;

      const width =
        minimapCanvas.width;

      const height =
        minimapCanvas.height;

      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      ctx.fillStyle =
        "#050913";

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      const centerX =
        width / 2;

      const centerY =
        height / 2;

      const scale =
        width /
        (
          MINIMAP_RANGE *
          2
        );

      ctx.strokeStyle =
        "rgba(255,255,255,.06)";

      ctx.lineWidth =
        1;

      for (
        let i = 1;
        i <= 4;
        i++
      ) {
        const radius =
          (
            MINIMAP_RANGE *
            scale
          ) *
          (
            i / 4
          );

        ctx.beginPath();

        ctx.arc(
          centerX,
          centerY,
          radius,
          0,
          Math.PI * 2
        );

        ctx.stroke();
      }

      ctx.strokeStyle =
        "rgba(255,255,255,.045)";

      ctx.beginPath();

      ctx.moveTo(
        centerX,
        0
      );

      ctx.lineTo(
        centerX,
        height
      );

      ctx.moveTo(
        0,
        centerY
      );

      ctx.lineTo(
        width,
        centerY
      );

      ctx.stroke();

      function mapX(
        worldX
      ) {
        return (
          centerX +
          (
            worldX -
            player.position.x
          ) *
            scale
        );
      }

      function mapY(
        worldZ
      ) {
        return (
          centerY +
          (
            worldZ -
            player.position.z
          ) *
            scale
        );
      }

      for (
        const food
        of foods
      ) {
        const type =
          food.userData.foodType;

        const dx =
          food.position.x -
          player.position.x;

        const dz =
          food.position.z -
          player.position.z;

        if (
          Math.abs(dx) >
            MINIMAP_RANGE ||
          Math.abs(dz) >
            MINIMAP_RANGE
        ) {
          continue;
        }

        const x =
          mapX(
            food.position.x
          );

        const y =
          mapY(
            food.position.z
          );

        let color =
          "#" +
          type.color
            .toString(16)
            .padStart(
              6,
              "0"
            );

        if (
          type.id ===
          "legendary"
        ) {
          const hue =
            (
              performance.now() /
                1500
            ) % 1;

          const rainbow =
            new THREE.Color();

          rainbow.setHSL(
            hue,
            1,
            0.58
          );

          color =
            "#" +
            rainbow.getHexString();
        }

        ctx.fillStyle =
          color;

        const radius =
          type.id ===
          "legendary"
            ? 5
            : type.id ===
              "special"
              ? 4
              : 3;

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          radius,
          0,
          Math.PI * 2
        );

        ctx.fill();

        if (
          type.id ===
          "legendary"
        ) {
          ctx.strokeStyle =
            "rgba(255,255,255,.8)";

          ctx.lineWidth =
            1;

          ctx.stroke();
        }
      }

      for (
        const enemy
        of enemies
      ) {
        if (
          !enemy.alive ||
          !enemy.head
        ) {
          continue;
        }

        const dx =
          enemy.head.position.x -
          player.position.x;

        const dz =
          enemy.head.position.z -
          player.position.z;

        if (
          Math.abs(dx) >
            MINIMAP_RANGE ||
          Math.abs(dz) >
            MINIMAP_RANGE
        ) {
          continue;
        }

        ctx.strokeStyle =
          "#" +
          enemy.color
            .toString(16)
            .padStart(
              6,
              "0"
            );

        ctx.globalAlpha =
          0.55;

        ctx.lineWidth =
          3;

        ctx.beginPath();

        const visibleSegments =
          Math.min(
            enemy.segments.length,
            10
          );

        for (
          let i = 0;
          i <
          visibleSegments;
          i++
        ) {
          const segment =
            enemy.segments[i];

          const x =
            mapX(
              segment.position.x
            );

          const y =
            mapY(
              segment.position.z
            );

          if (
            i === 0
          ) {
            ctx.moveTo(
              x,
              y
            );
          } else {
            ctx.lineTo(
              x,
              y
            );
          }
        }

        ctx.stroke();

        ctx.globalAlpha =
          1;

        const hx =
          mapX(
            enemy.head.position.x
          );

        const hy =
          mapY(
            enemy.head.position.z
          );

        ctx.fillStyle =
          "#" +
          enemy.color
            .toString(16)
            .padStart(
              6,
              "0"
            );

        ctx.beginPath();

        ctx.arc(
          hx,
          hy,
          5,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }

      ctx.save();

      ctx.translate(
        centerX,
        centerY
      );

      const angle =
        Math.atan2(
          player.direction.z,
          player.direction.x
        );

      ctx.rotate(
        angle
      );

      ctx.fillStyle =
        "#20e6d0";

      ctx.beginPath();

      ctx.moveTo(
        9,
        0
      );

      ctx.lineTo(
        -7,
        -6
      );

      ctx.lineTo(
        -4,
        0
      );

      ctx.lineTo(
        -7,
        6
      );

      ctx.closePath();

      ctx.fill();

      ctx.restore();

      ctx.strokeStyle =
        "rgba(32,230,208,.55)";

      ctx.lineWidth =
        2;

      ctx.beginPath();

      ctx.arc(
        centerX,
        centerY,
        8,
        0,
        Math.PI * 2
      );

      ctx.stroke();
    }

    function updateHUD() {
      sizeEl.textContent =
        String(
          player.segments.length
        );

      foodEl.textContent =
        String(
          foodCollected
        );

      const aliveEnemies =
        enemies.filter(
          enemy =>
            enemy.alive
        ).length;

      enemiesEl.textContent =
        String(
          aliveEnemies
        );

      const ranking = [
        {
          name:"Você",
          score,
          length:
            player.segments.length,
          player:true,
        },
      ];

      for (
        const enemy
        of enemies
      ) {
        if (
          enemy.alive
        ) {
          ranking.push({
            name:
              enemy.name,
            score:
              enemy.score,
            length:
              enemy.segments.length,
            player:false,
            color:
              enemy.color,
          });
        }
      }

      ranking.sort(
        (a,b) =>
          b.length -
          a.length
      );

      rankingEl.innerHTML =
        ranking
          .slice(
            0,
            6
          )
          .map(
            (
              item,
              index
            ) => {
              const color =
                item.player
                  ? "#20e6d0"
                  : "#" +
                    item.color
                      .toString(
                        16
                      )
                      .padStart(
                        6,
                        "0"
                      );

              return `
                <div class="rankingRow">
                  <span
                    class="rankingName"
                    style="color:${color}"
                  >
                    ${index + 1}. ${item.name}
                  </span>

                  <span class="rankingScore">
                    ${item.length}
                  </span>
                </div>
              `;
            }
          )
          .join("");
    }

    function arcadeSound(
      type
    ) {
      try {
        if (
          window.arcade &&
          typeof window.arcade.playSound ===
            "function"
        ) {
          window.arcade.playSound(
            type
          );
        }
      } catch {}
    }

    function resize() {
      if (
        destroyed
      ) {
        return;
      }

      const width =
        canvas.clientWidth ||
        container.clientWidth ||
        window.innerWidth;

      const height =
        canvas.clientHeight ||
        container.clientHeight ||
        window.innerHeight;

      renderer.setSize(
        width,
        height,
        false
      );

      camera.aspect =
        width /
        Math.max(
          height,
          1
        );

      camera.updateProjectionMatrix();
    }

    function getTouchDistance(
      touchA,
      touchB
    ) {
      const dx =
        touchA.clientX -
        touchB.clientX;

      const dy =
        touchA.clientY -
        touchB.clientY;

      return Math.sqrt(
        dx * dx +
        dy * dy
      );
    }

    function handleTouchStart(
      event
    ) {
      if (
        !running ||
        paused
      ) {
        return;
      }

      if (
        event.touches.length >=
        2
      ) {
        pinchActive =
          true;

        swiping =
          false;

        pinchStartDistance =
          getTouchDistance(
            event.touches[0],
            event.touches[1]
          );

        pinchStartCameraDistance =
          cameraDistance;

        event.preventDefault();

        return;
      }

      if (
        event.touches.length !==
        1
      ) {
        return;
      }

      const touch =
        event.touches[0];

      touchStartX =
        touch.clientX;

      touchStartY =
        touch.clientY;

      swiping =
        true;
    }

    function handleTouchMove(
      event
    ) {
      if (
        !running ||
        paused
      ) {
        return;
      }

      if (
        event.touches.length >=
        2
      ) {
        pinchActive =
          true;

        swiping =
          false;

        const distance =
          getTouchDistance(
            event.touches[0],
            event.touches[1]
          );

        if (
          pinchStartDistance >
          0
        ) {
          const scale =
            distance /
            pinchStartDistance;

          cameraDistance =
            pinchStartCameraDistance /
            scale;

          cameraDistance =
            Math.max(
              18,
              Math.min(
                90,
                cameraDistance
              )
            );
        }

        event.preventDefault();

        return;
      }

      if (
        swiping
      ) {
        event.preventDefault();
      }
    }

    function handleTouchEnd(
      event
    ) {
      if (
        pinchActive
      ) {
        if (
          event.touches &&
          event.touches.length <
            2
        ) {
          pinchActive =
            false;
        }

        swiping =
          false;

        return;
      }

      if (
        !swiping ||
        !running ||
        paused
      ) {
        swiping =
          false;

        return;
      }

      if (
        !event.changedTouches ||
        event.changedTouches.length !==
          1
      ) {
        swiping =
          false;

        return;
      }

      const touch =
        event.changedTouches[0];

      const dx =
        touch.clientX -
        touchStartX;

      const dy =
        touch.clientY -
        touchStartY;

      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        );

      swiping =
        false;

      if (
        distance <
        22
      ) {
        return;
      }

      turnPlayer(
        dx,
        dy
      );
    }

    function handleTouchCancel() {
      swiping =
        false;

      pinchActive =
        false;
    }

    function togglePause() {
      if (
        !running
      ) {
        return;
      }

      paused =
        !paused;

      pauseButton.textContent =
        paused
          ? "▶"
          : "Ⅱ";
    }

    function startGame() {
      score =
        0;

      foodCollected =
        0;

      playerBoostUntil =
        0;

      playerSpeedMultiplier =
        1;

      cameraDistance =
        44;

      paused =
        false;

      pauseButton.textContent =
        "Ⅱ";

      createPlayer();

      for (
        const enemy
        of enemies
      ) {
        clearEnemy(
          enemy
        );
      }

      enemies.length =
        0;

      for (
        let i = 0;
        i <
        ENEMY_COUNT;
        i++
      ) {
        createEnemy(
          i
        );
      }

      for (
        const food
        of foods
      ) {
        disposeFood(
          food
        );
      }

      foods.length =
        0;

      ensureFoodCount();

      running =
        true;

      startOverlay.classList.add(
        "hidden"
      );

      gameOverOverlay.classList.add(
        "hidden"
      );

      lastTime =
        performance.now();

      updateCamera();

      updateHUD();

      arcadeSound(
        "click"
      );
    }

    function gameOver(
      reason
    ) {
      if (
        !running
      ) {
        return;
      }

      running =
        false;

      paused =
        false;

      pauseButton.textContent =
        "Ⅱ";

      finalScoreEl.textContent =
        String(
          score
        );

      finalTextEl.textContent =
        reason ||
        "Sua cobra foi eliminada.";

      gameOverOverlay.classList.remove(
        "hidden"
      );

      arcadeSound(
        "lose"
      );

      try {
        if (
          window.arcade
        ) {
          window.arcade.addPlayed(
            "snake"
          );

          window.arcade.setRecord(
            "snake",
            score
          );
        }
      } catch {}
    }

    function updateBoostUI(
      time
    ) {
      if (
        time <
        playerBoostUntil
      ) {
        const remaining =
          Math.max(
            0,
            playerBoostUntil -
              time
          );

        boostEl.textContent =
          "⚡ TURBO " +
          remaining.toFixed(
            1
          ) +
          "s";

        boostEl.classList.add(
          "show"
        );
      } else {
        boostEl.classList.remove(
          "show"
        );
      }
    }

    function update(
      delta,
      time
    ) {
      if (
        !running ||
        paused
      ) {
        return;
      }

      updatePlayer(
        delta,
        time
      );

      for (
        const enemy
        of enemies
      ) {
        updateEnemy(
          enemy,
          delta,
          time
        );
      }

      checkFoodCollisions(
        time
      );

      checkEnemyEnemyCollisions();

      updateEnemyRespawns(
        delta
      );

      /*
       * IMPORTANTE:
       * Não existe mais colisão
       * da cobra com o próprio corpo.
       *
       * Portanto o jogador pode
       * atravessar o próprio corpo
       * normalmente.
       */

      if (
        checkEnemyCollisions()
      ) {
        gameOver(
          "Uma cobra inimiga conseguiu te eliminar."
        );

        return;
      }

      animateFoods(
        time
      );

      updateCamera();

      updateBoostUI(
        time
      );

      updateHUD();

      drawMinimap();

      ground.position.x =
        player.position.x;

      ground.position.z =
        player.position.z;

      worldGlow.position.x =
        player.position.x;

      worldGlow.position.z =
        player.position.z;
    }

    function loop(
      now
    ) {
      if (
        destroyed
      ) {
        return;
      }

      animationId =
        requestAnimationFrame(
          loop
        );

      const delta =
        Math.min(
          0.033,
          Math.max(
            0,
            (
              now -
              lastTime
            ) /
              1000
          )
        );

      lastTime =
        now;

      const time =
        now / 1000;

      update(
        delta,
        time
      );

      renderer.render(
        scene,
        camera
      );
    }

    startButton.addEventListener(
      "click",
      startGame
    );

    restartButton.addEventListener(
      "click",
      startGame
    );

    pauseButton.addEventListener(
      "click",
      togglePause
    );

    canvas.addEventListener(
      "touchstart",
      handleTouchStart,
      {
        passive:false,
      }
    );

    canvas.addEventListener(
      "touchmove",
      handleTouchMove,
      {
        passive:false,
      }
    );

    canvas.addEventListener(
      "touchend",
      handleTouchEnd,
      {
        passive:false,
      }
    );

    canvas.addEventListener(
      "touchcancel",
      handleTouchCancel,
      {
        passive:true,
      }
    );

    window.addEventListener(
      "resize",
      resize
    );

    resize();

    createPlayer();

    for (
      let i = 0;
      i <
      ENEMY_COUNT;
      i++
    ) {
      createEnemy(
        i
      );
    }

    ensureFoodCount();

    updateCamera();

    updateHUD();

    drawMinimap();

    loop(
      performance.now()
    );

    const cleanup =
      () => {
        destroyed =
          true;

        running =
          false;

        if (
          animationId !==
          null
        ) {
          cancelAnimationFrame(
            animationId
          );
        }

        window.removeEventListener(
          "resize",
          resize
        );

        canvas.removeEventListener(
          "touchstart",
          handleTouchStart
        );

        canvas.removeEventListener(
          "touchmove",
          handleTouchMove
        );

        canvas.removeEventListener(
          "touchend",
          handleTouchEnd
        );

        canvas.removeEventListener(
          "touchcancel",
          handleTouchCancel
        );

        clearPlayer();

        for (
          const enemy
          of enemies
        ) {
          clearEnemy(
            enemy
          );
        }

        enemies.length =
          0;

        for (
          const food
          of foods
        ) {
          disposeFood(
            food
          );
        }

        foods.length =
          0;

        scene.traverse(
          object => {
            if (
              object.geometry
            ) {
              object.geometry.dispose();
            }

            if (
              object.material
            ) {
              if (
                Array.isArray(
                  object.material
                )
              ) {
                object.material.forEach(
                  material =>
                    material.dispose()
                );
              } else {
                object.material.dispose();
              }
            }
          }
        );

        renderer.dispose();
      };

    return cleanup;
  },
});