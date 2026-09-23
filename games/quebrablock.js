import { registerGame } from "../arcade.js";

const BREAKOUT_HTML = String.raw`<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;}
html,body{margin:0;padding:0;width:100%;overflow:hidden;}
body{background:transparent;font-family:'Courier New',Courier,monospace;}
.wrap{width:100%;max-width:430px;margin:0 auto;padding:8px;}
.game{position:relative;width:100%;min-height:560px;border-radius:24px;background:#0a0a1a;border:2px solid #f472b6;box-shadow:0 0 25px rgba(244,114,182,0.4);display:flex;flex-direction:column;align-items:center;overflow:hidden;}
.hud{width:100%;padding:10px 14px;display:flex;justify-content:space-between;color:#fff;font-size:12px;font-weight:bold;background:#0a0a14;border-bottom:2px solid #f472b6;}
.hud b{color:#f9a8d4;}
canvas{width:100%;max-width:380px;touch-action:none;background:#0a0a1a;}
.status-msg{color:rgba(255,255,255,0.55);font-size:10px;padding:8px 10px;text-align:center;}
.overlay{position:absolute;z-index:50;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,0.92);}
.panel{width:100%;max-width:320px;padding:22px;text-align:center;background:#0a0a14;border:2px solid #f472b6;border-radius:16px;box-shadow:0 0 30px rgba(244,114,182,0.4);}
.panel h1{color:#f9a8d4;font-size:16px;margin:0 0 10px;}
.panel p{color:rgba(255,255,255,0.75);font-size:12px;line-height:1.5;margin:0 0 18px;}
#startBtn{width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,#f472b6,#db2777);color:#fff;font-family:'Courier New',Courier,monospace;font-weight:bold;font-size:13px;cursor:pointer;}
#startBtn:active{transform:scale(0.98);}
.footer-info{width:100%;padding:6px 14px 10px;color:rgba(255,255,255,0.4);font-size:9px;text-align:center;background:#0a0a14;}
</style>
<div class="wrap"><div class="game" id="game">
  <div class="overlay" id="overlay">
    <div class="panel">
      <h1 id="overlayTitle">🧱 BREAKOUT</h1>
      <p id="overlayText">Arraste o dedo para mover a barra e destrua todos os blocos com a bola. Você tem 3 vidas!</p>
      <button id="startBtn">INICIAR PARTIDA</button>
    </div>
  </div>
  <div class="hud"><span>Pontos: <b id="scoreEl">0</b></span><span>Vidas: <b id="livesEl">3</b></span></div>
  <canvas id="canvas" width="340" height="440"></canvas>
  <div class="status-msg">Arraste na tela para mover a barra.</div>
  <div class="footer-info">Breakout • OBSIDIAN ARCADE</div>
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
  const livesEl=document.getElementById('livesEl');

  const W=340, H=440;
  const PADDLE_W=64, PADDLE_H=10;
  const BALL_R=6;
  const ROWS=5, COLS=8;
  const BRICK_W=W/COLS, BRICK_H=18, BRICK_TOP=40;
  const COLORS=['#f472b6','#fb923c','#facc15','#4ade80','#60a5fa'];

  let paddleX=W/2-PADDLE_W/2;
  let ballX=W/2, ballY=H-40, ballVX=2.6, ballVY=-3.2;
  let bricks=[];
  let score=0, lives=3;
  let running=false;
  let rafId=null;
  let launched=false;

  function buildBricks(){
    bricks=[];
    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS;c++){
        bricks.push({r:r,c:c,x:c*BRICK_W,y:BRICK_TOP+r*BRICK_H,alive:true,color:COLORS[r%COLORS.length]});
      }
    }
  }

  function resetBall(){
    ballX=W/2; ballY=H-40;
    ballVX=(Math.random()<0.5?-1:1)*2.6;
    ballVY=-3.2;
    launched=false;
  }

  function update(){
    if(!launched) return;
    ballX+=ballVX;
    ballY+=ballVY;

    if(ballX<=BALL_R || ballX>=W-BALL_R){ ballVX*=-1; ballX=Math.max(BALL_R,Math.min(W-BALL_R,ballX)); }
    if(ballY<=BALL_R){ ballVY*=-1; ballY=BALL_R; }

    if(ballY+BALL_R>=H-24 && ballY+BALL_R<=H-14 && ballX>=paddleX && ballX<=paddleX+PADDLE_W){
      ballVY=-Math.abs(ballVY);
      const rel=(ballX-(paddleX+PADDLE_W/2))/(PADDLE_W/2);
      ballVX=rel*4;
    }

    if(ballY>H){
      lives--;
      livesEl.textContent=lives;
      if(lives<=0){
        finish(false);
        return;
      }
      resetBall();
      return;
    }

    for(let i=0;i<bricks.length;i++){
      const b=bricks[i];
      if(!b.alive) continue;
      if(ballX+BALL_R>b.x && ballX-BALL_R<b.x+BRICK_W && ballY+BALL_R>b.y && ballY-BALL_R<b.y+BRICK_H){
        b.alive=false;
        ballVY*=-1;
        score+=10;
        scoreEl.textContent=score;
        break;
      }
    }

    if(bricks.every(function(b){ return !b.alive; })){
      finish(true);
    }
  }

  function draw(){
    ctx.fillStyle='#0a0a1a';
    ctx.fillRect(0,0,W,H);

    bricks.forEach(function(b){
      if(!b.alive) return;
      ctx.fillStyle=b.color;
      ctx.fillRect(b.x+2,b.y+2,BRICK_W-4,BRICK_H-4);
    });

    ctx.fillStyle='#f9a8d4';
    ctx.fillRect(paddleX,H-24,PADDLE_W,PADDLE_H);

    ctx.beginPath();
    ctx.fillStyle='#fff';
    ctx.arc(ballX,ballY,BALL_R,0,Math.PI*2);
    ctx.fill();

    if(!launched && running){
      ctx.fillStyle='rgba(255,255,255,0.6)';
      ctx.font='11px monospace';
      ctx.textAlign='center';
      ctx.fillText('Toque para lançar a bola', W/2, H-60);
    }
  }

  function loop(){
    if(!running) return;
    update();
    draw();
    rafId=requestAnimationFrame(loop);
  }

  function finish(won){
    running=false;
    cancelAnimationFrame(rafId);
    overlayTitle.textContent = won ? '🏆 VOCÊ VENCEU!' : '💀 FIM DE JOGO';
    overlayText.textContent = won
      ? 'Você destruiu todos os blocos! Pontuação: '+score+'.'
      : 'Suas vidas acabaram. Pontuação final: '+score+'.';
    startBtn.textContent='JOGAR NOVAMENTE';
    overlay.style.display='flex';
  }

  function handlePointer(clientX){
    const rect=canvas.getBoundingClientRect();
    const scale=W/rect.width;
    const x=(clientX-rect.left)*scale;
    paddleX=Math.max(0,Math.min(W-PADDLE_W,x-PADDLE_W/2));
    if(!launched){ launched=true; }
  }

  canvas.addEventListener('touchmove', function(e){
    if(e.touches && e.touches[0]) handlePointer(e.touches[0].clientX);
    e.preventDefault();
  }, {passive:false});

  canvas.addEventListener('touchstart', function(e){
    if(e.touches && e.touches[0]){
      const rect=canvas.getBoundingClientRect();
      const scale=W/rect.width;
      const x=(e.touches[0].clientX-rect.left)*scale;
      paddleX=Math.max(0,Math.min(W-PADDLE_W,x-PADDLE_W/2));
      launched=true;
    }
  }, {passive:true});

  canvas.addEventListener('mousemove', function(e){
    handlePointer(e.clientX);
  });

  canvas.addEventListener('mousedown', function(){
    launched=true;
  });

  startBtn.addEventListener('click', function(){
    overlay.style.display='none';
    score=0;
    lives=3;
    scoreEl.textContent=0;
    livesEl.textContent=3;
    paddleX=W/2-PADDLE_W/2;
    buildBricks();
    resetBall();
    running=true;
    loop();
  });

  buildBricks();
  draw();
})();
</script>`;

function executeGameScripts(container){
  const scripts = [
    ...container.querySelectorAll("script")
  ];

  for(const oldScript of scripts){
    const script = document.createElement("script");

    for(const attr of oldScript.attributes){
      script.setAttribute(
        attr.name,
        oldScript.getAttribute(attr.name)
      );
    }

    script.textContent = oldScript.textContent;

    oldScript.remove();
    container.appendChild(script);
  }
}

registerGame({
  id:"breakout",
  name:"Breakout",
  category:"Arcade",
  icon:"🧱",

  init({container}){
    container.innerHTML = BREAKOUT_HTML;
    executeGameScripts(container);
  }
});