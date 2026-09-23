import { registerGame } from "../arcade.js";

export const OBSIDIAN_BROS_HTML = String.raw`<style>
*{
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
  user-select:none;
}

.obsidian-bros{
  position:relative;
  width:100%;
  height:100%;
  min-width:0;
  min-height:0;
  overflow:hidden;
  background:#101827;
  border-radius:20px;
  isolation:isolate;
}

.obsidian-bros canvas{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  display:block;
  image-rendering:pixelated;
  image-rendering:crisp-edges;
  touch-action:none;
}

.hud{
  position:absolute;
  z-index:20;
  top:0;
  left:0;
  width:100%;
  height:54px;
  display:flex;
  align-items:center;
  justify-content:space-around;
  padding:6px 10px;
  background:rgba(3,7,14,.82);
  border-bottom:1px solid rgba(255,255,255,.15);
  color:white;
  font-weight:900;
  font-size:11px;
  pointer-events:none;
  backdrop-filter:blur(4px);
}

.hud-item{
  text-align:center;
  min-width:58px;
}

.hud-label{
  display:block;
  font-size:8px;
  opacity:.55;
  margin-bottom:2px;
}

.hud-value{
  display:block;
  font-size:12px;
}

.touch{
  position:absolute;
  z-index:30;
  left:0;
  right:0;
  bottom:max(12px, env(safe-area-inset-bottom));
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
  padding:0 16px;
  pointer-events:none;
}

.touch-left,
.touch-right{
  display:flex;
  align-items:flex-end;
  gap:12px;
  pointer-events:auto;
}

.touch button{
  width:78px;
  height:78px;
  flex:0 0 auto;
  border:3px solid rgba(255,255,255,.75);
  border-radius:50%;
  background:#111827;
  color:#fff;
  font-size:31px;
  font-weight:900;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:
    0 7px 0 #030712,
    0 10px 24px rgba(0,0,0,.55),
    inset 0 2px 0 rgba(255,255,255,.12);
  opacity:1;
  touch-action:none;
  -webkit-user-select:none;
  user-select:none;
  cursor:pointer;
}

.touch button:active{
  transform:translateY(5px) scale(.94);
  box-shadow:
    0 2px 0 #030712,
    0 5px 12px rgba(0,0,0,.5),
    inset 0 2px 0 rgba(255,255,255,.08);
  background:#334155;
}

.touch-left button:first-child,
.touch-left button:nth-child(2){
  background:#172033;
}

.jump{
  width:92px!important;
  height:92px!important;
  font-size:38px!important;
  background:#1d4ed8!important;
  border-color:#93c5fd!important;
}

.fire{
  width:76px!important;
  height:76px!important;
  font-size:27px!important;
  background:#9a3412!important;
  border-color:#fdba74!important;
}

.overlay{
  position:absolute;
  z-index:50;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
  background:rgba(0,0,0,.82);
}

.panel{
  width:min(390px,94%);
  max-height:calc(100% - 30px);
  overflow:auto;
  padding:25px 20px;
  border:2px solid #7dd3fc;
  border-radius:22px;
  background:linear-gradient(145deg,#111827,#05070b);
  box-shadow:0 0 40px rgba(56,189,248,.25);
  text-align:center;
  color:white;
}

.panel-icon{
  font-size:55px;
  margin-bottom:8px;
}

.panel h1{
  margin:0 0 8px;
  font-size:24px;
  color:#7dd3fc;
}

.panel p{
  margin:8px 0 20px;
  color:rgba(255,255,255,.7);
  font-size:12px;
  line-height:1.6;
}

.panel button{
  width:100%;
  padding:14px;
  border:0;
  border-radius:12px;
  background:linear-gradient(135deg,#38bdf8,#2563eb);
  color:white;
  font-weight:900;
  font-size:14px;
}

.level-buttons{
  display:flex;
  gap:8px;
  margin-top:12px;
}

.level-buttons button{
  flex:1;
  background:#172033;
  border:1px solid #334155;
}

.level-buttons button.active{
  background:#075985;
  border-color:#38bdf8;
}

@media (orientation:portrait){

  .touch{
    padding-left:12px;
    padding-right:12px;
  }

  .touch-left,
  .touch-right{
    gap:9px;
  }

  .touch button{
    width:74px;
    height:74px;
  }

  .jump{
    width:88px!important;
    height:88px!important;
  }

  .fire{
    width:72px!important;
    height:72px!important;
  }

}

@media (orientation:landscape){

  .touch{
    padding-left:18px;
    padding-right:18px;
  }

  .touch button{
    width:70px;
    height:70px;
    font-size:28px;
  }

  .jump{
    width:84px!important;
    height:84px!important;
  }

  .fire{
    width:70px!important;
    height:70px!important;
  }

}

@media(max-width:420px){

  .hud{
    height:50px;
    padding-left:4px;
    padding-right:4px;
  }

  .hud-item{
    min-width:45px;
  }

  .hud-label{
    font-size:7px;
  }

  .hud-value{
    font-size:11px;
  }

}

@media(max-height:500px){

  .touch{
    bottom:max(8px, env(safe-area-inset-bottom));
  }

  .touch button{
    width:66px;
    height:66px;
    font-size:27px;
  }

  .jump{
    width:78px!important;
    height:78px!important;
    font-size:33px!important;
  }

  .fire{
    width:66px!important;
    height:66px!important;
    font-size:24px!important;
  }

}

@media(min-width:800px){

  .touch{
    padding-left:24px;
    padding-right:24px;
  }

  .touch button{
    width:76px;
    height:76px;
  }

  .jump{
    width:88px!important;
    height:88px!important;
  }

}
</style>

<div class="obsidian-bros">

  <canvas id="gameCanvas"></canvas>

  <div class="hud">

    <div class="hud-item">
      <span class="hud-label">PONTOS</span>
      <span class="hud-value" id="score">000000</span>
    </div>

    <div class="hud-item">
      <span class="hud-label">MOEDAS</span>
      <span class="hud-value">
        🪙 <span id="coins">00</span>
      </span>
    </div>

    <div class="hud-item">
      <span class="hud-label">FASE</span>
      <span class="hud-value" id="level">1-1</span>
    </div>

    <div class="hud-item">
      <span class="hud-label">TEMPO</span>
      <span class="hud-value" id="time">300</span>
    </div>

    <div class="hud-item">
      <span class="hud-label">VIDAS</span>
      <span class="hud-value">
        ♥ <span id="lives">3</span>
      </span>
    </div>

  </div>

  <div class="touch">

    <div class="touch-left">

      <button id="leftBtn">
        ◀
      </button>

      <button id="rightBtn">
        ▶
      </button>

    </div>

    <div class="touch-right">

      <button
        class="fire"
        id="fireBtn"
      >
        🔥
      </button>

      <button
        class="jump"
        id="jumpBtn"
      >
        ⬆
      </button>

    </div>

  </div>

  <div class="overlay" id="overlay">

    <div class="panel">

      <div
        class="panel-icon"
        id="panelIcon"
      >
        🍄
      </div>

      <h1 id="panelTitle">
        OBSIDIAN BROS
      </h1>

      <p id="panelText">
        Uma aventura clássica de plataforma.
        Corra, pule, pegue moedas, derrote inimigos
        e chegue até a bandeira.
      </p>

      <button id="startBtn">
        JOGAR
      </button>

      <div class="level-buttons">

        <button
          id="level1Btn"
          class="active"
        >
          FASE 1
        </button>

        <button id="level2Btn">
          FASE 2
        </button>

        <button id="level3Btn">
          FASE 3
        </button>

      </div>

    </div>

  </div>

<script>
(function(){

"use strict";

/* =========================
   ELEMENTOS
========================= */

const canvas =
  document.getElementById(
    "gameCanvas"
  );

const ctx =
  canvas.getContext("2d");

const root =
  document.querySelector(
    ".obsidian-bros"
  );

const overlay =
  document.getElementById(
    "overlay"
  );

const panelIcon =
  document.getElementById(
    "panelIcon"
  );

const panelTitle =
  document.getElementById(
    "panelTitle"
  );

const panelText =
  document.getElementById(
    "panelText"
  );

const startBtn =
  document.getElementById(
    "startBtn"
  );

const scoreEl =
  document.getElementById(
    "score"
  );

const coinsEl =
  document.getElementById(
    "coins"
  );

const levelEl =
  document.getElementById(
    "level"
  );

const timeEl =
  document.getElementById(
    "time"
  );

const livesEl =
  document.getElementById(
    "lives"
  );

const level1Btn =
  document.getElementById(
    "level1Btn"
  );

const level2Btn =
  document.getElementById(
    "level2Btn"
  );

const level3Btn =
  document.getElementById(
    "level3Btn"
  );

/* =========================
   CANVAS RESPONSIVO
========================= */

let W=0;
let H=620;

const BASE_HEIGHT=620;

let renderScale=1;

function resize(){

  const rect =
    root.getBoundingClientRect();

  const cssWidth =
    Math.max(
      1,
      Math.floor(
        rect.width
      )
    );

  const cssHeight =
    Math.max(
      1,
      Math.floor(
        rect.height
      )
    );

  renderScale =
    cssHeight /
    BASE_HEIGHT;

  if(
    !Number.isFinite(renderScale) ||
    renderScale<=0
  ){

    renderScale=1;

  }

  W =
    cssWidth /
    renderScale;

  H =
    BASE_HEIGHT;

  const dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );

  canvas.width =
    Math.max(
      1,
      Math.floor(
        cssWidth*dpr
      )
    );

  canvas.height =
    Math.max(
      1,
      Math.floor(
        cssHeight*dpr
      )
    );

  canvas.style.width =
    cssWidth+"px";

  canvas.style.height =
    cssHeight+"px";

  ctx.setTransform(
    dpr*renderScale,
    0,
    0,
    dpr*renderScale,
    0,
    0
  );

}

window.addEventListener(
  "resize",
  resize
);

if(
  window.ResizeObserver
){

  const resizeObserver =
    new ResizeObserver(
      resize
    );

  resizeObserver.observe(
    root
  );

}

resize();

/* =========================
   AUDIO
========================= */

let audioCtx=null;
let musicTimer=null;
let musicStep=0;

function initAudio(){

  if(audioCtx)
    return;

  try{

    audioCtx =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

  }catch{}

}

function tone(
  frequency,
  duration=.1,
  type="square",
  volume=.04
){

  if(!audioCtx)
    return;

  try{

    const osc =
      audioCtx.createOscillator();

    const gain =
      audioCtx.createGain();

    osc.type=type;

    osc.frequency.value=
      frequency;

    gain.gain.setValueAtTime(
      volume,
      audioCtx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      .001,
      audioCtx.currentTime+
      duration
    );

    osc.connect(gain);

    gain.connect(
      audioCtx.destination
    );

    osc.start();

    osc.stop(
      audioCtx.currentTime+
      duration
    );

  }catch{}

}

function jumpSound(){

  tone(
    420,
    .06,
    "square",
    .035
  );

  setTimeout(
    function(){
      tone(
        650,
        .08,
        "square",
        .03
      );
    },
    45
  );

}

function coinSound(){

  tone(
    880,
    .07,
    "square",
    .04
  );

  setTimeout(
    function(){
      tone(
        1320,
        .1,
        "square",
        .035
      );
    },
    55
  );

}

function stompSound(){

  tone(
    130,
    .08,
    "square",
    .05
  );

}

function hurtSound(){

  tone(
    100,
    .15,
    "sawtooth",
    .04
  );

  setTimeout(
    function(){
      tone(
        70,
        .2,
        "sawtooth",
        .03
      );
    },
    80
  );

}

function powerSound(){

  tone(
    523,
    .08,
    "square",
    .035
  );

  setTimeout(
    function(){
      tone(
        659,
        .08,
        "square",
        .035
      );
    },
    80
  );

  setTimeout(
    function(){
      tone(
        784,
        .12,
        "square",
        .04
      );
    },
    160
  );

}

function winSound(){

  const notes=[
    523,
    659,
    784,
    1046,
    1318
  ];

  notes.forEach(
    function(n,i){

      setTimeout(
        function(){
          tone(
            n,
            .16,
            "square",
            .035
          );
        },
        i*100
      );

    }
  );

}

const melody=[
  659,659,0,659,
  0,523,659,0,
  784,0,392,0,
  523,0,392,0,
  330,0,440,494,
  466,440,392,659,
  784,880,698,784,
  659,523,587,494
];

function musicTick(){

  if(
    !audioCtx ||
    !running
  ){
    return;
  }

  const note =
    melody[
      musicStep %
      melody.length
    ];

  if(note){

    tone(
      note,
      .12,
      "square",
      .018
    );

  }

  musicStep++;

}

function startMusic(){

  stopMusic();

  musicStep=0;

  musicTimer =
    setInterval(
      musicTick,
      145
    );

}

function stopMusic(){

  if(musicTimer){

    clearInterval(
      musicTimer
    );

    musicTimer=null;

  }

}

/* =========================
   CONTROLES
========================= */

const keys={
  left:false,
  right:false,
  jump:false,
  fire:false
};

let jumpPressed=false;
let firePressed=false;

window.addEventListener(
  "keydown",
  function(e){

    initAudio();

    if(
      e.code==="ArrowLeft" ||
      e.code==="KeyA"
    ){

      keys.left=true;

      e.preventDefault();

    }

    if(
      e.code==="ArrowRight" ||
      e.code==="KeyD"
    ){

      keys.right=true;

      e.preventDefault();

    }

    if(
      e.code==="ArrowUp" ||
      e.code==="Space" ||
      e.code==="KeyW"
    ){

      if(!keys.jump)
        jumpPressed=true;

      keys.jump=true;

      e.preventDefault();

    }

    if(
      e.code==="KeyF" ||
      e.code==="KeyX"
    ){

      if(!keys.fire)
        firePressed=true;

      keys.fire=true;

      e.preventDefault();

    }

  }
);

window.addEventListener(
  "keyup",
  function(e){

    if(
      e.code==="ArrowLeft" ||
      e.code==="KeyA"
    ){

      keys.left=false;

    }

    if(
      e.code==="ArrowRight" ||
      e.code==="KeyD"
    ){

      keys.right=false;

    }

    if(
      e.code==="ArrowUp" ||
      e.code==="Space" ||
      e.code==="KeyW"
    ){

      keys.jump=false;

    }

    if(
      e.code==="KeyF" ||
      e.code==="KeyX"
    ){

      keys.fire=false;

    }

  }
);

function bindButton(
  id,
  key
){

  const el =
    document.getElementById(
      id
    );

  function down(e){

    e.preventDefault();

    initAudio();

    if(
      audioCtx &&
      audioCtx.state===
      "suspended"
    ){

      audioCtx.resume();

    }

    if(
      key==="jump" &&
      !keys.jump
    ){

      jumpPressed=true;

    }

    if(
      key==="fire" &&
      !keys.fire
    ){

      firePressed=true;

    }

    keys[key]=true;

  }

  function up(e){

    e.preventDefault();

    keys[key]=false;

  }

  el.addEventListener(
    "pointerdown",
    down
  );

  el.addEventListener(
    "pointerup",
    up
  );

  el.addEventListener(
    "pointercancel",
    up
  );

  el.addEventListener(
    "pointerleave",
    up
  );

}

bindButton(
  "leftBtn",
  "left"
);

bindButton(
  "rightBtn",
  "right"
);

bindButton(
  "jumpBtn",
  "jump"
);

bindButton(
  "fireBtn",
  "fire"
);

/* =========================
   ESTADO
========================= */

let running=false;

let currentLevel=1;

let score=0;
let coins=0;
let lives=3;

let timeLeft=300;

let cameraX=0;

let levelWidth=7000;

let lastTime=0;

let accumulator=0;

const STEP=
  1000/60;

/* =========================
   PLAYER
========================= */

const player={

  x:120,

  y:300,

  w:34,

  h:50,

  vx:0,

  vy:0,

  speed:.62,

  maxSpeed:6.2,

  jump:-13.5,

  grounded:false,

  facing:1,

  big:false,

  fire:false,

  invincible:0,

  coyote:0,

  anim:0,

  dead:false,

  jumpCount:0

};

/* =========================
   MUNDO
========================= */

let platforms=[];
let enemies=[];
let coinsList=[];
let powerups=[];
let blocks=[];
let projectiles=[];
let particles=[];
let decorations=[];

let finish={
  x:6800,
  y:270,
  w:50,
  h:250
};

const GRAVITY=.65;

/* =========================
   FUNÇÕES DE OBJETOS
========================= */

function addPlatform(
  x,
  y,
  w,
  h=40,
  type="ground"
){

  platforms.push({
    x:x,
    y:y,
    w:w,
    h:h,
    type:type
  });

}

function addBlock(
  x,
  y,
  type="brick"
){

  blocks.push({

    x:x,

    y:y-40,

    w:42,

    h:42,

    type:type,

    hit:false,

    used:false

  });

}

function addCoin(
  x,
  y
){

  coinsList.push({

    x:x,

    y:y-20,

    r:10,

    collected:false,

    phase:
      Math.random()*
      Math.PI*2

  });

}

function addEnemy(
  x,
  y,
  type="walker"
){

  enemies.push({

    x:x,

    y:y,

    w:
      type==="flying" ?
        38:
        type==="boss" ?
          50:
          34,

    h:
      type==="flying" ?
        30:
        type==="boss" ?
          55:
          34,

    vx:
      type==="flying" ?
        -1.2:
        -1,

    vy:0,

    type:type,

    alive:true,

    phase:
      Math.random()*10,

    hp:
      type==="boss" ?
        5:
        1

  });

}

function addPower(
  x,
  y,
  type="mushroom"
){

  powerups.push({

    x:x,

    y:y,

    w:32,

    h:30,

    vx:1.4,

    vy:0,

    type:type,

    active:true

  });

}

function addDecoration(
  x,
  y,
  type
){

  decorations.push({
    x:x,
    y:y,
    type:type
  });

}

/* =========================
   FASE 1
========================= */

function buildLevel1(){

  levelWidth=7200;

  addPlatform(0,520,900,100);
  addPlatform(1000,520,900,100);
  addPlatform(2000,520,800,100);
  addPlatform(2900,520,950,100);
  addPlatform(4000,520,850,100);
  addPlatform(5000,520,1100,100);
  addPlatform(6250,520,950,100);

  addPlatform(650,410,170,28,"brick");
  addPlatform(900,340,150,28,"brick");
  addPlatform(1200,400,180,28,"brick");
  addPlatform(1510,330,180,28,"brick");
  addPlatform(2200,400,190,28,"brick");
  addPlatform(2470,320,170,28,"brick");
  addPlatform(3100,400,200,28,"brick");
  addPlatform(3450,340,180,28,"brick");
  addPlatform(4300,390,200,28,"brick");
  addPlatform(4650,320,160,28,"brick");
  addPlatform(5250,390,200,28,"brick");
  addPlatform(5600,310,180,28,"brick");

  addBlock(720,350,"question");
  addBlock(762,350,"brick");
  addBlock(804,350,"question");
  addBlock(1260,340,"question");
  addBlock(1302,340,"question");
  addBlock(2240,340,"question");
  addBlock(2282,340,"brick");
  addBlock(2324,340,"question");
  addBlock(3150,340,"question");
  addBlock(3192,340,"question");
  addBlock(4370,330,"question");
  addBlock(4412,330,"brick");
  addBlock(5310,330,"question");
  addBlock(5352,330,"question");

  const coinPositions=[
    [300,455],[350,455],[400,455],
    [680,365],[730,365],[780,365],
    [950,295],
    [1220,355],[1270,355],[1320,355],
    [1550,285],[1600,285],
    [2250,355],[2300,355],
    [2500,275],[2550,275],
    [3150,355],[3200,355],
    [3500,295],[3550,295],
    [4350,345],[4400,345],
    [4680,275],[4730,275],
    [5280,345],[5330,345],
    [5630,265],[5680,265],
    [5900,455],[5950,455]
  ];

  coinPositions.forEach(function(p){
    addCoin(p[0],p[1]);
  });

  addEnemy(520,470,"walker");
  addEnemy(1100,470,"walker");
  addEnemy(1450,470,"walker");
  addEnemy(2100,470,"walker");
  addEnemy(2750,470,"walker");
  addEnemy(3000,470,"walker");
  addEnemy(3900,470,"walker");
  addEnemy(4200,470,"walker");
  addEnemy(5000,470,"walker");
  addEnemy(6100,470,"walker");

  addEnemy(1700,270,"flying");
  addEnemy(3600,280,"flying");
  addEnemy(4800,260,"flying");

  addPower(741,305,"mushroom");
  addPower(1280,295,"flower");
  addPower(3168,295,"mushroom");

  addDecoration(180,470,"tree");
  addDecoration(870,470,"tree");
  addDecoration(1900,470,"tree");
  addDecoration(2800,470,"tree");
  addDecoration(3850,470,"tree");
  addDecoration(4850,470,"tree");
  addDecoration(6150,470,"tree");

}

/* =========================
   FASE 2
========================= */

function buildLevel2(){

  levelWidth=7600;

  addPlatform(0,520,700,100);
  addPlatform(850,520,650,100);
  addPlatform(1650,520,600,100);
  addPlatform(2400,520,700,100);
  addPlatform(3250,520,650,100);
  addPlatform(4050,520,600,100);
  addPlatform(4800,520,800,100);
  addPlatform(5750,520,800,100);
  addPlatform(6700,520,900,100);

  addPlatform(500,390,150,25,"brick");
  addPlatform(950,330,160,25,"brick");
  addPlatform(1250,400,170,25,"brick");
  addPlatform(1750,350,160,25,"brick");
  addPlatform(2050,290,170,25,"brick");
  addPlatform(2500,380,170,25,"brick");
  addPlatform(2800,310,170,25,"brick");
  addPlatform(3350,390,160,25,"brick");
  addPlatform(3650,300,170,25,"brick");
  addPlatform(4150,380,180,25,"brick");
  addPlatform(4500,300,160,25,"brick");
  addPlatform(4900,380,180,25,"brick");
  addPlatform(5200,300,180,25,"brick");
  addPlatform(5850,380,180,25,"brick");
  addPlatform(6150,300,180,25,"brick");

  for(let i=0;i<12;i++){

    addBlock(
      540+i*42,
      330,
      i%3===0 ?
        "question":
        "brick"
    );

  }

  const coins2=[
    [400,455],[450,455],
    [540,345],[590,345],
    [990,285],[1040,285],
    [1280,355],[1330,355],
    [1780,305],[1830,305],
    [2080,245],[2130,245],
    [2530,335],[2580,335],
    [2830,265],[2880,265],
    [3380,345],[3430,345],
    [3680,255],[3730,255],
    [4180,335],[4230,335],
    [4530,255],[4580,255],
    [4930,335],[4980,335],
    [5230,255],[5280,255],
    [5880,335],[5930,335],
    [6180,255],[6230,255],
    [6400,455],[6450,455]
  ];

  coins2.forEach(function(p){
    addCoin(p[0],p[1]);
  });

  for(let x=350;x<6800;x+=520){

    addEnemy(
      x,
      470,
      "walker"
    );

  }

  addEnemy(1300,300,"flying");
  addEnemy(2200,240,"flying");
  addEnemy(3700,250,"flying");
  addEnemy(5300,250,"flying");
  addEnemy(6200,250,"flying");

  addPower(1000,280,"flower");
  addPower(1810,300,"mushroom");
  addPower(4530,250,"flower");
  addPower(5900,330,"mushroom");

  addDecoration(150,470,"tree");
  addDecoration(800,470,"rock");
  addDecoration(1550,470,"tree");
  addDecoration(2350,470,"rock");
  addDecoration(3150,470,"tree");
  addDecoration(4000,470,"rock");
  addDecoration(4700,470,"tree");
  addDecoration(5650,470,"rock");
  addDecoration(6600,470,"tree");

}

/* =========================
   FASE 3
========================= */

function buildLevel3(){

  levelWidth=8200;

  addPlatform(0,520,800,100);
  addPlatform(950,520,700,100);
  addPlatform(1800,520,650,100);
  addPlatform(2600,520,750,100);
  addPlatform(3500,520,650,100);
  addPlatform(4300,520,750,100);
  addPlatform(5200,520,600,100);
  addPlatform(5950,520,700,100);
  addPlatform(6800,520,1400,100);

  const platforms3=[
    [350,390,180],
    [700,320,150],
    [1100,390,180],
    [1450,300,170],
    [1900,380,190],
    [2250,300,170],
    [2700,390,180],
    [3050,290,170],
    [3600,390,170],
    [3950,300,180],
    [4400,390,180],
    [4750,280,180],
    [5300,390,180],
    [5600,300,180],
    [6100,390,180],
    [6450,300,180]
  ];

  platforms3.forEach(function(p){

    addPlatform(
      p[0],
      p[1],
      p[2],
      25,
      "brick"
    );

  });

  const coins3=[
    [380,345],[430,345],
    [730,275],[780,275],
    [1130,345],[1180,345],
    [1480,255],[1530,255],
    [1930,335],[1980,335],
    [2280,255],[2330,255],
    [2730,345],[2780,345],
    [3080,245],[3130,245],
    [3630,345],[3680,345],
    [3980,255],[4030,255],
    [4430,345],[4480,345],
    [4780,235],[4830,235],
    [5330,345],[5380,345],
    [5630,255],[5680,255],
    [6130,345],[6180,345],
    [6480,255],[6530,255]
  ];

  coins3.forEach(function(p){
    addCoin(p[0],p[1]);
  });

  for(let x=300;x<6600;x+=390){

    addEnemy(
      x,
      470,
      "walker"
    );

  }

  addEnemy(900,300,"flying");
  addEnemy(1600,260,"flying");
  addEnemy(2400,260,"flying");
  addEnemy(3300,240,"flying");
  addEnemy(4200,250,"flying");
  addEnemy(5100,260,"flying");
  addEnemy(6000,250,"flying");

  addPower(750,225,"mushroom");
  addPower(1500,205,"flower");
  addPower(2300,205,"mushroom");
  addPower(4000,255,"flower");
  addPower(4800,205,"mushroom");
  addPower(6500,225,"flower");

  addDecoration(150,470,"tree");
  addDecoration(850,470,"rock");
  addDecoration(1700,470,"tree");
  addDecoration(2500,470,"rock");
  addDecoration(3400,470,"tree");
  addDecoration(4200,470,"rock");
  addDecoration(5100,470,"tree");
  addDecoration(5850,470,"rock");

  addPlatform(
    7200,
    400,
    250,
    25,
    "brick"
  );

  addPlatform(
    7600,
    330,
    250,
    25,
    "brick"
  );

  addEnemy(
    7600,
    250,
    "boss"
  );

}

/* =========================
   CONSTRUIR FASE
========================= */

function buildLevel(){

  platforms=[];
  enemies=[];
  coinsList=[];
  powerups=[];
  blocks=[];
  projectiles=[];
  particles=[];
  decorations=[];

  if(currentLevel===1){
    buildLevel1();
  }

  if(currentLevel===2){
    buildLevel2();
  }

  if(currentLevel===3){
    buildLevel3();
  }

  finish.x=
    levelWidth-220;

  finish.y=270;

}

/* =========================
   COLISÃO
========================= */

function overlap(a,b){

  return(
    a.x<b.x+b.w &&
    a.x+a.w>b.x &&
    a.y<b.y+b.h &&
    a.y+a.h>b.y
  );

}

function solidObjects(){

  return platforms.concat(
    blocks
  );

}

/* =========================
   PARTÍCULAS
========================= */

function particle(
  x,
  y,
  color,
  count=6
){

  for(let i=0;i<count;i++){

    particles.push({

      x:x,

      y:y,

      vx:
        (
          Math.random()-.5
        )*5,

      vy:
        (
          Math.random()-.5
        )*6,

      life:
        .5+
        Math.random()*.5,

      color:color,

      size:
        2+
        Math.random()*4

    });

  }

}

/* =========================
   RESET
========================= */

function resetPlayer(){

  player.x=120;

  player.y=350;

  player.vx=0;

  player.vy=0;

  player.dead=false;

  player.grounded=false;

  player.coyote=0;

  player.invincible=0;

  player.jumpCount=0;

  cameraX=0;

}

/* =========================
   INICIAR
========================= */

function startGame(){

  initAudio();

  if(
    audioCtx &&
    audioCtx.state===
    "suspended"
  ){

    audioCtx.resume();

  }

  score=0;
  coins=0;
  lives=3;
  timeLeft=300;

  buildLevel();

  resetPlayer();

  running=true;

  overlay.style.display=
    "none";

  startMusic();

  lastTime=
    performance.now();

  accumulator=0;

  requestAnimationFrame(
    loop
  );

}

/* =========================
   PLAYER UPDATE
========================= */

function updatePlayer(){

  if(player.dead)
    return;

  const acceleration =
    player.grounded ?
      .72:
      .48;

  if(keys.left){

    player.vx -=
      acceleration;

    player.facing=-1;

  }

  if(keys.right){

    player.vx +=
      acceleration;

    player.facing=1;

  }

  if(
    !keys.left &&
    !keys.right
  ){

    player.vx *=
      player.grounded ?
        .78:
        .94;

  }

  if(
    player.vx>
    player.maxSpeed
  ){

    player.vx=
      player.maxSpeed;

  }

  if(
    player.vx<
    -player.maxSpeed
  ){

    player.vx=
      -player.maxSpeed;

  }

  /* =========================
     PULO NORMAL + PULO DUPLO
  ========================= */

  if(jumpPressed){

    /*
      Primeiro impulso:
      permitido no chão ou durante
      a pequena janela de coyote.
    */

    if(
      player.grounded ||
      player.coyote>0
    ){

      player.vy=
        player.jump;

      player.grounded=false;

      player.coyote=0;

      player.jumpCount=1;

      jumpSound();

      particle(
        player.x+
        player.w/2,
        player.y+
        player.h,
        "#ffffff",
        5
      );

    /*
      Segundo impulso:
      se o personagem ainda estiver no ar,
      outro toque aplica novamente a força
      do pulo a partir da altura atual.
    */

    }else if(
      player.jumpCount===1
    ){

      player.vy=
        player.jump;

      player.grounded=false;

      player.coyote=0;

      player.jumpCount=2;

      jumpSound();

      particle(
        player.x+
        player.w/2,
        player.y+
        player.h,
        "#7dd3fc",
        8
      );

    }

  }

  jumpPressed=false;

  player.vy +=
    GRAVITY;

  if(
    player.vy>15
  ){

    player.vy=15;

  }

  player.x +=
    player.vx;

  if(
    player.x<0
  ){

    player.x=0;

  }

  if(
    player.x>
    levelWidth-player.w
  ){

    player.x=
      levelWidth-player.w;

  }

  for(
    const obj of
    solidObjects()
  ){

    if(
      overlap(
        player,
        obj
      )
    ){

      if(
        player.vx>0
      ){

        player.x=
          obj.x-player.w;

      }else if(
        player.vx<0
      ){

        player.x=
          obj.x+obj.w;

      }

      player.vx=0;

    }

  }

  const previousBottom =
    player.y+
    player.h;

  player.y +=
    player.vy;

  player.grounded=false;

  for(
    const obj of
    solidObjects()
  ){

    if(
      overlap(
        player,
        obj
      )
    ){

      if(
        player.vy>=0 &&
        previousBottom<=
        obj.y+8
      ){

        player.y=
          obj.y-player.h;

        player.vy=0;

        player.grounded=true;

        player.coyote=.12;

        /*
          Ao tocar novamente no chão,
          o contador de pulo é liberado.
        */

        player.jumpCount=0;

      }else if(
        player.vy<0 &&
        player.y>=obj.y
      ){

        player.y=
          obj.y+obj.h;

        player.vy=0;

        hitBlock(obj);

      }

    }

  }

  if(
    !player.grounded
  ){

    player.coyote -=
      1/60;

  }

  if(
    player.invincible>0
  ){

    player.invincible -=
      1/60;

  }

  if(
    player.y>
    H+150
  ){

    loseLife();

  }

  player.anim +=
    Math.abs(
      player.vx
    )*.12;

  if(firePressed){

    if(player.fire){

      shootFireball();

    }

    firePressed=false;

  }

}

/* =========================
   BLOCOS
========================= */

function hitBlock(obj){

  if(
    !obj ||
    obj.type==="ground"
  )
    return;

  obj.hit=true;

  particle(
    obj.x+
    obj.w/2,
    obj.y,
    "#fbbf24",
    7
  );

  if(
    obj.type==="question" &&
    !obj.used
  ){

    obj.used=true;

    const roll=
      Math.random();

    if(
      roll<.45
    ){

      addCoin(
        obj.x+
        obj.w/2,
        obj.y-28
      );

    }else if(
      roll<.75
    ){

      addPower(
        obj.x+5,
        obj.y-34,
        player.big ?
          "flower":
          "mushroom"
      );

    }else{

      addCoin(
        obj.x+
        obj.w/2,
        obj.y-28
      );

      score+=100;

    }

    coinSound();

  }

}

/* =========================
   MOEDAS
========================= */

function updateCoins(){

  for(
    const c of coinsList
  ){

    if(c.collected)
      continue;

    c.phase+=.08;

    if(
      overlap(
        player,
        {
          x:c.x-c.r,
          y:c.y-c.r,
          w:c.r*2,
          h:c.r*2
        }
      )
    ){

      c.collected=true;

      coins++;

      score+=100;

      coinSound();

      particle(
        c.x,
        c.y,
        "#facc15",
        8
      );

      if(
        coins>=100
      ){

        coins=0;

        lives++;

        powerSound();

      }

    }

  }

}

/* =========================
   POWERUPS
========================= */

function updatePowerups(){

  for(
    const p of powerups
  ){

    if(!p.active)
      continue;

    p.vy+=.55;

    p.x+=p.vx;

    p.y+=p.vy;

    for(
      const obj of
      solidObjects()
    ){

      if(
        overlap(
          p,
          obj
        ) &&
        p.vy>=0
      ){

        p.y=
          obj.y-p.h;

        p.vy=0;

      }

    }

    if(
      p.x<0 ||
      p.x+p.w>
      levelWidth
    ){

      p.vx*=-1;

    }

    if(
      overlap(
        player,
        p
      )
    ){

      p.active=false;

      if(
        p.type==="mushroom"
      ){

        player.big=true;

        score+=1000;

      }else{

        player.big=true;

        player.fire=true;

        score+=1500;

      }

      powerSound();

      particle(
        player.x+
        player.w/2,
        player.y+
        player.h/2,
        "#fb7185",
        15
      );

    }

  }

}

/* =========================
   INIMIGOS
========================= */

function updateEnemies(){

  for(
    const e of enemies
  ){

    if(!e.alive)
      continue;

    e.phase+=.04;

    if(
      e.type==="boss"
    ){

      updateBoss(e);

      continue;

    }

    if(
      e.type==="flying"
    ){

      e.x+=e.vx;

      e.y +=
        Math.sin(
          e.phase
        )*.7;

    }else{

      e.vy+=.55;

      e.x+=e.vx;

      e.y+=e.vy;

      for(
        const obj of
        solidObjects()
      ){

        if(
          overlap(
            e,
            obj
          ) &&
          e.vy>=0
        ){

          e.y=
            obj.y-e.h;

          e.vy=0;

        }

      }

      if(
        e.x<0 ||
        e.x+e.w>
        levelWidth
      ){

        e.vx*=-1;

      }

    }

    if(
      overlap(
        player,
        e
      )
    ){

      const playerBottom =
        player.y+
        player.h;

      if(
        player.vy>0 &&
        playerBottom<
        e.y+
        e.h*.65
      ){

        e.alive=false;

        player.vy=-9;

        score+=
          e.type==="flying" ?
            300:
            200;

        stompSound();

        particle(
          e.x+
          e.w/2,
          e.y+
          e.h/2,
          "#f97316",
          10
        );

      }else{

        hurtPlayer();

      }

    }

  }

}

/* =========================
   CHEFE
========================= */

function updateBoss(e){

  e.vx=
    Math.sin(
      e.phase*.35
    )*1.2;

  e.x+=e.vx;

  if(
    e.x<7100
  ){

    e.x=7100;

  }

  if(
    e.x>7900
  ){

    e.x=7900;

  }

  if(
    Math.random()<.008
  ){

    projectiles.push({

      x:e.x,

      y:e.y+25,

      w:16,

      h:16,

      vx:
        player.x<e.x ?
          -4:
          4,

      vy:-3,

      life:3,

      boss:true

    });

  }

  if(
    overlap(
      player,
      e
    )
  ){

    if(
      player.vy>0 &&
      player.y+
      player.h<
      e.y+18
    ){

      player.vy=-10;

      e.hp--;

      score+=500;

      stompSound();

      particle(
        e.x+
        e.w/2,
        e.y,
        "#ef4444",
        12
      );

      if(
        e.hp<=0
      ){

        e.alive=false;

        score+=5000;

        winLevel();

      }

    }else{

      hurtPlayer();

    }

  }

}

/* =========================
   FIREBALL
========================= */

function shootFireball(){

  if(
    projectiles.filter(
      function(p){
        return !p.boss;
      }
    ).length>=3
  ){

    return;

  }

  projectiles.push({

    x:
      player.x+
      (
        player.facing>0 ?
          player.w:
          -12
      ),

    y:
      player.y+
      player.h*.45,

    w:14,

    h:14,

    vx:
      player.facing*8,

    vy:0,

    life:2,

    boss:false

  });

  tone(
    520,
    .07,
    "square",
    .03
  );

}

/* =========================
   PROJÉTEIS
========================= */

function updateProjectiles(){

  for(
    const p of projectiles
  ){

    p.x+=p.vx;

    p.vy +=
      p.boss ?
        .35:
        .55;

    p.y+=p.vy;

    p.life -=
      1/60;

    if(!p.boss){

      for(
        const e of enemies
      ){

        if(
          e.alive &&
          e.type!=="boss" &&
          overlap(
            p,
            e
          )
        ){

          e.alive=false;

          p.life=0;

          score+=300;

          particle(
            e.x+
            e.w/2,
            e.y+
            e.h/2,
            "#fb923c",
            12
          );

        }

      }

    }else{

      if(
        overlap(
          player,
          p
        )
      ){

        p.life=0;

        hurtPlayer();

      }

    }

    if(
      p.life<=0 ||
      p.x<
        cameraX-100 ||
      p.x>
        cameraX+W+100 ||
      p.y>
        H+100
    ){

      p.remove=true;

    }

  }

  projectiles=
    projectiles.filter(
      function(p){
        return (
          !p.remove &&
          p.life>0
        );
      }
    );

}

/* =========================
   DANO
========================= */

function hurtPlayer(){

  if(
    player.invincible>0
  )
    return;

  if(player.fire){

    player.fire=false;

    player.invincible=2;

    hurtSound();

    particle(
      player.x+
      player.w/2,
      player.y+
      player.h/2,
      "#ef4444",
      10
    );

    return;

  }

  if(player.big){

    player.big=false;

    player.invincible=2;

    hurtSound();

    particle(
      player.x+
      player.w/2,
      player.y+
      player.h/2,
      "#facc15",
      10
    );

    return;

  }

  loseLife();

}

function loseLife(){

  if(player.dead)
    return;

  lives--;

  hurtSound();

  if(
    lives<=0
  ){

    gameOver();

    return;

  }

  player.dead=true;

  setTimeout(
    function(){

      player.dead=false;

      resetPlayer();

    },
    900
  );

}

/* =========================
   FINAL
========================= */

function checkFinish(){

  const gate={
    x:finish.x,
    y:finish.y,
    w:50,
    h:250
  };

  if(
    overlap(
      player,
      gate
    )
  ){

    winLevel();

  }

}

function winLevel(){

  if(!running)
    return;

  running=false;

  stopMusic();

  score +=
    Math.max(
      0,
      timeLeft
    )*10;

  winSound();

  if(
    currentLevel<3
  ){

    overlay.style.display=
      "flex";

    panelIcon.textContent=
      "🏆";

    panelTitle.textContent=
      "FASE CONCLUÍDA!";

    panelText.textContent=
      "Você terminou a fase "+
      currentLevel+
      ". Prepare-se para a próxima!";

    startBtn.textContent=
      "PRÓXIMA FASE";

    currentLevel++;

    updateLevelButtons();

  }else{

    overlay.style.display=
      "flex";

    panelIcon.textContent=
      "👑";

    panelTitle.textContent=
      "VOCÊ VENCEU!";

    panelText.textContent=
      "Parabéns! Você completou todas as fases do Obsidian Bros! Pontuação: "+
      score;

    startBtn.textContent=
      "JOGAR NOVAMENTE";

    currentLevel=1;

    updateLevelButtons();

  }

}

/* =========================
   GAME OVER
========================= */

function gameOver(){

  running=false;

  stopMusic();

  overlay.style.display=
    "flex";

  panelIcon.textContent=
    "💀";

  panelTitle.textContent=
    "GAME OVER";

  panelText.textContent=
    "Suas vidas acabaram. Pontuação final: "+
    score;

  startBtn.textContent=
    "TENTAR NOVAMENTE";

  currentLevel=1;

  updateLevelButtons();

}

/* =========================
   TEMPO
========================= */

let timerAccumulator=0;

function updateTimer(dt){

  timerAccumulator+=dt;

  if(
    timerAccumulator>=1000
  ){

    timerAccumulator-=1000;

    timeLeft--;

    if(
      timeLeft<=0
    ){

      timeLeft=0;

      loseLife();

    }

  }

}

/* =========================
   CÂMERA
========================= */

function updateCamera(){

  const target=
    player.x-
    W*.38;

  cameraX +=
    (
      target-cameraX
    )*.12;

  if(cameraX<0)
    cameraX=0;

  if(
    cameraX>
    levelWidth-W
  ){

    cameraX=
      Math.max(
        0,
        levelWidth-W
      );

  }

}

/* =========================
   PARTÍCULAS UPDATE
========================= */

function updateParticles(dt){

  for(
    const p of particles
  ){

    p.x+=p.vx;

    p.y+=p.vy;

    p.vy+=.15;

    p.life-=
      dt/1000;

  }

  particles=
    particles.filter(
      function(p){
        return p.life>0;
      }
    );

}

/* =========================
   UPDATE
========================= */

function update(dt){

  if(!running)
    return;

  updateTimer(dt);

  updatePlayer();

  updateCoins();

  updatePowerups();

  updateEnemies();

  updateProjectiles();

  updateParticles(dt);

  checkFinish();

  updateCamera();

  updateHUD();

}

/* =========================
   BACKGROUND
========================= */

function drawBackground(){

  const gradient=
    ctx.createLinearGradient(
      0,
      0,
      0,
      H
    );

  if(
    currentLevel===1
  ){

    gradient.addColorStop(
      0,
      "#38bdf8"
    );

    gradient.addColorStop(
      1,
      "#dbeafe"
    );

  }else if(
    currentLevel===2
  ){

    gradient.addColorStop(
      0,
      "#fb923c"
    );

    gradient.addColorStop(
      1,
      "#7c2d12"
    );

  }else{

    gradient.addColorStop(
      0,
      "#1e1b4b"
    );

    gradient.addColorStop(
      1,
      "#020617"
    );

  }

  ctx.fillStyle=
    gradient;

  ctx.fillRect(
    0,
    0,
    W,
    H
  );

  ctx.save();

  ctx.translate(
    -cameraX*.18,
    0
  );

  for(
    let i=0;
    i<18;
    i++
  ){

    const x=
      i*500+100;

    const y=
      100+
      (
        i%4
      )*55;

    ctx.fillStyle=
      "rgba(255,255,255,.25)";

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      28,
      0,
      Math.PI*2
    );

    ctx.arc(
      x+35,
      y-10,
      35,
      0,
      Math.PI*2
    );

    ctx.arc(
      x+75,
      y,
      25,
      0,
      Math.PI*2
    );

    ctx.fill();

  }

  ctx.restore();

  ctx.save();

  ctx.translate(
    -cameraX*.3,
    0
  );

  ctx.fillStyle=
    currentLevel===3 ?
      "#111827":
      "#166534";

  for(
    let i=0;
    i<18;
    i++
  ){

    const x=
      i*550;

    ctx.beginPath();

    ctx.moveTo(
      x,
      520
    );

    ctx.quadraticCurveTo(
      x+140,
      350,
      x+280,
      520
    );

    ctx.quadraticCurveTo(
      x+400,
      380,
      x+550,
      520
    );

    ctx.fill();

  }

  ctx.restore();

}

/* =========================
   MUNDO
========================= */

function drawWorld(){

  ctx.save();

  ctx.translate(
    -cameraX,
    0
  );

  drawDecorations();

  drawPlatforms();

  drawBlocks();

  drawCoins();

  drawPowerups();

  drawEnemies();

  drawProjectiles();

  drawFinish();

  drawPlayer();

  drawParticles();

  ctx.restore();

}

/* =========================
   PLATAFORMAS
========================= */

function drawPlatforms(){

  for(
    const p of platforms
  ){

    ctx.fillStyle=
      p.type==="brick" ?
        "#92400e":
        "#14532d";

    ctx.fillRect(
      p.x,
      p.y,
      p.w,
      p.h
    );

    if(
      p.type==="brick"
    ){

      ctx.fillStyle=
        "#b45309";

      for(
        let x=p.x;
        x<p.x+p.w;
        x+=42
      ){

        ctx.fillRect(
          x,
          p.y,
          38,
          5
        );

        ctx.fillStyle=
          "#78350f";

        ctx.fillRect(
          x,
          p.y+21,
          38,
          3
        );

        ctx.fillStyle=
          "#b45309";

      }

    }else{

      ctx.fillStyle=
        "#22c55e";

      ctx.fillRect(
        p.x,
        p.y,
        p.w,
        7
      );

      ctx.fillStyle=
        "#166534";

      for(
        let x=p.x+8;
        x<p.x+p.w;
        x+=30
      ){

        ctx.fillRect(
          x,
          p.y+14,
          12,
          8
        );

      }

    }

  }

}

/* =========================
   BLOCOS DESENHO
========================= */

function drawBlocks(){

  for(
    const b of blocks
  ){

    ctx.fillStyle=
      b.used ?
        "#57534e":
        b.type==="question" ?
          "#eab308":
          "#b45309";

    ctx.fillRect(
      b.x,
      b.y,
      b.w,
      b.h
    );

    ctx.strokeStyle=
      "rgba(0,0,0,.35)";

    ctx.lineWidth=2;

    ctx.strokeRect(
      b.x,
      b.y,
      b.w,
      b.h
    );

    if(
      b.type==="question" &&
      !b.used
    ){

      ctx.fillStyle=
        "#fff";

      ctx.font=
        "bold 25px Arial";

      ctx.textAlign=
        "center";

      ctx.fillText(
        "?",
        b.x+
        b.w/2,
        b.y+29
      );

    }

  }

}

/* =========================
   MOEDAS DESENHO
========================= */

function drawCoins(){

  for(
    const c of coinsList
  ){

    if(c.collected)
      continue;

    const squash=
      .25+
      Math.abs(
        Math.cos(
          c.phase
        )
      )*.75;

    ctx.save();

    ctx.translate(
      c.x,
      c.y
    );

    ctx.scale(
      squash,
      1
    );

    ctx.fillStyle=
      "#facc15";

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      c.r,
      0,
      Math.PI*2
    );

    ctx.fill();

    ctx.strokeStyle=
      "#a16207";

    ctx.lineWidth=2;

    ctx.stroke();

    ctx.restore();

  }

}

/* =========================
   POWERUPS DESENHO
========================= */

function drawPowerups(){

  for(
    const p of powerups
  ){

    if(!p.active)
      continue;

    if(
      p.type==="mushroom"
    ){

      ctx.fillStyle=
        "#ef4444";

      ctx.beginPath();

      ctx.arc(
        p.x+16,
        p.y+12,
        15,
        Math.PI,
        0
      );

      ctx.fill();

      ctx.fillStyle=
        "#fff";

      ctx.beginPath();

      ctx.arc(
        p.x+10,
        p.y+9,
        4,
        0,
        Math.PI*2
      );

      ctx.arc(
        p.x+22,
        p.y+7,
        4,
        0,
        Math.PI*2
      );

      ctx.fill();

      ctx.fillStyle=
        "#fef3c7";

      ctx.fillRect(
        p.x+6,
        p.y+12,
        20,
        17
      );

    }else{

      ctx.fillStyle=
        "#22c55e";

      ctx.beginPath();

      ctx.arc(
        p.x+16,
        p.y+15,
        13,
        0,
        Math.PI*2
      );

      ctx.fill();

      ctx.fillStyle=
        "#fef08a";

      ctx.beginPath();

      ctx.arc(
        p.x+10,
        p.y+10,
        5,
        0,
        Math.PI*2
      );

      ctx.fill();

      ctx.fillStyle=
        "#ef4444";

      ctx.fillRect(
        p.x+10,
        p.y+20,
        5,
        10
      );

      ctx.fillStyle=
        "#f97316";

      ctx.fillRect(
        p.x+18,
        p.y+20,
        5,
        10
      );

    }

  }

}

/* =========================
   INIMIGOS DESENHO
========================= */

function drawEnemies(){

  for(
    const e of enemies
  ){

    if(!e.alive)
      continue;

    if(
      e.type==="boss"
    ){

      drawBoss(e);

      continue;

    }

    if(
      e.type==="flying"
    ){

      ctx.fillStyle=
        "#a855f7";

      ctx.beginPath();

      ctx.ellipse(
        e.x+19,
        e.y+15,
        18,
        13,
        0,
        0,
        Math.PI*2
      );

      ctx.fill();

      ctx.fillStyle="#fff";

      ctx.beginPath();

      ctx.arc(
        e.x+13,
        e.y+12,
        4,
        0,
        Math.PI*2
      );

      ctx.arc(
        e.x+25,
        e.y+12,
        4,
        0,
        Math.PI*2
      );

      ctx.fill();

      ctx.fillStyle="#111";

      ctx.beginPath();

      ctx.arc(
        e.x+13,
        e.y+12,
        2,
        0,
        Math.PI*2
      );

      ctx.arc(
        e.x+25,
        e.y+12,
        2,
        0,
        Math.PI*2
      );

      ctx.fill();

    }else{

      ctx.fillStyle=
        "#b91c1c";

      ctx.beginPath();

      ctx.arc(
        e.x+17,
        e.y+15,
        17,
        Math.PI,
        0
      );

      ctx.fill();

      ctx.fillStyle=
        "#fbbf24";

      ctx.fillRect(
        e.x+5,
        e.y+15,
        24,
        14
      );

      ctx.fillStyle="#111";

      ctx.beginPath();

      ctx.arc(
        e.x+11,
        e.y+19,
        3,
        0,
        Math.PI*2
      );

      ctx.arc(
        e.x+23,
        e.y+19,
        3,
        0,
        Math.PI*2
      );

      ctx.fill();

      ctx.fillStyle=
        "#7f1d1d";

      ctx.fillRect(
        e.x+3,
        e.y+29,
        28,
        5
      );

    }

  }

}

/* =========================
   CHEFE DESENHO
========================= */

function drawBoss(e){

  ctx.fillStyle=
    "#7f1d1d";

  ctx.beginPath();

  ctx.arc(
    e.x+25,
    e.y+25,
    28,
    0,
    Math.PI*2
  );

  ctx.fill();

  ctx.fillStyle=
    "#dc2626";

  ctx.fillRect(
    e.x,
    e.y+24,
    50,
    28
  );

  ctx.fillStyle="#fff";

  ctx.beginPath();

  ctx.arc(
    e.x+15,
    e.y+22,
    6,
    0,
    Math.PI*2
  );

  ctx.arc(
    e.x+35,
    e.y+22,
    6,
    0,
    Math.PI*2
  );

  ctx.fill();

  ctx.fillStyle="#111";

  ctx.beginPath();

  ctx.arc(
    e.x+15,
    e.y+22,
    3,
    0,
    Math.PI*2
  );

  ctx.arc(
    e.x+35,
    e.y+22,
    3,
    0,
    Math.PI*2
  );

  ctx.fill();

  ctx.fillStyle=
    "rgba(0,0,0,.5)";

  ctx.fillRect(
    e.x,
    e.y-14,
    50,
    6
  );

  ctx.fillStyle=
    "#22c55e";

  ctx.fillRect(
    e.x,
    e.y-14,
    10*e.hp,
    6
  );

}

/* =========================
   PROJÉTEIS DESENHO
========================= */

function drawProjectiles(){

  for(
    const p of projectiles
  ){

    ctx.fillStyle=
      p.boss ?
        "#a855f7":
        "#fb923c";

    ctx.beginPath();

    ctx.arc(
      p.x+p.w/2,
      p.y+p.h/2,
      p.w/2,
      0,
      Math.PI*2
    );

    ctx.fill();

    if(!p.boss){

      ctx.fillStyle=
        "#fde047";

      ctx.beginPath();

      ctx.arc(
        p.x+4,
        p.y+4,
        3,
        0,
        Math.PI*2
      );

      ctx.fill();

    }

  }

}

/* =========================
   BANDEIRA
========================= */

function drawFinish(){

  const x=
    finish.x;

  const y=
    finish.y;

  ctx.fillStyle=
    "#e5e7eb";

  ctx.fillRect(
    x+18,
    y,
    7,
    250
  );

  ctx.fillStyle=
    "#22c55e";

  ctx.beginPath();

  ctx.moveTo(
    x+25,
    y+8
  );

  ctx.lineTo(
    x+95,
    y+35
  );

  ctx.lineTo(
    x+25,
    y+62
  );

  ctx.closePath();

  ctx.fill();

  ctx.fillStyle=
    "#facc15";

  ctx.beginPath();

  ctx.arc(
    x+21,
    y,
    9,
    0,
    Math.PI*2
  );

  ctx.fill();

}

/* =========================
   DECORAÇÕES
========================= */

function drawDecorations(){

  for(
    const d of decorations
  ){

    if(
      d.type==="tree"
    ){

      ctx.fillStyle=
        "#78350f";

      ctx.fillRect(
        d.x+20,
        d.y-55,
        15,
        55
      );

      ctx.fillStyle=
        "#166534";

      ctx.beginPath();

      ctx.arc(
        d.x+28,
        d.y-65,
        32,
        0,
        Math.PI*2
      );

      ctx.arc(
        d.x+5,
        d.y-45,
        25,
        0,
        Math.PI*2
      );

      ctx.arc(
        d.x+52,
        d.y-45,
        25,
        0,
        Math.PI*2
      );

      ctx.fill();

    }else{

      ctx.fillStyle=
        "#64748b";

      ctx.beginPath();

      ctx.moveTo(
        d.x,
        d.y
      );

      ctx.lineTo(
        d.x+30,
        d.y-35
      );

      ctx.lineTo(
        d.x+65,
        d.y
      );

      ctx.closePath();

      ctx.fill();

    }

  }

}

/* =========================
   PLAYER DESENHO
========================= */

function drawPlayer(){

  if(player.dead)
    return;

  if(
    player.invincible>0 &&
    Math.floor(
      player.invincible*12
    )%2===0
  ){

    return;

  }

  const h=
    player.big ?
      62:
      50;

  const y=
    player.y+
    player.h-
    h;

  const x=
    player.x;

  ctx.save();

  if(
    player.facing<0
  ){

    ctx.translate(
      x+player.w,
      0
    );

    ctx.scale(
      -1,
      1
    );

  }else{

    ctx.translate(
      x,
      0
    );

  }

  ctx.fillStyle=
    "#dc2626";

  ctx.fillRect(
    4,
    y,
    28,
    10
  );

  ctx.fillRect(
    9,
    y-4,
    20,
    7
  );

  ctx.fillStyle=
    "#f59e0b";

  ctx.fillRect(
    8,
    y+10,
    23,
    19
  );

  ctx.fillStyle=
    "#451a03";

  ctx.fillRect(
    7,
    y+10,
    8,
    13
  );

  ctx.fillStyle=
    "#2563eb";

  ctx.fillRect(
    7,
    y+28,
    24,
    18
  );

  ctx.fillStyle=
    "#ef4444";

  ctx.fillRect(
    3,
    y+27,
    9,
    17
  );

  ctx.fillRect(
    26,
    y+27,
    9,
    17
  );

  ctx.fillStyle=
    "#1e3a8a";

  ctx.fillRect(
    9,
    y+44,
    9,
    12
  );

  ctx.fillRect(
    22,
    y+44,
    9,
    12
  );

  ctx.fillStyle=
    "#451a03";

  ctx.fillRect(
    5,
    y+53,
    14,
    7
  );

  ctx.fillRect(
    22,
    y+53,
    14,
    7
  );

  ctx.fillStyle=
    "#111827";

  ctx.fillRect(
    24,
    y+15,
    4,
    5
  );

  ctx.fillStyle=
    "#78350f";

  ctx.fillRect(
    18,
    y+24,
    11,
    4
  );

  if(player.fire){

    ctx.fillStyle=
      "#f97316";

    ctx.beginPath();

    ctx.arc(
      29,
      y-8,
      7+
      Math.sin(
        performance.now()*.015
      )*2,
      0,
      Math.PI*2
    );

    ctx.fill();

  }

  ctx.restore();

}

/* =========================
   PARTÍCULAS DESENHO
========================= */

function drawParticles(){

  for(
    const p of particles
  ){

    ctx.globalAlpha=
      Math.max(
        0,
        p.life
      );

    ctx.fillStyle=
      p.color;

    ctx.fillRect(
      p.x,
      p.y,
      p.size,
      p.size
    );

  }

  ctx.globalAlpha=1;

}

/* =========================
   HUD
========================= */

function updateHUD(){

  scoreEl.textContent=
    String(score)
      .padStart(
        6,
        "0"
      );

  coinsEl.textContent=
    String(coins)
      .padStart(
        2,
        "0"
      );

  levelEl.textContent=
    "1-"+currentLevel;

  timeEl.textContent=
    Math.max(
      0,
      Math.floor(
        timeLeft
      )
    );

  livesEl.textContent=
    lives;

}

/* =========================
   BOTÕES DE FASE
========================= */

function updateLevelButtons(){

  [
    [level1Btn,1],
    [level2Btn,2],
    [level3Btn,3]

  ].forEach(
    function(pair){

      pair[0]
        .classList
        .toggle(
          "active",
          pair[1]===
          currentLevel
        );

    }
  );

}

level1Btn.addEventListener(
  "click",
  function(){

    currentLevel=1;

    updateLevelButtons();

  }
);

level2Btn.addEventListener(
  "click",
  function(){

    currentLevel=2;

    updateLevelButtons();

  }
);

level3Btn.addEventListener(
  "click",
  function(){

    currentLevel=3;

    updateLevelButtons();

  }
);

/* =========================
   START
========================= */

startBtn.addEventListener(
  "click",
  function(){

    startGame();

  }
);

/* =========================
   DESENHAR
========================= */

function draw(){

  drawBackground();

  drawWorld();

}

/* =========================
   LOOP
========================= */

function loop(timestamp){

  if(!running){

    draw();

    return;

  }

  const delta=
    Math.min(
      50,
      timestamp-lastTime
    );

  lastTime=timestamp;

  accumulator+=delta;

  while(
    accumulator>=STEP
  ){

    update(
      STEP
    );

    accumulator-=STEP;

  }

  draw();

  requestAnimationFrame(
    loop
  );

}

/* =========================
   INICIALIZAÇÃO
========================= */

buildLevel();

resetPlayer();

updateHUD();

updateLevelButtons();

draw();

})();
</script>

</div>
`;

function executeGameScripts(container){

  const scripts=[
    ...container.querySelectorAll(
      "script"
    )
  ];

  for(
    const oldScript of scripts
  ){

    const script=
      document.createElement(
        "script"
      );

    for(
      const attr of
      oldScript.attributes
    ){

      script.setAttribute(
        attr.name,
        attr.value
      );

    }

    script.textContent=
      oldScript.textContent;

    oldScript.remove();

    container.appendChild(
      script
    );

  }

}

registerGame({

  id:"obsidianbros",

  name:"Obsidian Bros",

  category:"Plataforma",

  icon:"🍄",

  init({container}){

    container.innerHTML=
      OBSIDIAN_BROS_HTML;

    executeGameScripts(
      container
    );

  }

});