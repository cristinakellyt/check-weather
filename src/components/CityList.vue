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
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ref } from 'vue'

const savedCities = ref([])
const getCities = async () => {
  if (localStorage.getItem('savedCities')) {
    savedCities.value = JSON.parse(localStorage.getItem('savedCities'))

    const request = []

    savedCities.value.forEach((city) => {
      request.push(
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=c80de8e20aa4237d0549ff80765920ea&units=metric`
        )
      )
    })

    const weatherData = await axios.all(request)

    weatherData.forEach((value, index) => {
      savedCities.value[index].weather = value.data
    })
  }
}

await getCities()

const router = useRouter()
const goToCityView = (city) => {
  router.push({
    name: 'cityView',
    params: { state: city.state, city: city.city },
    query: { lat: city.coords.lat, lng: city.coords.lng }
  })
}
</script>
