<template>
  <section class="hud-panel p-5 space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold">通道映射设计器</h2>
      <button class="btn-ghost !py-1.5 !text-xs" type="button" @click="addChannel">
        <Plus class="w-3.5 h-3.5" />
        添加通道
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <label class="block text-xs">
        <span class="text-slate-400">配置名</span>
        <input
          :value="configName"
          class="mt-1 w-full rounded-md bg-slate-950 border border-slate-700 px-2.5 py-2 text-sm"
          @input="$emit('update:configName', $event.target.value)"
        />
      </label>
      <label class="block text-xs">
        <span class="text-slate-400">版本</span>
        <input
          :value="version"
          class="mt-1 w-full rounded-md bg-slate-950 border border-slate-700 px-2.5 py-2 text-sm"
          @input="$emit('update:version', $event.target.value)"
        />
      </label>
      <label class="block text-xs">
        <span class="text-slate-400">总线类型</span>
        <select
          :value="busType"
          class="mt-1 w-full rounded-md bg-slate-950 border border-slate-700 px-2.5 py-2 text-sm"
          @change="$emit('update:busType', $event.target.value)"
        >
          <option value="ARINC429">ARINC 429</option>
          <option value="MIL_STD_1553B">MIL-STD-1553B</option>
          <option value="AFDX">AFDX</option>
          <option value="HYBRID">HYBRID</option>
        </select>
      </label>
      <label class="block text-xs">
        <span class="text-slate-400">Flash 基址</span>
        <input
          :value="flashAddress"
          class="mt-1 w-full rounded-md bg-slate-950 border border-slate-700 px-2.5 py-2 text-sm font-mono"
          @input="$emit('update:flashAddress', $event.target.value)"
        />
      </label>
    </div>

    <div class="overflow-auto rounded-md border border-slate-800">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-900/80 text-xs text-slate-400">
          <tr>
            <th class="px-3 py-2 text-left">#</th>
            <th class="px-3 py-2 text-left">Label</th>
            <th class="px-3 py-2 text-left">Baud</th>
            <th class="px-3 py-2 text-left">Parity</th>
            <th class="px-3 py-2 text-left">Frame</th>
            <th class="px-3 py-2 text-left">Cycle(ms)</th>
            <th class="px-3 py-2 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(ch, idx) in channels"
            :key="idx"
            class="border-t border-slate-800/80 hover:bg-slate-900/40"
          >
            <td class="px-3 py-2 font-mono text-sky-300">{{ idx }}</td>
            <td class="px-2 py-1.5">
              <input
                :value="ch.label"
                class="w-28 rounded bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
                @input="updateChannel(idx, 'label', $event.target.value)"
              />
            </td>
            <td class="px-2 py-1.5">
              <input
                :value="ch.baudRate"
                type="number"
                class="w-24 rounded bg-slate-950 border border-slate-700 px-2 py-1 text-xs font-mono"
                @input="updateChannel(idx, 'baudRate', Number($event.target.value))"
              />
            </td>
            <td class="px-2 py-1.5">
              <select
                :value="ch.parity"
                class="rounded bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
                @change="updateChannel(idx, 'parity', $event.target.value)"
              >
                <option value="NONE">NONE</option>
                <option value="ODD">ODD</option>
                <option value="EVEN">EVEN</option>
              </select>
            </td>
            <td class="px-2 py-1.5">
              <input
                :value="ch.frameLength"
                type="number"
                class="w-16 rounded bg-slate-950 border border-slate-700 px-2 py-1 text-xs font-mono"
                @input="updateChannel(idx, 'frameLength', Number($event.target.value))"
              />
            </td>
            <td class="px-2 py-1.5">
              <input
                :value="ch.cycleMs"
                type="number"
                class="w-16 rounded bg-slate-950 border border-slate-700 px-2 py-1 text-xs font-mono"
                @input="updateChannel(idx, 'cycleMs', Number($event.target.value))"
              />
            </td>
            <td class="px-3 py-1.5 text-right">
              <button
                type="button"
                class="text-rose-400 hover:text-rose-300 text-xs"
                :disabled="channels.length <= 1"
                @click="removeChannel(idx)"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { Plus } from 'lucide-vue-next'

const props = defineProps({
  configName: String,
  version: String,
  busType: String,
  flashAddress: String,
  channels: { type: Array, required: true },
})

const emit = defineEmits(['update:configName', 'update:version', 'update:busType', 'update:flashAddress', 'update:channels'])

function addChannel() {
  emit('update:channels', [
    ...props.channels,
    {
      label: `CH_${props.channels.length}`,
      baudRate: 100000,
      parity: 'ODD',
      frameLength: 4,
      cycleMs: 50,
    },
  ])
}

function removeChannel(idx) {
  if (props.channels.length <= 1) return
  emit(
    'update:channels',
    props.channels.filter((_, i) => i !== idx),
  )
}

function updateChannel(idx, key, value) {
  emit(
    'update:channels',
    props.channels.map((ch, i) => (i === idx ? { ...ch, [key]: value } : ch)),
  )
}
</script>
