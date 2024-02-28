<template>
  <div>
    <Suspense>
      <CityWeather />
      <template #fallback>
        <LoadingCityView />
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import LoadingCityView from '@/components/async-animation/LoadingCityView.vue'
import CityWeather from '@/components/CityWeather.vue'
</script>
