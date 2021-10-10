/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { allTimeVolumeQuery } from '../../apollo/queries'
import { client } from '../../apollo/client'
import { AllTimeState } from '../types'

const initialState: AllTimeState = { untrackedVolumeUSD: 0 }

export const allTimeVolumeSlice = createSlice({
  name: 'AllTimeVolume',
  initialState,
  reducers: {
    setAllTimeVolumePublicData: (state, action) => {
      state.untrackedVolumeUSD = parseFloat(action.payload)
    },
  },
})

// Actions
export const { setAllTimeVolumePublicData } = allTimeVolumeSlice.actions

// Thunks
export const fetchAllTimeVolumePublicDataAsync = () => async (dispatch) => {
  const result = await client.query({
    query: allTimeVolumeQuery,
    variables: {},
    fetchPolicy: 'no-cache',
  })

  if (result?.data?.uniswapFactories[0]?.untrackedVolumeUSD) {
    dispatch(setAllTimeVolumePublicData(result?.data?.uniswapFactories[0]?.untrackedVolumeUSD))
  }
}

export default allTimeVolumeSlice.reducer
