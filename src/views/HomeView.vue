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
            @click="previewCity(result)"
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
          <p>Loading</p>
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup lang="ts">
import CityList from '@/components/CityList.vue'
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const mapboxAPIKey =
  'pk.eyJ1IjoiY3Jpc3RpbmFrIiwiYSI6ImNsc2l3NnZzazE5ZGEya3F0bmZpaG5jaGIifQ.XHAmegdsFb_CqekE5Etg2w'

const mapboxSearchResults = ref()
const searchQuery = ref('')
const queryTimeout = ref()
const searchError = ref(false)

const getSearchResults = () => {
  clearTimeout(queryTimeout.value)

  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== '') {
      try {
        const result = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxAPIKey}&types=place`
        )
        mapboxSearchResults.value = result.data.features
      } catch {
        searchError.value = true
      }
      return
    }
    mapboxSearchResults.value = null
  }, 300)
}

interface SearchResult {
  place_name: string
  geometry: {
    coordinates: [number, number]
  }
}

const router = useRouter()

const previewCity = (searchResult: SearchResult) => {
  const [city, state] = searchResult.place_name.split(',')
  console.log(city, state)

  router.push({
    name: 'cityView',
    params: { state: state.split(' ').join(''), city },
    query: {
      lat: searchResult.geometry.coordinates[1],
      lng: searchResult.geometry.coordinates[0],
      preview: true
    }
  })
}
</script>
