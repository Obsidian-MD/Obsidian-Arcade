import { registerGame } from "../arcade.js";

const DOMINO_HTML = String.raw`<style>
*{
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
  -webkit-user-select:none;
  user-select:none;
}

html,body{
  margin:0;
  padding:0;
  width:100%;
  min-width:0;
  overflow:hidden;
}

body{
  background:transparent;
  font-family:'Courier New',Courier,monospace;
}

.wrap{
  width:100%;
  max-width:430px;
  margin:0 auto;
  padding:8px;
}

.game{
  position:relative;
  width:100%;
  min-height:600px;
  overflow:hidden;
  border-radius:24px;
  background:#0b1f14;
  border:2px solid #22c55e;
  box-shadow:0 0 25px rgba(34,197,94,0.4);
  display:flex;
  flex-direction:column;
  align-items:center;
}

.hud{
  width:100%;
  min-height:48px;
  padding:10px 14px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
  color:#fff;
  font-size:11px;
  font-weight:bold;
  background:#081410;
  border-bottom:2px solid #22c55e;
  z-index:10;
  flex-shrink:0;
}

.hud span b{
  color:#4ade80;
}

.turn-badge{
  padding:4px 10px;
  border-radius:20px;
  font-size:10px;
  background:rgba(74,222,128,0.15);
  border:1px solid #4ade80;
  color:#4ade80;
  white-space:nowrap;
}

.turn-badge.bot{
  background:rgba(248,113,113,0.15);
  border-color:#f87171;
  color:#f87171;
}

.bot-row{
  width:100%;
  padding:8px 12px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  background:#0a1a12;
  flex-shrink:0;
  flex-wrap:wrap;
}

.bot-tile-back{
  width:20px;
  height:30px;
  background:linear-gradient(135deg,#7f1d1d,#450a0a);
  border:1px solid #fca5a5;
  border-radius:4px;
  box-shadow:0 2px 4px rgba(0,0,0,0.5);
}

.board-container{
  position:relative;
  width:100%;
  flex:1;
  min-height:220px;
  margin:6px 0;
  padding:14px 10px;
  background:radial-gradient(ellipse at center,#14532d 0%,#0b2c17 100%);
  overflow-x:auto;
  overflow-y:hidden;
  display:flex;
  align-items:center;
  scroll-behavior:smooth;
}

.board-track{
  display:flex;
  align-items:center;
  gap:3px;
  margin:0 auto;
  padding:0 8px;
}

.placeholder-msg{
  width:100%;
  text-align:center;
  color:rgba(255,255,255,0.4);
  font-size:12px;
  padding:20px;
}

.tile{
  display:flex;
  flex-direction:row;
  flex-shrink:0;
  background:#fdf6e3;
  border:2px solid #92400e;
  border-radius:6px;
  box-shadow:0 3px 6px rgba(0,0,0,0.5);
  overflow:hidden;
}

.tile.double{
  border-color:#eab308;
  box-shadow:0 0 10px rgba(234,179,8,0.6);
}

.tile-half{
  width:26px;
  height:38px;
  display:grid;
  grid-template-columns:repeat(3,1fr);
  grid-template-rows:repeat(3,1fr);
  padding:3px;
  gap:1px;
}

.tile-half + .tile-half{
  border-left:2px solid #92400e;
}

.pip{
  width:100%;
  height:100%;
  display:flex;
  align-items:center;
  justify-content:center;
}

.pip::after{
  content:'';
  width:5px;
  height:5px;
  border-radius:50%;
  background:transparent;
}

.pip.on::after{
  background:#1c1917;
}

.hand-area{
  width:100%;
  padding:10px 8px 6px;
  background:#081410;
  border-top:2px solid #22c55e;
  flex-shrink:0;
}

.hand-label{
  color:rgba(255,255,255,0.5);
  font-size:10px;
  margin-bottom:6px;
  padding-left:4px;
}

.hand-row{
  display:flex;
  gap:6px;
  overflow-x:auto;
  padding:4px 4px 8px;
}

.hand-tile{
  flex-shrink:0;
  cursor:pointer;
  transform:translateY(0);
  transition:transform 0.15s ease;
}

.hand-tile .tile{
  border-width:2px;
}

.hand-tile.selected{
  transform:translateY(-8px);
}

.hand-tile.selected .tile{
  box-shadow:0 0 14px rgba(74,222,128,0.9);
  border-color:#4ade80;
}

.hand-tile.disabled{
  opacity:0.35;
}

.hand-tile .tile-half{
  width:24px;
  height:36px;
}

.action-row{
  display:flex;
  gap:8px;
  padding:0 4px;
  min-height:38px;
}

.action-btn{
  flex:1;
  padding:9px 6px;
  border-radius:10px;
  border:1px solid #4ade80;
  background:rgba(74,222,128,0.12);
  color:#4ade80;
  font-family:'Courier New',Courier,monospace;
  font-weight:bold;
  font-size:11px;
  cursor:pointer;
}

.action-btn:active{
  background:rgba(74,222,128,0.3);
}

.action-btn.secondary{
  border-color:#facc15;
  color:#facc15;
  background:rgba(250,204,21,0.12);
}

.action-btn:disabled{
  opacity:0.3;
  pointer-events:none;
}

.toast{
  position:absolute;
  left:50%;
  top:56px;
  transform:translateX(-50%);
  background:rgba(0,0,0,0.85);
  color:#fff;
  font-size:11px;
  padding:8px 16px;
  border-radius:20px;
  border:1px solid rgba(255,255,255,0.2);
  z-index:40;
  opacity:0;
  pointer-events:none;
  transition:opacity 0.25s ease, transform 0.25s ease;
  white-space:nowrap;
}

.toast.show{
  opacity:1;
  transform:translateX(-50%) translateY(4px);
}

.overlay{
  position:absolute;
  z-index:50;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
  background:rgba(0,0,0,0.92);
}

.panel{
  width:100%;
  max-width:320px;
  padding:22px;
  text-align:center;
  background:#0f2818;
  border:2px solid #22c55e;
  border-radius:16px;
  box-shadow:0 0 30px rgba(34,197,94,0.4);
}

.panel h1{
  color:#4ade80;
  font-size:16px;
  margin:0 0 10px;
  letter-spacing:1px;
}

.panel p{
  color:rgba(255,255,255,0.75);
  font-size:12px;
  line-height:1.5;
  margin:0 0 18px;
}

.panel .stat-line{
  display:flex;
  justify-content:space-between;
  font-size:11px;
  color:rgba(255,255,255,0.6);
  padding:4px 6px;
  border-bottom:1px dashed rgba(255,255,255,0.15);
}

.panel .stat-line b{
  color:#fff;
}

#startBtn{
  width:100%;
  padding:13px;
  border-radius:10px;
  border:none;
  background:linear-gradient(135deg,#22c55e,#16a34a);
  color:#fff;
  font-family:'Courier New',Courier,monospace;
  font-weight:bold;
  font-size:13px;
  cursor:pointer;
  letter-spacing:1px;
  box-shadow:0 4px 10px rgba(34,197,94,0.4);
}

#startBtn:active{
  transform:scale(0.98);
}

.footer-info{
  width:100%;
  padding:6px 14px 10px;
  color:rgba(255,255,255,0.4);
  font-size:9px;
  text-align:center;
  background:#081410;
  flex-shrink:0;
}
</style>

<div class="wrap">
  <div class="game" id="game">

    <div class="overlay" id="overlay">
      <div class="panel">
        <h1 id="overlayTitle">🁫 DOMINÓ VS BOT</h1>
        <p id="overlayText">Dominó tradicional (jogo do bloqueio), 28 peças, 7 na mão de cada jogador. Encaixe as pontas, quem ficar sem peças primeiro vence!</p>
        <div id="overlayStats"></div>
        <button id="startBtn">INICIAR PARTIDA</button>
      </div>
    </div>

    <div class="hud">
      <span>Monte: <b id="boneyardCount">14</b></span>
      <span class="turn-badge" id="turnBadge">Sua vez</span>
      <span>Bot: <b id="botCount">7</b> peças</span>
    </div>

    <div class="bot-row" id="botRow"></div>

    <div class="board-container" id="boardContainer">
      <div class="board-track" id="boardTrack">
        <div class="placeholder-msg">Mesa vazia — jogue a primeira peça!</div>
      </div>
    </div>

    <div class="toast" id="toast"></div>

    <div class="hand-area">
      <div class="hand-label">Sua mão (toque para selecionar):</div>
      <div class="hand-row" id="handRow"></div>
      <div class="action-row">
        <button class="action-btn" id="leftBtn" style="display:none">◀ Jogar Esquerda</button>
        <button class="action-btn" id="rightBtn" style="display:none">Jogar Direita ▶</button>
        <button class="action-btn secondary" id="drawBtn" style="display:none">🁢 Comprar peça</button>
        <button class="action-btn secondary" id="passBtn" style="display:none">Passar vez</button>
      </div>
    </div>

    <div class="footer-info">Dominó • Jogo do Bloqueio • OBSIDIAN ARCADE</div>
  </div>
</div>

<script>
(function(){

  const overlay = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayText = document.getElementById('overlayText');
  const overlayStats = document.getElementById('overlayStats');
  const startBtn = document.getElementById('startBtn');
  const boneyardCountEl = document.getElementById('boneyardCount');
  const botCountEl = document.getElementById('botCount');
  const turnBadge = document.getElementById('turnBadge');
  const botRow = document.getElementById('botRow');
  const boardContainer = document.getElementById('boardContainer');
  const boardTrack = document.getElementById('boardTrack');
  const handRow = document.getElementById('handRow');
  const leftBtn = document.getElementById('leftBtn');
  const rightBtn = document.getElementById('rightBtn');
  const drawBtn = document.getElementById('drawBtn');
  const passBtn = document.getElementById('passBtn');
  const toastEl = document.getElementById('toast');

  let playerHand = [];
  let botHand = [];
  let boneyard = [];
  let board = [];
  let leftEnd = null;
  let rightEnd = null;
  let turn = 'player';
  let gameOver = false;
  let selectedIndex = -1;
  let toastTimer = null;

  function showToast(msg, ms){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){
      toastEl.classList.remove('show');
    }, ms || 1800);
  }

  function pipPattern(n){
    const P = {
      0: [],
      1: [5],
      2: [1,9],
      3: [1,5,9],
      4: [1,3,7,9],
      5: [1,3,5,7,9],
      6: [1,3,4,6,7,9]
    };
    return P[n] || [];
  }

  function halfHTML(n){
    const active = pipPattern(n);
    let out = '<div class="tile-half">';
    for(let i=1;i<=9;i++){
      out += '<div class="pip' + (active.indexOf(i)!==-1 ? ' on' : '') + '"></div>';
    }
    out += '</div>';
    return out;
  }

  function tileHTML(a, b, extraClass){
    const isDouble = a === b;
    return '<div class="tile' + (isDouble?' double':'') + (extraClass?(' '+extraClass):'') + '">' + halfHTML(a) + halfHTML(b) + '</div>';
  }

  function makeSet(){
    const set = [];
    for(let i=0;i<=6;i++){
      for(let j=i;j<=6;j++){
        set.push({a:i, b:j});
      }
    }
    return set;
  }

  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      const tmp = arr[i]; arr[i]=arr[j]; arr[j]=tmp;
    }
    return arr;
  }

  function pipSum(hand){
    return hand.reduce(function(s,t){ return s + t.a + t.b; }, 0);
  }

  function highestDoubleIndex(hand){
    let best = -1, bestVal = -1;
    for(let i=0;i<hand.length;i++){
      if(hand[i].a === hand[i].b && hand[i].a > bestVal){
        bestVal = hand[i].a;
        best = i;
      }
    }
    return best;
  }

  function setup(){
    const full = shuffle(makeSet());
    playerHand = full.slice(0,7);
    botHand = full.slice(7,14);
    boneyard = full.slice(14);
    board = [];
    leftEnd = null;
    rightEnd = null;
    gameOver = false;
    selectedIndex = -1;

    const pDouble = highestDoubleIndex(playerHand);
    const bDouble = highestDoubleIndex(botHand);
    if(pDouble !== -1 && (bDouble === -1 || playerHand[pDouble].a >= botHand[bDouble].a)){
      turn = 'player';
    } else if(bDouble !== -1){
      turn = 'bot';
    } else {
      turn = Math.random() < 0.5 ? 'player' : 'bot';
    }

    render();

    if(turn === 'bot'){
      setTimeout(botPlay, 700);
    } else {
      showToast('Sua vez de começar!');
    }
  }

  function validSidesFor(tile, leftE, rightE, boardEmpty){
    if(boardEmpty) return ['right'];
    const sides = [];
    if(tile.a === leftE || tile.b === leftE) sides.push('left');
    if(tile.a === rightE || tile.b === rightE) sides.push('right');
    return sides;
  }

  function handHasAnyMove(hand){
    if(board.length === 0) return true;
    for(let i=0;i<hand.length;i++){
      if(validSidesFor(hand[i], leftEnd, rightEnd, false).length > 0) return true;
    }
    return false;
  }

  function placeTile(tile, side, byBot){
    const boardEmpty = board.length === 0;

    if(boardEmpty){
      board.push({a: tile.a, b: tile.b, isDouble: tile.a===tile.b});
      leftEnd = tile.a;
      rightEnd = tile.b;
    } else if(side === 'right'){
      let oriented;
      if(tile.a === rightEnd){
        oriented = {a: tile.a, b: tile.b};
        rightEnd = tile.b;
      } else {
        oriented = {a: tile.b, b: tile.a};
        rightEnd = tile.a;
      }
      oriented.isDouble = tile.a === tile.b;
      board.push(oriented);
    } else {
      let oriented;
      if(tile.b === leftEnd){
        oriented = {a: tile.a, b: tile.b};
        leftEnd = tile.a;
      } else {
        oriented = {a: tile.b, b: tile.a};
        leftEnd = tile.b;
      }
      oriented.isDouble = tile.a === tile.b;
      board.unshift(oriented);
    }

    const hand = byBot ? botHand : playerHand;
    const idx = hand.findIndex(function(t){ return t.a===tile.a && t.b===tile.b; });
    if(idx !== -1) hand.splice(idx,1);
  }

  function checkGameEnd(){
    if(playerHand.length === 0){
      endGame('player', 'empty');
      return true;
    }
    if(botHand.length === 0){
      endGame('bot', 'empty');
      return true;
    }
    if(boneyard.length === 0 && !handHasAnyMove(playerHand) && !handHasAnyMove(botHand)){
      const pSum = pipSum(playerHand);
      const bSum = pipSum(botHand);
      if(pSum < bSum) endGame('player', 'block');
      else if(bSum < pSum) endGame('bot', 'block');
      else endGame('draw', 'block');
      return true;
    }
    return false;
  }

  function endGame(winner, reason){
    gameOver = true;
    render();
    let title, text;
    const pSum = pipSum(playerHand);
    const bSum = pipSum(botHand);
    if(winner === 'player'){
      title = '🏆 VOCÊ VENCEU!';
      text = reason === 'empty' ? 'Você ficou sem peças primeiro!' : 'Jogo bloqueado — você tinha menos pontos na mão!';
    } else if(winner === 'bot'){
      title = '💀 O BOT VENCEU!';
      text = reason === 'empty' ? 'O bot ficou sem peças primeiro.' : 'Jogo bloqueado — o bot tinha menos pontos na mão.';
    } else {
      title = '🤝 EMPATE!';
      text = 'Jogo bloqueado e ambos ficaram com a mesma pontuação na mão.';
    }
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    overlayStats.innerHTML =
      '<div class="stat-line"><span>Seus pontos na mão</span><b>' + pSum + '</b></div>' +
      '<div class="stat-line"><span>Pontos do bot na mão</span><b>' + bSum + '</b></div>';
    startBtn.textContent = 'JOGAR NOVAMENTE';
    overlay.style.display = 'flex';
  }

  function botPlay(){
    if(gameOver) return;

    if(board.length > 0 && !handHasAnyMove(botHand)){
      while(boneyard.length > 0 && !handHasAnyMove(botHand)){
        botHand.push(boneyard.pop());
      }
      render();
      if(checkGameEnd()) return;
      if(!handHasAnyMove(botHand)){
        showToast('Bot passou a vez (sem jogadas)');
        turn = 'player';
        render();
        return;
      }
    }

    let bestMove = null;
    let bestScore = -Infinity;

    for(let i=0;i<botHand.length;i++){
      const tile = botHand[i];
      const sides = validSidesFor(tile, leftEnd, rightEnd, board.length===0);
      for(let s=0;s<sides.length;s++){
        const side = sides[s];
        let score = tile.a + tile.b;
        if(tile.a === tile.b) score += 6;
        if(score > bestScore){
          bestScore = score;
          bestMove = {tile: tile, side: side};
        }
      }
    }

    if(bestMove){
      placeTile(bestMove.tile, bestMove.side, true);
      render();
      if(checkGameEnd()) return;
      turn = 'player';
      render();
      if(!handHasAnyMove(playerHand) && boneyard.length === 0){
        showToast('Você não tem jogadas — compre ou passe');
      }
    } else {
      turn = 'player';
      render();
    }
  }

  function selectTile(idx){
    if(turn !== 'player' || gameOver) return;
    const tile = playerHand[idx];
    const sides = validSidesFor(tile, leftEnd, rightEnd, board.length===0);
    if(sides.length === 0){
      showToast('Essa peça não encaixa em nenhuma ponta!');
      selectedIndex = -1;
      render();
      return;
    }
    if(selectedIndex === idx){
      selectedIndex = -1;
      render();
      return;
    }
    selectedIndex = idx;
    render();

    if(board.length === 0 || sides.length === 1){
      doPlacePlayer(sides[0]);
    }
  }

  function doPlacePlayer(side){
    if(selectedIndex === -1) return;
    const tile = playerHand[selectedIndex];
    placeTile(tile, side, false);
    selectedIndex = -1;
    render();
    if(checkGameEnd()) return;
    turn = 'bot';
    render();
    setTimeout(botPlay, 700);
  }

  function doDraw(){
    if(turn !== 'player' || gameOver || boneyard.length === 0) return;
    playerHand.push(boneyard.pop());
    render();
    if(!handHasAnyMove(playerHand) && boneyard.length === 0){
      turn = 'bot';
      render();
      setTimeout(botPlay, 700);
    }
  }

  function doPass(){
    if(turn !== 'player' || gameOver) return;
    turn = 'bot';
    selectedIndex = -1;
    render();
    setTimeout(botPlay, 700);
  }

  function render(){
    boneyardCountEl.textContent = boneyard.length;
    botCountEl.textContent = botHand.length;
    turnBadge.textContent = gameOver ? 'Fim de jogo' : (turn === 'player' ? 'Sua vez' : 'Vez do Bot');
    turnBadge.className = 'turn-badge' + (turn === 'bot' ? ' bot' : '');

    botRow.innerHTML = '';
    for(let i=0;i<botHand.length;i++){
      const d = document.createElement('div');
      d.className = 'bot-tile-back';
      botRow.appendChild(d);
    }

    if(board.length === 0){
      boardTrack.innerHTML = '<div class="placeholder-msg">Mesa vazia — jogue a primeira peça!</div>';
    } else {
      boardTrack.innerHTML = board.map(function(t){ return tileHTML(t.a, t.b); }).join('');
      setTimeout(function(){
        boardContainer.scrollLeft = boardContainer.scrollWidth;
      }, 30);
    }

    handRow.innerHTML = '';
    const boardEmpty = board.length === 0;
    for(let i=0;i<playerHand.length;i++){
      const tile = playerHand[i];
      const sides = validSidesFor(tile, leftEnd, rightEnd, boardEmpty);
      const wrapper = document.createElement('div');
      wrapper.className = 'hand-tile' + (i===selectedIndex?' selected':'') + (sides.length===0 && turn==='player' && !boardEmpty ? ' disabled':'');
      wrapper.innerHTML = tileHTML(tile.a, tile.b);
      wrapper.addEventListener('click', function(){ selectTile(i); });
      handRow.appendChild(wrapper);
    }

    const canPlayerMove = handHasAnyMove(playerHand);
    const selSides = selectedIndex !== -1 ? validSidesFor(playerHand[selectedIndex], leftEnd, rightEnd, boardEmpty) : [];

    leftBtn.style.display = (selectedIndex !== -1 && !boardEmpty && selSides.indexOf('left') !== -1) ? 'block' : 'none';
    rightBtn.style.display = (selectedIndex !== -1 && !boardEmpty && selSides.indexOf('right') !== -1) ? 'block' : 'none';

    drawBtn.style.display = (turn === 'player' && !gameOver && !canPlayerMove && boneyard.length > 0) ? 'block' : 'none';
    passBtn.style.display = (turn === 'player' && !gameOver && !canPlayerMove && boneyard.length === 0) ? 'block' : 'none';
  }

  leftBtn.addEventListener('click', function(){ doPlacePlayer('left'); });
  rightBtn.addEventListener('click', function(){ doPlacePlayer('right'); });
  drawBtn.addEventListener('click', doDraw);
  passBtn.addEventListener('click', doPass);

  startBtn.addEventListener('click', function(){
    overlay.style.display = 'none';
    setup();
  });

})();
</script>`;

function executeGameScripts(container){
  const scripts = [...container.querySelectorAll("script")];

  for(const oldScript of scripts){
    const script = document.createElement("script");

    for(const attr of oldScript.attributes){
      script.setAttribute(attr.name, attr.value);
    }

    script.textContent = oldScript.textContent;

    oldScript.remove();

    container.appendChild(script);
  }
}

registerGame({
  id:"domino",
  name:"Dominó",
  category:"Tabuleiro",
  icon:"🁫",

  init({container}){
    container.innerHTML = DOMINO_HTML;
    executeGameScripts(container);
  }
});