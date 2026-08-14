<template>
  <section class="hud-panel p-5 space-y-3">
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-base font-semibold">代码预览 · riu_config.h / riu_parser.c</h2>
      <div class="flex gap-1 rounded-md border border-slate-700 p-0.5 bg-slate-950">
        <button
          type="button"
          class="px-2.5 py-1 text-xs rounded"
          :class="tab === 'h' ? 'bg-sky-600 text-white' : 'text-slate-400'"
          @click="tab = 'h'"
        >
          .h
        </button>
        <button
          type="button"
          class="px-2.5 py-1 text-xs rounded"
          :class="tab === 'c' ? 'bg-sky-600 text-white' : 'text-slate-400'"
          @click="tab = 'c'"
        >
          .c
        </button>
      </div>
    </div>
    <pre class="code-block max-h-[360px]">{{ tab === 'h' ? hCode : cCode }}</pre>
  </section>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  hCode: { type: String, default: '' },
  cCode: { type: String, default: '' },
})

const tab = ref('h')
</script>
