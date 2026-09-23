import { registerGame } from "../arcade.js";

const HANGMAN_HTML = String.raw`<style>
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
  min-height:48px;
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

.hud span b{
  color:#60a5fa;
  font-size:13px;
}

.board-container{
  position:relative;
  width:min(90vw,340px);
  height:180px;
  margin:12px auto 0;
  background:#000;
  border:3px solid #1e3a8a;
  border-radius:12px;
  box-shadow:0 0 15px rgba(0,0,0,0.8);
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  flex-shrink:0;
}

canvas{
  display:block;
  background:transparent;
}

.word-container{
  margin:10px 0;
  font-size:24px;
  font-weight:bold;
  letter-spacing:6px;
  color:#60a5fa;
  text-align:center;
  min-height:36px;
}

.keyboard{
  width:94%;
  max-width:360px;
  display:flex;
  flex-wrap:wrap;
  gap:4px;
  justify-content:center;
  margin-bottom:8px;
}

.key{
  width:30px;
  height:36px;
  background:#1e293b;
  border:1px solid #3b82f6;
  border-radius:6px;
  color:#fff;
  font-size:12px;
  font-weight:bold;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  transition:0.1s;
}

.key:active{
  background:#3b82f6;
}

.key.used{
  background:#0f172a;
  border-color:#334155;
  color:#475569;
  cursor:default;
}

.footer-panel{
  width:100%;
  flex:1;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  background:#080814;
  padding:6px 16px;
  gap:6px;
}

.stats-row{
  display:flex;
  justify-content:space-around;
  width:100%;
  color:rgba(255,255,255,0.8);
  font-size:11px;
  font-weight:bold;
}

.stats-row b{
  color:#38bdf8;
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
      <div>JOGO: <span>FORCA BOT</span></div>
      <div>DICA: <span id="hint-category"><b>GERAL</b></span></div>
    </div>

    <div class="board-container">
      <canvas id="hangmanCanvas" width="160" height="150"></canvas>
    </div>

    <div class="word-container" id="word-display">_ _ _ _ _</div>

    <div class="keyboard" id="keyboard"></div>

    <div class="footer-panel">
      <div class="stats-row">
        <div>Erros: <b id="errors">0</b>/6</div>
        <div>Pontos: <b id="score">0</b></div>
      </div>
    </div>

    <div class="overlay" id="overlay">
      <div class="panel">
        <h1>JOGO DA FORCA</h1>
        <p>Adivinhe a palavra oculta letra por letra antes que o boneco seja enforcado. Acerte países, comidas, animais e cidades!</p>
        <button class="start-btn" id="start-btn">INICIAR PARTIDA</button>
      </div>
    </div>

  </div>
</div>

<script>
(function(){
  const WORDS = [
    { word: "PIZZA", hint: "COMIDA TÍPICA" },
    { word: "CHURRASCO", hint: "COMIDA TÍPICA" },
    { word: "BRIGADEIRO", hint: "DOCE" },
    { word: "BRASIL", hint: "PAÍS" },
    { word: "ARGENTINA", hint: "PAÍS" },
    { word: "JAPAO", hint: "PAÍS" },
    { word: "SANGUISGA", hint: "ANIMAL" },
    { word: "ELEFANTE", hint: "ANIMAL" },
    { word: "GANGURU", hint: "ANIMAL" },
    { word: "MARANHAO", hint: "ESTADO BRASILEIRO" },
    { word: "SAOPAULO", hint: "CIDADE / ESTADO" },
    { word: "SALVADOR", hint: "CAPITAL" },
    { word: "FORTALEZA", hint: "CAPITAL" }
  ];

  const canvas = document.getElementById("hangmanCanvas");
  const ctx = canvas.getContext("2d");
  const wordDisplayEl = document.getElementById("word-display");
  const keyboardEl = document.getElementById("keyboard");
  const errorsEl = document.getElementById("errors");
  const scoreEl = document.getElementById("score");
  const hintCategoryEl = document.getElementById("hint-category");
  const overlay = document.getElementById("overlay");
  const startBtn = document.getElementById("start-btn");

  let currentWordObj = {};
  let guessedLetters = new Set();
  let errors = 0;
  let score = 0;
  const maxErrors = 6;

  function initGame(){
    errors = 0;
    guessedLetters.clear();
    errorsEl.textContent = errors;
    scoreEl.textContent = score;

    currentWordObj = WORDS[Math.floor(Math.random() * WORDS.length)];
    hintCategoryEl.innerHTML = "<b>" + currentWordObj.hint + "</b>";

    renderWord();
    renderKeyboard();
    drawHangman();
  }

  function renderWord(){
    let displayHtml = "";
    let won = true;
    for(let i = 0; i < currentWordObj.word.length; i++){
      let letter = currentWordObj.word[i];
      if(guessedLetters.has(letter)){
        displayHtml += letter + " ";
      } else {
        displayHtml += "_ ";
        won = false;
      }
    }
    wordDisplayEl.textContent = displayHtml.trim();

    if(won){
      score += 50 + (maxErrors - errors) * 10;
      scoreEl.textContent = score;
      setTimeout(() => {
        overlay.style.display = "flex";
        overlay.querySelector("h1").textContent = "MUITO BEM!";
        overlay.querySelector("p").textContent = "Você acertou a palavra: " + currentWordObj.word + "!\nPontuação atual: " + score;
        startBtn.textContent = "PRÓXIMA PALAVRA";
      }, 300);
    }
  }

  function renderKeyboard(){
    keyboardEl.innerHTML = "";
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let i = 0; i < alphabet.length; i++){
      let letter = alphabet[i];
      let btn = document.createElement("button");
      btn.className = "key";
      btn.textContent = letter;
      if(guessedLetters.has(letter)){
        btn.classList.add("used");
      } else {
        btn.addEventListener("click", () => handleGuess(letter));
      }
      keyboardEl.appendChild(btn);
    }
  }

  function handleGuess(letter){
    if(guessedLetters.has(letter) || errors >= maxErrors) return;
    guessedLetters.add(letter);

    if(!currentWordObj.word.includes(letter)){
      errors++;
      errorsEl.textContent = errors;
      score = Math.max(0, score - 5);
      scoreEl.textContent = score;
    }

    renderWord();
    renderKeyboard();
    drawHangman();

    if(errors >= maxErrors){
      setTimeout(() => {
        overlay.style.display = "flex";
        overlay.querySelector("h1").textContent = "FIM DE JOGO";
        overlay.querySelector("p").textContent = "Você foi enforcado! A palavra era:\n" + currentWordObj.word + "\nPontuação Final: " + score;
        startBtn.textContent = "TENTAR NOVAMENTE";
        score = 0;
      }, 300);
    }
  }

  function drawHangman(){
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 3;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Base da forca
    ctx.beginPath();
    ctx.moveTo(20, 140);
    ctx.lineTo(100, 140);
    ctx.moveTo(50, 140);
    ctx.lineTo(50, 20);
    ctx.lineTo(110, 20);
    ctx.lineTo(110, 40);
    ctx.stroke();

    // Partes do boneco conforme os erros
    if(errors > 0){
      // Cabeça
      ctx.beginPath();
      ctx.arc(110, 55, 12, 0, Math.PI * 2);
      ctx.stroke();
    }
    if(errors > 1){
      // Tronco
      ctx.beginPath();
      ctx.moveTo(110, 67);
      ctx.lineTo(110, 105);
      ctx.stroke();
    }
    if(errors > 2){
      // Braço esquerdo
      ctx.beginPath();
      ctx.moveTo(110, 75);
      ctx.lineTo(90, 95);
      ctx.stroke();
    }
    if(errors > 3){
      // Braço direito
      ctx.beginPath();
      ctx.moveTo(110, 75);
      ctx.lineTo(130, 95);
      ctx.stroke();
    }
    if(errors > 4){
      // Perna esquerda
      ctx.beginPath();
      ctx.moveTo(110, 105);
      ctx.lineTo(95, 130);
      ctx.stroke();
    }
    if(errors > 5){
      // Perna direita
      ctx.beginPath();
      ctx.moveTo(110, 105);
      ctx.lineTo(125, 130);
      ctx.stroke();
    }
  }

  startBtn.addEventListener("click", () => {
    overlay.style.display = "none";
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
  id:"forca",
  name:"Jogo da Forca",
  category:"Palavras",
  icon:"🪢",

  init({container}){
    container.innerHTML = HANGMAN_HTML;
    executeGameScripts(container);
  }
});