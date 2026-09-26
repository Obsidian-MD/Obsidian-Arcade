import { registerGame } from "../arcade.js";

const PACMAN_HTML = String.raw`<style>
*{
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
  -webkit-user-select:none;
  user-select:none;
}

body{
  margin:0;
  background:transparent;
  font-family:'Courier New',Courier,monospace;
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
  background:#000;
  border:2px solid #1919a6;
  box-shadow:0 0 25px rgba(25,25,166,0.5);
  display:flex;
  flex-direction:column;
  align-items:center;
}

.hud{
  width:100%;
  padding:10px 16px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  color:#fff;
  font-size:14px;
  font-weight:bold;
  background:#0a0a1a;
  border-bottom:2px solid #1919a6;
  z-index:10;
}

.hud span b{
  color:#ffff00;
}

.board-container{
  position:relative;
  width:380px;
  height:380px;
  margin-top:10px;
  background:#000;
  border:2px solid #1919a6;
}

canvas{
  display:block;
  background:#000;
}

.controls{
  width:100%;
  flex:1;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  position:relative;
  background:#050510;
}

.d-pad{
  position:relative;
  width:140px;
  height:140px;
}

.d-btn{
  position:absolute;
  width:44px;
  height:44px;
  background:#1919a6;
  border:2px solid #fff;
  color:#fff;
  font-size:18px;
  font-weight:bold;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:8px;
  cursor:pointer;
  box-shadow:0 0 10px rgba(25,25,166,0.8);
}

.d-btn:active{
  background:#ffb8ff;
  color:#000;
}

.btn-up{top:0;left:48px;}
.btn-left{top:48px;left:0;}
.btn-right{top:48px;right:0;}
.btn-down{bottom:0;left:48px;}

.overlay{
  position:absolute;
  z-index:30;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
  background:rgba(0,0,0,0.88);
}

.panel{
  width:100%;
  max-width:320px;
  padding:24px;
  text-align:center;
  border-radius:16px;
  background:#050515;
  border:2px solid #ffb8ff;
  box-shadow:0 0 30px rgba(255,184,255,0.3);
}

.panel h1{
  margin:0 0 10px;
  color:#ffb8ff;
  font-size:24px;
  text-shadow:0 0 10px #ff00ff;
}

.panel p{
  color:#fff;
  font-size:12px;
  line-height:1.5;
  margin:0 0 20px;
}

.start-btn{
  width:100%;
  height:45px;
  border:2px solid #ffff00;
  border-radius:10px;
  color:#000;
  background:#ffff00;
  font-weight:bold;
  font-size:14px;
  cursor:pointer;
  box-shadow:0 0 15px rgba(255,255,0,0.5);
}

.start-btn:active{
  transform:scale(0.96);
}
</style>

<div class="wrap">
  <div class="game" id="game">

    <div class="hud">
      <div>SCORE: <b id="score">0</b></div>
      <div>LIVES: <b id="lives">3</b></div>
    </div>

    <div class="board-container">
      <canvas id="canvas" width="380" height="380"></canvas>
    </div>

    <div class="controls">
      <div class="d-pad">
        <div class="d-btn btn-up" id="btn-up">▲</div>
        <div class="d-btn btn-left" id="btn-left">◀</div>
        <div class="d-btn btn-right" id="btn-right">▶</div>
        <div class="d-btn btn-down" id="btn-down">▼</div>
      </div>
    </div>

    <div class="overlay" id="overlay">
      <div class="panel">
        <h1>PAC-MAN</h1>
        <p>Coma todas as bolinhas amarelas, desvie dos fantasmas e pegue as pílulas de poder para comê-los!</p>
        <button class="start-btn" id="start-btn">JOGAR AGORA</button>
      </div>
    </div>

  </div>
</div>

<script>
(function(){
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const livesEl = document.getElementById("lives");
  const overlay = document.getElementById("overlay");
  const startBtn = document.getElementById("start-btn");

  const tileSize = 20;
  const mapCols = 19;
  const mapRows = 19;

  const originalMap = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,3,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,2,1,2,1,1,1,0,1,1,1,1],
    [2,2,2,1,0,1,2,2,2,2,2,2,2,1,0,1,2,2,2],
    [1,1,1,1,0,1,2,1,1,2,1,1,2,1,0,1,1,1,1],
    [2,2,2,2,0,2,2,1,2,2,2,1,2,2,0,2,2,2,2],
    [1,1,1,1,0,1,2,1,1,1,1,1,2,1,0,1,1,1,1],
    [2,2,2,1,0,1,2,2,2,2,2,2,2,1,0,1,2,2,2],
    [1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,3,0,1,0,0,0,0,0,2,0,0,0,0,0,1,0,3,1],
    [1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  let map = [];
  let score = 0;
  let lives = 3;
  let playing = false;
  let gameInterval = null;
  let powerTimer = null;
  let isPowered = false;

  let pacman = {
    x: 9,
    y: 13,
    dirX: 0,
    dirY: 0,
    nextDirX: 0,
    nextDirY: 0,
    mouthAngle: 0.2,
    mouthSpeed: 0.02
  };

  let ghosts = [
    { x: 9, y: 8, color: "#ff0000", dirX: 0, dirY: -1 },
    { x: 9, y: 9, color: "#ffb8ff", dirX: 0, dirY: 1 },
    { x: 8, y: 9, color: "#00ffff", dirX: -1, dirY: 0 },
    { x: 10, y: 9, color: "#ffb851", dirX: 1, dirY: 0 }
  ];

  function initGame(){
    map = JSON.parse(JSON.stringify(originalMap));
    score = 0;
    lives = 3;
    isPowered = false;
    scoreEl.textContent = score;
    livesEl.textContent = lives;
    resetPositions();
  }

  function resetPositions(){
    pacman.x = 9;
    pacman.y = 13;
    pacman.dirX = 0;
    pacman.dirY = 0;
    pacman.nextDirX = 0;
    pacman.nextDirY = 0;

    const gColors = ["#ff0000", "#ffb8ff", "#00ffff", "#ffb851"];
    ghosts = [
      { x: 9, y: 8, color: gColors[0], dirX: 0, dirY: -1 },
      { x: 9, y: 9, color: gColors[1], dirX: 0, dirY: 1 },
      { x: 8, y: 9, color: gColors[2], dirX: -1, dirY: 0 },
      { x: 10, y: 9, color: gColors[3], dirX: 1, dirY: 0 }
    ];
  }

  function checkWin(){
    for(let r=0; r<mapRows; r++){
      for(let c=0; c<mapCols; c++){
        if(map[r][c] === 0 || map[r][c] === 3) return false;
      }
    }
    return true;
  }

  function update(){
    if(pacman.nextDirX !== 0 || pacman.nextDirY !== 0){
      let nextX = pacman.x + pacman.nextDirX;
      let nextY = pacman.y + pacman.nextDirY;
      
      // Tratamento especial para o túnel lateral nas bordas
      if(nextX < 0) nextX = mapCols - 1;
      if(nextX >= mapCols) nextX = 0;

      if(nextY >= 0 && nextY < mapRows && map[nextY][nextX] !== 1){
        pacman.dirX = pacman.nextDirX;
        pacman.dirY = pacman.nextDirY;
      }
    }

    let targetX = pacman.x + pacman.dirX;
    let targetY = pacman.y + pacman.dirY;

    // Túnel lateral contínuo e seguro
    if(targetX < 0){
      targetX = mapCols - 1;
    } else if(targetX >= mapCols){
      targetX = 0;
    }

    if(targetY >= 0 && targetY < mapRows && map[targetY][targetX] !== 1){
      pacman.x = targetX;
      pacman.y = targetY;
    }

    if(map[pacman.y][pacman.x] === 0){
      map[pacman.y][pacman.x] = 2;
      score += 10;
      scoreEl.textContent = score;
    } else if(map[pacman.y][pacman.x] === 3){
      map[pacman.y][pacman.x] = 2;
      score += 50;
      scoreEl.textContent = score;
      triggerPowerPellet();
    }

    if(checkWin()){
      overlay.style.display = "flex";
      overlay.querySelector("h1").textContent = "VOCÊ VENCEU!";
      overlay.querySelector("p").innerHTML = "Parabéns! Pontuação final: <b>" + score + "</b>";
      startBtn.textContent = "JOGAR NOVAMENTE";
      playing = false;
      clearInterval(gameInterval);
      return;
    }

    ghosts.forEach(g => {
      let validDirs = [];
      const dirs = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];

      dirs.forEach(d => {
        let nx = g.x + d.x;
        let ny = g.y + d.y;
        if(nx < 0) nx = mapCols - 1;
        if(nx >= mapCols) nx = 0;
        if(ny >= 0 && ny < mapRows && map[ny][nx] !== 1){
          validDirs.push(d);
        }
      });

      let nonRetroDirs = validDirs.filter(d => d.x !== -g.dirX || d.y !== -g.dirY);
      let chosenDirs = nonRetroDirs.length > 0 ? nonRetroDirs : validDirs;

      if(chosenDirs.length > 0){
        let chosen = chosenDirs[Math.floor(Math.random() * chosenDirs.length)];
        g.dirX = chosen.x;
        g.dirY = chosen.y;
      }

      g.x += g.dirX;
      if(g.x < 0) g.x = mapCols - 1;
      if(g.x >= mapCols) g.x = 0;

      g.y += g.dirY;

      if(g.x === pacman.x && g.y === pacman.y){
        if(isPowered){
          score += 200;
          scoreEl.textContent = score;
          g.x = 9;
          g.y = 9;
        } else {
          lives--;
          livesEl.textContent = lives;
          if(lives <= 0){
            overlay.style.display = "flex";
            overlay.querySelector("h1").textContent = "GAME OVER";
            overlay.querySelector("p").innerHTML = "Você foi pego pelos fantasmas!<br>Pontuação: <b>" + score + "</b>";
            startBtn.textContent = "TENTAR NOVAMENTE";
            playing = false;
            clearInterval(gameInterval);
          } else {
            resetPositions();
          }
        }
      }
    });
  }

  function triggerPowerPellet(){
    isPowered = true;
    clearTimeout(powerTimer);
    powerTimer = setTimeout(() => {
      isPowered = false;
    }, 7000);
  }

  function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let r=0; r<mapRows; r++){
      for(let c=0; c<mapCols; c++){
        let x = c * tileSize;
        let y = r * tileSize;
        if(map[r][c] === 1){
          ctx.fillStyle = "#1919a6";
          ctx.fillRect(x, y, tileSize, tileSize);
        } else if(map[r][c] === 0){
          ctx.fillStyle = "#ffb8ae";
          ctx.beginPath();
          ctx.arc(x + tileSize/2, y + tileSize/2, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if(map[r][c] === 3){
          ctx.fillStyle = "#ffb8ae";
          ctx.beginPath();
          ctx.arc(x + tileSize/2, y + tileSize/2, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    let px = pacman.x * tileSize + tileSize/2;
    let py = pacman.y * tileSize + tileSize/2;
    ctx.fillStyle = "#ffff00";
    ctx.beginPath();

    let angle = 0;
    if(pacman.dirX === 1) angle = 0;
    if(pacman.dirX === -1) angle = Math.PI;
    if(pacman.dirY === 1) angle = Math.PI / 2;
    if(pacman.dirY === -1) angle = Math.PI * 1.5;

    pacman.mouthAngle += pacman.mouthSpeed;
    if(pacman.mouthAngle > 0.4 || pacman.mouthAngle < 0.05){
      pacman.mouthSpeed = -pacman.mouthSpeed;
    }

    ctx.arc(px, py, tileSize/2 - 2, angle + pacman.mouthAngle, angle + Math.PI * 2 - pacman.mouthAngle);
    ctx.lineTo(px, py);
    ctx.fill();

    ghosts.forEach(g => {
      let gx = g.x * tileSize + tileSize/2;
      let gy = g.y * tileSize + tileSize/2;
      ctx.fillStyle = isPowered ? "#2121ff" : g.color;
      ctx.beginPath();
      ctx.arc(gx, gy - 2, tileSize/2 - 2, Math.PI, 0, false);
      ctx.lineTo(gx + tileSize/2 - 2, gy + tileSize/2 - 2);
      ctx.lineTo(gx - tileSize/2 + 2, gy + tileSize/2 - 2);
      ctx.fill();
    });
  }

  function gameLoop(){
    update();
    if(playing) draw();
  }

  function startGame(){
    initGame();
    overlay.style.display = "none";
    playing = true;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 200);
  }

  startBtn.addEventListener("click", startGame);

  document.getElementById("btn-up").addEventListener("click", () => {
    pacman.nextDirX = 0; pacman.nextDirY = -1;
  });
  document.getElementById("btn-down").addEventListener("click", () => {
    pacman.nextDirX = 0; pacman.nextDirY = 1;
  });
  document.getElementById("btn-left").addEventListener("click", () => {
    pacman.nextDirX = -1; pacman.nextDirY = 0;
  });
  document.getElementById("btn-right").addEventListener("click", () => {
    pacman.nextDirX = 1; pacman.nextDirY = 0;
  });

  document.addEventListener("keydown", (e) => {
    if(e.key === "ArrowUp"){ pacman.nextDirX = 0; pacman.nextDirY = -1; e.preventDefault(); }
    if(e.key === "ArrowDown"){ pacman.nextDirX = 0; pacman.nextDirY = 1; e.preventDefault(); }
    if(e.key === "ArrowLeft"){ pacman.nextDirX = -1; pacman.nextDirY = 0; e.preventDefault(); }
    if(e.key === "ArrowRight"){ pacman.nextDirX = 1; pacman.nextDirY = 0; e.preventDefault(); }
  });

  initGame();
  draw();
})();
</script>`;

function executeGameScripts(container){
  const scripts = [...container.querySelectorAll("script")];

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
  id:"pacman",
  name:"Pac-Man",
  category:"Arcade",
  icon:"👻",

  init({container}){
    container.innerHTML = PACMAN_HTML;
    executeGameScripts(container);
  }
});