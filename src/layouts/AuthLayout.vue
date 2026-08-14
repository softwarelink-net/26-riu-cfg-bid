<template>
  <div class="min-h-[calc(100vh-40px)] flex items-center justify-center px-4 py-10">
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[320px] bg-sky-500/10 blur-3xl rounded-full" />
      <div class="absolute bottom-0 right-0 w-[420px] h-[240px] bg-cyan-400/5 blur-3xl" />
    </div>
    <div class="relative w-full max-w-md">
      <div class="mb-6 text-center">
        <p class="hud-label mb-2">Avionics Secure Gate</p>
        <h1 class="text-2xl font-semibold text-slate-50 tracking-tight">身份认证 / CA 模拟登录</h1>
        <p class="mt-2 text-sm text-slate-400">RIU 配置工具招标数字化门户 · 角色授权入口</p>
      </div>
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>
