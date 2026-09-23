import { registerGame } from "../arcade.js";

const MEMORY_HTML = String.raw`<style>
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
  height:580px;
  overflow:hidden;
  border-radius:24px;
  background:#121224;
  border:2px solid #3b82f6;
  box-shadow:0 0 25px rgba(59,130,246,0.4);
  display:flex;
  flex-direction:column;
  align-items:center;
}

.hud{
  width:100%;
  min-height:50px;
  padding:10px 14px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  color:#fff;
  font-size:11px;
  font-weight:bold;
  background:#0a0a1a;
  border-bottom:2px solid #3b82f6;
  z-index:10;
  flex-shrink:0;
}

.hud div{
  display:flex;
  flex-direction:column;
  align-items:center;
}

.hud span b{
  color:#60a5fa;
  font-size:13px;
}

.board-container{
  position:relative;
  width:min(90vw,340px);
  margin:12px auto 0;
  display:grid;
  grid-template-columns:repeat(4, 1fr);
  gap:8px;
  padding:10px;
  background:#000;
  border:3px solid #1e3a8a;
  border-radius:12px;
  box-shadow:0 0 15px rgba(0,0,0,0.8);
  flex-shrink:0;
}

.card{
  aspect-ratio:1/1;
  background:#1e293b;
  border:2px solid #3b82f6;
  border-radius:8px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:26px;
  cursor:pointer;
  transition:transform 0.2s, background 0.2s;
}

.card.flipped, .card.matched{
  background:#0f172a;
  border-color:#60a5fa;
  transform:scale(1.02);
}

.card.matched{
  border-color:#22c55e;
  background:rgba(34,197,94,0.15);
}

.footer-panel{
  width:100%;
  flex:1;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  background:#080814;
  padding:8px 16px;
  gap:8px;
}

.stats-row{
  display:flex;
  justify-content:space-around;
  width:100%;
  color:rgba(255,255,255,0.8);
  font-size:12px;
  font-weight:bold;
}

.stats-row b{
  color:#38bdf8;
}

.reset-btn{
  width:80%;
  height:36px;
  background:#3b82f6;
  border:none;
  border-radius:8px;
  color:#fff;
  font-weight:bold;
  font-size:12px;
  cursor:pointer;
  box-shadow:0 0 10px rgba(59,130,246,0.5);
}

.reset-btn:active{
  transform:scale(0.96);
}

.overlay{
  position:absolute;
  z-index:30;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
  background:rgba(0,0,0,0.9);
}

.panel{
  width:100%;
  max-width:320px;
  padding:20px;
  text-align:center;
  border-radius:16px;
  background:#0f172a;
  border:2px solid #3b82f6;
  box-shadow:0 0 30px rgba(59,130,246,0.3);
}

.panel h1{
  margin:0 0 8px;
  color:#60a5fa;
  font-size:20px;
  text-shadow:0 0 10px rgba(96,165,250,0.5);
}

.panel p{
  color:#cbd5e1;
  font-size:12px;
  line-height:1.4;
  margin:0 0 16px;
}

.start-btn{
  width:100%;
  height:42px;
  border:2px solid #60a5fa;
  border-radius:8px;
  color:#0f172a;
  background:#60a5fa;
  font-weight:bold;
  font-size:13px;
  cursor:pointer;
  box-shadow:0 0 12px rgba(96,165,250,0.4);
}

.start-btn:active{
  transform:scale(0.96);
}
</style>

<div class="wrap">
  <div class="game" id="game">

    <div class="hud">
      <div>TÍTULO: <span>JOGO DA MEMÓRIA</span></div>
      <div>PARES: <span id="pairs-count"><b>0</b>/8</span></div>
    </div>

    <div class="board-container" id="board"></div>

    <div class="footer-panel">
      <div class="stats-row">
        <div>Movimentos: <b id="moves">0</b></div>
        <div>Tempo: <b id="timer">00:00</b></div>
        <div>Pontos: <b id="score">0</b></div>
      </div>
      <button class="reset-btn" id="reset-btn">Reiniciar</button>
    </div>

    <div class="overlay" id="overlay">
      <div class="panel">
        <h1>JOGO DA MEMÓRIA</h1>
        <p>Encontre todos os 8 pares combinando os emojis com o menor número de movimentos e tempo possível para garantir a pontuação máxima!</p>
        <button class="start-btn" id="start-btn">INICIAR PARTIDA</button>
      </div>
    </div>

  </div>
</div>

<script>
(function(){
  const EMOJIS = ["🦊", "🐼", "🦁", "🐨", "🐯", "🐰", "🐵", "🐸"];
  const boardEl = document.getElementById("board");
  const pairsEl = document.getElementById("pairs-count");
  const movesEl = document.getElementById("moves");
  const timerEl = document.getElementById("timer");
  const scoreEl = document.getElementById("score");
  const resetBtn = document.getElementById("reset-btn");
  const startBtn = document.getElementById("start-btn");
  const overlay = document.getElementById("overlay");

  let cards = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;
  let score = 0;
  let seconds = 0;
  let timerInterval = null;
  let isLocked = false;
  let gameStarted = false;

  function initGame(){
    clearInterval(timerInterval);
    seconds = 0;
    moves = 0;
    score = 0;
    matchedPairs = 0;
    flippedCards = [];
    isLocked = false;
    gameStarted = false;

    timerEl.textContent = "00:00";
    movesEl.textContent = "0";
    scoreEl.textContent = "0";
    pairsEl.innerHTML = "<b>0</b>/8";

    let deck = EMOJIS.concat(EMOJIS)
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji: emoji,
        isFlipped: false,
        isMatched: false
      }));

    cards = deck;
    renderBoard();
  }

  function startTimer(){
    if(gameStarted) return;
    gameStarted = true;
    timerInterval = setInterval(() => {
      seconds++;
      let m = Math.floor(seconds / 60).toString().padStart(2, '0');
      let s = (seconds % 60).toString().padStart(2, '0');
      timerEl.textContent = m + ":" + s;
    }, 1000);
  }

  function renderBoard(){
    boardEl.innerHTML = "";
    cards.forEach((card, index) => {
      const cardEl = document.createElement("div");
      cardEl.className = "card";
      if(card.isFlipped || card.isMatched){
        cardEl.classList.add(card.isMatched ? "matched" : "flipped");
        cardEl.textContent = card.emoji;
      } else {
        cardEl.textContent = "❓";
      }

      cardEl.addEventListener("click", () => handleCardClick(index));
      boardEl.appendChild(cardEl);
    });
  }

  function handleCardClick(index){
    if(isLocked) return;
    let clicked = cards[index];

    if(clicked.isFlipped || clicked.isMatched) return;

    startTimer();
    clicked.isFlipped = true;
    flippedCards.push(index);
    renderBoard();

    if(flippedCards.length === 2){
      moves++;
      movesEl.textContent = moves;
      isLocked = true;

      let first = cards[flippedCards[0]];
      let second = cards[flippedCards[1]];

      if(first.emoji === second.emoji){
        first.isMatched = true;
        second.isMatched = true;
        matchedPairs++;
        pairsEl.innerHTML = "<b>" + matchedPairs + "</b>/8";
        
        // Sistema de Pontuação: Acerto base + bônus de eficiência de movimentos
        score += Math.max(100 - (moves * 2), 20);
        scoreEl.textContent = score;

        flippedCards = [];
        isLocked = false;
        renderBoard();

        if(matchedPairs === 8){
          clearInterval(timerInterval);
          // Bônus final por tempo restante
          let timeBonus = Math.max(300 - (seconds * 2), 50);
          score += timeBonus;
          scoreEl.textContent = score;

          setTimeout(() => {
            overlay.style.display = "flex";
            overlay.querySelector("h1").textContent = "PARABÉNS!";
            overlay.querySelector("p").textContent = "Você completou o jogo em " + moves + " movimentos e " + timerEl.textContent + "!\nPontuação Final: " + score + " pontos.";
            startBtn.textContent = "JOGAR NOVAMENTE";
          }, 400);
        }
      } else {
        // Penalidade leve por erro
        score = Math.max(0, score - 5);
        scoreEl.textContent = score;

        setTimeout(() => {
          first.isFlipped = false;
          second.isFlipped = false;
          flippedCards = [];
          isLocked = false;
          renderBoard();
        }, 800);
      }
    }
  }

  startBtn.addEventListener("click", () => {
    overlay.style.display = "none";
    initGame();
  });

  resetBtn.addEventListener("click", () => {
    initGame();
  });

  initGame();
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
  id:"memoria",
  name:"Jogo da Memória",
  category:"Puzzle",
  icon:"🧠",

  init({container}){
    container.innerHTML = MEMORY_HTML;
    executeGameScripts(container);
  }
});