import { registerGame } from "../arcade.js";

const CONNECT4_HTML = String.raw`<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;}
html,body{margin:0;padding:0;width:100%;min-width:0;overflow:hidden;}
body{background:transparent;font-family:'Courier New',Courier,monospace;}
.wrap{width:100%;max-width:430px;margin:0 auto;padding:8px;}
.game{position:relative;width:100%;min-height:560px;overflow:hidden;border-radius:24px;background:#0d1b2a;border:2px solid #f59e0b;box-shadow:0 0 25px rgba(245,158,11,0.4);display:flex;flex-direction:column;align-items:center;}
.hud{width:100%;min-height:48px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;gap:10px;color:#fff;font-size:12px;font-weight:bold;background:#08131f;border-bottom:2px solid #f59e0b;z-index:10;flex-shrink:0;}
.hud span b{color:#fbbf24;}
.board-wrap{width:100%;flex:1;display:flex;align-items:center;justify-content:center;padding:14px 8px;}
.board{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;width:100%;max-width:360px;background:#1d4ed8;padding:8px;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.5);}
.col{display:flex;flex-direction:column;gap:4px;cursor:pointer;}
.cell{width:100%;aspect-ratio:1/1;border-radius:50%;background:#0b1220;transition:background 0.15s;}
.cell.p1{background:radial-gradient(circle at 35% 30%,#fde68a,#f59e0b);}
.cell.p2{background:radial-gradient(circle at 35% 30%,#fca5a5,#dc2626);}
.cell.win{box-shadow:0 0 0 3px #22c55e inset;}
.col:active .cell.empty-top{background:#1e293b;}
.status-msg{width:100%;text-align:center;color:rgba(255,255,255,0.75);font-size:11px;padding:6px 10px 12px;flex-shrink:0;}
.overlay{position:absolute;z-index:50;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,0.92);}
.panel{width:100%;max-width:320px;padding:22px;text-align:center;background:#101c2c;border:2px solid #f59e0b;border-radius:16px;box-shadow:0 0 30px rgba(245,158,11,0.4);}
.panel h1{color:#fbbf24;font-size:16px;margin:0 0 10px;letter-spacing:1px;}
.panel p{color:rgba(255,255,255,0.75);font-size:12px;line-height:1.5;margin:0 0 18px;}
#startBtn{width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#08131f;font-family:'Courier New',Courier,monospace;font-weight:bold;font-size:13px;cursor:pointer;letter-spacing:1px;box-shadow:0 4px 10px rgba(245,158,11,0.4);}
#startBtn:active{transform:scale(0.98);}
.footer-info{width:100%;padding:6px 14px 10px;color:rgba(255,255,255,0.4);font-size:9px;text-align:center;background:#08131f;flex-shrink:0;}
</style>
<div class="wrap">
  <div class="game" id="game">
    <div class="overlay" id="overlay">
      <div class="panel">
        <h1 id="overlayTitle">🔴 LIGUE 4</h1>
        <p id="overlayText">Conecte 4 peças na horizontal, vertical ou diagonal antes do Bot. Toque numa coluna pra soltar sua peça!</p>
        <button id="startBtn">INICIAR PARTIDA</button>
      </div>
    </div>
    <div class="hud">
      <span>Você: <b style="color:#fbbf24">●</b></span>
      <span id="turnLabel">Sua vez</span>
      <span>Bot: <b style="color:#dc2626">●</b></span>
    </div>
    <div class="board-wrap"><div class="board" id="board"></div></div>
    <div class="status-msg" id="statusMsg">Toque em uma coluna para jogar.</div>
    <div class="footer-info">Ligue 4 • OBSIDIAN ARCADE</div>
  </div>
</div>
<script>
(function(){
  const ROWS=6, COLS=7;
  const overlay=document.getElementById('overlay');
  const overlayTitle=document.getElementById('overlayTitle');
  const overlayText=document.getElementById('overlayText');
  const startBtn=document.getElementById('startBtn');
  const boardEl=document.getElementById('board');
  const turnLabel=document.getElementById('turnLabel');
  const statusMsg=document.getElementById('statusMsg');

  let board=[];
  let turn=1;
  let gameOver=false;

  function emptyBoard(){
    const b=[];
    for(let r=0;r<ROWS;r++){ b.push(new Array(COLS).fill(0)); }
    return b;
  }

  function cloneBoard(b){ return b.map(function(row){ return row.slice(); }); }

  function lowestEmptyRow(b,col){
    for(let r=ROWS-1;r>=0;r--){ if(b[r][col]===0) return r; }
    return -1;
  }

  function drop(b,col,player){
    const r=lowestEmptyRow(b,col);
    if(r===-1) return null;
    b[r][col]=player;
    return {r:r,c:col};
  }

  function checkWinAt(b,r,c){
    const player=b[r][c];
    if(!player) return null;
    const dirs=[[0,1],[1,0],[1,1],[1,-1]];
    for(let d=0;d<dirs.length;d++){
      const dr=dirs[d][0], dc=dirs[d][1];
      const cells=[{r:r,c:c}];
      for(let s=1;s<4;s++){
        const nr=r+dr*s, nc=c+dc*s;
        if(nr<0||nr>=ROWS||nc<0||nc>=COLS||b[nr][nc]!==player) break;
        cells.push({r:nr,c:nc});
      }
      for(let s=1;s<4;s++){
        const nr=r-dr*s, nc=c-dc*s;
        if(nr<0||nr>=ROWS||nc<0||nc>=COLS||b[nr][nc]!==player) break;
        cells.push({r:nr,c:nc});
      }
      if(cells.length>=4) return cells;
    }
    return null;
  }

  function isFull(b){
    for(let c=0;c<COLS;c++){ if(b[0][c]===0) return false; }
    return true;
  }

  function evaluateWindow(cells,player){
    const opp = player===1?2:1;
    let playerCount=0, oppCount=0, emptyCount=0;
    for(let i=0;i<cells.length;i++){
      if(cells[i]===player) playerCount++;
      else if(cells[i]===opp) oppCount++;
      else emptyCount++;
    }
    if(playerCount>0 && oppCount>0) return 0;
    if(playerCount===4) return 100000;
    if(playerCount===3 && emptyCount===1) return 50;
    if(playerCount===2 && emptyCount===2) return 10;
    if(oppCount===3 && emptyCount===1) return -80;
    if(oppCount===2 && emptyCount===2) return -8;
    return 0;
  }

  function evaluateBoard(b,player){
    let score=0;
    const center=Math.floor(COLS/2);
    for(let r=0;r<ROWS;r++){ if(b[r][center]===player) score+=3; }
    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS-3;c++){
        score+=evaluateWindow([b[r][c],b[r][c+1],b[r][c+2],b[r][c+3]],player);
      }
    }
    for(let c=0;c<COLS;c++){
      for(let r=0;r<ROWS-3;r++){
        score+=evaluateWindow([b[r][c],b[r+1][c],b[r+2][c],b[r+3][c]],player);
      }
    }
    for(let r=0;r<ROWS-3;r++){
      for(let c=0;c<COLS-3;c++){
        score+=evaluateWindow([b[r][c],b[r+1][c+1],b[r+2][c+2],b[r+3][c+3]],player);
      }
    }
    for(let r=3;r<ROWS;r++){
      for(let c=0;c<COLS-3;c++){
        score+=evaluateWindow([b[r][c],b[r-1][c+1],b[r-2][c+2],b[r-3][c+3]],player);
      }
    }
    return score;
  }

  function validCols(b){
    const out=[];
    for(let c=0;c<COLS;c++){ if(b[0][c]===0) out.push(c); }
    return out;
  }

  function findWinnerBoard(b){
    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS;c++){
        if(b[r][c]!==0){
          const w=checkWinAt(b,r,c);
          if(w) return b[r][c];
        }
      }
    }
    return 0;
  }

  function minimax(b,depth,alpha,beta,maximizing){
    const cols=validCols(b);
    const winner=findWinnerBoard(b);
    if(winner===2) return {score:1000000+depth};
    if(winner===1) return {score:-1000000-depth};
    if(cols.length===0 || depth===0){
      return {score: evaluateBoard(b,2)};
    }
    if(maximizing){
      let best={score:-Infinity, col:cols[0]};
      for(let i=0;i<cols.length;i++){
        const nb=cloneBoard(b);
        drop(nb,cols[i],2);
        const res=minimax(nb,depth-1,alpha,beta,false);
        if(res.score>best.score){ best={score:res.score, col:cols[i]}; }
        alpha=Math.max(alpha,res.score);
        if(alpha>=beta) break;
      }
      return best;
    } else {
      let best={score:Infinity, col:cols[0]};
      for(let i=0;i<cols.length;i++){
        const nb=cloneBoard(b);
        drop(nb,cols[i],1);
        const res=minimax(nb,depth-1,alpha,beta,true);
        if(res.score<best.score){ best={score:res.score, col:cols[i]}; }
        beta=Math.min(beta,res.score);
        if(alpha>=beta) break;
      }
      return best;
    }
  }

  function render(winCells){
    boardEl.innerHTML='';
    for(let c=0;c<COLS;c++){
      const colEl=document.createElement('div');
      colEl.className='col';
      for(let r=0;r<ROWS;r++){
        const cellEl=document.createElement('div');
        const v=board[r][c];
        cellEl.className='cell'+(v===1?' p1':v===2?' p2':'');
        if(winCells && winCells.some(function(wc){ return wc.r===r && wc.c===c; })){
          cellEl.className+=' win';
        }
        colEl.appendChild(cellEl);
      }
      colEl.addEventListener('click', function(){ onColClick(c); });
      boardEl.appendChild(colEl);
    }
  }

  function onColClick(col){
    if(gameOver || turn!==1) return;
    const pos=drop(board,col,1);
    if(!pos) return;
    render();
    const win=checkWinAt(board,pos.r,pos.c);
    if(win){ finish(1,win); return; }
    if(isFull(board)){ finish(0); return; }
    turn=2;
    turnLabel.textContent='Vez do Bot';
    statusMsg.textContent='Bot pensando...';
    setTimeout(botMove, 500);
  }

  function botMove(){
    if(gameOver) return;
    const result=minimax(board,5,-Infinity,Infinity,true);
    const pos=drop(board,result.col,2);
    render();
    if(pos){
      const win=checkWinAt(board,pos.r,pos.c);
      if(win){ finish(2,win); return; }
    }
    if(isFull(board)){ finish(0); return; }
    turn=1;
    turnLabel.textContent='Sua vez';
    statusMsg.textContent='Toque em uma coluna para jogar.';
  }

  function finish(winner,winCells){
    gameOver=true;
    render(winCells);
    let title,text;
    if(winner===1){ title='🏆 VOCÊ VENCEU!'; text='Você conectou 4 peças antes do bot!'; }
    else if(winner===2){ title='💀 O BOT VENCEU!'; text='O bot conseguiu conectar 4 peças primeiro.'; }
    else { title='🤝 EMPATE!'; text='O tabuleiro encheu sem ninguém vencer.'; }
    overlayTitle.textContent=title;
    overlayText.textContent=text;
    startBtn.textContent='JOGAR NOVAMENTE';
    overlay.style.display='flex';
  }

  startBtn.addEventListener('click', function(){
    overlay.style.display='none';
    board=emptyBoard();
    turn=1;
    gameOver=false;
    turnLabel.textContent='Sua vez';
    statusMsg.textContent='Toque em uma coluna para jogar.';
    render();
  });

  board=emptyBoard();
  render();
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
  id:"ligue4",
  name:"Ligue 4",
  category:"Tabuleiro",
  icon:"🔴",

  init({container}){
    container.innerHTML=CONNECT4_HTML;
    executeGameScripts(container);
  }
});