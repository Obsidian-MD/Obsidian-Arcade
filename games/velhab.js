import { registerGame } from "../arcade.js";

const VELHAB_HTML = String.raw`<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap');

*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}

.wrap{width:100%;max-width:420px;margin:auto;font-family:'Orbitron',sans-serif}

.page{
  position:relative;
  background:
    radial-gradient(circle at 50% 30%, rgba(18,24,56,0.85) 0%, rgba(8,11,24,0.95) 70%, #050711 100%),
    linear-gradient(170deg,#0d1124,#050711);
  border-radius:14px;
  border: 1px solid rgba(0, 243, 255, 0.25);
  box-shadow:
    0 0 25px rgba(0, 243, 255, 0.15),
    0 22px 40px rgba(0,0,0,.75),
    inset 0 0 15px rgba(0, 243, 255, 0.05);
  padding:22px;
  overflow:hidden;
}

.content{position:relative}

.scorecorner{
  position:absolute;
  top:-2px;
  right:0;
  display:flex;
  gap:12px;
}
.score-item{text-align:center;min-width:32px}
.score-num{
  display:block;
  font-weight:700;
  font-size:22px;
  line-height:1;
  color:#00f3ff;
  text-shadow: 0 0 8px rgba(0, 243, 255, 0.6);
}
.score-label{
  display:block;
  margin-top:2px;
  font-size:9px;
  color:#8fa1c7;
  border-top:1px solid rgba(0, 243, 255, 0.2);
  padding-top:2px;
  text-transform:uppercase;
  letter-spacing: 0.5px;
}

.title{
  font-weight:900;
  font-size:28px;
  line-height:1.1;
  color:#ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(0, 243, 255, 0.4);
  margin:0 0 2px;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 10px;
  color: #00f3ff;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 8px;
  text-shadow: 0 0 5px rgba(0, 243, 255, 0.5);
}

.difficulty-bar {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  background: rgba(0, 0, 0, 0.3);
  padding: 4px;
  border-radius: 8px;
  border: 1px solid rgba(0, 243, 255, 0.15);
}

.diff-btn {
  flex: 1;
  background: transparent;
  border: none;
  font-family: 'Orbitron', sans-serif;
  font-size: 9px;
  color: #8fa1c7;
  padding: 6px 2px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.diff-btn.active {
  background: rgba(0, 243, 255, 0.15);
  color: #00f3ff;
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
  border: 1px solid rgba(0, 243, 255, 0.4);
}

.turn{
  font-weight:700;
  font-size:15px;
  color:#8fa1c7;
  margin-bottom:12px;
  min-height:20px;
  transition:color .2s ease;
  letter-spacing: 0.5px;
}
.turn.win{color:#00f3ff; text-shadow: 0 0 8px rgba(0, 243, 255, 0.6);}
.turn.lose{color:#ff0055; text-shadow: 0 0 8px rgba(255, 0, 85, 0.6);}

.boardwrap{
  position:relative;
  width:min(100%,280px);
  aspect-ratio:1/1;
  margin:4px auto 12px;
}
.boardwrap svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}

.gridline{
  fill:none;
  stroke:rgba(0, 243, 255, 0.3);
  stroke-width:3;
  stroke-linecap:round;
  filter: drop-shadow(0 0 6px rgba(0, 243, 255, 0.4));
}
.markx{fill:none;stroke:#00f3ff;stroke-width:9;stroke-linecap:round;filter: drop-shadow(0 0 8px rgba(0, 243, 255, 0.8))}
.marko{fill:none;stroke:#ff0055;stroke-width:8;stroke-linecap:round;filter: drop-shadow(0 0 8px rgba(255, 0, 85, 0.8))}
.winline{fill:none;stroke:#ffffff;stroke-width:5;stroke-linecap:round;filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.9))}

.board{
  position:absolute;
  inset:0;
  display:grid;
  grid-template-columns:repeat(3,1fr);
  grid-template-rows:repeat(3,1fr);
  gap:4px;
}
.cell{
  cursor:pointer;
  background: rgba(0, 243, 255, 0.02);
  border: 1px solid rgba(0, 243, 255, 0.1);
  border-radius: 6px;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.cell:active{
  background: rgba(0, 243, 255, 0.08);
}

.message{
  text-align:center;
  font-size:11px;
  color:#8fa1c7;
  min-height:16px;
  margin-bottom:12px;
  letter-spacing: 0.5px;
}

.buttons{display:flex;gap:10px;justify-content:center}
.btn{
  font-family:'Orbitron',sans-serif;
  font-size:11px;
  font-weight: 700;
  color:#00f3ff;
  background:rgba(0, 243, 255, 0.1);
  border:1px solid rgba(0, 243, 255, 0.4);
  border-radius:8px;
  padding:10px 16px;
  cursor:pointer;
  transition:all .15s ease;
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.15);
  letter-spacing: 0.5px;
}
.btn:active{transform:scale(.95)}
.btn-ghost{
  color:#8fa1c7;
  background:rgba(255,255,255,0.05);
  border-color:rgba(255,255,255,0.2);
  box-shadow:none;
}

@media(max-width:380px){
  .page{padding:16px}
  .title{font-size:24px}
  .score-num{font-size:18px}
}
</style>

<div class="wrap">
<div class="page">

  <div class="content">

    <div class="scorecorner">
      <div class="score-item">
        <span class="score-num" id="wins">0</span>
        <span class="score-label">você</span>
      </div>
      <div class="score-item">
        <span class="score-num" id="draws">0</span>
        <span class="score-label">empates</span>
      </div>
      <div class="score-item">
        <span class="score-num" id="losses">0</span>
        <span class="score-label">bot</span>
      </div>
    </div>

    <div class="title">NEON_TAC</div>
    <div class="subtitle">Cyber Edition</div>

    <div class="difficulty-bar">
      <button class="diff-btn active" data-diff="easy">Fácil</button>
      <button class="diff-btn" data-diff="medium">Médio</button>
      <button class="diff-btn" data-diff="hard">Extremo</button>
    </div>

    <div class="turn" id="turn">sua vez [X]</div>

    <div class="boardwrap">
      <svg id="svgboard" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet"></svg>
      <div class="board" id="board">
        <div class="cell" data-i="0"></div>
        <div class="cell" data-i="1"></div>
        <div class="cell" data-i="2"></div>
        <div class="cell" data-i="3"></div>
        <div class="cell" data-i="4"></div>
        <div class="cell" data-i="5"></div>
        <div class="cell" data-i="6"></div>
        <div class="cell" data-i="7"></div>
        <div class="cell" data-i="8"></div>
      </div>
    </div>

    <div class="message" id="message">toque num setor vazio</div>

    <div class="buttons">
      <button class="btn" id="restart">reiniciar</button>
      <button class="btn btn-ghost" id="newgame">zerar placar</button>
    </div>

  </div>

</div>
</div>

<script>
(function(){

var SVGNS = "http://www.w3.org/2000/svg";
var svg = document.getElementById("svgboard");
var cells = Array.prototype.slice.call(document.querySelectorAll(".cell"));
var turnEl = document.getElementById("turn");
var messageEl = document.getElementById("message");
var winsEl = document.getElementById("wins");
var drawsEl = document.getElementById("draws");
var lossesEl = document.getElementById("losses");
var restartBtn = document.getElementById("restart");
var newgameBtn = document.getElementById("newgame");
var diffBtns = Array.prototype.slice.call(document.querySelectorAll(".diff-btn"));

var board = ["","","","","","","","",""];
var playing = true;
var playerTurn = true;
var wins = 0, draws = 0, losses = 0;
var currentDifficulty = "easy";

try {
  wins = Number(localStorage.getItem("velhab_neon_wins") || 0);
  draws = Number(localStorage.getItem("velhab_neon_draws") || 0);
  losses = Number(localStorage.getItem("velhab_neon_losses") || 0);
  currentDifficulty = localStorage.getItem("velhab_neon_diff") || "easy";
} catch (e) {}

diffBtns.forEach(function(btn){
  if(btn.dataset.diff === currentDifficulty){
    btn.classList.add("active");
  } else {
    btn.classList.remove("active");
  }
});

function updateScore(){
  winsEl.textContent = String(wins);
  drawsEl.textContent = String(draws);
  lossesEl.textContent = String(losses);
  try {
    localStorage.setItem("velhab_neon_wins", String(wins));
    localStorage.setItem("velhab_neon_draws", String(draws));
    localStorage.setItem("velhab_neon_losses", String(losses));
    localStorage.setItem("velhab_neon_diff", currentDifficulty);
  } catch (e) {}
}

function center(i){
  var col = i % 3, row = Math.floor(i / 3);
  return { x: col * 100 + 50, y: row * 100 + 50 };
}

function svgPath(d, cls){
  var p = document.createElementNS(SVGNS, "path");
  p.setAttribute("d", d);
  p.setAttribute("class", cls);
  svg.appendChild(p);
  return p;
}

function animateDraw(path, duration, delay){
  var len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
  path.getBoundingClientRect();
  setTimeout(function(){
    path.style.transition = "stroke-dashoffset " + duration + "ms cubic-bezier(0.4, 0, 0.2, 1)";
    path.style.strokeDashoffset = "0";
  }, delay || 0);
}

function drawGrid(){
  var lines = [
    "M 100 12 L 100 288",
    "M 200 12 L 200 288",
    "M 12 100 L 288 100",
    "M 12 200 L 288 200"
  ];
  lines.forEach(function(d, idx){
    var p = svgPath(d, "gridline");
    animateDraw(p, 300, idx * 60);
  });
}

function drawX(i){
  var c = center(i);
  var offset = 22;
  var a = svgPath(
    "M " + (c.x-offset) + " " + (c.y-offset) + " L " + (c.x+offset) + " " + (c.y+offset),
    "markx"
  );
  var b = svgPath(
    "M " + (c.x+offset) + " " + (c.y-offset) + " L " + (c.x-offset) + " " + (c.y+offset),
    "markx"
  );
  animateDraw(a, 140, 0);
  animateDraw(b, 140, 100);
}

function drawO(i){
  var c = center(i);
  var p = svgPath(
    "M " + c.x + " " + (c.y-22) + " A 22 22 0 1 1 " + (c.x-0.1) + " " + (c.y-22),
    "marko"
  );
  animateDraw(p, 260, 0);
}

function drawWinLine(line){
  var p1 = center(line[0]);
  var p2 = center(line[2]);
  var p = svgPath(
    "M " + p1.x + " " + p1.y + " L " + p2.x + " " + p2.y,
    "winline"
  );
  animateDraw(p, 220, 80);
}

function clearBoard(){
  svg.innerHTML = "";
  drawGrid();
}

function checkWinner(b){
  var lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (var i = 0; i < lines.length; i++){
    var l = lines[i];
    if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]){
      return { winner: b[l[0]], line: l };
    }
  }
  if (b.every(Boolean)) return { winner: "draw", line: [] };
  return null;
}

function emptyCells(b){
  return b.map(function(v,i){ return v ? null : i; }).filter(function(i){ return i !== null; });
}

function findWinningMove(b, symbol){
  var empty = emptyCells(b);
  for (var i = 0; i < empty.length; i++){
    var idx = empty[i];
    var test = b.slice();
    test[idx] = symbol;
    var result = checkWinner(test);
    if (result && result.winner === symbol) return idx;
  }
  return null;
}

function minimax(newBoard, depth, isMaximizing){
  var res = checkWinner(newBoard);
  if (res) {
    if (res.winner === "O") return 10 - depth;
    if (res.winner === "X") return depth - 10;
    return 0;
  }
  if (depth >= 9) return 0;

  var empty = emptyCells(newBoard);
  if (isMaximizing) {
    var maxEval = -Infinity;
    for (var i = 0; i < empty.length; i++){
      var idx = empty[i];
      newBoard[idx] = "O";
      var evaluation = minimax(newBoard, depth + 1, false);
      newBoard[idx] = "";
      maxEval = Math.max(maxEval, evaluation);
    }
    return maxEval;
  } else {
    var minEval = Infinity;
    for (var i = 0; i < empty.length; i++){
      var idx = empty[i];
      newBoard[idx] = "X";
      var evaluation = minimax(newBoard, depth + 1, true);
      newBoard[idx] = "";
      minEval = Math.min(minEval, evaluation);
    }
    return minEval;
  }
}

function getBestMoveMinimax(b){
  var bestScore = -Infinity;
  var bestMove = null;
  var empty = emptyCells(b);

  for (var i = 0; i < empty.length; i++){
    var idx = empty[i];
    b[idx] = "O";
    var score = minimax(b, 0, false);
    b[idx] = "";
    if (score > bestScore){
      bestScore = score;
      bestMove = idx;
    }
  }
  return bestMove;
}

function move(index, symbol){
  board[index] = symbol;
  if (symbol === "X") drawX(index); else drawO(index);
}

function finish(result){
  playing = false;
  playerTurn = false;
  turnEl.classList.remove("win","lose");

  if (result.winner === "X"){
    wins++;
    turnEl.textContent = "você venceu!";
    turnEl.classList.add("win");
    messageEl.textContent = "sistema superado com sucesso";
  } else if (result.winner === "O"){
    losses++;
    turnEl.textContent = "o bot venceu";
    turnEl.classList.add("lose");
    messageEl.textContent = "conexão neural encerrada";
  } else {
    draws++;
    turnEl.textContent = "empate";
    messageEl.textContent = "tabuleiro estabilizado";
  }

  if (result.line.length) drawWinLine(result.line);
  updateScore();
}

function resetBoard(){
  board = ["","","","","","","","",""];
  playing = true;
  playerTurn = true;
  clearBoard();
  turnEl.classList.remove("win","lose");
  turnEl.textContent = "sua vez [X]";
  messageEl.textContent = "toque num setor vazio";
}

function machineMove(){
  if (!playing) return;
  var index = null;

  if (currentDifficulty === "easy") {
    var empty = emptyCells(board);
    if (empty.length) {
      if (Math.random() < 0.3) {
        index = findWinningMove(board, "O") || findWinningMove(board, "X");
      }
      if (index === null) {
        index = empty[Math.floor(Math.random() * empty.length)];
      }
    }
  } else if (currentDifficulty === "medium") {
    index = findWinningMove(board, "O");
    if (index === null) index = findWinningMove(board, "X");
    if (index === null && board[4] === "") index = 4;
    if (index === null) {
      var empty = emptyCells(board);
      if (empty.length) index = empty[Math.floor(Math.random() * empty.length)];
    }
  } else {
    index = getBestMoveMinimax(board);
  }

  if (index !== null){
    move(index, "O");
    var result = checkWinner(board);
    if (result){ finish(result); return; }
  }
  playerTurn = true;
  turnEl.textContent = "sua vez [X]";
  messageEl.textContent = "toque num setor vazio";
}

cells.forEach(function(cell){
  cell.addEventListener("click", function(){
    if (!playing || !playerTurn) return;
    var index = Number(cell.dataset.i);
    if (board[index]) return;

    move(index, "X");
    var result = checkWinner(board);
    if (result){ finish(result); return; }

    playerTurn = false;
    turnEl.textContent = "processando...";
    messageEl.textContent = "IA calculando rota...";
    setTimeout(machineMove, 300);
  });
});

diffBtns.forEach(function(btn){
  btn.addEventListener("click", function(){
    diffBtns.forEach(function(b){ b.classList.remove("active"); });
    btn.classList.add("active");
    currentDifficulty = btn.dataset.diff;
    updateScore();
    resetBoard();
  });
});

restartBtn.addEventListener("click", resetBoard);

newgameBtn.addEventListener("click", function(){
  wins = 0;
  draws = 0;
  losses = 0;
  updateScore();
  resetBoard();
});

updateScore();
resetBoard();

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
  id:"velhab",
  name:"Jogo da Velha",
  category:"Tabuleiro",
  icon:"❌",

  init({container}){
    container.innerHTML = VELHAB_HTML;
    executeGameScripts(container);
  }
});