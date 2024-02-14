<template>
  <div class="flex flex-col flex-1 items-center">
    <div v-if="route.query.preview" class="text-white p-4 bg-weather-secondary w-full text-center">
      You are currently previewing this city, click the "+" icon to start tracking this city
    </div>

    <div class="flex flex-col items-center text-white py-12">
      <h1 class="text-4xl mbl-2">{{ route.params.city }}</h1>
      <p class="text-sm mb-12">
        {{
          new Date(weatherData.currentTime).toLocaleDateString('en-us', {
            weekday: 'short',
            day: '2-digit',
            month: 'long'
          })
        }}
        {{
          new Date(weatherData.currentTime).toLocaleTimeString('en-us', {
            timeStyle: 'short'
          })
        }}
      </p>
      <p class="text-8xl mb-8">{{ Math.round(weatherData.current.temp) }}&deg;</p>
      <p>
        Feels like
        {{ Math.round(weatherData.current.feels_like) }} &deg;
      </p>

      <p class="capitalize">
        {{ weatherData.current.weather[0].description }}
      </p>
      <img
        class="w-[150px] h-auto"
        :src="`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`"
        alt=""
      />
    </div>

    <hr class="border-white border-opacity-10 border w-full" />

    <!-- Hourly Weather -->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">Hourly Weather</h2>
        <div class="flex gap-10 overflow-x-scroll">
          <div
            v-for="hourData in weatherData.hourly"
            :key="hourData.dt"
            class="flex flex-col gap-4 items-center"
          >
            <p class="whitespace-nowrap text-md">
              {{
                new Date(hourData.currentTime).toLocaleTimeString('en-us', {
                  hour: 'numeric'
                })
              }}
            </p>
            <img
              class="w-auto h-[50px] object-cover"
              :src="`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`"
              alt=""
            />
            <p class="text-xl">{{ Math.round(hourData.temp) }}&deg;</p>
          </div>
        </div>
      </div>
    </div>

    <hr class="border-white border-opacity-10 border w-full" />

    <!-- Weekly Weather -->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">7 Day Forecast</h2>
        <div v-for="day in weatherData.daily" :key="day.dt" class="flex items-center">
          <p class="flex-1">
            {{
              new Date(day.dt * 1000).toLocaleDateString('en-us', {
                weekday: 'long'
              })
            }}
          </p>
          <img
            class="w-[50px] h-[50px] object-cover"
            :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
            alt=""
          />
          <div class="flex gap-2 flex-1 justify-end">
            <p>H: {{ Math.round(day.temp.max) }} &deg;</p>
            <p>L: {{ Math.round(day.temp.min) }} &deg;</p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-500"
      @click="removeCity"
    >
      <i class="fa-solid fa-trash"></i>
      <p>Remove City from my list</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocationWeatherStore } from '@/stores/locationWeatherStore'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()

const locationWeatherStore = useLocationWeatherStore()

const getWeatherData = async () => {
  try {
    const lat = Array.isArray(route.query) ? route.query[0] : route.query.lat
    const lng = Array.isArray(route.query) ? route.query[1] : route.query.lng

    if (lat !== null && lng !== null) {
      const data = await locationWeatherStore.fetchWeatherInfo(lat, lng)

      // cal current date & time
      const localOffset = new Date().getTimezoneOffset() * 60000
      const utc = data.current.dt * 1000 + localOffset
      data.currentTime = utc + 1000 * data.timezone_offset

      // cal hourly weather offset
      data.hourly.forEach((hour: any) => {
        const utc = hour.dt * 1000 + localOffset
        hour.currentTime = utc + 1000 * data.timezone_offset
      })

      // Flicker Delay
      await new Promise((res) => setTimeout(res, 1000))
      return data
    } else {
      console.error('Latitude or longitude is null')
      return null // or throw an error, depending on your use case
    }
  } catch (err) {
    console.log(err)
  }
}

const weatherData = await getWeatherData()

const router = useRouter()
const removeCity = () => {
  const cityId = Array.isArray(route.query) ? route.query[2] : route.query.id
  locationWeatherStore.removeCity(cityId)
  router.push({
    name: 'home'
  })
}
</script>

<style scoped>
::-webkit-scrollbar {
  height: 8px;
  width: 100%;
  cursor: pointer;
}

::-webkit-scrollbar-track {
  background: #004e71;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: rgb(202, 200, 200);
  border-radius: 5px;
}
</style>
