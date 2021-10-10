import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import vaultsConfig from 'config/constants/vaults'
import { originalFarms } from 'config/constants/farms'
import fetchCakeFarms from 'state/farms/fetchCakeFarms'
import { getNullAddress } from 'utils/addressHelpers'
import fetchVaults from './fetchVaults'
import fetchVaultsPrices from './fetchVaultsPrices'
import {
  fetchVaultUserEarnings,
  fetchVaultUserAllowances,
  fetchVaultUserTokenBalances,
  fetchVaultUserStakedBalances,
  fetchVaultUserNftSlots,
  fetchVaultUserNftTokenIds,
  fetchVaultUserBoost,
} from './fetchVaultUser'
import { Vault, VaultsState } from '../types'
import { fetchMintRates } from './fetchVaultMint'

const nullAdd = getNullAddress()

const noAccountVaultConfig = vaultsConfig.map((vault) => ({
  ...vault,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    baseEarnings: '0',
    jawsEarnings: '0',
    vaultNftSlots: [nullAdd, nullAdd, nullAdd, nullAdd, nullAdd],
    vaultNftTokenIds: ['0', '0', '0', '0', '0'],
    vaultBoostRate: '0',
  },
}))

const initialState: VaultsState = { data: noAccountVaultConfig, loadArchivedVaultsData: false, userDataLoaded: false }

// Async thunks
export const fetchVaultsPublicDataAsync = createAsyncThunk<Vault[], string[]>(
  'vaults/fetchVaultsPublicDataAsync',
  async (addresses?: string[]) => {
    // Add price helper farms

    const vaultsToFetch =
      addresses?.length > 0
        ? vaultsConfig.filter((vaultConfig) => addresses?.includes(vaultConfig.vaultAddress))
        : vaultsConfig

    const mintRates = await fetchMintRates()
    const priceFarms = await fetchCakeFarms(originalFarms)
    const vaults = await fetchVaults(vaultsToFetch, mintRates)
    const vaultsWithPrices = await fetchVaultsPrices([...priceFarms, ...vaults])

    return vaultsWithPrices
  },
)

interface VaultUserDataResponse {
  vaultAddress: string
  allowance: string
  tokenBalance: string
  stakedBalance: string
  baseEarnings: string
  jawsEarnings: string
  vaultNftSlots: string[]
  vaultNftTokenIds: string[]
  vaultBoostRate: string
}

export const fetchVaultUserDataAsync = createAsyncThunk<
  VaultUserDataResponse[],
  { account: string; addresses?: string[] }
>('vaults/fetchVaultUserDataAsync', async ({ account, addresses }) => {
  const vaultsToFetch =
    addresses?.length > 0
      ? vaultsConfig.filter((vaultConfig) => addresses?.includes(vaultConfig.vaultAddress))
      : vaultsConfig
  const userVaultAllowances = await fetchVaultUserAllowances(account, vaultsToFetch)
  const userVaultTokenBalances = await fetchVaultUserTokenBalances(account, vaultsToFetch)
  const userStakedBalances = await fetchVaultUserStakedBalances(account, vaultsToFetch)
  const userVaultEarnings = await fetchVaultUserEarnings(account, vaultsToFetch)
  const userVaultNftSlots = await fetchVaultUserNftSlots(account, vaultsToFetch)
  const userVaultNftTokenIds = await fetchVaultUserNftTokenIds(account, vaultsToFetch)
  const userVaultBoost = await fetchVaultUserBoost(account, vaultsToFetch)

  return userVaultAllowances.map((vaultAllowance, index) => {
    return {
      vaultAddress: vaultsToFetch[index].vaultAddress,
      allowance: userVaultAllowances[index],
      tokenBalance: userVaultTokenBalances[index],
      stakedBalance: userStakedBalances[index],
      baseEarnings: userVaultEarnings[index].base,
      jawsEarnings: userVaultEarnings[index].jaws,
      vaultNftSlots: userVaultNftSlots[index],
      vaultNftTokenIds: userVaultNftTokenIds[index],
      vaultBoostRate: userVaultBoost[index],
    }
  })
})

export const vaultsSlice = createSlice({
  name: 'Vaults',
  initialState,
  reducers: {
    setLoadArchivedVaultsData: (state, action) => {
      const loadArchivedVaultsData = action.payload
      state.loadArchivedVaultsData = loadArchivedVaultsData
    },
  },
  extraReducers: (builder) => {
    // Update vaults with live data
    builder.addCase(fetchVaultsPublicDataAsync.fulfilled, (state, action) => {
      state.data = state.data.map((vault) => {
        const liveVaultData = action.payload.find((vaultData) => vaultData.vaultAddress === vault.vaultAddress)
        return { ...vault, ...liveVaultData }
      })
    })

    // Update vaults with user data
    builder.addCase(fetchVaultUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { vaultAddress } = userDataEl
        const index = state.data.findIndex((vault) => vault.vaultAddress === vaultAddress)
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.userDataLoaded = true
    })
  },
})

// Actions
export const { setLoadArchivedVaultsData } = vaultsSlice.actions

export default vaultsSlice.reducer
