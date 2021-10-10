import { FarmConfig } from 'config/constants/types'
import fetchCakeFarm from './fetchCakeFarm'

const fetchCakeFarms = async (farmsToFetch: FarmConfig[]) => {
  const data = await Promise.all(
    farmsToFetch.map(async (farmConfig) => {
      const farm = await fetchCakeFarm(farmConfig)
      return farm
    }),
  )
  return data
}

export default fetchCakeFarms
