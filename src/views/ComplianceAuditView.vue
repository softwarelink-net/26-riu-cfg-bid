<template>
  <div class="space-y-6">
    <section class="hud-panel p-5">
      <p class="hud-label mb-1">Compliance & Audit Timeline</p>
      <h1 class="text-xl font-semibold">资格追踪与审计时间线</h1>
      <p class="text-sm text-slate-400 mt-1">
        覆盖 2025 审计报告、CA 证书流程、失信被执行人核验等招标刚性门槛。
      </p>
    </section>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <section class="xl:col-span-2 hud-panel p-5 space-y-4">
        <h2 class="text-sm font-semibold">Qualification Tracker</h2>
        <div
          v-for="item in checklist"
          :key="item.id"
          class="rounded-md border border-slate-800 bg-slate-950/50 p-4"
        >
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p class="font-medium text-slate-100">{{ item.title }}</p>
              <p class="text-xs text-slate-500 mt-1">{{ item.desc }}</p>
            </div>
            <select
              v-model="item.status"
              class="rounded bg-slate-900 border border-slate-700 text-xs px-2 py-1"
              :disabled="auth.role !== 'AVIONICS_ADMIN' && auth.role !== 'AUDITOR'"
            >
              <option value="PENDING">待核验</option>
              <option value="PASS">已通过</option>
              <option value="FAIL">未通过</option>
              <option value="WAIVED" :disabled="auth.role !== 'AVIONICS_ADMIN'">豁免(Admin)</option>
            </select>
          </div>
          <div class="mt-3 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              class="h-full transition-all"
              :class="barClass(item.status)"
              :style="{ width: barWidth(item.status) }"
            />
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <div class="hud-panel p-5">
          <h3 class="text-sm font-semibold mb-3">审计检查</h3>
          <button class="btn-primary w-full justify-center" @click="runAudit">
            <ShieldCheck class="w-4 h-4" />
            执行合规抽检
          </button>
          <p v-if="auditSummary" class="mt-3 text-sm" :class="auditSummary.ok ? 'text-emerald-300' : 'text-amber-300'">
            {{ auditSummary.message }}
          </p>
          <ul class="mt-4 space-y-2">
            <li
              v-for="b in badges"
              :key="b.label"
              class="flex items-center justify-between text-xs rounded border border-slate-800 px-3 py-2"
            >
              <span>{{ b.label }}</span>
              <span :class="b.ok ? 'text-emerald-300' : 'text-rose-300'">{{ b.ok ? 'CLEAR' : 'RISK' }}</span>
            </li>
          </ul>
        </div>

        <div class="hud-panel p-5">
          <h3 class="text-sm font-semibold mb-3">时间线</h3>
          <ol class="relative border-l border-slate-700 ml-2 space-y-4">
            <li v-for="e in timeline" :key="e.t" class="ml-4">
              <span class="absolute -left-1.5 mt-1 w-3 h-3 rounded-full bg-sky-500 border border-slate-900" />
              <p class="text-[11px] text-slate-500 font-mono">{{ e.t }}</p>
              <p class="text-sm text-slate-200">{{ e.title }}</p>
            </li>
          </ol>
        </div>
      </section>
    </div>

    <section class="hud-panel p-5">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold">审计日志（近 100 条）</h2>
        <button class="btn-ghost !py-1.5 !text-xs" @click="loadLogs">刷新</button>
      </div>
      <div class="overflow-auto max-h-[360px] rounded-md border border-slate-800">
        <table class="min-w-full text-xs">
          <thead class="bg-slate-900 text-slate-400 sticky top-0">
            <tr>
              <th class="px-3 py-2 text-left">Time</th>
              <th class="px-3 py-2 text-left">Action</th>
              <th class="px-3 py-2 text-left">User</th>
              <th class="px-3 py-2 text-left">IP</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id" class="border-t border-slate-800/70">
              <td class="px-3 py-2 font-mono text-slate-400 whitespace-nowrap">{{ log.timestamp }}</td>
              <td class="px-3 py-2 text-sky-300">{{ log.action }}</td>
              <td class="px-3 py-2">{{ log.user_id || '—' }}</td>
              <td class="px-3 py-2 font-mono">{{ log.ip_address }}</td>
            </tr>
            <tr v-if="!logs.length">
              <td colspan="4" class="px-3 py-8 text-center text-slate-500">暂无日志</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ShieldCheck } from 'lucide-vue-next'
import { api } from '@/stores/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const logs = ref([])
const auditSummary = ref(null)

const checklist = reactive([
  { id: 'audit2025', title: '2025 年度审计报告', desc: '需加盖公章的财务审计扫描件', status: 'PENDING' },
  { id: 'ca', title: 'CA 数字证书办理', desc: '龙集采 / 电子签章流程闭环', status: 'PENDING' },
  { id: 'dishonest', title: '非失信被执行人', desc: '法院公开信息核验徽章', status: 'PENDING' },
  { id: 'perf', title: '同类航空软件业绩', desc: 'RIU / ICD 相关交付证明', status: 'PENDING' },
])

const badges = reactive([
  { label: '失信被执行人核验', ok: true },
  { label: 'CA 证书链完整', ok: true },
  { label: '标书费缴纳凭证', ok: false },
])

const timeline = [
  { t: '2026-08-03 10:37', title: '招标公告发布 · 0730-2611010442/01' },
  { t: '2026-08-10', title: '资格预审材料窗口开启' },
  { t: '2026-08-27 09:30', title: '投标截止 / 开标' },
  { t: 'D+30 / D+45 / D+60', title: '详设 → 软硬件 → 调试交付里程碑' },
]

function barClass(status) {
  if (status === 'PASS' || status === 'WAIVED') return 'bg-emerald-400'
  if (status === 'FAIL') return 'bg-rose-400'
  return 'bg-amber-400'
}

function barWidth(status) {
  if (status === 'PASS' || status === 'WAIVED') return '100%'
  if (status === 'FAIL') return '100%'
  return '35%'
}

function runAudit() {
  const fail = checklist.filter((c) => c.status === 'FAIL').length
  const pending = checklist.filter((c) => c.status === 'PENDING').length
  auditSummary.value = {
    ok: fail === 0 && pending === 0,
    message:
      fail > 0
        ? `抽检发现 ${fail} 项未通过，请补正材料。`
        : pending > 0
          ? `仍有 ${pending} 项待核验，建议在截止前闭环。`
          : '全部刚性门槛已通过 / 豁免，可进入技术标评审。',
  }
}

async function loadLogs() {
  const data = await api.getAuditLogs()
  logs.value = data.logs || []
}

onMounted(async () => {
  try {
    await loadLogs()
  } catch (e) {
    console.error(e)
  }
})
</script>
