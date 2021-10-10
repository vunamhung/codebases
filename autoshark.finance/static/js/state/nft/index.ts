import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { nftCollection } from 'config/constants/nfts'
import { fetchNFTUserInventory, fetchBalanceOfCollection, fetchTokenIds } from './fetchNFTUser'
import { NFTState } from '../types'

const noAccountNFTConfig = nftCollection.map((collection) => ({
  ...collection,
  userData: {
    inventory: [],
    balanceOf: 0,
    tokenIds: [],
  },
}))

const initialState: NFTState = { data: noAccountNFTConfig, userDataLoaded: false }

// Async thunks
// export const fetchFarmsPublicDataAsync = createAsyncThunk<Farm[], number[]>(
//   'farms/fetchFarmsPublicDataAsync',
//   async (pids) => {
//     const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))

//     // Add price helper farms
//     const farmsWithPriceHelpers = farmsToFetch.concat(priceHelperLpsConfig)

//     const farms = await fetchFarms(farmsWithPriceHelpers)
//     const farmsWithPrices = await fetchFarmsPrices(farms)

//     // Filter out price helper LP config farms
//     const farmsWithoutHelperLps = farmsWithPrices.filter((farm: Farm) => {
//       return farm.pid || farm.pid === 0
//     })

//     return farmsWithoutHelperLps
//   },
// )

interface NFTUserDataResponse {
  series: number
  balanceOf: number
  tokenIds: number[]
  inventory: any[]
}

export const fetchNFTUserDataAsync = createAsyncThunk<NFTUserDataResponse[], { account: string }>(
  'farms/fetchNFTUserDataAsync',
  async ({ account }) => {
    const balanceOf = await fetchBalanceOfCollection(account, nftCollection)
    const tokenIds = await fetchTokenIds(account, nftCollection, balanceOf)
    const inventory = await fetchNFTUserInventory(tokenIds)

    return inventory.map((item, index) => {
      return {
        series: item.series,
        balanceOf: balanceOf[index].value,
        tokenIds: tokenIds[index].value,
        inventory: inventory[index].value,
      }
    })
  },
)

export const nftSlice = createSlice({
  name: 'NFTs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Update farms with live data
    // builder.addCase(fetchFarmsPublicDataAsync.fulfilled, (state, action) => {
    //   state.data = state.data.map((farm) => {
    //     const liveFarmData = action.payload.find((farmData) => farmData.pid === farm.pid)
    //     return { ...farm, ...liveFarmData }
    //   })
    // })

    // Update farms with user data
    builder.addCase(fetchNFTUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { series } = userDataEl
        const index = state.data.findIndex((nft) => nft.series === series)
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.userDataLoaded = true
    })
  },
})

export default nftSlice.reducer
