<template>
  <div class="app-wrapper">
    <!-- Landing hero (shown on first visit) -->
    <div v-if="showLanding" class="landing">
      <!-- Background grid -->
      <div class="land-bg">
        <svg class="land-grid" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
        <div class="land-glow land-glow-1"></div>
        <div class="land-glow land-glow-2"></div>
      </div>

      <div class="land-content">
        <!-- SVG illustration -->
        <div class="land-illustration">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"
            class="hero-svg">
            <!-- Building -->
            <rect x="3" y="6" width="14" height="16" rx="1" stroke="rgba(239,68,68,0.6)"/>
            <rect x="5" y="8" width="2" height="2" fill="rgba(239,68,68,0.3)" stroke="none"/>
            <rect x="9" y="8" width="2" height="2" fill="rgba(239,68,68,0.3)" stroke="none"/>
            <rect x="13" y="8" width="2" height="2" fill="rgba(239,68,68,0.3)" stroke="none"/>
            <rect x="5" y="12" width="2" height="2" fill="rgba(239,68,68,0.3)" stroke="none"/>
            <rect x="13" y="12" width="2" height="2" fill="rgba(239,68,68,0.3)" stroke="none"/>
            <rect x="8" y="18" width="4" height="4" fill="rgba(245,158,11,0.4)" stroke="none"/>
            <!-- Negotiator icon -->
            <circle cx="20" cy="5" r="2.5" stroke="rgba(59,130,246,0.8)"/>
            <path d="M17 11.5c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="rgba(59,130,246,0.8)"/>
            <!-- Signal lines -->
            <path d="M14.5 10 L18 8" stroke="rgba(59,130,246,0.4)" stroke-dasharray="1 1"/>
            <path d="M14.5 12 L18 10" stroke="rgba(59,130,246,0.3)" stroke-dasharray="1 1"/>
          </svg>
        </div>

        <h1 class="land-title">
          Переговори<br/>
          <span class="land-highlight">про заручникiв</span>
        </h1>
        <p class="land-desc">
          Антагоністична гра з нульовою сумою.<br/>
          Переговорник проти терориста - хто обере оптимальну стратегiю?
        </p>

        <!-- Info cards -->
        <div class="land-cards">
          <div class="land-card">
            <div class="lc-icon lc-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
              </svg>
            </div>
            <div class="lc-text">
              <div class="lc-title">Матриця 4x4</div>
              <div class="lc-desc">Редагована матриця виграшiв</div>
            </div>
          </div>
          <div class="land-card">
            <div class="lc-icon lc-amber">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
            <div class="lc-text">
              <div class="lc-title">Симуляцiя</div>
              <div class="lc-desc">Грайте раунди проти AI</div>
            </div>
          </div>
          <div class="land-card">
            <div class="lc-icon lc-green">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="lc-text">
              <div class="lc-title">Аналiз</div>
              <div class="lc-desc">Максимiн, мiнiмакс, змiшанi</div>
            </div>
          </div>
        </div>

        <!-- Theory snippet -->
        <div class="land-theory">
          <div class="theory-row">
            <div class="theory-item">
              <div class="theory-label">Розмiр матрицi</div>
              <div class="theory-val">4 × 4</div>
            </div>
            <div class="theory-divider"></div>
            <div class="theory-item">
              <div class="theory-label">Максимiн (α)</div>
              <div class="theory-val amber">3</div>
            </div>
            <div class="theory-divider"></div>
            <div class="theory-item">
              <div class="theory-label">Мiнiмакс (β)</div>
              <div class="theory-val">5</div>
            </div>
            <div class="theory-divider"></div>
            <div class="theory-item">
              <div class="theory-label">Цiна гри (v)</div>
              <div class="theory-val green">3.5</div>
            </div>
          </div>
        </div>

        <button class="btn btn-primary land-btn" @click="showLanding = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Розпочати гру
        </button>

        <p class="land-footer">
          Нульова сума - Змiшанi стратегii - Теорiя iгор
        </p>
      </div>
    </div>

    <!-- Main app -->
    <div v-else class="main-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-top">
          <button class="back-btn" @click="showLanding = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <div class="logo">
            <div class="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
              </svg>
            </div>
            <div>
              <div class="logo-title">ЛБ №4</div>
              <div class="logo-sub">МОТІ</div>
            </div>
          </div>
        </div>

        <!-- Scenario info -->
        <div class="scenario-box">
          <div class="scenario-label">Сценарiй</div>
          <div class="scenario-name">Переговори про заручникiв</div>
          <div class="scenario-type">Антагонiстична гра / Нульова сума</div>
        </div>

        <!-- Nav -->
        <nav class="sidebar-nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="nav-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <span class="nav-icon" v-html="tab.icon"></span>
            <div class="nav-info">
              <span class="nav-label">{{ tab.label }}</span>
              <span class="nav-desc">{{ tab.desc }}</span>
            </div>
            <span class="nav-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </span>
          </button>
        </nav>

        <!-- Score mini -->
        <div class="sidebar-score">
          <div class="score-item">
            <span class="score-lbl">Раунд</span>
            <span class="score-num">{{ store.round }}</span>
          </div>
          <div class="score-divider"></div>
          <div class="score-item">
            <span class="score-lbl">Рахунок</span>
            <span class="score-num" :style="{ color: store.playerScore >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }">
              {{ store.playerScore > 0 ? '+' : '' }}{{ store.playerScore }}
            </span>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="main-content">
        <div class="content-header">
          <div class="ch-title">
            <h2>{{ currentTab.label }}</h2>
          </div>
        </div>
        <div class="content-body">
          <Transition name="fade" mode="out-in">
            <MatrixTab v-if="activeTab === 'matrix'" key="matrix" />
            <SimulationTab v-else-if="activeTab === 'simulation'" key="simulation" />
            <StrategyTab v-else-if="activeTab === 'strategy'" key="strategy" />
          </Transition>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from './store/gameStore'
import MatrixTab from './components/MatrixTab.vue'
import SimulationTab from './components/SimulationTab.vue'
import StrategyTab from './components/StrategyTab.vue'

const store = useGameStore()
const showLanding = ref(true)
const activeTab = ref('matrix')

const tabs = [
  {
    id: 'matrix',
    label: 'Матриця гри',
    desc: 'Перегляд та редагування',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>`,
  },
  {
    id: 'simulation',
    label: 'Симуляцiя',
    desc: 'Грай раунди',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  },
  {
    id: 'strategy',
    label: 'Оптимальна стратегiя',
    desc: 'Розрахунок',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
  },
]

const currentTab = computed(() => tabs.find(t => t.id === activeTab.value))
</script>

<style scoped>
/* ---- App wrapper ---- */
.app-wrapper { min-height: 100vh; }

/* ============================
   LANDING
   ============================ */
.landing {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: var(--bg-900);
}

.land-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.land-grid { position: absolute; inset: 0; }
.land-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}
.land-glow-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(239,68,68,0.25) 0%, transparent 70%);
  top: -100px; right: -100px;
}
.land-glow-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%);
  bottom: -100px; left: -50px;
}

.land-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  padding: 40px 24px;
  max-width: 680px;
}

.land-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 14px;
  border-radius: 99px;
  background: var(--accent-red-dim);
  border: 1px solid var(--accent-red-glow);
  color: var(--accent-red);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.land-illustration {
  margin: 4px 0;
}
.hero-svg {
  animation: floatAnim 4s ease-in-out infinite;
}
@keyframes floatAnim {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.land-title {
  font-size: clamp(2rem, 6vw, 3.2rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  color: var(--text-primary);
  margin: 0;
}
.land-highlight {
  background: linear-gradient(135deg, #ef4444, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.land-desc {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.65;
  max-width: 460px;
}

/* Info cards */
.land-cards {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
.land-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  text-align: left;
  min-width: 170px;
}
.lc-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.lc-blue { background: var(--accent-blue-dim); color: var(--accent-blue); }
.lc-amber { background: var(--accent-amber-dim); color: var(--accent-amber); }
.lc-green { background: var(--accent-green-dim); color: var(--accent-green); }
.lc-title { font-weight: 600; font-size: 0.88rem; margin-bottom: 2px; }
.lc-desc { font-size: 0.78rem; color: var(--text-muted); }

/* Theory strip */
.land-theory {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 16px 24px;
  width: 100%;
}
.theory-row {
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap;
  justify-content: space-around;
}
.theory-item { text-align: center; padding: 0 16px; }
.theory-label { font-size: 0.72rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
.theory-val { font-family: var(--font-mono); font-size: 1.4rem; font-weight: 800; color: var(--text-primary); }
.theory-val.amber { color: var(--accent-amber); }
.theory-val.green { color: var(--accent-green); }
.theory-divider { width: 1px; height: 36px; background: var(--border); flex-shrink: 0; }

.land-btn {
  padding: 14px 36px;
  font-size: 1rem;
  border-radius: var(--radius-md);
  margin-top: 4px;
}

.land-footer {
  color: var(--text-muted);
  font-size: 0.78rem;
  letter-spacing: 0.05em;
}

/* ============================
   MAIN LAYOUT
   ============================ */
.main-layout {
  display: flex;
  min-height: 100vh;
}

/* ---- Sidebar ---- */
.sidebar {
  width: 260px;
  background: var(--bg-panel);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-top {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-bottom: 1px solid var(--border);
}
.back-btn {
  width: 32px; height: 32px;
  border-radius: var(--radius-sm);
  background: var(--bg-600);
  border: 1px solid var(--border);
  color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all var(--transition);
  flex-shrink: 0;
}
.back-btn:hover { color: var(--text-primary); background: var(--bg-700); }

.logo { display: flex; align-items: center; gap: 10px; }
.logo-icon {
  width: 34px; height: 34px;
  border-radius: 9px;
  background: var(--accent-red);
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.logo-title { font-weight: 700; font-size: 0.95rem; line-height: 1.2; }
.logo-sub { font-size: 0.72rem; color: var(--text-muted); }

/* Scenario box */
.scenario-box {
  margin: 12px;
  padding: 12px 14px;
  background: var(--accent-red-dim);
  border: 1px solid var(--accent-red-glow);
  border-radius: var(--radius-md);
}
.scenario-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--accent-red); opacity: 0.8; }
.scenario-name { font-weight: 700; font-size: 0.9rem; margin-top: 2px; color: var(--text-primary); }
.scenario-type { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }

/* Nav */
.sidebar-nav { padding: 8px 10px; flex: 1; display: flex; flex-direction: column; gap: 2px; }
.nav-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition);
  text-align: left;
}
.nav-btn:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
.nav-btn.active { background: var(--accent-red-dim); color: var(--text-primary); border: 1px solid var(--accent-red-glow); }
.nav-icon { color: var(--text-muted); display: flex; flex-shrink: 0; }
.nav-btn.active .nav-icon { color: var(--accent-red); }
.nav-info { flex: 1; display: flex; flex-direction: column; }
.nav-label { font-weight: 600; font-size: 0.87rem; }
.nav-desc { font-size: 0.72rem; color: var(--text-muted); }
.nav-arrow { color: var(--text-muted); opacity: 0; transition: opacity var(--transition); }
.nav-btn:hover .nav-arrow, .nav-btn.active .nav-arrow { opacity: 1; }

/* Sidebar score */
.sidebar-score {
  border-top: 1px solid var(--border);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.score-item { text-align: center; }
.score-lbl { display: block; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-muted); margin-bottom: 4px; }
.score-num { font-family: var(--font-mono); font-size: 1.2rem; font-weight: 700; }
.score-divider { width: 1px; height: 28px; background: var(--border); }

/* ---- Main content ---- */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--bg-800);
}

.content-header {
  padding: 18px 28px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-panel);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}
.ch-title { display: flex; align-items: center; gap: 12px; }
.ch-title h2 { margin: 0; font-size: 1.25rem; }
.ch-badge {
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--accent-red-dim);
  color: var(--accent-red);
  border: 1px solid var(--accent-red-glow);
}
.ch-breadcrumb { font-size: 0.78rem; color: var(--text-muted); }

.content-body { flex: 1; padding: 24px 28px; overflow-y: auto; }

/* Responsive */
@media (max-width: 768px) {
  .main-layout { flex-direction: column; }
  .sidebar { width: 100%; height: auto; position: static; flex-direction: row; flex-wrap: wrap; }
  .content-body { padding: 16px; }
}
</style>
