import { registerGame } from "../arcade.js";

const GAMAO_HTML = String.raw`<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;}
html,body{margin:0;padding:0;width:100%;overflow:hidden;}
body{background:transparent;font-family:'Courier New',Courier,monospace;}
.wrap{width:100%;max-width:430px;margin:0 auto;padding:8px;}
.game{position:relative;width:100%;min-height:600px;border-radius:24px;background:#2c1810;border:2px solid #d97706;box-shadow:0 0 25px rgba(217,119,6,0.4);display:flex;flex-direction:column;align-items:center;overflow:hidden;}
.hud{width:100%;padding:10px 14px;display:flex;justify-content:space-between;color:#fff;font-size:11px;font-weight:bold;background:#1c0f08;border-bottom:2px solid #d97706;flex-wrap:wrap;gap:4px;}
.hud b{color:#fbbf24;}
.board-wrap{width:100%;flex:1;padding:8px;display:flex;align-items:center;justify-content:center;}
.board{position:relative;width:100%;max-width:380px;aspect-ratio:1.5/1;background:#5c3a21;border:3px solid #78350f;border-radius:8px;display:flex;}
.half{flex:1;display:flex;flex-direction:column;position:relative;}
.half.left{border-right:4px solid #78350f;}
.quad{flex:1;display:flex;justify-content:space-around;padding:2px;position:relative;}
.point{width:11%;height:100%;display:flex;flex-direction:column;align-items:center;cursor:pointer;position:relative;}
.point.top{justify-content:flex-start;}
.point.bottom{justify-content:flex-end;}
.tri{position:absolute;width:100%;height:82%;top:0;clip-path:polygon(0 0,100% 0,50% 100%);}
.point.bottom .tri{top:auto;bottom:0;clip-path:polygon(50% 0,0 100%,100% 100%);}
.tri.light{background:rgba(217,119,6,0.35);}
.tri.dark{background:rgba(120,53,15,0.5);}
.point.highlight .tri{background:rgba(74,222,128,0.5);}
.checker{width:80%;aspect-ratio:1/1;border-radius:50%;margin:1px auto;box-shadow:0 2px 3px rgba(0,0,0,0.6);z-index:2;position:relative;}
.checker.white{background:radial-gradient(circle at 35% 30%,#fefce8,#d4d4d8);}
.checker.black{background:radial-gradient(circle at 35% 30%,#57534e,#0c0a09);}
.checker-count{position:absolute;bottom:2px;left:50%;transform:translateX(-50%);color:#fff;font-size:8px;font-weight:bold;z-index:3;text-shadow:0 0 3px #000;}
.bar{width:6%;display:flex;flex-direction:column;justify-content:space-between;align-items:center;background:#78350f;}
.dice-row{display:flex;gap:10px;justify-content:center;padding:10px;align-items:center;}
.die{width:36px;height:36px;background:#fefce8;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:bold;color:#1c0f08;box-shadow:0 2px 4px rgba(0,0,0,0.5);}
.die.used{opacity:0.3;}
.action-row{display:flex;gap:8px;padding:6px 12px 14px;width:100%;max-width:340px;}
.action-btn{flex:1;padding:11px 6px;border-radius:10px;border:1px solid #fbbf24;background:rgba(251,191,36,0.15);color:#fbbf24;font-family:'Courier New',Courier,monospace;font-weight:bold;font-size:11px;cursor:pointer;}
.action-btn:disabled{opacity:0.3;pointer-events:none;}
.status-msg{color:rgba(255,255,255,0.6);font-size:10px;padding:0 10px 6px;text-align:center;}
.overlay{position:absolute;z-index:50;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,0.92);}
.panel{width:100%;max-width:320px;padding:22px;text-align:center;background:#2c1810;border:2px solid #d97706;border-radius:16px;box-shadow:0 0 30px rgba(217,119,6,0.4);}
.panel h1{color:#fbbf24;font-size:16px;margin:0 0 10px;}
.panel p{color:rgba(255,255,255,0.75);font-size:12px;line-height:1.5;margin:0 0 18px;}
#startBtn{width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,#d97706,#92400e);color:#fff;font-family:'Courier New',Courier,monospace;font-weight:bold;font-size:13px;cursor:pointer;}
#startBtn:active{transform:scale(0.98);}
.footer-info{width:100%;padding:6px 14px 10px;color:rgba(255,255,255,0.4);font-size:9px;text-align:center;background:#1c0f08;}
</style>
<div class="wrap"><div class="game" id="game">
  <div class="overlay" id="overlay">
    <div class="panel">
      <h1 id="overlayTitle">🎲 GAMÃO</h1>
      <p id="overlayText">Leve todas as suas 15 peças brancas até a última casa e retire-as antes do bot (pretas). Role os dados e toque numa peça pra mover.</p>
      <button id="startBtn">INICIAR PARTIDA</button>
    </div>
  </div>
  <div class="hud"><span>Você ⚪: <b id="myHomeEl">0</b>/15</span><span id="turnLabel">Sua vez</span><span>Bot ⚫: <b id="botHomeEl">0</b>/15</span></div>
  <div class="dice-row" id="diceRow"></div>
  <div class="board-wrap"><div class="board" id="board"></div></div>
  <div class="status-msg" id="statusMsg">Toque em "Rolar Dados" para começar.</div>
  <div class="action-row">
    <button class="action-btn" id="rollBtn">🎲 ROLAR DADOS</button>
    <button class="action-btn" id="endTurnBtn">PASSAR VEZ</button>
  </div>
  <div class="footer-info">Gamão • OBSIDIAN ARCADE</div>
</div></div>
<script>
(function(){
  const overlay=document.getElementById('overlay');
  const overlayTitle=document.getElementById('overlayTitle');
  const overlayText=document.getElementById('overlayText');
  const startBtn=document.getElementById('startBtn');
  const boardEl=document.getElementById('board');
  const diceRow=document.getElementById('diceRow');
  const myHomeEl=document.getElementById('myHomeEl');
  const botHomeEl=document.getElementById('botHomeEl');
  const turnLabel=document.getElementById('turnLabel');
  const statusMsg=document.getElementById('statusMsg');
  const rollBtn=document.getElementById('rollBtn');
  const endTurnBtn=document.getElementById('endTurnBtn');

  // Points 0..23. Player (white) moves from 0 -> 23 -> bear off.
  // Bot (black) moves from 23 -> 0 -> bear off.
  // points[i] = {white: n, black: n}
  const WHITE='white', BLACK='black';
  let points=[];
  let bar={white:0, black:0};
  let home={white:0, black:0};
  let dice=[];
  let diceUsed=[];
  let turn=WHITE;
  let gameOver=false;
  let selectedPoint=-1;

  function setupBoard(){
    points=new Array(24).fill(null).map(function(){ return {white:0, black:0}; });
    points[0]={white:2, black:0};
    points[11]={white:5, black:0};
    points[16]={white:3, black:0};
    points[18]={white:5, black:0};
    points[23]={white:0, black:2};
    points[12]={white:0, black:5};
    points[7]={white:0, black:3};
    points[5]={white:0, black:5};
    bar={white:0, black:0};
    home={white:0, black:0};
  }

  function opponent(p){ return p===WHITE?BLACK:WHITE; }
  function direction(p){ return p===WHITE?1:-1; }

  function rollDice(){
    const d1=1+Math.floor(Math.random()*6);
    const d2=1+Math.floor(Math.random()*6);
    if(d1===d2){ dice=[d1,d1,d1,d1]; }
    else { dice=[d1,d2]; }
    diceUsed=dice.map(function(){ return false; });
  }

  function pointOwner(i){
    if(points[i].white>0 && points[i].black>0) return null;
    if(points[i].white>0) return WHITE;
    if(points[i].black>0) return BLACK;
    return null;
  }

  function canLandOn(i, player){
    if(i<0||i>23) return false;
    const owner=pointOwner(i);
    if(owner===null) return true;
    if(owner===player) return true;
    return points[i][opponent(player)]===1;
  }

  function allCheckersHome(player){
    const range = player===WHITE ? [18,23] : [0,5];
    for(let i=0;i<24;i++){
      if(points[i][player]>0 && (i<range[0]||i>range[1])) return false;
    }
    return bar[player]===0;
  }

  function getMovableDice(player){
    return dice.filter(function(d,i){ return !diceUsed[i]; });
  }

  function possibleMovesFromPoint(from, player, die){
    if(bar[player]>0 && from!==-1) return null;
    const dir=direction(player);
    if(from===-1){
      const entry = player===WHITE ? (die-1) : (24-die);
      if(canLandOn(entry, player)) return entry;
      return null;
    }
    const dest=from+dir*die;
    if(dest<0 || dest>23){
      if(allCheckersHome(player)){
        const isExact = player===WHITE ? dest===24 : dest===-1;
        const isOver = player===WHITE ? dest>24 : dest<-1;
        let furthestOk=true;
        if(!isExact){
          const range = player===WHITE ? [18,23] : [0,5];
          for(let i = player===WHITE?18:5; player===WHITE ? i<from : i>from; player===WHITE?i++:i--){
            if(points[i][player]>0){ furthestOk=false; break; }
          }
        }
        if(isExact || (isOver && furthestOk)) return 'bearoff';
      }
      return null;
    }
    if(canLandOn(dest, player)) return dest;
    return null;
  }

  function applyMove(from, to, player, dieIndex){
    if(from===-1){ bar[player]--; }
    else { points[from][player]--; }

    if(to==='bearoff'){ home[player]++; }
    else {
      const opp=opponent(player);
      if(points[to][opp]===1){
        points[to][opp]=0;
        bar[opp]++;
      }
      points[to][player]++;
    }
    diceUsed[dieIndex]=true;
  }

  function hasAnyMove(player){
    const availDice=[];
    dice.forEach(function(d,i){ if(!diceUsed[i]) availDice.push(d); });
    const uniqueDice=Array.from(new Set(availDice));
    if(bar[player]>0){
      return uniqueDice.some(function(d){ return possibleMovesFromPoint(-1, player, d)!==null; });
    }
    for(let i=0;i<24;i++){
      if(points[i][player]>0){
        for(let d=0;d<uniqueDice.length;d++){
          if(possibleMovesFromPoint(i, player, uniqueDice[d])!==null) return true;
        }
      }
    }
    return false;
  }

  function renderDice(){
    diceRow.innerHTML='';
    dice.forEach(function(d,i){
      const die=document.createElement('div');
      die.className='die'+(diceUsed[i]?' used':'');
      die.textContent=d;
      diceRow.appendChild(die);
    });
  }

  function renderBoard(){
    boardEl.innerHTML='';
    const topOrder=[12,13,14,15,16,17,18,19,20,21,22,23];
    const bottomOrder=[11,10,9,8,7,6,5,4,3,2,1,0];

    function buildQuad(order, isTop){
      const quad=document.createElement('div');
      quad.className='quad';
      order.forEach(function(idx, pos){
        const pt=document.createElement('div');
        pt.className='point '+(isTop?'top':'bottom');
        const tri=document.createElement('div');
        tri.className='tri '+(pos%2===0?'light':'dark');
        pt.appendChild(tri);

        const validMoves = selectedPoint!==-1 ? getHighlightSet() : {};
        if(validMoves[idx]) pt.classList.add('highlight');

        const p=points[idx];
        const count = p.white>0 ? p.white : p.black;
        const color = p.white>0 ? 'white' : (p.black>0?'black':null);
        if(color){
          const shown=Math.min(count,5);
          for(let k=0;k<shown;k++){
            const checker=document.createElement('div');
            checker.className='checker '+color;
            pt.appendChild(checker);
          }
          if(count>5){
            const label=document.createElement('div');
            label.className='checker-count';
            label.textContent='+'+(count-5);
            pt.appendChild(label);
          }
        }
        pt.addEventListener('click', function(){ onPointClick(idx); });
        quad.appendChild(pt);
      });
      return quad;
    }

    const leftHalf=document.createElement('div');
    leftHalf.className='half left';
    const rightHalf=document.createElement('div');
    rightHalf.className='half';

    const topLeft=buildQuad(topOrder.slice(0,6), true);
    const topRight=buildQuad(topOrder.slice(6), true);
    const botLeft=buildQuad(bottomOrder.slice(6), false);
    const botRight=buildQuad(bottomOrder.slice(0,6), false);

    leftHalf.appendChild(topLeft);
    leftHalf.appendChild(botLeft);
    rightHalf.appendChild(topRight);
    rightHalf.appendChild(botRight);

    boardEl.appendChild(leftHalf);
    boardEl.appendChild(rightHalf);

    myHomeEl.textContent=home.white;
    botHomeEl.textContent=home.black;
  }

  function getHighlightSet(){
    const set={};
    const availDice=Array.from(new Set(dice.filter(function(d,i){ return !diceUsed[i]; })));
    availDice.forEach(function(d){
      const res=possibleMovesFromPoint(selectedPoint, WHITE, d);
      if(res!==null && res!=='bearoff') set[res]=true;
    });
    return set;
  }

  function onPointClick(idx){
    if(gameOver || turn!==WHITE || dice.length===0) return;

    if(selectedPoint===-1){
      if(points[idx].white>0 && bar.white===0){
        selectedPoint=idx;
        renderBoard();
        statusMsg.textContent='Escolha a casa de destino (verde).';
      }
      return;
    }

    const availDiceIdx=[];
    dice.forEach(function(d,i){ if(!diceUsed[i]) availDiceIdx.push(i); });

    for(let k=0;k<availDiceIdx.length;k++){
      const di=availDiceIdx[k];
      const res=possibleMovesFromPoint(selectedPoint, WHITE, dice[di]);
      if(res===idx){
        applyMove(selectedPoint, idx, WHITE, di);
        selectedPoint=-1;
        renderBoard();
        renderDice();
        afterMoveCheck();
        return;
      }
    }
    selectedPoint=-1;
    renderBoard();
  }

  function afterMoveCheck(){
    if(home.white===15){ finish(true); return; }
    if(!hasAnyMove(WHITE)){
      statusMsg.textContent='Sem mais jogadas possíveis. Vez do bot.';
      setTimeout(endPlayerTurn, 800);
    } else {
      statusMsg.textContent='Continue jogando ou passe a vez.';
    }
  }

  function rollForBar(){
    if(bar.white>0){
      const availDice=Array.from(new Set(dice.filter(function(d,i){ return !diceUsed[i]; })));
      const canEnter=availDice.some(function(d){ return possibleMovesFromPoint(-1, WHITE, d)!==null; });
      if(canEnter){
        statusMsg.textContent='Você tem peça na barra! Toque nela pra reentrar.';
      }
    }
  }

  rollBtn.addEventListener('click', function(){
    if(gameOver || turn!==WHITE || dice.length>0) return;
    rollDice();
    renderDice();
    selectedPoint=-1;
    if(!hasAnyMove(WHITE)){
      statusMsg.textContent='Sem jogadas possíveis com esses dados. Passe a vez.';
    } else {
      statusMsg.textContent='Toque numa peça para mover.';
    }
    rollForBar();
    renderBoard();
  });

  endTurnBtn.addEventListener('click', function(){
    if(gameOver || turn!==WHITE) return;
    endPlayerTurn();
  });

  function endPlayerTurn(){
    dice=[];
    diceUsed=[];
    selectedPoint=-1;
    renderDice();
    turn=BLACK;
    turnLabel.textContent='Vez do Bot';
    statusMsg.textContent='Bot jogando...';
    setTimeout(botTurn, 700);
  }

  function botTurn(){
    if(gameOver) return;
    rollDice();

    let safety=0;
    while(hasAnyMove(BLACK) && safety<20){
      safety++;
      const availDiceIdx=[];
      dice.forEach(function(d,i){ if(!diceUsed[i]) availDiceIdx.push(i); });
      let bestMove=null;

      if(bar.black>0){
        for(let k=0;k<availDiceIdx.length;k++){
          const res=possibleMovesFromPoint(-1, BLACK, dice[availDiceIdx[k]]);
          if(res!==null){ bestMove={from:-1, to:res, dieIdx:availDiceIdx[k]}; break; }
        }
      } else {
        let bestScore=-Infinity;
        for(let i=0;i<24;i++){
          if(points[i].black<=0) continue;
          for(let k=0;k<availDiceIdx.length;k++){
            const res=possibleMovesFromPoint(i, BLACK, dice[availDiceIdx[k]]);
            if(res===null) continue;
            let score=dice[availDiceIdx[k]];
            if(res!=='bearoff' && points[res].white===1) score+=20;
            if(res==='bearoff') score+=15;
            if(score>bestScore){ bestScore=score; bestMove={from:i, to:res, dieIdx:availDiceIdx[k]}; }
          }
        }
      }

      if(!bestMove) break;
      applyMove(bestMove.from, bestMove.to, BLACK, bestMove.dieIdx);
    }

    renderBoard();
    renderDice();

    if(home.black===15){ finish(false); return; }

    dice=[];
    diceUsed=[];
    turn=WHITE;
    turnLabel.textContent='Sua vez';
    statusMsg.textContent='Toque em "Rolar Dados" para jogar.';
    renderDice();
  }

  function finish(won){
    gameOver=true;
    overlayTitle.textContent = won ? '🏆 VOCÊ VENCEU!' : '💀 O BOT VENCEU!';
    overlayText.textContent = won
      ? 'Você retirou todas as suas 15 peças primeiro!'
      : 'O bot retirou todas as peças antes de você.';
    startBtn.textContent='JOGAR NOVAMENTE';
    overlay.style.display='flex';
  }

  startBtn.addEventListener('click', function(){
    overlay.style.display='none';
    setupBoard();
    dice=[]; diceUsed=[];
    turn=WHITE;
    gameOver=false;
    selectedPoint=-1;
    turnLabel.textContent='Sua vez';
    statusMsg.textContent='Toque em "Rolar Dados" para começar.';
    renderBoard();
    renderDice();
  });

  setupBoard();
  renderBoard();
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
  id:"gamao",
  name:"Gamão",
  category:"Tabuleiro",
  icon:"🎲",

  init({container}){
    container.innerHTML = GAMAO_HTML;
    executeGameScripts(container);
  }
});