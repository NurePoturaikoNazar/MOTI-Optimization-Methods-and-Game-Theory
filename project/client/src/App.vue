<template>
  <div id="app-layout">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <span class="logo-icon">🎮</span>
        <h1>СППР</h1>
        <p class="logo-sub">Вибір ігрового рушія</p>
      </div>

      <nav class="sidebar-nav">
        <p class="nav-section-label">Дані системи</p>

        <RouterLink to="/" class="nav-link">
          <span class="nav-icon">👥</span>
          <span>Експерти (ОПР)</span>
        </RouterLink>

        <RouterLink to="/alternatives" class="nav-link">
          <span class="nav-icon">🕹️</span>
          <span>Альтернативи</span>
        </RouterLink>

        <RouterLink to="/criteria" class="nav-link">
          <span class="nav-icon">📊</span>
          <span>Критерії</span>
        </RouterLink>

        <p class="nav-section-label" style="margin-top: 12px;">Оцінювання</p>

        <RouterLink to="/matrix" class="nav-link">
          <span class="nav-icon">🔢</span>
          <span>Матриця оцінок</span>
        </RouterLink>

        <RouterLink to="/results" class="nav-link">
          <span class="nav-icon">🏆</span>
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
