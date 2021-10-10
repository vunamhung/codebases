import { DividendConfig } from 'config/constants/types'
import fetchDividend from './fetchDividend'

const fetchDividends = async (dividendsToFetch: DividendConfig[]) => {
  const data = await Promise.all(
    dividendsToFetch.map(async (dividendConfig) => {
      const dividend = await fetchDividend(dividendConfig)
      return dividend
    }),
  )
  return data
}

export default fetchDividends
