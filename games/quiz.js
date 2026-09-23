import { registerGame } from "../arcade.js";

const QUIZ_HTML = String.raw`<style>
*{
  -webkit-tap-highlight-color:transparent;
  -webkit-user-select:none;
  user-select:none;
  -webkit-touch-callout:none;
  box-sizing:border-box
}

html,
body{
  margin:0;
  padding:0;
  background:#05070b;
}

#obsidianQuiz{
  width:100%;
  max-width:420px;
  margin:auto;
  padding:70px 12px 30px;
  font-family:Arial,sans-serif;
  color:#d5dde1;
}

#obsidianQuiz .wrap{
  width:100%;
}

#obsidianQuiz .card{
  background:rgba(10,14,26,.97);
  border:1px solid rgba(56,189,248,.28);
  border-radius:18px;
  overflow:hidden;
  box-shadow:
    0 8px 35px rgba(0,0,0,.45),
    0 0 25px rgba(56,189,248,.08)
}

#obsidianQuiz .head{
  padding:13px 16px;
  border-bottom:1px solid rgba(56,189,248,.15);
  display:flex;
  justify-content:space-between;
  align-items:center
}

#obsidianQuiz .brand{
  font-size:9px;
  letter-spacing:2px;
  color:rgba(56,189,248,.55);
  margin-bottom:3px
}

#obsidianQuiz .title{
  font-size:17px;
  font-weight:bold;
  color:#fff;
  text-shadow:0 0 10px rgba(56,189,248,.45)
}

#obsidianQuiz .hud{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:7px;
  padding:10px 12px
}

#obsidianQuiz .hudBox{
  background:rgba(56,189,248,.055);
  border:1px solid rgba(56,189,248,.13);
  border-radius:9px;
  padding:7px 4px;
  text-align:center
}

#obsidianQuiz .hudLabel{
  font-size:8px;
  letter-spacing:1px;
  color:rgba(255,255,255,.4);
  margin-bottom:3px
}

#obsidianQuiz .hudValue{
  font-size:15px;
  font-weight:bold;
  color:#38bdf8;
  text-shadow:0 0 8px rgba(56,189,248,.35)
}

#obsidianQuiz .gameArea{
  position:relative;
  width:100%;
  padding:8px 12px 12px;
  min-height:310px;
  display:flex;
  flex-direction:column;
  justify-content:space-between
}

#obsidianQuiz .questionBox{
  background:#020813;
  border:1px solid rgba(56,189,248,.18);
  border-radius:12px;
  padding:14px;
  box-shadow:inset 0 0 25px rgba(0,0,0,.7);
  margin-bottom:10px
}

#obsidianQuiz .qText{
  font-size:14px;
  font-weight:bold;
  color:#f8fafc;
  line-height:1.4;
  text-align:center;
  margin-bottom:4px
}

#obsidianQuiz .optionsContainer{
  display:flex;
  flex-direction:column;
  gap:7px
}

#obsidianQuiz .optBtn{
  width:100%;
  background:rgba(56,189,248,.07);
  border:1px solid rgba(56,189,248,.22);
  color:#e2e8f0;
  border-radius:9px;
  padding:11px 12px;
  font-size:13px;
  font-weight:500;
  text-align:left;
  cursor:pointer;
  touch-action:manipulation;
  transition:all .15s ease
}

#obsidianQuiz .optBtn:active{
  transform:scale(.98);
  background:rgba(56,189,248,.2)
}

#obsidianQuiz .optBtn.correct{
  background:rgba(34,197,94,.25)!important;
  border-color:#22c55e!important;
  color:#4ade80!important
}

#obsidianQuiz .optBtn.wrong{
  background:rgba(239,68,68,.25)!important;
  border-color:#ef4444!important;
  color:#f87171!important
}

#obsidianQuiz .overlay{
  position:absolute;
  inset:8px 12px 12px;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:column;
  background:rgba(2,6,15,.92);
  border-radius:12px;
  z-index:5;
  backdrop-filter:blur(3px);
  padding:20px;
  text-align:center
}

#obsidianQuiz .overlay.hidden{
  display:none
}

#obsidianQuiz .overlayTitle{
  color:#38bdf8;
  font-size:22px;
  font-weight:bold;
  text-shadow:0 0 15px rgba(56,189,248,.5);
  margin-bottom:8px
}

#obsidianQuiz .overlayText{
  color:rgba(255,255,255,.68);
  font-size:11px;
  line-height:1.5;
  margin-bottom:18px
}

#obsidianQuiz .startBtn{
  border:1px solid rgba(56,189,248,.5);
  background:rgba(56,189,248,.15);
  color:#38bdf8;
  border-radius:10px;
  padding:12px 24px;
  font-size:13px;
  font-weight:bold;
  cursor:pointer;
  touch-action:manipulation;
  box-shadow:0 0 15px rgba(56,189,248,.1)
}

#obsidianQuiz .startBtn:active{
  transform:scale(.96);
  background:rgba(56,189,248,.3)
}

#obsidianQuiz .tip{
  text-align:center;
  font-size:8px;
  color:rgba(255,255,255,.28);
  padding-bottom:10px;
  letter-spacing:.3px
}

@media(max-width:360px){
  #obsidianQuiz{
    padding:60px 7px 25px;
  }

  #obsidianQuiz .title{
    font-size:15px;
  }

  #obsidianQuiz .qText{
    font-size:13px;
  }

  #obsidianQuiz .optBtn{
    font-size:12px;
    padding:10px;
  }
}
</style>

<div id="obsidianQuiz">

<div class="wrap">

  <div class="card">

    <div class="head">

      <div>

        <div class="brand">
          OBSIDIAN ARCADE
        </div>

        <div class="title">
          QUIZ INTERATIVO
        </div>

      </div>

    </div>

    <div class="hud">

      <div class="hudBox">

        <div class="hudLabel">
          PERGUNTA
        </div>

        <div class="hudValue" id="qCounter">
          1/10
        </div>

      </div>

      <div class="hudBox">

        <div class="hudLabel">
          PONTOS
        </div>

        <div class="hudValue" id="score">
          0
        </div>

      </div>

    </div>

    <div class="gameArea">

      <div class="questionBox">

        <div class="qText" id="qText">
          Carregando pergunta...
        </div>

      </div>

      <div
        class="optionsContainer"
        id="optionsContainer">
      </div>

      <div class="overlay" id="overlay">

        <div
          class="overlayTitle"
          id="overlayTitle">
          QUIZ NEON
        </div>

        <div
          class="overlayText"
          id="overlayText">
          Teste seus conhecimentos em várias categorias respondendo diretamente na tela com toques rápidos!
        </div>

        <button
          class="startBtn"
          id="startBtn">
          ▶ INICIAR QUIZ
        </button>

      </div>

    </div>

    <div class="tip">
      Toque na alternativa correta para responder
    </div>

  </div>

</div>

</div>

<script>
(function(){

"use strict";

var questions = [

  {
    q:"Qual é a capital do Brasil?",
    options:[
      "São Paulo",
      "Rio de Janeiro",
      "Brasília",
      "Salvador"
    ],
    answer:2
  },

  {
    q:"Quanto é 9 x 8?",
    options:[
      "72",
      "81",
      "64",
      "70"
    ],
    answer:0
  },

  {
    q:"Qual planeta é conhecido como o Planeta Vermelho?",
    options:[
      "Vênus",
      "Marte",
      "Júpiter",
      "Saturno"
    ],
    answer:1
  },

  {
    q:"Quem escreveu o livro 'Dom Casmurro'?",
    options:[
      "José de Alencar",
      "Machado de Assis",
      "Jorge Amado",
      "Clarice Lispector"
    ],
    answer:1
  },

  {
    q:"Qual o maior oceano do planeta Terra?",
    options:[
      "Oceano Atlântico",
      "Oceano Índico",
      "Oceano Ártico",
      "Oceano Pacífico"
    ],
    answer:3
  },

  {
    q:"Em que ano o homem pisou na Lua pela primeira vez?",
    options:[
      "1965",
      "1969",
      "1971",
      "1975"
    ],
    answer:1
  },

  {
    q:"Qual é o elemento químico representado pelo símbolo 'O'?",
    options:[
      "Ouro",
      "Ósmio",
      "Oxigênio",
      "Oxalato"
    ],
    answer:2
  },

  {
    q:"Quantos estados compõem o país Estados Unidos?",
    options:[
      "48",
      "50",
      "52",
      "51"
    ],
    answer:1
  },

  {
    q:"Qual é o animal terrestre mais rápido do mundo?",
    options:[
      "Leão",
      "Guepardo",
      "Cavalo",
      "Antílope"
    ],
    answer:1
  },

  {
    q:"Qual a principal linguagem usada para estilizar páginas web?",
    options:[
      "HTML",
      "Python",
      "CSS",
      "SQL"
    ],
    answer:2
  }

];

var currentIndex = 0;
var score = 0;
var locked = false;
var audioContext = null;

var qCounter =
  document.getElementById("qCounter");

var scoreEl =
  document.getElementById("score");

var qText =
  document.getElementById("qText");

var optionsContainer =
  document.getElementById("optionsContainer");

var overlay =
  document.getElementById("overlay");

var overlayTitle =
  document.getElementById("overlayTitle");

var overlayText =
  document.getElementById("overlayText");

var startBtn =
  document.getElementById("startBtn");

/* ==========================================================
   INÍCIO
   ========================================================== */

function startGame(){

  currentIndex = 0;

  score = 0;

  locked = false;

  scoreEl.textContent =
    String(score);

  overlay.classList.add("hidden");

  loadQuestion();

  beep(440,.07);

}

/* ==========================================================
   PERGUNTA
   ========================================================== */

function loadQuestion(){

  locked = false;

  var current =
    questions[currentIndex];

  qCounter.textContent =
    (currentIndex + 1) +
    "/" +
    questions.length;

  qText.textContent =
    current.q;

  optionsContainer.innerHTML = "";

  for(
    var i = 0;
    i < current.options.length;
    i++
  ){

    createOption(
      current.options[i],
      i
    );

  }

}

/* ==========================================================
   CRIA ALTERNATIVA
   ========================================================== */

function createOption(text,index){

  var btn =
    document.createElement("button");

  btn.type = "button";

  btn.className =
    "optBtn";

  btn.textContent =
    text;

  btn.dataset.index =
    String(index);

  btn.addEventListener(
    "click",
    function(event){

      if(event){

        event.preventDefault();
        event.stopPropagation();

      }

      selectOption(
        index,
        btn
      );

    }
  );

  optionsContainer.appendChild(btn);

}

/* ==========================================================
   RESPOSTA
   ========================================================== */

function selectOption(index,btn){

  if(locked){
    return;
  }

  locked = true;

  var current =
    questions[currentIndex];

  var allBtns =
    optionsContainer.querySelectorAll(
      ".optBtn"
    );

  if(
    index ===
    current.answer
  ){

    btn.classList.add("correct");

    score += 10;

    scoreEl.textContent =
      String(score);

    beep(650,.06);

  }else{

    btn.classList.add("wrong");

    if(allBtns[current.answer]){

      allBtns[
        current.answer
      ].classList.add("correct");

    }

    beep(180,.12);

  }

  setTimeout(
    function(){

      currentIndex++;

      if(
        currentIndex <
        questions.length
      ){

        loadQuestion();

      }else{

        endGame();

      }

    },
    1100
  );

}

/* ==========================================================
   FINAL
   ========================================================== */

function endGame(){

  locked = true;

  overlayTitle.textContent =
    "FIM DE JOGO! 🎉";

  overlayText.innerHTML =
    "Você concluiu o quiz!<br>" +
    "Pontuação final: <b>" +
    score +
    "</b> / " +
    (questions.length * 10);

  startBtn.textContent =
    "↻ JOGAR NOVAMENTE";

  overlay.classList.remove(
    "hidden"
  );

  beep(500,.1);

}

/* ==========================================================
   SOM
   ========================================================== */

function beep(frequency,duration){

  try{

    if(!audioContext){

      var AudioCtx =
        window.AudioContext ||
        window.webkitAudioContext;

      if(!AudioCtx){
        return;
      }

      audioContext =
        new AudioCtx();

    }

    if(
      audioContext.state ===
      "suspended"
    ){

      audioContext.resume();

    }

    var osc =
      audioContext.createOscillator();

    var gain =
      audioContext.createGain();

    osc.frequency.value =
      frequency;

    osc.type =
      "sine";

    gain.gain.setValueAtTime(
      .04,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      .001,
      audioContext.currentTime +
      duration
    );

    osc.connect(gain);

    gain.connect(
      audioContext.destination
    );

    osc.start();

    osc.stop(
      audioContext.currentTime +
      duration
    );

  }catch(e){}

}

/* ==========================================================
   BOTÃO
   ========================================================== */

startBtn.addEventListener(
  "click",
  function(event){

    if(event){

      event.preventDefault();
      event.stopPropagation();

    }

    startGame();

  }
);

/* ==========================================================
   ESTADO INICIAL
   ========================================================== */

qText.textContent =
  questions[0].q;

})();
</script>
`;

function executeGameScripts(container){

  const scripts = [
    ...container.querySelectorAll("script")
  ];

  for(const oldScript of scripts){

    const script =
      document.createElement("script");

    for(const attr of oldScript.attributes){

      script.setAttribute(
        attr.name,
        oldScript.getAttribute(attr.name)
      );

    }

    script.textContent =
      oldScript.textContent;

    oldScript.remove();

    container.appendChild(script);

  }

}

registerGame({

  id:"quiz",

  name:"Quiz Interativo",

  category:"Conhecimento",

  icon:"❓",

  init({container}){

    container.innerHTML =
      QUIZ_HTML;

    executeGameScripts(container);

  }

});