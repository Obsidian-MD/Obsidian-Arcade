import { registerGame } from "../arcade.js";

export const UNO_HTML = String.raw`<style>
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
  min-height:650px;
  border-radius:24px;
  background:
    radial-gradient(circle at 50% 45%,#243044 0%,#10151e 55%,#080b10 100%);
  border:2px solid #ef4444;
  box-shadow:0 0 25px rgba(239,68,68,.4);
  display:flex;
  flex-direction:column;
  align-items:center;
  overflow:hidden;
}

.hud{
  width:100%;
  padding:9px 12px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  color:#fff;
  font-size:10px;
  font-weight:bold;
  background:#090c12;
  border-bottom:2px solid #ef4444;
}

.hud b{
  color:#fca5a5;
}

.turn{
  padding:4px 8px;
  border-radius:8px;
  background:rgba(255,255,255,.08);
  color:#fff;
}

.players{
  width:100%;
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:6px;
  padding:8px 8px 4px;
}

.player-box{
  min-width:0;
  padding:7px 4px;
  text-align:center;
  border-radius:10px;
  background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.1);
  color:#fff;
}

.player-box.active{
  border-color:#fbbf24;
  box-shadow:0 0 12px rgba(251,191,36,.3);
}

.player-name{
  font-size:9px;
  font-weight:bold;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.player-count{
  margin-top:4px;
  font-size:13px;
  color:#fbbf24;
  font-weight:900;
}

.table{
  position:relative;
  width:100%;
  flex:1;
  min-height:235px;
  display:flex;
  align-items:center;
  justify-content:center;
}

.discard-area{
  position:relative;
  width:105px;
  height:145px;
  display:flex;
  align-items:center;
  justify-content:center;
}

.deck-card{
  position:absolute;
  width:72px;
  height:105px;
  border-radius:11px;
  background:
    repeating-linear-gradient(
      45deg,
      #171717 0,
      #171717 4px,
      #242424 4px,
      #242424 8px
    );
  border:3px solid #fff;
  box-shadow:0 5px 14px rgba(0,0,0,.5);
  transform:translateX(-32px) rotate(-8deg);
}

.deck-card::after{
  content:"UNO";
  position:absolute;
  inset:22px 7px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#e11d48;
  color:#fff;
  font-weight:900;
  font-size:13px;
  transform:rotate(-35deg);
  border:2px solid #fff;
}

.card{
  position:relative;
  width:72px;
  height:105px;
  flex:0 0 72px;
  border-radius:11px;
  border:3px solid #fff;
  box-shadow:0 4px 10px rgba(0,0,0,.45);
  cursor:pointer;
  overflow:hidden;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:900;
  font-size:29px;
  color:#fff;
  text-shadow:2px 2px 2px rgba(0,0,0,.45);
}

.card::before{
  content:"";
  position:absolute;
  width:53px;
  height:78px;
  border-radius:50%;
  border:2px solid rgba(255,255,255,.7);
  transform:rotate(-35deg);
}

.card .value{
  position:relative;
  z-index:2;
}

.card.red{
  background:#dc2626;
}

.card.yellow{
  background:#eab308;
  color:#171717;
  text-shadow:none;
}

.card.green{
  background:#16a34a;
}

.card.blue{
  background:#2563eb;
}

.card.wild{
  background:
    conic-gradient(
      #dc2626 0 25%,
      #eab308 25% 50%,
      #16a34a 50% 75%,
      #2563eb 75% 100%
    );
}

.card.small{
  width:55px;
  height:78px;
  flex-basis:55px;
  font-size:21px;
  border-width:2px;
}

.card.small::before{
  width:39px;
  height:58px;
}

.card.disabled{
  opacity:.45;
  cursor:default;
}

.discard-card{
  position:relative;
  z-index:2;
}

.color-indicator{
  position:absolute;
  bottom:2px;
  left:50%;
  transform:translateX(-50%);
  width:15px;
  height:15px;
  border-radius:50%;
  border:2px solid #fff;
  box-shadow:0 1px 4px rgba(0,0,0,.5);
}

.color-indicator.red{
  background:#dc2626;
}

.color-indicator.yellow{
  background:#eab308;
}

.color-indicator.green{
  background:#16a34a;
}

.color-indicator.blue{
  background:#2563eb;
}

.message{
  min-height:32px;
  width:100%;
  padding:5px 12px;
  text-align:center;
  color:rgba(255,255,255,.8);
  font-size:10px;
  line-height:1.4;
}

.player-hand-wrap{
  width:100%;
  padding:6px 6px 4px;
  background:rgba(0,0,0,.22);
  border-top:1px solid rgba(255,255,255,.08);
}

.hand-title{
  color:#fca5a5;
  font-size:9px;
  text-align:center;
  margin-bottom:6px;
  font-weight:bold;
}

.hand{
  width:100%;
  min-height:112px;
  display:flex;
  align-items:flex-end;
  justify-content:center;
  overflow-x:auto;
  overflow-y:hidden;
  padding:4px 3px 7px;
  scrollbar-width:none;
}

.hand::-webkit-scrollbar{
  display:none;
}

.hand .card{
  margin-left:-13px;
  transition:transform .12s ease;
}

.hand .card:first-child{
  margin-left:0;
}

.hand .card:not(.disabled):active{
  transform:translateY(-10px);
}

.actions{
  width:100%;
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:6px;
  padding:7px 8px 10px;
}

.action-btn{
  min-height:42px;
  border:1px solid #ef4444;
  border-radius:9px;
  background:rgba(239,68,68,.12);
  color:#fecaca;
  font-family:inherit;
  font-size:10px;
  font-weight:bold;
  cursor:pointer;
}

.action-btn:active{
  transform:scale(.97);
  background:rgba(239,68,68,.3);
}

.action-btn:disabled{
  opacity:.35;
  cursor:default;
}

.uno-btn{
  grid-column:1/-1;
  border-color:#fbbf24;
  color:#fde68a;
  background:rgba(251,191,36,.1);
}

.color-panel{
  position:absolute;
  z-index:80;
  inset:0;
  display:none;
  align-items:center;
  justify-content:center;
  padding:20px;
  background:rgba(0,0,0,.86);
}

.color-box{
  width:100%;
  max-width:280px;
  padding:20px;
  border-radius:18px;
  background:#111827;
  border:2px solid #fff;
  text-align:center;
}

.color-box h2{
  margin:0 0 16px;
  color:#fff;
  font-size:15px;
}

.color-buttons{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
}

.color-btn{
  min-height:48px;
  border:2px solid #fff;
  border-radius:10px;
  color:#fff;
  font-family:inherit;
  font-weight:900;
  cursor:pointer;
}

.color-btn.red{
  background:#dc2626;
}

.color-btn.yellow{
  background:#eab308;
  color:#111;
}

.color-btn.green{
  background:#16a34a;
}

.color-btn.blue{
  background:#2563eb;
}

.overlay{
  position:absolute;
  z-index:100;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
  background:rgba(0,0,0,.93);
}

.panel{
  width:100%;
  max-width:320px;
  padding:23px;
  border-radius:18px;
  background:#111827;
  border:2px solid #ef4444;
  box-shadow:0 0 30px rgba(239,68,68,.35);
  text-align:center;
}

.panel h1{
  margin:0 0 10px;
  color:#fca5a5;
  font-size:22px;
}

.panel p{
  margin:0 0 18px;
  color:rgba(255,255,255,.75);
  font-size:11px;
  line-height:1.55;
}

#startBtn{
  width:100%;
  min-height:46px;
  border:0;
  border-radius:10px;
  background:linear-gradient(135deg,#ef4444,#b91c1c);
  color:#fff;
  font-family:inherit;
  font-weight:900;
  cursor:pointer;
}

@media(max-width:380px){

  .game{
    min-height:620px;
  }

  .table{
    min-height:215px;
  }

  .card{
    width:65px;
    height:96px;
    flex-basis:65px;
    font-size:26px;
  }

  .card::before{
    width:48px;
    height:70px;
  }

  .hand{
    min-height:103px;
  }

  .hand .card{
    margin-left:-16px;
  }
}

@media(max-width:340px){

  .card{
    width:60px;
    height:88px;
    flex-basis:60px;
    font-size:24px;
  }

  .card::before{
    width:44px;
    height:65px;
  }

  .hand{
    min-height:96px;
  }

  .hand .card{
    margin-left:-18px;
  }
}
</style>

<div class="wrap">
  <div class="game">

    <div class="overlay" id="overlay">
      <div class="panel">
        <h1>🎴 UNO</h1>

        <p id="overlayText">
          Jogue suas cartas combinando cor ou número.
          Use cartas especiais para atrapalhar os adversários.
          Quando ficar com uma carta, aperte UNO!
        </p>

        <button id="startBtn">
          JOGAR
        </button>
      </div>
    </div>

    <div class="color-panel" id="colorPanel">

      <div class="color-box">

        <h2>🌈 ESCOLHA UMA COR</h2>

        <div class="color-buttons">

          <button class="color-btn red" data-color="red">
            VERMELHO
          </button>

          <button class="color-btn yellow" data-color="yellow">
            AMARELO
          </button>

          <button class="color-btn green" data-color="green">
            VERDE
          </button>

          <button class="color-btn blue" data-color="blue">
            AZUL
          </button>

        </div>

      </div>

    </div>

    <div class="hud">

      <span>
        Carta:
        <b id="colorLabel">-</b>
      </span>

      <span class="turn" id="turnLabel">
        Sua vez
      </span>

      <span>
        Baralho:
        <b id="deckCount">0</b>
      </span>

    </div>

    <div class="players">

      <div class="player-box" id="bot1Box">
        <div class="player-name">🤖 ZÉ</div>
        <div class="player-count" id="bot1Count">7</div>
      </div>

      <div class="player-box" id="bot2Box">
        <div class="player-name">🤖 LIA</div>
        <div class="player-count" id="bot2Count">7</div>
      </div>

      <div class="player-box" id="bot3Box">
        <div class="player-name">🤖 MAX</div>
        <div class="player-count" id="bot3Count">7</div>
      </div>

    </div>

    <div class="table">

      <div class="discard-area">

        <div class="deck-card"></div>

        <div id="discardCard"></div>

      </div>

    </div>

    <div class="message" id="message">
      Comece uma nova partida.
    </div>

    <div class="player-hand-wrap">

      <div class="hand-title">
        SUA MÃO
      </div>

      <div class="hand" id="playerHand"></div>

    </div>

    <div class="actions">

      <button
        class="action-btn"
        id="drawBtn"
      >
        🃏 COMPRAR
      </button>

      <button
        class="action-btn"
        id="passBtn"
        disabled
      >
        ➡️ PASSAR
      </button>

      <button
        class="action-btn uno-btn"
        id="unoBtn"
      >
        🔥 UNO!
      </button>

    </div>

  </div>
</div>

<script>
(function(){

  const COLORS=[
    'red',
    'yellow',
    'green',
    'blue'
  ];

  const COLOR_NAMES={
    red:'Vermelho',
    yellow:'Amarelo',
    green:'Verde',
    blue:'Azul'
  };

  let deck=[];

  let discard=[];

  let player=[];

  let bots=[
    [],
    [],
    []
  ];

  let currentPlayer=0;

  let direction=1;

  let currentColor=null;

  let gameRunning=false;

  let waitingColor=false;

  let unoCalled=false;

  let unoTimer=null;

  const overlay=
    document.getElementById('overlay');

  const overlayText=
    document.getElementById('overlayText');

  const startBtn=
    document.getElementById('startBtn');

  const colorPanel=
    document.getElementById('colorPanel');

  const discardCard=
    document.getElementById('discardCard');

  const playerHand=
    document.getElementById('playerHand');

  const message=
    document.getElementById('message');

  const colorLabel=
    document.getElementById('colorLabel');

  const deckCount=
    document.getElementById('deckCount');

  const turnLabel=
    document.getElementById('turnLabel');

  const drawBtn=
    document.getElementById('drawBtn');

  const passBtn=
    document.getElementById('passBtn');

  const unoBtn=
    document.getElementById('unoBtn');

  const botBoxes=[
    document.getElementById('bot1Box'),
    document.getElementById('bot2Box'),
    document.getElementById('bot3Box')
  ];

  const botCounts=[
    document.getElementById('bot1Count'),
    document.getElementById('bot2Count'),
    document.getElementById('bot3Count')
  ];

  /*
   * Cria o baralho oficial simplificado:
   * 19 cartas por cor + especiais
   * + 4 coringas + 4 +4.
   */
  function createDeck(){

    const result=[];

    COLORS.forEach(function(color){

      result.push({
        color:color,
        value:'0',
        type:'number'
      });

      for(let n=1;n<=9;n++){

        result.push({
          color:color,
          value:String(n),
          type:'number'
        });

        result.push({
          color:color,
          value:String(n),
          type:'number'
        });

      }

      for(let i=0;i<2;i++){

        result.push({
          color:color,
          value:'+2',
          type:'draw2'
        });

        result.push({
          color:color,
          value:'↻',
          type:'reverse'
        });

        result.push({
          color:color,
          value:'⊘',
          type:'skip'
        });

      }

    });

    for(let i=0;i<4;i++){

      result.push({
        color:null,
        value:'★',
        type:'wild'
      });

      result.push({
        color:null,
        value:'+4',
        type:'wild4'
      });

    }

    return result;
  }

  function shuffle(array){

    for(
      let i=array.length-1;
      i>0;
      i--
    ){

      const j=
        Math.floor(
          Math.random()*(i+1)
        );

      const temp=array[i];

      array[i]=array[j];

      array[j]=temp;

    }

    return array;
  }

  /*
   * Compra carta do baralho.
   */
  function drawCard(){

    if(deck.length===0){
      rebuildDeck();
    }

    return deck.pop();

  }

  /*
   * Reconstrói o baralho usando
   * o descarte, preservando a última carta.
   */
  function rebuildDeck(){

    if(discard.length<=1){
      return;
    }

    const top=
      discard.pop();

    deck=
      shuffle(
        discard.splice(0)
      );

    discard.push(top);

  }

  /*
   * Inicializa partida.
   */
  function startGame(){

    clearTimeout(unoTimer);

    deck=
      shuffle(
        createDeck()
      );

    discard=[];

    player=[];

    bots=[
      [],
      [],
      []
    ];

    currentPlayer=0;

    direction=1;

    currentColor=null;

    gameRunning=true;

    waitingColor=false;

    unoCalled=false;

    /*
     * Distribui 7 cartas.
     */
    for(let i=0;i<7;i++){

      player.push(
        drawCard()
      );

      bots[0].push(
        drawCard()
      );

      bots[1].push(
        drawCard()
      );

      bots[2].push(
        drawCard()
      );

    }

    /*
     * Primeira carta não pode ser
     * coringa ou carta de ação.
     */
    let first;

    do{

      first=drawCard();

    }while(
      first.type!=='number'
    );

    discard.push(first);

    currentColor=
      first.color;

    overlay.style.display='none';

    message.textContent=
      'Sua vez! Escolha uma carta válida.';

    render();

  }

  /*
   * Verifica se uma carta pode
   * ser jogada.
   */
  function canPlay(card){

    if(!card){
      return false;
    }

    if(
      card.type==='wild' ||
      card.type==='wild4'
    ){
      return true;
    }

    const top=
      discard[
        discard.length-1
      ];

    if(!top){
      return true;
    }

    return (
      card.color===currentColor ||
      card.value===top.value
    );

  }

  /*
   * Compra carta para jogador.
   */
  function playerDraw(){

    if(
      !gameRunning ||
      currentPlayer!==0 ||
      waitingColor
    ){
      return;
    }

    const card=drawCard();

    if(card){
      player.push(card);

      message.textContent=
        'Você comprou uma carta.';

      render();

      /*
       * Se a carta puder ser jogada,
       * o jogador pode decidir passar
       * ou jogar manualmente.
       */
      if(canPlay(card)){

        passBtn.disabled=false;

      }else{

        setTimeout(
          function(){
            nextTurn();
          },
          450
        );

      }

    }

  }

  /*
   * Jogador passa depois de comprar.
   */
  function playerPass(){

    if(
      !gameRunning ||
      currentPlayer!==0 ||
      waitingColor
    ){
      return;
    }

    passBtn.disabled=true;

    nextTurn();

  }

  /*
   * Joga uma carta do jogador.
   */
  function playPlayerCard(index){

    if(
      !gameRunning ||
      currentPlayer!==0 ||
      waitingColor
    ){
      return;
    }

    const card=player[index];

    if(!canPlay(card)){

      message.textContent=
        'Essa carta não pode ser jogada agora.';

      return;

    }

    /*
     * +4 só pode ser usada normalmente
     * quando não existe carta da cor atual.
     */
    if(card.type==='wild4'){

      const hasColorCard=
        player.some(function(c){
          return (
            c.color===currentColor &&
            c.type!=='wild' &&
            c.type!=='wild4'
          );
        });

      if(hasColorCard){

        message.textContent=
          'Você ainda possui uma carta da cor atual.';

        return;

      }

    }

    const played=
      player.splice(index,1)[0];

    discard.push(played);

    unoCalled=false;

    if(player.length===1){

      message.textContent=
        '🔥 Você ficou com 1 carta! Aperte UNO!';

      unoTimer=setTimeout(
        function(){

          if(
            player.length===1 &&
            !unoCalled
          ){

            player.push(drawCard());
            player.push(drawCard());

            message.textContent=
              'Você esqueceu o UNO e comprou 2 cartas!';

            render();

          }

        },
        1800
      );

    }

    if(player.length===0){

      finishGame(
        '🏆 VOCÊ VENCEU!'
      );

      return;

    }

    /*
     * Coringa precisa de escolha.
     */
    if(
      played.type==='wild' ||
      played.type==='wild4'
    ){

      waitingColor=true;

      render();

      colorPanel.style.display='flex';

      return;

    }

    currentColor=
      played.color;

    applySpecialCard(
      played,
      true
    );

  }

  /*
   * Aplica efeitos das cartas especiais.
   */
  function applySpecialCard(
    card,
    playerPlayed
  ){

    if(
      card.type==='reverse'
    ){

      direction*=-1;

      message.textContent=
        '↻ Sentido da rodada invertido!';

      if(playerPlayed){
        nextTurn();
      }else{
        nextTurn();
      }

      return;
    }

    if(
      card.type==='skip'
    ){

      message.textContent=
        '⊘ Próximo jogador foi bloqueado!';

      currentPlayer=
        getNextPlayer();

      currentPlayer=
        getNextPlayer();

      render();

      if(currentPlayer!==0){
        botTurn();
      }

      return;
    }

    if(
      card.type==='draw2'
    ){

      const target=
        getNextPlayer();

      botsOrPlayerDraw(
        target,
        2
      );

      message.textContent=
        '+2! O próximo jogador comprou 2 cartas.';

      currentPlayer=
        getNextPlayer();

      render();

      if(currentPlayer!==0){
        botTurn();
      }

      return;
    }

    nextTurn();

  }

  /*
   * Compra cartas para qualquer jogador.
   */
  function botsOrPlayerDraw(
    index,
    amount
  ){

    for(let i=0;i<amount;i++){

      const card=drawCard();

      if(index===0){
        player.push(card);
      }else{
        bots[index-1].push(card);
      }

    }

  }

  /*
   * Escolha da cor do coringa.
   */
  document
    .querySelectorAll('.color-btn')
    .forEach(function(button){

      button.addEventListener(
        'click',
        function(){

          if(!waitingColor){
            return;
          }

          currentColor=
            button.dataset.color;

          waitingColor=false;

          colorPanel.style.display='none';

          message.textContent=
            'Você escolheu '+
            COLOR_NAMES[currentColor]+'.';

          /*
           * +4 compra quatro.
           */
          const card=
            discard[
              discard.length-1
            ];

          if(card.type==='wild4'){

            const target=
              getNextPlayer();

            botsOrPlayerDraw(
              target,
              4
            );

            currentPlayer=
              getNextPlayer();

            render();

            if(currentPlayer!==0){
              botTurn();
            }

            return;

          }

          nextTurn();

        }
      );

    });

  /*
   * Próximo jogador.
   */
  function getNextPlayer(){

    let next=
      currentPlayer+
      direction;

    if(next<0){
      next=3;
    }

    if(next>3){
      next=0;
    }

    return next;

  }

  function nextTurn(){

    currentPlayer=
      getNextPlayer();

    passBtn.disabled=true;

    render();

    if(
      gameRunning &&
      currentPlayer!==0
    ){

      setTimeout(
        botTurn,
        650
      );

    }else if(
      gameRunning &&
      currentPlayer===0
    ){

      message.textContent=
        '🎯 Sua vez!';

    }

  }

  /*
   * Inteligência simples dos bots.
   */
  function botTurn(){

    if(
      !gameRunning ||
      currentPlayer===0 ||
      waitingColor
    ){
      return;
    }

    const botIndex=
      currentPlayer-1;

    const hand=
      bots[botIndex];

    /*
     * Primeiro procura carta jogável.
     */
    let playable=
      hand
        .map(function(card,index){
          return {
            card:card,
            index:index
          };
        })
        .filter(function(item){
          return canPlay(item.card);
        });

    /*
     * Prefere cartas especiais.
     */
    playable.sort(
      function(a,b){

        const scoreA=
          specialScore(a.card);

        const scoreB=
          specialScore(b.card);

        return scoreB-scoreA;

      }
    );

    if(playable.length===0){

      hand.push(
        drawCard()
      );

      message.textContent=
        '🤖 '+
        botName(botIndex)+
        ' comprou uma carta.';

      render();

      setTimeout(
        nextTurn,
        500
      );

      return;

    }

    const selected=
      playable[0];

    const card=
      hand.splice(
        selected.index,
        1
      )[0];

    discard.push(card);

    /*
     * Bot ficou sem cartas.
     */
    if(hand.length===0){

      finishGame(
        '🤖 '+
        botName(botIndex)+
        ' venceu!'
      );

      return;

    }

    if(hand.length===1){

      /*
       * Bot sempre declara UNO.
       */
      message.textContent=
        '🔥 '+
        botName(botIndex)+
        ' gritou UNO!';

    }else{

      message.textContent=
        '🤖 '+
        botName(botIndex)+
        ' jogou '+
        card.value+'.';

    }

    /*
     * Coringa.
     */
    if(
      card.type==='wild' ||
      card.type==='wild4'
    ){

      currentColor=
        chooseBotColor(hand);

      message.textContent=
        '🤖 '+
        botName(botIndex)+
        ' escolheu '+
        COLOR_NAMES[currentColor]+'.';

      if(card.type==='wild4'){

        const target=
          getNextPlayer();

        botsOrPlayerDraw(
          target,
          4
        );

      }

      currentPlayer=
        getNextPlayer();

      render();

      if(currentPlayer!==0){
        setTimeout(botTurn,650);
      }

      return;

    }

    currentColor=
      card.color;

    if(card.type==='reverse'){

      direction*=-1;

      /*
       * Com 4 jogadores, inverter
       * simplesmente muda o sentido.
       */

    }

    if(card.type==='skip'){

      currentPlayer=
        getNextPlayer();

      currentPlayer=
        getNextPlayer();

      render();

      if(currentPlayer!==0){
        setTimeout(botTurn,650);
      }

      return;

    }

    if(card.type==='draw2'){

      const target=
        getNextPlayer();

      botsOrPlayerDraw(
        target,
        2
      );

    }

    currentPlayer=
      getNextPlayer();

    render();

    if(currentPlayer!==0){

      setTimeout(
        botTurn,
        650
      );

    }

  }

  function specialScore(card){

    if(card.type==='wild4') return 8;

    if(card.type==='draw2') return 7;

    if(card.type==='skip') return 6;

    if(card.type==='reverse') return 5;

    if(card.type==='wild') return 4;

    return 1;

  }

  function chooseBotColor(hand){

    const counts={
      red:0,
      yellow:0,
      green:0,
      blue:0
    };

    hand.forEach(function(card){

      if(card.color){
        counts[card.color]++;
      }

    });

    let best='red';

    COLORS.forEach(function(color){

      if(
        counts[color]>
        counts[best]
      ){

        best=color;

      }

    });

    return best;

  }

  function botName(index){

    return [
      'ZÉ',
      'LIA',
      'MAX'
    ][index];

  }

  /*
   * Botão UNO.
   */
  unoBtn.addEventListener(
    'click',
    function(){

      if(
        !gameRunning ||
        currentPlayer!==0
      ){
        return;
      }

      if(player.length===1){

        unoCalled=true;

        clearTimeout(unoTimer);

        message.textContent=
          '🔥 UNO! Você está com uma carta!';

        return;

      }

      message.textContent=
        'Você só pode chamar UNO quando tiver 1 carta.';

    }
  );

  /*
   * Renderiza a mão do jogador.
   */
  function renderPlayerHand(){

    playerHand.innerHTML='';

    player.forEach(
      function(card,index){

        const el=
          createCardElement(
            card,
            false
          );

        if(
          currentPlayer!==0 ||
          waitingColor
        ){

          el.classList.add(
            'disabled'
          );

        }

        el.addEventListener(
          'click',
          function(){

            playPlayerCard(index);

          }
        );

        playerHand.appendChild(el);

      }
    );

  }

  /*
   * Cria carta visual.
   */
  function createCardElement(
    card,
    small
  ){

    const el=
      document.createElement('div');

    el.className=
      'card '+
      (
        card.color ||
        'wild'
      )+
      (
        small
          ?' small'
          :''
      );

    const value=
      document.createElement('span');

    value.className='value';

    value.textContent=
      card.value;

    el.appendChild(value);

    return el;

  }

  /*
   * Renderiza carta descartada.
   */
  function renderDiscard(){

    discardCard.innerHTML='';

    const top=
      discard[
        discard.length-1
      ];

    if(!top){
      return;
    }

    const card=
      createCardElement(
        top,
        false
      );

    card.classList.add(
      'discard-card'
    );

    if(
      top.type==='wild' ||
      top.type==='wild4'
    ){

      const indicator=
        document.createElement('div');

      indicator.className=
        'color-indicator '+
        currentColor;

      card.appendChild(
        indicator
      );

    }

    discardCard.appendChild(
      card
    );

  }

  /*
   * Atualiza interface.
   */
  function render(){

    renderPlayerHand();

    renderDiscard();

    botCounts.forEach(
      function(el,index){

        el.textContent=
          bots[index].length;

      }
    );

    deckCount.textContent=
      deck.length;

    colorLabel.textContent=
      currentColor
        ?COLOR_NAMES[currentColor]
        :'-';

    turnLabel.textContent=
      currentPlayer===0
        ?'Sua vez'
        :'🤖 '+botName(currentPlayer-1);

    botBoxes.forEach(
      function(box,index){

        box.classList.toggle(
          'active',
          currentPlayer===index+1
        );

      }
    );

  }

  /*
   * Finaliza partida.
   */
  function finishGame(title){

    gameRunning=false;

    clearTimeout(unoTimer);

    overlayText.textContent=
      title+
      ' Comece uma nova partida para jogar novamente.';

    startBtn.textContent=
      'JOGAR NOVAMENTE';

    overlay.style.display=
      'flex';

    message.textContent=
      title;

  }

  startBtn.addEventListener(
    'click',
    startGame
  );

  drawBtn.addEventListener(
    'click',
    playerDraw
  );

  passBtn.addEventListener(
    'click',
    playerPass
  );

  render();

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

  id:"uno",

  name:"UNO",

  category:"Cartas",

  icon:"🎴",

  init({container}){

    container.innerHTML=
      UNO_HTML;

    executeGameScripts(
      container
    );

  }

});