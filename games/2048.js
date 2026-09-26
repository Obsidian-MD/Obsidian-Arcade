import { registerGame } from "../arcade.js";

const G2048_HTML = String.raw`<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;}
html,body{margin:0;padding:0;width:100%;min-width:0;overflow:hidden;}
body{background:transparent;font-family:'Courier New',Courier,monospace;}
.wrap{width:100%;max-width:430px;margin:0 auto;padding:8px;}
.game{position:relative;width:100%;min-height:560px;overflow:hidden;border-radius:24px;background:#1a1a2e;border:2px solid #a855f7;box-shadow:0 0 25px rgba(168,85,247,0.4);display:flex;flex-direction:column;align-items:center;}
.hud{width:100%;min-height:48px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;gap:10px;color:#fff;font-size:12px;font-weight:bold;background:#12121f;border-bottom:2px solid #a855f7;z-index:10;flex-shrink:0;}
.hud span b{color:#c084fc;}
.board-wrap{width:100%;flex:1;display:flex;align-items:center;justify-content:center;padding:14px 8px;touch-action:none;}
.board{position:relative;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(4,1fr);gap:8px;width:100%;max-width:340px;aspect-ratio:1/1;background:#0f0f1e;padding:8px;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.5);}
.tile-bg{border-radius:8px;background:rgba(255,255,255,0.06);}
.tile{position:absolute;display:flex;align-items:center;justify-content:center;border-radius:8px;font-weight:bold;transition:top 0.12s ease,left 0.12s ease,transform 0.12s ease;}
.controls{display:grid;grid-template-columns:repeat(3,48px);grid-template-rows:repeat(2,40px);gap:4px;justify-content:center;padding:6px 0 14px;}
.ctrl-btn{border:1px solid #a855f7;background:rgba(168,85,247,0.15);color:#c084fc;border-radius:8px;font-size:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;}
.ctrl-btn:active{background:rgba(168,85,247,0.4);}
.status-msg{width:100%;text-align:center;color:rgba(255,255,255,0.55);font-size:10px;padding:0 10px 6px;flex-shrink:0;}
.overlay{position:absolute;z-index:50;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,0.92);}
.panel{width:100%;max-width:320px;padding:22px;text-align:center;background:#1a1a2e;border:2px solid #a855f7;border-radius:16px;box-shadow:0 0 30px rgba(168,85,247,0.4);}
.panel h1{color:#c084fc;font-size:16px;margin:0 0 10px;letter-spacing:1px;}
.panel p{color:rgba(255,255,255,0.75);font-size:12px;line-height:1.5;margin:0 0 18px;}
#startBtn{width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,#a855f7,#7e22ce);color:#fff;font-family:'Courier New',Courier,monospace;font-weight:bold;font-size:13px;cursor:pointer;letter-spacing:1px;box-shadow:0 4px 10px rgba(168,85,247,0.4);}
#startBtn:active{transform:scale(0.98);}
.footer-info{width:100%;padding:6px 14px 10px;color:rgba(255,255,255,0.4);font-size:9px;text-align:center;background:#12121f;flex-shrink:0;}
</style>
<div class="wrap">
  <div class="game" id="game">
    <div class="overlay" id="overlay">
      <div class="panel">
        <h1 id="overlayTitle">🔢 2048</h1>
        <p id="overlayText">Deslize (ou use as setas) para juntar os números iguais. Chegue ao 2048 antes que o tabuleiro encha!</p>
        <button id="startBtn">INICIAR PARTIDA</button>
      </div>
    </div>
    <div class="hud">
      <span>Pontos: <b id="scoreEl">0</b></span>
      <span>Recorde: <b id="bestEl">0</b></span>
    </div>
    <div class="board-wrap" id="boardWrap"><div class="board" id="board"></div></div>
    <div class="controls">
      <div></div><button class="ctrl-btn" id="upBtn">▲</button><div></div>
      <button class="ctrl-btn" id="leftBtn">◀</button><button class="ctrl-btn" id="downBtn">▼</button><button class="ctrl-btn" id="rightBtn">▶</button>
    </div>
    <div class="status-msg">Deslize no tabuleiro ou use as setas para jogar.</div>
    <div class="footer-info">2048 • OBSIDIAN ARCADE</div>
  </div>
</div>
<script>
(function(){
  const SIZE=4;
  const overlay=document.getElementById('overlay');
  const overlayTitle=document.getElementById('overlayTitle');
  const overlayText=document.getElementById('overlayText');
  const startBtn=document.getElementById('startBtn');
  const boardEl=document.getElementById('board');
  const boardWrap=document.getElementById('boardWrap');
  const scoreEl=document.getElementById('scoreEl');
  const bestEl=document.getElementById('bestEl');

  let grid=[];
  let score=0;
  let best=0;
  let gameOver=false;
  let cellSize=0, gap=8;

  const COLORS={
    2:'#eee4da',4:'#ede0c8',8:'#f2b179',16:'#f59563',32:'#f67c5f',64:'#f65e3b',
    128:'#edcf72',256:'#edcc61',512:'#edc850',1024:'#edc53f',2048:'#edc22e'
  };

  function emptyGrid(){
    const g=[];
    for(let r=0;r<SIZE;r++) g.push(new Array(SIZE).fill(0));
    return g;
  }

  function emptyCells(g){
    const out=[];
    for(let r=0;r<SIZE;r++) for(let c=0;c<SIZE;c++) if(g[r][c]===0) out.push({r,c});
    return out;
  }

  function addRandomTile(g){
    const cells=emptyCells(g);
    if(cells.length===0) return;
    const cell=cells[Math.floor(Math.random()*cells.length)];
    g[cell.r][cell.c]=Math.random()<0.9?2:4;
  }

  function cloneGrid(g){ return g.map(function(row){ return row.slice(); }); }

  function gridsEqual(a,b){
    for(let r=0;r<SIZE;r++) for(let c=0;c<SIZE;c++) if(a[r][c]!==b[r][c]) return false;
    return true;
  }

  function slideRowLeft(row){
    let vals=row.filter(function(v){ return v!==0; });
    let gained=0;
    for(let i=0;i<vals.length-1;i++){
      if(vals[i]===vals[i+1]){
        vals[i]*=2;
        gained+=vals[i];
        vals.splice(i+1,1);
      }
    }
    while(vals.length<SIZE) vals.push(0);
    return {row:vals, gained:gained};
  }

  function move(direction){
    if(gameOver) return;
    let moved=false;
    let gainedTotal=0;
    const before=cloneGrid(grid);

    function getLine(i,dir){
      const line=[];
      for(let k=0;k<SIZE;k++){
        if(dir==='left') line.push(grid[i][k]);
        else if(dir==='right') line.push(grid[i][SIZE-1-k]);
        else if(dir==='up') line.push(grid[k][i]);
        else line.push(grid[SIZE-1-k][i]);
      }
      return line;
    }

    function setLine(i,dir,line){
      for(let k=0;k<SIZE;k++){
        if(dir==='left') grid[i][k]=line[k];
        else if(dir==='right') grid[i][SIZE-1-k]=line[k];
        else if(dir==='up') grid[k][i]=line[k];
        else grid[SIZE-1-k][i]=line[k];
      }
    }

    for(let i=0;i<SIZE;i++){
      const line=getLine(i,direction);
      const result=slideRowLeft(line);
      setLine(i,direction,result.row);
      gainedTotal+=result.gained;
    }

    moved=!gridsEqual(before,grid);

    if(moved){
      score+=gainedTotal;

      if(score>best){
        best=score;
      }

      addRandomTile(grid);
      render();
      checkGameOver();
    }
  }

  function canMove(g){
    if(emptyCells(g).length>0) return true;

    for(let r=0;r<SIZE;r++){
      for(let c=0;c<SIZE;c++){
        const v=g[r][c];

        if(c<SIZE-1 && g[r][c+1]===v) return true;
        if(r<SIZE-1 && g[r+1][c]===v) return true;
      }
    }

    return false;
  }

  function hasWon(g){
    for(let r=0;r<SIZE;r++){
      for(let c=0;c<SIZE;c++){
        if(g[r][c]>=2048) return true;
      }
    }

    return false;
  }

  function checkGameOver(){
    if(hasWon(grid)){
      finish(
        true,
        '🏆 VOCÊ VENCEU!',
        'Você chegou ao 2048! Pode continuar jogando ou reiniciar.',
        true
      );
      return;
    }

    if(!canMove(grid)){
      finish(
        false,
        '💀 FIM DE JOGO',
        'O tabuleiro encheu e não há mais jogadas possíveis.',
        false
      );
    }
  }

  function finish(won,title,text,allowContinue){
    if(!allowContinue) gameOver=true;

    overlayTitle.textContent=title;
    overlayText.textContent=text+' Pontuação final: '+score+'.';
    startBtn.textContent=allowContinue?'CONTINUAR JOGANDO':'JOGAR NOVAMENTE';
    overlay.style.display='flex';
    overlay.dataset.continue=allowContinue?'1':'0';
  }

  function render(){
    scoreEl.textContent=score;
    bestEl.textContent=best;

    boardEl.innerHTML='';

    for(let i=0;i<SIZE*SIZE;i++){
      const bg=document.createElement('div');
      bg.className='tile-bg';
      boardEl.appendChild(bg);
    }

    const rect=boardEl.getBoundingClientRect();
    cellSize=(rect.width-gap*(SIZE+1))/SIZE;

    for(let r=0;r<SIZE;r++){
      for(let c=0;c<SIZE;c++){
        const v=grid[r][c];

        if(v===0) continue;

        const tile=document.createElement('div');

        tile.className='tile';
        tile.style.width=cellSize+'px';
        tile.style.height=cellSize+'px';
        tile.style.left=(gap+c*(cellSize+gap))+'px';
        tile.style.top=(gap+r*(cellSize+gap))+'px';
        tile.style.background=COLORS[v]||'#3b0764';
        tile.style.color=v<=4?'#5b4636':'#fff';
        tile.style.fontSize=(v>=1024?cellSize*0.28:cellSize*0.36)+'px';
        tile.textContent=v;

        boardEl.appendChild(tile);
      }
    }
  }

  document.getElementById('upBtn').addEventListener('click',function(){
    move('up');
  });

  document.getElementById('downBtn').addEventListener('click',function(){
    move('down');
  });

  document.getElementById('leftBtn').addEventListener('click',function(){
    move('left');
  });

  document.getElementById('rightBtn').addEventListener('click',function(){
    move('right');
  });

  let touchStartX=0, touchStartY=0;

  boardWrap.addEventListener('touchstart',function(e){
    touchStartX=e.touches[0].clientX;
    touchStartY=e.touches[0].clientY;
  },{passive:true});

  boardWrap.addEventListener('touchend',function(e){
    const dx=e.changedTouches[0].clientX-touchStartX;
    const dy=e.changedTouches[0].clientY-touchStartY;

    if(Math.abs(dx)<20 && Math.abs(dy)<20) return;

    if(Math.abs(dx)>Math.abs(dy)){
      move(dx>0?'right':'left');
    }else{
      move(dy>0?'down':'up');
    }
  },{passive:true});

  document.addEventListener('keydown',function(e){
    if(e.key==='ArrowUp') move('up');
    else if(e.key==='ArrowDown') move('down');
    else if(e.key==='ArrowLeft') move('left');
    else if(e.key==='ArrowRight') move('right');
  });

  startBtn.addEventListener('click',function(){
    if(overlay.dataset.continue==='1'){
      overlay.style.display='none';
      return;
    }

    overlay.style.display='none';

    grid=emptyGrid();
    score=0;
    gameOver=false;

    addRandomTile(grid);
    addRandomTile(grid);

    render();
  });

  grid=emptyGrid();
  render();
})();
</script>`;

function executeGameScripts(container){
  const scripts=[...container.querySelectorAll('script')];

  for(const oldScript of scripts){
    const script=document.createElement('script');

    for(const attr of oldScript.attributes){
      script.setAttribute(attr.name,attr.value);
    }

    script.textContent=oldScript.textContent;
    oldScript.remove();
    container.appendChild(script);
  }
}

registerGame({
  id:"2048",
  name:"2048",
  category:"Puzzle",
  icon:"🔢",

  init({container}){
    container.innerHTML=G2048_HTML;
    executeGameScripts(container);
  }
});