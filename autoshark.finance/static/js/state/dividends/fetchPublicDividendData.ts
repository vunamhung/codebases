import BigNumber from 'bignumber.js'
import dividendPoolABI from 'config/abi/dividendPool.json'
import { getAddress } from 'utils/addressHelpers'
import { BIG_TEN } from 'utils/bigNumber'
import multicall from 'utils/multicall'
import { Dividend, SerializedBigNumber } from '../types'

type PublicDividendData = {
  tokenBalance: SerializedBigNumber
  tvl: SerializedBigNumber
  apy: SerializedBigNumber
  rewardRate: SerializedBigNumber
  totalSupply: SerializedBigNumber
}

const fetchDividend = async (dividend: Dividend): Promise<PublicDividendData> => {
  const { contractAddress, boostRate } = dividend
  const address = getAddress(contractAddress)
  const calls = [
    // Balance of token in the contract
    {
      address,
      name: 'balance',
    },
    // TVL in the contract
    {
      address,
      name: 'tvl',
    },
    // APY of contract
    {
      address,
      name: 'apy',
    },
    {
      address,
      name: 'rewardRate',
    },
    {
      address,
      name: 'totalSupply',
    },
  ]

  const [balance, tvl, apy, rewardRate, totalSupply] = await multicall(dividendPoolABI, calls)
  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  // const allocPoint = balance ? new BigNumber(balance?._hex) : BIG_ZERO
  // const poolWeight = tvl ? new BigNumber(tvl?._hex) : BIG_ZERO
  // const depositFeeBP = apy ? new BigNumber(apy?._hex) : BIG_ZERO
  return {
    tokenBalance: new BigNumber(balance?.[0]?._hex).toJSON(),
    tvl: new BigNumber(tvl?.[0]?._hex).toJSON(),
    // TODO: this is obviously wrong
    apy: new BigNumber(apy?._bnb?._hex).times(boostRate).times(100).div(BIG_TEN.pow(18)).toJSON(),
    rewardRate: new BigNumber(rewardRate?.[0]?._hex).toJSON(),
    totalSupply: new BigNumber(totalSupply?.[0]?._hex).toJSON(),
  }
}

export default fetchDividend
