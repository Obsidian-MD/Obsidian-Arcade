// arcade.js

export const games = new Map();

export function registerGame(game) {
  if (!game?.id || typeof game.init !== "function") {
    console.error("[ARCADE] Jogo inválido:", game);
    return;
  }

  games.set(game.id, game);
  console.log(`[ARCADE] Jogo registrado: ${game.name}`);
}

const STORAGE_KEY = "obsidian_arcade_stats";

function loadStats() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveStats(stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export const arcade = {
  getStats(id) {
    const stats = loadStats();

    return stats[id] || {
      played: 0,
      score: 0,
      record: 0,
      wins: 0,
      losses: 0,
    };
  },

  saveStats(id, data) {
    const stats = loadStats();

    stats[id] = {
      ...this.getStats(id),
      ...data,
    };

    saveStats(stats);
  },

  addPlayed(id) {
    const stats = this.getStats(id);

    this.saveStats(id, {
      played: stats.played + 1,
    });
  },

  setRecord(id, score) {
    const stats = this.getStats(id);

    if (Number(score) > Number(stats.record)) {
      this.saveStats(id, {
        score: Number(score),
        record: Number(score),
      });

      return true;
    }

    this.saveStats(id, {
      score: Number(score),
    });

    return false;
  },

  getRecord(id) {
    return this.getStats(id).record || 0;
  },

  win(id) {
    const stats = this.getStats(id);

    this.saveStats(id, {
      wins: stats.wins + 1,
    });
  },

  lose(id) {
    const stats = this.getStats(id);

    this.saveStats(id, {
      losses: stats.losses + 1,
    });
  },

  playSound(type = "click") {
    try {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) return;

      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const frequencies = {
        click: 440,
        eat: 660,
        score: 880,
        win: 1000,
        lose: 180,
      };

      osc.frequency.value = frequencies[type] || 440;
      osc.type = "square";

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.12
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  },
};

window.registerGame = registerGame;
window.arcade = arcade;
window.arcadeGames = games;