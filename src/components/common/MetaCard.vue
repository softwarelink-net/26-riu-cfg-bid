<template>
  <div class="rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2.5">
    <p class="hud-label mb-1">{{ label }}</p>
    <p class="text-sm text-slate-100 break-words">{{ value || '—' }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: '' },
})
</script>
