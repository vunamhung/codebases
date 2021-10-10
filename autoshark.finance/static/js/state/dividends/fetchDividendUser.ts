import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import dividendPoolABI from 'config/abi/dividendPool.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { DividendConfig } from 'config/constants/types'

export const fetchDividendUserAllowances = async (account: string, dividendsToFetch: DividendConfig[]) => {
  const calls = dividendsToFetch.map((dividend) => {
    return {
      address: getAddress(dividend.stakingToken.address),
      name: 'allowance',
      params: [account, getAddress(dividend.contractAddress)],
    }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchDividendUserTokenBalances = async (account: string, dividendsToFetch: DividendConfig[]) => {
  const calls = dividendsToFetch.map((dividend) => {
    return {
      address: getAddress(dividend.stakingToken.address),
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchDividendUserStakedBalances = async (account: string, dividendsToFetch: DividendConfig[]) => {
  const calls = dividendsToFetch.map((dividend) => {
    return {
      address: getAddress(dividend.contractAddress),
      name: 'principalOf',
      params: [account],
    }
  })

  const rawStakedBalances = await multicall(dividendPoolABI, calls)

  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })

  return parsedStakedBalances
}

export const fetchDividendUserEarnings = async (account: string, dividendsToFetch: DividendConfig[]) => {
  const calls = dividendsToFetch.map((dividend) => {
    return {
      address: getAddress(dividend.contractAddress),
      name: 'profitOf',
      params: [account],
    }
  })

  const rawInfo = await multicall(dividendPoolABI, calls)

  const parsedEarnings = rawInfo.map((earnings) => {
    return new BigNumber(earnings?._bnb?._hex).toJSON()
  })

  return parsedEarnings
}
