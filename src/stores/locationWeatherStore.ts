import { defineStore } from 'pinia'
import axios from 'axios'

const openWeatherAPIKey = 'c80de8e20aa4237d0549ff80765920ea'

export const useLocationWeatherStore = defineStore('locationWeather', {
  state: () => ({
    savedCities: JSON.parse(localStorage.getItem('savedCities'))
  }),
  getters: {
    getSavedCities() {
      return this.savedCities
    },
    async getSavedCurrentWeatherCities() {
      await this.fetchSavedCurrentWeatherCities()
      return this.savedCities
    }
  },
  actions: {
    async fetchCurrentWeather(lat: number, lng: number) {
      try {
        const result = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${openWeatherAPIKey}&units=metric`
        )
        return result.data
      } catch (err) {
        return err
      }
    },

    async fetchWeatherInfo(lat: number, lng: number) {
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
        const request = this.savedCities.map((city) => {
          return this.fetchCurrentWeather(city.coords.lat, city.coords.lng)
        })

        try {
          const weatherData = await Promise.all(request)

          weatherData.forEach((value, index) => {
            this.savedCities[index].weather = value.main
          })
        } catch (error) {
          return Error('Error fetching weather:' + error)
        }
      }
    },

    saveCity(cityInfo) {
      this.savedCities.push(cityInfo)
      localStorage.setItem('savedCities', JSON.stringify(this.savedCities))
    },

    removeCity(cityId) {
      const updatedCities = this.savedCities.filter((city) => {
        return city.id !== cityId
      })
      this.savedCities = updatedCities
      localStorage.setItem('savedCities', JSON.stringify(updatedCities))
    }
  }
})
