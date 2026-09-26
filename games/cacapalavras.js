import { registerGame } from "../arcade.js";

export const CACAPALAVRAS_HTML = String.raw`<style>
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
  background:#0c2a3a;
  border:2px solid #38bdf8;
  box-shadow:0 0 25px rgba(56,189,248,0.4);
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
  background:#071c27;
  border-bottom:2px solid #38bdf8;
}

.hud b{
  color:#7dd3fc;
}

/* TABULEIRO */
.grid-wrap{
  width:100%;
  padding:28px 8px 12px;
  touch-action:none;
  display:flex;
  justify-content:center;
  overflow:visible;
}

.grid{
  display:grid;
  gap:3px;
  background:#082433;
  padding:8px;
  border-radius:10px;
  user-select:none;
  touch-action:none;
  width:100%;
  max-width:405px;
}

.cell{
  aspect-ratio:1/1;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:21px;
  font-weight:900;
  color:#e0f2fe;
  background:#0c2a3a;
  border-radius:4px;
  line-height:1;
  touch-action:none;
}

.cell.selected{
  background:#0369a1;
  color:#fff;
  transform:scale(1.03);
}

.cell.found{
  background:#16a34a;
  color:#fff;
  transform:scale(1.02);
}

.words-list{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
  justify-content:center;
  padding:10px 14px;
}

.word-chip{
  padding:5px 10px;
  border-radius:14px;
  border:1px solid #38bdf8;
  color:#7dd3fc;
  font-size:10px;
  font-weight:bold;
}

.word-chip.found{
  display:none;
}

.status-msg{
  color:rgba(255,255,255,0.55);
  font-size:10px;
  padding:0 10px 12px;
  text-align:center;
  flex-shrink:0;
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
  background:#0c2a3a;
  border:2px solid #38bdf8;
  border-radius:16px;
  box-shadow:0 0 30px rgba(56,189,248,0.4);
}

.panel h1{
  color:#7dd3fc;
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
  background:linear-gradient(135deg,#38bdf8,#0284c7);
  color:#08131f;
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
  background:#071c27;
  flex-shrink:0;
}

@media(max-width:380px){
  .grid-wrap{
    padding:24px 5px 10px;
  }

  .grid{
    max-width:100%;
    padding:6px;
    gap:2px;
  }

  .cell{
    font-size:18px;
  }

  .words-list{
    padding:8px 8px;
  }
}

@media(max-width:340px){
  .grid-wrap{
    padding:20px 4px 8px;
  }

  .grid{
    padding:5px;
    gap:2px;
  }

  .cell{
    font-size:16px;
  }
}
</style>

<div class="wrap">
  <div class="game" id="game">

    <div class="overlay" id="overlay">
      <div class="panel">
        <h1 id="overlayTitle">🔎 CAÇA-PALAVRAS</h1>

        <p id="overlayText">
          Encontre todas as palavras escondidas no grid.
          Arraste o dedo da primeira até a última letra da palavra
          (na horizontal, vertical ou diagonal).
        </p>

        <button id="startBtn">JOGAR</button>
      </div>
    </div>

    <div class="hud">
      <span>
        Encontradas:
        <b id="foundCountEl">0</b>/<b id="totalCountEl">0</b>
      </span>
    </div>

    <div class="grid-wrap">
      <div class="grid" id="grid"></div>
    </div>

    <div class="words-list" id="wordsList"></div>

    <div class="status-msg">
      Arraste sobre as letras para marcar uma palavra.
    </div>

    <div class="footer-info">
      Caça-Palavras • OBSIDIAN ARCADE
    </div>

  </div>
</div>

<script>
(function(){

  const WORD_BANK=[
    "SOL",
    "LUA",
    "MAR",
    "CEU",
    "FLOR",
    "GATO",
    "CASA",
    "RIO",
    "VENTO",
    "NUVEM",
    "PONTE",
    "FOGO"
  ];

  const SIZE=10;

  const overlay=
    document.getElementById('overlay');

  const overlayTitle=
    document.getElementById('overlayTitle');

  const overlayText=
    document.getElementById('overlayText');

  const startBtn=
    document.getElementById('startBtn');

  const gridEl=
    document.getElementById('grid');

  const wordsListEl=
    document.getElementById('wordsList');

  const foundCountEl=
    document.getElementById('foundCountEl');

  const totalCountEl=
    document.getElementById('totalCountEl');

  gridEl.style.gridTemplateColumns=
    'repeat('+SIZE+',1fr)';

  gridEl.style.width='100%';

  gridEl.style.maxWidth='405px';

  const DIRECTIONS=[
    {dr:0,dc:1},
    {dr:1,dc:0},
    {dr:1,dc:1},
    {dr:1,dc:-1},
    {dr:0,dc:-1},
    {dr:-1,dc:0},
    {dr:-1,dc:-1},
    {dr:-1,dc:1}
  ];

  const LETTERS=
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let grid=[];

  let placedWords=[];

  let foundWords=[];

  let selecting=false;

  let selStart=null;

  let cellEls={};

  /*
   * Cria um grid vazio.
   */
  function emptyGrid(){

    const g=[];

    for(
      let r=0;
      r<SIZE;
      r++
    ){
      g.push(
        new Array(SIZE).fill('')
      );
    }

    return g;
  }

  /*
   * Verifica se uma palavra pode
   * ser colocada naquela direção.
   */
  function canPlace(
    g,
    word,
    r,
    c,
    dr,
    dc
  ){

    for(
      let i=0;
      i<word.length;
      i++
    ){

      const nr=
        r+dr*i;

      const nc=
        c+dc*i;

      if(
        nr<0 ||
        nr>=SIZE ||
        nc<0 ||
        nc>=SIZE
      ){
        return false;
      }

      if(
        g[nr][nc]!=='' &&
        g[nr][nc]!==word[i]
      ){
        return false;
      }
    }

    return true;
  }

  /*
   * Coloca uma palavra no tabuleiro.
   */
  function placeWord(
    g,
    word
  ){

    const attempts=100;

    for(
      let a=0;
      a<attempts;
      a++
    ){

      const dir=
        DIRECTIONS[
          Math.floor(
            Math.random()*
            DIRECTIONS.length
          )
        ];

      const r=
        Math.floor(
          Math.random()*SIZE
        );

      const c=
        Math.floor(
          Math.random()*SIZE
        );

      if(
        canPlace(
          g,
          word,
          r,
          c,
          dir.dr,
          dir.dc
        )
      ){

        const cells=[];

        for(
          let i=0;
          i<word.length;
          i++
        ){

          const nr=
            r+dir.dr*i;

          const nc=
            c+dir.dc*i;

          g[nr][nc]=
            word[i];

          cells.push({
            r:nr,
            c:nc
          });
        }

        return cells;
      }
    }

    return null;
  }

  /*
   * Gera um novo caça-palavras.
   */
  function generatePuzzle(){

    const shuffled=
      WORD_BANK
        .slice()
        .sort(function(){
          return Math.random()-0.5;
        });

    const chosen=
      shuffled.slice(0,8);

    let g=emptyGrid();

    let placed=[];

    chosen.forEach(
      function(word){

        const cells=
          placeWord(
            g,
            word
          );

        if(cells){

          placed.push({
            word:word,
            cells:cells
          });
        }
      }
    );

    for(
      let r=0;
      r<SIZE;
      r++
    ){

      for(
        let c=0;
        c<SIZE;
        c++
      ){

        if(
          g[r][c]===''
        ){

          g[r][c]=
            LETTERS[
              Math.floor(
                Math.random()*
                LETTERS.length
              )
            ];
        }
      }
    }

    grid=g;

    placedWords=placed;
  }

  function cellKey(r,c){
    return r+'_'+c;
  }

  /*
   * Desenha o tabuleiro.
   */
  function renderGrid(){

    gridEl.innerHTML='';

    cellEls={};

    for(
      let r=0;
      r<SIZE;
      r++
    ){

      for(
        let c=0;
        c<SIZE;
        c++
      ){

        const cell=
          document.createElement('div');

        cell.className='cell';

        cell.textContent=
          grid[r][c];

        cell.dataset.r=r;
        cell.dataset.c=c;

        cellEls[
          cellKey(r,c)
        ]=cell;

        gridEl.appendChild(cell);
      }
    }
  }

  /*
   * Mostra as palavras que ainda precisam
   * ser encontradas.
   */
  function renderWordsList(){

    wordsListEl.innerHTML='';

    placedWords.forEach(
      function(pw){

        /*
         * Palavra encontrada não aparece mais
         * na lista inferior.
         */
        if(
          foundWords.indexOf(
            pw.word
          )!==-1
        ){
          return;
        }

        const chip=
          document.createElement('div');

        chip.className='word-chip';

        chip.textContent=
          pw.word;

        chip.dataset.word=
          pw.word;

        wordsListEl.appendChild(
          chip
        );
      }
    );

    totalCountEl.textContent=
      placedWords.length;

    foundCountEl.textContent=
      foundWords.length;
  }

  /*
   * Remove a seleção azul temporária.
   */
  function clearSelectionVisual(){

    Object.keys(cellEls)
      .forEach(
        function(key){

          cellEls[key]
            .classList
            .remove(
              'selected'
            );
        }
      );
  }

  /*
   * Retorna todas as células entre
   * início e fim.
   *
   * Aceita:
   * horizontal
   * vertical
   * diagonal
   */
  function getLine(
    start,
    end
  ){

    const dr=
      Math.sign(
        end.r-start.r
      );

    const dc=
      Math.sign(
        end.c-start.c
      );

    /*
     * Não permite linhas tortas.
     */
    if(
      start.r!==end.r &&
      start.c!==end.c &&
      Math.abs(
        end.r-start.r
      )!==
      Math.abs(
        end.c-start.c
      )
    ){
      return null;
    }

    /*
     * Se o usuário não saiu da célula,
     * mantém somente ela.
     */
    if(
      start.r===end.r &&
      start.c===end.c
    ){
      return [
        {
          r:start.r,
          c:start.c
        }
      ];
    }

    const cells=[];

    let r=start.r;

    let c=start.c;

    cells.push({
      r:r,
      c:c
    });

    while(
      r!==end.r ||
      c!==end.c
    ){

      r+=dr;

      c+=dc;

      /*
       * Segurança contra sair do tabuleiro.
       */
      if(
        r<0 ||
        r>=SIZE ||
        c<0 ||
        c>=SIZE
      ){
        return null;
      }

      cells.push({
        r:r,
        c:c
      });

      if(
        cells.length>
        SIZE+1
      ){
        return null;
      }
    }

    return cells;
  }

  /*
   * Aplica a seleção visual.
   */
  function showSelection(
    endR,
    endC
  ){

    if(
      !selecting ||
      !selStart
    ){
      return;
    }

    const line=
      getLine(
        selStart,
        {
          r:endR,
          c:endC
        }
      );

    clearSelectionVisual();

    if(!line){
      return;
    }

    line.forEach(
      function(cell){

        const el=
          cellEls[
            cellKey(
              cell.r,
              cell.c
            )
          ];

        if(el){
          el.classList.add(
            'selected'
          );
        }
      }
    );
  }

  /*
   * Descobre qual célula está exatamente
   * embaixo do dedo.
   */
  function getCellFromPoint(
    clientX,
    clientY
  ){

    const element=
      document.elementFromPoint(
        clientX,
        clientY
      );

    if(!element){
      return null;
    }

    const cell=
      element.closest(
        '.cell'
      );

    if(
      !cell ||
      !gridEl.contains(cell)
    ){
      return null;
    }

    return {
      r:parseInt(
        cell.dataset.r,
        10
      ),
      c:parseInt(
        cell.dataset.c,
        10
      )
    };
  }

  /*
   * Começa o arrasto.
   */
  function onPointerDown(e){

    if(
      e.pointerType==='mouse' &&
      e.button!==0
    ){
      return;
    }

    const point=
      getCellFromPoint(
        e.clientX,
        e.clientY
      );

    if(!point){
      return;
    }

    selecting=true;

    selStart={
      r:point.r,
      c:point.c
    };

    clearSelectionVisual();

    const cell=
      cellEls[
        cellKey(
          point.r,
          point.c
        )
      ];

    if(cell){
      cell.classList.add(
        'selected'
      );
    }

    e.preventDefault();
  }

  /*
   * Continua o arrasto enquanto
   * o dedo se movimenta.
   */
  function onPointerMove(e){

    if(
      !selecting ||
      !selStart
    ){
      return;
    }

    const point=
      getCellFromPoint(
        e.clientX,
        e.clientY
      );

    if(!point){
      return;
    }

    showSelection(
      point.r,
      point.c
    );

    e.preventDefault();
  }

  /*
   * Finaliza o arrasto.
   */
  function onPointerUp(){

    if(!selecting){
      return;
    }

    selecting=false;

    const selectedEls=
      gridEl.querySelectorAll(
        '.cell.selected'
      );

    const selCells=
      Array.prototype.map.call(
        selectedEls,
        function(el){

          return {
            r:parseInt(
              el.dataset.r,
              10
            ),

            c:parseInt(
              el.dataset.c,
              10
            )
          };
        }
      );

    checkSelection(
      selCells
    );

    clearSelectionVisual();

    selStart=null;
  }

  /*
   * Compara a seleção com a palavra.
   *
   * Aceita a palavra normal e também
   * de trás para frente.
   */
  function cellsMatch(
    a,
    b
  ){

    if(
      a.length!==b.length
    ){
      return false;
    }

    const forward=
      a.every(
        function(cell,i){

          return (
            cell.r===
              b[i].r &&
            cell.c===
              b[i].c
          );
        }
      );

    const backward=
      a.every(
        function(cell,i){

          return (
            cell.r===
              b[
                b.length-1-i
              ].r &&
            cell.c===
              b[
                b.length-1-i
              ].c
          );
        }
      );

    return (
      forward ||
      backward
    );
  }

  /*
   * Verifica se o nome selecionado
   * corresponde a alguma palavra.
   */
  function checkSelection(
    selCells
  ){

    if(
      selCells.length<2
    ){
      return;
    }

    for(
      let i=0;
      i<placedWords.length;
      i++
    ){

      const pw=
        placedWords[i];

      /*
       * Não permite encontrar
       * a mesma palavra duas vezes.
       */
      if(
        foundWords.indexOf(
          pw.word
        )!==-1
      ){
        continue;
      }

      if(
        cellsMatch(
          pw.cells,
          selCells
        )
      ){

        /*
         * Marca a palavra como encontrada.
         */
        foundWords.push(
          pw.word
        );

        /*
         * Mantém as letras permanentemente
         * verdes no tabuleiro.
         */
        pw.cells.forEach(
          function(cell){

            const el=
              cellEls[
                cellKey(
                  cell.r,
                  cell.c
                )
              ];

            if(el){
              el.classList.add(
                'found'
              );
            }
          }
        );

        /*
         * Atualiza a lista.
         * A palavra encontrada desaparece.
         */
        renderWordsList();

        /*
         * Atualiza contador.
         */
        foundCountEl.textContent=
          foundWords.length;

        /*
         * Terminou o jogo.
         */
        if(
          foundWords.length===
          placedWords.length
        ){

          setTimeout(
            finish,
            400
          );
        }

        return;
      }
    }
  }

  /*
   * Tela de vitória.
   */
  function finish(){

    overlayTitle.textContent=
      '🏆 PARABÉNS!';

    overlayText.textContent=
      'Você encontrou todas as '+
      placedWords.length+
      ' palavras escondidas!';

    startBtn.textContent=
      'JOGAR NOVAMENTE';

    overlay.style.display=
      'flex';
  }

  /*
   * Inicia ou reinicia o jogo.
   */
  startBtn.addEventListener(
    'click',
    function(){

      overlay.style.display=
        'none';

      foundWords=[];

      generatePuzzle();

      renderGrid();

      renderWordsList();
    }
  );

  /*
   * Eventos de arrastar.
   *
   * pointermove + elementFromPoint
   * funciona melhor no celular do que
   * pointerenter.
   */
  gridEl.addEventListener(
    'pointerdown',
    onPointerDown
  );

  gridEl.addEventListener(
    'pointermove',
    onPointerMove
  );

  document.addEventListener(
    'pointerup',
    onPointerUp
  );

  document.addEventListener(
    'pointercancel',
    onPointerUp
  );

})();
</script>`;

function executeGameScripts(container){
  const scripts=[
    ...container.querySelectorAll("script")
  ];

  for(
    const oldScript of scripts
  ){

    const script=
      document.createElement("script");

    for(
      const attr of oldScript.attributes
    ){

      script.setAttribute(
        attr.name,
        attr.value
      );
    }

    script.textContent=
      oldScript.textContent;

    oldScript.remove();

    container.appendChild(
      script
    );
  }
}

registerGame({
  id:"cacapalavras",

  name:"Caça-Palavras",

  category:"Puzzle",

  icon:"🔎",

  init({container}){

    container.innerHTML=
      CACAPALAVRAS_HTML;

    executeGameScripts(
      container
    );
  }
});