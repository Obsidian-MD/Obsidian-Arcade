import { registerGame } from "../arcade.js";

const PONG_HTML = String.raw`<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;}
html,body{margin:0;padding:0;width:100%;overflow:hidden;}
body{background:transparent;font-family:'Courier New',Courier,monospace;}
.wrap{width:100%;max-width:430px;margin:0 auto;padding:8px;}
.game{position:relative;width:100%;min-height:500px;border-radius:24px;background:#000;border:2px solid #4ade80;box-shadow:0 0 25px rgba(74,222,128,0.4);display:flex;flex-direction:column;align-items:center;overflow:hidden;}
.hud{width:100%;padding:10px 14px;display:flex;justify-content:space-between;color:#fff;font-size:14px;font-weight:bold;background:#0a0a0a;border-bottom:2px solid #4ade80;}
.hud b{color:#4ade80;font-size:20px;}
canvas{width:100%;max-width:380px;touch-action:none;background:#000;}
.status-msg{color:rgba(255,255,255,0.55);font-size:10px;padding:8px 10px;text-align:center;}
.overlay{position:absolute;z-index:50;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,0.92);}
.panel{width:100%;max-width:320px;padding:22px;text-align:center;background:#0a0a0a;border:2px solid #4ade80;border-radius:16px;box-shadow:0 0 30px rgba(74,222,128,0.4);}
.panel h1{color:#4ade80;font-size:16px;margin:0 0 10px;}
.panel p{color:rgba(255,255,255,0.75);font-size:12px;line-height:1.5;margin:0 0 18px;}
#startBtn{width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,#4ade80,#16a34a);color:#000;font-family:'Courier New',Courier,monospace;font-weight:bold;font-size:13px;cursor:pointer;}
#startBtn:active{transform:scale(0.98);}
.footer-info{width:100%;padding:6px 14px 10px;color:rgba(255,255,255,0.4);font-size:9px;text-align:center;background:#0a0a0a;}
</style>
<div class="wrap"><div class="game" id="game">
  <div class="overlay" id="overlay">
    <div class="panel">
      <h1 id="overlayTitle">🏓 PONG</h1>
      <p id="overlayText">Arraste o dedo verticalmente pra mover sua raquete (esquerda). Primeiro a fazer 7 pontos vence!</p>
      <button id="startBtn">INICIAR PARTIDA</button>
    </div>
  </div>
  <div class="hud"><span>Você: <b id="p1Score">0</b></span><span id="statusHud">Toque para começar</span><span>Bot: <b id="p2Score">0</b></span></div>
  <canvas id="canvas" width="360" height="400"></canvas>
  <div class="status-msg">Arraste na tela para mover sua raquete.</div>
  <div class="footer-info">Pong • OBSIDIAN ARCADE</div>
</div></div>
<script>
(function(){
  const overlay=document.getElementById('overlay');
  const overlayTitle=document.getElementById('overlayTitle');
  const overlayText=document.getElementById('overlayText');
  const startBtn=document.getElementById('startBtn');
  const canvas=document.getElementById('canvas');
  const ctx=canvas.getContext('2d');
  const p1ScoreEl=document.getElementById('p1Score');
  const p2ScoreEl=document.getElementById('p2Score');
  const statusHud=document.getElementById('statusHud');

  const W=360, H=400;
  const PADDLE_W=10, PADDLE_H=64;
  const WIN_SCORE=7;

  let p1Y=H/2-PADDLE_H/2, p2Y=H/2-PADDLE_H/2;
  let ballX=W/2, ballY=H/2, ballVX=3.2, ballVY=2.2;
  let p1Score=0, p2Score=0;
  let running=false;
  let rafId=null;

  function resetBall(direction){
    ballX=W/2; ballY=H/2;
    const angle=(Math.random()*0.6-0.3);
    ballVX=direction*3.6;
    ballVY=4*angle;
  }

  function update(){
    ballX+=ballVX;
    ballY+=ballVY;

    if(ballY<=6 || ballY>=H-6){ ballVY*=-1; ballY=Math.max(6,Math.min(H-6,ballY)); }

    if(ballX<=PADDLE_W+6 && ballY>=p1Y && ballY<=p1Y+PADDLE_H){
      ballVX=Math.abs(ballVX)*1.03;
      const rel=(ballY-(p1Y+PADDLE_H/2))/(PADDLE_H/2);
      ballVY=rel*4.5;
      ballX=PADDLE_W+7;
    }

    if(ballX>=W-PADDLE_W-6 && ballY>=p2Y && ballY<=p2Y+PADDLE_H){
      ballVX=-Math.abs(ballVX)*1.03;
      const rel=(ballY-(p2Y+PADDLE_H/2))/(PADDLE_H/2);
      ballVY=rel*4.5;
      ballX=W-PADDLE_W-7;
    }

    if(ballX<0){
      p2Score++;
      p2ScoreEl.textContent=p2Score;
      checkWin();
      if(running) resetBall(1);
    } else if(ballX>W){
      p1Score++;
      p1ScoreEl.textContent=p1Score;
      checkWin();
      if(running) resetBall(-1);
    }

    const targetY=ballY-PADDLE_H/2 + (Math.random()-0.5)*10;
    const speed=3.6;
    if(p2Y+PADDLE_H/2 < ballY-4){ p2Y+=speed; }
    else if(p2Y+PADDLE_H/2 > ballY+4){ p2Y-=speed; }
    p2Y=Math.max(0,Math.min(H-PADDLE_H,p2Y));
  }

  function checkWin(){
    if(p1Score>=WIN_SCORE){ finish(true); }
    else if(p2Score>=WIN_SCORE){ finish(false); }
  }

  function draw(){
    ctx.fillStyle='#000';
    ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(74,222,128,0.3)';
    ctx.setLineDash([6,8]);
    ctx.beginPath();
    ctx.moveTo(W/2,0); ctx.lineTo(W/2,H);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle='#4ade80';
    ctx.fillRect(6,p1Y,PADDLE_W,PADDLE_H);
    ctx.fillRect(W-PADDLE_W-6,p2Y,PADDLE_W,PADDLE_H);

    ctx.beginPath();
    ctx.arc(ballX,ballY,6,0,Math.PI*2);
    ctx.fill();
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
    overlayTitle.textContent = won ? '🏆 VOCÊ VENCEU!' : '💀 O BOT VENCEU!';
    overlayText.textContent = 'Placar final: '+p1Score+' x '+p2Score+'.';
    startBtn.textContent='JOGAR NOVAMENTE';
    overlay.style.display='flex';
  }

  function handlePointer(clientY){
    const rect=canvas.getBoundingClientRect();
    const scale=H/rect.height;
    const y=(clientY-rect.top)*scale;
    p1Y=Math.max(0,Math.min(H-PADDLE_H,y-PADDLE_H/2));
  }

  canvas.addEventListener('touchmove', function(e){
    if(e.touches && e.touches[0]) handlePointer(e.touches[0].clientY);
    e.preventDefault();
  }, {passive:false});

  canvas.addEventListener('touchstart', function(e){
    if(e.touches && e.touches[0]) handlePointer(e.touches[0].clientY);
  }, {passive:true});

  canvas.addEventListener('mousemove', function(e){
    handlePointer(e.clientY);
  });

  startBtn.addEventListener('click', function(){
    overlay.style.display='none';
    p1Score=0;
    p2Score=0;
    p1ScoreEl.textContent=0;
    p2ScoreEl.textContent=0;
    p1Y=H/2-PADDLE_H/2;
    p2Y=H/2-PADDLE_H/2;
    resetBall(Math.random()<0.5?1:-1);
    statusHud.textContent='Em jogo!';
    running=true;
    loop();
  });

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
  id:"pong",
  name:"Pong",
  category:"Arcade",
  icon:"🏓",

  init({container}){
    container.innerHTML = PONG_HTML;
    executeGameScripts(container);
  }
});