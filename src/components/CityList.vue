<template>
  <div v-for="city in savedCities" :key="city.id">
    <CityCard :city="city" @click="goToCityView(city)" />
  </div>

  <p v-if="savedCities.length === 0">
    No locations added. To start tracking a location, search in the field above
  </p>
</template>

<script setup>
import CityCard from '@/components/CityCard.vue'
import { useLocationWeatherStore } from '@/stores/locationWeatherStore.ts'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const savedCities = ref([])

const locationWeatherStore = useLocationWeatherStore()

const getCities = async () => {
  savedCities.value = await locationWeatherStore.fetchSavedCurrentWeatherCities()
}

onMounted(async () => {
  await getCities()
})

const router = useRouter()
const goToCityView = (city) => {
  router.push({
    name: 'cityView',
    params: { state: city.state, city: city.city },
    query: { id: city.id, lat: city.coords.lat, lng: city.coords.lng }
  })
}
</script>
