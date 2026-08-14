<template>
  <div class="app-shell">
    <GlobalTopBanner />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import GlobalTopBanner from '@/components/common/GlobalTopBanner.vue'
</script>
