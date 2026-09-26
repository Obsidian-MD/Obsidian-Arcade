import { registerGame } from "../arcade.js";

const AGARIO_HTML = String.raw`

<style>  
#agario{  
  position:relative;  
  width:100%;  
  height:100%;  
  min-height:100%;  
  overflow:hidden;  
  background:  
    radial-gradient(circle at 50% 45%,rgba(42,148,155,.38),transparent 48%),  
    radial-gradient(circle at 20% 80%,rgba(0,120,150,.22),transparent 42%),  
    linear-gradient(135deg,#061b20,#0a3037 48%,#06181d);  
  user-select:none;  
  -webkit-user-select:none;  
  touch-action:none;  
  font-family:Arial,sans-serif;  
}  
  
#game{  
  position:absolute;  
  inset:0;  
  width:100%;  
  height:100%;  
  display:block;  
  touch-action:none;  
}  
  
#agario [hidden]{display:none!important}  
  
.hud{  
  position:absolute;  
  z-index:30;  
  pointer-events:none;  
  color:#fff;  
}  
  
#sc{  
  top:clamp(8px,2vmin,14px);  
  left:clamp(8px,2vmin,14px);  
  padding:clamp(5px,1.4vmin,9px) clamp(9px,2.6vmin,14px);  
  border-radius:clamp(10px,2.4vmin,16px);  
  background:rgba(2,12,16,.72);  
  border:1px solid rgba(255,255,255,.16);  
  box-shadow:0 6px 18px rgba(0,0,0,.35);  
  font-size:clamp(12px,3vmin,17px);  
  font-weight:900;  
  backdrop-filter:blur(8px);  
}  
  
#lbw{  
  top:clamp(8px,2vmin,14px);  
  right:clamp(8px,2vmin,14px);  
  width:clamp(96px,22vmin,150px);  
  padding:clamp(6px,1.6vmin,10px) clamp(8px,2vmin,12px);  
  border-radius:clamp(10px,2.4vmin,16px);  
  background:rgba(2,12,16,.72);  
  border:1px solid rgba(255,255,255,.15);  
  box-shadow:0 6px 18px rgba(0,0,0,.35);  
  backdrop-filter:blur(8px);  
}  
  
#lbw h3{  
  margin:0 0 4px;  
  color:#9fb3b8;  
  font-size:clamp(8px,1.7vmin,10px);  
  letter-spacing:1px;  
}  
  
#lb{  
  margin:0;  
  padding-left:clamp(13px,3vmin,18px);  
  font-size:clamp(9px,2.1vmin,12px);  
  line-height:1.45;  
}  
  
#lb li{  
  white-space:nowrap;  
  overflow:hidden;  
  text-overflow:ellipsis;  
}  
  
#lb li:first-child{  
  color:#61eaff;  
  font-weight:900;  
}  
  
#hudLeft{  
  position:absolute;  
  z-index:40;  
  left:clamp(8px,2vmin,14px);  
  bottom:clamp(8px,2vmin,14px);  
  display:flex;  
  flex-direction:column;  
  align-items:flex-start;  
  gap:clamp(6px,1.6vmin,10px);  
}  
  
#minimap{  
  display:none!important;  
}  
  
#mini{  
  width:100%;  
  height:100%;  
  display:block;  
}  
  
#speedBtn{  
  pointer-events:auto;  
  align-self:flex-start;  
  flex-shrink:0;  
  width:clamp(42px,9.5vmin,52px);  
  height:clamp(42px,9.5vmin,52px);  
  border-radius:50%;  
  border:1px solid rgba(255,255,255,.2);  
  background:radial-gradient(circle at 35% 25%,rgba(255,255,255,.20),rgba(255,213,70,.18) 45%,rgba(0,0,0,.34));  
  color:#fff7b0;  
  font-size:clamp(18px,4vmin,24px);  
  line-height:1;  
  font-weight:900;  
  box-shadow:0 6px 16px rgba(0,0,0,.5),inset 0 1px rgba(255,255,255,.15);  
  touch-action:none;  
}  
  
#speedBtn.active{  
  background:radial-gradient(circle at 35% 25%,#fff3a0 0%,#ffd33d 38%,#d68a00 75%,#5b3700 100%);  
  color:#fff;  
  box-shadow:0 0 18px rgba(255,208,50,.55),0 6px 16px rgba(0,0,0,.5);  
  transform:scale(.94);  
}  
  
#music{  
  pointer-events:auto;  
  min-width:clamp(58px,15vmin,92px);  
  height:clamp(32px,7.5vmin,40px);  
  border:1px solid rgba(255,255,255,.16);  
  border-radius:clamp(10px,2.4vmin,14px);  
  background:rgba(2,12,16,.75);  
  color:#fff;  
  font-size:clamp(11px,2.6vmin,14px);  
  font-weight:900;  
  box-shadow:0 6px 16px rgba(0,0,0,.4);  
  touch-action:none;  
}  
  
#hudRight{  
  position:absolute;  
  z-index:40;  
  right:clamp(8px,2vmin,14px);  
  bottom:clamp(8px,2vmin,14px);  
  display:flex;  
  flex-direction:column;  
  align-items:flex-end;  
  gap:clamp(6px,1.6vmin,10px);  
}  
  
#hudRight .row{  
  display:flex;  
  align-items:flex-end;  
  gap:clamp(6px,1.6vmin,10px);  
}  
  
#zoomCtrl{  
  display:flex;  
  gap:clamp(5px,1.3vmin,8px);  
  pointer-events:auto;  
}  
  
#zoomCtrl button{  
  width:clamp(30px,7.5vmin,40px);  
  height:clamp(30px,7.5vmin,40px);  
  border-radius:clamp(8px,2vmin,12px);  
  border:1px solid rgba(255,255,255,.17);  
  background:rgba(2,12,16,.62);  
  color:#fff;  
  font-size:clamp(14px,3.6vmin,20px);  
  font-weight:900;  
  box-shadow:0 6px 16px rgba(0,0,0,.35);  
  touch-action:none;  
}  
  
#joystick{  
  position:relative;  
  pointer-events:auto;  
  width:clamp(78px,18vmin,100px);  
  height:clamp(78px,18vmin,100px);  
  border-radius:50%;  
  border:1px solid rgba(255,255,255,.18);  
  background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.16),rgba(255,255,255,.06) 45%,rgba(0,0,0,.38));  
  box-shadow:0 8px 20px rgba(0,0,0,.5),inset 0 1px rgba(255,255,255,.15);  
  touch-action:none;  
}  
  
#joystickKnob{  
  position:absolute;  
  left:50%;  
  top:50%;  
  width:46%;  
  height:46%;  
  transform:translate(-50%,-50%);  
  border-radius:50%;  
  background:radial-gradient(circle at 35% 25%,rgba(255,255,255,.38),rgba(60,210,225,.38) 42%,rgba(0,0,0,.48) 100%);  
  border:1px solid rgba(255,255,255,.30);  
  box-shadow:0 6px 14px rgba(0,0,0,.55),inset 0 2px 3px rgba(255,255,255,.25),inset 0 -4px 8px rgba(0,0,0,.25);  
  pointer-events:none;  
}  
  
#ctrl{  
  display:flex;  
  gap:clamp(5px,1.3vmin,8px);  
  pointer-events:auto;  
}  
  
#ctrl button{  
  width:clamp(44px,11.5vmin,56px);  
  height:clamp(44px,11.5vmin,56px);  
  border-radius:50%;  
  border:1px solid rgba(255,255,255,.17);  
  background:rgba(2,12,16,.68);  
  color:#fff;  
  font-size:clamp(8px,2.1vmin,11px);  
  font-weight:900;  
  box-shadow:0 6px 16px rgba(0,0,0,.4);  
  touch-action:none;  
}  
  
#menu{  
  position:absolute;  
  z-index:100;  
  inset:0;  
  display:flex;  
  align-items:center;  
  justify-content:center;  
  padding:16px;  
  background:rgba(0,0,0,.48);  
  backdrop-filter:blur(8px);  
}  
  
#menuBox{  
  width:min(380px,92%);  
  max-height:92%;  
  overflow:auto;  
  padding:clamp(18px,4vmin,28px);  
  border-radius:24px;  
  text-align:center;  
  background:rgba(3,16,21,.92);  
  border:1px solid rgba(255,255,255,.15);  
  box-shadow:0 20px 60px rgba(0,0,0,.55);  
  color:#fff;  
}  
  
#menuBox h1{  
  margin:0 0 8px;  
  font-size:clamp(24px,6vmin,32px);  
}  
  
#menuBox p{  
  color:#aebfc3;  
  font-size:clamp(12px,2.8vmin,14px);  
  line-height:1.5;  
  margin:0 0 14px;  
}  
  
#name{  
  width:100%;  
  box-sizing:border-box;  
  padding:clamp(10px,2.6vmin,13px);  
  border-radius:12px;  
  border:1px solid rgba(255,255,255,.18);  
  background:rgba(0,0,0,.32);  
  color:#fff;  
  font-size:16px;  
  text-align:center;  
  outline:none;  
  user-select:text;  
  -webkit-user-select:text;  
}  
  
#name:focus{  
  border-color:#61eaff;  
  box-shadow:0 0 14px rgba(97,234,255,.18);  
}  
  
#play{  
  width:100%;  
  height:clamp(48px,11vmin,56px);  
  margin-top:14px;  
  border:0;  
  border-radius:16px;  
  background:linear-gradient(135deg,#16c784,#00a8ff);  
  color:#fff;  
  font-size:clamp(16px,3.8vmin,20px);  
  font-weight:900;  
  box-shadow:0 10px 26px rgba(0,180,210,.25);  
  touch-action:none;  
}  
  
#info{  
  margin:10px 0 0;  
  color:#9fb3b8;  
  font-size:clamp(11px,2.6vmin,13px);  
}  
</style>

<div id="agario">
<canvas id="game"></canvas>

<div class="hud" id="sc">Massa: 0</div>

<div class="hud" id="lbw">
<h3>RANKING</h3>
<ol id="lb"></ol>
</div>

<div id="hudLeft">

<button id="speedBtn" type="button" hidden aria-label="Velocidade">⚡</button>

<button id="music" type="button">🎵 SOM</button>

</div>

<div id="hudRight">

<div id="zoomCtrl">
<button id="zoomOut" type="button">−</button>
<button id="zoomIn" type="button">+</button>
</div>

<div class="row">

<div id="joystick" hidden aria-label="Direcional">
<div id="joystickKnob"></div>
</div>

</div>

<div id="ctrl" hidden>
<button id="bSplit" type="button">DIVIDIR</button>
<button id="bEject" type="button">SOLTAR</button>
</div>

</div>

<div id="menu">

<div id="menuBox">

<h1>🟢 Agario 3D</h1>

<p>
Coma comidas, cresça, derrote os bots e domine o mapa.
</p>

<input
id="name"
maxlength="14"
placeholder="Seu apelido"
autocomplete="off"
>

<button id="play" type="button">
JOGAR
</button>

<p id="info"></p>

</div>

</div>
</div>

<script>
(function(){
"use strict";

var root=document.getElementById("agario");
var canvas=document.getElementById("game");
var ctx=canvas.getContext("2d");

var sc=document.getElementById("sc");
var lb=document.getElementById("lb");

var menu=document.getElementById("menu");
var nameInput=document.getElementById("name");
var playBtn=document.getElementById("play");
var infoEl=document.getElementById("info");

var musicBtn=document.getElementById("music");

var zoomOut=document.getElementById("zoomOut");
var zoomIn=document.getElementById("zoomIn");

var ctrl=document.getElementById("ctrl");
var bSplit=document.getElementById("bSplit");
var bEject=document.getElementById("bEject");

var joystickEl=document.getElementById("joystick");
var joystickKnob=document.getElementById("joystickKnob");
var speedBtn=document.getElementById("speedBtn");

var WORLD_W=3200;
var WORLD_H=3200;

var FOOD_COUNT=60;
var FOOD_NEAR_PLAYER=80;
var FOOD_RADIUS=1500;
var FOOD_MINIMUM=40;
var BOT_COUNT=25;

var vw=0;
var vh=0;
var dpr=1;

var camX=WORLD_W/2;
var camY=WORLD_H/2;
var zoom=1;

var manualZoom=0;

var MIN_MANUAL_ZOOM=.22;
var MAX_MANUAL_ZOOM=4;

var food=[];
var bots=[];
var player=null;
var playerName="Sem nome";

var mouse={
x:0,
y:0
};

var gameStarted=false;

var lastTime=performance.now();

var best=Number(localStorage.getItem("agario_best")||0);

var peak=0;

var audioCtx=null;
var musicTimer=null;
var musicOn=true;

var joystickActive=false;
var joystickPointerId=null;
var joystickX=0;
var joystickY=0;

var speedBoost=false;

/* Reagrupamento automático após dividir */
var mergeTimer=0;
var MERGE_DELAY=3.5;

var SPEED_MULT=1.85;
var SPEED_HIDE_MASS=300;

var touchA=null;
var touchB=null;

var names=[
"Gui","Zeca","Bolt","Pipa","Nuvem","Tico","Kiko","Luna","Biel","Japa",
"Dudu","Malu","Ninja","Ghost","Trovão","Rex","Mestre","Guga","Panda","Pixel",
"Furia","Flash","Dark","Coringa","Thor","Magma","Turbo","King","Zero","Sonic",
"Venom","Titan","Lobo","Fox","Draco","Neo","Max","Boris","Joker","Spike",
"Kratos","Mika","Bala","Caju","Zion"
];

var foodTypes=[
"candy",
"icecream",
"meat",
"chicken",
"burger",
"pizza",
"donut",
"apple",
"watermelon",
"chocolate",
"lollipop",
"cupcake",
"cheese",
"grape",
"orange"
];

function rnd(a,b){
return a+Math.random()*(b-a);
}

function randInt(a,b){
return Math.floor(rnd(a,b+1));
}

function clamp(v,a,b){
return Math.max(a,Math.min(b,v));
}

function mass(owner){

if(!owner)return 0;

var total=0;

for(var i=0;i<owner.cells.length;i++){
total+=owner.cells[i].m;
}

return total;

}

function biggest(owner){

if(!owner||!owner.cells.length)return null;

var c=owner.cells[0];

for(var i=1;i<owner.cells.length;i++){

if(owner.cells[i].m>c.m){
c=owner.cells[i];
}

}

return c;

}

function radius(c){

if(!c || !c.m)return 0;

return Math.sqrt(c.m)*3.8;

}

function audio(){

if(!audioCtx){

try{

audioCtx=new(
window.AudioContext||
window.webkitAudioContext
)();

}catch(e){}

}

if(
audioCtx&&
audioCtx.state==="suspended"
){

audioCtx.resume().catch(function(){});

}

return audioCtx;

}

function tone(freq,duration,type,gain){

var ac=audio();

if(!ac)return;

var o=ac.createOscillator();
var g=ac.createGain();

o.type=type||"sine";
o.frequency.value=freq;

g.gain.setValueAtTime(
gain||.03,
ac.currentTime
);

g.gain.exponentialRampToValueAtTime(
.001,
ac.currentTime+duration
);

o.connect(g);
g.connect(ac.destination);

o.start();
o.stop(ac.currentTime+duration);

}

function eatSound(){

tone(560,.055,"sine",.025);

setTimeout(function(){
tone(760,.045,"sine",.018);
},35);

}

function splitSound(){

tone(240,.08,"square",.025);
tone(420,.12,"sine",.018);

}

function ejectSound(){

tone(170,.05,"triangle",.018);

}

function musicLoop(){

if(!musicOn)return;

tone(110,.18,"sine",.008);

setTimeout(function(){

if(musicOn){
tone(165,.18,"sine",.006);
}

},260);

musicTimer=setTimeout(
musicLoop,
900
);

}

function stopMusic(){

if(musicTimer){
clearTimeout(musicTimer);
musicTimer=null;
}

}

function startMusic(){

stopMusic();
musicLoop();

}

function musicLabel(){

musicBtn.textContent=
musicOn
?"🎵 SOM"
:"🔇 SOM";

}

function resize(){

var rect=root.getBoundingClientRect();

vw=Math.max(1,rect.width);
vh=Math.max(1,rect.height);

dpr=Math.min(
2,
window.devicePixelRatio||1
);

canvas.width=Math.floor(vw*dpr);
canvas.height=Math.floor(vh*dpr);

canvas.style.width=vw+"px";
canvas.style.height=vh+"px";

ctx.setTransform(
dpr,
0,
0,
dpr,
0,
0
);

}

if(window.ResizeObserver){

new ResizeObserver(resize).observe(root);

}

window.addEventListener(
"orientationchange",
function(){
setTimeout(resize,100);
}
);

resize();

function randomFoodType(){

return foodTypes[
randInt(0,foodTypes.length-1)
];

}

function createFood(x,y){

if(
typeof x!=="number"||
typeof y!=="number"
){

x=rnd(-FOOD_RADIUS,FOOD_RADIUS);
y=rnd(-FOOD_RADIUS,FOOD_RADIUS);

if(player){

var pc=biggest(player);

if(pc){

x=pc.x+rnd(-FOOD_RADIUS,FOOD_RADIUS);
y=pc.y+rnd(-FOOD_RADIUS,FOOD_RADIUS);

}

}else{

x=WORLD_W/2+x;
y=WORLD_H/2+y;

}

}

return{

x:x,
y:y,

r:rnd(10,30),

m:rnd(20,28),

type:randomFoodType(),

rot:rnd(0,Math.PI*2),

pulse:rnd(0,Math.PI*2)

};

}

function fillInitialFood(){

food.length=0;

var centerX=player?
biggest(player)?.x:
WORLD_W/2;

var centerY=player?
biggest(player)?.y:
WORLD_H/2;

for(
var i=0;
i<FOOD_NEAR_PLAYER;
i++
){

var angle=Math.random()*Math.PI*2;
var dist=Math.sqrt(Math.random())*FOOD_RADIUS;

var x=centerX+
Math.cos(angle)*dist;

var y=centerY+
Math.sin(angle)*dist;

food.push(
createFood(x,y)
);

}

}

function maintainInfiniteFood(){

if(!gameStarted||!player){

while(food.length<FOOD_COUNT){

food.push(
createFood()
);

}

return;

}

var pc=biggest(player);

if(!pc)return;

while(food.length<FOOD_MINIMUM){

var angle=Math.random()*Math.PI*2;
var dist=Math.sqrt(Math.random())*FOOD_RADIUS;

food.push(
createFood(
pc.x+Math.cos(angle)*dist,
pc.y+Math.sin(angle)*dist
)
);

}

while(food.length<FOOD_NEAR_PLAYER){

var angle=Math.random()*Math.PI*2;
var dist=Math.sqrt(Math.random())*FOOD_RADIUS;

food.push(
createFood(
pc.x+Math.cos(angle)*dist,
pc.y+Math.sin(angle)*dist
)
);

}

}

function infiniteFoodPulse(dt){}

for(
var fi=0;
fi<FOOD_NEAR_PLAYER;
fi++
){

food.push(createFood());

}

function createBot(i){

var bot={

name:names[i%names.length],

color:
"hsl("+
randInt(0,360)+
" 78% 48%)",

cells:[],

tx:rnd(0,WORLD_W),
ty:rnd(0,WORLD_H),

aiTimer:rnd(.2,2)

};

var m=rnd(35,170);

bot.cells.push({

x:rnd(100,WORLD_W-100),
y:rnd(100,WORLD_H-100),
m:m,
owner:bot,
vx:0,
vy:0

});

return bot;

}

for(
var bi=0;
bi<BOT_COUNT;
bi++
){

bots.push(createBot(bi));

}

function createPlayer(name){

var owner={

name:name||"Sem nome",
color:"#ef6428",
cells:[],
tx:WORLD_W/2,
ty:WORLD_H/2

};

owner.cells.push({

x:WORLD_W/2,
y:WORLD_H/2,

m:30,

owner:owner,
vx:0,
vy:0

});

return owner;

}

player=createPlayer(playerName);

function think(bot,dt){

bot.aiTimer-=dt;

if(bot.aiTimer>0)return;

bot.aiTimer=rnd(.25,1);

var c=biggest(bot);

if(!c)return;

var nearestFood=null;
var nearestFoodD=Infinity;

for(
var i=0;
i<food.length;
i++
){

var f=food[i];

var d=Math.hypot(
c.x-f.x,
c.y-f.y
);

if(d<nearestFoodD){

nearestFoodD=d;
nearestFood=f;

}

}

var target=nearestFood;

if(player){

var pc=biggest(player);

if(pc){

var pd=Math.hypot(
c.x-pc.x,
c.y-pc.y
);

if(
mass(bot)>mass(player)*1.15&&
pd<850
){

target=pc;

}else if(
mass(player)>mass(bot)*1.35&&
pd<700
){

bot.tx=
c.x+(c.x-pc.x);

bot.ty=
c.y+(c.y-pc.y);

return;

}

}

}

if(target){

bot.tx=target.x;
bot.ty=target.y;

}

}

function joystickCenter(){

var rect=
joystickEl.getBoundingClientRect();

return{

x:rect.left+rect.width/2,
y:rect.top+rect.height/2

};

}

function setJoystick(
clientX,
clientY
){

var c=joystickCenter();

var dx=clientX-c.x;
var dy=clientY-c.y;

var d=Math.hypot(dx,dy)||1;

var max=
Math.min(
joystickEl.clientWidth,
joystickEl.clientHeight
)*.34;

if(d>max){

dx=dx/d*max;
dy=dy/d*max;

}

joystickX=dx/max;
joystickY=dy/max;

joystickKnob.style.transform=
"translate(-50%,-50%) translate("+
dx+
"px,"+
dy+
"px)";

}

function resetJoystick(){

joystickActive=false;
joystickPointerId=null;

joystickX=0;
joystickY=0;

joystickKnob.style.transform=
"translate(-50%,-50%)";

}

joystickEl.addEventListener(
"pointerdown",
function(e){

e.preventDefault();
e.stopPropagation();

joystickActive=true;
joystickPointerId=e.pointerId;

try{
joystickEl.setPointerCapture(
e.pointerId
);
}catch(_){}

setJoystick(
e.clientX,
e.clientY
);

},
{passive:false}
);

joystickEl.addEventListener(
"pointermove",
function(e){

e.preventDefault();
e.stopPropagation();

if(
joystickActive&&
joystickPointerId===e.pointerId
){

setJoystick(
e.clientX,
e.clientY
);

}

},
{passive:false}
);

joystickEl.addEventListener(
"pointerup",
function(e){

e.preventDefault();
e.stopPropagation();

if(
joystickPointerId===
e.pointerId
){

resetJoystick();

}

},
{passive:false}
);

joystickEl.addEventListener(
"pointercancel",
function(e){

e.preventDefault();
e.stopPropagation();

resetJoystick();

},
{passive:false}
);

joystickEl.addEventListener(
"lostpointercapture",
function(){
resetJoystick();
}
);

function updateSpeedButton(){

var show=!!(
gameStarted&&
player&&
mass(player)<SPEED_HIDE_MASS
);

speedBtn.hidden=!show;

if(!show){

speedBoost=false;

speedBtn.classList.remove("active");

}

}

function releaseSpeed(e){

if(e){

e.preventDefault();
e.stopPropagation();

}

speedBoost=false;

speedBtn.classList.remove(
"active"
);

}

speedBtn.addEventListener(
"pointerdown",
function(e){

e.preventDefault();
e.stopPropagation();

if(speedBtn.hidden)return;

speedBoost=true;

speedBtn.classList.add(
"active"
);

try{
speedBtn.setPointerCapture(
e.pointerId
);
}catch(_){}

},
{passive:false}
);

speedBtn.addEventListener(
"pointerup",
releaseSpeed,
{passive:false}
);

speedBtn.addEventListener(
"pointercancel",
releaseSpeed,
{passive:false}
);

speedBtn.addEventListener(
"lostpointercapture",
function(){

speedBoost=false;

speedBtn.classList.remove(
"active"
);

}
);

function split(){

if(!player||!gameStarted)return;

var original=
player.cells.slice();

var created=false;

for(
var i=0;
i<original.length;
i++
){

var c=original[i];

if(c.m<70)continue;

var half=c.m/2;

c.m=half;

var angle=
Math.atan2(
mouse.y-vh/2,
mouse.x-vw/2
);

if(joystickActive){

angle=Math.atan2(
joystickY,
joystickX
);

}

var speed=520;

player.cells.push({

x:
c.x+
Math.cos(angle)*
radius(c)*.55,

y:
c.y+
Math.sin(angle)*
radius(c)*.55,

m:half,

owner:player,

vx:
Math.cos(angle)*speed,

vy:
Math.sin(angle)*speed

});

created=true;

}

if(created){

/* Inicia o tempo para juntar novamente */
mergeTimer=MERGE_DELAY;

splitSound();

}

}

/*
 * Junta automaticamente todas as células do jogador
 * depois do tempo definido após uma divisão.
 *
 * A massa total é preservada.
 */
function mergePlayerCells(dt){

if(
!player||
player.cells.length<=1
){

return;

}

if(mergeTimer>0){

mergeTimer-=dt;

return;

}

var total=0;
var biggestCell=null;

for(
var i=0;
i<player.cells.length;
i++
){

var c=player.cells[i];

total+=c.m;

if(
!biggestCell||
c.m>biggestCell.m
){

biggestCell=c;

}

}

if(!biggestCell)return;

var centerX=0;
var centerY=0;

for(
var j=0;
j<player.cells.length;
j++
){

centerX+=player.cells[j].x;
centerY+=player.cells[j].y;

}

centerX/=player.cells.length;
centerY/=player.cells.length;

biggestCell.m=total;

biggestCell.x=centerX;
biggestCell.y=centerY;

biggestCell.vx=0;
biggestCell.vy=0;

player.cells=[biggestCell];

mergeTimer=0;

}

function eject(){

if(!player||!gameStarted)return;

var c=biggest(player);

if(!c||c.m<35)return;

c.m-=18;

var angle;

if(joystickActive){

angle=Math.atan2(
joystickY,
joystickX
);

}else{

angle=Math.atan2(
mouse.y-vh/2,
mouse.x-vw/2
);

}

food.push({

x:
c.x+
Math.cos(angle)*
(radius(c)+18),

y:
c.y+
Math.sin(angle)*
(radius(c)+18),

r:9,

m:20,

type:"candy",

rot:0,

pulse:0

});

ejectSound();

}

function update(dt){

if(!gameStarted)return;

/* Verifica se as células já podem voltar a ser uma só */
mergePlayerCells(dt);

for(
var i=0;
i<bots.length;
i++
){

think(bots[i],dt);

}

if(player){

if(joystickActive){

var lead=biggest(player);

if(lead){

player.tx=
lead.x+
joystickX*1000;

player.ty=
lead.y+
joystickY*1000;

}

}else{

player.tx=
camX+
(mouse.x-vw/2)/zoom;

player.ty=
camY+
(mouse.y-vh/2)/zoom;

}

}

var owners=bots.slice();

if(player){
owners.push(player);
}

var playerCanBoost=!!(
player&&
mass(player)<SPEED_HIDE_MASS
);

for(
var oi=0;
oi<owners.length;
oi++
){

var owner=owners[oi];

for(
var ci=0;
ci<owner.cells.length;
ci++
){

var c=owner.cells[ci];

var dx=
owner.tx-c.x;

var dy=
owner.ty-c.y;

var d=Math.hypot(dx,dy);

if(d>1){

var r=radius(c);

var boost=(
c.owner===player&&
speedBoost&&
playerCanBoost
)
?SPEED_MULT
:1;

var sp=
260*
Math.pow(c.m,-.2)*
Math.min(
1,
d/(r*.6+10)
)*
boost;

c.x+=
(dx/d)*
sp*
dt;

c.y+=
(dy/d)*
sp*
dt;

}

c.vx*=Math.pow(
.035,
dt
);

c.vy*=Math.pow(
.035,
dt
);

c.x+=c.vx*dt;
c.y+=c.vy*dt;

}

}

for(
var oi2=0;
oi2<owners.length;
oi2++
){

var own=owners[oi2];

for(
var ci2=0;
ci2<own.cells.length;
ci2++
){

var cell=own.cells[ci2];

for(
var f=food.length-1;
f>=0;
f--
){

var fd=food[f];

var rr=
radius(cell)+fd.r;

if(
Math.hypot(
cell.x-fd.x,
cell.y-fd.y
)<rr
){

cell.m+=fd.m;

if(own===player){
eatSound();
}

food.splice(f,1);

}

}

}

}

maintainInfiniteFood();

for(
var a=0;
a<owners.length;
a++
){

var A=owners[a];

for(
var b=0;
b<owners.length;
b++
){

if(a===b)continue;

var B=owners[b];

for(
var x=0;
x<A.cells.length;
x++
){

var ca=A.cells[x];

for(
var y=B.cells.length-1;
y>=0;
y--
){

var cb=B.cells[y];

var ra=radius(ca);
var rb=radius(cb);

var dd=Math.hypot(
ca.x-cb.x,
ca.y-cb.y
);

if(
dd<ra+rb*.5&&
ca.m>cb.m*1.05
){

ca.m+=cb.m;

B.cells.splice(y,1);

if(B===player){

die();
return;

}

break;

}

}

}

}

}

for(
var bi2=bots.length-1;
bi2>=0;
bi2--
){

if(
bots[bi2].cells.length===0
){

bots.splice(bi2,1);

bots.push(
createBot(
randInt(
0,
names.length-1
)
)
);

}

}

}

function getCameraZoom(){

if(manualZoom!==0){

return clamp(
1+manualZoom,
MIN_MANUAL_ZOOM,
MAX_MANUAL_ZOOM
);

}

if(!player)return 1;

var m=mass(player);

return clamp(
1/
Math.pow(
Math.max(1,m/100),
.16
),
.42,
1.15
);

}

function changeZoom(amount){

manualZoom+=amount;

manualZoom=clamp(
manualZoom,
MIN_MANUAL_ZOOM-1,
MAX_MANUAL_ZOOM-1
);

}

function toScreen(x,y){

return{

x:
(x-camX)*
zoom+
vw/2,

y:
(y-camY)*
zoom+
vh/2

};

}

function drawFloor(){

ctx.fillStyle="#07343a";

ctx.fillRect(
0,
0,
vw,
vh
);

var g=
ctx.createRadialGradient(
vw*.5,
vh*.45,
20,
vw*.5,
vh*.45,
Math.max(vw,vh)*.8
);

g.addColorStop(
0,
"rgba(35,150,158,.30)"
);

g.addColorStop(
.55,
"rgba(5,64,73,.15)"
);

g.addColorStop(
1,
"rgba(0,0,0,.28)"
);

ctx.fillStyle=g;

ctx.fillRect(
0,
0,
vw,
vh
);

}

function shadow(p,r){

ctx.save();

ctx.globalAlpha=.28;
ctx.fillStyle="#000";

ctx.beginPath();

ctx.ellipse(
p.x+r*.12,
p.y+r*.16,
r*.94,
r*.48,
0,
0,
Math.PI*2
);

ctx.fill();

ctx.restore();

}

function drawCell(c){

var p=toScreen(
c.x,
c.y
);

var r=
radius(c)*
zoom;

if(
p.x+r<-20||
p.x-r>vw+20||
p.y+r<-20||
p.y-r>vh+20
){

return;

}

shadow(p,r);

var base=
c.owner.color||
"#2fd5e7";

var g=
ctx.createRadialGradient(
p.x-r*.35,
p.y-r*.4,
r*.08,
p.x,
p.y,
r
);

g.addColorStop(
0,
"#fff"
);

g.addColorStop(
.12,
"rgba(255,255,255,.78)"
);

g.addColorStop(
.24,
base
);

g.addColorStop(
.78,
base
);

g.addColorStop(
1,
"rgba(0,0,0,.68)"
);

ctx.fillStyle=g;

ctx.beginPath();

ctx.arc(
p.x,
p.y,
r,
0,
Math.PI*2
);

ctx.fill();

ctx.strokeStyle=
"rgba(0,0,0,.42)";

ctx.lineWidth=
Math.max(
1,
r*.035
);

ctx.stroke();

var shine=
ctx.createRadialGradient(
p.x-r*.38,
p.y-r*.48,
0,
p.x-r*.38,
p.y-r*.48,
r*.45
);

shine.addColorStop(
0,
"rgba(255,255,255,.85)"
);

shine.addColorStop(
1,
"rgba(255,255,255,0)"
);

ctx.fillStyle=shine;

ctx.beginPath();

ctx.arc(
p.x-r*.38,
p.y-r*.48,
r*.48,
0,
Math.PI*2
);

ctx.fill();

if(r>18){

ctx.fillStyle="#fff";

ctx.font=
"900 "+
Math.max(
12,
r*.34
)+
"px Arial";

ctx.textAlign="center";
ctx.textBaseline="middle";

ctx.shadowColor=
"rgba(0,0,0,.65)";

ctx.shadowBlur=5;

ctx.fillText(
c.owner.name,
p.x,
p.y
);

ctx.shadowBlur=0;

}

}

function drawFood(f){

var p=toScreen(
f.x,
f.y
);

var r=f.r*zoom;

if(
p.x+r<-20||
p.x-r>vw+20||
p.y+r<-20||
p.y-r>vh+20
){

return;

}

ctx.save();

var pulse=
1+
Math.sin(
performance.now()*.003+
f.pulse
)*.05;

ctx.translate(
p.x,
p.y
);

ctx.rotate(f.rot);

ctx.scale(
pulse,
pulse
);

ctx.globalAlpha=.25;

ctx.fillStyle="#000";

ctx.beginPath();

ctx.ellipse(
r*.15,
r*.28,
r*1.05,
r*.45,
0,
0,
Math.PI*2
);

ctx.fill();

ctx.globalAlpha=1;

if(f.type==="icecream"){

var cone=
ctx.createLinearGradient(
-r,
-r,
r,
r
);

cone.addColorStop(0,"#ffe7a3");
cone.addColorStop(.5,"#d58b38");
cone.addColorStop(1,"#824719");

ctx.fillStyle=cone;

ctx.beginPath();

ctx.moveTo(-r*.62,r*.05);
ctx.lineTo(r*.62,r*.05);
ctx.lineTo(0,r*1.45);
ctx.closePath();

ctx.fill();

ctx.strokeStyle=
"rgba(80,40,10,.45)";

ctx.lineWidth=1;

for(
var q=-.4;
q<=.4;
q+=.25
){

ctx.beginPath();

ctx.moveTo(q*r,0);
ctx.lineTo(0,r*1.05);

ctx.stroke();

}

var ice=
ctx.createRadialGradient(
-r*.3,
-r*.65,
1,
0,
-r*.35,
r
);

ice.addColorStop(0,"#fff");
ice.addColorStop(.35,"#ff8fd0");
ice.addColorStop(1,"#c62f91");

ctx.fillStyle=ice;

ctx.beginPath();

ctx.arc(
0,
-r*.35,
r*.75,
0,
Math.PI*2
);

ctx.fill();

}else if(f.type==="meat"){

var meat=
ctx.createRadialGradient(
-r*.3,
-r*.4,
1,
0,
0,
r*1.2
);

meat.addColorStop(0,"#ffb06b");
meat.addColorStop(.4,"#c74d26");
meat.addColorStop(1,"#651d13");

ctx.fillStyle=meat;

ctx.beginPath();

ctx.ellipse(
0,
0,
r*1.05,
r*.7,
-.15,
0,
Math.PI*2
);

ctx.fill();

ctx.fillStyle=
"rgba(255,220,160,.55)";

ctx.beginPath();

ctx.arc(
-r*.25,
-r*.12,
r*.16,
0,
Math.PI*2
);

ctx.fill();

}else if(f.type==="chicken"){

var chick=
ctx.createRadialGradient(
-r*.35,
-r*.35,
1,
0,
0,
r*1.2
);

chick.addColorStop(0,"#fff0a0");
chick.addColorStop(.35,"#f39a35");
chick.addColorStop(.78,"#b94b18");
chick.addColorStop(1,"#6d250f");

ctx.fillStyle=chick;

ctx.beginPath();

ctx.ellipse(
-r*.1,
-r*.1,
r*.85,
r*.55,
-.35,
0,
Math.PI*2
);

ctx.fill();

ctx.fillStyle="#fff1d0";

ctx.beginPath();

ctx.roundRect(
r*.35,
r*.05,
r*.65,
r*.3,
r*.15
);

ctx.fill();

}else if(f.type==="burger"){

ctx.fillStyle="#d98b2b";

ctx.beginPath();

ctx.ellipse(
0,
-r*.35,
r,
r*.45,
0,
0,
Math.PI*2
);

ctx.fill();

ctx.fillStyle="#5b2b17";

ctx.fillRect(
-r*.82,
-.1*r,
r*1.64,
r*.45
);

ctx.fillStyle="#48b83d";

ctx.fillRect(
-r*.85,
-.22*r,
r*1.7,
r*.12
);

ctx.fillStyle="#ffd34d";

ctx.fillRect(
-r*.8,
.25*r,
r*1.6,
r*.15
);

}else if(f.type==="pizza"){

ctx.fillStyle="#f3c64b";

ctx.beginPath();

ctx.moveTo(-r*.9,-r*.75);
ctx.lineTo(r*1.0,0);
ctx.lineTo(-r*.65,r*.95);
ctx.closePath();

ctx.fill();

ctx.fillStyle="#e53b25";

ctx.beginPath();

ctx.arc(
-r*.2,
-r*.2,
r*.14,
0,
Math.PI*2
);

ctx.fill();

ctx.beginPath();

ctx.arc(
r*.25,
r*.15,
r*.13,
0,
Math.PI*2
);

ctx.fill();

}else if(f.type==="donut"){

var dg=
ctx.createRadialGradient(
-r*.25,
-r*.35,
1,
0,
0,
r
);

dg.addColorStop(0,"#ffd18a");
dg.addColorStop(.55,"#c76a30");
dg.addColorStop(1,"#733314");

ctx.fillStyle=dg;

ctx.beginPath();

ctx.arc(
0,
0,
r,
0,
Math.PI*2
);

ctx.fill();

ctx.globalCompositeOperation=
"destination-out";

ctx.beginPath();

ctx.arc(
0,
0,
r*.32,
0,
Math.PI*2
);

ctx.fill();

ctx.globalCompositeOperation=
"source-over";

}else if(f.type==="apple"){

var ag=
ctx.createRadialGradient(
-r*.3,
-r*.4,
1,
0,
0,
r
);

ag.addColorStop(0,"#ff8b75");
ag.addColorStop(.5,"#e82e32");
ag.addColorStop(1,"#7d0917");

ctx.fillStyle=ag;

ctx.beginPath();

ctx.arc(
-r*.25,
0,
r*.65,
0,
Math.PI*2
);

ctx.arc(
r*.25,
0,
r*.65,
0,
Math.PI*2
);

ctx.fill();

ctx.strokeStyle="#4b2b12";
ctx.lineWidth=r*.12;

ctx.beginPath();

ctx.moveTo(
0,
-r*.48
);

ctx.lineTo(
r*.12,
-r*1.0
);

ctx.stroke();

ctx.fillStyle="#53b948";

ctx.beginPath();

ctx.ellipse(
r*.35,
-r*.85,
r*.38,
r*.18,
-.35,
0,
Math.PI*2
);

ctx.fill();

}else if(f.type==="watermelon"){

ctx.fillStyle="#39b84a";

ctx.beginPath();

ctx.arc(
0,
0,
r,
0,
Math.PI*2
);

ctx.fill();

ctx.strokeStyle="#16752d";
ctx.lineWidth=r*.13;

for(
var wi=-.5;
wi<=.5;
wi+=.25
){

ctx.beginPath();

ctx.arc(
wi*r,
0,
r*.72,
-.8,
.8
);

ctx.stroke();

}

ctx.fillStyle="#23110d";

for(
var ws=0;
ws<5;
ws++
){

ctx.beginPath();

ctx.ellipse(
rnd(-r*.45,r*.45),
rnd(-r*.45,r*.45),
r*.07,
r*.14,
0,
0,
Math.PI*2
);

ctx.fill();

}

}else if(f.type==="chocolate"){

var cg=
ctx.createLinearGradient(
-r,
-r,
r,
r
);

cg.addColorStop(0,"#8d522c");
cg.addColorStop(.45,"#542914");
cg.addColorStop(1,"#210c07");

ctx.fillStyle=cg;

ctx.beginPath();

ctx.roundRect(
-r,
-r*.65,
r*2,
r*1.3,
r*.18
);

ctx.fill();

ctx.strokeStyle=
"rgba(255,210,150,.25)";

ctx.lineWidth=1;

for(
var ch=-.5;
ch<=.5;
ch+=.5
){

ctx.beginPath();

ctx.moveTo(
ch*r,
-r*.55
);

ctx.lineTo(
ch*r,
r*.55
);

ctx.stroke();

}

}else if(f.type==="lollipop"){

ctx.strokeStyle="#eee";
ctx.lineWidth=r*.13;

ctx.beginPath();

ctx.moveTo(0,r*.2);
ctx.lineTo(0,r*1.35);

ctx.stroke();

var lg=
ctx.createRadialGradient(
-r*.3,
-r*.35,
1,
0,
0,
r
);

lg.addColorStop(0,"#fff");
lg.addColorStop(.25,"#ff79b5");
lg.addColorStop(.65,"#e72f70");
lg.addColorStop(1,"#7d123d");

ctx.fillStyle=lg;

ctx.beginPath();

ctx.arc(
0,
-r*.25,
r*.75,
0,
Math.PI*2
);

ctx.fill();

}else if(f.type==="cupcake"){

ctx.fillStyle="#c97932";

ctx.beginPath();

ctx.moveTo(-r*.7,-r*.1);
ctx.lineTo(r*.7,-r*.1);
ctx.lineTo(r*.45,r*.9);
ctx.lineTo(-r*.45,r*.9);
ctx.closePath();

ctx.fill();

var cc=
ctx.createRadialGradient(
-r*.25,
-r*.55,
1,
0,
0,
r
);

cc.addColorStop(0,"#fff");
cc.addColorStop(.4,"#ff8dbb");
cc.addColorStop(1,"#c72867");

ctx.fillStyle=cc;

ctx.beginPath();

ctx.arc(
0,
-r*.35,
r*.7,
0,
Math.PI*2
);

ctx.fill();

}else if(f.type==="cheese"){

ctx.fillStyle="#ffd43d";

ctx.beginPath();

ctx.moveTo(-r,-r*.65);
ctx.lineTo(r*.95,-r*.3);
ctx.lineTo(r*.35,r*.8);
ctx.lineTo(-r*.8,r*.45);
ctx.closePath();

ctx.fill();

ctx.fillStyle="#c58a17";

for(
var chs=0;
chs<4;
chs++
){

ctx.beginPath();

ctx.arc(
rnd(-r*.5,r*.5),
rnd(-r*.3,r*.45),
r*.1,
0,
Math.PI*2
);

ctx.fill();

}

}else if(f.type==="grape"){

ctx.fillStyle="#713bc7";

var grapes=[
[-.35,-.4],
[.05,-.45],
[.4,-.35],
[-.5,-.05],
[-.12,-.05],
[.28,-.02],
[-.3,.3],
[.08,.28]
];

for(
var gi=0;
gi<grapes.length;
gi++
){

ctx.beginPath();

ctx.arc(
grapes[gi][0]*r,
grapes[gi][1]*r,
r*.27,
0,
Math.PI*2
);

ctx.fill();

}

}else if(f.type==="orange"){

var og=
ctx.createRadialGradient(
-r*.35,
-r*.45,
1,
0,
0,
r
);

og.addColorStop(0,"#fff0a0");
og.addColorStop(.35,"#ffad32");
og.addColorStop(.75,"#ef6514");
og.addColorStop(1,"#8f2b08");

ctx.fillStyle=og;

ctx.beginPath();

ctx.arc(
0,
0,
r*.85,
0,
Math.PI*2
);

ctx.fill();

}else{

var candy=
ctx.createRadialGradient(
-r*.35,
-r*.4,
1,
0,
0,
r
);

candy.addColorStop(0,"#fff");
candy.addColorStop(.2,"#ff7bd0");
candy.addColorStop(.55,"#7e5cff");
candy.addColorStop(1,"#27175e");

ctx.fillStyle=candy;

ctx.beginPath();

ctx.arc(
0,
0,
r*.85,
0,
Math.PI*2
);

ctx.fill();

}

var shine=
ctx.createRadialGradient(
-r*.35,
-r*.45,
0,
-r*.35,
-r*.45,
r*.55
);

shine.addColorStop(
0,
"rgba(255,255,255,.72)"
);

shine.addColorStop(
1,
"rgba(255,255,255,0)"
);

ctx.fillStyle=shine;

ctx.beginPath();

ctx.arc(
-r*.3,
-r*.35,
r*.48,
0,
Math.PI*2
);

ctx.fill();

ctx.restore();

}

function draw(){

ctx.clearRect(
0,
0,
vw,
vh
);

drawFloor();

for(
var i=0;
i<food.length;
i++
){

drawFood(food[i]);

}

var owners=bots.slice();

if(player){
owners.push(player);
}

var cells=[];

for(
var oi=0;
oi<owners.length;
oi++
){

for(
var ci=0;
ci<owners[oi].cells.length;
ci++
){

cells.push(
owners[oi].cells[ci]
);

}

}

cells.sort(
function(a,b){
return a.m-b.m;
}
);

for(
var c=0;
c<cells.length;
c++
){

drawCell(cells[c]);

}

}

function updateHud(){

if(!player)return;

var m=Math.floor(
mass(player)
);

sc.textContent=
"Massa: "+m;

if(m>peak){
peak=m;
}

if(m>best){

best=m;

localStorage.setItem(
"agario_best",
String(best)
);

}

var list=[];

for(
var i=0;
i<bots.length;
i++
){

list.push({
name:bots[i].name,
mass:mass(bots[i])
});

}

list.push({
name:player.name,
mass:m
});

list.sort(
function(a,b){
return b.mass-a.mass;
}
);

lb.innerHTML="";

for(
var j=0;
j<Math.min(
8,
list.length
);
j++
){

var li=
document.createElement(
"li"
);

li.textContent=
list[j].name;

if(
list[j].name===
player.name
){

li.style.color=
"#61eaff";

li.style.fontWeight=
"900";

}

lb.appendChild(li);

}

}

function start(){

if(gameStarted)return;

gameStarted=true;

playerName=
(
nameInput.value.trim()||
"Sem nome"
).slice(
0,
14
);

player=
createPlayer(
playerName
);

fillInitialFood();

bots=[];

for(
var b=0;
b<BOT_COUNT;
b++
){

bots.push(
createBot(b)
);

}

var lead=biggest(player);

camX=lead.x;
camY=lead.y;

zoom=1;
manualZoom=0;

/* Reinicia o estado de divisão/reagrupamento */
mergeTimer=0;

resetJoystick();

speedBoost=false;

joystickEl.hidden=false;

ctrl.hidden=false;

speedBtn.hidden=false;

updateSpeedButton();

menu.style.display="none";

audio();

if(musicOn){
startMusic();
}

updateHud();

}

function die(){

gameStarted=false;

resetJoystick();

speedBoost=false;

mergeTimer=0;

joystickEl.hidden=true;

speedBtn.hidden=true;

speedBtn.classList.remove(
"active"
);

ctrl.hidden=true;

stopMusic();

menu.style.display="flex";

playBtn.textContent=
"JOGAR NOVAMENTE";

infoEl.textContent=
"Massa máxima: "+
peak+
" | Recorde: "+
best;

player=
createPlayer(
playerName
);

}

root.addEventListener(
"pointermove",
function(e){

if(
e.target===joystickEl||
joystickEl.contains(e.target)||
e.target===speedBtn
){

return;

}

var rect=
root.getBoundingClientRect();

mouse.x=
e.clientX-
rect.left;

mouse.y=
e.clientY-
rect.top;

},
{passive:true}
);

root.addEventListener(
"touchstart",
function(e){

if(
!gameStarted||
joystickActive||
speedBoost
){

return;

}

if(e.touches.length===2){

touchA=e.touches[0];
touchB=e.touches[1];

}

},
{passive:true}
);

root.addEventListener(
"touchmove",
function(e){

if(
!gameStarted||
joystickActive||
speedBoost
){

return;

}

if(e.touches.length===2){

var a=e.touches[0];
var b=e.touches[1];

var d=Math.hypot(
a.clientX-b.clientX,
a.clientY-b.clientY
);

if(
touchA&&
touchB
){

var oldD=Math.hypot(
touchA.clientX-touchB.clientX,
touchA.clientY-touchB.clientY
);

if(oldD>0){

var diff=
(d-oldD)/300;

manualZoom+=diff;

manualZoom=clamp(
manualZoom,
MIN_MANUAL_ZOOM-1,
MAX_MANUAL_ZOOM-1
);

}

}

touchA=a;
touchB=b;

}

},
{passive:true}
);

root.addEventListener(
"touchend",
function(e){

if(e.touches.length<2){

touchA=null;
touchB=null;

}

},
{passive:true}
);

root.addEventListener(
"wheel",
function(e){

if(!gameStarted)return;

e.preventDefault();

manualZoom-=
e.deltaY*.001;

manualZoom=clamp(
manualZoom,
MIN_MANUAL_ZOOM-1,
MAX_MANUAL_ZOOM-1
);

},
{passive:false}
);

function onKey(e){

if(e.code==="Space"){

e.preventDefault();

split();

}

if(
e.key.toLowerCase()==="w"
){

eject();

}

if(e.key==="+"){
changeZoom(.15);
}

if(e.key==="-"){
changeZoom(-.15);
}

if(e.key==="0"){
manualZoom=0;
}

}

window.addEventListener(
"keydown",
onKey
);

bSplit.addEventListener(
"pointerdown",
function(e){

e.preventDefault();
e.stopPropagation();

split();

},
{passive:false}
);

bEject.addEventListener(
"pointerdown",
function(e){

e.preventDefault();
e.stopPropagation();

eject();

},
{passive:false}
);

zoomIn.addEventListener(
"pointerdown",
function(e){

e.preventDefault();
e.stopPropagation();

changeZoom(.15);

},
{passive:false}
);

zoomOut.addEventListener(
"pointerdown",
function(e){

e.preventDefault();
e.stopPropagation();

changeZoom(-.15);

},
{passive:false}
);

musicBtn.addEventListener(
"pointerdown",
function(e){

e.preventDefault();
e.stopPropagation();

musicOn=!musicOn;

musicLabel();

if(musicOn){

audio();
startMusic();

}else{

stopMusic();

}

},
{passive:false}
);

function startFromButton(e){

if(e){

e.preventDefault();
e.stopPropagation();

}

start();

}

playBtn.addEventListener(
"pointerdown",
startFromButton,
{passive:false}
);

playBtn.addEventListener(
"click",
startFromButton,
{passive:false}
);

nameInput.addEventListener(
"keydown",
function(e){

if(e.key==="Enter"){

startFromButton(e);

}

}
);

function frame(now){

var dt=Math.min(
.05,
(now-lastTime)/1000
);

lastTime=now;

update(dt);

if(player){

var total=mass(player);

if(total>0){

var targetZoom=
getCameraZoom();

var lead=
biggest(player);

if(lead){

camX+=
(lead.x-camX)*
Math.min(
1,
dt*5
);

camY+=
(lead.y-camY)*
Math.min(
1,
dt*5
);

}

zoom+=
(targetZoom-zoom)*
Math.min(
1,
dt*3
);

}

}

updateSpeedButton();

updateHud();

draw();

requestAnimationFrame(
frame
);

}

joystickEl.hidden=true;
speedBtn.hidden=true;
ctrl.hidden=true;

musicLabel();

infoEl.textContent=
best
?"Recorde: "+best
:"";

requestAnimationFrame(
frame
);

})();
</script>
`;

function executeGameScripts(container){

const scripts=[
...container.querySelectorAll("script")
];

for(
const oldScript of scripts
){

const script=
document.createElement(
"script"
);

for(
const attr of oldScript.attributes
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

id:"agario",
name:"Agario 3D",
category:"Arcade",
icon:"🟢",

init({container}){

container.innerHTML=
AGARIO_HTML;

executeGameScripts(
container
);

}

});