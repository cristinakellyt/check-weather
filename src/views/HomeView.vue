<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input
        type="text"
        @input="getSearchResults"
        v-model="searchQuery"
        placeholder="Search for a city or state"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]"
      />
      <ul
        v-if="mapboxSearchResults"
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
      >
        <p v-if="searchError">Sorry, something went wrong, please try again.</p>

        <p v-if="!searchError && mapboxSearchResults.length === 0">
          No results match your search, try a different term.
        </p>

        <template v-else>
          <li
            v-for="result in mapboxSearchResults"
            :key="result.id"
            @click="openCityWeather(result)"
            class="py-2 cursor-pointer"
          >
            {{ result.place_name }}
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          <LoadingCityCard />
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup lang="ts">
import CityList from '@/components/CityList.vue'
import LoadingCityCard from '@/components/async-animation/LoadingCityCard.vue'
import { useSearchLocationStore } from '@/stores/searchLocationStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface LocationData {
  id: string
  place_name: string
  coordinates: number[]
}

type MapboxSearchResults = LocationData[] | null

const mapboxSearchResults = ref<MapboxSearchResults>(null)
const searchQuery = ref('')
const queryTimeout = ref()
const searchError = ref(false)

const searchLocationStore = useSearchLocationStore()

const getSearchResults = () => {
  clearTimeout(queryTimeout.value)

  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== '') {
      try {
        const response = await searchLocationStore.fetchLocations(searchQuery.value)
        mapboxSearchResults.value = response
      } catch {
        searchError.value = true
      }
      return
    }
    mapboxSearchResults.value = null
  }, 300)
}

const router = useRouter()

const openCityWeather = (searchResult: LocationData) => {
  const [city, state] = searchResult.place_name.split(',')
  console.log(city, state)

  router.push({
    name: 'cityView',
    params: { state: state.split(' ').join(''), city },
    query: {
      lat: searchResult.coordinates[1],
      lng: searchResult.coordinates[0],
      preview: true
    }
  })
}
</script>
