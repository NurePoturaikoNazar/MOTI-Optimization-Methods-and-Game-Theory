<template>
  <div>
    <div class="page-header">
      <h2><span class="page-icon">📊</span> Критерії оцінювання</h2>
      <button class="btn btn-primary" @click="openModal()">
        ➕ Додати критерій
      </button>
    </div>

    <div class="info-box">
      <span class="info-icon">💡</span>
      <div>
        <strong>Підказка:</strong> Усі критерії зведено до шкали <strong>MAX</strong>, тобто більше значення означає кращий. Тому назви критеріїв слід формулювати так, щоб їх збільшення відповідало покращенню оцінки.
      </div>
    </div>

    <div class="stat-cards">
      <div class="stat-card">
        <span class="stat-icon">📊</span>
        <div class="stat-num">{{ criteria.length }}</div>
        <div class="stat-label">Критеріїв</div>
      </div>
    </div>

    <div class="card">
      <div v-if="loading" class="loading-state">
        <span class="loading-icon">⏳</span>
        Завантаження...
      </div>
      <div v-else-if="criteria.length === 0" class="empty-state">
        <span class="empty-icon">📊</span>
        <p>Немає критеріїв. Додайте перший!</p>
      </div>
      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Назва критерію</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="crit in criteria" :key="crit.Criterion_id">
              <td class="td-id">#{{ crit.Criterion_id }}</td>
              <td class="td-name">{{ crit.Criterion_name }}</td>
              <td class="td-actions">
                <div class="actions-group">
                  <button class="btn btn-accent btn-sm btn-icon" @click="openModal(crit)" title="Редагувати">✏️</button>
                  <button class="btn btn-danger btn-sm btn-icon" @click="deleteCrit(crit)" title="Видалити">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Модальне вікно -->
    <Teleport to="body">
      <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <h3>{{ editingCrit ? 'Редагувати' : 'Новий' }} критерій</h3>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>
          <form @submit.prevent="saveCrit">
            <div class="form-group">
              <label for="crit-name">Назва критерію *</label>
              <input
                id="crit-name"
                v-model="form.Criterion_name"
                class="form-control"
                type="text"
                placeholder="Наприклад: Легкість освоєння (Max)"
                required
              />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-ghost" @click="closeModal">Скасувати</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner"></span>
                {{ editingCrit ? 'Оновити' : 'Зберегти' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'

const API = 'http://localhost:3000/api'
const toast = inject('toast')

const criteria = ref([])
const loading = ref(true)
const modalOpen = ref(false)
const editingCrit = ref(null)
const saving = ref(false)
const form = ref({ Criterion_name: '' })

const fetchCriteria = async () => {
  try {
    const res = await fetch(`${API}/criteria`)
    criteria.value = await res.json()
  } catch { toast('Помилка завантаження', 'error') }
  finally { loading.value = false }
}

const openModal = (crit = null) => {
  editingCrit.value = crit
  form.value = crit ? { Criterion_name: crit.Criterion_name } : { Criterion_name: '' }
  modalOpen.value = true
}

const closeModal = () => { modalOpen.value = false; editingCrit.value = null }

const saveCrit = async () => {
  saving.value = true
  try {
    if (editingCrit.value) {
      await fetch(`${API}/criteria/${editingCrit.value.Criterion_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      })
      toast('Критерій оновлено!')
    } else {
      await fetch(`${API}/criteria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      })
      toast('Критерій додано!')
    }
    await fetchCriteria()
    closeModal()
  } catch { toast('Помилка збереження', 'error') }
  finally { saving.value = false }
}

const deleteCrit = async (crit) => {
  if (!confirm(`Видалити "${crit.Criterion_name}"? Оцінки матриці по цьому критерію також буде видалено.`)) return
  try {
    await fetch(`${API}/criteria/${crit.Criterion_id}`, { method: 'DELETE' })
    toast(`"${crit.Criterion_name}" видалено`)
    await fetchCriteria()
  } catch { toast('Помилка видалення', 'error') }
}

onMounted(fetchCriteria)
</script>
