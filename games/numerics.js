import { registerGame } from "../arcade.js";

export const NUMERICS_HTML = String.raw`<style>
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
  font-size:19px;
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

.numbers-list{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
  justify-content:center;
  padding:10px 14px;
}

.number-chip{
  padding:5px 10px;
  border-radius:14px;
  border:1px solid #38bdf8;
  color:#7dd3fc;
  font-size:10px;
  font-weight:bold;
  letter-spacing:1px;
}

.number-chip.found{
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
    font-size:17px;
  }

  .numbers-list{
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
    font-size:15px;
  }
}
</style>

<div class="wrap">
  <div class="game" id="game">

    <div class="overlay" id="overlay">

      <div class="panel">

        <h1 id="overlayTitle">
          🔢 NUMERICS
        </h1>

        <p id="overlayText">
          Encontre todas as sequências numéricas escondidas no grid.
          Arraste o dedo da primeira até a última posição da sequência
          na horizontal, vertical ou diagonal.
        </p>

        <button id="startBtn">
          JOGAR
        </button>

      </div>

    </div>

    <div class="hud">

      <span>
        Encontradas:
        <b id="foundCountEl">0</b>/<b id="totalCountEl">0</b>
      </span>

    </div>

    <div class="grid-wrap">

      <div
        class="grid"
        id="grid"
      ></div>

    </div>

    <div
      class="numbers-list"
      id="numbersList"
    ></div>

    <div class="status-msg">
      Arraste sobre os números para marcar uma sequência.
    </div>

    <div class="footer-info">
      Numerics • OBSIDIAN ARCADE
    </div>

  </div>
</div>

<script>
(function(){

  /*
   * SEQUÊNCIAS NUMÉRICAS
   */
  const NUMBER_BANK=[
    "123",
    "456",
    "789",
    "147",
    "258",
    "369",
    "159",
    "357",
    "246",
    "864",
    "975",
    "321",
    "654",
    "987",
    "741",
    "852",
    "963",
    "951",
    "753",
    "426"
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

  const numbersListEl=
    document.getElementById('numbersList');

  const foundCountEl=
    document.getElementById('foundCountEl');

  const totalCountEl=
    document.getElementById('totalCountEl');

  gridEl.style.gridTemplateColumns=
    'repeat('+SIZE+',1fr)';

  gridEl.style.width='100%';

  gridEl.style.maxWidth='405px';

  /*
   * Todas as direções possíveis.
   */
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

  /*
   * Números usados para preencher
   * as casas restantes.
   */
  const DIGITS=
    '0123456789';

  let grid=[];

  let placedNumbers=[];

  let foundNumbers=[];

  let selecting=false;

  let selStart=null;

  let cellEls={};

  /*
   * Cria grid vazio.
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
   * Verifica se uma sequência
   * pode ser colocada.
   */
  function canPlace(
    g,
    number,
    r,
    c,
    dr,
    dc
  ){

    for(
      let i=0;
      i<number.length;
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
        g[nr][nc]!==number[i]
      ){
        return false;
      }
    }

    return true;
  }

  /*
   * Coloca uma sequência no grid.
   */
  function placeNumber(
    g,
    number
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
          number,
          r,
          c,
          dir.dr,
          dir.dc
        )
      ){

        const cells=[];

        for(
          let i=0;
          i<number.length;
          i++
        ){

          const nr=
            r+dir.dr*i;

          const nc=
            c+dir.dc*i;

          g[nr][nc]=
            number[i];

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
   * Gera um novo Numerics.
   */
  function generatePuzzle(){

    const shuffled=
      NUMBER_BANK
        .slice()
        .sort(function(){
          return Math.random()-0.5;
        });

    const chosen=
      shuffled.slice(0,8);

    let g=emptyGrid();

    let placed=[];

    chosen.forEach(
      function(number){

        const cells=
          placeNumber(
            g,
            number
          );

        if(cells){

          placed.push({
            number:number,
            cells:cells
          });

        }

      }
    );

    /*
     * Preenche as casas vazias
     * com números aleatórios.
     */
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
            DIGITS[
              Math.floor(
                Math.random()*
                DIGITS.length
              )
            ];

        }

      }

    }

    grid=g;

    placedNumbers=placed;

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

        gridEl.appendChild(
          cell
        );

      }

    }

  }

  /*
   * Mostra as sequências que
   * ainda precisam ser encontradas.
   */
  function renderNumbersList(){

    numbersListEl.innerHTML='';

    placedNumbers.forEach(
      function(pn){

        /*
         * Número encontrado desaparece
         * da lista.
         */
        if(
          foundNumbers.indexOf(
            pn.number
          )!==-1
        ){
          return;
        }

        const chip=
          document.createElement('div');

        chip.className='number-chip';

        chip.textContent=
          pn.number;

        chip.dataset.number=
          pn.number;

        numbersListEl.appendChild(
          chip
        );

      }
    );

    totalCountEl.textContent=
      placedNumbers.length;

    foundCountEl.textContent=
      foundNumbers.length;

  }

  /*
   * Limpa seleção azul temporária.
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
   * Retorna todas as células
   * entre início e fim.
   *
   * Horizontal
   * Vertical
   * Diagonal
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
     * Uma única célula.
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
   * Aplica seleção visual.
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
   * Descobre a célula exatamente
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
   * Continua o arrasto.
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
   * Compara a seleção com a sequência.
   *
   * Aceita normal e invertida.
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
   * Verifica a sequência selecionada.
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
      i<placedNumbers.length;
      i++
    ){

      const pn=
        placedNumbers[i];

      /*
       * Não permite encontrar
       * a mesma sequência duas vezes.
       */
      if(
        foundNumbers.indexOf(
          pn.number
        )!==-1
      ){

        continue;

      }

      if(
        cellsMatch(
          pn.cells,
          selCells
        )
      ){

        /*
         * Marca encontrada.
         */
        foundNumbers.push(
          pn.number
        );

        /*
         * Mantém as posições
         * permanentemente verdes.
         */
        pn.cells.forEach(
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
         */
        renderNumbersList();

        /*
         * Atualiza contador.
         */
        foundCountEl.textContent=
          foundNumbers.length;

        /*
         * Verifica vitória.
         */
        if(
          foundNumbers.length===
          placedNumbers.length
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
      placedNumbers.length+
      ' sequências numéricas escondidas!';

    startBtn.textContent=
      'JOGAR NOVAMENTE';

    overlay.style.display=
      'flex';

  }

  /*
   * Inicia ou reinicia.
   */
  startBtn.addEventListener(
    'click',
    function(){

      overlay.style.display=
        'none';

      foundNumbers=[];

      generatePuzzle();

      renderGrid();

      renderNumbersList();

    }
  );

  /*
   * Eventos de arrastar.
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
  id:"numerics",

  name:"Numerics",

  category:"Puzzle",

  icon:"🔢",

  init({container}){

    container.innerHTML=
      NUMERICS_HTML;

    executeGameScripts(
      container
    );

  }
});