import { registerGame } from "../arcade.js";

const FLAPPYBIRD_HTML = String.raw`<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;}
html,body{margin:0;padding:0;width:100%;overflow:hidden;}
body{background:transparent;font-family:'Courier New',Courier,monospace;}
.wrap{width:100%;max-width:430px;margin:0 auto;padding:8px;}
.game{position:relative;width:100%;min-height:560px;border-radius:24px;background:#0e1a2b;border:2px solid #fbbf24;box-shadow:0 0 25px rgba(251,191,36,0.4);display:flex;flex-direction:column;align-items:center;overflow:hidden;}
.hud{width:100%;padding:10px 14px;display:flex;justify-content:space-between;color:#fff;font-size:12px;font-weight:bold;background:#0a1420;border-bottom:2px solid #fbbf24;}
.hud b{color:#fde68a;}
canvas{width:100%;max-width:380px;touch-action:none;}
.status-msg{color:rgba(255,255,255,0.55);font-size:10px;padding:8px 10px;text-align:center;}
.overlay{position:absolute;z-index:50;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,0.92);}
.panel{width:100%;max-width:320px;padding:22px;text-align:center;background:#0a1420;border:2px solid #fbbf24;border-radius:16px;box-shadow:0 0 30px rgba(251,191,36,0.4);}
.panel h1{color:#fde68a;font-size:16px;margin:0 0 10px;}
.panel p{color:rgba(255,255,255,0.75);font-size:12px;line-height:1.5;margin:0 0 18px;}
#startBtn{width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,#fbbf24,#d97706);color:#0a1420;font-family:'Courier New',Courier,monospace;font-weight:bold;font-size:13px;cursor:pointer;}
#startBtn:active{transform:scale(0.98);}
.footer-info{width:100%;padding:6px 14px 10px;color:rgba(255,255,255,0.4);font-size:9px;text-align:center;background:#0a1420;}
</style>
<div class="wrap"><div class="game" id="game">
  <div class="overlay" id="overlay">
    <div class="panel">
      <h1 id="overlayTitle">🐦 FLAPPY BIRD</h1>
      <p id="overlayText">Toque na tela para o pássaro bater as asas e subir. Desvie dos canos e faça a maior pontuação possível!</p>
      <button id="startBtn">INICIAR</button>
    </div>
  </div>
  <div class="hud"><span>Pontos: <b id="scoreEl">0</b></span><span>Recorde: <b id="bestEl">0</b></span></div>
  <canvas id="canvas" width="340" height="440"></canvas>
  <div class="status-msg">Toque na tela para bater as asas.</div>
  <div class="footer-info">Flappy Bird • OBSIDIAN ARCADE</div>
</div></div>
<script>
(function(){
  const overlay=document.getElementById('overlay');
  const overlayTitle=document.getElementById('overlayTitle');
  const overlayText=document.getElementById('overlayText');
  const startBtn=document.getElementById('startBtn');
  const canvas=document.getElementById('canvas');
  const ctx=canvas.getContext('2d');
  const scoreEl=document.getElementById('scoreEl');
  const bestEl=document.getElementById('bestEl');

  const W=340, H=440;
  const GRAVITY=0.35, FLAP=-6.4;
  const PIPE_W=48, GAP=125, PIPE_SPEED=2.2, PIPE_INTERVAL=105;

  let birdY=H/2, birdV=0;
  let pipes=[];
  let frame=0;
  let score=0, best=0;
  let running=false, gameOver=false;
  let rafId=null;

  function reset(){
    birdY=H/2; birdV=0;
    pipes=[];
    frame=0;
    score=0;
    gameOver=false;
    scoreEl.textContent=0;
  }

  function flap(){
    if(!running) return;
    birdV=FLAP;
  }

  function spawnPipe(){
    const topHeight=40+Math.random()*(H-GAP-140);
    pipes.push({x:W, top:topHeight, passed:false});
  }

  function update(){
    frame++;
    birdV+=GRAVITY;
    birdY+=birdV;

    if(frame%PIPE_INTERVAL===0){ spawnPipe(); }

    pipes.forEach(function(p){ p.x-=PIPE_SPEED; });
    pipes=pipes.filter(function(p){ return p.x>-PIPE_W; });

    const birdX=W*0.28, birdR=11;

    for(let i=0;i<pipes.length;i++){
      const p=pipes[i];
      if(!p.passed && p.x+PIPE_W<birdX){
        p.passed=true;
        score++;
        scoreEl.textContent=score;
      }
      if(birdX+birdR>p.x && birdX-birdR<p.x+PIPE_W){
        if(birdY-birdR<p.top || birdY+birdR>p.top+GAP){
          endGame();
          return;
        }
      }
    }

    if(birdY+11>=H || birdY-11<=0){
      endGame();
    }
  }

  function draw(){
    ctx.fillStyle='#0e1a2b';
    ctx.fillRect(0,0,W,H);

    ctx.fillStyle='#22c55e';
    pipes.forEach(function(p){
      ctx.fillRect(p.x,0,PIPE_W,p.top);
      ctx.fillRect(p.x,p.top+GAP,PIPE_W,H-(p.top+GAP));
    });

    const birdX=W*0.28;
    ctx.save();
    ctx.translate(birdX,birdY);
    ctx.rotate(Math.max(-0.5,Math.min(0.9,birdV*0.08)));
    ctx.fillStyle='#fbbf24';
    ctx.beginPath();
    ctx.arc(0,0,11,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle='#0a1420';
    ctx.beginPath();
    ctx.arc(5,-3,2,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  function loop(){
    if(!running) return;
    update();
    draw();
    if(running) rafId=requestAnimationFrame(loop);
  }

  function endGame(){
    if(gameOver) return;
    gameOver=true;
    running=false;
    cancelAnimationFrame(rafId);
    if(score>best) best=score;
    bestEl.textContent=best;
    overlayTitle.textContent='💀 VOCÊ BATEU!';
    overlayText.textContent='Pontuação: '+score+'. Recorde: '+best+'.';
    startBtn.textContent='JOGAR NOVAMENTE';
    overlay.style.display='flex';
  }

  canvas.addEventListener('touchstart', function(e){ flap(); e.preventDefault(); }, {passive:false});
  canvas.addEventListener('mousedown', flap);

  startBtn.addEventListener('click', function(){
    overlay.style.display='none';
    reset();
    running=true;
    loop();
  });

  draw();
})();
</script>`;

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
  id:"flappy",
  name:"Flappy Bird",
  category:"Arcade",
  icon:"🐦",

  init({container}){
    container.innerHTML = FLAPPYBIRD_HTML;
    executeGameScripts(container);
  }
});