import { defineStore } from 'pinia'
import axios from 'axios'

const openWeatherAPIKey = 'c80de8e20aa4237d0549ff80765920ea'

export const useLocationWeatherStore = defineStore('locationWeather', {
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
    }
  }
})
