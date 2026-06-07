import { createRouter, createWebHistory } from 'vue-router'
import ExpertsView      from '../views/ExpertsView.vue'
import AlternativesView from '../views/AlternativesView.vue'
import CriteriaView     from '../views/CriteriaView.vue'
import MatrixView       from '../views/MatrixView.vue'
import ResultsView      from '../views/ResultsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',              name: 'experts',      component: ExpertsView      },
    { path: '/alternatives',  name: 'alternatives', component: AlternativesView },
    { path: '/criteria',      name: 'criteria',     component: CriteriaView     },
    { path: '/matrix',        name: 'matrix',       component: MatrixView       },
    { path: '/results',       name: 'results',      component: ResultsView      },
  ],
})

export default router
