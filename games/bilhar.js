import * as THREE from "./lib/three/three.module.js";
import { registerGame } from "../arcade.js";

const BILHAR_HTML = String.raw`
<style>
*{
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
  -webkit-user-select:none;
  user-select:none;
  -webkit-touch-callout:none;
}

.bilhar-wrap{
  width:100%;
  max-width:470px;
  margin:auto;
  font-family:Arial,sans-serif;
  color:#fff;
}

.bilhar-page{
  position:relative;
  overflow:hidden;
  padding:12px;
  border-radius:18px;
  background:
    radial-gradient(circle at 50% 15%,#18334b 0%,#08121d 48%,#03070b 100%);
  border:1px solid rgba(0,220,255,.28);
  box-shadow:
    0 18px 45px rgba(0,0,0,.75),
    inset 0 0 30px rgba(0,200,255,.04);
}

.bilhar-top{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:8px;
  margin-bottom:7px;
}

.bilhar-title{
  font-size:22px;
  font-weight:900;
  letter-spacing:1.5px;
  color:#fff;
}

.bilhar-title span{
  color:#00eaff;
}

.bilhar-sub{
  margin-top:2px;
  font-size:8px;
  color:#7890a8;
  letter-spacing:2px;
  text-transform:uppercase;
}

.bilhar-score{
  display:flex;
  gap:8px;
}

.bilhar-score-box{
  min-width:44px;
  text-align:center;
}

.bilhar-score-num{
  font-size:17px;
  font-weight:900;
  color:#00eaff;
}

.bilhar-score-label{
  display:block;
  margin-top:2px;
  font-size:6px;
  color:#71879d;
  text-transform:uppercase;
}

.bilhar-status{
  min-height:25px;
  display:flex;
  align-items:center;
  justify-content:center;
  margin:4px 0 7px;
  color:#dbefff;
  font-size:11px;
  font-weight:800;
  letter-spacing:.5px;
  text-align:center;
}

.bilhar-status.win{
  color:#54ff9b;
}

.bilhar-status.lose{
  color:#ff587e;
}

.bilhar-mode{
  display:flex;
  gap:6px;
  margin-bottom:8px;
}

.bilhar-mode button,
.bilhar-btn{
  flex:1;
  min-height:38px;
  border:1px solid rgba(0,225,255,.3);
  border-radius:9px;
  background:rgba(0,210,255,.07);
  color:#9bb3c8;
  font-size:9px;
  font-weight:800;
  letter-spacing:.4px;
}

.bilhar-mode button.active{
  color:#00151a;
  background:#00eaff;
  border-color:#00eaff;
  box-shadow:0 0 14px rgba(0,234,255,.35);
}

.bilhar-scene{
  position:relative;
  width:100%;
  aspect-ratio:1.45/1;
  overflow:hidden;
  border-radius:14px;
  background:#020508;
  border:1px solid rgba(255,255,255,.08);
  box-shadow:
    0 12px 28px rgba(0,0,0,.8),
    inset 0 0 25px rgba(0,0,0,.8);
  touch-action:none;
}

.bilhar-canvas{
  width:100%;
  height:100%;
  display:block;
  touch-action:none;
}

.bilhar-overlay{
  position:absolute;
  left:10px;
  right:10px;
  bottom:8px;
  display:flex;
  justify-content:space-between;
  pointer-events:none;
}

.bilhar-player-card{
  padding:6px 9px;
  border-radius:8px;
  background:rgba(0,0,0,.58);
  border:1px solid rgba(255,255,255,.1);
  backdrop-filter:blur(5px);
}

.bilhar-player-name{
  font-size:8px;
  font-weight:900;
  color:#fff;
}

.bilhar-player-type{
  margin-top:2px;
  font-size:6px;
  color:#91a8bd;
}

.bilhar-power{
  width:92%;
  height:9px;
  margin:9px auto 5px;
  overflow:hidden;
  border-radius:8px;
  background:rgba(255,255,255,.07);
  border:1px solid rgba(0,234,255,.16);
}

.bilhar-power-fill{
  width:0%;
  height:100%;
  background:linear-gradient(90deg,#00eaff,#54ff9b,#ff4775);
  box-shadow:0 0 10px rgba(0,234,255,.6);
}

.bilhar-help{
  min-height:15px;
  margin:5px 0 8px;
  text-align:center;
  color:#7890a8;
  font-size:8px;
}

.bilhar-actions{
  display:flex;
  gap:7px;
}

.bilhar-btn{
  flex:1;
  padding:9px;
}

.bilhar-btn.primary{
  color:#00151a;
  background:#00eaff;
  border-color:#00eaff;
}

.bilhar-btn:active,
.bilhar-mode button:active{
  transform:scale(.97);
}

.bilhar-message{
  min-height:17px;
  margin-top:7px;
  text-align:center;
  color:#647d93;
  font-size:7px;
}

@media(max-width:380px){
  .bilhar-page{
    padding:9px;
  }

  .bilhar-title{
    font-size:19px;
  }
}
</style>

<div class="bilhar-wrap">
  <div class="bilhar-page">

    <div class="bilhar-top">
      <div>
        <div class="bilhar-title">NEON <span>BILHAR</span></div>
        <div class="bilhar-sub">3D Pool Arena</div>
      </div>

      <div class="bilhar-score">
        <div class="bilhar-score-box">
          <div class="bilhar-score-num" id="wins">0</div>
          <div class="bilhar-score-label">vitórias</div>
        </div>

        <div class="bilhar-score-box">
          <div class="bilhar-score-num" id="losses">0</div>
          <div class="bilhar-score-label">derrotas</div>
        </div>
      </div>
    </div>

    <div class="bilhar-status" id="status">
      Escolha o modo
    </div>

    <div class="bilhar-mode">
      <button id="modeAI" class="active">🤖 CONTRA IA</button>
      <button id="modePVP">👥 1×1</button>
    </div>

    <div class="bilhar-scene" id="scene">
      <canvas class="bilhar-canvas" id="canvas"></canvas>

      <div class="bilhar-overlay">
        <div class="bilhar-player-card">
          <div class="bilhar-player-name" id="player1Name">JOGADOR</div>
          <div class="bilhar-player-type" id="player1Type">aguardando grupo</div>
        </div>

        <div class="bilhar-player-card">
          <div class="bilhar-player-name" id="player2Name">IA</div>
          <div class="bilhar-player-type" id="player2Type">aguardando grupo</div>
        </div>
      </div>
    </div>

    <div class="bilhar-power">
      <div class="bilhar-power-fill" id="power"></div>
    </div>

    <div class="bilhar-help" id="help">
      Arraste a partir da bola branca para mirar e controlar a força.
    </div>

    <div class="bilhar-actions">
      <button class="bilhar-btn primary" id="restart">
        NOVA PARTIDA
      </button>

      <button class="bilhar-btn" id="resetScore">
        ZERAR PLACAR
      </button>
    </div>

    <div class="bilhar-message" id="message"></div>

  </div>
</div>

<script>
(function(){

"use strict";

const THREE =
  window.__OBSIDIAN_THREE;

if(!THREE){
  throw new Error("Three.js não encontrado.");
}

const sceneEl =
  document.getElementById("scene");

const canvas =
  document.getElementById("canvas");

const statusEl =
  document.getElementById("status");

const messageEl =
  document.getElementById("message");

const powerEl =
  document.getElementById("power");

const helpEl =
  document.getElementById("help");

const modeAI =
  document.getElementById("modeAI");

const modePVP =
  document.getElementById("modePVP");

const restart =
  document.getElementById("restart");

const resetScore =
  document.getElementById("resetScore");

const winsEl =
  document.getElementById("wins");

const lossesEl =
  document.getElementById("losses");

const p1Name =
  document.getElementById("player1Name");

const p2Name =
  document.getElementById("player2Name");

const p1Type =
  document.getElementById("player1Type");

const p2Type =
  document.getElementById("player2Type");

let renderer;
let camera;
let scene;

let tableGroup;
let ballGroup;
let cueGroup;

let aimGroup;

let animationId = null;

let mode = "ai";

let currentPlayer = 0;

let gameRunning = false;
let aiming = false;
let moving = false;
let aiThinking = false;

let pointerId = null;

let aimStart = null;
let aimPoint = null;

let power = 0;

let balls = [];

let players = [
  {
    name:"JOGADOR",
    group:null,
    remaining:7
  },
  {
    name:"IA",
    group:null,
    remaining:7
  }
];

let wins = 0;
let losses = 0;

try{
  wins =
    Number(
      localStorage.getItem("bilhar_3d_wins") || 0
    );

  losses =
    Number(
      localStorage.getItem("bilhar_3d_losses") || 0
    );
}catch(e){}

winsEl.textContent = wins;
lossesEl.textContent = losses;

const TABLE_W = 10;
const TABLE_H = 5.6;

const BALL_R = 0.115;

const PLAY_X = 4.45;
const PLAY_Y = 2.25;

const FRICTION = 0.982;

const POCKET_R = 0.27;

const BALL_SPEED_LIMIT = 0.17;

const pockets = [
  [-PLAY_X,-PLAY_Y],
  [0,-PLAY_Y],
  [PLAY_X,-PLAY_Y],
  [-PLAY_X,PLAY_Y],
  [0,PLAY_Y],
  [PLAY_X,PLAY_Y]
];

function createRenderer(){

  scene =
    new THREE.Scene();

  scene.background =
    new THREE.Color(0x020508);

  camera =
    new THREE.PerspectiveCamera(
      38,
      1,
      .1,
      100
    );

  camera.position.set(
    0,
    8.7,
    7.8
  );

  camera.lookAt(
    0,
    0,
    0
  );

  renderer =
    new THREE.WebGLRenderer({
      canvas,
      antialias:true,
      alpha:false,
      powerPreference:"high-performance"
    });

  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio || 1,
      2
    )
  );

  renderer.outputColorSpace =
    THREE.SRGBColorSpace;

  renderer.shadowMap.enabled = true;

  renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

  scene.add(
    new THREE.HemisphereLight(
      0xb9e9ff,
      0x101008,
      1.6
    )
  );

  const key =
    new THREE.DirectionalLight(
      0xffffff,
      3.1
    );

  key.position.set(
    -2,
    8,
    3
  );

  key.castShadow = true;

  key.shadow.mapSize.width = 1024;
  key.shadow.mapSize.height = 1024;

  scene.add(key);

  const fill =
    new THREE.PointLight(
      0x00eaff,
      13,
      14
    );

  fill.position.set(
    0,
    3.5,
    0
  );

  scene.add(fill);

  buildTable();

  buildAim();

  window.addEventListener(
    "resize",
    resize
  );

  resize();

}

function buildTable(){

  tableGroup =
    new THREE.Group();

  scene.add(tableGroup);

  const floor =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        12.5,
        .28,
        8.1
      ),
      new THREE.MeshStandardMaterial({
        color:0x17100b,
        roughness:.7,
        metalness:.15
      })
    );

  floor.position.y = -.38;
  floor.receiveShadow = true;

  tableGroup.add(floor);

  const felt =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        9.85,
        .12,
        5.65
      ),
      new THREE.MeshStandardMaterial({
        color:0x064c43,
        roughness:.82,
        metalness:0
      })
    );

  felt.position.y = -.14;
  felt.receiveShadow = true;

  tableGroup.add(felt);

  const woodMaterial =
    new THREE.MeshStandardMaterial({
      color:0x43200f,
      roughness:.55,
      metalness:.08
    });

  const railMaterial =
    new THREE.MeshStandardMaterial({
      color:0x07151a,
      roughness:.4,
      metalness:.25
    });

  const rails = [
    {
      x:0,
      z:-2.93,
      sx:10.9,
      sz:.38
    },
    {
      x:0,
      z:2.93,
      sx:10.9,
      sz:.38
    },
    {
      x:-5.27,
      z:0,
      sx:.38,
      sz:5.55
    },
    {
      x:5.27,
      z:0,
      sx:.38,
      sz:5.55
    }
  ];

  for(const r of rails){

    const rail =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          r.sx,
          .42,
          r.sz
        ),
        woodMaterial
      );

    rail.position.set(
      r.x,
      .08,
      r.z
    );

    rail.castShadow = true;
    rail.receiveShadow = true;

    tableGroup.add(rail);

  }

  const cushionMaterial =
    new THREE.MeshStandardMaterial({
      color:0x0b7967,
      roughness:.8
    });

  const cushions = [
    {
      x:0,
      z:-2.72,
      sx:4.45,
      sz:.17
    },
    {
      x:0,
      z:2.72,
      sx:4.45,
      sz:.17
    },
    {
      x:-4.62,
      z:0,
      sx:.17,
      sz:2.25
    },
    {
      x:4.62,
      z:0,
      sx:.17,
      sz:2.25
    }
  ];

  for(const c of cushions){

    const mesh =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          c.sx,
          .18,
          c.sz
        ),
        cushionMaterial
      );

    mesh.position.set(
      c.x,
      .05,
      c.z
    );

    mesh.receiveShadow = true;

    tableGroup.add(mesh);

  }

  for(const p of pockets){

    const pocket =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          POCKET_R,
          POCKET_R * 1.08,
          .2,
          32
        ),
        new THREE.MeshStandardMaterial({
          color:0x000000,
          roughness:1
        })
      );

    pocket.rotation.x =
      Math.PI / 2;

    pocket.position.set(
      p[0],
      -.2,
      p[1]
    );

    tableGroup.add(pocket);

  }

  const centerLineMaterial =
    new THREE.LineBasicMaterial({
      color:0xffffff,
      transparent:true,
      opacity:.07
    });

  const points = [
    new THREE.Vector3(
      -PLAY_X,
      .001,
      0
    ),
    new THREE.Vector3(
      PLAY_X,
      .001,
      0
    )
  ];

  const geometry =
    new THREE.BufferGeometry()
      .setFromPoints(points);

  const line =
    new THREE.Line(
      geometry,
      centerLineMaterial
    );

  tableGroup.add(line);

}

function buildAim(){

  aimGroup =
    new THREE.Group();

  scene.add(aimGroup);

}

function clearAim(){

  while(
    aimGroup.children.length
  ){

    const obj =
      aimGroup.children.pop();

    obj.traverse(function(child){

      if(child.geometry)
        child.geometry.dispose();

      if(child.material){

        if(Array.isArray(child.material)){

          child.material.forEach(
            m => m.dispose()
          );

        }else{

          child.material.dispose();

        }

      }

    });

  }

}

function makeLine(
  from,
  to,
  color,
  opacity = .9
){

  const geometry =
    new THREE.BufferGeometry()
      .setFromPoints([
        from,
        to
      ]);

  const material =
    new THREE.LineBasicMaterial({
      color,
      transparent:true,
      opacity
    });

  return new THREE.Line(
    geometry,
    material
  );

}

function updateAim(){

  clearAim();

  if(
    !aiming ||
    !aimStart ||
    !aimPoint
  ){

    powerEl.style.width = "0%";
    return;

  }

  const dx =
    aimPoint.x -
    aimStart.x;

  const dz =
    aimPoint.y -
    aimStart.y;

  const len =
    Math.sqrt(
      dx*dx + dz*dz
    );

  if(len < .05)
    return;

  const nx =
    dx / len;

  const nz =
    dz / len;

  const strength =
    Math.min(
      1,
      len / 2.7
    );

  power =
    strength;

  powerEl.style.width =
    Math.round(
      power * 100
    ) + "%";

  const cue =
    getCue();

  if(!cue)
    return;

  const start =
    new THREE.Vector3(
      cue.x,
      .16,
      cue.z
    );

  const lineEnd =
    new THREE.Vector3(
      cue.x + nx * 3.8,
      .17,
      cue.z + nz * 3.8
    );

  aimGroup.add(
    makeLine(
      start,
      lineEnd,
      0x00eaff,
      .85
    )
  );

  const collision =
    predictCollision(
      cue,
      nx,
      nz
    );

  let trajectoryEnd;

  if(collision){

    trajectoryEnd =
      new THREE.Vector3(
        collision.x,
        .18,
        collision.z
      );

    aimGroup.add(
      makeLine(
        new THREE.Vector3(
          collision.x,
          .19,
          collision.z
        ),
        new THREE.Vector3(
          collision.x +
            collision.nx * 2.4,
          .19,
          collision.z +
            collision.nz * 2.4
        ),
        0xffdf67,
        .78
      )
    );

  }else{

    trajectoryEnd =
      new THREE.Vector3(
        cue.x + nx * 3.8,
        .18,
        cue.z + nz * 3.8
      );

  }

  aimGroup.add(
    makeLine(
      new THREE.Vector3(
        cue.x + nx * .16,
        .18,
        cue.z + nz * .16
      ),
      trajectoryEnd,
      0xffffff,
      .92
    )
  );

  const back =
    1.15 +
    strength * .8;

  const cueStart =
    new THREE.Vector3(
      cue.x - nx * back,
      .2,
      cue.z - nz * back
    );

  const cueEnd =
    new THREE.Vector3(
      cue.x - nx * .18,
      .2,
      cue.z - nz * .18
    );

  aimGroup.add(
    makeLine(
      cueStart,
      cueEnd,
      0xc89b62,
      .95
    )
  );

}

function predictCollision(
  cue,
  nx,
  nz
){

  let best = null;
  let bestT = Infinity;

  for(const b of balls){

    if(
      !b.active ||
      b.type === "cue"
    )
      continue;

    const rx =
      b.x - cue.x;

    const rz =
      b.z - cue.z;

    const proj =
      rx * nx +
      rz * nz;

    if(proj <= 0)
      continue;

    const perpX =
      rx - nx * proj;

    const perpZ =
      rz - nz * proj;

    const perp =
      Math.sqrt(
        perpX*perpX +
        perpZ*perpZ
      );

    if(
      perp >
      BALL_R * 2.1
    )
      continue;

    if(proj < bestT){

      bestT = proj;

      best = {
        x:
          cue.x + nx * proj,
        z:
          cue.z + nz * proj,
        nx:
          nx,
        nz:
          nz
      };

    }

  }

  return best;

}

function makeBallMesh(b){

  const group =
    new THREE.Group();

  const geometry =
    new THREE.SphereGeometry(
      BALL_R,
      24,
      16
    );

  let baseColor =
    0xffffff;

  if(b.type === "solid")
    baseColor =
      colorHex(b.color);

  if(b.type === "stripe")
    baseColor =
      colorHex(b.color);

  if(b.type === "eight")
    baseColor =
      0x050505;

  const material =
    new THREE.MeshStandardMaterial({
      color:baseColor,
      roughness:.25,
      metalness:.05
    });

  const ball =
    new THREE.Mesh(
      geometry,
      material
    );

  ball.castShadow = true;
  ball.receiveShadow = true;

  group.add(ball);

  if(
    b.type === "stripe"
  ){

    const stripe =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          BALL_R * 1.012,
          BALL_R * 1.012,
          BALL_R * .55,
          32
        ),
        new THREE.MeshStandardMaterial({
          color:0xffffff,
          roughness:.3
        })
      );

    stripe.rotation.x =
      Math.PI / 2;

    group.add(stripe);

  }

  if(
    b.type === "eight"
  ){

    const dot =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          BALL_R * .29,
          16,
          12
        ),
        new THREE.MeshStandardMaterial({
          color:0xffffff
        })
      );

    dot.position.y =
      BALL_R * .72;

    group.add(dot);

  }

  group.position.set(
    b.x,
    BALL_R + .03,
    b.z
  );

  group.userData.ball =
    b;

  return group;

}

function colorHex(color){

  const map = {
    yellow:0xf6d33b,
    blue:0x1e63e9,
    red:0xd92525,
    purple:0x7138c8,
    orange:0xf17c24,
    green:0x18a85b,
    maroon:0x7d1738
  };

  return map[color] || 0xffffff;

}

function getCue(){

  return balls.find(
    b =>
      b.active &&
      b.type === "cue"
  );

}

function rebuildBalls(){

  if(ballGroup){

    while(
      ballGroup.children.length
    ){

      const obj =
        ballGroup.children.pop();

      obj.traverse(function(child){

        if(child.geometry)
          child.geometry.dispose();

        if(child.material){

          if(
            Array.isArray(child.material)
          ){

            child.material.forEach(
              m => m.dispose()
            );

          }else{

            child.material.dispose();

          }

        }

      });

    }

    scene.remove(ballGroup);

  }

  ballGroup =
    new THREE.Group();

  scene.add(ballGroup);

  for(const b of balls){

    if(!b.active)
      continue;

    const mesh =
      makeBallMesh(b);

    ballGroup.add(mesh);

  }

}

function rackBalls(){

  balls = [];

  balls.push({
    id:"cue",
    type:"cue",
    x:-2.8,
    z:0,
    vx:0,
    vz:0,
    active:true
  });

  const colors = [
    "yellow",
    "blue",
    "red",
    "purple",
    "orange",
    "green",
    "maroon"
  ];

  const rack = [];

  const spacing =
    BALL_R * 2.08;

  for(let row=0; row<5; row++){

    for(let col=0; col<=row; col++){

      const x =
        2.35 +
        row * spacing * .86;

      const z =
        (col - row / 2) *
        spacing;

      rack.push({
        x,
        z
      });

    }

  }

  let index = 0;

  for(
    const pos of rack
  ){

    if(index === 4){

      balls.push({
        id:"eight",
        type:"eight",
        color:null,
        x:pos.x,
        z:pos.z,
        vx:0,
        vz:0,
        active:true
      });

    }else{

      const striped =
        index >= 7;

      balls.push({
        id:
          (striped ? "stripe-" : "solid-") +
          index,

        type:
          striped
            ? "stripe"
            : "solid",

        color:
          colors[index % colors.length],

        x:pos.x,
        z:pos.z,
        vx:0,
        vz:0,
        active:true
      });

    }

    index++;

  }

  players = [
    {
      name:"JOGADOR",
      group:null,
      remaining:7
    },
    {
      name:
        mode === "ai"
          ? "IA"
          : "JOGADOR 2",
      group:null,
      remaining:7
    }
  ];

}

function setStatus(text){

  statusEl.textContent =
    text;

}

function updatePlayerUI(){

  p1Name.textContent =
    players[0].name;

  p2Name.textContent =
    players[1].name;

  p1Type.textContent =
    players[0].group
      ? players[0].group === "solid"
        ? "● LISAS"
        : "◉ LISTRADAS"
      : "aguardando grupo";

  p2Type.textContent =
    players[1].group
      ? players[1].group === "solid"
        ? "● LISAS"
        : "◉ LISTRADAS"
      : "aguardando grupo";

}

function startGame(){

  stopAnimation();

  rackBalls();

  currentPlayer = 0;

  gameRunning = true;

  moving = false;

  aiming = false;

  aiThinking = false;

  power = 0;

  powerEl.style.width = "0%";

  setStatus(
    players[0].name +
    " — sua vez"
  );

  messageEl.textContent =
    "A primeira bola encaçapada define lisas ou listradas.";

  helpEl.textContent =
    "Arraste a partir da bola branca para mirar. Quanto mais longe, maior a força.";

  updatePlayerUI();

  rebuildBalls();

  render();

}

function render(){

  if(!ballGroup)
    return;

  for(
    const mesh of ballGroup.children
  ){

    const b =
      mesh.userData.ball;

    if(!b || !b.active){

      mesh.visible = false;
      continue;

    }

    mesh.visible = true;

    mesh.position.set(
      b.x,
      BALL_R + .03,
      b.z
    );

  }

}

function resize(){

  if(!renderer)
    return;

  const w =
    sceneEl.clientWidth;

  const h =
    sceneEl.clientHeight;

  if(!w || !h)
    return;

  renderer.setSize(
    w,
    h,
    false
  );

  camera.aspect =
    w / h;

  camera.updateProjectionMatrix();

}

function movingBalls(){

  for(const b of balls){

    if(
      !b.active ||
      b.type === "cue" ||
      true
    ){

      if(
        Math.abs(b.vx) > .001 ||
        Math.abs(b.vz) > .001
      )
        return true;

    }

  }

  return false;

}

function pocketCheck(b){

  for(const p of pockets){

    const dx =
      b.x - p[0];

    const dz =
      b.z - p[1];

    if(
      Math.sqrt(
        dx*dx + dz*dz
      ) <
      POCKET_R
    ){

      return true;

    }

  }

  return false;

}

function removeBall(b){

  if(!b.active)
    return;

  b.active = false;
  b.vx = 0;
  b.vz = 0;

}

function respawnCue(){

  let cue =
    getCue();

  if(cue && cue.active)
    return;

  balls.unshift({
    id:"cue",
    type:"cue",
    x:-2.8,
    z:0,
    vx:0,
    vz:0,
    active:true
  });

}

function collideWalls(b){

  const left =
    -PLAY_X + BALL_R;

  const right =
    PLAY_X - BALL_R;

  const top =
    -PLAY_Y + BALL_R;

  const bottom =
    PLAY_Y - BALL_R;

  if(b.x < left){

    b.x = left;
    b.vx =
      Math.abs(b.vx) * .91;

  }

  if(b.x > right){

    b.x = right;
    b.vx =
      -Math.abs(b.vx) * .91;

  }

  if(b.z < top){

    b.z = top;
    b.vz =
      Math.abs(b.vz) * .91;

  }

  if(b.z > bottom){

    b.z = bottom;
    b.vz =
      -Math.abs(b.vz) * .91;

  }

}

function collideBalls(a,b){

  if(
    !a.active ||
    !b.active
  )
    return;

  const dx =
    b.x - a.x;

  const dz =
    b.z - a.z;

  const dist =
    Math.sqrt(
      dx*dx + dz*dz
    );

  const minDist =
    BALL_R * 2;

  if(
    dist <= .00001 ||
    dist >= minDist
  )
    return;

  const nx =
    dx / dist;

  const nz =
    dz / dist;

  const overlap =
    minDist - dist;

  a.x -=
    nx * overlap * .5;

  a.z -=
    nz * overlap * .5;

  b.x +=
    nx * overlap * .5;

  b.z +=
    nz * overlap * .5;

  const rvx =
    b.vx - a.vx;

  const rvz =
    b.vz - a.vz;

  const vel =
    rvx * nx +
    rvz * nz;

  if(vel > 0)
    return;

  const impulse =
    -vel * .98;

  a.vx -=
    nx * impulse;

  a.vz -=
    nz * impulse;

  b.vx +=
    nx * impulse;

  b.vz +=
    nz * impulse;

}

function physicsStep(){

  let any = false;

  for(const b of balls){

    if(!b.active)
      continue;

    b.x += b.vx;
    b.z += b.vz;

    b.vx *= FRICTION;
    b.vz *= FRICTION;

    if(
      Math.abs(b.vx) < .001
    )
      b.vx = 0;

    if(
      Math.abs(b.vz) < .001
    )
      b.vz = 0;

    if(
      pocketCheck(b)
    ){

      removeBall(b);
      continue;

    }

    collideWalls(b);

    const speed =
      Math.sqrt(
        b.vx*b.vx +
        b.vz*b.vz
      );

    if(speed > .001)
      any = true;

  }

  for(
    let i=0;
    i<balls.length;
    i++
  ){

    for(
      let j=i+1;
      j<balls.length;
      j++
    ){

      collideBalls(
        balls[i],
        balls[j]
      );

    }

  }

  moving = any;

  render();

}

function animate(){

  physicsStep();

  renderer.render(
    scene,
    camera
  );

  if(
    moving
  ){

    animationId =
      requestAnimationFrame(
        animate
      );

  }else{

    animationId = null;

    finishShot();

  }

}

function startPhysics(){

  stopAnimation();

  moving = true;

  animationId =
    requestAnimationFrame(
      animate
    );

}

function stopAnimation(){

  if(animationId !== null){

    cancelAnimationFrame(
      animationId
    );

    animationId = null;

  }

}

function currentGroupCount(group){

  return balls.filter(
    b =>
      b.active &&
      b.type === group
  ).length;

}

function assignGroups(pocketed){

  if(
    players[0].group ||
    players[1].group
  )
    return;

  if(
    pocketed !== "solid" &&
    pocketed !== "stripe"
  )
    return;

  players[currentPlayer].group =
    pocketed;

  players[1-currentPlayer].group =
    pocketed === "solid"
      ? "stripe"
      : "solid";

  updatePlayerUI();

  messageEl.textContent =
    players[currentPlayer].name +
    " ficou com " +
    (
      pocketed === "solid"
        ? "bolas lisas."
        : "bolas listradas."
    );

}

function evaluateShot(){

  const player =
    players[currentPlayer];

  const ownBefore =
    player.group
      ? 7
      : null;

  const activeSolids =
    currentGroupCount("solid");

  const activeStripes =
    currentGroupCount("stripe");

  players[0].remaining =
    activeSolids;

  players[1].remaining =
    activeStripes;

  if(
    players[0].group === "stripe"
  ){

    players[0].remaining =
      activeStripes;

    players[1].remaining =
      activeSolids;

  }

  updatePlayerUI();

  const eight =
    balls.find(
      b =>
        b.id === "eight"
    );

  if(
    eight &&
    !eight.active
  ){

    const ownRemaining =
      player.group
        ? currentGroupCount(
            player.group
          )
        : 0;

    if(
      player.group &&
      ownRemaining === 0
    ){

      finishWin(
        currentPlayer
      );

    }else{

      finishLoss(
        currentPlayer
      );

    }

    return true;

  }

  return false;

}

function finishWin(player){

  gameRunning = false;
  aiming = false;
  aiThinking = false;

  if(player === 0){

    wins++;

    try{
      localStorage.setItem(
        "bilhar_3d_wins",
        String(wins)
      );
    }catch(e){}

    winsEl.textContent =
      wins;

    statusEl.className =
      "bilhar-status win";

    setStatus(
      "🎉 VOCÊ VENCEU!"
    );

  }else{

    losses++;

    try{
      localStorage.setItem(
        "bilhar_3d_losses",
        String(losses)
      );
    }catch(e){}

    lossesEl.textContent =
      losses;

    statusEl.className =
      "bilhar-status lose";

    setStatus(
      players[1].name +
      " VENCEU!"
    );

  }

  messageEl.textContent =
    "A partida terminou. Toque em NOVA PARTIDA para jogar novamente.";

}

function finishLoss(player){

  gameRunning = false;
  aiming = false;
  aiThinking = false;

  if(player === 0){

    losses++;

    try{
      localStorage.setItem(
        "bilhar_3d_losses",
        String(losses)
      );
    }catch(e){}

    lossesEl.textContent =
      losses;

    statusEl.className =
      "bilhar-status lose";

    setStatus(
      "❌ VOCÊ PERDEU"
    );

  }else{

    wins++;

    try{
      localStorage.setItem(
        "bilhar_3d_wins",
        String(wins)
      );
    }catch(e){}

    winsEl.textContent =
      wins;

    statusEl.className =
      "bilhar-status win";

    setStatus(
      "🎉 VOCÊ VENCEU!"
    );

  }

  messageEl.textContent =
    "A bola 8 foi encaçapada antes da hora.";

}

function finishShot(){

  if(!gameRunning)
    return;

  rebuildBalls();
  render();

  if(
    evaluateShot()
  )
    return;

  const player =
    players[currentPlayer];

  if(
    player.group &&
    currentGroupCount(
      player.group
    ) === 0
  ){

    messageEl.textContent =
      "Você limpou seu grupo. Agora procure a bola 8.";

  }

  currentPlayer =
    1 - currentPlayer;

  statusEl.className =
    "bilhar-status";

  setStatus(
    players[currentPlayer].name +
    " — sua vez"
  );

  messageEl.textContent =
    "Mire a bola branca e solte para tacar.";

  if(
    mode === "ai" &&
    currentPlayer === 1
  ){

    aiThinking = true;

    setStatus(
      "IA — calculando tacada..."
    );

    messageEl.textContent =
      "A IA está analisando a mesa.";

    setTimeout(
      aiShot,
      700
    );

  }

}

function shoot(
  angle,
  strength
){

  if(
    !gameRunning ||
    moving ||
    aiThinking
  )
    return;

  const cue =
    getCue();

  if(!cue)
    return;

  const force =
    Math.max(
      .035,
      Math.min(
        .17,
        strength
      )
    );

  cue.vx =
    Math.cos(angle) *
    force;

  cue.vz =
    Math.sin(angle) *
    force;

  aiming = false;

  clearAim();

  powerEl.style.width =
    "0%";

  startPhysics();

}

function aiShot(){

  if(
    !gameRunning ||
    mode !== "ai" ||
    currentPlayer !== 1
  ){

    aiThinking = false;
    return;

  }

  const cue =
    getCue();

  if(!cue){

    respawnCue();
    rebuildBalls();

  }

  const targets =
    balls.filter(
      b =>
        b.active &&
        (
          b.type ===
          players[1].group
        )
    );

  let target = null;

  if(targets.length){

    let best = Infinity;

    for(const b of targets){

      const d =
        Math.hypot(
          b.x-cue.x,
          b.z-cue.z
        );

      if(d < best){

        best = d;
        target = b;

      }

    }

  }else{

    target =
      balls.find(
        b =>
          b.active &&
          b.type !== "cue" &&
          b.type !== "eight"
      );

  }

  if(!target){

    target =
      balls.find(
        b =>
          b.active &&
          b.id === "eight"
      );

  }

  if(!target){

    aiThinking = false;
    finishShot();
    return;

  }

  const angle =
    Math.atan2(
      target.z-cue.z,
      target.x-cue.x
    );

  const distance =
    Math.hypot(
      target.x-cue.x,
      target.z-cue.z
    );

  const strength =
    Math.min(
      .16,
      Math.max(
        .055,
        distance * .024
      )
    );

  const error =
    (
      Math.random()-.5
    ) * .055;

  aiThinking = false;

  shoot(
    angle + error,
    strength
  );

}

function pointerPosition(event){

  const rect =
    canvas.getBoundingClientRect();

  const x =
    (
      event.clientX -
      rect.left
    ) / rect.width;

  const y =
    (
      event.clientY -
      rect.top
    ) / rect.height;

  const nx =
    x * 2 - 1;

  const ny =
    -(y * 2 - 1);

  const ray =
    new THREE.Raycaster();

  ray.setFromCamera(
    {
      x:nx,
      y:ny
    },
    camera
  );

  const plane =
    new THREE.Plane(
      new THREE.Vector3(
        0,
        1,
        0
      ),
      0
    );

  const hit =
    new THREE.Vector3();

  ray.ray.intersectPlane(
    plane,
    hit
  );

  return {
    x:hit.x,
    y:hit.z
  };

}

function pointerDown(event){

  if(
    !gameRunning ||
    moving ||
    aiThinking ||
    (
      mode === "ai" &&
      currentPlayer !== 0
    )
  )
    return;

  const cue =
    getCue();

  if(!cue)
    return;

  event.preventDefault();

  pointerId =
    event.pointerId;

  try{
    canvas.setPointerCapture(
      pointerId
    );
  }catch(e){}

  const p =
    pointerPosition(event);

  aimStart = {
    x:cue.x,
    y:cue.z
  };

  aimPoint = p;

  aiming = true;

  updateAim();

}

function pointerMove(event){

  if(
    !aiming ||
    event.pointerId !== pointerId
  )
    return;

  event.preventDefault();

  aimPoint =
    pointerPosition(event);

  updateAim();

}

function pointerUp(event){

  if(
    !aiming ||
    event.pointerId !== pointerId
  )
    return;

  event.preventDefault();

  const p =
    pointerPosition(event);

  aimPoint = p;

  const dx =
    aimPoint.x -
    aimStart.x;

  const dz =
    aimPoint.y -
    aimStart.y;

  const len =
    Math.sqrt(
      dx*dx + dz*dz
    );

  const angle =
    Math.atan2(
      dz,
      dx
    );

  aiming = false;
  pointerId = null;

  clearAim();

  powerEl.style.width =
    "0%";

  if(len < .12)
    return;

  const strength =
    Math.min(
      .17,
      Math.max(
        .04,
        len * .055
      )
    );

  shoot(
    angle,
    strength
  );

}

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
  function(){

    aiming = false;
    pointerId = null;

    clearAim();

    powerEl.style.width =
      "0%";

  }
);

canvas.addEventListener(
  "contextmenu",
  e => e.preventDefault()
);

modeAI.addEventListener(
  "click",
  function(){

    mode = "ai";

    modeAI.classList.add(
      "active"
    );

    modePVP.classList.remove(
      "active"
    );

    players[1].name =
      "IA";

    startGame();

  }
);

modePVP.addEventListener(
  "click",
  function(){

    mode = "pvp";

    modePVP.classList.add(
      "active"
    );

    modeAI.classList.remove(
      "active"
    );

    players[1].name =
      "JOGADOR 2";

    startGame();

  }
);

restart.addEventListener(
  "click",
  function(){
    startGame();
  }
);

resetScore.addEventListener(
  "click",
  function(){

    wins = 0;
    losses = 0;

    try{
      localStorage.setItem(
        "bilhar_3d_wins",
        "0"
      );

      localStorage.setItem(
        "bilhar_3d_losses",
        "0"
      );
    }catch(e){}

    winsEl.textContent = "0";
    lossesEl.textContent = "0";

    startGame();

  }
);

createRenderer();

startGame();

function loop(){

  renderer.render(
    scene,
    camera
  );

  requestAnimationFrame(
    loop
  );

}

loop();

})();
</script>
`;

function executeGameScripts(container){

  const scripts =
    [...container.querySelectorAll("script")];

  for(const oldScript of scripts){

    const script =
      document.createElement("script");

    for(
      const attr of oldScript.attributes
    ){

      script.setAttribute(
        attr.name,
        attr.value
      );

    }

    script.textContent =
      oldScript.textContent;

    oldScript.remove();

    container.appendChild(script);

  }

}

registerGame({

  id:"bilhar",

  name:"Bilhar 3D",

  category:"Esportes",

  icon:"🎱",

  init({ container }){

    container.innerHTML =
      BILHAR_HTML;

    /*
     * O bilhar usa exatamente o mesmo
     * Three.js local que o Snake.
     */
    window.__OBSIDIAN_THREE =
      THREE;

    executeGameScripts(
      container
    );

  }

});