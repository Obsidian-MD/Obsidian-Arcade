import { registerGame } from "../arcade.js";

const GBA_HTML = String.raw`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>GBA Obsidian</title>
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{
  margin:0;
  padding:0;
  width:100%;
  min-height:100%;
  background:#111;
  font-family:Arial,sans-serif;
  overflow:hidden;
  touch-action:none;
}
body{
  display:flex;
  justify-content:center;
  align-items:flex-start;
  padding:8px;
}
.gba{
  width:100%;
  max-width:520px;
  background:linear-gradient(145deg,#737373,#393939);
  border-radius:24px 24px 32px 32px;
  padding:14px 14px 18px;
  box-shadow:0 8px 25px #000;
}
.brand{
  text-align:center;
  color:#ddd;
  font-size:12px;
  font-weight:bold;
  letter-spacing:3px;
  margin-bottom:8px;
}
.screenBox{
  background:#202020;
  border-radius:12px;
  padding:12px;
  box-shadow:inset 0 0 0 2px #111,0 4px 8px #111;
}
.screen{
  display:block;
  width:100%;
  max-width:420px;
  height:auto;
  margin:auto;
  background:#9bbc0f;
  border:4px solid #111;
  border-radius:5px;
  image-rendering:pixelated;
}
.controls{
  position:relative;
  height:155px;
  margin-top:14px;
}
.dpad{
  position:absolute;
  left:8px;
  top:28px;
  width:112px;
  height:112px;
}
.key{
  position:absolute;
  background:#222;
  color:#eee;
  display:flex;
  align-items:center;
  justify-content:center;
  user-select:none;
  box-shadow:0 4px 0 #111;
  font-weight:bold;
}
.up,.down{width:36px;height:44px;left:38px}
.left,.right{width:44px;height:36px;top:38px}
.up{top:0;border-radius:8px 8px 3px 3px}
.down{top:68px;border-radius:3px 3px 8px 8px}
.left{left:0;border-radius:8px 3px 3px 8px}
.right{left:68px;border-radius:3px 8px 8px 3px}
.center{
  position:absolute;
  left:38px;
  top:38px;
  width:36px;
  height:36px;
  background:#222;
}
.action{
  position:absolute;
  right:8px;
  top:22px;
  width:112px;
  height:72px;
}
.ab{
  position:absolute;
  width:50px;
  height:50px;
  border-radius:50%;
  background:#9b174d;
  color:white;
  display:flex;
  justify-content:center;
  align-items:center;
  font-weight:bold;
  box-shadow:0 5px 0 #50102b;
  user-select:none;
}
.a{right:0;top:0}
.b{left:0;top:22px}
.system{
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  bottom:5px;
  display:flex;
  gap:16px;
}
.sys{
  width:68px;
  height:25px;
  border:0;
  border-radius:15px;
  background:#222;
  color:#aaa;
  font-size:9px;
  font-weight:bold;
  transform:rotate(-18deg);
  box-shadow:0 3px 0 #111;
}
.status{
  text-align:center;
  color:#aaa;
  font-size:10px;
  margin-top:4px;
}
</style>
</head>
<body>

<div class="gba">
  <div class="brand">OBSIDIAN GBA</div>

  <div class="screenBox">
    <canvas id="screen" class="screen" width="320" height="240"></canvas>
  </div>

  <div class="controls">
    <div class="dpad">
      <div class="key up" data-key="up">▲</div>
      <div class="key down" data-key="down">▼</div>
      <div class="key left" data-key="left">◀</div>
      <div class="key right" data-key="right">▶</div>
      <div class="center"></div>
    </div>

    <div class="action">
      <div class="ab a" data-key="a">A</div>
      <div class="ab b" data-key="b">B</div>
    </div>

    <div class="system">
      <button class="sys" data-key="select">SELECT</button>
      <button class="sys" data-key="start">START</button>
    </div>
  </div>

  <div class="status" id="status">PRESSIONE START</div>
</div>

<script>
try{
  if(window.AndroidBridge&&typeof window.AndroidBridge.updateSize==="function"){
    window.AndroidBridge.updateSize(650);
  }
}catch(e){}

const canvas=document.getElementById("screen");
const ctx=canvas.getContext("2d");
ctx.imageSmoothingEnabled=false;

const W=320;
const H=240;

let started=false;
let paused=false;
let score=0;
let best=Number(localStorage.getItem("gba_obsidian_best")||0);

const player={
  x:150,
  y:110,
  size:12,
  speed:3
};

const coin={
  x:80,
  y:70,
  size:8
};

const keys={
  up:false,
  down:false,
  left:false,
  right:false
};

function rnd(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

function newCoin(){
  coin.x=rnd(15,W-20);
  coin.y=rnd(15,H-20);
}

function clear(){
  ctx.fillStyle="#9bbc0f";
  ctx.fillRect(0,0,W,H);
}

function grid(){
  ctx.strokeStyle="rgba(15,56,15,.12)";
  ctx.lineWidth=1;

  for(let x=0;x<W;x+=16){
    ctx.beginPath();
    ctx.moveTo(x,0);
    ctx.lineTo(x,H);
    ctx.stroke();
  }

  for(let y=0;y<H;y+=16){
    ctx.beginPath();
    ctx.moveTo(0,y);
    ctx.lineTo(W,y);
    ctx.stroke();
  }
}

function text(t,x,y,size=12){
  ctx.fillStyle="#0f380f";
  ctx.font="bold "+size+"px monospace";
  ctx.textAlign="center";
  ctx.fillText(t,x,y);
}

function drawPlayer(){
  ctx.fillStyle="#0f380f";
  ctx.fillRect(player.x,player.y,player.size,player.size);
  ctx.fillStyle="#9bbc0f";
  ctx.fillRect(player.x+3,player.y+3,2,2);
  ctx.fillRect(player.x+8,player.y+3,2,2);
}

function drawCoin(){
  ctx.fillStyle="#0f380f";
  ctx.fillRect(coin.x,coin.y,coin.size,coin.size);
  ctx.fillStyle="#9bbc0f";
  ctx.fillRect(coin.x+2,coin.y+2,4,4);
}

function draw(){
  clear();
  grid();

  if(!started){
    text("OBSIDIAN",160,82,24);
    text("GBA TEST",160,112,18);
    text("START PARA JOGAR",160,145,11);
    text("BEST: "+best,160,175,10);
    return;
  }

  drawCoin();
  drawPlayer();

  ctx.textAlign="left";
  ctx.fillStyle="#0f380f";
  ctx.font="bold 10px monospace";
  ctx.fillText("SCORE "+score,8,14);
  ctx.fillText("BEST "+best,250,14);

  if(paused){
    ctx.fillStyle="rgba(155,188,15,.88)";
    ctx.fillRect(55,85,210,70);
    text("PAUSADO",160,115,20);
    text("START CONTINUA",160,138,10);
  }
}

function update(){
  if(!started||paused)return;

  if(keys.up)player.y-=player.speed;
  if(keys.down)player.y+=player.speed;
  if(keys.left)player.x-=player.speed;
  if(keys.right)player.x+=player.speed;

  if(player.x<2)player.x=2;
  if(player.y<18)player.y=18;
  if(player.x>W-player.size-2)player.x=W-player.size-2;
  if(player.y>H-player.size-2)player.y=H-player.size-2;

  const hit=
    player.x<coin.x+coin.size &&
    player.x+player.size>coin.x &&
    player.y<coin.y+coin.size &&
    player.y+player.size>coin.y;

  if(hit){
    score++;
    if(score>best){
      best=score;
      localStorage.setItem("gba_obsidian_best",String(best));
    }
    newCoin();
  }
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

function startGame(){
  if(!started){
    started=true;
    paused=false;
    score=0;
    player.x=150;
    player.y=110;
    newCoin();
    document.getElementById("status").textContent="JOGANDO";
  }else{
    paused=!paused;
    document.getElementById("status").textContent=paused?"PAUSADO":"JOGANDO";
  }
}

function press(k){
  if(k==="up")keys.up=true;
  if(k==="down")keys.down=true;
  if(k==="left")keys.left=true;
  if(k==="right")keys.right=true;

  if(k==="start")startGame();

  if(k==="select"){
    started=false;
    paused=false;
    score=0;
    document.getElementById("status").textContent="PRESSIONE START";
  }

  if(k==="a"&&started&&!paused){
    score++;
    if(score>best){
      best=score;
      localStorage.setItem("gba_obsidian_best",String(best));
    }
    newCoin();
  }

  if(k==="b"&&started&&!paused){
    player.x=150;
    player.y=110;
  }
}

function release(k){
  if(k==="up")keys.up=false;
  if(k==="down")keys.down=false;
  if(k==="left")keys.left=false;
  if(k==="right")keys.right=false;
}

document.querySelectorAll("[data-key]").forEach(el=>{
  const k=el.dataset.key;

  el.addEventListener("pointerdown",e=>{
    e.preventDefault();
    press(k);
  });

  el.addEventListener("pointerup",e=>{
    e.preventDefault();
    release(k);
  });

  el.addEventListener("pointercancel",()=>{
    release(k);
  });

  el.addEventListener("pointerleave",()=>{
    release(k);
  });
});

document.addEventListener("keydown",e=>{
  if(e.key==="ArrowUp")press("up");
  if(e.key==="ArrowDown")press("down");
  if(e.key==="ArrowLeft")press("left");
  if(e.key==="ArrowRight")press("right");
  if(e.key.toLowerCase()==="a")press("a");
  if(e.key.toLowerCase()==="b")press("b");
  if(e.key==="Enter")press("start");
  if(e.key==="Shift")press("select");
});

document.addEventListener("keyup",e=>{
  if(e.key==="ArrowUp")release("up");
  if(e.key==="ArrowDown")release("down");
  if(e.key==="ArrowLeft")release("left");
  if(e.key==="ArrowRight")release("right");
});

draw();
loop();
</script>

</body>
</html>`;

function executeGameScripts(container){
  const scripts = [...container.querySelectorAll("script")];

  for(const oldScript of scripts){
    const script = document.createElement("script");

    for(const attr of oldScript.attributes){
      script.setAttribute(attr.name, oldScript.getAttribute(attr.name));
    }

    script.textContent = oldScript.textContent;

    oldScript.remove();
    container.appendChild(script);
  }
}

registerGame({
  id:"gba",
  name:"GBA",
  category:"Arcade",
  icon:"🎮",

  init({container}){
    container.innerHTML = GBA_HTML;
    executeGameScripts(container);
  }
});