import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
        meta: { public: true },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'tender',
        component: () => import('@/views/TenderExplorerView.vue'),
        meta: { title: '招标公告', roles: ['GUEST', 'AUDITOR', 'AVIONICS_ADMIN'] },
      },
      {
        path: 'riu',
        name: 'riu',
        component: () => import('@/views/RiuSimulatorView.vue'),
        meta: { title: 'RIU ICD 仿真器', roles: ['GUEST', 'AUDITOR', 'AVIONICS_ADMIN'] },
      },
      {
        path: 'artifacts',
        name: 'artifacts',
        component: () => import('@/views/ArtifactVerifierView.vue'),
        meta: { title: '产物校验', roles: ['GUEST', 'AUDITOR', 'AVIONICS_ADMIN'] },
      },
      {
        path: 'compliance',
        name: 'compliance',
        component: () => import('@/views/ComplianceAuditView.vue'),
        meta: { title: '合规审计', roles: ['AUDITOR', 'AVIONICS_ADMIN'] },
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/AdminDashboardView.vue'),
        meta: { title: '系统管理', roles: ['AUDITOR', 'AVIONICS_ADMIN'] },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  auth.hydrateToken()

  if (to.meta.public) return true

  const roles = to.meta.roles || []
  if (!roles.length) return true

  // Guest-accessible routes
  if (roles.includes('GUEST') && !auth.isAuthenticated) return true

  if (!auth.isAuthenticated) {
    if (roles.includes('GUEST')) return true
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (!roles.includes(auth.role)) {
    return { name: 'tender', query: { denied: '1' } }
  }

  return true
})

export default router
