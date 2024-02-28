<template>
  <div v-for="city in savedCities" :key="city.id">
    <CityCard :city="city" @click="goToCityView(city)" />
  </div>
  <div v-if="savedCities">
    <p v-if="savedCities.length === 0">
      No locations added. To start tracking a location, search in the field above
    </p>
  </div>
</template>

<script setup lang="ts">
import CityCard from '@/components/CityCard.vue'
import { useLocationWeatherStore } from '@/stores/locationWeatherStore'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface SavedCities {
  id: string
  state: string
  city: string
  coords: {
    lat: string
    lng: string
  }
  weather?: {}
}

const savedCities = ref<SavedCities[] | null>(null)
const locationWeatherStore = useLocationWeatherStore()
const router = useRouter()

const getCities = async () => {
  let response = await locationWeatherStore.fetchSavedCurrentWeatherCities()
  if (isSavedCities(response)) {
    savedCities.value = response
  } else {
    alert('error, please try again later')
  }
}

const isSavedCities = (response: any): response is SavedCities[] => {
  // Check if response conforms to SavedCities interface
  // You can customize this check based on your requirements
  return (
    Array.isArray(response) &&
    response.every(
      (location) =>
        typeof location.id === 'string' &&
        typeof location.state === 'string' &&
        typeof location.city === 'string' &&
        location.coords &&
        typeof location.coords.lat === 'string' &&
        typeof location.coords.lng === 'string'
    )
  )
}

onMounted(async () => {
  await getCities()
})

const goToCityView = (city: SavedCities) => {
  router.push({
    name: 'cityView',
    params: { state: city.state, city: city.city },
    query: { id: city.id, lat: city.coords.lat, lng: city.coords.lng }
  })
}
</script>
