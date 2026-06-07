<template>
  <div>
    <div class="page-header">
      <h2><span class="page-icon">🏆</span> Ранжування експертами</h2>
    </div>

    <div class="info-box">
      <span class="info-icon">ℹ️</span>
      <div>
        Оберіть експерта та вкажіть місце (ранг), яке він надає кожному рушію.
        <strong>1 — найкращий рушій</strong> за думкою цього експерта.
        Ранги не повинні повторюватись.
      </div>
    </div>

    <!-- Вибір експерта -->
    <div class="card" style="margin-bottom: 20px;">
      <div class="card-body">
        <div class="form-group" style="margin-bottom: 0;">
          <label for="select-expert">Оберіть експерта:</label>
          <select
            id="select-expert"
            class="form-select"
            v-model="selectedLprId"
            @change="loadRankings"
          >
            <option value="" disabled>— оберіть зі списку —</option>
            <option v-for="exp in experts" :key="exp.LPR_id" :value="exp.LPR_id">
              {{ exp.LPR_name }} (ранг {{ exp.LPR_range }})
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Таблиця рангів -->
    <div v-if="selectedLprId">
      <div v-if="loadingRanks" class="card">
        <div class="loading-state">
          <span class="loading-icon">⏳</span>
          Завантаження...
        </div>
      </div>
      <div v-else class="card">
        <div v-if="alternatives.length === 0" class="empty-state">
          <span class="empty-icon">⚠️</span>
          <p>Немає альтернатив у системі. Спочатку <RouterLink to="/alternatives">додайте рушії</RouterLink>.</p>
        </div>
        <div v-else>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Рушій</th>
                  <th style="width: 160px;">Ранг (місце)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="alt in alternatives" :key="alt.Alternative_id">
                  <td class="td-name">{{ alt.Alternative_name }}</td>
                  <td>
                    <input
                      type="number"
                      class="form-control"
                      style="width: 100px; text-align: center;"
                      :id="`rank-${alt.Alternative_id}`"
                      min="1"
                      :max="alternatives.length"
                      v-model.number="rankings[alt.Alternative_id]"
                      :placeholder="alt.Alternative_id"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Попередження про дублікати -->
          <div v-if="hasDuplicates" class="info-box" style="margin: 16px 20px; background: #FEF3C7; border-color: #FCD34D; color: #92400E;">
            <span class="info-icon">⚠️</span>
            <div>
              Увага: деякі ранги повторюються. Кожен рушій повинен отримати унікальне місце.
            </div>
          </div>

          <div style="padding: 20px; display: flex; justify-content: flex-end;">
            <button
              class="btn btn-primary-large"
              @click="saveRankings"
              :disabled="saving || hasDuplicates"
            >
              <span v-if="saving" class="spinner"></span>
              <span v-else>💾</span>
              {{ saving ? 'Збереження...' : 'Зберегти ранги' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="card">
      <div class="empty-state">
        <span class="empty-icon">👆</span>
        <p>Оберіть експерта зі списку вище, щоб переглянути або виставити ранги.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { RouterLink } from 'vue-router'

const API = 'http://localhost:3000/api'
const toast = inject('toast')

const experts = ref([])
const alternatives = ref([])
const selectedLprId = ref('')
const rankings = ref({}) // altId → rank number
const loadingRanks = ref(false)
const saving = ref(false)

const hasDuplicates = computed(() => {
  const vals = Object.values(rankings.value).filter(v => v)
  return vals.length !== new Set(vals).size
})

const loadRankings = async () => {
  if (!selectedLprId.value) return
  loadingRanks.value = true
  rankings.value = {}
  try {
    const res = await fetch(`${API}/results/${selectedLprId.value}`)
    const rows = await res.json()
    rows.forEach(r => { rankings.value[r.Alternative_id] = r.Alternative_range })
  } catch { toast('Помилка завантаження рангів', 'error') }
  finally { loadingRanks.value = false }
}

const saveRankings = async () => {
  if (hasDuplicates.value) return
  saving.value = true
  try {
    const rankArray = alternatives.value
      .filter(alt => rankings.value[alt.Alternative_id])
      .map(alt => ({
        alternative_id: alt.Alternative_id,
        alternative_range: rankings.value[alt.Alternative_id],
      }))

    if (rankArray.length === 0) {
      toast('Немає рангів для збереження', 'error')
      return
    }

    const res = await fetch(`${API}/results/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lpr_id: selectedLprId.value, rankings: rankArray }),
    })

    const data = await res.json()
    if (data.success) toast('Ранги збережено!')
    else throw new Error(data.error)
  } catch (e) {
    toast('Помилка збереження рангів', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    const [expsRes, altsRes] = await Promise.all([
      fetch(`${API}/lprs`),
      fetch(`${API}/alternatives`),
    ])
    experts.value = await expsRes.json()
    alternatives.value = await altsRes.json()

    // Auto-select first expert if only one exists
    if (experts.value.length === 1) {
      selectedLprId.value = experts.value[0].LPR_id
      await loadRankings()
    }
  } catch { toast('Помилка завантаження', 'error') }
})
</script>
