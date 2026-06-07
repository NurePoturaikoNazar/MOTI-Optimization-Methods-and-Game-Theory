<template>
  <div id="app-layout">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <span class="logo-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h4m-2-2v4m5-2h.01M16 12h.01"/><rect width="20" height="14" x="2" y="5" rx="2"/></svg></span>
        <h1>СППР</h1>
        <p class="logo-sub">Вибір ігрового рушія</p>
      </div>

      <nav class="sidebar-nav">
        <p class="nav-section-label">Дані системи</p>

        <RouterLink to="/" class="nav-link">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
          <span>Експерти (ОПР)</span>
        </RouterLink>

        <RouterLink to="/alternatives" class="nav-link">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4"/><path d="M8 10v4"/><circle cx="15" cy="13" r="1"/><circle cx="18" cy="11" r="1"/></svg></span>
          <span>Альтернативи</span>
        </RouterLink>

        <RouterLink to="/criteria" class="nav-link">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg></span>
          <span>Критерії</span>
        </RouterLink>

        <p class="nav-section-label" style="margin-top: 12px;">Оцінювання</p>

        <RouterLink to="/matrix" class="nav-link">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg></span>
          <span>Матриця оцінок</span>
        </RouterLink>

        <RouterLink to="/decision" class="nav-link">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"/><path d="m9 14 2 2 4-4"/></svg></span>
          <span>Прийняття рішення</span>
        </RouterLink>

        <RouterLink to="/results" class="nav-link">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></span>
          <span>Ранжування</span>
        </RouterLink>
      </nav>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- TOAST NOTIFICATIONS -->
    <div class="toast-container">
      <Transition name="toast" v-for="t in toasts" :key="t.id">
        <div class="toast" :class="{ 'toast-error': t.type === 'error' }">
          <span>{{ t.type === 'error' ? '❌' : '✅' }}</span>
          {{ t.message }}
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'

// Global toast system — used by child views via inject('toast')
const toasts = ref([])

const showToast = (message, type = 'success', duration = 3000) => {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, duration)
}

provide('toast', showToast)
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(30px); }
.toast-leave-to   { opacity: 0; transform: translateX(30px); }
</style>
