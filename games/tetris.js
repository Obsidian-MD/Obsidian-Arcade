import { registerGame } from "../arcade.js";

const TETRIS_HTML = String.raw`<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;}
html,body{margin:0;padding:0;width:100%;overflow:hidden;}
body{background:transparent;font-family:'Courier New',Courier,monospace;}
.wrap{width:100%;max-width:430px;margin:0 auto;padding:8px;}
.game{position:relative;width:100%;min-height:600px;border-radius:24px;background:#0a0a1a;border:2px solid #818cf8;box-shadow:0 0 25px rgba(129,140,248,0.4);display:flex;flex-direction:column;align-items:center;overflow:hidden;}
.hud{width:100%;padding:10px 14px;display:flex;justify-content:space-between;color:#fff;font-size:12px;font-weight:bold;background:#050510;border-bottom:2px solid #818cf8;}
.hud b{color:#a5b4fc;}
canvas{width:100%;max-width:220px;background:#050510;touch-action:none;}
.controls{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:8px 12px 14px;width:100%;max-width:340px;}
.ctrl-btn{padding:13px 0;border-radius:10px;border:1px solid #818cf8;background:rgba(129,140,248,0.15);color:#a5b4fc;font-weight:bold;font-size:14px;cursor:pointer;}
.ctrl-btn:active{background:rgba(129,140,248,0.4);}
.status-msg{color:rgba(255,255,255,0.5);font-size:9px;padding:0 10px 4px;text-align:center;}
.overlay{position:absolute;z-index:50;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,0.92);}
.panel{width:100%;max-width:320px;padding:22px;text-align:center;background:#050510;border:2px solid #818cf8;border-radius:16px;box-shadow:0 0 30px rgba(129,140,248,0.4);}
.panel h1{color:#a5b4fc;font-size:16px;margin:0 0 10px;}
.panel p{color:rgba(255,255,255,0.75);font-size:12px;line-height:1.5;margin:0 0 18px;}
#startBtn{width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,#818cf8,#4f46e5);color:#fff;font-family:'Courier New',Courier,monospace;font-weight:bold;font-size:13px;cursor:pointer;}
#startBtn:active{transform:scale(0.98);}
.footer-info{width:100%;padding:6px 14px 10px;color:rgba(255,255,255,0.4);font-size:9px;text-align:center;background:#050510;}
</style>
<div class="wrap"><div class="game" id="game">
  <div class="overlay" id="overlay">
    <div class="panel">
      <h1 id="overlayTitle">🧩 TETRIS</h1>
      <p id="overlayText">Encaixe as peças e complete linhas para pontuar. A velocidade aumenta a cada nível!</p>
      <button id="startBtn">INICIAR</button>
    </div>
  </div>
  <div class="hud"><span>Pontos: <b id="scoreEl">0</b></span><span>Nível: <b id="levelEl">1</b></span><span>Linhas: <b id="linesEl">0</b></span></div>
  <canvas id="canvas" width="200" height="400"></canvas>
  <div class="controls">
    <button class="ctrl-btn" id="leftBtn">◀</button>
    <button class="ctrl-btn" id="rotateBtn">🔄</button>
    <button class="ctrl-btn" id="rightBtn">▶</button>
    <button class="ctrl-btn" id="downBtn">▼</button>
  </div>
  <div class="status-msg">Use os botões pra mover, girar e descer rápido.</div>
  <div class="footer-info">Tetris • OBSIDIAN ARCADE</div>
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
  const levelEl=document.getElementById('levelEl');
  const linesEl=document.getElementById('linesEl');

  const COLS=10, ROWS=20, CELL=20;
  const COLORS={I:'#22d3ee',O:'#facc15',T:'#a855f7',S:'#4ade80',Z:'#f87171',J:'#60a5fa',L:'#fb923c'};

  const SHAPES={
    I:[[0,0],[1,0],[2,0],[3,0]],
    O:[[0,0],[1,0],[0,1],[1,1]],
    T:[[0,0],[1,0],[2,0],[1,1]],
    S:[[1,0],[2,0],[0,1],[1,1]],
    Z:[[0,0],[1,0],[1,1],[2,1]],
    J:[[0,0],[0,1],[1,1],[2,1]],
    L:[[2,0],[0,1],[1,1],[2,1]]
  };

  let grid=[];
  let current=null;
  let score=0, level=1, lines=0;
  let running=false, gameOver=false;
  let dropInterval=800;
  let lastDrop=0;
  let rafId=null;

  function emptyGrid(){
    const g=[];
    for(let r=0;r<ROWS;r++) g.push(new Array(COLS).fill(null));
    return g;
  }

  function randomPiece(){
    const keys=Object.keys(SHAPES);
    const type=keys[Math.floor(Math.random()*keys.length)];
    const cells=SHAPES[type].map(function(c){ return {x:c[0]+3, y:c[1]}; });
    return {type:type, cells:cells, color:COLORS[type]};
  }

  function collides(cells){
    return cells.some(function(c){
      if(c.x<0 || c.x>=COLS || c.y>=ROWS) return true;
      if(c.y>=0 && grid[c.y][c.x]) return true;
      return false;
    });
  }

  function mergePiece(){
    current.cells.forEach(function(c){
      if(c.y>=0) grid[c.y][c.x]=current.color;
    });
  }

  function clearLines(){
    let cleared=0;
    for(let r=ROWS-1;r>=0;r--){
      if(grid[r].every(function(cell){ return cell!==null; })){
        grid.splice(r,1);
        grid.unshift(new Array(COLS).fill(null));
        cleared++;
        r++;
      }
    }
    if(cleared>0){
      const points=[0,100,300,500,800][cleared]*level;
      score+=points;
      lines+=cleared;
      level=1+Math.floor(lines/10);
      dropInterval=Math.max(120,800-((level-1)*70));
      scoreEl.textContent=score;
      levelEl.textContent=level;
      linesEl.textContent=lines;
    }
  }

  function spawnPiece(){
    current=randomPiece();
    if(collides(current.cells)){
      endGame();
    }
  }

  function move(dx,dy){
    if(!current || gameOver) return false;
    const newCells=current.cells.map(function(c){ return {x:c.x+dx,y:c.y+dy}; });
    if(collides(newCells)) return false;
    current.cells=newCells;
    return true;
  }

  function rotate(){
    if(!current || gameOver || current.type==='O') return;
    const pivot=current.cells[1];
    const newCells=current.cells.map(function(c){
      const relX=c.x-pivot.x, relY=c.y-pivot.y;
      return {x:pivot.x-relY, y:pivot.y+relX};
    });
    if(!collides(newCells)){
      current.cells=newCells;
    }
  }

  function hardDrop(){
    if(!current || gameOver) return;
    while(move(0,1)){}
    lockPiece();
  }

  function lockPiece(){
    mergePiece();
    clearLines();
    spawnPiece();
  }

  function update(timestamp){
    if(!lastDrop) lastDrop=timestamp;
    if(timestamp-lastDrop>dropInterval){
      lastDrop=timestamp;
      if(!move(0,1)){
        lockPiece();
      }
    }
  }

  function draw(){
    ctx.fillStyle='#050510';
    ctx.fillRect(0,0,COLS*CELL,ROWS*CELL);

    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS;c++){
        if(grid[r][c]){
          ctx.fillStyle=grid[r][c];
          ctx.fillRect(c*CELL+1,r*CELL+1,CELL-2,CELL-2);
        }
      }
    }

    if(current){
      ctx.fillStyle=current.color;
      current.cells.forEach(function(c){
        if(c.y>=0) ctx.fillRect(c.x*CELL+1,c.y*CELL+1,CELL-2,CELL-2);
      });
    }

    ctx.strokeStyle='rgba(255,255,255,0.05)';
    for(let c=0;c<=COLS;c++){
      ctx.beginPath(); ctx.moveTo(c*CELL,0); ctx.lineTo(c*CELL,ROWS*CELL); ctx.stroke();
    }
    for(let r=0;r<=ROWS;r++){
      ctx.beginPath(); ctx.moveTo(0,r*CELL); ctx.lineTo(COLS*CELL,r*CELL); ctx.stroke();
    }
  }

  function loop(timestamp){
    if(!running) return;
    update(timestamp);
    draw();
    rafId=requestAnimationFrame(loop);
  }

  function endGame(){
    running=false;
    gameOver=true;
    cancelAnimationFrame(rafId);
    overlayTitle.textContent='💀 FIM DE JOGO';
    overlayText.textContent='Pontuação: '+score+'. Linhas completas: '+lines+'. Nível '+level+'.';
    startBtn.textContent='JOGAR NOVAMENTE';
    overlay.style.display='flex';
  }

  document.getElementById('leftBtn').addEventListener('click', function(){ move(-1,0); draw(); });
  document.getElementById('rightBtn').addEventListener('click', function(){ move(1,0); draw(); });
  document.getElementById('rotateBtn').addEventListener('click', function(){ rotate(); draw(); });
  document.getElementById('downBtn').addEventListener('click', function(){
    if(!move(0,1)){ lockPiece(); }
    lastDrop=performance.now();
    draw();
  });

  document.addEventListener('keydown', function(e){
    if(!running) return;
    if(e.key==='ArrowLeft'){ move(-1,0); draw(); }
    else if(e.key==='ArrowRight'){ move(1,0); draw(); }
    else if(e.key==='ArrowDown'){ if(!move(0,1)){ lockPiece(); } lastDrop=performance.now(); draw(); }
    else if(e.key==='ArrowUp'){ rotate(); draw(); }
    else if(e.key===' '){ hardDrop(); draw(); }
  });

  startBtn.addEventListener('click', function(){
    overlay.style.display='none';
    grid=emptyGrid();
    score=0; level=1; lines=0;
    dropInterval=800;
    lastDrop=0;
    scoreEl.textContent=0; levelEl.textContent=1; linesEl.textContent=0;
    gameOver=false;
    running=true;
    spawnPiece();
    rafId=requestAnimationFrame(loop);
  });

  grid=emptyGrid();
  draw();
})();
</script>`;

function executeGameScripts(container){
  const scripts=[...container.querySelectorAll("script")];

  for(const oldScript of scripts){
    const script=document.createElement("script");

    for(const attr of oldScript.attributes){
      script.setAttribute(
        attr.name,
        oldScript.getAttribute(attr.name)
      );
    }

    script.textContent=oldScript.textContent;

    oldScript.remove();
    container.appendChild(script);
  }
}

registerGame({
  id:"tetris",
  name:"Tetris",
  category:"Arcade",
  icon:"🧩",

  init({container}){
    container.innerHTML=TETRIS_HTML;
    executeGameScripts(container);
  }
});