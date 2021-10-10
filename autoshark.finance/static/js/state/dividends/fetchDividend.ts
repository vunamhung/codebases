import { Dividend } from 'state/types'
import fetchPublicDividendData from './fetchPublicDividendData'

const fetchDividend = async (dividend: Dividend): Promise<Dividend> => {
  const dividendPublicData = await fetchPublicDividendData(dividend)
  return { ...dividend, ...dividendPublicData }
}

export default fetchDividend
