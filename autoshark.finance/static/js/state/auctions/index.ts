import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import farmsConfig from 'config/constants/farms'
import isArchivedPid from 'utils/farmHelpers'
import { Moment } from 'moment-timezone'
import { fetchAuctions, fetchAuctionsMeta } from './fetchAuction'
import { AuctionState, Auction } from '../types'

const initialState: AuctionState = { data: {}, userDataLoaded: false, hasMore: true }

export const nonArchivedAuctions = farmsConfig.filter(({ pid }) => !isArchivedPid(pid))

// Async thunks
export const fetchAuctionsPublicDataAsync = createAsyncThunk<
  { hasMore: boolean; auctions: Auction[] },
  {
    account: string
    sortBy: string
    active: boolean
    sold: boolean
    ended: boolean
    owner: string
    time: Moment
    rarities: string[]
    auctionTypes: null | number
    myBids: boolean
    myAuctions: boolean
    series: string
  }
>(
  'farms/fetchAuctionsPublicDataAsync',
  async ({ account, sortBy, active, sold, ended, owner, time, rarities, auctionTypes, myBids, myAuctions, series }) => {
    // const auctionsLength = await fetchAuctionsLength(sortBy, active, sold, ended, owner)
    console.info('only fetch auctions')
    const auctions = await fetchAuctions(
      sortBy,
      active,
      sold,
      ended,
      owner,
      time,
      rarities,
      auctionTypes,
      myBids,
      myAuctions,
      series,
    )
    const hasMore = auctions.length > 0
    const auctionWithMeta = await fetchAuctionsMeta(auctions, account)
    return { hasMore, auctions: auctionWithMeta }
  },
)

export const resetAndFetchAuctionsPublicDataAsync = createAsyncThunk<
  { hasMore: boolean; auctions: Auction[] },
  {
    account: string
    sortBy: string
    active: boolean
    sold: boolean
    ended: boolean
    owner: string
    time: Moment
    rarities: string[]
    auctionTypes: null | number
    myBids: boolean
    myAuctions: boolean
    series: string
  }
>(
  'farms/resetAndFetchAuctionsPublicDataAsync',
  async ({ account, sortBy, active, sold, ended, owner, time, rarities, auctionTypes, myBids, myAuctions, series }) => {
    // const auctionsLength = await fetchAuctionsLength(sortBy, active, sold, ended, owner)
    console.info('reset and fetch auctions')
    const auctions = await fetchAuctions(
      sortBy,
      active,
      sold,
      ended,
      owner,
      time,
      rarities,
      auctionTypes,
      myBids,
      myAuctions,
      series,
    )
    const hasMore = auctions.length > 0
    const auctionWithMeta = await fetchAuctionsMeta(auctions, account)
    return { hasMore, auctions: auctionWithMeta }
  },
)

export const nftSlice = createSlice({
  name: 'Auctions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Update emporium with live data
    builder.addCase(fetchAuctionsPublicDataAsync.fulfilled, (state, action) => {
      action.payload.auctions.forEach((item) => {
        state.data[item.auctionId] = item
      })
      state.hasMore = action.payload.hasMore
      state.userDataLoaded = true
    })
    builder.addCase(resetAndFetchAuctionsPublicDataAsync.pending, (state) => {
      state.data = {}
      state.userDataLoaded = false
    })
    builder.addCase(resetAndFetchAuctionsPublicDataAsync.fulfilled, (state, action) => {
      // state.length = action.payload.length
      action.payload.auctions.forEach((item) => {
        state.data[item.auctionId] = item
      })
      state.hasMore = action.payload.hasMore
      state.userDataLoaded = true
    })
  },
})

export default nftSlice.reducer
