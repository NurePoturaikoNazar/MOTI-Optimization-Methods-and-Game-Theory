<template>
  <div>
    <div class="page-header">
      <h2><span class="page-icon">🕹️</span> Альтернативи (Ігрові рушії)</h2>
      <button class="btn btn-primary" @click="openModal()">
        ➕ Додати рушій
      </button>
    </div>

    <div class="stat-cards">
      <div class="stat-card">
        <span class="stat-icon">🕹️</span>
        <div class="stat-num">{{ alternatives.length }}</div>
        <div class="stat-label">Рушіїв у системі</div>
      </div>
    </div>

    <div class="card">
      <div v-if="loading" class="loading-state">
        <span class="loading-icon">⏳</span>
        Завантаження...
      </div>
      <div v-else-if="alternatives.length === 0" class="empty-state">
        <span class="empty-icon">🕹️</span>
        <p>Немає альтернатив. Додайте перший рушій!</p>
      </div>
      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Назва рушія</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alt in alternatives" :key="alt.Alternative_id">
              <td class="td-id">#{{ alt.Alternative_id }}</td>
              <td class="td-name">{{ alt.Alternative_name }}</td>
              <td class="td-actions">
                <div class="actions-group">
                  <button class="btn btn-accent btn-sm btn-icon" @click="openModal(alt)" title="Редагувати">✏️</button>
                  <button class="btn btn-danger btn-sm btn-icon" @click="deleteAlt(alt)" title="Видалити">🗑️</button>
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
            <h3>{{ editingAlt ? 'Редагувати' : 'Новий' }} рушій</h3>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>
          <form @submit.prevent="saveAlt">
            <div class="form-group">
              <label for="alt-name">Назва рушія *</label>
              <input
                id="alt-name"
                v-model="form.Alternative_name"
                class="form-control"
                type="text"
                placeholder="Наприклад: Godot Engine"
                required
              />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-ghost" @click="closeModal">Скасувати</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner"></span>
                {{ editingAlt ? 'Оновити' : 'Зберегти' }}
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

const alternatives = ref([])
const loading = ref(true)
const modalOpen = ref(false)
const editingAlt = ref(null)
const saving = ref(false)
const form = ref({ Alternative_name: '' })

const fetchAlts = async () => {
  try {
    const res = await fetch(`${API}/alternatives`)
    alternatives.value = await res.json()
  } catch { toast('Помилка завантаження', 'error') }
  finally { loading.value = false }
}

const openModal = (alt = null) => {
  editingAlt.value = alt
  form.value = alt ? { Alternative_name: alt.Alternative_name } : { Alternative_name: '' }
  modalOpen.value = true
}

const closeModal = () => { modalOpen.value = false; editingAlt.value = null }

const saveAlt = async () => {
  saving.value = true
  try {
    if (editingAlt.value) {
      await fetch(`${API}/alternatives/${editingAlt.value.Alternative_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      })
      toast('Рушій оновлено!')
    } else {
      await fetch(`${API}/alternatives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      })
      toast('Рушій додано!')
    }
    await fetchAlts()
    closeModal()
  } catch { toast('Помилка збереження', 'error') }
  finally { saving.value = false }
}

const deleteAlt = async (alt) => {
  if (!confirm(`Видалити "${alt.Alternative_name}"? Оцінки матриці також буде видалено.`)) return
  try {
    await fetch(`${API}/alternatives/${alt.Alternative_id}`, { method: 'DELETE' })
    toast(`"${alt.Alternative_name}" видалено`)
    await fetchAlts()
  } catch { toast('Помилка видалення', 'error') }
}

onMounted(fetchAlts)
</script>
