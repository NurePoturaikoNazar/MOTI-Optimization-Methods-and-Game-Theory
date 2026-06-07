<template>
  <div>
    <div class="page-header">
      <h2><span class="page-icon">👥</span> Експерти (ОПР)</h2>
      <button class="btn btn-primary" @click="openModal()">
        ➕ Додати експерта
      </button>
    </div>

    <!-- Статистика -->
    <div class="stat-cards">
      <div class="stat-card">
        <span class="stat-icon">👥</span>
        <div class="stat-num">{{ experts.length }}</div>
        <div class="stat-label">Всього експертів</div>
      </div>
    </div>

    <!-- Таблиця -->
    <div class="card">
      <div v-if="loading" class="loading-state">
        <span class="loading-icon">⏳</span>
        Завантаження...
      </div>
      <div v-else-if="experts.length === 0" class="empty-state">
        <span class="empty-icon">🔍</span>
        <p>Немає жодного експерта. Додайте першого!</p>
      </div>
      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ім'я / Назва</th>
              <th>Ранг важливості</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expert in experts" :key="expert.LPR_id">
              <td class="td-id">#{{ expert.LPR_id }}</td>
              <td class="td-name">{{ expert.LPR_name }}</td>
              <td>
                <span class="badge badge-accent">Ранг {{ expert.LPR_range }}</span>
              </td>
              <td class="td-actions">
                <div class="actions-group">
                  <button class="btn btn-accent btn-sm btn-icon" @click="openModal(expert)" title="Редагувати">✏️</button>
                  <button class="btn btn-danger btn-sm btn-icon" @click="deleteExpert(expert)" title="Видалити">🗑️</button>
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
            <h3>{{ editingExpert ? 'Редагувати' : 'Новий' }} експерт</h3>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>

          <form @submit.prevent="saveExpert">
            <div class="form-group">
              <label for="exp-name">Ім'я / Назва *</label>
              <input
                id="exp-name"
                v-model="form.LPR_name"
                class="form-control"
                type="text"
                placeholder="Наприклад: Іван Петренко"
                required
              />
            </div>
            <div class="form-group">
              <label for="exp-rank">Ранг важливості *</label>
              <input
                id="exp-rank"
                v-model.number="form.LPR_range"
                class="form-control"
                type="number"
                min="1"
                placeholder="1 — найважливіший"
                required
              />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-ghost" @click="closeModal">Скасувати</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner"></span>
                {{ editingExpert ? 'Оновити' : 'Зберегти' }}
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

const experts = ref([])
const loading = ref(true)
const modalOpen = ref(false)
const editingExpert = ref(null)
const saving = ref(false)
const form = ref({ LPR_name: '', LPR_range: 1 })

const fetchExperts = async () => {
  try {
    const res = await fetch(`${API}/lprs`)
    experts.value = await res.json()
  } catch (e) {
    toast('Помилка завантаження експертів', 'error')
  } finally {
    loading.value = false
  }
}

const openModal = (expert = null) => {
  editingExpert.value = expert
  form.value = expert
    ? { LPR_name: expert.LPR_name, LPR_range: expert.LPR_range }
    : { LPR_name: '', LPR_range: experts.value.length + 1 }
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  editingExpert.value = null
}

const saveExpert = async () => {
  saving.value = true
  try {
    if (editingExpert.value) {
      await fetch(`${API}/lprs/${editingExpert.value.LPR_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      })
      toast('Експерта оновлено!')
    } else {
      await fetch(`${API}/lprs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      })
      toast('Експерта додано!')
    }
    await fetchExperts()
    closeModal()
  } catch (e) {
    toast('Помилка збереження', 'error')
  } finally {
    saving.value = false
  }
}

const deleteExpert = async (expert) => {
  if (!confirm(`Видалити "${expert.LPR_name}"? Також видаляться всі його ранги.`)) return
  try {
    await fetch(`${API}/lprs/${expert.LPR_id}`, { method: 'DELETE' })
    toast(`"${expert.LPR_name}" видалено`)
    await fetchExperts()
  } catch (e) {
    toast('Помилка видалення', 'error')
  }
}

onMounted(fetchExperts)
</script>
