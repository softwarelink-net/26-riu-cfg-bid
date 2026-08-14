<template>
  <div class="space-y-6">
    <section class="hud-panel p-5">
      <p class="hud-label mb-1">Artifact Downloader & Verifier</p>
      <h1 class="text-xl font-semibold">配置二进制校验引擎</h1>
      <p class="text-sm text-slate-400 mt-1">
        对生成产物执行 CRC32 / SHA256 校验；支持粘贴 Base64 或加载最近一次 RIU 仿真结果。
      </p>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section class="hud-panel p-5 space-y-4">
        <h2 class="text-sm font-semibold">输入载荷</h2>
        <textarea
          v-model="binaryBase64"
          rows="8"
          class="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-xs font-mono"
          placeholder="Base64 编码的二进制配置流…"
        />
        <label class="block text-xs text-slate-400">
          期望 CRC32（可选）
          <input
            v-model="expectedCrc"
            class="mt-1 w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm font-mono"
            placeholder="例如 A1B2C3D4"
          />
        </label>
        <div class="flex flex-wrap gap-2">
          <button class="btn-ghost" type="button" @click="loadLast">加载最近生成物</button>
          <button class="btn-primary" type="button" :disabled="verifying || !binaryBase64" @click="verify">
            <ShieldCheck class="w-4 h-4" />
            {{ verifying ? '校验中…' : '执行校验' }}
          </button>
        </div>
        <p v-if="error" class="text-sm text-rose-400">{{ error }}</p>
      </section>

      <section class="hud-panel p-5 space-y-4">
        <h2 class="text-sm font-semibold">校验结果</h2>
        <div v-if="report" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <MetaCard label="Size" :value="`${report.size} bytes`" />
            <MetaCard label="CRC Match" :value="report.match ? 'PASS' : 'FAIL'" />
          </div>
          <div class="rounded-md border border-slate-800 bg-slate-950/60 p-3 text-xs font-mono space-y-2">
            <p><span class="text-slate-500">CRC32</span> {{ report.crc32 }}</p>
            <p class="break-all"><span class="text-slate-500">SHA256</span> {{ report.sha256 }}</p>
          </div>
          <div
            class="rounded-md px-3 py-2 text-sm border"
            :class="report.match ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'"
          >
            {{ report.match ? '完整性校验通过 — 可导出 Flash 镜像。' : 'CRC 不匹配 — 请重新生成或检查传输链路。' }}
          </div>
          <a
            v-if="downloadUrl"
            :href="downloadUrl"
            download="riu_flash_payload.bin"
            class="btn-ghost inline-flex"
          >
            <Download class="w-4 h-4" />
            下载 .bin
          </a>
        </div>
        <p v-else class="text-sm text-slate-500">尚未执行校验。</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onUnmounted, ref } from 'vue'
import { Download, ShieldCheck } from 'lucide-vue-next'
import { api } from '@/stores/api'
import MetaCard from '@/components/common/MetaCard.vue'

const binaryBase64 = ref('')
const expectedCrc = ref('')
const verifying = ref(false)
const error = ref('')
const report = ref(null)
const downloadUrl = ref('')

function loadLast() {
  const raw = sessionStorage.getItem('riu_last_artifact')
  if (!raw) {
    error.value = '未找到最近生成物，请先在 RIU 仿真器中生成。'
    return
  }
  try {
    const art = JSON.parse(raw)
    binaryBase64.value = art.binary_base64 || ''
    expectedCrc.value = art.crc32 || ''
    error.value = ''
  } catch {
    error.value = '最近生成物解析失败'
  }
}

function makeDownload(b64) {
  if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value)
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
  const blob = new Blob([bytes], { type: 'application/octet-stream' })
  downloadUrl.value = URL.createObjectURL(blob)
}

async function verify() {
  verifying.value = true
  error.value = ''
  try {
    const data = await api.verifyRiu({
      binary_base64: binaryBase64.value.trim(),
      expected_crc32: expectedCrc.value.trim() || undefined,
    })
    report.value = data
    makeDownload(binaryBase64.value.trim())
  } catch (e) {
    error.value = e.message || '校验失败'
  } finally {
    verifying.value = false
  }
}

onUnmounted(() => {
  if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value)
})
</script>
