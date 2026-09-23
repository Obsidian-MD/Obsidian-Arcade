import { registerGame } from "../arcade.js";

const PUZZLE_HTML = String.raw`
<div id="obsidianPuzzle">

<style>
*{
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
  -webkit-user-select:none;
  user-select:none;
  -webkit-touch-callout:none;
}

html,body{
  margin:0;
  padding:0;
  background:#05070b;
}

#obsidianPuzzle{
  width:100%;
  max-width:540px;
  margin:0 auto;
  padding:10px;
  color:#fff;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

#obsidianPuzzle .wrap{
  overflow:hidden;
  border:1px solid rgba(255,255,255,.13);
  border-radius:24px;
  background:
    radial-gradient(circle at 50% -20%,rgba(0,255,255,.12),transparent 40%),
    linear-gradient(145deg,#10141b,#05070b 70%);
  box-shadow:
    0 20px 60px rgba(0,0,0,.5),
    inset 0 0 50px rgba(0,0,0,.35);
}

#obsidianPuzzle .page{
  padding:15px;
}

#obsidianPuzzle .header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  margin-bottom:13px;
}

#obsidianPuzzle .title{
  font-size:21px;
  font-weight:1000;
  letter-spacing:2px;
}

#obsidianPuzzle .subtitle{
  margin-top:5px;
  color:#697482;
  font-size:9px;
  font-weight:900;
  letter-spacing:1.4px;
}

#obsidianPuzzle .stats{
  min-width:75px;
  padding:8px 10px;
  border:1px solid rgba(0,255,255,.25);
  border-radius:12px;
  background:rgba(0,255,255,.045);
  text-align:center;
}

#obsidianPuzzle .stats span{
  display:block;
  color:#00ffff;
  font-size:8px;
  font-weight:900;
  letter-spacing:1px;
}

#obsidianPuzzle .stats b{
  display:block;
  margin-top:3px;
  font-size:19px;
}

#obsidianPuzzle .label{
  margin:12px 0 7px;
  color:#687381;
  font-size:9px;
  font-weight:900;
  letter-spacing:1.4px;
  text-transform:uppercase;
}

#obsidianPuzzle .difficulty{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:7px;
}

#obsidianPuzzle .diff{
  min-height:39px;
  border:1px solid rgba(255,255,255,.1);
  border-radius:11px;
  background:rgba(255,255,255,.035);
  color:#858f9c;
  font-size:11px;
  font-weight:900;
  cursor:pointer;
}

#obsidianPuzzle .diff.active{
  border-color:rgba(0,255,255,.6);
  background:rgba(0,255,255,.08);
  color:#00ffff;
  box-shadow:0 0 14px rgba(0,255,255,.1);
}

#obsidianPuzzle .themeNav{
  display:grid;
  grid-template-columns:42px 1fr 42px;
  gap:7px;
  align-items:center;
}

#obsidianPuzzle .arrow{
  height:42px;
  border:1px solid rgba(255,255,255,.1);
  border-radius:12px;
  background:rgba(255,255,255,.04);
  color:#00ffff;
  font-size:24px;
  font-weight:900;
  cursor:pointer;
}

#obsidianPuzzle .theme{
  min-height:42px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  border:1px solid rgba(255,255,255,.1);
  border-radius:12px;
  background:rgba(255,255,255,.035);
}

#obsidianPuzzle .themeName{
  font-size:11px;
  font-weight:1000;
  letter-spacing:1px;
}

#obsidianPuzzle .themeInfo{
  margin-top:2px;
  color:#687381;
  font-size:8px;
  font-weight:800;
}

#obsidianPuzzle .boardFrame{
  position:relative;
  margin-top:14px;
  padding:5px;
  border:1px solid rgba(255,255,255,.14);
  border-radius:18px;
  background:#020305;
  box-shadow:
    0 0 25px rgba(0,0,0,.6),
    inset 0 0 20px rgba(0,0,0,.8);
}

#obsidianPuzzle .board{
  position:relative;
  width:100%;
  aspect-ratio:1;
  overflow:hidden;
  border-radius:13px;
  background:#080a0e;
}

#obsidianPuzzle .piece{
  position:absolute;
  padding:0;
  margin:0;
  border:0;
  background:transparent;
  cursor:pointer;
  touch-action:manipulation;
  z-index:2;
  transition:
    left .22s cubic-bezier(.2,.8,.2,1),
    top .22s cubic-bezier(.2,.8,.2,1),
    transform .16s ease,
    filter .16s ease;
}

#obsidianPuzzle .piece.selected{
  z-index:50;
  transform:scale(1.035);
  filter:
    drop-shadow(0 0 4px rgba(0,255,255,.9))
    drop-shadow(0 0 14px rgba(0,255,255,.4));
}

#obsidianPuzzle .piece.correct{
  filter:drop-shadow(0 0 5px rgba(0,255,160,.45));
}

#obsidianPuzzle .piece svg{
  width:100%;
  height:100%;
  display:block;
  overflow:visible;
}

#obsidianPuzzle .piece-border{
  fill:none;
  stroke:rgba(255,255,255,.3);
  stroke-width:1.5;
  vector-effect:non-scaling-stroke;
}

#obsidianPuzzle .piece.selected .piece-border{
  stroke:#00ffff;
  stroke-width:2.5;
}

#obsidianPuzzle .piece.correct .piece-border{
  stroke:rgba(0,255,170,.7);
}

#obsidianPuzzle .preview{
  position:absolute;
  inset:5px;
  z-index:100;
  display:none;
  overflow:hidden;
  border-radius:13px;
  background:#000;
}

#obsidianPuzzle .preview.show{
  display:block;
}

#obsidianPuzzle .preview img{
  width:100%;
  height:100%;
  display:block;
  object-fit:cover;
}

#obsidianPuzzle .previewBar{
  position:absolute;
  left:10px;
  right:10px;
  bottom:10px;
  padding:9px;
  border-radius:10px;
  background:rgba(0,0,0,.72);
  color:#fff;
  text-align:center;
  font-size:8px;
  font-weight:900;
  letter-spacing:1px;
  backdrop-filter:blur(8px);
}

#obsidianPuzzle .loading{
  position:absolute;
  inset:5px;
  z-index:90;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:column;
  border-radius:13px;
  background:rgba(0,0,0,.88);
  text-align:center;
}

#obsidianPuzzle .loading.hide{
  display:none;
}

#obsidianPuzzle .loadingIcon{
  font-size:38px;
  animation:puzzlePulse 1s infinite ease-in-out;
}

#obsidianPuzzle .loading b{
  margin-top:7px;
  font-size:12px;
}

#obsidianPuzzle .loading span{
  margin-top:4px;
  color:#7d8794;
  font-size:9px;
}

@keyframes puzzlePulse{
  0%,100%{transform:scale(1)}
  50%{transform:scale(1.12)}
}

#obsidianPuzzle .win{
  position:absolute;
  inset:5px;
  z-index:200;
  display:none;
  align-items:center;
  justify-content:center;
  padding:18px;
  border-radius:13px;
  background:
    linear-gradient(rgba(0,0,0,.72),rgba(0,0,0,.9));
  backdrop-filter:blur(7px);
  text-align:center;
}

#obsidianPuzzle .win.show{
  display:flex;
}

#obsidianPuzzle .winBox{
  width:100%;
  max-width:290px;
}

#obsidianPuzzle .winIcon{
  font-size:51px;
}

#obsidianPuzzle .winTitle{
  margin-top:7px;
  color:#00ffb0;
  font-size:22px;
  font-weight:1000;
  letter-spacing:1.5px;
}

#obsidianPuzzle .winText{
  margin-top:7px;
  color:#b4bdc8;
  font-size:10px;
  line-height:1.5;
}

#obsidianPuzzle .buttons{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
  margin-top:11px;
}

#obsidianPuzzle .btn{
  min-height:43px;
  border:1px solid rgba(0,255,255,.35);
  border-radius:12px;
  background:rgba(0,255,255,.08);
  color:#00ffff;
  font-size:10px;
  font-weight:1000;
  cursor:pointer;
}

#obsidianPuzzle .btn.secondary{
  border-color:rgba(255,255,255,.12);
  background:rgba(255,255,255,.035);
  color:#d8dde3;
}

#obsidianPuzzle .btn:active,
#obsidianPuzzle .arrow:active,
#obsidianPuzzle .diff:active{
  transform:scale(.97);
}

#obsidianPuzzle .bottom{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
  margin-top:11px;
}

#obsidianPuzzle .tip{
  margin-top:10px;
  padding:10px;
  border:1px solid rgba(255,255,255,.07);
  border-radius:11px;
  background:rgba(255,255,255,.025);
  color:#6d7784;
  text-align:center;
  font-size:8.5px;
  line-height:1.5;
}

#obsidianPuzzle .tip b{
  color:#aab3bf;
}

@media(max-width:360px){
  #obsidianPuzzle{
    padding:6px;
  }

  #obsidianPuzzle .page{
    padding:12px;
  }

  #obsidianPuzzle .title{
    font-size:18px;
  }
}
</style>

<div class="wrap">

<div class="page">

  <div class="header">
    <div>
      <div class="title">PHOTO PUZZLE</div>
      <div class="subtitle">QUEBRA-CABEÇA DE FOTOGRAFIAS • OBSIDIAN ARCADE</div>
    </div>

    <div class="stats">
      <span>MOVES</span>
      <b id="moves">0</b>
    </div>
  </div>

  <div class="label">Dificuldade</div>

  <div class="difficulty">
    <button class="diff active" data-size="3">3 × 3</button>
    <button class="diff" data-size="4">4 × 4</button>
    <button class="diff" data-size="5">5 × 5</button>
  </div>

  <div class="label">Fotografia</div>

  <div class="themeNav">
    <button class="arrow" id="prevTheme">‹</button>

    <div class="theme">
      <div class="themeName" id="themeName">LEÃO</div>
      <div class="themeInfo" id="themeInfo">1 / 8</div>
    </div>

    <button class="arrow" id="nextTheme">›</button>
  </div>

  <div class="boardFrame">

    <div class="board" id="board"></div>

    <div class="loading" id="loading">
      <div class="loadingIcon">🧩</div>
      <b>PREPARANDO FOTOGRAFIA</b>
      <span>Carregando imagem real...</span>
    </div>

    <div class="preview" id="preview">
      <img id="previewImage" alt="Fotografia completa">
      <div class="previewBar">
        PREVIEW DA FOTOGRAFIA — TOQUE EM MOSTRAR PARA FECHAR
      </div>
    </div>

    <div class="win" id="win">
      <div class="winBox">
        <div class="winIcon">🏆</div>

        <div class="winTitle">
          COMPLETO!
        </div>

        <div class="winText" id="winText">
          Você montou a fotografia.
        </div>

        <div class="buttons">
          <button class="btn" id="again">
            JOGAR NOVAMENTE
          </button>

          <button class="btn secondary" id="closeWin">
            CONTINUAR
          </button>
        </div>
      </div>
    </div>

  </div>

  <div class="bottom">

    <button class="btn" id="previewBtn">
      👁 MOSTRAR FOTO
    </button>

    <button class="btn secondary" id="shuffleBtn">
      🔀 EMBARALHAR
    </button>

  </div>

  <div class="tip">
    <b>Como jogar:</b>
    toque em duas peças para trocar suas posições.
    Monte a fotografia exatamente como no preview.
  </div>

</div>

</div>

<script>
(function(){

"use strict";

/* ==========================================================
   FOTOGRAFIAS REAIS
   ========================================================== */

var themes = [

  {
    name:"LEÃO",
    url:"https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&w=1200&q=90"
  },

  {
    name:"LOBO",
    url:"https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=90"
  },

  {
    name:"ELEFANTE",
    url:"https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=90"
  },

  {
    name:"TIGRE",
    url:"https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=90"
  },

  {
    name:"MONTANHAS",
    url:"https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=90"
  },

  {
    name:"CACHOEIRA",
    url:"https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1200&q=90"
  },

  {
    name:"PRAIA",
    url:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=90"
  },

  {
    name:"AURORA",
    url:"https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1200&q=90"
  }

];

/* ==========================================================
   ESTADO
   ========================================================== */

var currentTheme = 0;
var boardSize = 3;

var pieces = [];
var selected = -1;
var moves = 0;

var playing = false;
var previewTimer = null;

/* ==========================================================
   DOM
   ========================================================== */

var board = document.getElementById("board");
var movesEl = document.getElementById("moves");

var themeName = document.getElementById("themeName");
var themeInfo = document.getElementById("themeInfo");

var prevTheme = document.getElementById("prevTheme");
var nextTheme = document.getElementById("nextTheme");

var preview = document.getElementById("preview");
var previewImage = document.getElementById("previewImage");
var previewBtn = document.getElementById("previewBtn");

var shuffleBtn = document.getElementById("shuffleBtn");

var loading = document.getElementById("loading");

var win = document.getElementById("win");
var winText = document.getElementById("winText");
var again = document.getElementById("again");
var closeWin = document.getElementById("closeWin");

/* ==========================================================
   UTILITÁRIOS
   ========================================================== */

function uid(){

  return "p_" +
    Math.random().toString(36).slice(2) +
    Date.now().toString(36);

}

function updateMoves(){

  movesEl.textContent = String(moves);

}

/* ==========================================================
   POSIÇÃO
   ========================================================== */

function positionPiece(el,piece){

  var size = board.clientWidth;

  if(!size){
    size = 300;
  }

  var cell = size / boardSize;

  el.style.width = cell + "px";
  el.style.height = cell + "px";

  el.style.left =
    (piece.col * cell) + "px";

  el.style.top =
    (piece.row * cell) + "px";

}

/* ==========================================================
   SVG DA PEÇA
   ========================================================== */

function createPieceSVG(piece){

  var c = piece.originalCol;
  var r = piece.originalRow;

  var size = boardSize;

  var pctX = (c * 100 / size);
  var pctY = (r * 100 / size);

  var pctW = 100 / size;
  var pctH = 100 / size;

  var id = uid();

  /*
   * A imagem inteira é colocada atrás do recorte.
   *
   * Cada peça mostra exatamente o pedaço correspondente
   * da fotografia original.
   */

  var path =
    "M 0 0 " +
    "H 100 " +
    "V 100 " +
    "H 0 Z";

  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" ' +
    'viewBox="0 0 100 100" preserveAspectRatio="none">' +

      '<defs>' +

        '<clipPath id="' + id + '">' +

          '<path d="' + path + '"/>' +

        '</clipPath>' +

      '</defs>' +

      '<g clip-path="url(#' + id + ')">' +

        '<image ' +
          'href="' + themes[currentTheme].url + '" ' +
          'x="' + (-pctX) + '%" ' +
          'y="' + (-pctY) + '%" ' +
          'width="100%" ' +
          'height="100%" ' +
          'preserveAspectRatio="none" ' +
        '/>' +

      '</g>' +

      '<path ' +
        'class="piece-border" ' +
        'd="' + path + '"' +
      '/>' +

    '</svg>';

  return svg;

}

/* ==========================================================
   CRIA TABULEIRO
   ========================================================== */

function createPieces(){

  pieces = [];

  var positions = [];

  for(var r = 0; r < boardSize; r++){

    for(var c = 0; c < boardSize; c++){

      positions.push({
        row:r,
        col:c
      });

    }

  }

  for(var i = positions.length - 1; i > 0; i--){

    var j =
      Math.floor(
        Math.random() * (i + 1)
      );

    var temp = positions[i];

    positions[i] = positions[j];
    positions[j] = temp;

  }

  /*
   * Evita começar exatamente resolvido.
   */

  var solved = true;

  for(var k = 0; k < positions.length; k++){

    var originalRow =
      Math.floor(k / boardSize);

    var originalCol =
      k % boardSize;

    if(
      positions[k].row !== originalRow ||
      positions[k].col !== originalCol
    ){

      solved = false;
      break;

    }

  }

  if(solved && positions.length > 1){

    var swap = positions[0];

    positions[0] = positions[1];
    positions[1] = swap;

  }

  for(var n = 0; n < positions.length; n++){

    var originalR =
      Math.floor(n / boardSize);

    var originalC =
      n % boardSize;

    pieces.push({

      id:uid(),

      originalRow:originalR,
      originalCol:originalC,

      row:positions[n].row,
      col:positions[n].col,

      element:null

    });

  }

}

/* ==========================================================
   RENDER
   ========================================================== */

function render(){

  board.innerHTML = "";

  var fragment =
    document.createDocumentFragment();

  for(var i = 0; i < pieces.length; i++){

    var piece = pieces[i];

    var button =
      document.createElement("button");

    button.type = "button";

    button.className = "piece";

    button.dataset.index =
      String(i);

    button.setAttribute(
      "aria-label",
      "Peça " + (i + 1)
    );

    button.innerHTML =
      createPieceSVG(piece);

    if(
      piece.row === piece.originalRow &&
      piece.col === piece.originalCol
    ){

      button.classList.add("correct");

    }

    positionPiece(button,piece);

    button.addEventListener(
      "click",
      function(){

        selectPiece(
          Number(this.dataset.index)
        );

      }
    );

    piece.element = button;

    fragment.appendChild(button);

  }

  board.appendChild(fragment);

}

/* ==========================================================
   SELEÇÃO
   ========================================================== */

function selectPiece(index){

  if(!playing){
    return;
  }

  if(
    index < 0 ||
    index >= pieces.length
  ){
    return;
  }

  if(selected === -1){

    selected = index;

    if(pieces[index].element){

      pieces[index]
        .element
        .classList
        .add("selected");

    }

    return;

  }

  if(selected === index){

    pieces[index]
      .element
      .classList
      .remove("selected");

    selected = -1;

    return;

  }

  var first = pieces[selected];
  var second = pieces[index];

  /*
   * Troca somente a posição.
   */

  var row = first.row;
  var col = first.col;

  first.row = second.row;
  first.col = second.col;

  second.row = row;
  second.col = col;

  moves++;

  updateMoves();

  first.element.classList.remove("selected");

  positionPiece(first.element,first);
  positionPiece(second.element,second);

  updateCorrect(first);
  updateCorrect(second);

  selected = -1;

  if(
    first.element
  ){

    first.element.style.transform =
      "scale(1.035)";

    setTimeout(function(){

      if(first.element){
        first.element.style.transform = "";
      }

    },160);

  }

  if(
    second.element
  ){

    second.element.style.transform =
      "scale(1.035)";

    setTimeout(function(){

      if(second.element){
        second.element.style.transform = "";
      }

    },160);

  }

  if(isSolved()){

    finish();

  }

}

/* ==========================================================
   PEÇA CORRETA
   ========================================================== */

function updateCorrect(piece){

  if(!piece.element){
    return;
  }

  if(
    piece.row === piece.originalRow &&
    piece.col === piece.originalCol
  ){

    piece.element.classList.add("correct");

  }else{

    piece.element.classList.remove("correct");

  }

}

/* ==========================================================
   VERIFICAÇÃO
   ========================================================== */

function isSolved(){

  for(var i = 0; i < pieces.length; i++){

    if(
      pieces[i].row !==
      pieces[i].originalRow ||

      pieces[i].col !==
      pieces[i].originalCol
    ){

      return false;

    }

  }

  return true;

}

/* ==========================================================
   PREVIEW
   ========================================================== */

function showPreview(){

  if(preview.classList.contains("show")){

    preview.classList.remove("show");

    previewBtn.textContent =
      "👁 MOSTRAR FOTO";

    clearTimeout(previewTimer);

    return;

  }

  previewImage.src =
    themes[currentTheme].url;

  preview.classList.add("show");

  previewBtn.textContent =
    "🙈 FECHAR FOTO";

  clearTimeout(previewTimer);

  previewTimer =
    setTimeout(function(){

      preview.classList.remove("show");

      previewBtn.textContent =
        "👁 MOSTRAR FOTO";

    },5000);

}

/* ==========================================================
   FINAL
   ========================================================== */

function finish(){

  playing = false;

  selected = -1;

  winText.textContent =
    "Você montou a fotografia " +
    themes[currentTheme].name +
    " em " +
    moves +
    " movimentos.";

  win.classList.add("show");

}

/* ==========================================================
   NOVO JOGO
   ========================================================== */

function startGame(){

  clearTimeout(previewTimer);

  selected = -1;

  moves = 0;

  playing = true;

  updateMoves();

  preview.classList.remove("show");

  previewBtn.textContent =
    "👁 MOSTRAR FOTO";

  win.classList.remove("show");

  themeName.textContent =
    themes[currentTheme].name;

  themeInfo.textContent =
    (currentTheme + 1) +
    " / " +
    themes.length;

  loading.classList.remove("hide");

  /*
   * Pré-carrega a fotografia.
   */

  var image =
    new Image();

  image.onload = function(){

    loading.classList.add("hide");

    createPieces();

    render();

  };

  image.onerror = function(){

    loading.classList.add("hide");

    /*
     * Mesmo que a imagem demore ou falhe,
     * mantém o tabuleiro utilizável.
     */

    createPieces();

    render();

  };

  image.src =
    themes[currentTheme].url;

}

/* ==========================================================
   EMBARALHAR
   ========================================================== */

shuffleBtn.addEventListener(
  "click",
  function(){

    startGame();

  }
);

/* ==========================================================
   PREVIEW
   ========================================================== */

previewBtn.addEventListener(
  "click",
  function(){

    showPreview();

  }
);

/* ==========================================================
   DIFICULDADE
   ========================================================== */

var diffButtons =
  document.querySelectorAll(".diff");

for(
  var d = 0;
  d < diffButtons.length;
  d++
){

  diffButtons[d].addEventListener(
    "click",
    function(){

      var size =
        Number(this.dataset.size);

      if(
        size !== 3 &&
        size !== 4 &&
        size !== 5
      ){
        return;
      }

      boardSize = size;

      for(
        var x = 0;
        x < diffButtons.length;
        x++
      ){

        diffButtons[x]
          .classList
          .remove("active");

      }

      this.classList.add("active");

      startGame();

    }
  );

}

/* ==========================================================
   FOTOGRAFIA ANTERIOR
   ========================================================== */

prevTheme.addEventListener(
  "click",
  function(){

    currentTheme--;

    if(currentTheme < 0){

      currentTheme =
        themes.length - 1;

    }

    startGame();

  }
);

/* ==========================================================
   FOTOGRAFIA SEGUINTE
   ========================================================== */

nextTheme.addEventListener(
  "click",
  function(){

    currentTheme++;

    if(
      currentTheme >=
      themes.length
    ){

      currentTheme = 0;

    }

    startGame();

  }
);

/* ==========================================================
   NOVAMENTE
   ========================================================== */

again.addEventListener(
  "click",
  function(){

    startGame();

  }
);

/* ==========================================================
   FECHAR
   ========================================================== */

closeWin.addEventListener(
  "click",
  function(){

    win.classList.remove("show");

  }
);

/* ==========================================================
   RESPONSIVIDADE
   ========================================================== */

window.addEventListener(
  "resize",
  function(){

    for(
      var i = 0;
      i < pieces.length;
      i++
    ){

      if(pieces[i].element){

        positionPiece(
          pieces[i].element,
          pieces[i]
        );

      }

    }

  }
);

/* ==========================================================
   INICIAR
   ========================================================== */

startGame();

})();
</script>

</div>
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

  id:"quebracabeca",

  name:"Quebra-Cabeça",

  category:"Puzzle",

  icon:"🧩",

  init({container}){

    container.innerHTML =
      PUZZLE_HTML;

    executeGameScripts(container);

  }

});