<template>
  <div>
    <div class="page-header">
      <h2><span class="page-icon">🔢</span> Матриця оцінювання</h2>
      <button class="btn btn-primary-large" @click="saveMatrix" :disabled="saving">
        <span v-if="saving" class="spinner"></span>
        <span v-else>💾</span>
        {{ saving ? 'Збереження...' : 'Зберегти матрицю' }}
      </button>
    </div>

    <div v-if="loading" class="card">
      <div class="loading-state">
        <span class="loading-icon">⏳</span>
        Завантаження матриці...
      </div>
    </div>

    <div v-else-if="alternatives.length === 0 || criteria.length === 0" class="card">
      <div class="empty-state">
        <span class="empty-icon">⚠️</span>
        <p>
          Спочатку додайте
          <RouterLink to="/alternatives">альтернативи</RouterLink> та
          <RouterLink to="/criteria">критерії</RouterLink>.
        </p>
      </div>
    </div>

    <div v-else class="card">
      <!-- Статистика матриці -->
      <div style="padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; gap: 24px; align-items: center;">
        <div style="font-size:13px; color: var(--text-muted);">
          📐 Розмір матриці: <strong style="color: var(--text-heading);">{{ alternatives.length }} × {{ criteria.length }}</strong>
        </div>
        <div style="font-size:13px; color: var(--text-muted);">
          ✅ Заповнено: <strong style="color: var(--primary);">{{ filledCount }}</strong> / {{ alternatives.length * criteria.length }}
        </div>
        <div style="font-size:13px; color: var(--text-muted);" v-if="lastSaved">
          🕐 Збережено: <strong style="color: var(--text-heading);">{{ lastSaved }}</strong>
        </div>
      </div>

      <div class="table-wrapper" style="padding: 0;">
        <table class="matrix-table">
          <thead>
            <tr>
              <th style="text-align: left; padding-left: 20px; min-width: 140px;">Рушій / Критерій</th>
              <th v-for="crit in criteria" :key="crit.Criterion_id">
                {{ crit.Criterion_name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alt in alternatives" :key="alt.Alternative_id">
              <td class="alt-col" style="padding-left: 20px; text-align: left;">
                {{ alt.Alternative_name }}
              </td>
              <td v-for="crit in criteria" :key="crit.Criterion_id">
                <input
                  type="number"
                  class="matrix-input"
                  :class="{ 'auto-saved': recentlySaved[`${alt.Alternative_id}_${crit.Criterion_id}`] }"
                  min="1"
                  max="10"
                  :value="getScore(alt.Alternative_id, crit.Criterion_id)"
                  @input="setScore(alt.Alternative_id, crit.Criterion_id, $event.target.value)"
                  @blur="autoSaveCell(alt.Alternative_id, crit.Criterion_id)"
                  :id="`cell-${alt.Alternative_id}-${crit.Criterion_id}`"
                  placeholder="—"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { RouterLink } from 'vue-router'

const API = 'http://localhost:3000/api'
const toast = inject('toast')

const alternatives = ref([])
const criteria = ref([])
const scores = ref({}) // key: `altId_critId` → value (number)
const loading = ref(true)
const saving = ref(false)
const lastSaved = ref('')
const recentlySaved = ref({}) // tracks recently auto-saved cells for highlight

const getScore = (altId, critId) => scores.value[`${altId}_${critId}`] ?? ''
const setScore = (altId, critId, val) => {
  const num = parseFloat(val)
  if (val === '' || val === null) {
    delete scores.value[`${altId}_${critId}`]
  } else if (!isNaN(num) && num >= 1 && num <= 10) {
    scores.value[`${altId}_${critId}`] = num
  }
}

const filledCount = computed(() =>
  Object.keys(scores.value).length
)

const autoSaveCell = async (altId, critId) => {
  const key = `${altId}_${critId}`
  const val = scores.value[key]
  if (val === undefined) return
  try {
    await fetch(`${API}/vectors/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ alternative_id: altId, criterion_id: critId, mark: val }]),
    })
    recentlySaved.value[key] = true
    setTimeout(() => { delete recentlySaved.value[key] }, 1500)
  } catch {
    // silent — the full save button will catch errors
  }
}

const saveMatrix = async () => {
  saving.value = true
  try {
    const payload = Object.entries(scores.value).map(([key, mark]) => {
      const [alternative_id, criterion_id] = key.split('_').map(Number)
      return { alternative_id, criterion_id, mark }
    })

    if (payload.length === 0) {
      toast('Немає даних для збереження', 'error')
      return
    }

    const res = await fetch(`${API}/vectors/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (data.success) {
      const now = new Date()
      lastSaved.value = now.toLocaleTimeString('uk-UA')
      toast(`✅ Збережено ${data.saved} оцінок!`)
    }
  } catch (e) {
    toast('Помилка збереження матриці', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    const [altsRes, critsRes, vectorsRes] = await Promise.all([
      fetch(`${API}/alternatives`),
      fetch(`${API}/criteria`),
      fetch(`${API}/vectors`),
    ])
    alternatives.value = await altsRes.json()
    criteria.value = await critsRes.json()
    const vectors = await vectorsRes.json()

    // Populate scores map
    vectors.forEach(v => {
      scores.value[`${v.Alternative_id}_${v.Criterion_id}`] = v.Mark
    })
  } catch (e) {
    toast('Помилка завантаження даних', 'error')
  } finally {
    loading.value = false
  }
})
</script>
