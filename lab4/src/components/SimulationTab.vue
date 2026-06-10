<template>
  <div class="sim-tab">
    <!-- Score bar -->
    <div class="score-bar">
      <div class="stat-chip chip-blue">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          style="color:var(--accent-blue)">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
        </svg>
        <div>
          <div class="chip-label">Переговорник</div>
          <div class="chip-val" style="color:var(--accent-blue)">{{ store.playerScore > 0 ? '+' : '' }}{{ store.playerScore }}</div>
        </div>
      </div>
      <div class="stat-chip">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          style="color:var(--text-muted)">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
        <div>
          <div class="chip-label">Раунд</div>
          <div class="chip-val" style="color:var(--text-primary)">{{ store.round }}</div>
        </div>
      </div>
      <div class="stat-chip">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          style="color:var(--accent-amber)">
          <path d="M3 3v18h18"/>
          <path d="M18 17V9M13 17V5M8 17v-3"/>
        </svg>
        <div>
          <div class="chip-label">Середнiй бал</div>
          <div class="chip-val" :style="{ color: avgColor }">{{ store.avgScore > 0 ? '+' : '' }}{{ store.avgScore }}</div>
        </div>
      </div>
      <button class="btn btn-ghost" style="margin-left: auto;" @click="store.resetGame()">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
        Скинути
      </button>
    </div>

    <div class="sim-layout">
      <!-- LEFT: strategy selection + result -->
      <div class="sim-left" style="width: 100%">
        <div class="card" style="background: var(--bg-800); border-color: var(--bg-700);">
          <div class="card-body">
            <div class="section-header" style="margin-bottom: 24px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                style="color: var(--accent-red)">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <h3 style="font-size: 1.1rem;">Оберiть стратегiю переговорника</h3>
            </div>
            <div class="strategy-grid">
              <button
                v-for="(ps, idx) in store.playerStrategies"
                :key="idx"
                class="strategy-card"
                :class="{ selected: selectedPlayer === idx, disabled: waiting }"
                @click="selectStrategy(idx)"
              >
                <div class="s-card-code">{{ ps.code }}</div>
                <div class="s-card-name">{{ ps.name }}</div>
                <div class="s-card-desc">{{ ps.desc }}</div>
              </button>
            </div>
          </div>
        </div>

        <!-- Result card -->
        <Transition name="slide-up">
          <div v-if="store.lastMove !== null" class="card result-reveal">
            <div class="card-body">
              <div class="res-flow">
                <div class="res-block">
                  <div class="res-label">Переговорник</div>
                  <div class="res-strategy blue-strat">
                    {{ store.playerStrategies[store.lastMove.playerIdx].code }}
                    <span>{{ store.playerStrategies[store.lastMove.playerIdx].name }}</span>
                  </div>
                </div>
                <div class="res-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
                <div class="res-block">
                  <div class="res-label">Терорист</div>
                  <div class="res-strategy red-strat">
                    {{ store.enemyStrategies[store.lastMove.enemyIdx].code }}
                    <span>{{ store.enemyStrategies[store.lastMove.enemyIdx].name }}</span>
                  </div>
                </div>
                <div class="res-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
                <div class="res-block">
                  <div class="res-label">Результат</div>
                  <div class="result-value" :class="valueClass(store.lastMove.value)">
                    {{ store.lastMove.value > 0 ? '+' : '' }}{{ store.lastMove.value }}
                  </div>
                </div>
              </div>
              <div class="res-context alert mt-3"
                :class="store.lastMove.value >= 5 ? 'alert-success' : store.lastMove.value < 0 ? 'alert-danger' : 'alert-warning'">
                {{ contextText(store.lastMove.playerIdx, store.lastMove.enemyIdx, store.lastMove.value) }}
              </div>
            </div>
          </div>
        </Transition>

        <!-- Empty state -->
        <div v-if="store.lastMove === null" class="empty-hint card" style="background: var(--bg-800); border-color: var(--bg-700);">
          <div class="card-body empty-body">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
              style="color:var(--text-muted); opacity: 0.7;">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
            <p style="color: var(--text-muted); font-size: 0.95rem;">Оберiть стратегiю вище щоб почати гру</p>
          </div>
        </div>
      </div>

      <!-- RIGHT: mini matrix + history -->
      <div class="sim-right">
        <!-- Mini matrix -->
        <div class="card">
          <div class="card-body" style="padding: 16px;">
            <div class="section-header" style="margin-bottom: 14px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
              </svg>
              <h3 style="font-size:0.9rem;">Матриця виграшiв</h3>
            </div>
            <div style="overflow-x: auto;">
              <table class="matrix-table mini-matrix">
                <thead>
                  <tr>
                    <th></th>
                    <th v-for="(es, ci) in store.enemyStrategies" :key="ci">{{ es.code }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(ps, ri) in store.playerStrategies" :key="ri">
                    <td class="row-label" style="font-size:0.78rem">{{ ps.code }}</td>
                    <td
                      v-for="(_, ci) in store.enemyStrategies"
                      :key="ci"
                      :class="{
                        'cell-positive': store.matrix[ri][ci] > 0,
                        'cell-negative': store.matrix[ri][ci] < 0,
                        'cell-result-flash': isLastCell(ri, ci),
                        'cell-selected-row': store.lastMove && store.lastMove.playerIdx === ri,
                        'cell-selected-col': store.lastMove && store.lastMove.enemyIdx === ci,
                      }"
                      style="font-family:var(--font-mono); font-size:0.88rem; min-width:44px;"
                    >{{ store.matrix[ri][ci] }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- History -->
        <div class="card">
          <div class="card-body" style="padding: 16px;">
            <div class="section-header" style="margin-bottom: 14px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 8v4l3 3"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
              <h3 style="font-size:0.9rem;">Журнал раундiв</h3>
            </div>
            <div v-if="store.history.length === 0" class="hist-empty">
              <p>Раундiв ще немає</p>
            </div>
            <div v-else class="history-log">
              <div v-for="h in store.history" :key="h.round" class="history-entry">
                <span class="history-round">#{{ h.round }}</span>
                <span class="hist-tag blue-tag">{{ h.playerName }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  style="color:var(--text-muted)">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                <span class="hist-tag red-tag">{{ h.enemyName }}</span>
                <span class="history-val" :style="{ color: h.value > 0 ? 'var(--accent-green)' : h.value < 0 ? 'var(--accent-red)' : 'var(--accent-amber)' }">
                  {{ h.value > 0 ? '+' : '' }}{{ h.value }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../store/gameStore'
import { enemyRandomMove } from '../utils/gameTheory'

const store = useGameStore()
const waiting = ref(false)
const selectedPlayer = ref(null)

function selectStrategy(idx) {
  if (waiting.value) return
  selectedPlayer.value = idx
  waiting.value = true
  setTimeout(() => {
    const enemyIdx = enemyRandomMove(store.enemyStrategies.length)
    store.playRound(idx, enemyIdx)
    selectedPlayer.value = null
    waiting.value = false
  }, 600)
}

function isLastCell(r, c) {
  if (!store.lastMove) return false
  return store.lastMove.playerIdx === r && store.lastMove.enemyIdx === c
}

function valueClass(v) {
  if (v > 0) return 'positive'
  if (v < 0) return 'negative'
  return 'neutral'
}

const avgColor = computed(() => {
  const a = store.avgScore
  if (a > 3) return 'var(--accent-green)'
  if (a < 0) return 'var(--accent-red)'
  return 'var(--accent-amber)'
})

const CONTEXTS = [
  [
    'Терорист йде на переговори + переговорник будує довiру - майже iдеальний сценарiй, заручники поступово звiльняються.',
    'Терорист iгнорує емпатiю - переговорник витрачає час, мiнiмальний результат.',
    'Терорист погрожує, але переговорник зберiгає емпатiю - ситуацiя напружена, певний прогрес є.',
    'Терорист i так хоче здатися, переговорник створює "золотий мiст" - майже повне звiльнення.',
  ],
  [
    'Силовий тиск vs готовнiсть до переговорiв - нормальний результат, але терорист замкнувся.',
    'Обидва iгнорують один одного - часткова стабiлiзацiя, але без прогресу.',
    'Тиск провокує терориста на насильство - найгiрший сценарiй!',
    'Силовий тиск прискорює капiтуляцiю втомленого терориста - добрий результат.',
  ],
  [
    'Переговорник торгує, терорист зацiкавлений у вимогах - взаємовигiдний сценарiй.',
    'Навiть якщо терорист iгнорує словесний контакт, матерiальний торг змушує його взаємодiяти.',
    'Торг vs погрози - матерiальний стимул частково гасить агресiю.',
    'Терорист капiтулює i ще отримує гуманiтарну допомогу - майже iдеал.',
  ],
  [
    'Терорист хоче говорити, але переговорник обманює - середнiй результат, ризик розкриття.',
    'Дезiнформацiя не спрацьовує проти байдужого терориста - втрата очок.',
    'Дезiнформацiя проти погроз - психологiчна вiйна, але з перевагою переговорника.',
    'Дезiнформацiя не потрiбна - терорист i так здається.',
  ],
]

function contextText(pi, ei, val) {
  return CONTEXTS[pi]?.[ei] || `Результат раунду: ${val > 0 ? '+' : ''}${val} балiв`
}
</script>

<style scoped>
.sim-tab { display: flex; flex-direction: column; gap: 20px; }

/* Score bar */
.score-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* Layout */
.sim-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
  align-items: start;
}
@media (max-width: 900px) { .sim-layout { grid-template-columns: 1fr; } }

.sim-left { display: flex; flex-direction: column; gap: 16px; }
.sim-right { display: flex; flex-direction: column; gap: 16px; }

/* Result reveal */
.result-reveal { border-color: var(--accent-amber); }
.res-flow {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.res-block { text-align: center; flex: 1; min-width: 100px; }
.res-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
.res-strategy {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-family: var(--font-mono);
  font-size: 0.9rem;
}
.res-strategy span { font-family: var(--font-body); font-size: 0.75rem; font-weight: 400; }
.blue-strat { background: var(--accent-blue-dim); color: var(--accent-blue); }
.red-strat { background: var(--accent-red-dim); color: var(--accent-red); }
.res-arrow { color: var(--text-muted); flex-shrink: 0; }

/* Mini matrix */
.mini-matrix th { padding: 6px 8px; font-size: 0.75rem; }
.mini-matrix td { padding: 6px 8px; }

/* History */
.hist-empty { text-align: center; padding: 20px; color: var(--text-muted); font-size: 0.88rem; }
.hist-tag {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}
.blue-tag { background: var(--accent-blue-dim); color: var(--accent-blue); }
.red-tag { background: var(--accent-red-dim); color: var(--accent-red); }

/* Empty hint */
.empty-body { display: flex; flex-direction: column; align-items: center; gap: 10px; color: var(--text-muted); text-align: center; padding: 32px; font-size: 0.88rem; }
</style>
