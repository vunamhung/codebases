import { useEffect, useState } from 'react'
import { couldStartTrivia } from 'typescript'
import { client } from '../apollo/client'
import { pairsQuery } from '../apollo/queries'

/*
 * Due to Cors the api was forked and a proxy was created
 * @see https://github.com/pancakeswap/gatsby-pancake-api/commit/e811b67a43ccc41edd4a0fa1ee704b2f510aa0ba
 */
export const baseUrl = 'https://gatsby-jetswap-api-josdev418.vercel.app/api/v1'

/* eslint-disable camelcase */

export interface TradePair {
  swap_pair_contract: string
  base_symbol: string
  quote_symbol: string
  last_price: number
  base_volume_24_h: number
  quote_volume_24_h: number
}

export interface ApiStatResponse {
  update_at: string
  '24h_total_volume': number
  total_value_locked: number
  total_value_locked_all: number
  trade_pairs: {
    [key: string]: TradePair
  }
}

export const useGetStats = () => {
  const [data, setData] = useState<ApiStatResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(`${baseUrl}/stat`)
        // const responsedata: ApiStatResponse = await response.json()

        // setData(responsedata)
        const result = await client.query({
          query: pairsQuery,
          variables: {},
          fetchPolicy: 'no-cache',
        })

        if (result?.data) {
          let pairTVL = 0
          result.data.pairs.map((pair) => {
            pairTVL += parseFloat(pair.reserveUSD)
            return pairTVL
          })

          const responsedata: ApiStatResponse = {
            update_at: '',
            '24h_total_volume': 0,
            total_value_locked: 0,
            total_value_locked_all: pairTVL,
            trade_pairs: null,
          }
          setData(responsedata)
        }
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setData])

  return data
}
