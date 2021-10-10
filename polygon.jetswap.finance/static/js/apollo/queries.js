import gql from 'graphql-tag'

export const pairsQuery = gql`
  {
    pairs {
      id
      reserveUSD
      totalSupply
    }
  }
`

export const allPricesQuery = gql`
  {
    tokens {
      id
      symbol
      name
      derivedBNB: derivedETH
      tokenDayData(orderBy: date, orderDirection: desc, first: 1) {
        id
        dailyTxns
        priceUSD
      }
    }
  }
`

export const allTimeVolumeQuery = gql`
  {
    uniswapFactories {
      untrackedVolumeUSD
    }
  }
`

export const PAIR_DAY_DATA_BULK = (pairList) => {
  const yesterday = (Math.floor(new Date().getTime() / 86400 / 1000) - 1) * 86400 // EE yesterdays data
  let pairString = '['
  pairList.slice(0, pairList.length - 1).forEach((pair) => {
    pairString += `"${pair}",`
  })
  pairString += `"${pairList[pairList.length - 1]}"]`
  const queryString = `
      query days {
        pairDayDatas(first: 30, where: { pairAddress_in: ${pairString}, date: ${yesterday}}) {
            pairAddress
          dailyVolumeUSD
          reserveUSD
        }
      } 
  `
  return gql(queryString)
}
