<template>
  <div class="matrix-tab">
    <!-- Header -->
    <div class="mt-header">
      <div class="mt-hero">
        <div class="mt-hero-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
          </svg>
        </div>
        <div>
          <h2 class="mt-title">Матриця гри</h2>
          <p class="mt-subtitle">Переговорник максимізує виграш, терорист мінімізує</p>
        </div>
      </div>
      <button class="btn btn-ghost" @click="store.resetMatrix()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
        Скинути
      </button>
    </div>

    <!-- Players legend -->
    <div class="players-legend">
      <div class="player-card player-negotiator">
        <div class="player-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div>
          <div class="player-role">Гравець 1 - Рядки</div>
          <div class="player-name">Переговорник</div>
          <div class="player-goal">Максимизує виграш</div>
        </div>
      </div>
      <div class="players-vs">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"/>
          <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/>
          <path d="M12 20v-8"/>
          <path d="M12 8V4"/>
          <path d="M12 12H8"/>
          <path d="M12 12h4"/>
        </svg>
      </div>
      <div class="player-card player-terrorist">
        <div class="player-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
        <div>
          <div class="player-role">Гравець 2 - Стовпці</div>
          <div class="player-name">Терорист</div>
          <div class="player-goal">Мінімізує виграш</div>
        </div>
      </div>
    </div>

    <!-- Matrix table -->
    <div class="card" style="overflow: auto;">
      <div class="card-body" style="padding: 0; overflow: auto;">
        <table class="matrix-table game-matrix">
          <thead>
            <tr>
              <th class="corner-cell">
                <span class="corner-p">П\Т</span>
              </th>
              <th v-for="(es, ci) in store.enemyStrategies" :key="ci" class="col-header">
                <div class="col-code">{{ es.code }}</div>
                <div class="col-name">{{ es.name }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ps, ri) in store.playerStrategies" :key="ri">
              <td class="row-header">
                <div class="row-code">{{ ps.code }}</div>
                <div class="row-name">{{ ps.name }}</div>
              </td>
              <td v-for="(_, ci) in store.enemyStrategies" :key="ci" class="val-cell">
                <div class="input-wrap">
                  <input
                    type="number"
                    class="mat-input"
                    :value="store.matrix[ri][ci]"
                    @change="store.setCell(ri, ci, $event.target.value)"
                    :class="{
                      'input-positive': store.matrix[ri][ci] > 0,
                      'input-negative': store.matrix[ri][ci] < 0,
                    }"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Legend -->
    <div class="score-legend">
      <div class="legend-item">
        <span class="legend-dot dot-green"></span>
        <span>Позитивне значення - перевага переговорника</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot dot-red"></span>
        <span>Вiд'ємне значення - перевага терориста</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot dot-gray"></span>
        <span>Нейтральне (0) - рівновага</span>
      </div>
    </div>

    <!-- Strategy descriptions -->
    <div class="strategies-grid">
      <div class="strat-section">
        <div class="section-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
          </svg>
          <h3>Стратегii переговорника</h3>
        </div>
        <div class="strat-list">
          <div v-for="ps in store.playerStrategies" :key="ps.code" class="strat-item strat-blue">
            <span class="strat-code">{{ ps.code }}</span>
            <div>
              <div class="strat-name">{{ ps.name }}</div>
              <div class="strat-desc">{{ ps.desc }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="strat-section">
        <div class="section-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
          </svg>
          <h3>Стратегii терориста</h3>
        </div>
        <div class="strat-list">
          <div v-for="es in store.enemyStrategies" :key="es.code" class="strat-item strat-red">
            <span class="strat-code strat-code-red">{{ es.code }}</span>
            <div>
              <div class="strat-name">{{ es.name }}</div>
              <div class="strat-desc">{{ es.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../store/gameStore'
const store = useGameStore()
</script>

<style scoped>
.matrix-tab { display: flex; flex-direction: column; gap: 20px; }

.mt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.mt-hero { display: flex; align-items: center; gap: 14px; }
.mt-hero-icon {
  width: 52px; height: 52px;
  border-radius: 14px;
  background: var(--accent-red-dim);
  border: 1px solid var(--accent-red-glow);
  display: flex; align-items: center; justify-content: center;
  color: var(--accent-red);
  flex-shrink: 0;
}
.mt-title { margin: 0; }
.mt-subtitle { color: var(--text-muted); font-size: 0.88rem; margin-top: 2px; }

/* Players legend */
.players-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  flex-wrap: wrap;
}
.player-card {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 220px;
}
.player-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.player-negotiator .player-icon { background: var(--accent-blue-dim); color: var(--accent-blue); }
.player-terrorist .player-icon { background: var(--accent-red-dim); color: var(--accent-red); }
.player-role { font-size: 0.72rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.player-name { font-weight: 700; font-size: 1rem; }
.player-negotiator .player-name { color: var(--accent-blue); }
.player-terrorist .player-name { color: var(--accent-red); }
.player-goal { font-size: 0.8rem; color: var(--text-muted); }
.players-vs { color: var(--text-muted); flex-shrink: 0; }

/* Matrix */
.game-matrix { min-width: 600px; }
.corner-cell {
  background: var(--bg-700);
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
  min-width: 140px;
  text-align: center;
}
.corner-p { font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-muted); font-weight: 600; }
.col-header { min-width: 100px; vertical-align: middle; }
.col-code {
  font-family: var(--font-mono);
  color: var(--accent-red);
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 2px;
}
.col-name { font-size: 0.78rem; color: var(--text-secondary); font-weight: 500; white-space: nowrap; }

.row-header {
  background: var(--bg-700);
  border-right: 1px solid var(--border);
  text-align: left;
  padding: 12px 16px;
}
.row-code {
  font-family: var(--font-mono);
  color: var(--accent-blue);
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 2px;
}
.row-name { font-size: 0.82rem; color: var(--text-secondary); font-weight: 500; }

.val-cell { padding: 10px 8px; }
.input-wrap { display: flex; justify-content: center; }
.input-positive { border-color: rgba(16,185,129,0.4) !important; color: var(--accent-green) !important; }
.input-negative { border-color: rgba(239,68,68,0.4) !important; color: var(--accent-red) !important; }

/* Legend */
.score-legend {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
  font-size: 0.83rem;
  color: var(--text-muted);
}
.legend-item { display: flex; align-items: center; gap: 7px; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.dot-green { background: var(--accent-green); }
.dot-red { background: var(--accent-red); }
.dot-gray { background: var(--text-muted); }

/* Strategies */
.strategies-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 700px) { .strategies-grid { grid-template-columns: 1fr; } }

.strat-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 18px; }
.strat-list { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
.strat-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--bg-700);
  border: 1px solid var(--border);
}
.strat-code {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  background: var(--accent-blue-dim);
  color: var(--accent-blue);
  white-space: nowrap;
  margin-top: 2px;
}
.strat-code-red { background: var(--accent-red-dim); color: var(--accent-red); }
.strat-name { font-weight: 600; font-size: 0.88rem; margin-bottom: 2px; }
.strat-desc { font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; }
</style>
