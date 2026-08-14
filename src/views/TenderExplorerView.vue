<template>
  <div class="space-y-6">
    <section class="hud-panel p-5 md:p-6">
      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div class="min-w-0">
          <p class="hud-label mb-2">Tender Explorer</p>
          <h1 class="text-xl md:text-2xl font-semibold text-slate-50 leading-snug">
            {{ tender?.title || '开放式架构的远程接口单元接口配置工具招标公告' }}
          </h1>
          <p class="mt-2 text-sm text-slate-400 max-w-3xl">
            {{ tender?.summary }}
          </p>
        </div>
        <div class="shrink-0 rounded-lg border border-sky-500/30 bg-sky-500/10 px-4 py-3 min-w-[220px]">
          <p class="hud-label mb-1">投标截止倒计时</p>
          <p v-if="countdown?.isExpired" class="text-lg font-semibold text-rose-300">已截止</p>
          <p v-else class="font-mono text-lg text-sky-200">
            {{ String(countdown?.remainDays ?? 0).padStart(2, '0') }}d
            {{ String(countdown?.remainHours ?? 0).padStart(2, '0') }}h
            {{ String(countdown?.remainMinutes ?? 0).padStart(2, '0') }}m
            {{ String(countdown?.remainSeconds ?? 0).padStart(2, '0') }}s
          </p>
          <p class="mt-1 text-xs text-slate-400">Deadline: {{ tender?.deadline }}</p>
        </div>
      </div>

      <div class="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <MetaCard label="项目编号" :value="tender?.project_no" />
        <MetaCard label="发包方" :value="tender?.buyer_name" />
        <MetaCard label="招标代理" :value="tender?.agency_name" />
        <MetaCard label="标书费用" :value="tender ? `¥${tender.doc_fee}` : '-'" />
      </div>
    </section>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <section class="xl:col-span-2 hud-panel p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold">公告全文与技术要点</h2>
          <span
            class="text-[11px] px-2 py-0.5 rounded border"
            :class="statusClass"
          >{{ tender?.status || 'OPEN' }}</span>
        </div>
        <div class="prose prose-invert prose-sm max-w-none text-slate-300 space-y-3">
          <p>
            中国航空工业集团公司西安航空计算技术研究所就“开放式架构的远程接口单元接口配置工具”进行公开招标。
            项目采购数量为壹套，要求 PC 端配置工具基于接口控制文件和数据配置文件，自动生成驻留 Flash 的二进制配置文件
            及供机载联合编译的独立 C/H 解析函数。
          </p>
          <ol class="list-decimal pl-5 space-y-1 text-slate-300">
            <li>运行于 PC 端，解析 ICD 与数据配置文件；</li>
            <li>生成紧凑型二进制配置流并驻留 Flash/非易失介质；</li>
            <li>独立生成标准 C 语言（.c 及 .h）解析驱动代码并与应用软件无缝联合编译；</li>
            <li>交付周期严格：30 天详设，45 天软硬件，60 天调试与最终交付。</li>
          </ol>
          <p class="text-slate-400">
            技术创新性：突破传统硬编码接口驱动模式，采用开放式架构元数据驱动模型，实现航空机载航电 I/O 接口配置的解耦、
            高可靠离线代码静态生成与全生命周期版本可追溯性。
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div
            v-for="m in milestones"
            :key="m.day"
            class="rounded-md border border-slate-800 bg-slate-950/50 p-3"
          >
            <p class="text-sky-300 font-mono text-sm">D+{{ m.day }}</p>
            <p class="text-sm font-medium mt-1">{{ m.title }}</p>
            <p class="text-xs text-slate-500 mt-1">{{ m.desc }}</p>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <div class="hud-panel p-5">
          <h3 class="text-sm font-semibold mb-3">资格审查清单</h3>
          <ul class="space-y-2">
            <li
              v-for="q in qualifications"
              :key="q.id"
              class="rounded-md border border-slate-800 bg-slate-950/40 p-3"
            >
              <div class="flex items-start justify-between gap-2">
                <p class="text-sm text-slate-200">{{ q.label }}</p>
                <span
                  class="text-[10px] px-1.5 py-0.5 rounded border shrink-0"
                  :class="q.required ? 'border-amber-500/40 text-amber-300' : 'border-slate-600 text-slate-400'"
                >
                  {{ q.required ? '必填' : '选填' }}
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-1">{{ q.note }}</p>
            </li>
          </ul>
        </div>

        <div class="hud-panel p-5">
          <h3 class="text-sm font-semibold mb-3">联系热线</h3>
          <div class="space-y-3">
            <div v-for="c in contacts" :key="c.phone" class="text-sm">
              <p class="text-slate-400 text-xs">{{ c.role }}</p>
              <p class="font-medium">{{ c.name }}</p>
              <a :href="`tel:${c.phone}`" class="text-sky-400 hover:underline text-xs">{{ c.phone }}</a>
              <p class="text-xs text-slate-500">{{ c.email }}</p>
            </div>
          </div>
          <button class="btn-primary mt-4 w-full justify-center" @click="dispatchHotline">
            <Phone class="w-4 h-4" />
            一键热线派发（模拟）
          </button>
          <p v-if="dispatchMsg" class="mt-2 text-xs text-emerald-400">{{ dispatchMsg }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Phone } from 'lucide-vue-next'
import { api } from '@/stores/api'
import MetaCard from '@/components/common/MetaCard.vue'

const tender = ref(null)
const countdown = ref(null)
const qualifications = ref([])
const contacts = ref([])
const milestones = ref([])
const dispatchMsg = ref('')
let timer = null

const statusClass = computed(() => {
  const s = tender.value?.status
  if (s === 'OPEN') return 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
  if (s === 'IN_REVIEW') return 'border-amber-500/40 text-amber-300 bg-amber-500/10'
  return 'border-slate-600 text-slate-400'
})

function tickLocal() {
  if (!countdown.value || countdown.value.isExpired) return
  let ms = Math.max(0, countdown.value.remainMs - 1000)
  countdown.value = {
    ...countdown.value,
    remainMs: ms,
    remainDays: Math.floor(ms / 86400000),
    remainHours: Math.floor((ms % 86400000) / 3600000),
    remainMinutes: Math.floor((ms % 3600000) / 60000),
    remainSeconds: Math.floor((ms % 60000) / 1000),
    isExpired: ms <= 0,
  }
}

async function load() {
  const data = await api.getTender()
  tender.value = data.tender
  countdown.value = data.countdown
  qualifications.value = data.qualifications || []
  contacts.value = data.contacts || []
  milestones.value = data.milestones || []
}

function dispatchHotline() {
  const primary = contacts.value[0]
  dispatchMsg.value = primary
    ? `已模拟派发至 ${primary.name}（${primary.phone}），工单号 HOT-${Date.now().toString(36).toUpperCase()}`
    : '暂无联系人'
}

onMounted(async () => {
  try {
    await load()
    timer = setInterval(tickLocal, 1000)
  } catch (e) {
    console.error(e)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
