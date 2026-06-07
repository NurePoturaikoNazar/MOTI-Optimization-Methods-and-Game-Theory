<template>
  <div class="decision-container" :class="{ 'fullscreen-stage': stage === 2 }">
    <div v-if="stage !== 2" class="page-header">
      <h2><span class="page-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"/><path d="m9 14 2 2 4-4"/></svg>
      </span> Прийняття рішення</h2>
    </div>

    <!-- Етап 1: Налаштування сесії -->
    <div v-if="stage === 1" class="card">
      <div class="card-body">
        <h3 style="margin-bottom: 16px;">Етап 1: Вибір експерта</h3>
        <p style="color: var(--text-muted); margin-bottom: 24px;">
          Оберіть експерта (ОПР) для початку попарного порівняння рушіїв. Це дозволить визначити найкращу альтернативу.
        </p>

        <div class="form-group">
          <label>Оберіть експерта:</label>
          <select class="form-select" v-model="selectedLprId">
            <option value="" disabled>— оберіть зі списку —</option>
            <option v-for="exp in experts" :key="exp.LPR_id" :value="exp.LPR_id">
              {{ exp.LPR_name }}
            </option>
          </select>
        </div>

        <button 
          class="btn btn-primary-large" 
          style="margin-top: 10px;"
          :disabled="!selectedLprId" 
          @click="startComparison"
        >
          🚀 Розпочати порівняння
        </button>
      </div>
    </div>

    <!-- Етап 2: Діалог порівняння -->
    <div v-if="stage === 2" class="comparison-stage">
      <div class="comparison-header">
        <h3>Попарне порівняння</h3>
        <div class="progress-bar-container">
          <div class="progress-text">Пара {{ currentPairIndex + 1 }} з {{ pairs.length }}</div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: ((currentPairIndex) / pairs.length) * 100 + '%' }"></div>
          </div>
        </div>
      </div>

      <div v-if="currentPair" class="comparison-cards-wrapper">
        <!-- Картка 1 -->
        <div class="compare-card">
          <div class="compare-card-title">{{ currentPair.alt1.Alternative_name }}</div>
          <div class="criteria-list">
            <div v-for="c in criteria" :key="c.Criterion_id" class="criterion-item">
              <span class="crit-name">{{ c.Criterion_name }}</span>
              <span class="crit-mark">{{ getMark(currentPair.alt1.Alternative_id, c.Criterion_id) }}</span>
            </div>
          </div>
          <button class="btn btn-primary btn-compare" @click="makeChoice(1)">
            Цей краще
          </button>
        </div>

        <div class="compare-divider">
          <span>VS</span>
        </div>

        <!-- Картка 2 -->
        <div class="compare-card">
          <div class="compare-card-title">{{ currentPair.alt2.Alternative_name }}</div>
          <div class="criteria-list">
            <div v-for="c in criteria" :key="c.Criterion_id" class="criterion-item">
              <span class="crit-name">{{ c.Criterion_name }}</span>
              <span class="crit-mark">{{ getMark(currentPair.alt2.Alternative_id, c.Criterion_id) }}</span>
            </div>
          </div>
          <button class="btn btn-primary btn-compare" @click="makeChoice(-1)">
            Цей краще
          </button>
        </div>
      </div>

      <div class="comparison-actions-neutral">
        <button class="btn btn-ghost" @click="makeChoice(2)">Рівні по якості</button>
        <button class="btn btn-ghost" @click="makeChoice(0)">Неспівставні</button>
      </div>
    </div>

    <!-- Етап 3: Матриця та Максимальний Елемент -->
    <div v-if="stage === 3" class="card">
      <div class="card-body">
        <h3 style="margin-bottom: 16px;">Етап 3: Матриця суміжності</h3>
        <p style="color: var(--text-muted); margin-bottom: 24px;">
          Результати всіх попарних порівнянь. Якщо елемент рядка дорівнює 1, це означає, що рушій у рядку переважає або дорівнює рушію у стовпці.
        </p>

        <div class="table-wrapper" style="margin-bottom: 24px;">
          <table class="matrix-table" style="min-width: 600px;">
            <thead>
              <tr>
                <th>Рушій</th>
                <th v-for="a in alternatives" :key="'col'+a.Alternative_id">{{ a.Alternative_name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in adjacencyMatrix" :key="'row'+alternatives[i].Alternative_id">
                <td class="alt-col">{{ alternatives[i].Alternative_name }}</td>
                <td v-for="(val, j) in row" :key="'cell'+i+'-'+j" 
                    :style="{ background: val === 1 ? 'var(--primary-light)' : 'transparent', fontWeight: val === 1 ? 'bold' : 'normal', color: val === 1 ? 'var(--primary-dark)' : 'inherit' }">
                  {{ i === j ? '-' : val }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="info-box" :style="{ background: maxElementId ? '#ECFDF5' : '#FEF2F2', borderColor: maxElementId ? '#A7F3D0' : '#FECACA', color: maxElementId ? '#065F46' : '#991B1B' }">
          <span class="info-icon">{{ maxElementId ? '✅' : '❌' }}</span>
          <div>
            <strong>Пошук Максимального елемента:</strong><br/>
            <template v-if="maxElementId">
              Знайдено! Рушій <strong>{{ getAltName(maxElementId) }}</strong> переважає всі інші альтернативи.
            </template>
            <template v-else>
              Максимальний елемент не знайдено через транзитивні суперечності (немає рядка, де всі елементи = 1).
            </template>
          </div>
        </div>

        <button class="btn btn-primary" @click="stage = 4">Перейти до фінального ранжування</button>
      </div>
    </div>

    <!-- Етап 4: Фінальне ранжування -->
    <div v-if="stage === 4" class="card">
      <div class="card-body">
        <h3 style="margin-bottom: 16px;">Етап 4: Фінальне ранжування</h3>
        <p style="color: var(--text-muted); margin-bottom: 24px;">
          <template v-if="maxElementId">
            Максимальний елемент автоматично отримав 1-ше місце. 
          </template>
          Розставте місця для рушіїв. Ранги повинні бути унікальними від 1 до {{ alternatives.length }}.
        </p>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Рушій</th>
                <th style="width: 160px;">Ранг (місце)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alt in sortedAlternatives" :key="alt.Alternative_id">
                <td class="td-name">
                  {{ alt.Alternative_name }}
                  <span v-if="alt.Alternative_id === maxElementId" class="badge badge-primary" style="margin-left: 10px;">Максимальний</span>
                </td>
                <td>
                  <input
                    type="number"
                    class="form-control"
                    style="width: 100px; text-align: center;"
                    min="1"
                    :max="alternatives.length"
                    v-model.number="finalRankings[alt.Alternative_id]"
                    :disabled="alt.Alternative_id === maxElementId"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="hasDuplicates" class="info-box" style="margin-top: 16px; background: #FEF3C7; border-color: #FCD34D; color: #92400E;">
          <span class="info-icon">⚠️</span>
          <div>Увага: ранги не повинні повторюватись.</div>
        </div>

        <div style="margin-top: 24px; display: flex; gap: 12px;">
          <button class="btn btn-ghost" @click="stage = 1">Почати заново</button>
          <button class="btn btn-primary-large" @click="saveResults" :disabled="saving || hasDuplicates">
            {{ saving ? 'Збереження...' : 'Зберегти результати в БД' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'

const API = 'http://localhost:3000/api'
const toast = inject('toast')
const router = useRouter()

const stage = ref(1)

// Дані системи
const experts = ref([])
const alternatives = ref([])
const criteria = ref([])
const vectors = ref([])

const selectedLprId = ref('')

// Дані порівняння
const pairs = ref([])
const currentPairIndex = ref(0)
const adjacencyMatrix = ref([])
const maxElementId = ref(null)

// Дані ранжування
const finalRankings = ref({})
const saving = ref(false)

const currentPair = computed(() => pairs.value[currentPairIndex.value])

const getMark = (altId, critId) => {
  const v = vectors.value.find(vec => vec.Alternative_id === altId && vec.Criterion_id === critId)
  return v ? v.Mark : 0
}

const getAltName = (id) => {
  const a = alternatives.value.find(x => x.Alternative_id === id)
  return a ? a.Alternative_name : ''
}

const sortedAlternatives = computed(() => {
  return [...alternatives.value].sort((a, b) => {
    if (a.Alternative_id === maxElementId.value) return -1
    if (b.Alternative_id === maxElementId.value) return 1
    return 0
  })
})

const hasDuplicates = computed(() => {
  const vals = Object.values(finalRankings.value).filter(v => v)
  return vals.length !== new Set(vals).size || vals.length !== alternatives.value.length
})

onMounted(async () => {
  try {
    const [eRes, aRes, cRes, vRes] = await Promise.all([
      fetch(`${API}/lprs`),
      fetch(`${API}/alternatives`),
      fetch(`${API}/criteria`),
      fetch(`${API}/vectors`)
    ])
    experts.value = await eRes.json()
    alternatives.value = await aRes.json()
    criteria.value = await cRes.json()
    vectors.value = await vRes.json()
  } catch {
    toast('Помилка завантаження даних', 'error')
  }
})

const startComparison = async () => {
  // Clear previous history
  try {
    await fetch(`${API}/decisions/history/clear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lpr_id: selectedLprId.value })
    })
  } catch (e) {
    console.error(e)
  }

  // Generate pairs
  pairs.value = []
  for (let i = 0; i < alternatives.value.length; i++) {
    for (let j = i + 1; j < alternatives.value.length; j++) {
      pairs.value.push({ alt1: alternatives.value[i], alt2: alternatives.value[j] })
    }
  }

  // Init Matrix
  const n = alternatives.value.length
  adjacencyMatrix.value = Array.from({ length: n }, () => Array(n).fill(0))

  currentPairIndex.value = 0
  stage.value = 2
}

const makeChoice = async (choice) => {
  const pair = currentPair.value
  const i = alternatives.value.findIndex(a => a.Alternative_id === pair.alt1.Alternative_id)
  const j = alternatives.value.findIndex(a => a.Alternative_id === pair.alt2.Alternative_id)

  let dbResult = 0
  if (choice === 1) { // alt1 better
    adjacencyMatrix.value[i][j] = 1
    dbResult = 1
  } else if (choice === -1) { // alt2 better
    adjacencyMatrix.value[j][i] = 1
    dbResult = -1
  } else if (choice === 2) { // equal
    adjacencyMatrix.value[i][j] = 1
    adjacencyMatrix.value[j][i] = 1
    dbResult = 0
  } else { // incomparable
    dbResult = 0
  }

  // Зберігаємо історію
  fetch(`${API}/decisions/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lpr_id: selectedLprId.value,
      alt1_id: pair.alt1.Alternative_id,
      alt2_id: pair.alt2.Alternative_id,
      result: dbResult
    })
  }).catch(e => console.error(e))

  currentPairIndex.value++
  if (currentPairIndex.value >= pairs.value.length) {
    calculateMaxElement()
    initRankings()
    stage.value = 3
  }
}

const calculateMaxElement = () => {
  maxElementId.value = null
  const n = alternatives.value.length
  for (let i = 0; i < n; i++) {
    let isMax = true
    for (let j = 0; j < n; j++) {
      if (i !== j && adjacencyMatrix.value[i][j] !== 1) {
        isMax = false
        break
      }
    }
    if (isMax) {
      maxElementId.value = alternatives.value[i].Alternative_id
      break
    }
  }
}

const initRankings = () => {
  finalRankings.value = {}
  alternatives.value.forEach((alt, idx) => {
    if (alt.Alternative_id === maxElementId.value) {
      finalRankings.value[alt.Alternative_id] = 1
    } else {
      // Default to empty or some heuristic, let's leave empty for manual
      // Actually, if they are disabled, we give 1 to max element. 
    }
  })
}

const saveResults = async () => {
  if (hasDuplicates.value) return
  saving.value = true

  try {
    const rankArray = alternatives.value.map(alt => ({
      alternative_id: alt.Alternative_id,
      alternative_range: finalRankings.value[alt.Alternative_id]
    }))

    const res = await fetch(`${API}/decisions/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lpr_id: selectedLprId.value, rankings: rankArray }),
    })

    const data = await res.json()
    if (data.success) {
      toast('Рангування успішно збережено!')
      router.push('/results')
    } else {
      throw new Error(data.error)
    }
  } catch (e) {
    toast('Помилка збереження', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.decision-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.fullscreen-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.comparison-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  overflow: hidden;
}

.comparison-header {
  padding: 24px;
  border-bottom: 1px solid var(--border);
  text-align: center;
}

.comparison-header h3 {
  font-size: 20px;
  color: var(--text-heading);
  margin-bottom: 16px;
}

.progress-bar-container {
  max-width: 400px;
  margin: 0 auto;
}

.progress-text {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 8px;
  font-weight: 500;
}

.progress-track {
  height: 8px;
  background: var(--bg);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  transition: width 0.3s ease;
}

.comparison-cards-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 40px;
  background: #FAFAF9;
}

.compare-card {
  width: 320px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  border: 1px solid var(--border);
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}

.compare-card:hover {
  transform: translateY(-4px);
}

.compare-card-title {
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  color: var(--text-heading);
  margin-bottom: 24px;
}

.criteria-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.criterion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--border);
}

.crit-name {
  font-size: 13px;
  color: var(--text-body);
}

.crit-mark {
  font-size: 15px;
  font-weight: 600;
  color: var(--primary-dark);
  background: var(--primary-light);
  padding: 2px 8px;
  border-radius: 6px;
}

.btn-compare {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  justify-content: center;
  border-radius: 10px;
}

.compare-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--text-heading);
  color: #fff;
  font-weight: 800;
  font-size: 14px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.comparison-actions-neutral {
  padding: 24px;
  display: flex;
  justify-content: center;
  gap: 16px;
  border-top: 1px solid var(--border);
  background: #fff;
}
</style>
