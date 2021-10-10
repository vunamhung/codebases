import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { dividendsConfig } from 'config/constants'
import useRefresh from 'hooks/useRefresh'
import { BIG_ZERO } from 'utils/bigNumber'
import { getAddress } from 'utils/addressHelpers'
import { fetchDividendsPublicDataAsync, fetchDividendUserDataAsync } from '.'
import { State, DividendsState, Dividend } from '../types'

export const usePollDividendsData = (includeArchive = false) => {
  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    const DividendsToFetch = dividendsConfig
    const addresses = DividendsToFetch.map((DividendToFetch) => getAddress(DividendToFetch.contractAddress))

    dispatch(fetchDividendsPublicDataAsync(addresses))

    if (account) {
      dispatch(fetchDividendUserDataAsync({ account, addresses }))
    }
  }, [includeArchive, dispatch, fastRefresh, account])
}

/**
 * Fetches the "core" Dividend data used globally
 * 251 = JAWS-BNB LP
 * 252 = BUSD-BNB LP
 */
export const usePollCoreDividendData = () => {
  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchDividendsPublicDataAsync([]))
  }, [dispatch, fastRefresh])
}

export const useDividends = (): DividendsState => {
  const dividends = useSelector((state: State) => state.dividends)
  return dividends
}

export const useDividendFromAddress = (address: string): Dividend => {
  const dividend = useSelector((state: State) =>
    state.dividends.data.find((f) => getAddress(f.contractAddress) === address),
  )
  return dividend
}

export const useDividendUser = (address: string) => {
  const dividend = useDividendFromAddress(address)

  return {
    allowance: dividend?.userData ? new BigNumber(dividend.userData.allowance) : BIG_ZERO,
    stakingTokenBalance: dividend?.userData ? new BigNumber(dividend.userData.stakingTokenBalance) : BIG_ZERO,
    tokenBalance: dividend?.userData ? new BigNumber(dividend.userData.tokenBalance) : BIG_ZERO,
    pendingReward: dividend?.userData ? new BigNumber(dividend.userData.pendingReward) : BIG_ZERO,
  }
}
