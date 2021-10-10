import { Farm } from 'state/types'
import fetchCakeFarmData from './fetchCakeFarmData'

const fetchCakeFarm = async (farm: Farm): Promise<Farm> => {
  const farmPublicData = await fetchCakeFarmData(farm)

  return { ...farm, ...farmPublicData }
}

export default fetchCakeFarm
