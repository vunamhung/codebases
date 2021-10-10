/* eslint-disable no-param-reassign */
import Web3 from 'web3'
import { createSlice } from '@reduxjs/toolkit'
import vaultsConfig from 'config/constants/vaults'
import fetchVaults from './fetchVaults'
import {
  fetchVaultUserEarnings,
  fetchVaultUserAllowances,
  fetchVaultUserTokenBalances,
  fetchVaultUserStakedBalances,
} from './fetchVaultUser'
import { VaultsState, Vault } from '../types'

const initialState: VaultsState = { data: [...vaultsConfig] }

export const vaultsSlice = createSlice({
  name: 'Vaults',
  initialState,
  reducers: {
    setVaultsPublicData: (state, action) => {
      const liveVaultsData: Vault[] = action.payload
      state.data = state.data.map((vault) => {
        const liveVaultData = liveVaultsData.find((f) => f.pid === vault.pid && f.provider === vault.provider)
        return { ...vault, ...liveVaultData }
      })
    },
    setVaultUserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { index } = userDataEl
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
    },
  },
})

// Actions
export const { setVaultsPublicData, setVaultUserData } = vaultsSlice.actions

// Thunks
export const fetchVaultsPublicDataAsync = () => async (dispatch) => {
  const vaults = await fetchVaults()
  dispatch(setVaultsPublicData(vaults))
}
export const fetchVaultUserDataAsync = (account, web3?: Web3) => async (dispatch) => {
  const userVaultAllowances = await fetchVaultUserAllowances(account)
  const userVaultTokenBalances = await fetchVaultUserTokenBalances(account, web3)
  const userStakedBalances = await fetchVaultUserStakedBalances(account)
  const userVaultEarnings = await fetchVaultUserEarnings(account)

  const arrayOfUserDataObjects = userVaultAllowances.map((vaultAllowance, index) => {
    return {
      index,
      allowance: userVaultAllowances[index],
      tokenBalance: userVaultTokenBalances[index],
      stakedBalance: userStakedBalances[index],
      earnings: userVaultEarnings[index],
    }
  })

  dispatch(setVaultUserData({ arrayOfUserDataObjects }))
}

export default vaultsSlice.reducer
