import { defineStore } from 'pinia'
import axios from 'axios'

const openWeatherAPIKey = 'c80de8e20aa4237d0549ff80765920ea'

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

function isValidSavedCity(item: any): item is SavedCities {
  return (
    typeof item.id === 'string' &&
    typeof item.state === 'string' &&
    typeof item.city === 'string' &&
    item.coords &&
    typeof item.coords.lat === 'string' &&
    typeof item.coords.lng === 'string'
  )
}

export const useLocationWeatherStore = defineStore('locationWeather', {
  state: () => ({
    savedCities: initializeSavedCities()
  }),
  getters: {
    getSavedCities(): SavedCities[] {
      return this.savedCities
    }
  },
  actions: {
    async fetchCurrentWeather(lat: string, lng: string) {
      try {
        const result = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${openWeatherAPIKey}&units=metric`
        )
        return result.data
      } catch (err) {
        return err
      }
    },

    async fetchWeatherInfo(lat: string, lng: string) {
      try {
        const result = await axios.get(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&appid=${openWeatherAPIKey}&units=metric`
        )
        return result.data
      } catch (err) {
        return err
      }
    },

    async fetchSavedCurrentWeatherCities() {
      if (this.savedCities) {
        const request = this.savedCities.map((city: SavedCities) => {
          return this.fetchCurrentWeather(city.coords.lat, city.coords.lng)
        })

        try {
          const weatherData = await Promise.all(request)

          weatherData.forEach((value, index) => {
            this.savedCities[index].weather = value.main
          })
          return this.savedCities
        } catch (error) {
          return Error('Error fetching weather:' + error)
        }
      } else {
        return this.savedCities
      }
    },

    saveCity(cityInfo: SavedCities) {
      this.savedCities.push(cityInfo)
      localStorage.setItem('savedCities', JSON.stringify(this.savedCities))
    },

    removeCity(cityId: string) {
      const updatedCities = this.savedCities.filter((city: SavedCities) => {
        return city.id !== cityId
      })
      this.savedCities = updatedCities
      localStorage.setItem('savedCities', JSON.stringify(updatedCities))
    }
  }
})

function initializeSavedCities(): SavedCities[] {
  const savedCitiesString = localStorage.getItem('savedCities')

  if (savedCitiesString) {
    try {
      const parsedData = JSON.parse(savedCitiesString)

      if (Array.isArray(parsedData)) {
        return parsedData.filter((item: any) => {
          return isValidSavedCity(item)
        })
      } else {
        console.error('Invalid data format in localStorage: Not an array')
      }
    } catch (error) {
      console.error('Error parsing JSON data from localStorage:', error)
    }
  }

  return []
}
