import { defineStore } from 'pinia'
import axios from 'axios'

const mapboxAPIKey =
  'pk.eyJ1IjoiY3Jpc3RpbmFrIiwiYSI6ImNsc2l3NnZzazE5ZGEya3F0bmZpaG5jaGIifQ.XHAmegdsFb_CqekE5Etg2w'

export const useSearchLocationStore = defineStore('searchLocation', {
  actions: {
    async fetchLocations(searchQuery: string) {
      try {
        const result = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?access_token=${mapboxAPIKey}&types=place`
        )
        const features = result.data.features

        const locationsData = features.map((feature: any) => ({
          id: feature.id,
          place_name: feature.place_name,
          coordinates: feature.geometry.coordinates
        }))
        return locationsData
      } catch (err) {
        return err
      }
    }
  }
})
