import { registerGame } from "../arcade.js";

const GALAXY_HTML = String.raw`<style>
*{
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
  -webkit-user-select:none;
  user-select:none;
}

body{
  margin:0;
  background:transparent;
  font-family:Arial,Helvetica,sans-serif;
  overflow:hidden;
}

.wrap{
  width:100%;
  max-width:430px;
  margin:auto;
}

.game{
  position:relative;
  width:100%;
  height:560px;
  overflow:hidden;
  border-radius:24px;
  background:#020208;
  border:2px solid #00f0ff;
  box-shadow:0 0 25px rgba(0,240,255,0.4);
  display:flex;
  flex-direction:column;
  align-items:center;
}

.hud{
  position:absolute;
  top:12px;
  left:16px;
  right:16px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  color:#fff;
  font-size:13px;
  font-weight:bold;
  z-index:15;
  text-shadow:0 0 8px #00f0ff;
}

.hud span b{
  color:#00ffcc;
}

.canvas-container{
  position:relative;
  width:100%;
  height:410px;
  background:#000;
}

canvas{
  display:block;
  background:radial-gradient(circle at 50% 30%, #0c0826 0%, #020208 100%);
}

.controls{
  width:100%;
  flex:1;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:0 25px;
  background:linear-gradient(180deg, #050515, #020208);
  border-top:2px solid rgba(0,240,255,0.3);
  z-index:15;
}

.move-btns{
  display:flex;
  gap:15px;
}

.ctrl-btn{
  width:55px;
  height:55px;
  background:rgba(0,240,255,0.15);
  border:2px solid #00f0ff;
  color:#00f0ff;
  font-size:20px;
  font-weight:bold;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  box-shadow:0 0 12px rgba(0,240,255,0.3);
}

.ctrl-btn:active{
  background:#00f0ff;
  color:#000;
  transform:scale(0.92);
}

.fire-btn{
  width:75px;
  height:50px;
  background:rgba(255,0,128,0.25);
  border:2px solid #ff0080;
  color:#ff0080;
  font-size:12px;
  font-weight:bold;
  border-radius:16px;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  box-shadow:0 0 12px rgba(255,0,128,0.4);
  letter-spacing:1px;
}

.fire-btn:active{
  background:#ff0080;
  color:#fff;
  transform:scale(0.92);
}

.overlay{
  position:absolute;
  z-index:30;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
  background:rgba(2,2,10,0.88);
}

.panel{
  width:100%;
  max-width:320px;
  padding:24px;
  text-align:center;
  border-radius:18px;
  background:linear-gradient(145deg, #0d0926, #03030f);
  border:2px solid #00f0ff;
  box-shadow:0 0 35px rgba(0,240,255,0.3);
}

.panel h1{
  margin:0 0 8px;
  color:#00f0ff;
  font-size:22px;
  text-shadow:0 0 12px #00f0ff;
  letter-spacing:1px;
}

.panel p{
  color:#a5b4fc;
  font-size:12px;
  line-height:1.5;
  margin:0 0 20px;
}

.start-btn{
  width:100%;
  height:48px;
  border:0;
  border-radius:14px;
  color:#000;
  background:linear-gradient(90deg, #00f0ff, #00ffcc);
  font-weight:900;
  font-size:14px;
  cursor:pointer;
  box-shadow:0 0 20px rgba(0,240,255,0.6);
  letter-spacing:1px;
}

.start-btn:active{
  transform:scale(0.96);
}
</style>

<div class="wrap">
  <div class="game" id="game">

    <div class="hud">
      <div>SCORE: <b id="score">0</b></div>
      <div>WAVE: <b id="wave">1</b></div>
      <div>LIVES: <b id="lives">3</b></div>
    </div>

    <div class="canvas-container">
      <canvas id="canvas" width="430" height="410"></canvas>
    </div>

    <div class="controls">
      <div class="move-btns">
        <div class="ctrl-btn" id="btn-left">◀</div>
        <div class="ctrl-btn" id="btn-right">▶</div>
      </div>
      <div class="fire-btn" id="btn-fire">ATIRAR</div>
    </div>

    <div class="overlay" id="overlay">
      <div class="panel">
        <h1>GALAXY ATTACK</h1>
        <p>Destrua a frota alienígena invasora! Desvie dos tiros inimigos, avance pelas ondas e salve a galáxia.</p>
        <button class="start-btn" id="start-btn">INICIAR MISSÃO</button>
      </div>
    </div>

  </div>
</div>

<script>
(function(){
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const waveEl = document.getElementById("wave");
  const livesEl = document.getElementById("lives");
  const overlay = document.getElementById("overlay");
  const startBtn = document.getElementById("start-btn");

  let score = 0;
  let wave = 1;
  let lives = 3;
  let playing = false;
  let gameLoopInterval = null;

  let player = {
    x: 195,
    y: 350,
    w: 40,
    h: 30,
    speed: 6,
    dx: 0
  };

  let bullets = [];
  let enemies = [];
  let enemyBullets = [];
  let stars = [];

  // Inicializar estrelas de fundo
  for(let i=0; i<40; i++){
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speed: Math.random() * 2 + 0.5
    });
  }

  function initWave(){
    enemies = [];
    let rows = 3 + Math.floor(wave / 2);
    if(rows > 5) rows = 5;
    let cols = 7;

    let startX = 45;
    let startY = 40;
    let spacingX = 48;
    let spacingY = 36;

    for(let r=0; r<rows; r++){
      for(let c=0; c<cols; c++){
        enemies.push({
          x: startX + c * spacingX,
          y: startY + r * spacingY,
          w: 30,
          h: 22,
          alive: true,
          type: r === 0 ? 2 : (r < 2 ? 1 : 0)
        });
      }
    }
  }

  function startGame(){
    score = 0;
    wave = 1;
    lives = 3;
    scoreEl.textContent = score;
    waveEl.textContent = wave;
    livesEl.textContent = lives;
    player.x = 195;
    bullets = [];
    enemyBullets = [];
    initWave();

    overlay.style.display = "none";
    playing = true;
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(updateAndDraw, 1000 / 60);
  }

  function shoot(){
    if(!playing) return;
    // Limitar balas simultâneas para otimizar
    let playerBulletsCount = bullets.filter(b => !b.enemy).length;
    if(playerBulletsCount < 3){
      bullets.push({
        x: player.x + player.w / 2 - 2,
        y: player.y,
        w: 4,
        h: 12,
        speed: 8,
        enemy: false
      });
    }
  }

  let enemyMoveTimer = 0;
  let enemyDir = 1;

  function update(){
    // Movimento do Jogador
    player.x += player.dx;
    if(player.x < 10) player.x = 10;
    if(player.x > canvas.width - player.w - 10) player.x = canvas.width - player.w - 10;

    // Movimento das Estrelas
    stars.forEach(s => {
      s.y += s.speed;
      if(s.y > canvas.height) s.y = 0;
    });

    // Movimento dos Inimigos (Formação)
    enemyMoveTimer++;
    let shiftDown = false;
    if(enemyMoveTimer > 35 - wave * 2){
      enemyMoveTimer = 0;
      let hitEdge = false;
      enemies.forEach(e => {
        if(!e.alive) return;
        e.x += enemyDir * 12;
        if(e.x < 15 || e.x > canvas.width - 45){
          hitEdge = true;
        }
      });
      if(hitEdge){
        enemyDir *= -1;
        shiftDown = true;
      }
      if(shiftDown){
        enemies.forEach(e => {
          e.y += 15;
          if(e.y >= player.y - 15){
            gameOver("Inimigos invadiram a base!");
          }
        });
      }
    }

    // Tiros inimigos aleatórios
    if(Math.random() < 0.02 + (wave * 0.005)){
      let aliveEnemies = enemies.filter(e => e.alive);
      if(aliveEnemies.length > 0){
        let shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
        enemyBullets.push({
          x: shooter.x + shooter.w / 2 - 2,
          y: shooter.y + shooter.h,
          w: 4,
          h: 10,
          speed: 4 + wave * 0.5,
          enemy: true
        });
      }
    }

    // Atualizar Balas
    for(let i = bullets.length - 1; i >= 0; i--){
      let b = bullets[i];
      b.y += b.enemy ? b.speed : -b.speed;

      // Remover balas fora da tela
      if(b.y < 0 || b.y > canvas.height){
        bullets.splice(i, 1);
        continue;
      }

      // Colisão bala do jogador com inimigos
      if(!b.enemy){
        for(let j = 0; j < enemies.length; j++){
          let e = enemies[j];
          if(e.alive && b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y){
            e.alive = false;
            bullets.splice(i, 1);
            score += (e.type + 1) * 100;
            scoreEl.textContent = score;
            break;
          }
        }
      } 
      // Colisão bala inimiga com o jogador
      else {
        if(b.x < player.x + player.w && b.x + b.w > player.x && b.y < player.y + player.h && b.y + b.h > player.y){
          bullets.splice(i, 1);
          lives--;
          livesEl.textContent = lives;
          if(lives <= 0){
            gameOver("Sua nave foi destruída!");
          }
          break;
        }
      }
    }

    // Verificar se todos os inimigos morreram para avançar de wave
    if(enemies.every(e => !e.alive)){
      wave++;
      waveEl.textContent = wave;
      initWave();
    }
  }

  function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar Estrelas
    ctx.fillStyle = "#ffffff";
    stars.forEach(s => {
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });

    // Desenhar Jogador (Nave Estilizada)
    ctx.fillStyle = "#00f0ff";
    ctx.beginPath();
    ctx.moveTo(player.x + player.w / 2, player.y);
    ctx.lineTo(player.x + player.w, player.y + player.h);
    ctx.lineTo(player.x, player.y + player.h);
    ctx.closePath();
    ctx.fill();
    // Detalhe da nave
    ctx.fillStyle = "#ff0080";
    ctx.fillRect(player.x + player.w / 2 - 3, player.y + 10, 6, 12);

    // Desenhar Inimigos
    enemies.forEach(e => {
      if(!e.alive) return;
      ctx.fillStyle = e.type === 2 ? "#ff0055" : (e.type === 1 ? "#ffaa00" : "#00ff88");
      ctx.fillRect(e.x, e.y, e.w, e.h);
      // Olhinhos do invasor
      ctx.fillStyle = "#000";
      ctx.fillRect(e.x + 6, e.y + 6, 4, 4);
      ctx.fillRect(e.x + 20, e.y + 6, 4, 4);
    });

    // Desenhar Balas
    bullets.forEach(b => {
      ctx.fillStyle = b.enemy ? "#ff0055" : "#00ffff";
      ctx.fillRect(b.x, b.y, b.w, b.h);
    });
  }

  function updateAndDraw(){
    if(!playing) return;
    update();
    draw();
  }

  function gameOver(reason){
    playing = false;
    clearInterval(gameLoopInterval);
    overlay.style.display = "flex";
    overlay.querySelector("h1").textContent = "GAME OVER";
    overlay.querySelector("p").innerHTML = reason + "<br>Pontuação Final: <b>" + score + "</b><br>Ondas alcançadas: <b>" + wave + "</b>";
    startBtn.textContent = "JOGAR NOVAMENTE";
  }

  startBtn.addEventListener("click", startGame);

  // Controles de Toque e Mouse
  const btnLeft = document.getElementById("btn-left");
  const btnRight = document.getElementById("btn-right");
  const btnFire = document.getElementById("btn-fire");

  btnLeft.addEventListener("touchstart", (e) => { e.preventDefault(); player.dx = -player.speed; });
  btnLeft.addEventListener("touchend", (e) => { e.preventDefault(); if(player.dx < 0) player.dx = 0; });
  btnLeft.addEventListener("mousedown", () => { player.dx = -player.speed; });
  btnLeft.addEventListener("mouseup", () => { if(player.dx < 0) player.dx = 0; });

  btnRight.addEventListener("touchstart", (e) => { e.preventDefault(); player.dx = player.speed; });
  btnRight.addEventListener("touchend", (e) => { e.preventDefault(); if(player.dx > 0) player.dx = 0; });
  btnRight.addEventListener("mousedown", () => { player.dx = player.speed; });
  btnRight.addEventListener("mouseup", () => { if(player.dx > 0) player.dx = 0; });

  btnFire.addEventListener("touchstart", (e) => { e.preventDefault(); shoot(); });
  btnFire.addEventListener("click", () => { shoot(); });

  // Suporte a teclado para testes
  document.addEventListener("keydown", (e) => {
    if(e.key === "ArrowLeft") player.dx = -player.speed;
    if(e.key === "ArrowRight") player.dx = player.speed;
    if(e.key === " "){ shoot(); e.preventDefault(); }
  });

  document.addEventListener("keyup", (e) => {
    if(e.key === "ArrowLeft" && player.dx < 0) player.dx = 0;
    if(e.key === "ArrowRight" && player.dx > 0) player.dx = 0;
  });

  // Render inicial
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
  id:"galaxy",
  name:"Galaxy Attack",
  category:"Arcade",
  icon:"🚀",

  init({container}){
    container.innerHTML = GALAXY_HTML;
    executeGameScripts(container);
  }
});