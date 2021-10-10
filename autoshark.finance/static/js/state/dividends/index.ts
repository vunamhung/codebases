import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import dividendsConfig from 'config/constants/dividends'
import { getAddress } from 'utils/addressHelpers'
import fetchDividends from './fetchDividends'
import {
  fetchDividendUserEarnings,
  fetchDividendUserAllowances,
  fetchDividendUserTokenBalances,
  fetchDividendUserStakedBalances,
} from './fetchDividendUser'
import { Dividend, DividendsState } from '../types'

const noAccountDividendConfig = dividendsConfig.map((dividend) => ({
  ...dividend,
  userData: {
    allowance: '0',
    stakingTokenBalance: '0',
    tokenBalance: '0',
    pendingReward: '0',
    stakedBalance: '0',
  },
}))

const initialState: DividendsState = {
  data: noAccountDividendConfig,
  userDataLoaded: false,
}

// Async thunks
export const fetchDividendsPublicDataAsync = createAsyncThunk<Dividend[], string[]>(
  'dividends/fetchDividendsPublicDataAsync',
  async () => {
    const pools = await fetchDividends(dividendsConfig)
    return pools
  },
)

interface DividendUserDataResponse {
  dividendAddress: string
  allowance: string
  tokenBalance: string
  stakingTokenBalance: string
  pendingReward: string
  stakedBalance: string
}

export const fetchDividendUserDataAsync = createAsyncThunk<
  DividendUserDataResponse[],
  { account: string; addresses: string[] }
>('dividends/fetchDividendUserDataAsync', async ({ account, addresses }) => {
  const dividendsToFetch = dividendsConfig.filter((dividendConfig) =>
    addresses.includes(getAddress(dividendConfig.contractAddress)),
  )
  const userDividendAllowances = await fetchDividendUserAllowances(account, dividendsToFetch)
  const userDividendTokenBalances = await fetchDividendUserTokenBalances(account, dividendsToFetch)
  const userStakedBalances = await fetchDividendUserStakedBalances(account, dividendsToFetch)
  const userDividendEarnings = await fetchDividendUserEarnings(account, dividendsToFetch)

  const results = userDividendAllowances.map((dividendAllowance, index) => {
    return {
      dividendAddress: getAddress(dividendsToFetch[index].contractAddress),
      allowance: userDividendAllowances[index],
      stakingTokenBalance: userDividendTokenBalances[index],
      stakedBalance: userStakedBalances[index],
      pendingReward: userDividendEarnings[index],
    }
  })
  return results
})

export const dividendsSlice = createSlice({
  name: 'Dividends',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Update dividends with live data
    builder.addCase(fetchDividendsPublicDataAsync.fulfilled, (state, action) => {
      state.data = state.data.map((dividend) => {
        const liveDividendData = action.payload.find(
          (dividendData) => getAddress(dividendData.contractAddress) === getAddress(dividend.contractAddress),
        )
        return { ...dividend, ...liveDividendData }
      })
    })

    // Update dividends with user data
    builder.addCase(fetchDividendUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { dividendAddress } = userDataEl
        const index = state.data.findIndex((dividend) => getAddress(dividend.contractAddress) === dividendAddress)
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.userDataLoaded = true
    })
  },
})

export default dividendsSlice.reducer
