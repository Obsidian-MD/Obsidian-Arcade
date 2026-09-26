import { PREFIX, BOT_NAME } from "../../../config.js";
import crypto from "node:crypto";
import { getRpgbPlayer, updateRpgbPlayer } from "../../../rpg/database/rpgbDatabase.js";

/* ============================================================
   RPGB — Crônicas de Obsidian
   ------------------------------------------------------------
   Persistência real: database/rpg/rpgb.json, chaveado por userLid
   (nunca por nome, remoteJid ou telefone — ver rpgbDatabase.js).

   Limitação de arquitetura (deliberada, não é bug):
   o HTML roda isolado no celular da pessoa e NÃO tem como avisar
   o bot em tempo real quando algo muda no jogo (não existe
   servidor HTTP rodando pra receber isso). Por isso o card sempre
   mostra, embaixo, um comando pronto:

       PREFIXrpgb salvar <código>

   Quando a pessoa manda esse comando, o bot decodifica o <código>
   (que é só o JSON do personagem em base64) e grava no banco,
   sempre sob o userLid de quem mandou a mensagem — o conteúdo do
   código nunca é usado pra decidir "de quem" é o save.
   ============================================================ */

export const RPGB_HTML = String.raw`<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}

#game{width:100%;max-width:460px;margin:auto;font-family:Georgia,'Palatino Linotype',serif;color:#3b2a1a}

.frame{
  position:relative;
  background:radial-gradient(circle at 30% 0%, #f1e2b8 0%, #e6d2a0 40%, #d9c187 100%);
  border:3px solid #5c4326;
  border-radius:10px;
  box-shadow:0 0 0 6px #2b1d10, 0 22px 45px rgba(0,0,0,.65), inset 0 0 40px rgba(90,60,20,.25);
  padding:14px;
  min-height:520px;
  overflow:hidden;
}
.frame::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(30,15,5,.35) 100%)}

.hud{display:none;align-items:center;gap:8px;padding:7px 9px;margin-bottom:8px;background:rgba(43,29,16,.9);border-radius:8px;border:1px solid #7a5a30;position:relative;z-index:2}
.hud.show{display:flex}
.hud-name{color:#f1e2b8;font-weight:700;font-size:12px;white-space:nowrap}
.hud-lvl{color:#c9a227;font-size:10px;white-space:nowrap}
.hud-bars{flex:1;display:flex;flex-direction:column;gap:3px;min-width:0}
.bar-row{display:flex;align-items:center;gap:5px}
.bar-label{font-size:8px;color:#e6d2a0;width:15px}
.bar-track{flex:1;height:7px;border-radius:5px;background:#1c130a;overflow:hidden;border:1px solid #000}
.bar-fill{height:100%;transition:width .35s ease}
.bar-fill.hp{background:linear-gradient(90deg,#8f2323,#c94040)}
.bar-fill.mp{background:linear-gradient(90deg,#2a4f78,#4d84b8)}
.bar-fill.xp{background:linear-gradient(90deg,#7a5a10,#c9a227)}
.bar-num{font-size:7.5px;color:#cbb888;width:42px;text-align:right}
.hud-gold{color:#e8c85a;font-size:11px;white-space:nowrap}

.screen{display:none;position:relative;z-index:2}
.screen.active{display:block}

h1.gtitle{text-align:center;font-size:24px;margin:2px 0 2px;color:#3b2a1a;text-shadow:0 1px 0 rgba(255,255,255,.3)}
.gsub{text-align:center;font-size:10.5px;color:#7a5a30;margin-bottom:12px;font-style:italic}

label.flabel{display:block;font-size:10.5px;color:#5c4326;margin:8px 0 4px}
input.ginput{width:100%;padding:9px 10px;border-radius:6px;border:1.5px solid #7a5a30;background:#f6ecd2;color:#3b2a1a;font-family:inherit;font-size:14px}
input.ginput:focus{outline:2px solid #c9a227}

.classgrid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:6px}
.classcard{border:2px solid #7a5a30;border-radius:8px;padding:7px 4px;text-align:center;cursor:pointer;background:rgba(246,236,210,.5);transition:transform .1s ease, background .15s ease, border-color .15s ease}
.classcard.sel{background:rgba(201,162,39,.35);border-color:#c9a227;transform:translateY(-2px)}
.classcard .cicon{font-size:22px}
.classcard .cname{font-size:9.5px;font-weight:700;margin-top:2px}
.classdesc{min-height:52px;font-size:10px;color:#5c4326;text-align:center;margin:8px 4px 4px;line-height:1.4}
.attrline{display:flex;flex-wrap:wrap;justify-content:center;gap:5px;font-size:8.5px;color:#7a5a30;margin-top:4px}
.attrline span{background:rgba(122,90,48,.15);border-radius:4px;padding:1px 5px}

.btn{display:block;width:100%;padding:10px 12px;margin-top:9px;border-radius:8px;border:1.5px solid #4a3316;background:linear-gradient(180deg,#8a6a34,#5c4326);color:#f6ecd2;font-family:inherit;font-weight:700;font-size:12.5px;cursor:pointer;box-shadow:0 3px 0 #2b1d10;transition:transform .08s ease, box-shadow .08s ease}
.btn:active{transform:translateY(2px);box-shadow:0 1px 0 #2b1d10}
.btn.small{padding:8px 10px;font-size:11px;margin-top:7px}
.btn.tiny{padding:6px 8px;font-size:10px;margin-top:5px}
.btn.ghost{background:rgba(246,236,210,.35);color:#3b2a1a;border-color:#7a5a30}
.btn.danger{background:linear-gradient(180deg,#8a3434,#5c1e1e)}
.btn:disabled{opacity:.45;cursor:not-allowed}

.row2{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}

.locgrid{display:flex;flex-direction:column;gap:7px;margin-top:6px}
.loccard{display:flex;align-items:center;gap:9px;padding:8px 9px;border:1.5px solid #7a5a30;border-radius:8px;background:rgba(246,236,210,.5);cursor:pointer}
.loccard.locked{opacity:.5;cursor:not-allowed}
.loc-icon{font-size:20px}
.loc-info{flex:1}
.loc-name{font-size:12px;font-weight:700}
.loc-meta{font-size:9px;color:#5c4326}

.combatants{display:flex;justify-content:space-between;align-items:flex-start;margin:6px 0 4px;gap:6px}
.fighter{flex:1;text-align:center}
.fighter .ficon{font-size:34px;display:block}
.fighter .fname{font-size:10px;font-weight:700;margin-top:2px}
.vs{align-self:center;font-size:14px;color:#7a5a30;padding-top:14px}
.minibar{margin-top:3px}
.minibar .bar-track{height:6px}
.effrow{display:flex;justify-content:center;gap:3px;flex-wrap:wrap;margin-top:3px;min-height:14px}
.effchip{font-size:9px;background:rgba(90,60,20,.18);border-radius:4px;padding:0 4px}

.log{height:88px;overflow-y:auto;background:rgba(30,20,10,.85);border:1px solid #4a3316;border-radius:6px;padding:6px 8px;margin:8px 0;font-size:10.5px;color:#e6d2a0;line-height:1.5}
.log div{opacity:0;animation:login .2s ease forwards}
@keyframes login{to{opacity:1}}

.actiongrid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.skillbtn{font-size:9.5px;text-align:left;padding:7px 8px}
.skillbtn small{display:block;font-size:8px;opacity:.75;margin-top:1px}

.shopitem,.inv-item,.quest-item,.ach-item{display:flex;align-items:center;gap:9px;padding:7px 8px;border:1.5px solid #7a5a30;border-radius:8px;background:rgba(246,236,210,.5);margin-bottom:7px}
.shopitem .sicon,.inv-item .sicon{font-size:18px}
.sinfo,.qinfo,.ainfo{flex:1;min-width:0}
.sname,.qname,.aname{font-size:11px;font-weight:700}
.sdesc,.qdesc,.adesc{font-size:9px;color:#5c4326}
.sprice{font-size:10px;color:#8a6a1a;font-weight:700;white-space:nowrap}
.shopitem button,.inv-item button{padding:6px 9px;border-radius:6px;border:1px solid #4a3316;background:#5c4326;color:#f6ecd2;font-size:9.5px;cursor:pointer}
.shopitem button:disabled{opacity:.4}

.rarity-comum{color:#5c4326}
.rarity-incomum{color:#2f6b34}
.rarity-raro{color:#2a4f8f}
.rarity-epico{color:#7a2f9e}
.rarity-lendario{color:#b8860b}
.rarity-mitico{color:#a3221f}

.qprog{font-size:9px;color:#7a5a30;margin-top:2px}
.qbar{height:5px;background:#1c130a;border-radius:4px;overflow:hidden;margin-top:2px;border:1px solid #000}
.qbar-fill{height:100%;background:linear-gradient(90deg,#7a5a10,#c9a227)}
.qdone{color:#2f6b34;font-weight:700;font-size:9px}

.ach-item.locked{opacity:.4}

.centermsg{text-align:center;padding:20px 8px 6px}
.centermsg .bigicon{font-size:48px;display:block;margin-bottom:8px}
.centermsg h2{margin:0 0 6px;font-size:19px}
.centermsg p{font-size:11.5px;color:#5c4326;margin:0 0 12px;line-height:1.5}

.statgrid{display:grid;grid-template-columns:1fr 1fr;gap:5px 12px;margin:8px 0;font-size:10.5px}
.statgrid span.k{color:#7a5a30}
.statgrid span.v{font-weight:700}

.tabs{display:flex;gap:5px;margin-bottom:8px;flex-wrap:wrap}
.tab{flex:1;text-align:center;font-size:9.5px;padding:6px 4px;border-radius:6px;border:1px solid #7a5a30;background:rgba(246,236,210,.4);cursor:pointer;min-width:60px}
.tab.active{background:rgba(201,162,39,.35);border-color:#c9a227;font-weight:700}

.syncpanel{margin-top:10px;padding:9px;border:1.5px dashed #7a5a30;border-radius:8px;background:rgba(30,20,10,.06)}
.syncpanel .synctitle{font-size:10.5px;font-weight:700;color:#5c4326;margin-bottom:4px}
.syncpanel .syncinstr{font-size:9.5px;color:#5c4326;line-height:1.5;margin-bottom:6px}
.synccode{width:100%;height:52px;font-size:9px;font-family:monospace;padding:6px;border-radius:6px;border:1px solid #7a5a30;background:#f6ecd2;color:#3b2a1a;resize:none}
.synccmd{margin-top:6px;font-size:10.5px;background:#2b1d10;color:#e6d2a0;padding:6px 8px;border-radius:6px;word-break:break-all;font-family:monospace}

.toast{position:absolute;left:10px;right:10px;top:8px;z-index:9;background:rgba(30,20,10,.95);color:#e6d2a0;font-size:11px;padding:8px 10px;border-radius:8px;border:1px solid #c9a227;text-align:center;opacity:0;pointer-events:none;transition:opacity .3s ease}
.toast.show{opacity:1}

@media(max-width:380px){
  .frame{padding:11px;min-height:480px}
  h1.gtitle{font-size:20px}
  .fighter .ficon{font-size:28px}
  .classcard .cicon{font-size:18px}
}
</style>

<div id="game">
<div class="frame">

  <div class="toast" id="toast"></div>

  <div class="hud" id="hud">
    <div>
      <div class="hud-name" id="hudName">—</div>
      <div class="hud-lvl" id="hudLvl">Nv.1</div>
    </div>
    <div class="hud-bars">
      <div class="bar-row"><span class="bar-label">HP</span><div class="bar-track"><div class="bar-fill hp" id="hudHpFill" style="width:100%"></div></div><span class="bar-num" id="hudHpNum">0/0</span></div>
      <div class="bar-row"><span class="bar-label">MP</span><div class="bar-track"><div class="bar-fill mp" id="hudMpFill" style="width:100%"></div></div><span class="bar-num" id="hudMpNum">0/0</span></div>
      <div class="bar-row"><span class="bar-label">XP</span><div class="bar-track"><div class="bar-fill xp" id="hudXpFill" style="width:0%"></div></div><span class="bar-num" id="hudXpNum">0/0</span></div>
    </div>
    <div class="hud-gold">💰 <span id="hudGold">0</span></div>
  </div>

  <!-- INÍCIO -->
  <div class="screen active" id="screen-start">
    <h1 class="gtitle">Crônicas de Obsidian</h1>
    <div class="gsub" id="startSub">RPGB — sua lenda, salva de verdade</div>
    <label class="flabel">Nome do herói</label>
    <input class="ginput" id="inputName" maxlength="16" placeholder="Digite seu nome...">
    <label class="flabel">Escolha sua classe</label>
    <div class="classgrid" id="classGrid"></div>
    <div class="classdesc" id="classDesc">Toque numa classe para ver os detalhes.</div>
    <button class="btn" id="btnStart" disabled>Começar Aventura</button>
  </div>

  <!-- VILA -->
  <div class="screen" id="screen-town">
    <h1 class="gtitle" style="font-size:18px">🏘️ Vila de Obsidian</h1>
    <div class="gsub" id="townFlavor">Para onde vamos?</div>
    <div class="locgrid" id="locGrid"></div>
    <div class="row3" style="margin-top:10px">
      <button class="btn small" id="btnRest">🛌 Descansar</button>
      <button class="btn small" id="btnShop">🛒 Loja</button>
      <button class="btn small" id="btnQuests">📋 Missões</button>
    </div>
    <div class="row3">
      <button class="btn ghost small" id="btnSheet">📜 Ficha</button>
      <button class="btn ghost small" id="btnInv">🎒 Inventário</button>
      <button class="btn ghost small" id="btnAch">🏆 Conquistas</button>
    </div>
    <div class="syncpanel" id="syncPanelTown"></div>
  </div>

  <!-- FICHA -->
  <div class="screen" id="screen-sheet">
    <h1 class="gtitle" style="font-size:18px">📜 Ficha do Herói</h1>
    <div class="statgrid" id="sheetStats"></div>
    <label class="flabel">Histórico de Batalhas</label>
    <div class="log" id="sheetHistory" style="height:100px"></div>
    <div class="row2">
      <button class="btn ghost small" id="btnSheetBack">Voltar</button>
      <button class="btn danger small" id="btnResetOpen">⚠️ Recomeçar do Zero</button>
    </div>
  </div>

  <!-- RESET CONFIRMAÇÃO -->
  <div class="screen" id="screen-reset">
    <div class="centermsg">
      <span class="bigicon">⚠️</span>
      <h2>Recomeçar do Zero</h2>
      <p>Isso apaga TODO o progresso deste personagem (nível, itens, conquistas, tudo). Essa ação só vale depois que você enviar o código de confirmação pro bot.</p>
      <button class="btn danger" id="btnResetConfirm">CONFIRMAR NOVA JORNADA</button>
      <button class="btn ghost small" id="btnResetCancel">Cancelar</button>
    </div>
  </div>

  <!-- INVENTÁRIO -->
  <div class="screen" id="screen-inv">
    <h1 class="gtitle" style="font-size:18px">🎒 Inventário</h1>
    <div class="tabs">
      <div class="tab active" data-tab="equip">Equipado</div>
      <div class="tab" data-tab="itens">Itens</div>
    </div>
    <div id="invEquip"></div>
    <div id="invItens" style="display:none"></div>
    <button class="btn ghost small" id="btnInvBack">Voltar</button>
  </div>

  <!-- MISSÕES -->
  <div class="screen" id="screen-quests">
    <h1 class="gtitle" style="font-size:18px">📋 Quadro de Missões</h1>
    <div id="questList"></div>
    <button class="btn ghost small" id="btnQuestsBack">Voltar</button>
  </div>

  <!-- CONQUISTAS -->
  <div class="screen" id="screen-ach">
    <h1 class="gtitle" style="font-size:18px">🏆 Conquistas</h1>
    <div id="achList"></div>
    <button class="btn ghost small" id="btnAchBack">Voltar</button>
  </div>

  <!-- BATALHA -->
  <div class="screen" id="screen-battle">
    <div class="combatants">
      <div class="fighter">
        <span class="ficon" id="pIcon">🧙</span>
        <div class="fname" id="pName">Herói</div>
        <div class="minibar"><div class="bar-track"><div class="bar-fill hp" id="pHpFill" style="width:100%"></div></div></div>
        <div class="effrow" id="pEffects"></div>
      </div>
      <div class="vs">⚔️</div>
      <div class="fighter">
        <span class="ficon" id="eIcon">👺</span>
        <div class="fname" id="eName">Inimigo</div>
        <div class="minibar"><div class="bar-track"><div class="bar-fill hp" id="eHpFill" style="width:100%"></div></div></div>
        <div class="effrow" id="eEffects"></div>
      </div>
    </div>
    <div class="log" id="battleLog"></div>
    <div class="actiongrid">
      <button class="btn small" id="actAttack">⚔️ Atacar</button>
      <button class="btn small ghost" id="actItem">🧪 Item</button>
      <button class="btn small danger" id="actFlee">🏃 Fugir</button>
      <button class="btn small" id="actSkillsOpen">✨ Habilidades</button>
    </div>
    <div id="skillList" style="display:none;margin-top:7px"></div>
    <div class="syncpanel" id="syncPanelBattle" style="margin-top:8px"></div>
  </div>

  <!-- LOJA -->
  <div class="screen" id="screen-shop">
    <h1 class="gtitle" style="font-size:18px">🛒 Loja da Vila</h1>
    <div class="gsub">Ouro: <span id="shopGold">0</span> 💰</div>
    <div id="shopList"></div>
    <button class="btn ghost small" id="btnShopBack">Voltar à Vila</button>
  </div>

  <!-- MASMORRA -->
  <div class="screen" id="screen-dungeon">
    <h1 class="gtitle" style="font-size:18px">🗼 Torre das Sombras</h1>
    <div class="gsub" id="dungeonFlavor">Suba os andares. Cada um é mais forte.</div>
    <div class="statgrid" id="dungeonInfo"></div>
    <button class="btn" id="btnDungeonEnter">Subir Próximo Andar</button>
    <button class="btn ghost small" id="btnDungeonBack">Voltar à Vila</button>
  </div>

  <!-- GAME OVER -->
  <div class="screen" id="screen-gameover">
    <div class="centermsg">
      <span class="bigicon">💀</span>
      <h2>Você caiu em combate...</h2>
      <p>As sombras tomaram conta, mas uma nova chance sempre espera os bravos.</p>
      <button class="btn" id="btnRevive">Reviver na Vila (perde metade do ouro)</button>
    </div>
    <div class="syncpanel" id="syncPanelDeath"></div>
  </div>

  <!-- VITÓRIA -->
  <div class="screen" id="screen-victory">
    <div class="centermsg">
      <span class="bigicon">🏆</span>
      <h2 id="victoryTitle">Uma grande ameaça caiu!</h2>
      <p>Obsidian está mais segura... mas sempre há mais uma aventura.</p>
      <button class="btn" id="btnVictoryContinue">Continuar Jogando</button>
    </div>
    <div class="syncpanel" id="syncPanelVictory"></div>
  </div>

</div>
</div>

<script>
(function(){

/* ================= DADOS DO SERVIDOR ================= */
var SERVER_PREFIX = "__PREFIX__";
var INITIAL_STATE_B64 = "__INITIAL_STATE_B64__";

/* ================= DADOS DO JOGO ================= */

var RARITIES = [
  { id:"comum", name:"Comum", mult:1, weight:55 },
  { id:"incomum", name:"Incomum", mult:1.3, weight:25 },
  { id:"raro", name:"Raro", mult:1.7, weight:12 },
  { id:"epico", name:"Épico", mult:2.2, weight:6 },
  { id:"lendario", name:"Lendário", mult:3, weight:1.7 },
  { id:"mitico", name:"Mítico", mult:4, weight:.3 }
];

var SLOT_BASE = { arma:6, armadura:5, capacete:3, acessorio:4 };
var SLOT_NAMES = { arma:"Arma", armadura:"Armadura", capacete:"Capacete", acessorio:"Acessório" };
var SLOT_ICONS = { arma:"⚔️", armadura:"🛡️", capacete:"⛑️", acessorio:"💍" };

var CLASSES = {
  guerreiro: {
    key:"guerreiro", name:"Guerreiro", icon:"⚔️",
    attrs:{ forca:14, defesa:12, intel:4, agilidade:6, vitalidade:14, sorte:4 },
    desc:"Resistente e forte na lâmina. Pouca mana, mas aguenta muito dano.",
    skills:[
      { id:"golpe", name:"Golpe Poderoso", mpCost:6, kind:"fisico", mult:1.8, desc:"Dano físico alto." },
      { id:"investida", name:"Investida", mpCost:10, kind:"fisico", mult:1.4, effect:"atordoar", desc:"Dano e chance de atordoar." },
      { id:"defesaferro", name:"Defesa de Ferro", mpCost:8, kind:"buff", effect:"escudo", desc:"Bloqueia o próximo golpe recebido." },
      { id:"furia", name:"Fúria", mpCost:14, kind:"fisico", mult:2.2, selfCost:0.10, desc:"Dano devastador, custa 10% do seu HP atual.", minLevel:5 }
    ]
  },
  mago: {
    key:"mago", name:"Mago", icon:"🔮",
    attrs:{ forca:4, defesa:4, intel:16, agilidade:6, vitalidade:6, sorte:6 },
    desc:"Frágil no corpo a corpo, devastador com magia.",
    skills:[
      { id:"bolafogo", name:"Bola de Fogo", mpCost:12, kind:"magico", mult:2.0, effect:"queimar", desc:"Dano mágico + queimadura." },
      { id:"raio", name:"Raio", mpCost:10, kind:"magico", mult:1.7, effect:"atordoar", desc:"Dano mágico + chance de atordoar." },
      { id:"cura", name:"Cura", mpCost:15, kind:"cura", healPct:0.35, desc:"Recupera 35% do seu HP máximo." },
      { id:"explosao", name:"Explosão Arcana", mpCost:22, kind:"magico", mult:2.8, desc:"Dano mágico devastador.", minLevel:5 }
    ]
  },
  ladino: {
    key:"ladino", name:"Ladino", icon:"🗡️",
    attrs:{ forca:9, defesa:5, intel:4, agilidade:16, vitalidade:7, sorte:8 },
    desc:"Ágil e traiçoeiro, com alta chance de crítico.",
    skills:[
      { id:"furtivo", name:"Ataque Furtivo", mpCost:6, kind:"fisico", mult:1.5, critBonus:0.30, desc:"Dano com chance extra de crítico." },
      { id:"veneno", name:"Veneno", mpCost:8, kind:"fisico", mult:1.0, effect:"envenenar", desc:"Dano leve + veneno ao longo do tempo." },
      { id:"critico", name:"Golpe Crítico", mpCost:10, kind:"fisico", mult:1.3, critBonus:0.55, desc:"Dano com crítico quase garantido." },
      { id:"sombra", name:"Sombra", mpCost:12, kind:"buff", effect:"esquiva", desc:"O próximo golpe inimigo tem grande chance de errar.", minLevel:5 }
    ]
  },
  paladino: {
    key:"paladino", name:"Paladino", icon:"🛐",
    attrs:{ forca:11, defesa:14, intel:8, agilidade:4, vitalidade:13, sorte:4 },
    desc:"Tanque sagrado que também cura a si mesmo.",
    skills:[
      { id:"julgamento", name:"Julgamento", mpCost:10, kind:"fisico", mult:1.7, desc:"Dano físico abençoado." },
      { id:"luzcura", name:"Luz Curativa", mpCost:16, kind:"cura", healPct:0.30, desc:"Recupera 30% do seu HP máximo." },
      { id:"escudosagrado", name:"Escudo Sagrado", mpCost:10, kind:"buff", effect:"escudo", desc:"Bloqueia o próximo golpe recebido." },
      { id:"punicao", name:"Punição", mpCost:18, kind:"magico", mult:1.9, effect:"queimar", desc:"Dano mágico + queimadura leve.", minLevel:5 }
    ]
  },
  arqueiro: {
    key:"arqueiro", name:"Arqueiro", icon:"🏹",
    attrs:{ forca:10, defesa:6, intel:5, agilidade:14, vitalidade:8, sorte:8 },
    desc:"Ataca à distância com precisão letal.",
    skills:[
      { id:"tirocerteiro", name:"Tiro Certeiro", mpCost:7, kind:"fisico", mult:1.6, critBonus:0.20, desc:"Dano com boa chance de crítico." },
      { id:"chuva", name:"Chuva de Flechas", mpCost:14, kind:"fisico", mult:2.0, desc:"Dano físico alto." },
      { id:"paralisante", name:"Tiro Paralisante", mpCost:10, kind:"fisico", mult:1.2, effect:"atordoar", desc:"Dano + chance de atordoar." },
      { id:"envenenada", name:"Flecha Envenenada", mpCost:9, kind:"fisico", mult:1.1, effect:"envenenar", desc:"Dano leve + veneno.", minLevel:5 }
    ]
  },
  necromante: {
    key:"necromante", name:"Necromante", icon:"💀",
    attrs:{ forca:5, defesa:5, intel:14, agilidade:6, vitalidade:8, sorte:8 },
    desc:"Manipula energias sombrias para drenar e amaldiçoar.",
    skills:[
      { id:"drenar", name:"Drenar Vida", mpCost:10, kind:"magico", mult:1.5, drainPct:0.5, desc:"Dano mágico, cura você com parte do dano." },
      { id:"praga", name:"Praga", mpCost:12, kind:"magico", mult:1.0, effect:"envenenar", desc:"Dano leve + veneno forte." },
      { id:"explosaosombria", name:"Explosão Sombria", mpCost:18, kind:"magico", mult:2.4, desc:"Dano mágico alto." },
      { id:"regeneracao", name:"Regeneração Sombria", mpCost:14, kind:"buff", effect:"regenerar", desc:"Cura você ao longo de 3 turnos.", minLevel:5 }
    ]
  }
};

var MONSTERS = {
  lobo: { name:"Lobo Selvagem", icon:"🐺", hp:32, atk:8, def:2, xp:15, gold:8, tier:1 },
  goblin: { name:"Goblin Arruaceiro", icon:"👺", hp:42, atk:10, def:3, xp:20, gold:12, tier:1 },
  morcego: { name:"Morcego Gigante", icon:"🦇", hp:26, atk:11, def:1, xp:14, gold:7, tier:1 },
  troll: { name:"Troll da Caverna", icon:"👹", hp:85, atk:14, def:6, xp:45, gold:25, tier:2 },
  aranha: { name:"Aranha Venenosa", icon:"🕷️", hp:68, atk:16, def:4, xp:40, gold:22, tier:2 },
  esqueleto: { name:"Esqueleto Guerreiro", icon:"☠️", hp:75, atk:15, def:7, xp:42, gold:24, tier:2 },
  cavaleiro: { name:"Cavaleiro Sombrio", icon:"🛡️", hp:140, atk:20, def:11, xp:90, gold:55, tier:3, boss:true },
  dragao: { name:"Dragão Ancião", icon:"🐉", hp:280, atk:27, def:13, xp:320, gold:220, tier:3, boss:true, worldBoss:true },
  sombra_menor: { name:"Sombra Menor", icon:"🌑", hp:60, atk:13, def:5, xp:30, gold:16, tier:2 },
  guardiao_sombrio: { name:"Guardião Sombrio", icon:"👁️", hp:110, atk:19, def:9, xp:60, gold:35, tier:3 },
  senhor_das_sombras: { name:"Senhor das Sombras", icon:"🕳️", hp:320, atk:30, def:15, xp:400, gold:260, tier:4, boss:true, dungeonBoss:true }
};

var LOCATIONS = [
  { id:"floresta", name:"Floresta Sombria", icon:"🌲", minLevel:1, pool:["lobo","goblin","morcego"] },
  { id:"caverna", name:"Caverna Gelada", icon:"🧊", minLevel:4, pool:["troll","aranha","esqueleto"] },
  { id:"castelo", name:"Castelo Amaldiçoado", icon:"🏰", minLevel:7, pool:["cavaleiro"], bossAt:10, boss:"dragao" }
];

var DUNGEON_POOL = ["sombra_menor","guardiao_sombrio"];
var DUNGEON_MAX_FLOOR = 5;
var DUNGEON_MIN_LEVEL = 5;

var SHOP_ITEMS = [
  { id:"pocao_hp", icon:"🧪", name:"Poção de Vida", desc:"Recupera 40 HP", price:15, kind:"pocao" },
  { id:"pocao_mp", icon:"💧", name:"Poção de Mana", desc:"Recupera 25 MP", price:15, kind:"pocao" },
  { id:"shop_arma", icon:"⚔️", name:"Espada de Ferro", desc:"Arma comum (+bônus de ataque)", price:60, kind:"equip", slot:"arma" },
  { id:"shop_armadura", icon:"🛡️", name:"Armadura de Couro", desc:"Armadura comum (+bônus de defesa)", price:60, kind:"equip", slot:"armadura" },
  { id:"shop_capacete", icon:"⛑️", name:"Elmo de Ferro", desc:"Capacete comum (+bônus de defesa)", price:40, kind:"equip", slot:"capacete" },
  { id:"shop_acessorio", icon:"💍", name:"Anel Simples", desc:"Acessório comum (+bônus de crítico)", price:45, kind:"equip", slot:"acessorio" }
];

var QUESTS = [
  { id:"cacador_iniciante", name:"Caçador Iniciante", desc:"Derrote 5 Lobos Selvagens.", monster:"lobo", amount:5, rewardXp:30, rewardGold:20 },
  { id:"limpeza_caverna", name:"Limpeza da Caverna", desc:"Derrote 5 Trolls ou Aranhas.", monster:["troll","aranha"], amount:5, rewardXp:60, rewardGold:40 },
  { id:"perturbador", name:"Perturbador de Ossos", desc:"Derrote 3 Esqueletos Guerreiros.", monster:"esqueleto", amount:3, rewardXp:50, rewardGold:35 },
  { id:"colecionador", name:"Colecionador", desc:"Obtenha 3 itens de equipamento (loot ou loja).", monster:null, amount:3, rewardXp:40, rewardGold:50, trackKey:"itemsFound" },
  { id:"matador_de_chefes", name:"Matador de Chefes", desc:"Derrote 1 chefe de qualquer zona.", monster:null, amount:1, rewardXp:150, rewardGold:100, trackKey:"bossesDefeated" }
];

var ACHIEVEMENTS = [
  { id:"primeiro_sangue", name:"Primeiro Sangue", icon:"🩸", desc:"Vença sua primeira batalha.", check:function(s){ return s.stats.battlesWon >= 1; } },
  { id:"cacador", name:"Caçador", icon:"🎯", desc:"Derrote 50 monstros.", check:function(s){ return s.stats.monstersDefeated >= 50; } },
  { id:"rico", name:"Rico", icon:"💰", desc:"Acumule 1000 moedas de ouro.", check:function(s){ return s.gold >= 1000; } },
  { id:"matador_dragoes", name:"Matador de Dragões", icon:"🐉", desc:"Derrote o Dragão Ancião.", check:function(s){ return s.bossesDefeatedList.indexOf("dragao") !== -1; } },
  { id:"lendario", name:"Lendário", icon:"⭐", desc:"Alcance o nível 15.", check:function(s){ return s.level >= 15; } },
  { id:"sobrevivente", name:"Sobrevivente", icon:"🩹", desc:"Reviva após uma derrota.", check:function(s){ return s.stats.battlesLost >= 1; } },
  { id:"veterano", name:"Veterano", icon:"🎖️", desc:"Vença 20 batalhas.", check:function(s){ return s.stats.battlesWon >= 20; } },
  { id:"campeao_da_torre", name:"Campeão da Torre", icon:"🗼", desc:"Complete a Torre das Sombras.", check:function(s){ return s.dungeon.cleared; } }
];

/* ================= ESTADO ================= */
var state = null;
var battle = null;
var selectedClass = null;
var creationJustHappened = false;

function $(id){ return document.getElementById(id); }
function clamp(n,min,max){ return Math.max(min,Math.min(max,n)); }
function rnd(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

function showScreen(id){
  var screens = document.querySelectorAll(".screen");
  for (var i=0;i<screens.length;i++) screens[i].classList.remove("active");
  $(id).classList.add("active");
}

function toast(msg){
  var t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(function(){ t.classList.remove("show"); }, 2600);
}

/* ================= BASE64 UTF-8 ================= */
function encodeState(obj){
  var json = JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(json)));
}
function decodeState(b64){
  return JSON.parse(decodeURIComponent(escape(atob(b64))));
}

/* ================= ATRIBUTOS DERIVADOS ================= */
function classDef(){ return CLASSES[state.classKey]; }

function equipBonus(field){
  var total = 0;
  ["arma","armadura","capacete","acessorio"].forEach(function(slot){
    var item = state.equipment[slot];
    if (item && item.bonus && item.bonus[field]) total += item.bonus[field];
  });
  return total;
}

function maxHp(){ return Math.round(60 + state.attrs.vitalidade*6 + (state.level-1)*8 + equipBonus("hp")); }
function maxMp(){ return Math.round(20 + state.attrs.intel*4 + (state.level-1)*3 + equipBonus("mp")); }
function atkFisico(){ return state.attrs.forca*1.6 + state.level*0.5 + equipBonus("atk"); }
function atkMagico(){ return state.attrs.intel*1.8 + state.level*0.5 + equipBonus("atk"); }
function defTotal(){ return state.attrs.defesa*1.2 + equipBonus("def"); }
function critChance(){ return clamp(0.05 + state.attrs.agilidade*0.01 + state.attrs.sorte*0.005 + equipBonus("crit"), 0, 0.65); }
function critMult(){ return 1.6 + state.attrs.sorte*0.01; }

/* ================= FÁBRICA DE PERSONAGEM ================= */
function novoPersonagemPadrao(nome, classeKey){
  var c = CLASSES[classeKey];
  var base = {
    version:1,
    name: nome,
    classKey: classeKey,
    level: 1,
    xp: 0,
    xpNext: 60,
    attrs: { forca:c.attrs.forca, defesa:c.attrs.defesa, intel:c.attrs.intel, agilidade:c.attrs.agilidade, vitalidade:c.attrs.vitalidade, sorte:c.attrs.sorte },
    gold: 30,
    equipment: { arma:null, armadura:null, capacete:null, acessorio:null },
    inventory: { pocao_hp: 2, pocao_mp: 1 },
    quests: {},
    achievements: [],
    dungeon: { floor:0, cleared:false },
    bossesDefeatedList: [],
    battleHistory: [],
    stats: {
      monstersDefeated:0, bossesDefeated:0, battlesWon:0, battlesLost:0, fled:0,
      damageDealt:0, damageTaken:0, critHits:0, goldEarned:0, goldSpent:0, itemsFound:0, questsCompleted:0
    },
    createdAt: new Date().toLocaleString("pt-BR")
  };
  base.hp = 60 + base.attrs.vitalidade*6;
  base.mp = 20 + base.attrs.intel*4;
  return base;
}

function garantirCompatibilidade(s){
  if (!s.version) s.version = 1;
  if (!s.quests) s.quests = {};
  if (!s.achievements) s.achievements = [];
  if (!s.dungeon) s.dungeon = { floor:0, cleared:false };
  if (!s.bossesDefeatedList) s.bossesDefeatedList = [];
  if (!s.battleHistory) s.battleHistory = [];
  if (!s.equipment) s.equipment = { arma:null, armadura:null, capacete:null, acessorio:null };
  if (!s.equipment.capacete) s.equipment.capacete = null;
  if (!s.equipment.acessorio) s.equipment.acessorio = null;
  if (!s.stats) s.stats = { monstersDefeated:0,bossesDefeated:0,battlesWon:0,battlesLost:0,fled:0,damageDealt:0,damageTaken:0,critHits:0,goldEarned:0,goldSpent:0,itemsFound:0,questsCompleted:0 };
  return s;
}

/* ================= SYNC (código para o bot) ================= */
function renderSyncPanel(container){
  if (!container) return;
  var code = encodeState(state);
  var cmd = SERVER_PREFIX + "rpgb salvar " + code;
  container.innerHTML =
    '<div class="synctitle">💾 Salvar progresso de verdade</div>' +
    '<div class="syncinstr">O jogo roda aqui no seu celular. Pra seu progresso ficar salvo no bot (e continuar amanhã), copie o comando abaixo e mande no WhatsApp:</div>' +
    '<textarea class="synccode" readonly id="syncCodeBox">' + cmd + '</textarea>' +
    '<button class="btn tiny" id="syncCopyBtn">📋 Copiar Comando</button>';
  var btn = container.querySelector("#syncCopyBtn");
  var box = container.querySelector("#syncCodeBox");
  btn.addEventListener("click", function(){
    box.focus();
    box.select();
    var copied = false;
    try{
      if (navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(cmd);
        copied = true;
      }
    }catch(e){}
    if (!copied){
      try{ document.execCommand("copy"); copied = true; }catch(e){}
    }
    toast(copied ? "Comando copiado! Cole no WhatsApp e envie." : "Selecione o texto acima e copie manualmente.");
  });
}

function refreshAllSyncPanels(){
  renderSyncPanel($("syncPanelTown"));
  renderSyncPanel($("syncPanelBattle"));
  renderSyncPanel($("syncPanelDeath"));
  renderSyncPanel($("syncPanelVictory"));
}

/* ================= HUD ================= */
function renderHud(){
  $("hud").classList.add("show");
  $("hudName").textContent = state.name;
  $("hudLvl").textContent = "Nv. " + state.level;
  var mh = maxHp(), mm = maxMp();
  $("hudHpFill").style.width = clamp((state.hp/mh)*100,0,100) + "%";
  $("hudMpFill").style.width = clamp((state.mp/mm)*100,0,100) + "%";
  $("hudHpNum").textContent = Math.round(state.hp) + "/" + mh;
  $("hudMpNum").textContent = Math.round(state.mp) + "/" + mm;
  $("hudXpFill").style.width = clamp((state.xp/state.xpNext)*100,0,100) + "%";
  $("hudXpNum").textContent = state.xp + "/" + state.xpNext;
  $("hudGold").textContent = state.gold;
}

/* ================= TELA INICIAL ================= */
function renderClassGrid(){
  var grid = $("classGrid");
  grid.innerHTML = "";
  Object.keys(CLASSES).forEach(function(key){
    var c = CLASSES[key];
    var card = document.createElement("div");
    card.className = "classcard" + (selectedClass === key ? " sel" : "");
    card.innerHTML = '<span class="cicon">' + c.icon + '</span><div class="cname">' + c.name + '</div>';
    card.addEventListener("click", function(){
      selectedClass = key;
      renderClassGrid();
      var a = c.attrs;
      $("classDesc").innerHTML = c.name + " — " + c.desc +
        '<div class="attrline"><span>FOR ' + a.forca + '</span><span>DEF ' + a.defesa + '</span><span>INT ' + a.intel + '</span><span>AGI ' + a.agilidade + '</span><span>VIT ' + a.vitalidade + '</span><span>SOR ' + a.sorte + '</span></div>';
      checkStartEnabled();
    });
    grid.appendChild(card);
  });
}
function checkStartEnabled(){
  $("btnStart").disabled = !($("inputName").value.trim().length > 0 && selectedClass);
}
function newCharacter(){
  var name = $("inputName").value.trim() || "Herói";
  state = novoPersonagemPadrao(name, selectedClass);
  creationJustHappened = true;
  enterTown("Sua jornada começa em Obsidian, " + state.name + "! Não esqueça de enviar o comando de salvar abaixo pra confirmar seu personagem no bot.");
}

/* ================= CONQUISTAS ================= */
function checkAchievements(){
  var novas = [];
  ACHIEVEMENTS.forEach(function(a){
    if (state.achievements.indexOf(a.id) === -1 && a.check(state)){
      state.achievements.push(a.id);
      novas.push(a);
    }
  });
  novas.forEach(function(a){ toast("🏆 Conquista desbloqueada: " + a.name); });
}

/* ================= MISSÕES ================= */
function questMatches(quest, monsterKey){
  if (!quest.monster) return false;
  if (Array.isArray(quest.monster)) return quest.monster.indexOf(monsterKey) !== -1;
  return quest.monster === monsterKey;
}
function advanceQuestsByMonster(monsterKey){
  QUESTS.forEach(function(q){
    if (!questMatches(q, monsterKey)) return;
    var qs = state.quests[q.id] || { progress:0, completed:false };
    if (qs.completed) return;
    qs.progress++;
    if (qs.progress >= q.amount){
      qs.completed = true;
      state.gold += q.rewardGold;
      state.xp += q.rewardXp;
      state.stats.questsCompleted++;
      toast("📋 Missão concluída: " + q.name + "! +" + q.rewardXp + "xp, +" + q.rewardGold + "💰");
    }
    state.quests[q.id] = qs;
  });
}
function advanceQuestsByTrackKey(trackKey){
  QUESTS.forEach(function(q){
    if (q.trackKey !== trackKey) return;
    var qs = state.quests[q.id] || { progress:0, completed:false };
    if (qs.completed) return;
    qs.progress++;
    if (qs.progress >= q.amount){
      qs.completed = true;
      state.gold += q.rewardGold;
      state.xp += q.rewardXp;
      state.stats.questsCompleted++;
      toast("📋 Missão concluída: " + q.name + "! +" + q.rewardXp + "xp, +" + q.rewardGold + "💰");
    }
    state.quests[q.id] = qs;
  });
}
function renderQuests(){
  var box = $("questList");
  box.innerHTML = "";
  QUESTS.forEach(function(q){
    var qs = state.quests[q.id] || { progress:0, completed:false };
    var div = document.createElement("div");
    div.className = "quest-item";
    var pct = clamp((qs.progress/q.amount)*100,0,100);
    div.innerHTML =
      '<div class="qinfo"><div class="qname">' + q.name + (qs.completed ? ' ✅' : '') + '</div>' +
      '<div class="qdesc">' + q.desc + '</div>' +
      (qs.completed
        ? '<div class="qdone">Concluída — +' + q.rewardXp + 'xp, +' + q.rewardGold + '💰</div>'
        : '<div class="qprog">' + qs.progress + '/' + q.amount + '</div><div class="qbar"><div class="qbar-fill" style="width:' + pct + '%"></div></div>') +
      '</div>';
    box.appendChild(div);
  });
}

/* ================= FICHA ================= */
function renderSheet(){
  var c = classDef();
  var html = "";
  function row(k,v){ html += '<span class="k">'+k+'</span><span class="v">'+v+'</span>'; }
  row("Classe", c.icon + " " + c.name);
  row("Nível", state.level);
  row("XP", state.xp + " / " + state.xpNext);
  row("HP", Math.round(state.hp) + " / " + maxHp());
  row("MP", Math.round(state.mp) + " / " + maxMp());
  row("Força", state.attrs.forca);
  row("Defesa", state.attrs.defesa);
  row("Inteligência", state.attrs.intel);
  row("Agilidade", state.attrs.agilidade);
  row("Vitalidade", state.attrs.vitalidade);
  row("Sorte", state.attrs.sorte);
  row("Ataque total", Math.round(Math.max(atkFisico(), atkMagico())));
  row("Defesa total", Math.round(defTotal()));
  row("Chance de crítico", Math.round(critChance()*100) + "%");
  row("Ouro", state.gold + " 💰");
  row("Monstros derrotados", state.stats.monstersDefeated);
  row("Chefes derrotados", state.stats.bossesDefeated);
  row("Batalhas vencidas", state.stats.battlesWon);
  row("Batalhas perdidas", state.stats.battlesLost);
  row("Fugas", state.stats.fled);
  row("Dano causado", Math.round(state.stats.damageDealt));
  row("Dano recebido", Math.round(state.stats.damageTaken));
  row("Críticos", state.stats.critHits);
  row("Conquistas", state.achievements.length + "/" + ACHIEVEMENTS.length);
  $("sheetStats").innerHTML = html;

  var histBox = $("sheetHistory");
  histBox.innerHTML = "";
  if (!state.battleHistory.length){
    var empty = document.createElement("div");
    empty.textContent = "Nenhuma batalha registrada ainda.";
    histBox.appendChild(empty);
  } else {
    state.battleHistory.forEach(function(h){
      var line = document.createElement("div");
      var resumo = h.date + " · Nv." + h.level + " · " + h.monster + " — " + h.result;
      if (h.result.indexOf("vitória") === 0) resumo += " (+" + h.xp + "xp, +" + h.gold + "💰)";
      line.textContent = resumo;
      histBox.appendChild(line);
    });
  }
}

function addHistory(entry){
  entry.date = new Date().toLocaleString("pt-BR");
  entry.level = state.level;
  state.battleHistory.unshift(entry);
  if (state.battleHistory.length > 40) state.battleHistory.length = 40;
}

/* ================= INVENTÁRIO ================= */
function rarityClass(r){ return "rarity-" + r; }
function renderInventory(){
  var equipBox = $("invEquip");
  equipBox.innerHTML = "";
  ["arma","armadura","capacete","acessorio"].forEach(function(slot){
    var item = state.equipment[slot];
    var div = document.createElement("div");
    div.className = "inv-item";
    if (item){
      div.innerHTML =
        '<span class="sicon">' + SLOT_ICONS[slot] + '</span>' +
        '<div class="sinfo"><div class="sname ' + rarityClass(item.rarity) + '">' + item.name + '</div>' +
        '<div class="sdesc">' + SLOT_NAMES[slot] + ' · ' + bonusText(item.bonus) + '</div></div>';
      var btn = document.createElement("button");
      btn.textContent = "Remover";
      btn.addEventListener("click", function(){ state.equipment[slot] = null; renderInventory(); renderHud(); });
      div.appendChild(btn);
    } else {
      div.innerHTML =
        '<span class="sicon">' + SLOT_ICONS[slot] + '</span>' +
        '<div class="sinfo"><div class="sname">' + SLOT_NAMES[slot] + ' vazio</div>' +
        '<div class="sdesc">Nenhum item equipado</div></div>';
    }
    equipBox.appendChild(div);
  });

  var itemsBox = $("invItens");
  itemsBox.innerHTML = "";
  var pHp = document.createElement("div");
  pHp.className = "inv-item";
  pHp.innerHTML = '<span class="sicon">🧪</span><div class="sinfo"><div class="sname">Poção de Vida</div><div class="sdesc">' + state.inventory.pocao_hp + 'x — cura 40 HP</div></div>';
  itemsBox.appendChild(pHp);
  var pMp = document.createElement("div");
  pMp.className = "inv-item";
  pMp.innerHTML = '<span class="sicon">💧</span><div class="sinfo"><div class="sname">Poção de Mana</div><div class="sdesc">' + state.inventory.pocao_mp + 'x — recupera 25 MP</div></div>';
  itemsBox.appendChild(pMp);

  if (state.loot && state.loot.length){
    state.loot.forEach(function(item, idx){
      var div = document.createElement("div");
      div.className = "inv-item";
      div.innerHTML =
        '<span class="sicon">' + SLOT_ICONS[item.slot] + '</span>' +
        '<div class="sinfo"><div class="sname ' + rarityClass(item.rarity) + '">' + item.name + '</div>' +
        '<div class="sdesc">' + SLOT_NAMES[item.slot] + ' · ' + bonusText(item.bonus) + '</div></div>';
      var btn = document.createElement("button");
      btn.textContent = "Equipar";
      btn.addEventListener("click", function(){
        state.equipment[item.slot] = item;
        state.loot.splice(idx,1);
        renderInventory();
        renderHud();
        toast("Equipado: " + item.name);
      });
      div.appendChild(btn);
      itemsBox.appendChild(div);
    });
  }
}
function bonusText(bonus){
  var parts = [];
  if (bonus.atk) parts.push("+" + bonus.atk + " ATK");
  if (bonus.def) parts.push("+" + bonus.def + " DEF");
  if (bonus.crit) parts.push("+" + Math.round(bonus.crit*100) + "% crítico");
  if (bonus.hp) parts.push("+" + bonus.hp + " HP");
  if (bonus.mp) parts.push("+" + bonus.mp + " MP");
  return parts.join(", ") || "sem bônus";
}

/* ================= LOJA ================= */
function renderShop(){
  $("shopGold").textContent = state.gold;
  var list = $("shopList");
  list.innerHTML = "";
  SHOP_ITEMS.forEach(function(item){
    var div = document.createElement("div");
    div.className = "shopitem";
    div.innerHTML =
      '<span class="sicon">' + item.icon + '</span>' +
      '<div class="sinfo"><div class="sname">' + item.name + '</div><div class="sdesc">' + item.desc + '</div></div>' +
      '<div class="sprice">' + item.price + '💰</div>';
    var btn = document.createElement("button");
    btn.textContent = "Comprar";
    btn.disabled = state.gold < item.price;
    btn.addEventListener("click", function(){ buyItem(item); });
    div.appendChild(btn);
    list.appendChild(div);
  });
}
function buyItem(item){
  if (state.gold < item.price) return;
  state.gold -= item.price;
  state.stats.goldSpent += item.price;
  if (item.kind === "pocao"){
    if (item.id === "pocao_hp") state.inventory.pocao_hp++;
    else state.inventory.pocao_mp++;
  } else {
    var equip = { id:item.id, name:item.name, slot:item.slot, rarity:"comum", bonus:{} };
    if (item.slot === "arma") equip.bonus.atk = SLOT_BASE.arma;
    if (item.slot === "armadura") equip.bonus.def = SLOT_BASE.armadura;
    if (item.slot === "capacete") equip.bonus.def = SLOT_BASE.capacete;
    if (item.slot === "acessorio") equip.bonus.crit = 0.05;
    state.equipment[item.slot] = equip;
    state.stats.itemsFound++;
    advanceQuestsByTrackKey("itemsFound");
  }
  renderShop();
  renderHud();
  checkAchievements();
}

/* ================= TAVERNA / MAPA ================= */
function enterTown(flavor){
  renderHud();
  $("townFlavor").textContent = flavor || "Para onde vamos?";
  renderLocations();
  renderSyncPanel($("syncPanelTown"));
  showScreen("screen-town");
}
function renderLocations(){
  var grid = $("locGrid");
  grid.innerHTML = "";
  LOCATIONS.forEach(function(loc){
    var locked = state.level < loc.minLevel;
    var card = document.createElement("div");
    card.className = "loccard" + (locked ? " locked" : "");
    var meta = locked ? ("requer nível " + loc.minLevel) : "toque para explorar";
    if (!locked && loc.boss && state.level >= loc.bossAt && state.bossesDefeatedList.indexOf(loc.boss) === -1){
      meta = "o Dragão Ancião espreita aqui...";
    }
    card.innerHTML = '<span class="loc-icon">' + loc.icon + '</span><div class="loc-info"><div class="loc-name">' + loc.name + '</div><div class="loc-meta">' + meta + '</div></div>';
    if (!locked) card.addEventListener("click", function(){ exploreLocation(loc); });
    grid.appendChild(card);
  });

  if (state.level >= DUNGEON_MIN_LEVEL){
    var dcard = document.createElement("div");
    dcard.className = "loccard";
    dcard.innerHTML = '<span class="loc-icon">🗼</span><div class="loc-info"><div class="loc-name">Torre das Sombras</div><div class="loc-meta">masmorra · andar ' + state.dungeon.floor + '/' + DUNGEON_MAX_FLOOR + (state.dungeon.cleared ? " · concluída" : "") + '</div></div>';
    dcard.addEventListener("click", function(){ openDungeon(); });
    grid.appendChild(dcard);
  }
}
function exploreLocation(loc){
  var monsterKey;
  if (loc.boss && state.level >= loc.bossAt && state.bossesDefeatedList.indexOf(loc.boss) === -1 && Math.random() < 0.5){
    monsterKey = loc.boss;
  } else {
    monsterKey = loc.pool[rnd(0, loc.pool.length - 1)];
  }
  startBattle(monsterKey);
}

/* ================= MASMORRA ================= */
function openDungeon(){
  $("dungeonFlavor").textContent = state.dungeon.cleared ? "Você já dominou a Torre. Pode escalar de novo pra treinar." : "Cada andar é mais difícil que o anterior.";
  $("dungeonInfo").innerHTML =
    '<span class="k">Andar atual</span><span class="v">' + state.dungeon.floor + ' / ' + DUNGEON_MAX_FLOOR + '</span>' +
    '<span class="k">Status</span><span class="v">' + (state.dungeon.cleared ? "Concluída ✅" : "Em progresso") + '</span>';
  showScreen("screen-dungeon");
}
function enterDungeonFloor(){
  var nextFloor = state.dungeon.floor + 1;
  if (nextFloor > DUNGEON_MAX_FLOOR){
    nextFloor = 1;
  }
  if (nextFloor === DUNGEON_MAX_FLOOR){
    startBattle("senhor_das_sombras", { dungeon:true, floor:nextFloor });
  } else {
    startBattle(DUNGEON_POOL[rnd(0, DUNGEON_POOL.length-1)], { dungeon:true, floor:nextFloor });
  }
}

/* ================= BATALHA ================= */
function scaleMonster(base, floor){
  var mult = 1 + (floor-1)*0.35;
  return {
    name: base.name, icon: base.icon,
    hp: Math.round(base.hp*mult), maxHp: Math.round(base.hp*mult),
    atk: Math.round(base.atk*mult), def: Math.round(base.def*mult),
    xp: Math.round(base.xp*mult), gold: Math.round(base.gold*mult),
    boss: !!base.boss, worldBoss: !!base.worldBoss, dungeonBoss: !!base.dungeonBoss
  };
}
function startBattle(monsterKey, dungeonInfo){
  var base = MONSTERS[monsterKey];
  if (dungeonInfo && dungeonInfo.dungeon){
    battle = scaleMonster(base, dungeonInfo.floor);
    battle.monsterKey = monsterKey;
    battle.isDungeon = true;
    battle.dungeonFloor = dungeonInfo.floor;
  } else {
    battle = {
      monsterKey: monsterKey, name: base.name, icon: base.icon,
      hp: base.hp, maxHp: base.hp, atk: base.atk, def: base.def,
      xp: base.xp, gold: base.gold, boss: !!base.boss, worldBoss: !!base.worldBoss, isDungeon:false
    };
  }
  battle.playerEffects = [];
  battle.enemyEffects = [];

  $("pIcon").textContent = classDef().icon;
  $("pName").textContent = state.name;
  $("eIcon").textContent = battle.icon;
  $("eName").textContent = battle.name;
  $("battleLog").innerHTML = "";
  $("skillList").style.display = "none";
  renderBattleBars();
  logBattle((battle.boss ? "O " : "Um ") + battle.name + " apareceu!");
  setActionsEnabled(true);
  renderSyncPanel($("syncPanelBattle"));
  showScreen("screen-battle");
}

function effLabel(e){
  if (e.type === "veneno") return "☠️" + e.turns;
  if (e.type === "queimadura") return "🔥" + e.turns;
  if (e.type === "atordoamento") return "💫" + e.turns;
  if (e.type === "regeneracao") return "💚" + e.turns;
  if (e.type === "escudo") return "🛡️" + e.charges;
  if (e.type === "esquiva") return "👻" + e.charges;
  return e.type;
}
function renderEffects(list, el){
  el.innerHTML = "";
  list.forEach(function(e){
    var chip = document.createElement("span");
    chip.className = "effchip";
    chip.textContent = effLabel(e);
    el.appendChild(chip);
  });
}
function renderBattleBars(){
  $("pHpFill").style.width = clamp((state.hp/maxHp())*100,0,100) + "%";
  $("eHpFill").style.width = clamp((battle.hp/battle.maxHp)*100,0,100) + "%";
  renderEffects(battle.playerEffects, $("pEffects"));
  renderEffects(battle.enemyEffects, $("eEffects"));
  renderHud();
}
function logBattle(msg){
  var log = $("battleLog");
  var line = document.createElement("div");
  line.textContent = msg;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}
function setActionsEnabled(v){
  $("actAttack").disabled = !v;
  $("actItem").disabled = !v;
  $("actFlee").disabled = !v;
  $("actSkillsOpen").disabled = !v;
}

function processEffectsStart(list, nomeAlvo, isPlayer){
  var stunned = false;
  for (var i = list.length - 1; i >= 0; i--){
    var e = list[i];
    if (e.type === "veneno" || e.type === "queimadura"){
      var dmg = e.amount;
      if (isPlayer){ state.hp = clamp(state.hp - dmg, 0, maxHp()); state.stats.damageTaken += dmg; }
      else { battle.hp = clamp(battle.hp - dmg, 0, battle.maxHp); }
      logBattle((e.type === "veneno" ? "☠️ Veneno" : "🔥 Queimadura") + " causa " + dmg + " de dano em " + nomeAlvo + "!");
      e.turns--;
    } else if (e.type === "regeneracao"){
      var heal = e.amount;
      if (isPlayer) state.hp = clamp(state.hp + heal, 0, maxHp());
      else battle.hp = clamp(battle.hp + heal, 0, battle.maxHp);
      logBattle("💚 Regeneração cura " + heal + " HP em " + nomeAlvo + "!");
      e.turns--;
    } else if (e.type === "atordoamento"){
      stunned = true;
      e.turns--;
    }
    if ((e.turns !== undefined && e.turns <= 0)) list.splice(i,1);
  }
  return stunned;
}

function checkBattleEnd(){
  if (battle.hp <= 0){ winBattle(); return true; }
  if (state.hp <= 0){
    state.stats.battlesLost++;
    addHistory({ monster: battle.name, result: "derrota", xp:0, gold:0 });
    setActionsEnabled(false);
    checkAchievements();
    setTimeout(function(){ renderSyncPanel($("syncPanelDeath")); showScreen("screen-gameover"); }, 900);
    return true;
  }
  return false;
}

function grantLoot(){
  if (Math.random() > 0.35 && !battle.boss) return null;
  var roll = Math.random() * 100;
  var acc = 0, chosen = RARITIES[0];
  for (var i=0;i<RARITIES.length;i++){
    acc += RARITIES[i].weight;
    if (roll <= acc){ chosen = RARITIES[i]; break; }
  }
  if (battle.boss){
    var upgrade = RARITIES[Math.min(RARITIES.length-1, RARITIES.indexOf(chosen)+2)];
    chosen = upgrade;
  }
  var slots = Object.keys(SLOT_BASE);
  var slot = slots[rnd(0, slots.length-1)];
  var bonus = {};
  var base = SLOT_BASE[slot];
  var val = Math.round(base * chosen.mult);
  if (slot === "arma") bonus.atk = val;
  else if (slot === "acessorio") bonus.crit = Math.round(val) * 0.01;
  else bonus.def = val;
  var nomes = { arma:"Lâmina", armadura:"Couraça", capacete:"Elmo", acessorio:"Amuleto" };
  var item = {
    id: "loot_" + Date.now() + "_" + rnd(1,9999),
    name: chosen.name + " " + nomes[slot] + " de " + battle.name,
    slot: slot, rarity: chosen.id, bonus: bonus
  };
  if (!state.loot) state.loot = [];
  state.loot.push(item);
  state.stats.itemsFound++;
  advanceQuestsByTrackKey("itemsFound");
  return item;
}

function winBattle(){
  setActionsEnabled(false);
  logBattle("Você derrotou " + battle.name + "! +" + battle.xp + " XP, +" + battle.gold + " 💰");
  state.xp += battle.xp;
  state.gold += battle.gold;
  state.stats.goldEarned += battle.gold;
  state.stats.battlesWon++;
  state.stats.monstersDefeated++;

  if (battle.boss){
    state.stats.bossesDefeated++;
    if (state.bossesDefeatedList.indexOf(battle.monsterKey) === -1) state.bossesDefeatedList.push(battle.monsterKey);
    advanceQuestsByTrackKey("bossesDefeated");
  } else {
    advanceQuestsByMonster(battle.monsterKey);
  }

  var loot = grantLoot();
  if (loot) logBattle("🎁 Você encontrou: " + loot.name + " (" + loot.rarity + ")! Veja no Inventário.");

  var leveled = false;
  while (state.xp >= state.xpNext){
    state.xp -= state.xpNext;
    state.level++;
    state.xpNext = Math.round(state.xpNext * 1.35);
    state.attrs.forca++; state.attrs.defesa++; state.attrs.intel++; state.attrs.agilidade++; state.attrs.vitalidade++; state.attrs.sorte++;
    state.hp = maxHp();
    state.mp = maxMp();
    leveled = true;
  }
  if (leveled) logBattle("✨ Você subiu para o nível " + state.level + "! Atributos aumentados, HP e MP restaurados.");

  addHistory({ monster: battle.name, result: battle.boss ? "vitória (chefe)" : "vitória", xp: battle.xp, gold: battle.gold });

  var isDungeonFinalFloor = battle.isDungeon && battle.dungeonFloor === DUNGEON_MAX_FLOOR;
  if (battle.isDungeon){
    state.dungeon.floor = battle.dungeonFloor;
    if (isDungeonFinalFloor){
      state.dungeon.cleared = true;
      state.dungeon.floor = 0;
    }
  }

  checkAchievements();
  renderHud();

  setTimeout(function(){
    if (battle.worldBoss || isDungeonFinalFloor){
      $("victoryTitle").textContent = battle.worldBoss ? "O Dragão Ancião caiu!" : "A Torre das Sombras foi conquistada!";
      renderSyncPanel($("syncPanelVictory"));
      showScreen("screen-victory");
    } else if (battle.isDungeon){
      openDungeon();
    } else {
      enterTown("Você retorna à vila, ferido mas vitorioso.");
    }
  }, 1200);
}

function enemyTurn(){
  var stunned = processEffectsStart(battle.enemyEffects, battle.name, false);
  renderBattleBars();
  if (checkBattleEnd()) return;
  if (stunned){
    logBattle(battle.name + " está atordoado e perde o turno!");
    battle.turn = "player";
    setActionsEnabled(true);
    return;
  }

  var esquivaIdx = -1;
  for (var i=0;i<battle.playerEffects.length;i++){ if (battle.playerEffects[i].type === "esquiva"){ esquivaIdx = i; break; } }
  if (esquivaIdx !== -1 && Math.random() < 0.7){
    logBattle(battle.name + " atacou, mas você desviou nas sombras!");
    battle.playerEffects.splice(esquivaIdx,1);
    battle.turn = "player";
    setActionsEnabled(true);
    return;
  }

  var escudoIdx = -1;
  for (var j=0;j<battle.playerEffects.length;j++){ if (battle.playerEffects[j].type === "escudo"){ escudoIdx = j; break; } }
  var dmg = enemyDamage();
  if (escudoIdx !== -1){
    logBattle(battle.name + " atacou, mas seu escudo bloqueou tudo!");
    battle.playerEffects.splice(escudoIdx,1);
  } else {
    state.hp = clamp(state.hp - dmg, 0, maxHp());
    state.stats.damageTaken += dmg;
    logBattle(battle.name + " atacou! -" + dmg + " HP");
  }
  renderBattleBars();
  if (checkBattleEnd()) return;
  battle.turn = "player";
  setActionsEnabled(true);
}

function enemyDamage(){
  var base = battle.atk;
  var variance = base * 0.2;
  var dmg = base + rnd(-variance, variance);
  dmg = Math.max(1, Math.round(dmg - defTotal() * 0.5));
  return dmg;
}
function playerDamage(atkValue, mult, critBonus){
  var base = atkValue * (mult || 1);
  var variance = base * 0.2;
  var dmg = base + rnd(-variance, variance);
  dmg = Math.max(1, Math.round(dmg - battle.def * 0.5));
  var isCrit = Math.random() < clamp(critChance() + (critBonus || 0), 0, 0.95);
  if (isCrit) dmg = Math.round(dmg * critMult());
  return { dmg: dmg, crit: isCrit };
}

function applyEffectToEnemy(effect){
  if (effect === "atordoar" && Math.random() < 0.55) battle.enemyEffects.push({ type:"atordoamento", turns:1 });
  if (effect === "queimar") battle.enemyEffects.push({ type:"queimadura", turns:3, amount: Math.round(atkMagico()*0.18) });
  if (effect === "envenenar") battle.enemyEffects.push({ type:"veneno", turns:4, amount: Math.round(atkFisico()*0.15) });
}
function applyEffectToSelf(effect){
  if (effect === "escudo") battle.playerEffects.push({ type:"escudo", charges:1 });
  if (effect === "esquiva") battle.playerEffects.push({ type:"esquiva", charges:1 });
  if (effect === "regenerar") battle.playerEffects.push({ type:"regeneracao", turns:3, amount: Math.round(maxHp()*0.08) });
}

function afterPlayerAction(){
  if (checkBattleEnd()) return;
  setActionsEnabled(false);
  $("skillList").style.display = "none";
  setTimeout(enemyTurn, 800);
}

function playerAttack(){
  var stunned = processEffectsStart(battle.playerEffects, state.name, true);
  renderBattleBars();
  if (checkBattleEnd()) return;
  if (stunned){ logBattle("Você está atordoado e perde o turno!"); afterPlayerAction(); return; }

  var atkValue = classDef().key === "mago" || classDef().key === "necromante" ? atkMagico() : atkFisico();
  var r = playerDamage(atkValue, 1, 0);
  battle.hp = clamp(battle.hp - r.dmg, 0, battle.maxHp);
  state.stats.damageDealt += r.dmg;
  if (r.crit) state.stats.critHits++;
  logBattle("Você atacou! -" + r.dmg + " HP" + (r.crit ? " (crítico!)" : ""));
  renderBattleBars();
  afterPlayerAction();
}

function useSkill(skill){
  var stunned = processEffectsStart(battle.playerEffects, state.name, true);
  renderBattleBars();
  if (checkBattleEnd()) return;
  if (stunned){ logBattle("Você está atordoado e perde o turno!"); afterPlayerAction(); return; }

  if (state.mp < skill.mpCost){ toast("Mana insuficiente para " + skill.name + "!"); return; }
  state.mp -= skill.mpCost;

  if (skill.selfCost){
    var custo = Math.round(state.hp * skill.selfCost);
    state.hp = clamp(state.hp - custo, 0, maxHp());
    logBattle("Você paga " + custo + " HP para usar " + skill.name + "!");
  }

  if (skill.kind === "cura"){
    var heal = Math.round(maxHp() * skill.healPct);
    state.hp = clamp(state.hp + heal, 0, maxHp());
    logBattle("Você usou " + skill.name + "! +" + heal + " HP");
  } else if (skill.kind === "buff"){
    applyEffectToSelf(skill.effect);
    logBattle("Você usou " + skill.name + "!");
  } else {
    var atkValue = skill.kind === "magico" ? atkMagico() : atkFisico();
    var r = playerDamage(atkValue, skill.mult, skill.critBonus || 0);
    battle.hp = clamp(battle.hp - r.dmg, 0, battle.maxHp);
    state.stats.damageDealt += r.dmg;
    if (r.crit) state.stats.critHits++;
    logBattle("Você usou " + skill.name + "! -" + r.dmg + " HP" + (r.crit ? " (crítico!)" : ""));
    if (skill.drainPct){
      var healBack = Math.round(r.dmg * skill.drainPct);
      state.hp = clamp(state.hp + healBack, 0, maxHp());
      logBattle("Você drenou " + healBack + " HP de volta!");
    }
    if (skill.effect) applyEffectToEnemy(skill.effect);
  }
  renderBattleBars();
  afterPlayerAction();
}

function renderSkillList(){
  var box = $("skillList");
  var skills = classDef().skills.filter(function(s){ return !s.minLevel || state.level >= s.minLevel; });
  box.innerHTML = "";
  skills.forEach(function(s){
    var btn = document.createElement("button");
    btn.className = "btn small skillbtn";
    btn.innerHTML = "✨ " + s.name + " (" + s.mpCost + " MP)<small>" + s.desc + "</small>";
    btn.disabled = state.mp < s.mpCost;
    btn.addEventListener("click", function(){ useSkill(s); });
    box.appendChild(btn);
  });
  box.style.display = box.style.display === "none" ? "block" : "none";
}

function playerItem(){
  var stunned = processEffectsStart(battle.playerEffects, state.name, true);
  renderBattleBars();
  if (checkBattleEnd()) return;
  if (stunned){ logBattle("Você está atordoado e perde o turno!"); afterPlayerAction(); return; }

  if (state.inventory.pocao_hp > 0){
    state.inventory.pocao_hp--;
    state.hp = clamp(state.hp + 40, 0, maxHp());
    logBattle("Você bebeu uma Poção de Vida! +40 HP");
  } else if (state.inventory.pocao_mp > 0){
    state.inventory.pocao_mp--;
    state.mp = clamp(state.mp + 25, 0, maxMp());
    logBattle("Você bebeu uma Poção de Mana! +25 MP");
  } else {
    toast("Você não tem itens para usar!");
    return;
  }
  renderBattleBars();
  afterPlayerAction();
}

function playerFlee(){
  var stunned = processEffectsStart(battle.playerEffects, state.name, true);
  renderBattleBars();
  if (checkBattleEnd()) return;
  if (stunned){ logBattle("Você está atordoado e não consegue fugir!"); afterPlayerAction(); return; }

  if (Math.random() < 0.6){
    logBattle("Você fugiu do combate!");
    state.stats.fled++;
    addHistory({ monster: battle.name, result: "fuga", xp:0, gold:0 });
    setActionsEnabled(false);
    setTimeout(function(){
      if (battle.isDungeon) openDungeon();
      else enterTown("Você volta ofegante à vila.");
    }, 700);
  } else {
    logBattle("Não foi possível fugir!");
    setActionsEnabled(false);
    setTimeout(enemyTurn, 700);
  }
}

/* ================= EVENTOS ================= */
$("inputName").addEventListener("input", checkStartEnabled);
$("inputName").addEventListener("keydown", function(e){ if (e.key === "Enter" && !$("btnStart").disabled) newCharacter(); });
$("btnStart").addEventListener("click", newCharacter);

$("btnRest").addEventListener("click", function(){
  state.hp = maxHp();
  state.mp = maxMp();
  renderHud();
  $("townFlavor").textContent = "Você descansou. HP e MP restaurados!";
});
$("btnShop").addEventListener("click", function(){ renderShop(); showScreen("screen-shop"); });
$("btnShopBack").addEventListener("click", function(){ enterTown(); });
$("btnSheet").addEventListener("click", function(){ renderSheet(); showScreen("screen-sheet"); });
$("btnSheetBack").addEventListener("click", function(){ showScreen("screen-town"); });
$("btnInv").addEventListener("click", function(){ renderInventory(); showScreen("screen-inv"); });
$("btnInvBack").addEventListener("click", function(){ showScreen("screen-town"); });
$("btnQuests").addEventListener("click", function(){ renderQuests(); showScreen("screen-quests"); });
$("btnQuestsBack").addEventListener("click", function(){ showScreen("screen-town"); });

function renderAchievements(){
  var box = $("achList");
  box.innerHTML = "";
  ACHIEVEMENTS.forEach(function(a){
    var unlocked = state.achievements.indexOf(a.id) !== -1;
    var div = document.createElement("div");
    div.className = "ach-item" + (unlocked ? "" : " locked");
    div.innerHTML = '<span class="sicon">' + a.icon + '</span><div class="ainfo"><div class="aname">' + a.name + '</div><div class="adesc">' + a.desc + '</div></div>';
    box.appendChild(div);
  });
}
$("btnAch").addEventListener("click", function(){ renderAchievements(); showScreen("screen-ach"); });
$("btnAchBack").addEventListener("click", function(){ showScreen("screen-town"); });

document.querySelectorAll(".tab").forEach(function(tab){
  tab.addEventListener("click", function(){
    document.querySelectorAll(".tab").forEach(function(t){ t.classList.remove("active"); });
    tab.classList.add("active");
    $("invEquip").style.display = tab.dataset.tab === "equip" ? "block" : "none";
    $("invItens").style.display = tab.dataset.tab === "itens" ? "block" : "none";
  });
});

$("btnResetOpen").addEventListener("click", function(){ showScreen("screen-reset"); });
$("btnResetCancel").addEventListener("click", function(){ showScreen("screen-sheet"); });
$("btnResetConfirm").addEventListener("click", function(){
  var novoNome = state.name;
  var classeAtual = state.classKey;
  state = novoPersonagemPadrao(novoNome, classeAtual);
  toast("Personagem zerado localmente. Envie o comando de salvar pra confirmar no bot!");
  enterTown("Uma nova jornada começa, " + state.name + ".");
});

$("btnDungeonEnter").addEventListener("click", enterDungeonFloor);
$("btnDungeonBack").addEventListener("click", function(){ enterTown(); });

$("actAttack").addEventListener("click", playerAttack);
$("actItem").addEventListener("click", playerItem);
$("actFlee").addEventListener("click", playerFlee);
$("actSkillsOpen").addEventListener("click", renderSkillList);

$("btnRevive").addEventListener("click", function(){
  state.gold = Math.floor(state.gold / 2);
  state.hp = maxHp();
  state.mp = maxMp();
  checkAchievements();
  enterTown("Você acorda na vila, mais pobre, mas vivo.");
});
$("btnVictoryContinue").addEventListener("click", function(){ enterTown("Um herói lendário caminha por Obsidian."); });

/* ================= BOOT ================= */
renderClassGrid();

// 🔎 DEBUG TEMPORÁRIO — mostra cru o que o card recebeu, sem depender
// de nenhuma lógica minha ter funcionado. Remover depois de resolver.
var debugCru = "[DEBUG] tamanho recebido: " + (INITIAL_STATE_B64 ? INITIAL_STATE_B64.length : 0) +
  " | início: " + (INITIAL_STATE_B64 ? INITIAL_STATE_B64.slice(0,25) : "(vazio)") +
  " | fim: " + (INITIAL_STATE_B64 ? INITIAL_STATE_B64.slice(-25) : "(vazio)");
console.log(debugCru);
$("startSub").textContent = debugCru;

if (INITIAL_STATE_B64 && INITIAL_STATE_B64 !== "__INITIAL_STATE_B64__" && INITIAL_STATE_B64.length > 0){
  var jsonDecodificado = null;
  var erroEtapa = null;

  try{
    jsonDecodificado = decodeState(INITIAL_STATE_B64);
  }catch(e){
    erroEtapa = "decodeState: " + e.message;
  }

  if (jsonDecodificado && !erroEtapa){
    try{
      state = garantirCompatibilidade(jsonDecodificado);
    }catch(e){
      erroEtapa = "garantirCompatibilidade: " + e.message;
    }
  }

  if (state && !erroEtapa){
    try{
      enterTown("Bem-vindo de volta, " + state.name + "!");
    }catch(e){
      erroEtapa = "enterTown: " + e.message;
      state = null;
    }
  }

  if (erroEtapa){
    console.error("Falha ao carregar save do servidor:", erroEtapa);
    $("startSub").textContent = debugCru + " || ERRO: " + erroEtapa;
  }
} else {
  $("startSub").textContent = debugCru + " || (nenhum save recebido)";
}

})();
</script>
`;

function montarHtmlPersonalizado(prefix, jogadorSalvo) {
  var stateB64 = "";
  if (jogadorSalvo) {
    stateB64 = Buffer.from(JSON.stringify(jogadorSalvo), "utf8").toString("base64");
  }
  return RPGB_HTML
    .split("__PREFIX__").join(prefix)
    .split("__INITIAL_STATE_B64__").join(stateB64);
}

function buildRpgbRichResponse(html) {
  return {
    botForwardedMessage: {
      message: {
        richResponseMessage: {
          submessages: [
            {
              messageType: 2,
              messageText: "CRONICAS DE " + BOT_NAME.toUpperCase() + " — RPGB"
            }
          ],
          messageType: 1,
          unifiedResponse: {
            data: Buffer.from(
              JSON.stringify({
                response_id: crypto.randomUUID(),
                sections: [
                  {
                    view_model: {
                      primitive: {
                        __typename: "GenAIaeacdsnwHtmlPrimitive",
                        payload: html,
                        trusted_sources: ["api.bronxyshost.com.br"]
                      },
                      __typename: "GenAISingleLayoutViewModel"
                    }
                  }
                ]
              }),
              "utf8"
            )
          },
          contextInfo: {
            mentionedJid: [],
            groupMentions: [],
            statusAttributions: [],
            forwardingScore: 1,
            isForwarded: true,
            forwardedAiBotMessageInfo: {
              botJid: "867051314767696@bot"
            },
            forwardOrigin: 4
          }
        }
      }
    }
  };
}

function decodificarCodigoDeSave(codigo) {
  var jsonTexto = Buffer.from(codigo, "base64").toString("utf8");
  var dados = JSON.parse(jsonTexto);
  if (!dados || typeof dados !== "object") {
    throw new Error("Código inválido: não é um objeto de personagem.");
  }
  if (typeof dados.name !== "string" || !dados.name.trim()) {
    throw new Error("Código inválido: personagem sem nome.");
  }
  if (typeof dados.classKey !== "string") {
    throw new Error("Código inválido: personagem sem classe.");
  }
  if (typeof dados.level !== "number") {
    throw new Error("Código inválido: personagem sem nível.");
  }
  return dados;
}

/**
 * O WhatsApp/Baileys, durante a migração pro sistema de LID, pode
 * entregar a MESMA pessoa com identificadores diferentes em mensagens
 * diferentes (às vezes o @lid, às vezes o JID por telefone) — o
 * próprio bot já lida com essa ambiguidade em outros arquivos
 * (ex: connection.js compara p.id / p.lid / p.jid). Aqui fazemos o
 * mesmo: em grupo, cruzamos o valor bruto da mensagem com a lista de
 * participantes pra achar uma identidade ESTÁVEL pra essa pessoa,
 * em vez de confiar cegamente no valor daquela mensagem específica.
 *
 * Em conversa privada não existe key.participant de verdade — a
 * própria conversa (remoteJid) já identifica a pessoa, então usamos
 * ela como identidade estável nesse caso.
 */
async function resolverIdentidadeEstavel({ userLid, remoteJid, getGroupParticipants }) {
  const ehGrupo = typeof remoteJid === "string" && remoteJid.endsWith("@g.us");

  if (!ehGrupo) {
    return userLid || remoteJid || null;
  }

  if (!userLid) return null;

  try {
    const participantes = await getGroupParticipants(remoteJid);
    const achado = participantes.find(
      (p) => p.id === userLid || p.lid === userLid || p.jid === userLid
    );
    if (achado) {
      return achado.lid || achado.id || userLid;
    }
  } catch (erro) {
    console.error("[RPGB] Falha ao resolver identidade estável via participantes do grupo:", erro);
  }

  return userLid;
}

export default {
  name: "rpgb",
  description: "RPGB — Crônicas de Obsidian: RPG completo em HTML com save real no bot (identidade estável por participante), classes, skills, atributos, equipamentos com raridade, status de combate, loot, missões, masmorra e conquistas.",
  commands: ["rpgb"],
  usage: `${PREFIX}rpgb  |  ${PREFIX}rpgb salvar <código>`,

  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ socket, remoteJid, userLid, getGroupParticipants, fullArgs, sendSuccessReact, sendReply, sendErrorReply }) => {
    try {
      const identidade = await resolverIdentidadeEstavel({ userLid, remoteJid, getGroupParticipants });

      if (!identidade) {
        await sendErrorReply("Não consegui identificar você com segurança pra carregar/salvar o RPGB. Tente de novo em alguns segundos.");
        return;
      }

      const args = (fullArgs || "").trim();
      const ehSalvar = /^salvar\s+/i.test(args);

      if (ehSalvar) {
        const codigo = args.replace(/^salvar\s+/i, "").trim();

        if (!codigo) {
          await sendErrorReply(`Faltou o código. Use: ${PREFIX}rpgb salvar <código> (o código aparece dentro do jogo, no botão "Copiar Comando").`);
          return;
        }

        let dadosDecodificados;
        try {
          dadosDecodificados = decodificarCodigoDeSave(codigo);
        } catch (erroDecode) {
          await sendErrorReply(`❌ Não consegui ler esse código de save:\n${erroDecode.message}\n\nCopie o código certinho, sem cortar nada, direto do botão dentro do jogo.`);
          return;
        }

        const jogadorSalvo = updateRpgbPlayer(identidade, dadosDecodificados);

        await sendSuccessReact();
        await sendReply(
          `💾 *Progresso salvo com sucesso!*\n\n` +
          `🧙 ${jogadorSalvo.name} — Nível ${jogadorSalvo.level}\n` +
          `💰 ${jogadorSalvo.gold} de ouro\n\n` +
          `Mande ${PREFIX}rpgb de novo quando quiser continuar de onde parou.\n\n` +
          `🔎 debug temporário — bruto: ${userLid} | estável: ${identidade}`
        );
        return;
      }

      const jogadorSalvo = getRpgbPlayer(identidade);

      // 🔎 DEBUG TEMPORÁRIO — remover depois de confirmar que o problema sumiu.
      await sendReply(
        `🔎 debug: bruto = ${userLid} | estável = ${identidade}\n` +
        `Encontrou save salvo? ${jogadorSalvo ? "SIM (nível " + jogadorSalvo.level + ", " + jogadorSalvo.gold + " ouro)" : "NÃO"}`
      );

      const html = montarHtmlPersonalizado(PREFIX, jogadorSalvo);

      await socket.relayMessage(
        remoteJid,
        buildRpgbRichResponse(html),
        {}
      );
      await sendSuccessReact();
    } catch (error) {
      console.error("[RPGB]", error);
      await sendErrorReply("Erro ao carregar o RPGB. Tente novamente mais tarde.");
    }
  },
};
