import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/TargetsView.vue'),
  },
  {
    path: '/check-results/:targetId/:method/:endpoint',
    name: 'CheckResults',
    component: () => import('../views/CheckResultsView.vue'),
    props: true, // Pass route params (targetId) as props
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
