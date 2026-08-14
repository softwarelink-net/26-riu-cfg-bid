import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from './api'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref(null)
    const user = ref(null)

    const isAuthenticated = computed(() => Boolean(token.value && user.value))
    const role = computed(() => user.value?.role || 'GUEST')
    const displayName = computed(() => user.value?.display_name || '访客')

    function hasRole(roles = []) {
      if (!roles.length) return true
      if (roles.includes('GUEST') && !isAuthenticated.value) return true
      return roles.includes(role.value)
    }

    async function login(email, password) {
      const data = await api.login(email, password)
      token.value = data.token
      user.value = data.user
      localStorage.setItem('riu_token', data.token)
      return data.user
    }

    async function logout() {
      try {
        await api.logout()
      } catch {
        /* ignore */
      }
      token.value = null
      user.value = null
      localStorage.removeItem('riu_token')
    }

    function hydrateToken() {
      const t = localStorage.getItem('riu_token')
      if (t && !token.value) token.value = t
    }

    return {
      token,
      user,
      isAuthenticated,
      role,
      displayName,
      hasRole,
      login,
      logout,
      hydrateToken,
    }
  },
  {
    persist: {
      key: 'riu-auth',
      paths: ['token', 'user'],
    },
  },
)
