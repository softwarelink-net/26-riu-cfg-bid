<template>
  <div class="hud-panel p-6">
    <form class="space-y-4" @submit.prevent="submit">
      <div>
        <label class="hud-label block mb-1.5">工作邮箱</label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:border-sky-500"
          placeholder="admin@softwarelink.net"
        />
      </div>
      <div>
        <label class="hud-label block mb-1.5">访问口令</label>
        <input
          v-model="password"
          type="password"
          required
          class="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:border-sky-500"
          placeholder="••••••••"
        />
      </div>

      <div class="rounded-md border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400 space-y-1">
        <p>演示账号：</p>
        <p><span class="text-sky-300">Admin</span> admin@softwarelink.net / Admin@2026!Sec</p>
        <p><span class="text-amber-300">Auditor</span> auditor@softwarelink.net / Auditor@2026!Sec</p>
      </div>

      <p v-if="error" class="text-sm text-rose-400">{{ error }}</p>

      <button type="submit" class="btn-primary w-full justify-center" :disabled="loading">
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
        <KeyRound v-else class="w-4 h-4" />
        {{ loading ? '校验中…' : '证书模拟登录' }}
      </button>

      <RouterLink to="/" class="btn-ghost w-full justify-center">以访客身份继续</RouterLink>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { KeyRound, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('admin@softwarelink.net')
const password = ref('Admin@2026!Sec')
const loading = ref(false)
const error = ref('')

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await auth.login(email.value, password.value)
    router.replace(route.query.redirect || '/')
  } catch (e) {
    error.value = e.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>
