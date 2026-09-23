import { registerGame } from "../arcade.js";

const BILHAR_HTML = String.raw`<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap');

*{
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
  -webkit-user-select:none;
  user-select:none;
  -webkit-touch-callout:none;
  touch-action:none;
}

.wrap{
  width:100%;
  max-width:440px;
  margin:auto;
  font-family:'Orbitron',sans-serif;
}

.page{
  position:relative;
  background:
    radial-gradient(
      circle at 50% 25%,
      rgba(18,24,56,.92) 0%,
      rgba(8,11,24,.97) 65%,
      #050711 100%
    ),
    linear-gradient(170deg,#0d1124,#050711);

  border-radius:14px;
  border:1px solid rgba(0,243,255,.25);

  box-shadow:
    0 0 25px rgba(0,243,255,.15),
    0 22px 40px rgba(0,0,0,.75),
    inset 0 0 15px rgba(0,243,255,.05);

  padding:18px;
  overflow:hidden;
}

.content{
  position:relative;
}

.scorecorner{
  display:flex;
  justify-content:flex-end;
  gap:10px;
  margin-bottom:5px;
}

.score-item{
  text-align:center;
  min-width:42px;
}

.score-num{
  display:block;
  font-weight:900;
  font-size:18px;
  line-height:1;
  color:#00f3ff;
  text-shadow:0 0 8px rgba(0,243,255,.7);
}

.score-label{
  display:block;
  margin-top:3px;
  font-size:7px;
  color:#8fa1c7;
  text-transform:uppercase;
  letter-spacing:.5px;
}

.title{
  font-weight:900;
  font-size:25px;
  line-height:1.1;
  color:#fff;
  text-shadow:
    0 0 10px rgba(255,255,255,.5),
    0 0 20px rgba(0,243,255,.4);
  margin:0 0 2px;
  letter-spacing:1px;
}

.subtitle{
  font-size:9px;
  color:#00f3ff;
  text-transform:uppercase;
  letter-spacing:2px;
  margin-bottom:10px;
  text-shadow:0 0 5px rgba(0,243,255,.5);
}

.status{
  text-align:center;
  font-weight:700;
  font-size:12px;
  color:#8fa1c7;
  min-height:18px;
  margin-bottom:8px;
  letter-spacing:.5px;
}

.status.win{
  color:#00f3ff;
  text-shadow:0 0 8px rgba(0,243,255,.7);
}

.status.lose{
  color:#ff0055;
  text-shadow:0 0 8px rgba(255,0,85,.7);
}

.table-wrap{
  width:min(100%,400px);
  margin:4px auto 10px;
  position:relative;
}

.table{
  position:relative;
  width:100%;
  aspect-ratio:1.72/1;
  border-radius:14px;

  background:
    radial-gradient(
      ellipse at center,
      #073e46 0%,
      #062d34 55%,
      #031a20 100%
    );

  border:9px solid #08131c;

  box-shadow:
    0 0 0 2px rgba(0,243,255,.35),
    0 0 18px rgba(0,243,255,.35),
    inset 0 0 25px rgba(0,0,0,.8);

  overflow:hidden;
  touch-action:none;
}

.table:before{
  content:"";
  position:absolute;
  inset:3px;
  border:1px solid rgba(0,243,255,.25);
  border-radius:8px;
  pointer-events:none;
}

.pocket{
  position:absolute;
  width:9%;
  aspect-ratio:1;
  border-radius:50%;
  background:#010207;

  box-shadow:
    inset 0 0 8px #000,
    0 0 7px rgba(0,0,0,.9);

  z-index:1;
}

.p1{
  left:-2.5%;
  top:-4%;
}

.p2{
  left:45.5%;
  top:-4%;
}

.p3{
  right:-2.5%;
  top:-4%;
}

.p4{
  left:-2.5%;
  bottom:-4%;
}

.p5{
  left:45.5%;
  bottom:-4%;
}

.p6{
  right:-2.5%;
  bottom:-4%;
}

.ball{
  position:absolute;
  width:7%;
  aspect-ratio:1;
  border-radius:50%;
  transform:translate(-50%,-50%);

  box-shadow:
    inset -3px -3px 5px rgba(0,0,0,.45),
    inset 2px 2px 4px rgba(255,255,255,.55),
    0 0 7px rgba(255,255,255,.25);

  z-index:4;
}

.ball:after{
  content:"";
  position:absolute;
  width:30%;
  height:30%;
  left:20%;
  top:17%;
  border-radius:50%;
  background:rgba(255,255,255,.75);
  filter:blur(1px);
}

.white{
  background:#f4fbff;
  box-shadow:
    inset -3px -3px 5px rgba(0,0,0,.3),
    inset 2px 2px 4px #fff,
    0 0 9px rgba(255,255,255,.65);
}

.player-ball{
  background:
    radial-gradient(circle at 35% 30%,#ff9bb7 0%,#ff0055 40%,#9e0037 100%);
  box-shadow:
    inset -3px -3px 5px rgba(0,0,0,.45),
    inset 2px 2px 4px rgba(255,255,255,.55),
    0 0 9px rgba(255,0,85,.75);
}

.bot-ball{
  background:
    radial-gradient(circle at 35% 30%,#8fffff 0%,#00aeca 40%,#005469 100%);
  box-shadow:
    inset -3px -3px 5px rgba(0,0,0,.45),
    inset 2px 2px 4px rgba(255,255,255,.55),
    0 0 9px rgba(0,243,255,.75);
}

.ball.stripe{
  background:
    linear-gradient(
      0deg,
      transparent 27%,
      #fff 28%,
      #fff 72%,
      transparent 73%
    ),
    radial-gradient(
      circle at 35% 30%,
      #ff9bb7,
      #ff0055 45%,
      #9e0037
    );
}

.ball.botstripe{
  background:
    linear-gradient(
      0deg,
      transparent 27%,
      #fff 28%,
      #fff 72%,
      transparent 73%
    ),
    radial-gradient(
      circle at 35% 30%,
      #8fffff,
      #00aeca 45%,
      #005469
    );
}

.aim-line{
  position:absolute;
  height:2px;
  transform-origin:left center;
  background:
    linear-gradient(
      90deg,
      rgba(255,255,255,.95),
      rgba(0,243,255,.8),
      transparent
    );

  box-shadow:
    0 0 6px rgba(0,243,255,.8);

  z-index:3;
  pointer-events:none;
}

.cue-stick{
  position:absolute;
  height:5px;
  border-radius:3px;
  transform-origin:left center;
  background:
    linear-gradient(
      90deg,
      #ffd9a0 0%,
      #caa06b 35%,
      #8a5a2b 75%,
      #4a2e14 100%
    );
  box-shadow:
    0 0 8px rgba(0,0,0,.7),
    0 0 10px rgba(0,243,255,.35);
  z-index:5;
  pointer-events:none;
  display:none;
}

.cue-stick:before{
  content:"";
  position:absolute;
  left:-2px;
  top:50%;
  width:11px;
  height:11px;
  border-radius:50%;
  background:#00f3ff;
  box-shadow:0 0 8px rgba(0,243,255,.9);
  transform:translate(-50%,-50%);
}

.power-box{
  width:min(100%,330px);
  margin:0 auto 9px;
  height:8px;
  border-radius:10px;
  overflow:hidden;
  background:rgba(255,255,255,.07);
  border:1px solid rgba(0,243,255,.18);
}

.power-fill{
  width:0%;
  height:100%;
  background:
    linear-gradient(
      90deg,
      #00f3ff,
      #7dfff7,
      #ff0055
    );
  box-shadow:0 0 10px rgba(0,243,255,.7);
  transition:width .05s linear;
}

.info{
  display:flex;
  justify-content:space-between;
  width:min(100%,330px);
  margin:0 auto 8px;
  font-size:8px;
  color:#8fa1c7;
}

.message{
  text-align:center;
  font-size:9px;
  color:#8fa1c7;
  min-height:15px;
  margin-bottom:9px;
  letter-spacing:.4px;
}

.buttons{
  display:flex;
  gap:8px;
  justify-content:center;
}

.btn{
  font-family:'Orbitron',sans-serif;
  font-size:9px;
  font-weight:700;
  color:#00f3ff;
  background:rgba(0,243,255,.1);
  border:1px solid rgba(0,243,255,.4);
  border-radius:8px;
  padding:9px 13px;
  cursor:pointer;
  box-shadow:0 0 10px rgba(0,243,255,.15);
  letter-spacing:.4px;
}

.btn:active{
  transform:scale(.95);
}

.btn-ghost{
  color:#8fa1c7;
  background:rgba(255,255,255,.05);
  border-color:rgba(255,255,255,.2);
  box-shadow:none;
}

@media(max-width:380px){

  .page{
    padding:14px;
  }

  .title{
    font-size:22px;
  }

  .ball{
    width:7.2%;
  }

}
</style>

<div class="wrap">
<div class="page">
<div class="content">

<div class="scorecorner">

<div class="score-item">
<span class="score-num" id="wins">0</span>
<span class="score-label">vitórias</span>
</div>

<div class="score-item">
<span class="score-num" id="draws">0</span>
<span class="score-label">empates</span>
</div>

<div class="score-item">
<span class="score-num" id="losses">0</span>
<span class="score-label">derrotas</span>
</div>

</div>

<div class="title">
NEON_BILHAR
</div>

<div class="subtitle">
Cyber Pool Edition
</div>

<div class="status" id="status">
sua vez [JOGADOR]
</div>

<div class="table-wrap">

<div class="table" id="table">

<div class="pocket p1"></div>
<div class="pocket p2"></div>
<div class="pocket p3"></div>
<div class="pocket p4"></div>
<div class="pocket p5"></div>
<div class="pocket p6"></div>

<div class="aim-line" id="aim"></div>

<div class="cue-stick" id="cueStick"></div>

</div>

</div>

<div class="power-box">
<div class="power-fill" id="power"></div>
</div>

<div class="info">
<span id="powerText">FORÇA: 0%</span>
<span id="ballsText">SUAS: 4 | BOT: 4</span>
</div>

<div class="message" id="message">
arraste em qualquer lugar da mesa pra mirar e solte para tacar
</div>

<div class="buttons">

<button class="btn" id="restart">
reiniciar
</button>

<button class="btn btn-ghost" id="newgame">
zerar placar
</button>

</div>

</div>
</div>
</div>

<script>
(function(){

"use strict";

var table =
  document.getElementById("table");

var aim =
  document.getElementById("aim");

var cueStick =
  document.getElementById("cueStick");

var power =
  document.getElementById("power");

var powerText =
  document.getElementById("powerText");

var ballsText =
  document.getElementById("ballsText");

var statusEl =
  document.getElementById("status");

var messageEl =
  document.getElementById("message");

var winsEl =
  document.getElementById("wins");

var drawsEl =
  document.getElementById("draws");

var lossesEl =
  document.getElementById("losses");

var restartBtn =
  document.getElementById("restart");

var newgameBtn =
  document.getElementById("newgame");

var W = 1000;
var H = 580;

var ballRadius = 20;

var friction = 0.985;

var pocketRadius = 38;

var balls = [];

var playerBalls = 4;

var botBalls = 4;

var playerTurn = true;

var playing = true;

var aiming = false;

var aimStart = null;

var aimCurrent = null;

var shotPower = 0;

var animation = null;

var activePointerId = null;

var wins = 0;
var draws = 0;
var losses = 0;

try{

  wins =
    Number(
      localStorage.getItem(
        "neon_bilhar_wins"
      ) || 0
    );

  draws =
    Number(
      localStorage.getItem(
        "neon_bilhar_draws"
      ) || 0
    );

  losses =
    Number(
      localStorage.getItem(
        "neon_bilhar_losses"
      ) || 0
    );

}catch(e){}

function save(){

  try{

    localStorage.setItem(
      "neon_bilhar_wins",
      String(wins)
    );

    localStorage.setItem(
      "neon_bilhar_draws",
      String(draws)
    );

    localStorage.setItem(
      "neon_bilhar_losses",
      String(losses)
    );

  }catch(e){}

}

function updateScore(){

  winsEl.textContent =
    String(wins);

  drawsEl.textContent =
    String(draws);

  lossesEl.textContent =
    String(losses);

  ballsText.textContent =
    "SUAS: " +
    playerBalls +
    " | BOT: " +
    botBalls;

  save();

}

function createBall(
  id,
  x,
  y,
  color,
  type
){

  return {

    id:id,

    x:x,

    y:y,

    vx:0,

    vy:0,

    color:color,

    type:type,

    active:true

  };

}

function setup(){

  balls = [];

  playerBalls = 4;

  botBalls = 4;

  balls.push(
    createBall(
      "cue",
      250,
      290,
      "white",
      "cue"
    )
  );

  balls.push(
    createBall(
      "p1",
      650,
      250,
      "player",
      "player"
    )
  );

  balls.push(
    createBall(
      "p2",
      695,
      275,
      "player",
      "player"
    )
  );

  balls.push(
    createBall(
      "p3",
      695,
      325,
      "player",
      "player"
    )
  );

  balls.push(
    createBall(
      "p4",
      650,
      350,
      "player",
      "player"
    )
  );

  balls.push(
    createBall(
      "b1",
      740,
      250,
      "bot",
      "bot"
    )
  );

  balls.push(
    createBall(
      "b2",
      740,
      300,
      "bot",
      "bot"
    )
  );

  balls.push(
    createBall(
      "b3",
      740,
      350,
      "bot",
      "bot"
    )
  );

  balls.push(
    createBall(
      "b4",
      785,
      300,
      "bot",
      "bot"
    )
  );

  playerTurn = true;

  playing = true;

  aiming = false;

  shotPower = 0;

  aim.style.display =
    "none";

  cueStick.style.display =
    "none";

  power.style.width =
    "0%";

  powerText.textContent =
    "FORÇA: 0%";

  statusEl.classList.remove(
    "win",
    "lose"
  );

  statusEl.textContent =
    "sua vez [JOGADOR]";

  messageEl.textContent =
    "arraste em qualquer lugar da mesa pra mirar e solte para tacar";

  updateScore();

  render();

}

function tablePoint(event){

  var rect =
    table.getBoundingClientRect();

  return {

    x:
      (event.clientX - rect.left)
      / rect.width * W,

    y:
      (event.clientY - rect.top)
      / rect.height * H

  };

}

function getCue(){

  for(
    var i=0;
    i<balls.length;
    i++
  ){

    if(
      balls[i].id === "cue" &&
      balls[i].active
    ){

      return balls[i];

    }

  }

  return null;

}

function render(){

  var old =
    table.querySelectorAll(
      ".ball"
    );

  for(
    var i=0;
    i<old.length;
    i++
  ){

    old[i].remove();

  }

  for(
    var j=0;
    j<balls.length;
    j++
  ){

    var b =
      balls[j];

    if(!b.active)
      continue;

    var el =
      document.createElement("div");

    el.className =
      "ball " +
      (
        b.type === "cue"
          ? "white"
          : b.type === "player"
            ? "player-ball"
            : "bot-ball"
      );

    el.style.left =
      (b.x / W * 100) + "%";

    el.style.top =
      (b.y / H * 100) + "%";

    table.appendChild(el);

  }

  ballsText.textContent =
    "SUAS: " +
    playerBalls +
    " | BOT: " +
    botBalls;

}

function moving(){

  for(
    var i=0;
    i<balls.length;
    i++
  ){

    var b =
      balls[i];

    if(
      !b.active
    ) continue;

    if(
      Math.abs(b.vx) > .08 ||
      Math.abs(b.vy) > .08
    ){

      return true;

    }

  }

  return false;

}

function distance(a,b){

  var dx =
    a.x - b.x;

  var dy =
    a.y - b.y;

  return Math.sqrt(
    dx*dx + dy*dy
  );

}

function pockets(){

  return [

    {x:0,y:0},
    {x:W/2,y:0},
    {x:W,y:0},
    {x:0,y:H},
    {x:W/2,y:H},
    {x:W,y:H}

  ];

}

function checkPocket(b){

  var ps =
    pockets();

  for(
    var i=0;
    i<ps.length;
    i++
  ){

    if(
      distance(
        b,
        ps[i]
      ) < pocketRadius
    ){

      return true;

    }

  }

  return false;

}

function removeBall(b){

  if(
    b.type === "cue"
  ){

    b.active = false;

    return;

  }

  b.active = false;

  if(
    b.type === "player"
  ){

    playerBalls--;

  }

  if(
    b.type === "bot"
  ){

    botBalls--;

  }

}

function respawnCue(){

  var cue =
    getCue();

  if(cue)
    return;

  cue =
    createBall(
      "cue",
      250,
      290,
      "white",
      "cue"
    );

  balls.unshift(cue);

}

function wallCollision(b){

  var margin = 20;

  if(
    b.x < margin
  ){

    b.x = margin;
    b.vx = Math.abs(b.vx) * .92;

  }

  if(
    b.x > W-margin
  ){

    b.x = W-margin;
    b.vx = -Math.abs(b.vx) * .92;

  }

  if(
    b.y < margin
  ){

    b.y = margin;
    b.vy = Math.abs(b.vy) * .92;

  }

  if(
    b.y > H-margin
  ){

    b.y = H-margin;
    b.vy = -Math.abs(b.vy) * .92;

  }

}

function ballCollision(a,b){

  if(
    !a.active ||
    !b.active
  ) return;

  var dx =
    b.x - a.x;

  var dy =
    b.y - a.y;

  var dist =
    Math.sqrt(
      dx*dx + dy*dy
    );

  var minDist =
    ballRadius * 2;

  if(
    dist === 0 ||
    dist >= minDist
  ){

    return;

  }

  var nx =
    dx / dist;

  var ny =
    dy / dist;

  var overlap =
    minDist - dist;

  a.x -=
    nx * overlap / 2;

  a.y -=
    ny * overlap / 2;

  b.x +=
    nx * overlap / 2;

  b.y +=
    ny * overlap / 2;

  var dvx =
    a.vx - b.vx;

  var dvy =
    a.vy - b.vy;

  var relative =
    dvx * nx +
    dvy * ny;

  if(relative < 0)
    return;

  var impulse =
    relative;

  a.vx -=
    impulse * nx;

  a.vy -=
    impulse * ny;

  b.vx +=
    impulse * nx;

  b.vy +=
    impulse * ny;

}

function physics(){

  for(
    var i=0;
    i<balls.length;
    i++
  ){

    var b =
      balls[i];

    if(!b.active)
      continue;

    b.x += b.vx;

    b.y += b.vy;

    b.vx *= friction;

    b.vy *= friction;

    if(
      checkPocket(b)
    ){

      removeBall(b);

      continue;

    }

    wallCollision(b);

  }

  for(
    var a=0;
    a<balls.length;
    a++
  ){

    for(
      var c=a+1;
      c<balls.length;
      c++
    ){

      ballCollision(
        balls[a],
        balls[c]
      );

    }

  }

  render();

}

function animate(){

  physics();

  if(
    moving()
  ){

    animation =
      requestAnimationFrame(
        animate
      );

    return;

  }

  animation = null;

  finishShot();

}

function startPhysics(){

  if(animation)
    cancelAnimationFrame(
      animation
    );

  animation =
    requestAnimationFrame(
      animate
    );

}

function finishShot(){

  respawnCue();

  render();

  if(
    playerBalls <= 0
  ){

    playing = false;

    wins++;

    statusEl.textContent =
      "VOCÊ VENCEU!";

    statusEl.classList.add(
      "win"
    );

    messageEl.textContent =
      "todas as suas bolas foram encaçapadas";

    updateScore();

    return;

  }

  if(
    botBalls <= 0
  ){

    playing = false;

    losses++;

    statusEl.textContent =
      "A MÁQUINA VENCEU!";

    statusEl.classList.add(
      "lose"
    );

    messageEl.textContent =
      "a máquina dominou a mesa";

    updateScore();

    return;

  }

  playerTurn =
    !playerTurn;

  if(playerTurn){

    statusEl.textContent =
      "sua vez [JOGADOR]";

    messageEl.textContent =
      "mire e solte para tacar";

  }else{

    statusEl.textContent =
      "vez da MÁQUINA";

    messageEl.textContent =
      "a IA está calculando a tacada";

    setTimeout(
      botShot,
      600
    );

  }

}

function shoot(
  angle,
  strength
){

  var cue =
    getCue();

  if(
    !cue ||
    !playing ||
    !playerTurn
  ) return;

  var powerValue =
    Math.max(
      2,
      Math.min(
        strength,
        28
      )
    );

  cue.vx =
    Math.cos(angle) *
    powerValue;

  cue.vy =
    Math.sin(angle) *
    powerValue;

  playerTurn = false;

  startPhysics();

}

function botShot(){

  if(
    !playing
  ) return;

  var cue =
    getCue();

  if(!cue){

    respawnCue();

    cue =
      getCue();

  }

  var targets =
    balls.filter(
      function(b){

        return (
          b.active &&
          b.type === "bot"
        );

      }
    );

  if(
    !targets.length
  ){

    finishShot();

    return;

  }

  var target =
    targets[0];

  var bestDistance =
    Infinity;

  for(
    var i=0;
    i<targets.length;
    i++
  ){

    var d =
      distance(
        cue,
        targets[i]
      );

    if(
      d < bestDistance
    ){

      bestDistance = d;

      target =
        targets[i];

    }

  }

  var angle =
    Math.atan2(
      target.y - cue.y,
      target.x - cue.x
    );

  angle +=
    (Math.random() - .5)
    * .22;

  var strength =
    Math.min(
      23,
      Math.max(
        8,
        bestDistance / 35
      )
    );

  setTimeout(
    function(){

      shootBot(
        angle,
        strength
      );

    },
    350
  );

}

function shootBot(
  angle,
  strength
){

  if(!playing)
    return;

  var cue =
    getCue();

  if(!cue)
    return;

  cue.vx =
    Math.cos(angle) *
    strength;

  cue.vy =
    Math.sin(angle) *
    strength;

  startPhysics();

}

function updateAim(){

  if(
    !aiming ||
    !aimStart ||
    !aimCurrent
  ){

    aim.style.display =
      "none";

    cueStick.style.display =
      "none";

    return;

  }

  var dx =
    aimCurrent.x -
    aimStart.x;

  var dy =
    aimCurrent.y -
    aimStart.y;

  var angle =
    Math.atan2(
      dy,
      dx
    );

  var len =
    Math.min(
      280,
      Math.max(
        30,
        Math.sqrt(
          dx*dx + dy*dy
        )
      )
    );

  var x =
    aimStart.x;

  var y =
    aimStart.y;

  aim.style.display =
    "block";

  aim.style.left =
    (x / W * 100) + "%";

  aim.style.top =
    (y / H * 100) + "%";

  aim.style.width =
    (len / W * 100) + "%";

  aim.style.transform =
    "rotate(" +
    angle +
    "rad)";

  var percent =
    Math.min(
      100,
      Math.round(
        len / 280 * 100
      )
    );

  shotPower =
    percent / 100 * 28;

  power.style.width =
    percent + "%";

  powerText.textContent =
    "FORÇA: " +
    percent +
    "%";

  var stickAngle =
    angle + Math.PI;

  var pullBack =
    ballRadius +
    6 +
    (percent / 100) * 55;

  var stickLen = 240;

  var tipX =
    aimStart.x +
    Math.cos(stickAngle) * pullBack;

  var tipY =
    aimStart.y +
    Math.sin(stickAngle) * pullBack;

  cueStick.style.display =
    "block";

  cueStick.style.left =
    (tipX / W * 100) + "%";

  cueStick.style.top =
    (tipY / H * 100) + "%";

  cueStick.style.width =
    (stickLen / W * 100) + "%";

  cueStick.style.transform =
    "translateY(-50%) rotate(" +
    stickAngle +
    "rad)";

}

function pointerDown(event){

  event.preventDefault();
  event.stopPropagation();

  if(
    !playing ||
    !playerTurn ||
    moving()
  ) return;

  var cue =
    getCue();

  if(!cue)
    return;

  try{

    table.setPointerCapture(
      event.pointerId
    );

    activePointerId =
      event.pointerId;

  }catch(e){}

  aiming = true;

  aimStart = {

    x:cue.x,
    y:cue.y

  };

  aimCurrent =
    tablePoint(event);

  updateAim();

}

function pointerMove(event){

  if(!aiming)
    return;

  if(
    activePointerId !== null &&
    event.pointerId !== activePointerId
  ) return;

  event.preventDefault();

  aimCurrent =
    tablePoint(event);

  updateAim();

}

function pointerUp(event){

  if(!aiming)
    return;

  if(
    activePointerId !== null &&
    event.pointerId !== activePointerId
  ) return;

  try{

    table.releasePointerCapture(
      event.pointerId
    );

  }catch(e){}

  activePointerId = null;

  aimCurrent =
    tablePoint(event);

  var dx =
    aimCurrent.x -
    aimStart.x;

  var dy =
    aimCurrent.y -
    aimStart.y;

  var angle =
    Math.atan2(
      dy,
      dx
    );

  var len =
    Math.sqrt(
      dx*dx + dy*dy
    );

  aiming = false;

  aim.style.display =
    "none";

  cueStick.style.display =
    "none";

  power.style.width =
    "0%";

  powerText.textContent =
    "FORÇA: 0%";

  if(
    len < 15
  ){

    return;

  }

  shoot(
    angle,
    Math.min(
      28,
      Math.max(
        4,
        len / 10
      )
    )
  );

}

table.addEventListener(
  "pointerdown",
  pointerDown
);

table.addEventListener(
  "pointermove",
  pointerMove
);

table.addEventListener(
  "pointerup",
  pointerUp
);

table.addEventListener(
  "pointercancel",
  function(event){

    try{

      table.releasePointerCapture(
        event.pointerId
      );

    }catch(e){}

    activePointerId = null;

    aiming = false;

    aim.style.display =
      "none";

    cueStick.style.display =
      "none";

    power.style.width =
      "0%";

  }
);

table.addEventListener(
  "touchstart",
  function(event){ event.preventDefault(); },
  { passive:false }
);

table.addEventListener(
  "touchmove",
  function(event){ event.preventDefault(); },
  { passive:false }
);

table.addEventListener(
  "touchend",
  function(event){ event.preventDefault(); },
  { passive:false }
);

table.addEventListener(
  "contextmenu",
  function(event){ event.preventDefault(); }
);

restartBtn.addEventListener(
  "click",
  function(){

    if(animation){

      cancelAnimationFrame(
        animation
      );

      animation = null;

    }

    setup();

  }
);

newgameBtn.addEventListener(
  "click",
  function(){

    wins = 0;

    draws = 0;

    losses = 0;

    updateScore();

    setup();

  }
);

updateScore();

setup();

})();
</script>`;

function executeGameScripts(container){
  const scripts = [...container.querySelectorAll("script")];

  for(const oldScript of scripts){
    const script = document.createElement("script");

    for(const attr of oldScript.attributes){
      script.setAttribute(attr.name, attr.value);
    }

    script.textContent = oldScript.textContent;

    oldScript.remove();

    container.appendChild(script);
  }
}

registerGame({
  id: "bilhar",
  name: "Bilhar",
  category: "Esportes",
  icon: "🎱",

  init({ container }){
    container.innerHTML = BILHAR_HTML;
    executeGameScripts(container);
  }
});