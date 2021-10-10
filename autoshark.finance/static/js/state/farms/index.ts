import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import farmsConfig, { priceHelpers } from 'config/constants/farms'
import isArchivedPid from 'utils/farmHelpers'
// import priceHelperLpsConfig from 'config/constants/priceHelperLps'
import { getNullAddress } from 'utils/addressHelpers'
import { CAKE_MASTER_CHEF } from 'config/constants/vaults'
import fetchFarms from './fetchFarms'
import fetchFarmsPrices from './fetchFarmsPrices'
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
  fetchFarmUserNftSlots,
  fetchFarmUserNftTokenIds,
  fetchFarmUserBoost,
} from './fetchFarmUser'
import { FarmsState, Farm } from '../types'

const nullAdd = getNullAddress()

const noAccountFarmConfig = farmsConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    earnings: '0',
    farmNftSlots: [nullAdd, nullAdd, nullAdd, nullAdd, nullAdd],
    farmNftTokenIds: ['0', '0', '0', '0', '0'],
    farmBoostRate: '0',
  },
}))

const initialState: FarmsState = { data: noAccountFarmConfig, loadArchivedFarmsData: false, userDataLoaded: false }

export const nonArchivedFarms = farmsConfig.filter(({ pid }) => !isArchivedPid(pid))

// Async thunks
export const fetchFarmsPublicDataAsync = createAsyncThunk<Farm[], number[]>(
  'farms/fetchFarmsPublicDataAsync',
  async (pids) => {
    const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))

    const farms = await fetchFarms(priceHelpers.concat(farmsToFetch))
    const farmsWithPrices = await fetchFarmsPrices(farms)
    // Filter out price helper LP config farms
    const farmsWithoutHelperLps = farmsWithPrices.filter((farm: Farm) => {
      return farm.masterChef !== CAKE_MASTER_CHEF
    })
    return farmsWithoutHelperLps
  },
)

interface FarmUserDataResponse {
  pid: number
  masterChef: string
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
  farmNftSlots: string[]
  farmNftTokenIds: string[]
  farmBoostRate: string
}

export const fetchFarmUserDataAsync = createAsyncThunk<FarmUserDataResponse[], { account: string; pids: number[] }>(
  'farms/fetchFarmUserDataAsync',
  async ({ account, pids }) => {
    const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
    const farmsToFetchWithNFT = farmsConfig.filter((farmConfig) => farmConfig.farmType !== 0)
    const userFarmAllowances = await fetchFarmUserAllowances(account, farmsToFetch)
    const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, farmsToFetch)
    const userStakedBalances = await fetchFarmUserStakedBalances(account, farmsToFetch)
    const userFarmEarnings = await fetchFarmUserEarnings(account, farmsToFetch)
    const userFarmNftSlots = await fetchFarmUserNftSlots(account, farmsToFetchWithNFT)
    const userFarmNftTokenIds = await fetchFarmUserNftTokenIds(account, farmsToFetchWithNFT)
    const userFarmBoost = await fetchFarmUserBoost(account, farmsToFetchWithNFT)

    return userFarmAllowances.map((farmAllowance, index) => {
      // const {pid} = farmsToFetch[index]
      return {
        pid: farmsToFetch[index].pid,
        masterChef: farmsToFetch[index].masterChef,
        allowance: userFarmAllowances[index],
        tokenBalance: userFarmTokenBalances[index],
        stakedBalance: userStakedBalances[index],
        earnings: userFarmEarnings[index],
        farmNftSlots: userFarmNftSlots[index] ?? [nullAdd, nullAdd, nullAdd, nullAdd, nullAdd],
        farmNftTokenIds: userFarmNftTokenIds[index] ?? ['0', '0', '0', '0', '0'],
        farmBoostRate: userFarmBoost[index] ?? '0',
      }
    })
  },
)

export const farmsSlice = createSlice({
  name: 'Farms',
  initialState,
  reducers: {
    setLoadArchivedFarmsData: (state, action) => {
      const loadArchivedFarmsData = action.payload
      state.loadArchivedFarmsData = loadArchivedFarmsData
    },
  },
  extraReducers: (builder) => {
    // Update farms with live data
    builder.addCase(fetchFarmsPublicDataAsync.fulfilled, (state, action) => {
      state.data = state.data.map((farm) => {
        const liveFarmData = action.payload.find(
          (farmData) => farmData.pid === farm.pid && farmData.masterChef === farm.masterChef,
        )
        return { ...farm, ...liveFarmData }
      })
    })

    // Update farms with user data
    builder.addCase(fetchFarmUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { pid, masterChef } = userDataEl
        const index = state.data.findIndex((farm) => farm.pid === pid && farm.masterChef === masterChef)
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.userDataLoaded = true
    })
  },
})

// Actions
export const { setLoadArchivedFarmsData } = farmsSlice.actions

export default farmsSlice.reducer
