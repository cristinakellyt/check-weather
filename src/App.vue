<template>
  <div class="flex flex-col min-h-screen font-Roboto bg-weather-primary">
    <SiteNavigation />
    <RouterView />
  </div>
</template>

<script lang="ts" setup>
import SiteNavigation from '@/components/SiteNavigation.vue'
</script>
