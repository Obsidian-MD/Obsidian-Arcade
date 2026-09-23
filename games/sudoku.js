import { registerGame } from "../arcade.js";

const SUDOKU_HTML = String.raw`<style>
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
  min-height:600px;
  border-radius:24px;
  background:#181c24;
  border:2px solid #60a5fa;
  box-shadow:0 0 25px rgba(96,165,250,0.4);
  display:flex;
  flex-direction:column;
  align-items:center;
  overflow:hidden;
}

.hud{
  width:100%;
  padding:10px 14px;
  display:flex;
  justify-content:space-between;
  color:#fff;
  font-size:12px;
  font-weight:bold;
  background:#0e1117;
  border-bottom:2px solid #60a5fa;
}

.hud b{
  color:#93c5fd;
}

.diff-row{
  display:flex;
  gap:6px;
  padding:8px 12px;
  width:100%;
  max-width:410px;
  flex-shrink:0;
}

.diff-btn{
  flex:1;
  padding:7px;
  border-radius:8px;
  border:1px solid #60a5fa;
  background:rgba(96,165,250,0.12);
  color:#93c5fd;
  font-size:10px;
  font-weight:bold;
  cursor:pointer;
}

.diff-btn.active{
  background:#60a5fa;
  color:#0e1117;
}

/* TABULEIRO GRANDE */
.board-wrap{
  width:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:24px 7px 10px;
  flex-shrink:0;
}

.board{
  display:grid;
  grid-template-columns:repeat(9,1fr);
  width:100%;
  max-width:410px;
  background:#0e1117;
  border:3px solid #60a5fa;
  border-radius:8px;
  overflow:hidden;
  box-shadow:0 0 18px rgba(96,165,250,0.25);
}

.cell{
  aspect-ratio:1/1;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:23px;
  font-weight:900;
  background:#1e2432;
  color:#93c5fd;
  border:1px solid #2a3142;
  cursor:pointer;
  line-height:1;
}

.cell.fixed{
  color:#fff;
  background:#151922;
  cursor:default;
}

.cell.selected{
  background:#2563eb;
  color:#fff;
}

.cell.error{
  color:#f87171;
  background:#3a1820;
}

.cell:nth-child(3n){
  border-right:2px solid #60a5fa;
}

.cell:nth-child(9n+1){
  border-left:2px solid #60a5fa;
}

.row-thick{
  border-bottom:2px solid #60a5fa;
}

/* TECLADO MAIOR */
.numpad{
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:6px;
  padding:10px 10px 12px;
  width:100%;
  max-width:410px;
}

.num-btn{
  padding:12px 0;
  min-height:43px;
  border-radius:8px;
  border:1px solid #60a5fa;
  background:rgba(96,165,250,0.12);
  color:#93c5fd;
  font-weight:bold;
  font-size:15px;
  cursor:pointer;
}

.num-btn:active{
  background:rgba(96,165,250,0.4);
  transform:scale(0.97);
}

.status-msg{
  color:rgba(255,255,255,0.55);
  font-size:10px;
  padding:0 10px 8px;
  text-align:center;
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
  background:#181c24;
  border:2px solid #60a5fa;
  border-radius:16px;
  box-shadow:0 0 30px rgba(96,165,250,0.4);
}

.panel h1{
  color:#93c5fd;
  font-size:16px;
  margin:0 0 10px;
}

.panel p{
  color:rgba(255,255,255,0.75);
  font-size:12px;
  line-height:1.5;
  margin:0 0 18px;
}

#startBtn{
  width:100%;
  padding:13px;
  border-radius:10px;
  border:none;
  background:linear-gradient(135deg,#60a5fa,#2563eb);
  color:#0e1117;
  font-family:'Courier New',Courier,monospace;
  font-weight:bold;
  font-size:13px;
  cursor:pointer;
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
  background:#0e1117;
}

/* CELULARES MENORES */
@media(max-width:380px){

  .board-wrap{
    padding:20px 5px 8px;
  }

  .board{
    max-width:100%;
    border-width:2px;
  }

  .cell{
    font-size:20px;
  }

  .numpad{
    padding-left:7px;
    padding-right:7px;
    gap:5px;
  }

  .num-btn{
    min-height:40px;
    padding:10px 0;
    font-size:14px;
  }
}

@media(max-width:340px){

  .board-wrap{
    padding:16px 4px 7px;
  }

  .board{
    max-width:100%;
  }

  .cell{
    font-size:18px;
  }

  .numpad{
    gap:4px;
    padding-left:5px;
    padding-right:5px;
  }

  .num-btn{
    min-height:37px;
    padding:8px 0;
    font-size:13px;
  }
}
</style>

<div class="wrap"><div class="game" id="game">

  <div class="overlay" id="overlay">
    <div class="panel">
      <h1 id="overlayTitle">🔢 SUDOKU</h1>

      <p id="overlayText">
        Preencha o tabuleiro 9x9 sem repetir números na linha, coluna ou quadrante 3x3.
      </p>

      <button id="startBtn">
        JOGAR (FÁCIL)
      </button>
    </div>
  </div>

  <div class="hud">
    <span>
      Erros:
      <b id="errCountEl">0</b>
    </span>

    <span>
      Dificuldade:
      <b id="diffLabel">Fácil</b>
    </span>
  </div>

  <div class="diff-row">
    <button class="diff-btn active" data-diff="easy">
      Fácil
    </button>

    <button class="diff-btn" data-diff="medium">
      Médio
    </button>

    <button class="diff-btn" data-diff="hard">
      Difícil
    </button>
  </div>

  <div class="board-wrap">
    <div class="board" id="board"></div>
  </div>

  <div class="numpad" id="numpad"></div>

  <div class="status-msg" id="statusMsg">
    Toque numa célula vazia e escolha um número.
  </div>

  <div class="footer-info">
    Sudoku • OBSIDIAN ARCADE
  </div>

</div></div>

<script>
(function(){

  const overlay=
    document.getElementById('overlay');

  const overlayTitle=
    document.getElementById('overlayTitle');

  const overlayText=
    document.getElementById('overlayText');

  const startBtn=
    document.getElementById('startBtn');

  const boardEl=
    document.getElementById('board');

  const numpad=
    document.getElementById('numpad');

  const errCountEl=
    document.getElementById('errCountEl');

  const diffLabel=
    document.getElementById('diffLabel');

  const statusMsg=
    document.getElementById('statusMsg');

  const diffBtns=
    Array.prototype.slice.call(
      document.querySelectorAll(
        '.diff-btn'
      )
    );

  const HOLES={
    easy:36,
    medium:46,
    hard:54
  };

  const DIFF_NAMES={
    easy:'Fácil',
    medium:'Médio',
    hard:'Difícil'
  };

  let difficulty='easy';

  let solution=[];

  let puzzle=[];

  let userGrid=[];

  let fixedCells=[];

  let selected=null;

  let errors=0;

  let gameOver=false;

  function emptyGrid(v){

    const g=[];

    for(
      let r=0;
      r<9;
      r++
    ){

      g.push(
        new Array(9).fill(
          v===undefined ? 0 : v
        )
      );
    }

    return g;
  }

  function isValid(
    g,
    r,
    c,
    val
  ){

    for(
      let i=0;
      i<9;
      i++
    ){

      if(
        i!==c &&
        g[r][i]===val
      ){
        return false;
      }

      if(
        i!==r &&
        g[i][c]===val
      ){
        return false;
      }
    }

    const br=
      Math.floor(r/3)*3;

    const bc=
      Math.floor(c/3)*3;

    for(
      let dr=0;
      dr<3;
      dr++
    ){

      for(
        let dc=0;
        dc<3;
        dc++
      ){

        const rr=
          br+dr;

        const cc=
          bc+dc;

        if(
          (rr!==r || cc!==c) &&
          g[rr][cc]===val
        ){
          return false;
        }
      }
    }

    return true;
  }

  function shuffle(arr){

    for(
      let i=arr.length-1;
      i>0;
      i--
    ){

      const j=
        Math.floor(
          Math.random()*(i+1)
        );

      const tmp=
        arr[i];

      arr[i]=arr[j];

      arr[j]=tmp;
    }

    return arr;
  }

  function fillGrid(g){

    for(
      let pos=0;
      pos<81;
      pos++
    ){

      const r=
        Math.floor(pos/9);

      const c=
        pos%9;

      if(
        g[r][c]!==0
      ){
        continue;
      }

      const nums=
        shuffle([
          1,2,3,4,5,6,7,8,9
        ]);

      for(
        let i=0;
        i<nums.length;
        i++
      ){

        if(
          isValid(
            g,
            r,
            c,
            nums[i]
          )
        ){

          g[r][c]=
            nums[i];

          if(
            fillGrid(g)
          ){
            return true;
          }

          g[r][c]=0;
        }
      }

      return false;
    }

    return true;
  }

  function generateSolution(){

    const g=
      emptyGrid(0);

    fillGrid(g);

    return g;
  }

  function makePuzzle(
    sol,
    holes
  ){

    const g=
      sol.map(
        function(row){
          return row.slice();
        }
      );

    let removed=0;

    const positions=
      shuffle(
        Array.from(
          {
            length:81
          },
          function(_,i){
            return i;
          }
        )
      );

    let idx=0;

    while(
      removed<holes &&
      idx<positions.length
    ){

      const pos=
        positions[idx++];

      const r=
        Math.floor(pos/9);

      const c=
        pos%9;

      if(
        g[r][c]!==0
      ){

        g[r][c]=0;

        removed++;
      }
    }

    return g;
  }

  function buildBoard(){

    boardEl.innerHTML='';

    for(
      let r=0;
      r<9;
      r++
    ){

      for(
        let c=0;
        c<9;
        c++
      ){

        const cell=
          document.createElement(
            'div'
          );

        cell.className=
          'cell'+
          (
            r%3===2 &&
            r!==8
              ?' row-thick'
              :''
          );

        cell.dataset.r=r;
        cell.dataset.c=c;

        cell.addEventListener(
          'click',
          function(){
            onCellClick(r,c);
          }
        );

        boardEl.appendChild(
          cell
        );
      }
    }
  }

  function buildNumpad(){

    numpad.innerHTML='';

    for(
      let n=1;
      n<=9;
      n++
    ){

      const btn=
        document.createElement(
          'div'
        );

      btn.className='num-btn';

      btn.textContent=n;

      btn.addEventListener(
        'click',
        function(){
          onNumberInput(n);
        }
      );

      numpad.appendChild(
        btn
      );
    }

    const eraseBtn=
      document.createElement(
        'div'
      );

    eraseBtn.className=
      'num-btn';

    eraseBtn.textContent='⌫';

    eraseBtn.addEventListener(
      'click',
      function(){
        onNumberInput(0);
      }
    );

    numpad.appendChild(
      eraseBtn
    );
  }

  function render(){

    const cells=
      boardEl.children;

    for(
      let r=0;
      r<9;
      r++
    ){

      for(
        let c=0;
        c<9;
        c++
      ){

        const idx=
          r*9+c;

        const cell=
          cells[idx];

        const val=
          userGrid[r][c];

        cell.textContent=
          val===0
            ?''
            :val;

        cell.className=
          'cell'+
          (
            r%3===2 &&
            r!==8
              ?' row-thick'
              :''
          )+
          (
            fixedCells[r][c]
              ?' fixed'
              :''
          );

        if(
          selected &&
          selected.r===r &&
          selected.c===c
        ){

          cell.classList.add(
            'selected'
          );
        }
      }
    }
  }

  function onCellClick(
    r,
    c
  ){

    if(
      gameOver ||
      fixedCells[r][c]
    ){
      return;
    }

    selected={
      r:r,
      c:c
    };

    render();
  }

  function onNumberInput(n){

    if(
      !selected ||
      gameOver
    ){
      return;
    }

    const r=
      selected.r;

    const c=
      selected.c;

    if(
      fixedCells[r][c]
    ){
      return;
    }

    if(n===0){

      userGrid[r][c]=0;

      render();

      statusMsg.textContent=
        'Número apagado.';

      return;
    }

    userGrid[r][c]=n;

    render();

    if(
      n!==solution[r][c]
    ){

      errors++;

      errCountEl.textContent=
        errors;

      const cellIdx=
        r*9+c;

      boardEl
        .children[cellIdx]
        .classList
        .add('error');

      statusMsg.textContent=
        'Número errado! Tente outro.';

      setTimeout(
        function(){

          if(
            boardEl.children[cellIdx]
          ){

            boardEl
              .children[cellIdx]
              .classList
              .remove(
                'error'
              );
          }

        },
        700
      );

      if(
        errors>=5
      ){

        gameOver=true;

        finish(false);
      }

      return;
    }

    statusMsg.textContent=
      'Certo!';

    if(
      checkComplete()
    ){

      gameOver=true;

      finish(true);
    }
  }

  function checkComplete(){

    for(
      let r=0;
      r<9;
      r++
    ){

      for(
        let c=0;
        c<9;
        c++
      ){

        if(
          userGrid[r][c]!==solution[r][c]
        ){
          return false;
        }
      }
    }

    return true;
  }

  function finish(won){

    overlayTitle.textContent=
      won
        ?'🏆 SUDOKU COMPLETO!'
        :'💀 MUITOS ERROS!';

    overlayText.textContent=
      won
        ?'Você completou o Sudoku com '+errors+' erro(s)!'
        :'Você chegou a 5 erros. Tente novamente!';

    startBtn.textContent=
      'JOGAR NOVAMENTE';

    overlay.style.display=
      'flex';
  }

  diffBtns.forEach(
    function(btn){

      btn.addEventListener(
        'click',
        function(){

          difficulty=
            btn.dataset.diff;

          diffBtns.forEach(
            function(b){
              b.classList.remove(
                'active'
              );
            }
          );

          btn.classList.add(
            'active'
          );

          startBtn.textContent=
            'JOGAR ('+
            DIFF_NAMES[
              difficulty
            ].toUpperCase()+
            ')';
        }
      );
    }
  );

  startBtn.addEventListener(
    'click',
    function(){

      overlay.style.display=
        'none';

      solution=
        generateSolution();

      puzzle=
        makePuzzle(
          solution,
          HOLES[difficulty]
        );

      userGrid=
        puzzle.map(
          function(row){
            return row.slice();
          }
        );

      fixedCells=
        puzzle.map(
          function(row){
            return row.map(
              function(v){
                return v!==0;
              }
            );
          }
        );

      errors=0;

      gameOver=false;

      selected=null;

      errCountEl.textContent=0;

      diffLabel.textContent=
        DIFF_NAMES[difficulty];

      statusMsg.textContent=
        'Toque numa célula vazia e escolha um número.';

      buildBoard();

      render();
    }
  );

  buildBoard();

  buildNumpad();

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
  id:"sudoku",
  name:"Sudoku",
  category:"Puzzle",
  icon:"🔢",

  init({container}){
    container.innerHTML = SUDOKU_HTML;
    executeGameScripts(container);
  }
});