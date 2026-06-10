<template>
  <div>
    <div class="page-header">
      <h2><span class="page-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; color:var(--primary)"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> Колективний вибір</h2>
    </div>

   

    <!-- Блок 1: Профіль голосування -->
    <div class="card" style="margin-bottom: 20px;">
      <div class="card-body">
        <h3 style="margin-top: 0; display: flex; align-items: center; gap: 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary)"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
          Профіль голосування
        </h3>
        <p class="text-muted" style="margin-bottom: 16px; color: #6b7280; font-size: 0.9em;">
          Показано, як експерти розподілили місця між рушіями.
        </p>

        <div v-if="loading" class="loading-state">
          <span class="loading-icon">⏳</span>
          Завантаження...
        </div>
        <div v-else class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style="width: 80px; text-align: center;">Місце</th>
                <th v-for="expert in profile" :key="expert.LPR_name" style="text-align: center;">
                  {{ expert.LPR_name }}
                  <div style="font-size: 0.85em; font-weight: normal; color: #6b7280;">(Вага: {{ 6 - expert.LPR_range }})</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="place in 6" :key="place">
                <td style="text-align: center; font-weight: 600; color: #374151; background: #f9fafb;">{{ place }}</td>
                <td v-for="expert in profile" :key="expert.LPR_name" style="text-align: center;">
                  {{ getAlternativeByPlace(expert, place) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Блок 2: Результати розрахунку -->
    <div class="card">
      <div class="card-body">
        <h3 style="margin-top: 0; display: flex; align-items: center; gap: 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary)"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/><path d="M7 21h4"/></svg>
          Результати розрахунку
        </h3>
        <p class="text-muted" style="margin-bottom: 16px; color: #6b7280; font-size: 0.9em;">
          Формула: <strong>Сума (Бали_за_місце × Вага_експерта)</strong>, де Бали = 6 - Місце.
        </p>

        <div v-if="loading" class="loading-state">
          <span class="loading-icon">⏳</span>
          Завантаження...
        </div>
        <div v-else class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style="width: 80px; text-align: center;">Місце</th>
                <th>Назва рушія</th>
                <th>Детальний розрахунок</th>
                <th style="width: 120px; text-align: center;">Підсумковий бал</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(res, index) in results" :key="res.Alternative_name" :style="index === 0 ? 'background-color: rgba(16, 185, 129, 0.05);' : ''">
                <td style="text-align: center; font-weight: 600;">
                  <div v-if="index === 0" style="color: #10b981; display: flex; align-items: center; justify-content: center; gap: 4px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                    1
                  </div>
                  <div v-else style="color: #6b7280;">{{ index + 1 }}</div>
                </td>
                <td :style="index === 0 ? 'color: #10b981; font-weight: 600;' : 'font-weight: 500;'">
                  {{ res.Alternative_name }}
                </td>
                <td style="font-family: monospace; color: #4b5563; font-size: 13px;">
                  {{ res.calculations.join(' + ') }}
                </td>
                <td style="text-align: center; font-weight: bold; font-size: 1.1em;" :style="index === 0 ? 'color: #10b981;' : ''">
                  {{ res.totalScore }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'

const API = 'http://localhost:3000/api'
const toast = inject('toast')

const profile = ref([])
const results = ref([])
const loading = ref(true)

const loadData = async () => {
  loading.value = true
  try {
    const [profileRes, calcRes] = await Promise.all([
      fetch(`${API}/collective/profile`),
      fetch(`${API}/collective/calculate`)
    ])
    
    if (profileRes.ok) profile.value = await profileRes.json()
    else throw new Error('Помилка завантаження профілю')

    if (calcRes.ok) results.value = await calcRes.json()
    else throw new Error('Помилка розрахунку')
  } catch (err) {
    toast(err.message || 'Помилка завантаження даних', 'error')
    console.error(err)
  } finally {
    loading.value = false
  }
}

const getAlternativeByPlace = (expert, place) => {
  const ranking = expert.rankings.find(r => r.Alternative_range === place)
  return ranking ? ranking.Alternative_name : '-'
}

onMounted(() => {
  loadData()
})
</script>
