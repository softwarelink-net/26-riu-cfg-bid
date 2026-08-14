<template>
  <div class="space-y-6">
    <section class="hud-panel p-5">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p class="hud-label mb-1">RIU Interface Simulator</p>
          <h1 class="text-xl font-semibold">ICD Channel Designer & C/H Generator</h1>
          <p class="text-sm text-slate-400 mt-1">
            可视化配置 ARINC 429 / 1553B / Analog / Discrete 通道，模拟 Flash 二进制与静态解析代码生成。
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <select
            v-model="selectedTemplate"
            class="rounded-md bg-slate-950 border border-slate-700 text-sm px-3 py-2"
            @change="applyTemplate"
          >
            <option disabled value="">加载 ICD 模板…</option>
            <option v-for="t in templates" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
          <button class="btn-primary" :disabled="generating || !canGenerate" @click="generate(false)">
            <Cpu class="w-4 h-4" />
            {{ generating ? '编译中…' : '校验并生成' }}
          </button>
          <button
            v-if="auth.role === 'AVIONICS_ADMIN'"
            class="btn-ghost"
            :disabled="generating"
            @click="generate(true)"
          >
            <Save class="w-4 h-4" />
            持久化到 D1/R2
          </button>
        </div>
      </div>
      <p v-if="!canGenerate" class="mt-3 text-xs text-amber-300">
        访客仅可预览模板与通道设计；请登录 AUDITOR / AVIONICS_ADMIN 后执行生成。
      </p>
      <p v-if="error" class="mt-2 text-sm text-rose-400">{{ error }}</p>
    </section>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <RiuChannelDesigner
        v-model:config-name="form.config_name"
        v-model:version="form.version"
        v-model:bus-type="form.target_bus_type"
        v-model:flash-address="form.flash_address_hex"
        v-model:channels="form.channels"
        :readonly="false"
      />

      <div class="space-y-6">
        <RiuCodePreview
          :h-code="result?.generated_h_code || previewH"
          :c-code="result?.generated_c_code || previewC"
        />
        <RiuHexVisualizer
          :hex-dump="result?.hex_dump || ''"
          :crc32="result?.crc32_checksum || ''"
          :sha256="result?.sha256_checksum || ''"
          :size="result?.binary_size_bytes || 0"
          :flash-address="form.flash_address_hex"
          :misra-notes="result?.misra_notes || []"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Cpu, Save } from 'lucide-vue-next'
import { api } from '@/stores/api'
import { useAuthStore } from '@/stores/auth'
import RiuChannelDesigner from '@/components/riu/RiuChannelDesigner.vue'
import RiuCodePreview from '@/components/riu/RiuCodePreview.vue'
import RiuHexVisualizer from '@/components/riu/RiuHexVisualizer.vue'

const auth = useAuthStore()
const templates = ref([])
const selectedTemplate = ref('')
const generating = ref(false)
const error = ref('')
const result = ref(null)

const form = reactive({
  config_name: 'riu_config',
  version: '1.0.0',
  target_bus_type: 'ARINC429',
  flash_address_hex: '0x08010000',
  channels: [
    { label: 'ALT_BARO', baudRate: 100000, parity: 'ODD', frameLength: 4, cycleMs: 50 },
    { label: 'AIRSPEED', baudRate: 100000, parity: 'ODD', frameLength: 4, cycleMs: 50 },
  ],
})

const canGenerate = computed(() => auth.isAuthenticated && ['AUDITOR', 'AVIONICS_ADMIN'].includes(auth.role))

const previewH = computed(
  () =>
    `/* Preview — login to generate full MISRA-C headers */\n#ifndef RIU_CONFIG_H\n#define RIU_CONFIG_H\n#define RIU_CHANNEL_COUNT (${form.channels.length}U)\n#endif`,
)
const previewC = computed(
  () =>
    `/* Preview — static channel table sketch */\n#include "riu_config.h"\n/* ${form.channels.length} channels · bus ${form.target_bus_type} */`,
)

function applyTemplate() {
  const t = templates.value.find((x) => x.id === selectedTemplate.value)
  if (!t) return
  form.config_name = t.id.replace(/^tpl_/, 'riu_')
  form.target_bus_type = t.target_bus_type
  form.flash_address_hex = t.flash_address_hex
  form.channels = t.channels.map((c) => ({ ...c }))
  result.value = null
}

async function generate(persist) {
  if (!canGenerate.value) return
  generating.value = true
  error.value = ''
  try {
    const data = await api.generateRiu({ ...form, persist })
    result.value = data.result
    if (data.result?.binary_base64) {
      sessionStorage.setItem(
        'riu_last_artifact',
        JSON.stringify({
          binary_base64: data.result.binary_base64,
          crc32: data.result.crc32_checksum,
          sha256: data.result.sha256_checksum,
          size: data.result.binary_size_bytes,
          name: data.result.config_name,
        }),
      )
    }
  } catch (e) {
    error.value = e.message || '生成失败'
  } finally {
    generating.value = false
  }
}

onMounted(async () => {
  try {
    const data = await api.getTemplates()
    templates.value = data.templates || []
  } catch (e) {
    error.value = e.message
  }
})
</script>
