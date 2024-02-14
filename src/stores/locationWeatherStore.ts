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

export const useLocationWeatherStore = defineStore('locationWeather', {
  state: () => ({
    savedCities: JSON.parse(localStorage.getItem('savedCities') ?? '') as SavedCities[]
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
