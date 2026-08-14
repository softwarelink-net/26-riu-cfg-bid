<template>
  <div class="min-h-[calc(100vh-40px)] flex">
    <!-- Sidebar -->
    <aside
      :class="[
        'border-r border-slate-800 bg-slate-950/70 backdrop-blur-md transition-all duration-300 flex flex-col',
        collapsed ? 'w-[72px]' : 'w-64',
      ]"
    >
      <div class="h-14 px-3 flex items-center gap-3 border-b border-slate-800">
        <div class="w-9 h-9 rounded-md bg-sky-600/20 border border-sky-500/40 flex items-center justify-center shrink-0">
          <Radio class="w-4 h-4 text-sky-400" />
        </div>
        <div v-if="!collapsed" class="min-w-0">
          <p class="text-sm font-semibold truncate">RIU CFG BID</p>
          <p class="text-[10px] text-slate-500 truncate">0730-2611010442/01</p>
        </div>
      </div>

      <nav class="flex-1 p-2 space-y-1">
        <RouterLink
          v-for="item in visibleNav"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-slate-300 hover:bg-slate-800/80 hover:text-white transition"
          active-class="!bg-sky-600/15 !text-sky-300 border border-sky-500/30"
        >
          <component :is="item.icon" class="w-4 h-4 shrink-0" />
          <span v-if="!collapsed">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="p-2 border-t border-slate-800">
        <button class="btn-ghost w-full justify-center" @click="collapsed = !collapsed">
          <ChevronsLeft v-if="!collapsed" class="w-4 h-4" />
          <ChevronsRight v-else class="w-4 h-4" />
          <span v-if="!collapsed">收起侧栏</span>
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 min-w-0 flex flex-col">
      <header class="h-14 border-b border-slate-800 bg-slate-950/50 backdrop-blur px-4 flex items-center justify-between gap-4">
        <div class="min-w-0">
          <div class="flex items-center gap-2 text-xs text-slate-500">
            <span>门户</span>
            <ChevronRight class="w-3 h-3" />
            <span class="text-slate-300">{{ currentTitle }}</span>
          </div>
          <h2 class="text-sm font-semibold text-slate-100 truncate">{{ currentTitle }}</h2>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden sm:flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-md border border-slate-700 bg-slate-900/70">
            <span
              :class="[
                'w-2 h-2 rounded-full',
                syncOk ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400',
              ]"
            />
            <span class="text-slate-400">边缘同步</span>
            <span class="text-slate-200 font-mono">{{ syncOk ? 'ONLINE' : 'DEGRADED' }}</span>
          </div>

          <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-slate-700 bg-slate-900/70">
            <Shield class="w-3.5 h-3.5 text-sky-400" />
            <span class="text-xs font-medium">{{ auth.displayName }}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-sky-300 border border-sky-500/20">
              {{ auth.role }}
            </span>
          </div>

          <RouterLink v-if="!auth.isAuthenticated" to="/login" class="btn-primary !py-1.5 !text-xs">
            登录
          </RouterLink>
          <button v-else class="btn-ghost !py-1.5 !text-xs" @click="onLogout">退出</button>
        </div>
      </header>

      <main class="flex-1 overflow-auto p-4 md:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import {
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardCheck,
  FileText,
  Hexagon,
  Radio,
  Settings2,
  Shield,
  ShieldCheck,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/stores/api'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const syncOk = ref(true)

const nav = [
  { to: '/', label: '招标公告', icon: FileText, roles: ['GUEST', 'AUDITOR', 'AVIONICS_ADMIN'] },
  { to: '/riu', label: 'RIU ICD 仿真', icon: Hexagon, roles: ['GUEST', 'AUDITOR', 'AVIONICS_ADMIN'] },
  { to: '/artifacts', label: '产物校验', icon: ClipboardCheck, roles: ['GUEST', 'AUDITOR', 'AVIONICS_ADMIN'] },
  { to: '/compliance', label: '合规审计', icon: ShieldCheck, roles: ['AUDITOR', 'AVIONICS_ADMIN'] },
  { to: '/admin', label: '系统管理', icon: Settings2, roles: ['AUDITOR', 'AVIONICS_ADMIN'] },
]

const visibleNav = computed(() =>
  nav.filter((item) => {
    if (item.roles.includes('GUEST')) return true
    return auth.isAuthenticated && item.roles.includes(auth.role)
  }),
)

const currentTitle = computed(() => route.meta.title || '门户')

async function onLogout() {
  await auth.logout()
  router.push('/login')
}

onMounted(async () => {
  try {
    const h = await api.health()
    syncOk.value = h.ok && h.db === 'up'
  } catch {
    syncOk.value = false
  }
})
</script>
