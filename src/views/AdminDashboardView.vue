<template>
  <div class="space-y-6">
    <section class="hud-panel p-5">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p class="hud-label mb-1">Admin Dashboard</p>
          <h1 class="text-xl font-semibold">系统健康 · Feature Flags · 访问审计</h1>
        </div>
        <div class="flex items-center gap-2 text-xs font-mono px-3 py-2 rounded-md border border-slate-700 bg-slate-950">
          <span :class="health?.db === 'up' ? 'text-emerald-300' : 'text-rose-300'">
            DB {{ health?.db || 'unknown' }}
          </span>
          <span class="text-slate-600">|</span>
          <span class="text-slate-300">{{ health?.service || '26-riu-cfg-bid' }}</span>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <MetaCard label="部署域名" :value="host" />
      <MetaCard label="角色" :value="auth.role" />
      <MetaCard label="健康探针时间" :value="health?.ts || '—'" />
    </div>

    <section class="hud-panel p-5 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold">系统配置与特性开关</h2>
        <button class="btn-ghost !py-1.5 !text-xs" @click="load">刷新</button>
      </div>
      <div class="space-y-2">
        <div
          v-for="cfg in configs"
          :key="cfg.config_key"
          class="flex flex-col sm:flex-row sm:items-center gap-3 rounded-md border border-slate-800 bg-slate-950/50 px-3 py-3"
        >
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium font-mono text-sky-300">{{ cfg.config_key }}</p>
            <p class="text-xs text-slate-500">{{ cfg.description }}</p>
          </div>
          <div class="flex items-center gap-2">
            <template v-if="cfg.is_feature_flag">
              <button
                type="button"
                class="relative w-11 h-6 rounded-full transition"
                :class="cfg.config_value === 'true' ? 'bg-sky-600' : 'bg-slate-700'"
                :disabled="auth.role !== 'AVIONICS_ADMIN'"
                @click="toggleFlag(cfg)"
              >
                <span
                  class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition"
                  :class="cfg.config_value === 'true' ? 'translate-x-5' : ''"
                />
              </button>
            </template>
            <template v-else>
              <input
                v-model="cfg.config_value"
                class="w-56 max-w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs font-mono"
                :disabled="auth.role !== 'AVIONICS_ADMIN'"
                @change="saveConfig(cfg)"
              />
            </template>
          </div>
        </div>
      </div>
      <p v-if="auth.role === 'AUDITOR'" class="text-xs text-amber-300">审计员只读；写入需 AVIONICS_ADMIN。</p>
      <p v-if="msg" class="text-xs text-emerald-300">{{ msg }}</p>
    </section>

    <section class="hud-panel p-5 space-y-3">
      <h2 class="text-sm font-semibold">已持久化 RIU 配置</h2>
      <div class="overflow-auto rounded-md border border-slate-800 max-h-[280px]">
        <table class="min-w-full text-xs">
          <thead class="bg-slate-900 text-slate-400">
            <tr>
              <th class="px-3 py-2 text-left">Name</th>
              <th class="px-3 py-2 text-left">Bus</th>
              <th class="px-3 py-2 text-left">CRC32</th>
              <th class="px-3 py-2 text-left">Size</th>
              <th class="px-3 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in riuConfigs" :key="c.id" class="border-t border-slate-800/70">
              <td class="px-3 py-2">{{ c.config_name }} <span class="text-slate-500">v{{ c.version }}</span></td>
              <td class="px-3 py-2 font-mono text-sky-300">{{ c.target_bus_type }}</td>
              <td class="px-3 py-2 font-mono">{{ c.crc32_checksum }}</td>
              <td class="px-3 py-2">{{ c.binary_size_bytes }} B</td>
              <td class="px-3 py-2 text-slate-500">{{ c.created_at }}</td>
            </tr>
            <tr v-if="!riuConfigs.length">
              <td colspan="5" class="px-3 py-6 text-center text-slate-500">暂无持久化配置</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from '@/stores/api'
import { useAuthStore } from '@/stores/auth'
import MetaCard from '@/components/common/MetaCard.vue'

const auth = useAuthStore()
const health = ref(null)
const configs = ref([])
const riuConfigs = ref([])
const msg = ref('')

const host = computed(
  () => configs.value.find((c) => c.config_key === 'DEPLOYMENT_HOST')?.config_value || 'https://26-riu-cfg-bid.softwarelink.net/',
)

async function load() {
  const [h, c, r] = await Promise.all([
    api.health(),
    api.getSystemConfigs(),
    api.getConfigs().catch(() => ({ configs: [] })),
  ])
  health.value = h
  configs.value = c.configs || []
  riuConfigs.value = r.configs || []
}

async function toggleFlag(cfg) {
  if (auth.role !== 'AVIONICS_ADMIN') return
  cfg.config_value = cfg.config_value === 'true' ? 'false' : 'true'
  await saveConfig(cfg)
}

async function saveConfig(cfg) {
  if (auth.role !== 'AVIONICS_ADMIN') return
  await api.updateSystemConfig(cfg.config_key, cfg.config_value)
  msg.value = `已更新 ${cfg.config_key}`
}

onMounted(async () => {
  try {
    await load()
  } catch (e) {
    msg.value = e.message
  }
})
</script>
