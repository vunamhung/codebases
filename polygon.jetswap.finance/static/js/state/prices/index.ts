/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PriceApiResponse, PriceState } from 'state/types'
import { getWeb3NoAccount } from 'utils/web3'
import { AbiItem } from 'web3-utils'
import UniV2LPABI from 'config/abi/UniV2LP.json'
import BigNumber from 'bignumber.js'
import { allPricesQuery } from '../../apollo/queries'
import { client } from '../../apollo/client'

const web3 = getWeb3NoAccount()

const initialState: PriceState = {
  isLoading: false,
  lastUpdated: null,
  data: null,
}
const HonorMaticPairContract = new web3.eth.Contract(
  (UniV2LPABI as unknown) as AbiItem,
  '0x9873A5ca806AfD8CCB7336D6ebC54CD823D99bF3',
)
const CrystlMaticPairContract = new web3.eth.Contract(
  (UniV2LPABI as unknown) as AbiItem,
  '0x9243238564d7e9f5668001c8bd4fed7f49ce7a06',
)
const PearMaticPairContract = new web3.eth.Contract(
  (UniV2LPABI as unknown) as AbiItem,
  '0x236E6c22B3abdB12C86AB13EB5c230f4F67D81b4',
)
const AlphaMaticPairContract = new web3.eth.Contract(
  (UniV2LPABI as unknown) as AbiItem,
  '0x6005a1C3b380d1847BAb6EbAFd04c4584ABb0c0a',
)

const CollarMaticPairContract = new web3.eth.Contract(
  (UniV2LPABI as unknown) as AbiItem,
  '0x8A1B5473217C878Cf2937a54166a033Ea13178B2',
)
// Thunks
export const fetchPrices = createAsyncThunk<PriceApiResponse>('prices/fetch', async () => {
  const tempData = {
    prices: {
      jets: 0,
      wbnb: 0,
      safermoon: 0,
      alloy: 0,
      banana: 0,
      honor: 0,
      crystl: 0,
      pear: 0,
      alpha: 0,
      collar: 0,
    },
    update_at: null,
  }

  // const dexData = await client.query({
  //   query: allPricesQuery,
  //   variables: {},
  //   fetchPolicy: 'no-cache',
  // })

  // if (dexData?.data) {
  //   const tokens = dexData.data.tokens
  //   for (let i = 0; i < tokens.length; i++) {
  //     if (tokens[i].tokenDayData.length > 0) {
  //       tempData.prices[tokens[i].symbol.toLowerCase()] = tokens[i].tokenDayData[0].priceUSD
  //     }
  //   }
  // }
  const { 0: reserve00, 1: reserve01 } = await HonorMaticPairContract.methods.getReserves().call()
  if (!new BigNumber(reserve01).eq(new BigNumber(0))) {
    tempData.prices.honor = new BigNumber(reserve00).div(reserve01).toNumber()
  }
  const { 0: reserve10, 1: reserve11 } = await CrystlMaticPairContract.methods.getReserves().call()
  if (!new BigNumber(reserve11).eq(new BigNumber(0))) {
    tempData.prices.crystl = new BigNumber(reserve10).div(reserve11).toNumber()
  }
  const { 0: reserve20, 1: reserve21 } = await PearMaticPairContract.methods.getReserves().call()
  if (!new BigNumber(reserve21).eq(new BigNumber(0))) {
    tempData.prices.pear = new BigNumber(reserve20).div(reserve21).toNumber()
  }
  const { 0: reserve30, 1: reserve31 } = await AlphaMaticPairContract.methods.getReserves().call()
  if (!new BigNumber(reserve30).eq(new BigNumber(0))) {
    tempData.prices.alpha = new BigNumber(reserve31).div(reserve30).toNumber()
  }
  const { 0: reserve40, 1: reserve41 } = await CollarMaticPairContract.methods.getReserves().call()
  if (!new BigNumber(reserve41).eq(new BigNumber(0))) {
    tempData.prices.collar = new BigNumber(reserve40).div(reserve41).toNumber()
  }

  const data = tempData as PriceApiResponse
  // Return normalized token names
  return {
    update_at: data.update_at,
    prices: Object.keys(data.prices).reduce((accum, token) => {
      return {
        ...accum,
        [token.toLowerCase()]: data.prices[token],
      }
    }, {}),
  }
})

export const pricesSlice = createSlice({
  name: 'prices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPrices.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchPrices.fulfilled, (state, action: PayloadAction<PriceApiResponse>) => {
      state.isLoading = false
      state.lastUpdated = action.payload.update_at
      state.data = action.payload.prices
    })
  },
})

export default pricesSlice.reducer
