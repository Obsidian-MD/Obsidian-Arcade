import { registerGame } from "../arcade.js";

export const MINESWEEPER_HTML = String.raw`<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;}
html,body{margin:0;padding:0;width:100%;min-width:0;overflow:hidden;}
body{background:transparent;font-family:'Courier New',Courier,monospace;}
.wrap{width:100%;max-width:430px;margin:0 auto;padding:8px;}
.game{position:relative;width:100%;min-height:560px;overflow:hidden;border-radius:24px;background:#1c1917;border:2px solid #78716c;box-shadow:0 0 25px rgba(120,113,108,0.4);display:flex;flex-direction:column;align-items:center;}
.hud{width:100%;min-height:48px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;gap:10px;color:#fff;font-size:12px;font-weight:bold;background:#0c0a09;border-bottom:2px solid #78716c;z-index:10;flex-shrink:0;}
.hud span b{color:#fbbf24;}
.mode-row{display:flex;gap:8px;padding:8px 12px;flex-shrink:0;}
.mode-btn{flex:1;padding:8px;border-radius:8px;border:1px solid #78716c;background:rgba(120,113,108,0.15);color:#d6d3d1;font-size:11px;font-weight:bold;cursor:pointer;}
.mode-btn.active{background:#f59e0b;color:#1c1917;border-color:#f59e0b;}
.board-wrap{width:100%;flex:1;display:flex;align-items:center;justify-content:center;padding:6px 8px;}
.board{display:grid;gap:2px;background:#44403c;padding:6px;border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,0.5);}
.cell{width:100%;height:100%;aspect-ratio:1/1;background:#78716c;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;}
.cell.revealed{background:#292524;}
.cell.flag{background:#78716c;}
.cell.mine{background:#dc2626;}
.status-msg{width:100%;text-align:center;color:rgba(255,255,255,0.55);font-size:10px;padding:6px 10px 12px;flex-shrink:0;}
.overlay{position:absolute;z-index:50;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,0.92);}
.panel{width:100%;max-width:320px;padding:22px;text-align:center;background:#1c1917;border:2px solid #78716c;border-radius:16px;box-shadow:0 0 30px rgba(120,113,108,0.4);}
.panel h1{color:#fbbf24;font-size:16px;margin:0 0 10px;letter-spacing:1px;}
.panel p{color:rgba(255,255,255,0.75);font-size:12px;line-height:1.5;margin:0 0 18px;}
#startBtn{width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#b45309);color:#1c1917;font-family:'Courier New',Courier,monospace;font-weight:bold;font-size:13px;cursor:pointer;letter-spacing:1px;box-shadow:0 4px 10px rgba(245,158,11,0.4);}
#startBtn:active{transform:scale(0.98);}
.footer-info{width:100%;padding:6px 14px 10px;color:rgba(255,255,255,0.4);font-size:9px;text-align:center;background:#0c0a09;flex-shrink:0;}
</style>
<div class="wrap">
  <div class="game" id="game">
    <div class="overlay" id="overlay">
      <div class="panel">
        <h1 id="overlayTitle">💣 CAMPO MINADO</h1>
        <p id="overlayText">Tabuleiro 9x9 com 10 minas. Toque para revelar, use o modo bandeira para marcar onde acha que tem mina.</p>
        <button id="startBtn">INICIAR PARTIDA</button>
      </div>
    </div>
    <div class="hud">
      <span>💣 <b id="minesLeft">10</b></span>
      <span id="timerLabel">⏱ <b id="timerVal">0</b>s</span>
    </div>
    <div class="mode-row">
      <button class="mode-btn active" id="revealMode">🔍 Revelar</button>
      <button class="mode-btn" id="flagMode">🚩 Bandeira</button>
    </div>
    <div class="board-wrap"><div class="board" id="board"></div></div>
    <div class="status-msg" id="statusMsg">Toque em uma célula para começar.</div>
    <div class="footer-info">Campo Minado • OBSIDIAN ARCADE</div>
  </div>
</div>
<script>
(function(){
  const SIZE=9, MINES=10;
  const overlay=document.getElementById('overlay');
  const overlayTitle=document.getElementById('overlayTitle');
  const overlayText=document.getElementById('overlayText');
  const startBtn=document.getElementById('startBtn');
  const boardEl=document.getElementById('board');
  const minesLeftEl=document.getElementById('minesLeft');
  const timerVal=document.getElementById('timerVal');
  const statusMsg=document.getElementById('statusMsg');
  const revealModeBtn=document.getElementById('revealMode');
  const flagModeBtn=document.getElementById('flagMode');

  let grid=[];
  let revealed=[];
  let flagged=[];
  let firstClick=true;
  let gameOver=false;
  let flagMode=false;
  let timer=0;
  let timerInterval=null;

  boardEl.style.gridTemplateColumns='repeat('+SIZE+',1fr)';
  boardEl.style.width='min(100%,340px)';

  function emptyMatrix(fillVal){
    const g=[];
    for(let r=0;r<SIZE;r++) g.push(new Array(SIZE).fill(fillVal));
    return g;
  }

  function neighbors(r,c){
    const out=[];
    for(let dr=-1;dr<=1;dr++){
      for(let dc=-1;dc<=1;dc++){
        if(dr===0 && dc===0) continue;
        const nr=r+dr, nc=c+dc;
        if(nr>=0 && nr<SIZE && nc>=0 && nc<SIZE) out.push({r:nr,c:nc});
      }
    }
    return out;
  }

  function placeMines(avoidR,avoidC){
    grid=emptyMatrix(0);
    let placed=0;
    while(placed<MINES){
      const r=Math.floor(Math.random()*SIZE);
      const c=Math.floor(Math.random()*SIZE);
      const isAvoidZone=Math.abs(r-avoidR)<=1 && Math.abs(c-avoidC)<=1;
      if(grid[r][c]===-1 || isAvoidZone) continue;
      grid[r][c]=-1;
      placed++;
    }
    for(let r=0;r<SIZE;r++){
      for(let c=0;c<SIZE;c++){
        if(grid[r][c]===-1) continue;
        let count=0;
        neighbors(r,c).forEach(function(n){ if(grid[n.r][n.c]===-1) count++; });
        grid[r][c]=count;
      }
    }
  }

  function floodReveal(r,c){
    if(revealed[r][c] || flagged[r][c]) return;
    revealed[r][c]=true;
    if(grid[r][c]===0){
      neighbors(r,c).forEach(function(n){ floodReveal(n.r,n.c); });
    }
  }

  function countFlags(){
    let n=0;
    for(let r=0;r<SIZE;r++) for(let c=0;c<SIZE;c++) if(flagged[r][c]) n++;
    return n;
  }

  function checkWin(){
    for(let r=0;r<SIZE;r++){
      for(let c=0;c<SIZE;c++){
        if(grid[r][c]!==-1 && !revealed[r][c]) return false;
      }
    }
    return true;
  }

  function startTimer(){
    stopTimer();
    timer=0;
    timerVal.textContent=timer;
    timerInterval=setInterval(function(){
      timer++;
      timerVal.textContent=timer;
    },1000);
  }

  function stopTimer(){
    if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
  }

  function onCellClick(r,c){
    if(gameOver) return;

    if(flagMode){
      if(revealed[r][c]) return;
      flagged[r][c]=!flagged[r][c];
      render();
      return;
    }

    if(flagged[r][c]) return;

    if(firstClick){
      placeMines(r,c);
      revealed=emptyMatrix(false);
      firstClick=false;
      startTimer();
      statusMsg.textContent='Boa sorte!';
    }

    if(grid[r][c]===-1){
      revealed[r][c]=true;
      gameOver=true;
      stopTimer();
      render(true);
      finish(false);
      return;
    }

    floodReveal(r,c);
    render();

    if(checkWin()){
      gameOver=true;
      stopTimer();
      finish(true);
    }
  }

  function finish(won){
    overlayTitle.textContent = won ? '🏆 VOCÊ VENCEU!' : '💥 BOOM! VOCÊ PERDEU!';
    overlayText.textContent = won
      ? 'Você limpou o campo em '+timer+' segundos, sem pisar em nenhuma mina!'
      : 'Você pisou em uma mina. Tente de novo!';
    startBtn.textContent='JOGAR NOVAMENTE';
    overlay.style.display='flex';
  }

  function render(revealMines){
    minesLeftEl.textContent=Math.max(0,MINES-countFlags());
    boardEl.innerHTML='';
    const numColors=['','#60a5fa','#4ade80','#f87171','#a78bfa','#fbbf24','#22d3ee','#fff','#94a3b8'];
    for(let r=0;r<SIZE;r++){
      for(let c=0;c<SIZE;c++){
        const cell=document.createElement('div');
        cell.className='cell';
        const isMine=grid.length && grid[r] && grid[r][c]===-1;
        if(revealed[r] && revealed[r][c]){
          cell.className+=' revealed';
          if(isMine){
            cell.className+=' mine';
            cell.textContent='💣';
          } else if(grid[r][c]>0){
            cell.textContent=grid[r][c];
            cell.style.color=numColors[grid[r][c]];
          }
        } else if(flagged[r] && flagged[r][c]){
          cell.className+=' flag';
          cell.textContent='🚩';
        } else if(revealMines && isMine){
          cell.className+=' mine';
          cell.textContent='💣';
        }
        cell.addEventListener('click', function(){ onCellClick(r,c); });
        boardEl.appendChild(cell);
      }
    }
  }

  revealModeBtn.addEventListener('click', function(){
    flagMode=false;
    revealModeBtn.classList.add('active');
    flagModeBtn.classList.remove('active');
  });

  flagModeBtn.addEventListener('click', function(){
    flagMode=true;
    flagModeBtn.classList.add('active');
    revealModeBtn.classList.remove('active');
  });

  function setup(){
    grid=emptyMatrix(0);
    revealed=emptyMatrix(false);
    flagged=emptyMatrix(false);
    firstClick=true;
    gameOver=false;
    flagMode=false;
    revealModeBtn.classList.add('active');
    flagModeBtn.classList.remove('active');
    stopTimer();
    timer=0;
    timerVal.textContent=0;
    minesLeftEl.textContent=MINES;
    statusMsg.textContent='Toque em uma célula para começar.';
    render();
  }

  startBtn.addEventListener('click', function(){
    overlay.style.display='none';
    setup();
  });

  setup();
})();
</script>`;

function executeGameScripts(container){
  const scripts=[...container.querySelectorAll("script")];

  for(const oldScript of scripts){
    const script=document.createElement("script");

    for(const attr of oldScript.attributes){
      script.setAttribute(attr.name,attr.value);
    }

    script.textContent=oldScript.textContent;

    oldScript.remove();

    container.appendChild(script);
  }
}

registerGame({
  id:"campominado",
  name:"Campo Minado",
  category:"Puzzle",
  icon:"💣",

  init({container}){
    container.innerHTML=MINESWEEPER_HTML;
    executeGameScripts(container);
  }
});