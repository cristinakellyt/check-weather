<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <SearchBar @searchQuery="getSearchResults" />
      <ul
        v-if="locationsResult"
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
      >
        <p v-if="searchError">Sorry, something went wrong, please try again.</p>

        <p v-if="!searchError && locationsResult.length === 0">
          No results match your search, try a different term.
        </p>

        <template v-else>
          <li
            v-for="result in locationsResult"
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
import SearchBar from '@/components/common/SearchBar.vue'
import { useSearchLocationStore } from '@/stores/searchLocationStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface LocationData {
  id: string
  place_name: string
  coordinates: number[]
}

type LocationResult = LocationData[] | null

const locationsResult = ref<LocationResult>(null)
const searchError = ref(false)

const searchLocationStore = useSearchLocationStore()

const getSearchResults = async (searchInput: string) => {
  if (searchInput !== '') {
    try {
      const response = await searchLocationStore.fetchLocations(searchInput)
      locationsResult.value = response
    } catch {
      searchError.value = true
    }
  } else {
    locationsResult.value = null
  }
}

const router = useRouter()

const openCityWeather = (searchResult: LocationData) => {
  const [city, state] = searchResult.place_name.split(',')
  router.push({
    name: 'cityView',
    params: { state, city },
    query: {
      lat: searchResult.coordinates[1],
      lng: searchResult.coordinates[0],
      preview: 'true'
    }
  })
}
</script>
