<template>
  <div class="strat-tab">
    <!-- Header -->
    <div class="st-header">
      <div class="st-hero">
        <div class="st-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <h2 class="st-title">Оптимальна стратегiя</h2>
          <p class="st-subtitle">Покроковий розрахунок: максимiн, мiнiмакс, змiшанi стратегii</p>
        </div>
      </div>
      <button class="btn btn-primary" @click="calculate">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"/>
          <path d="M17 14v6M14 17h6"/>
        </svg>
        Розрахувати
      </button>
    </div>

    <!-- Results -->
    <Transition name="fade">
      <div v-if="result" class="results-area">

        <!-- Step 1: Maximin -->
        <div class="step-card card">
          <div class="step-badge">Крок 1</div>
          <div class="card-body">
            <div class="section-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3"/>
              </svg>
              <h3>Мiнiмуми по рядках (максимiн)</h3>
            </div>
            <p class="step-note">Знаходимо мiнiмальний виграш переговорника при кожнiй стратегii (найгiрший сценарiй)</p>
            <div style="overflow-x:auto; margin: 14px 0;">
              <table class="matrix-table analysis-table">
                <thead>
                  <tr>
                    <th>Стратегiя</th>
                    <th v-for="(es, ci) in store.enemyStrategies" :key="ci">{{ es.code }}</th>
                    <th class="min-col">min</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(ps, ri) in store.playerStrategies" :key="ri"
                    :class="{ 'row-optimal': ri === result.maximin.rowIndex }">
                    <td class="row-label">
                      <span class="code-pill blue-pill">{{ ps.code }}</span>
                      {{ ps.name }}
                    </td>
                    <td v-for="(_, ci) in store.enemyStrategies" :key="ci"
                      :class="{ 'cell-positive': store.matrix[ri][ci] > 0, 'cell-negative': store.matrix[ri][ci] < 0 }"
                      style="font-family:var(--font-mono)">
                      {{ store.matrix[ri][ci] }}
                    </td>
                    <td class="min-val"
                      :class="{ 'alpha-cell': ri === result.maximin.rowIndex }">
                      <strong>{{ result.maximin.rowMins[ri] }}</strong>
                      <span v-if="ri === result.maximin.rowIndex" class="maximin-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                        max
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="formula-box">
              <span style="color:var(--text-muted)">α = maximin = </span>
              max({{ result.maximin.rowMins.join(', ') }}) =
              <span style="color:var(--accent-green); font-weight:700"> {{ result.maximin.alpha }}</span>
              <span style="color:var(--text-muted)"> → Стратегiя </span>
              <span style="color:var(--accent-blue)">{{ store.playerStrategies[result.maximin.rowIndex].code }}</span>
            </div>
          </div>
        </div>

        <!-- Step 2: Minimax -->
        <div class="step-card card">
          <div class="step-badge step-badge-amber">Крок 2</div>
          <div class="card-body">
            <div class="section-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3"/>
              </svg>
              <h3>Максимуми по стовпцях (мiнiмакс)</h3>
            </div>
            <p class="step-note">Знаходимо максимальний виграш переговорника при кожнiй стратегii терориста (найгiрший для терориста)</p>
            <div style="overflow-x:auto; margin: 14px 0;">
              <table class="matrix-table analysis-table">
                <thead>
                  <tr>
                    <th>Стратегiя</th>
                    <th v-for="(ps, ri) in store.playerStrategies" :key="ri">{{ ps.code }}</th>
                    <th class="min-col">max</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(es, ci) in store.enemyStrategies" :key="ci"
                    :class="{ 'row-optimal-amber': ci === result.minimax.colIndex }">
                    <td class="row-label">
                      <span class="code-pill red-pill">{{ es.code }}</span>
                      {{ es.name }}
                    </td>
                    <td v-for="(_, ri) in store.playerStrategies" :key="ri"
                      :class="{ 'cell-positive': store.matrix[ri][ci] > 0, 'cell-negative': store.matrix[ri][ci] < 0 }"
                      style="font-family:var(--font-mono)">
                      {{ store.matrix[ri][ci] }}
                    </td>
                    <td class="min-val"
                      :class="{ 'beta-cell': ci === result.minimax.colIndex }">
                      <strong>{{ result.minimax.colMaxes[ci] }}</strong>
                      <span v-if="ci === result.minimax.colIndex" class="maximin-arrow amber-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                        min
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="formula-box">
              <span style="color:var(--text-muted)">β = minimax = </span>
              min({{ result.minimax.colMaxes.join(', ') }}) =
              <span style="color:var(--accent-amber); font-weight:700"> {{ result.minimax.beta }}</span>
              <span style="color:var(--text-muted)"> → Стратегiя </span>
              <span style="color:var(--accent-red)">{{ store.enemyStrategies[result.minimax.colIndex].code }}</span>
            </div>
          </div>
        </div>

        <!-- Step 3: Saddle point check -->
        <div class="step-card card">
          <div class="step-badge step-badge-green">Крок 3</div>
          <div class="card-body">
            <div class="section-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path v-if="result.saddle.found" d="m9 12 2 2 4-4"/>
                <path v-else d="m15 9-6 6M9 9l6 6"/>
              </svg>
              <h3>Перевiрка сiдлової точки</h3>
            </div>
            <div class="formula-box">
              α = <span style="color:var(--accent-green)">{{ result.maximin.alpha }}</span>
              &nbsp;&nbsp;
              <span style="color:var(--text-muted)">vs</span>
              &nbsp;&nbsp;
              β = <span style="color:var(--accent-amber)">{{ result.minimax.beta }}</span>
              &nbsp;&nbsp;&nbsp;
              <span v-if="result.saddle.found" style="color:var(--accent-green)">α = β → Сiдлова точка iснує!</span>
              <span v-else style="color:var(--accent-red)">α ≠ β → Сiдлової точки немає</span>
            </div>
            <div v-if="result.saddle.found" class="alert alert-success mt-3">
              Сiдлова точка: (<strong>{{ store.playerStrategies[result.saddle.row].code }}</strong>,
              <strong>{{ store.enemyStrategies[result.saddle.col].code }}</strong>) = {{ result.saddle.value }}.
              Оптимальна чиста стратегiя переговорника: <strong>{{ store.playerStrategies[result.saddle.row].name }}</strong>.
            </div>
            <div v-else class="alert alert-danger mt-3">
              Гра не має сiдлової точки у чистих стратегiях. Необхiдно знайти оптимальну <strong>змiшану стратегiю</strong>.
            </div>
          </div>
        </div>

        <!-- Step 4+5: Mixed strategies (only if no saddle) -->
        <template v-if="!result.saddle.found">
          <!-- Step 4: Dominance elimination -->
          <div class="step-card card">
            <div class="step-badge" style="background:var(--bg-600); color:var(--text-secondary);">Крок 4</div>
            <div class="card-body">
              <div class="section-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18M7 12h10M11 18h2"/>
                </svg>
                <h3>Виключення домiнованих стратегiй</h3>
              </div>
              <p class="step-note">Стратегiя А домiнує Б, якщо при кожному виборi противника виграш не менший</p>

              <div v-if="result.mixed.reduction.eliminatedRows.length > 0 || result.mixed.reduction.eliminatedCols.length > 0"
                class="elim-list">
                <div v-if="result.mixed.reduction.eliminatedRows.length > 0" class="elim-block">
                  <div class="elim-label">Виключено рядки (переговорник):</div>
                  <div class="elim-tags">
                    <span v-for="r in result.mixed.reduction.eliminatedRows" :key="r" class="elim-tag">
                      {{ store.playerStrategies[r].code }} - {{ store.playerStrategies[r].name }}
                    </span>
                  </div>
                </div>
                <div v-if="result.mixed.reduction.eliminatedCols.length > 0" class="elim-block">
                  <div class="elim-label">Виключено стовпцi (терорист):</div>
                  <div class="elim-tags">
                    <span v-for="c in result.mixed.reduction.eliminatedCols" :key="c" class="elim-tag red-elim">
                      {{ store.enemyStrategies[c].code }} - {{ store.enemyStrategies[c].name }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="alert alert-info mt-3">Жодна стратегiя не є строго домiнованою</div>

              <!-- Reduced matrix after dominance elimination -->
              <div v-if="result.mixed.reduction.reducedMatrix.length > 0" class="mt-4">
                <div class="submatrix-label">Пiдматриця пiсля скорочення</div>
                <div style="overflow-x:auto">
                  <table class="matrix-table analysis-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th v-for="cl in result.mixed.reduction.keptColLabels" :key="cl">{{ cl }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, ri) in result.mixed.reduction.reducedMatrix" :key="ri">
                        <td class="row-label">
                          <span class="code-pill blue-pill">{{ result.mixed.reduction.keptRowLabels[ri] }}</span>
                        </td>
                        <td v-for="(val, ci) in row" :key="ci"
                          :class="{ 'cell-positive': val > 0, 'cell-negative': val < 0 }"
                          style="font-family:var(--font-mono)">{{ val }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- 2x2 submatrix actually used for mixed strategy -->
              <div v-if="result.mixed.mixed && result.mixed.reduction.final2x2" class="mt-4">
                <div class="submatrix-label" style="color:var(--accent-amber)">Пiдматриця 2x2 для розрахунку змiшаних стратегiй</div>
                <div style="overflow-x:auto">
                  <table class="matrix-table analysis-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th v-for="cl in result.mixed.reduction.finalColLabels" :key="cl">{{ cl }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, ri) in result.mixed.reduction.final2x2" :key="ri">
                        <td class="row-label">
                          <span class="code-pill blue-pill">{{ result.mixed.reduction.finalRowLabels[ri] }}</span>
                        </td>
                        <td v-for="(val, ci) in row" :key="ci"
                          :class="{ 'cell-positive': val > 0, 'cell-negative': val < 0 }"
                          style="font-family:var(--font-mono)">{{ val }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 5: Mixed strategy result -->
          <div v-if="result.mixed.mixed" class="step-card card">
            <div class="step-badge" style="background:var(--accent-green); color:#000;">Крок 5</div>
            <div class="card-body">
              <div class="section-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
                <h3>Змiшана стратегiя - результат</h3>
              </div>

              <!-- Formula using actual 2x2 sub -->
              <div class="formula-box">
                <span style="color:var(--text-muted)">Пiдматриця: </span>
                a={{ result.mixed.mixed.sub2x2[0][0] }},
                b={{ result.mixed.mixed.sub2x2[0][1] }},
                c={{ result.mixed.mixed.sub2x2[1][0] }},
                d={{ result.mixed.mixed.sub2x2[1][1] }}<br/>
                p = (d - c) / (a - b - c + d) =
                ({{ result.mixed.mixed.sub2x2[1][1] }} - {{ result.mixed.mixed.sub2x2[1][0] }}) /
                ({{ result.mixed.mixed.sub2x2[0][0] }} - {{ result.mixed.mixed.sub2x2[0][1] }} -
                {{ result.mixed.mixed.sub2x2[1][0] }} + {{ result.mixed.mixed.sub2x2[1][1] }}) =
                <span style="color:var(--accent-green); font-weight:700"> {{ result.mixed.mixed.p1 }}</span>
              </div>

              <!-- Probabilities -->
              <div class="probs-grid mt-4">
                <div class="prob-section">
                  <div class="prob-section-title">Переговорник</div>
                  <div v-for="(label, i) in result.mixed.mixed.rowLabels" :key="i" class="prob-row">
                    <span class="code-pill blue-pill">{{ label }}</span>
                    <div class="prob-bar-wrap">
                      <div class="prob-bar-bg">
                        <div class="prob-bar-fill" :style="{
                          width: (i === 0 ? result.mixed.mixed.p1 : result.mixed.mixed.p2) * 100 + '%',
                          background: 'var(--accent-blue)'
                        }"></div>
                      </div>
                      <span class="prob-label">{{ i === 0 ? result.mixed.mixed.p1 : result.mixed.mixed.p2 }}</span>
                    </div>
                  </div>
                </div>
                <div class="prob-section">
                  <div class="prob-section-title">Терорист</div>
                  <div v-for="(label, i) in result.mixed.mixed.colLabels" :key="i" class="prob-row">
                    <span class="code-pill red-pill">{{ label }}</span>
                    <div class="prob-bar-wrap">
                      <div class="prob-bar-bg">
                        <div class="prob-bar-fill" :style="{
                          width: (i === 0 ? result.mixed.mixed.q1 : result.mixed.mixed.q2) * 100 + '%',
                          background: 'var(--accent-red)'
                        }"></div>
                      </div>
                      <span class="prob-label">{{ i === 0 ? result.mixed.mixed.q1 : result.mixed.mixed.q2 }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Game value -->
              <div class="game-value-box mt-4">
                <div class="gv-label">Цiна гри</div>
                <div class="gv-value">v = {{ result.mixed.mixed.value }}</div>
                <p class="gv-desc">
                  Переговорник гарантує середнiй виграш <strong>{{ result.mixed.mixed.value }}</strong> очок при оптимальнiй змiшанiй стратегii.
                  Стратегiї <strong>{{ result.mixed.mixed.rowLabels.join(' та ') }}</strong> застосовуються з
                  iмовiрностями <strong>{{ result.mixed.mixed.p1 }}</strong> та <strong>{{ result.mixed.mixed.p2 }}</strong>.
                </p>
              </div>
            </div>
          </div>

          <!-- Cannot solve 2x2 -->
          <div v-else class="card">
            <div class="card-body">
              <div class="alert alert-warning">
                Пiдматриця не зводиться до 2x2 пiсля виключення домiнованих стратегiй. Для точного розрахунку
                необхiдно застосувати метод лiнiйного програмування.
              </div>
            </div>
          </div>
        </template>

      </div>
    </Transition>

    <!-- Empty state -->
    <div v-if="!result" class="empty-calc card">
      <div class="card-body empty-body-large">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h3>Натиснiть "Розрахувати"</h3>
        <p>Буде виконано покроковий аналiз матрицi гри: максимiн, мiнiмакс, перевiрка сiдлової точки та змiшанi стратегii.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '../store/gameStore'
import {
  findMaximin,
  findMinimax,
  findSaddlePoint,
  solveMixedStrategies,
} from '../utils/gameTheory'

const store = useGameStore()
const result = ref(null)

function calculate() {
  const m = store.matrix
  const rowLabels = store.playerStrategies.map(s => s.code)
  const colLabels = store.enemyStrategies.map(s => s.code)

  const maximin = findMaximin(m)
  const minimax = findMinimax(m)
  const saddle = findSaddlePoint(m)
  const mixed = solveMixedStrategies(m, rowLabels, colLabels)

  result.value = { maximin, minimax, saddle, mixed }
}
</script>

<style scoped>
.strat-tab { display: flex; flex-direction: column; gap: 20px; }

/* Header */
.st-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.st-hero { display: flex; align-items: center; gap: 14px; }
.st-icon {
  width: 52px; height: 52px;
  border-radius: 14px;
  background: var(--accent-amber-dim);
  border: 1px solid rgba(245,158,11,0.3);
  display: flex; align-items: center; justify-content: center;
  color: var(--accent-amber);
  flex-shrink: 0;
}
.st-title { margin: 0; }
.st-subtitle { color: var(--text-muted); font-size: 0.88rem; margin-top: 2px; }

/* Step card */
.step-card { position: relative; }
.step-badge {
  position: absolute;
  top: -1px;
  left: 20px;
  background: var(--accent-red);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.step-badge-amber { background: var(--accent-amber); color: #000; }
.step-badge-green { background: var(--accent-green); color: #000; }

.results-area { display: flex; flex-direction: column; gap: 16px; }

/* Analysis table */
.analysis-table th { background: var(--bg-800); }
.row-optimal td { background: rgba(59,130,246,0.07); }
.row-optimal-amber td { background: rgba(245,158,11,0.07); }
.min-col { color: var(--text-primary) !important; }
.min-val { font-family: var(--font-mono); }
.alpha-cell { background: rgba(59,130,246,0.15) !important; color: var(--accent-blue); }
.beta-cell { background: rgba(245,158,11,0.15) !important; color: var(--accent-amber); }

.maximin-arrow {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--accent-blue);
  margin-left: 4px;
  vertical-align: middle;
}
.amber-arrow { color: var(--accent-amber); }

.step-note { color: var(--text-muted); font-size: 0.85rem; margin-top: -10px; margin-bottom: 4px; }

/* Pills */
.code-pill {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  margin-right: 6px;
}
.blue-pill { background: var(--accent-blue-dim); color: var(--accent-blue); }
.red-pill { background: var(--accent-red-dim); color: var(--accent-red); }

/* Elimination */
.elim-list { display: flex; flex-direction: column; gap: 10px; margin: 14px 0; }
.elim-block {}
.elim-label { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; }
.elim-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.elim-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  background: var(--accent-blue-dim);
  color: var(--accent-blue);
  border: 1px solid rgba(59,130,246,0.2);
  font-size: 0.8rem;
  font-weight: 500;
}
.red-elim {
  background: var(--accent-red-dim);
  color: var(--accent-red);
  border-color: rgba(239,68,68,0.2);
}

/* Probs */
.probs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 600px) { .probs-grid { grid-template-columns: 1fr; } }
.prob-section {}
.prob-section-title { font-weight: 600; font-size: 0.88rem; margin-bottom: 10px; color: var(--text-secondary); }
.prob-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.prob-label { font-family: var(--font-mono); font-size: 0.85rem; font-weight: 600; min-width: 40px; }

/* Game value */
.game-value-box {
  background: var(--bg-700);
  border: 1px solid rgba(16,185,129,0.3);
  border-radius: var(--radius-md);
  padding: 18px 22px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.gv-label { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-muted); }
.gv-value { font-family: var(--font-mono); font-size: 2rem; font-weight: 800; color: var(--accent-green); }
.gv-desc { color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5; flex: 1; min-width: 200px; margin: 0; }

/* Empty */
.empty-calc {}
.empty-body-large {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 52px 24px;
}
.empty-icon {
  width: 72px; height: 72px;
  border-radius: 50%;
  background: var(--bg-700);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.empty-body-large h3 { margin: 0; color: var(--text-primary); }
.empty-body-large p { color: var(--text-muted); font-size: 0.88rem; max-width: 380px; line-height: 1.6; margin: 0; }
</style>
