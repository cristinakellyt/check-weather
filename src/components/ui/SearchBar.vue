<template>
  <div>
    <input
      id="search"
      type="text"
      @input="getSearchResults"
      v-model="searchQuery"
      placeholder="Search for a city or state"
      class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#2982aa] placeholder-gray-200"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['searchQuery'])

const searchQuery = ref('')
const queryTimeout = ref()

const getSearchResults = () => {
  clearTimeout(queryTimeout.value)

  queryTimeout.value = setTimeout(() => {
    emit('searchQuery', searchQuery.value)
  }, 300)
}
</script>
