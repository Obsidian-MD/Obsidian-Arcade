import { registerGame } from "../arcade.js";

const SPACEINVADERS_HTML = String.raw`<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;}
html,body{margin:0;padding:0;width:100%;overflow:hidden;}
body{background:transparent;font-family:'Courier New',Courier,monospace;}
.wrap{width:100%;max-width:430px;margin:0 auto;padding:8px;}
.game{position:relative;width:100%;min-height:580px;border-radius:24px;background:#000;border:2px solid #4ade80;box-shadow:0 0 25px rgba(74,222,128,0.4);display:flex;flex-direction:column;align-items:center;overflow:hidden;}
.hud{width:100%;padding:10px 14px;display:flex;justify-content:space-between;color:#fff;font-size:12px;font-weight:bold;background:#050505;border-bottom:2px solid #4ade80;}
.hud b{color:#4ade80;}
canvas{width:100%;max-width:380px;touch-action:none;background:#000;}
.controls{display:flex;gap:8px;padding:8px 12px 14px;width:100%;max-width:380px;}
.ctrl-btn{flex:1;padding:14px 0;border-radius:10px;border:1px solid #4ade80;background:rgba(74,222,128,0.15);color:#4ade80;font-weight:bold;font-size:14px;cursor:pointer;}
.ctrl-btn:active{background:rgba(74,222,128,0.4);}
.status-msg{color:rgba(255,255,255,0.5);font-size:9px;padding:0 10px 4px;text-align:center;}
.overlay{position:absolute;z-index:50;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,0.92);}
.panel{width:100%;max-width:320px;padding:22px;text-align:center;background:#050505;border:2px solid #4ade80;border-radius:16px;box-shadow:0 0 30px rgba(74,222,128,0.4);}
.panel h1{color:#4ade80;font-size:16px;margin:0 0 10px;}
.panel p{color:rgba(255,255,255,0.75);font-size:12px;line-height:1.5;margin:0 0 18px;}
#startBtn{width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,#4ade80,#16a34a);color:#000;font-family:'Courier New',Courier,monospace;font-weight:bold;font-size:13px;cursor:pointer;}
#startBtn:active{transform:scale(0.98);}
.footer-info{width:100%;padding:6px 14px 10px;color:rgba(255,255,255,0.4);font-size:9px;text-align:center;background:#050505;}
</style>
<div class="wrap"><div class="game" id="game">
  <div class="overlay" id="overlay">
    <div class="panel">
      <h1 id="overlayTitle">👾 SPACE INVADERS</h1>
      <p id="overlayText">Destrua todos os invasores antes que cheguem até você ou atirem em você 3 vezes. Use os botões pra mover e atirar.</p>
      <button id="startBtn">INICIAR</button>
    </div>
  </div>
  <div class="hud"><span>Pontos: <b id="scoreEl">0</b></span><span>Vidas: <b id="livesEl">3</b></span><span>Onda: <b id="waveEl">1</b></span></div>
  <canvas id="canvas" width="340" height="380"></canvas>
  <div class="controls">
    <button class="ctrl-btn" id="leftBtn">◀</button>
    <button class="ctrl-btn" id="fireBtn">🔫 ATIRAR</button>
    <button class="ctrl-btn" id="rightBtn">▶</button>
  </div>
  <div class="status-msg">Use as setas pra mover e o botão pra atirar.</div>
  <div class="footer-info">Space Invaders • OBSIDIAN ARCADE</div>
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
  const waveEl=document.getElementById('waveEl');
  const leftBtn=document.getElementById('leftBtn');
  const rightBtn=document.getElementById('rightBtn');
  const fireBtn=document.getElementById('fireBtn');

  const W=340, H=380;
  const PLAYER_W=28, PLAYER_H=14;
  const ROWS=4, COLS=8;
  const ENEMY_W=22, ENEMY_H=16, ENEMY_GAP_X=8, ENEMY_GAP_Y=12;

  let playerX=W/2-PLAYER_W/2;
  let moveDir=0;
  let bullets=[];
  let enemyBullets=[];
  let enemies=[];
  let enemyDir=1;
  let enemySpeed=0.5;
  let score=0, lives=3, wave=1;
  let running=false;
  let rafId=null;
  let frame=0;

  function buildEnemies(){
    enemies=[];
    const startX=(W-(COLS*(ENEMY_W+ENEMY_GAP_X)))/2;
    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS;c++){
        enemies.push({
          x: startX + c*(ENEMY_W+ENEMY_GAP_X),
          y: 30 + r*(ENEMY_H+ENEMY_GAP_Y),
          alive:true
        });
      }
    }
    enemyDir=1;
    enemySpeed=0.5 + (wave-1)*0.25;
  }

  function fire(){
    if(!running) return;
    if(bullets.length<3){
      bullets.push({x:playerX+PLAYER_W/2-1.5, y:H-30});
    }
  }

  function update(){
    frame++;
    playerX+=moveDir*3.4;
    playerX=Math.max(0,Math.min(W-PLAYER_W,playerX));

    bullets.forEach(function(b){ b.y-=6; });
    bullets=bullets.filter(function(b){ return b.y>-10; });

    enemyBullets.forEach(function(b){ b.y+=3.5; });
    enemyBullets=enemyBullets.filter(function(b){ return b.y<H+10; });

    let hitEdge=false;
    enemies.forEach(function(e){
      if(!e.alive) return;
      e.x+=enemyDir*enemySpeed;
      if(e.x<=4 || e.x+ENEMY_W>=W-4) hitEdge=true;
    });
    if(hitEdge){
      enemyDir*=-1;
      enemies.forEach(function(e){ e.y+=10; });
    }

    if(frame%70===0 && running){
      const alive=enemies.filter(function(e){ return e.alive; });
      if(alive.length>0){
        const shooter=alive[Math.floor(Math.random()*alive.length)];
        enemyBullets.push({x:shooter.x+ENEMY_W/2-1.5, y:shooter.y+ENEMY_H});
      }
    }

    bullets.forEach(function(b){
      enemies.forEach(function(e){
        if(!e.alive) return;
        if(b.x>e.x && b.x<e.x+ENEMY_W && b.y>e.y && b.y<e.y+ENEMY_H){
          e.alive=false;
          b.y=-100;
          score+=15;
          scoreEl.textContent=score;
        }
      });
    });

    enemyBullets.forEach(function(b){
      if(b.x>playerX && b.x<playerX+PLAYER_W && b.y>H-30 && b.y<H-16){
        b.y=H+100;
        lives--;
        livesEl.textContent=lives;
        if(lives<=0){ endGame(false); }
      }
    });

    enemies.forEach(function(e){
      if(e.alive && e.y+ENEMY_H>=H-30){ endGame(false); }
    });

    if(enemies.every(function(e){ return !e.alive; })){
      wave++;
      waveEl.textContent=wave;
      buildEnemies();
      bullets=[];
      enemyBullets=[];
    }
  }

  function draw(){
    ctx.fillStyle='#000';
    ctx.fillRect(0,0,W,H);

    ctx.fillStyle='#4ade80';
    ctx.fillRect(playerX,H-26,PLAYER_W,PLAYER_H);

    ctx.fillStyle='#fff';
    bullets.forEach(function(b){ ctx.fillRect(b.x,b.y,3,8); });

    ctx.fillStyle='#f87171';
    enemyBullets.forEach(function(b){ ctx.fillRect(b.x,b.y,3,8); });

    ctx.fillStyle='#facc15';
    enemies.forEach(function(e){
      if(!e.alive) return;
      ctx.fillRect(e.x,e.y,ENEMY_W,ENEMY_H);
    });
  }

  function loop(){
    if(!running) return;
    update();
    draw();
    if(running) rafId=requestAnimationFrame(loop);
  }

  function endGame(won){
    running=false;
    cancelAnimationFrame(rafId);
    overlayTitle.textContent = won ? '🏆 VITÓRIA!' : '💀 FIM DE JOGO';
    overlayText.textContent = 'Você chegou na onda '+wave+' com '+score+' pontos.';
    startBtn.textContent='JOGAR NOVAMENTE';
    overlay.style.display='flex';
  }

  leftBtn.addEventListener('touchstart', function(e){ moveDir=-1; e.preventDefault(); }, {passive:false});
  leftBtn.addEventListener('touchend', function(){ moveDir=0; });
  leftBtn.addEventListener('mousedown', function(){ moveDir=-1; });
  leftBtn.addEventListener('mouseup', function(){ moveDir=0; });

  rightBtn.addEventListener('touchstart', function(e){ moveDir=1; e.preventDefault(); }, {passive:false});
  rightBtn.addEventListener('touchend', function(){ moveDir=0; });
  rightBtn.addEventListener('mousedown', function(){ moveDir=1; });
  rightBtn.addEventListener('mouseup', function(){ moveDir=0; });

  fireBtn.addEventListener('click', fire);

  document.addEventListener('keydown', function(e){
    if(e.key==='ArrowLeft') moveDir=-1;
    else if(e.key==='ArrowRight') moveDir=1;
    else if(e.key===' ') fire();
  });
  document.addEventListener('keyup', function(e){
    if(e.key==='ArrowLeft' || e.key==='ArrowRight') moveDir=0;
  });

  startBtn.addEventListener('click', function(){
    overlay.style.display='none';
    score=0; lives=3; wave=1;
    scoreEl.textContent=0; livesEl.textContent=3; waveEl.textContent=1;
    playerX=W/2-PLAYER_W/2;
    bullets=[]; enemyBullets=[];
    buildEnemies();
    running=true;
    loop();
  });

  buildEnemies();
  draw();
})();
</script>`;

function executeGameScripts(container){
  const scripts=[...container.querySelectorAll("script")];

  for(const oldScript of scripts){
    const script=document.createElement("script");

    for(const attr of oldScript.attributes){
      script.setAttribute(attr.name,oldScript.getAttribute(attr.name));
    }

    script.textContent=oldScript.textContent;

    oldScript.remove();
    container.appendChild(script);
  }
}

registerGame({
  id:"invaders",
  name:"Space Invaders",
  category:"Arcade",
  icon:"👾",

  init({container}){
    container.innerHTML=SPACEINVADERS_HTML;
    executeGameScripts(container);
  }
});