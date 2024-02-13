<template>
  <div class="flex flex-col min-h-screen font-Roboto bg-weather-primary">
    <TheHeader />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import TheHeader from '@/components/layout/TheHeader.vue'
</script>
