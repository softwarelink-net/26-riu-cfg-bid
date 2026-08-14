<template>
  <section class="hud-panel p-5 space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-base font-semibold">Flash Hex 可视化</h2>
      <div class="flex flex-wrap gap-2 text-[11px] font-mono">
        <span class="px-2 py-1 rounded border border-slate-700 bg-slate-950">ADDR {{ flashAddress }}</span>
        <span class="px-2 py-1 rounded border border-slate-700 bg-slate-950">SIZE {{ size }} B</span>
        <span class="px-2 py-1 rounded border border-emerald-500/30 text-emerald-300 bg-emerald-500/10">
          CRC32 {{ crc32 || '—' }}
        </span>
      </div>
    </div>

    <pre v-if="hexDump" class="hex-block max-h-[280px]">{{ hexDump }}</pre>
    <div v-else class="rounded-md border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
      执行生成后显示 Flash 偏移、字节流与 CRC 尾校验。
    </div>

    <div v-if="sha256" class="text-[11px] font-mono text-slate-400 break-all">
      SHA256 {{ sha256 }}
    </div>

    <ul v-if="misraNotes.length" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <li
        v-for="n in misraNotes"
        :key="n"
        class="text-xs text-slate-300 rounded border border-slate-800 bg-slate-950/50 px-2.5 py-2"
      >
        ✓ {{ n }}
      </li>
    </ul>
  </section>
</template>

<script setup>
defineProps({
  hexDump: { type: String, default: '' },
  crc32: { type: String, default: '' },
  sha256: { type: String, default: '' },
  size: { type: Number, default: 0 },
  flashAddress: { type: String, default: '0x08010000' },
  misraNotes: { type: Array, default: () => [] },
})
</script>
