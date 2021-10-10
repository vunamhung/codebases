import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { kebabCase } from 'lodash'
import { useWeb3React } from '@web3-react/core'
import { Toast, toastTypes } from 'jetswap-uikit-polygon'
import { useSelector, useDispatch } from 'react-redux'
import { Team } from 'config/constants/types'
import { getWeb3NoAccount } from 'utils/web3'
import useRefresh from 'hooks/useRefresh'
import {
  fetchFarmsPublicDataAsync,
  fetchVaultsPublicDataAsync,
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchAllTimeVolumePublicDataAsync,
  push as pushToast,
  remove as removeToast,
  clear as clearToast,
  setBlock,
} from './actions'
import {
  State,
  Farm,
  Pool,
  Vault,
  Block,
  ProfileState,
  TeamsState,
  AchievementState,
  PriceState,
  AllTimeState,
} from './types'
import { fetchProfile } from './profile'
import { fetchTeam, fetchTeams } from './teams'
import { fetchAchievements } from './achievements'
import { fetchPrices } from './prices'

const ZERO = new BigNumber(0)

export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
    dispatch(fetchPoolsPublicDataAsync())
    dispatch(fetchVaultsPublicDataAsync())
    dispatch(fetchAllTimeVolumePublicDataAsync())
  }, [dispatch, slowRefresh])

  useEffect(() => {
    const web3 = getWeb3NoAccount()
    const interval = setInterval(async () => {
      const blockNumber = await web3.eth.getBlockNumber()
      dispatch(setBlock(blockNumber))
    }, 6000)

    return () => clearInterval(interval)
  }, [dispatch])
}

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm && farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm && farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm && farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm && farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
  }
}

// Vaults

export const useValuts = (): Vault[] => {
  const vaults = useSelector((state: State) => state.vaults.data)
  return vaults
}

export const useVaultFromPid = (pid, provider): Vault => {
  const vault = useSelector((state: State) => state.vaults.data.find((f) => f.pid === pid && f.provider === provider))
  return vault
}

export const useVaultFromSymbol = (lpSymbol: string): Vault => {
  const vault = useSelector((state: State) => state.vaults.data.find((f) => f.lpSymbol === lpSymbol))
  return vault
}

export const useVaultUser = (pid, provider) => {
  const vault = useVaultFromPid(pid, provider)

  return {
    allowance: vault && vault.userData ? new BigNumber(vault.userData.allowance) : new BigNumber(0),
    tokenBalance: vault && vault.userData ? new BigNumber(vault.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: vault && vault.userData ? new BigNumber(vault.userData.stakedBalance) : new BigNumber(0),
    earnings: vault && vault.userData ? new BigNumber(vault.userData.earnings) : new BigNumber(0),
  }
}

// All Time Volume

export const useAllTimeVolume = (): AllTimeState => {
  const data = useSelector((state: State) => state.allTimeVolume)
  return data
}

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const pools = useSelector((state: State) => state.pools.data)
  return pools
}

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return pool
}

// Toasts
export const useToast = () => {
  const dispatch = useDispatch()
  const helpers = useMemo(() => {
    const push = (toast: Toast) => dispatch(pushToast(toast))

    return {
      toastError: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.DANGER, title, description })
      },
      toastInfo: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.INFO, title, description })
      },
      toastSuccess: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.SUCCESS, title, description })
      },
      toastWarning: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.WARNING, title, description })
      },
      push,
      remove: (id: string) => dispatch(removeToast(id)),
      clear: () => dispatch(clearToast()),
    }
  }, [dispatch])

  return helpers
}

// Profile

export const useFetchProfile = () => {
  const { account } = useWeb3React()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchProfile(account))
  }, [account, dispatch])
}

export const useProfile = () => {
  const { isInitialized, isLoading, data, hasRegistered }: ProfileState = useSelector((state: State) => state.profile)
  return { profile: data, hasProfile: isInitialized && hasRegistered, isInitialized, isLoading }
}

// Teams

export const useTeam = (id: number) => {
  const team: Team = useSelector((state: State) => state.teams.data[id])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTeam(id))
  }, [id, dispatch])

  return team
}

export const useTeams = () => {
  const { isInitialized, isLoading, data }: TeamsState = useSelector((state: State) => state.teams)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTeams())
  }, [dispatch])

  return { teams: data, isInitialized, isLoading }
}

// Achievements

export const useFetchAchievements = () => {
  const { account } = useWeb3React()
  const dispatch = useDispatch()

  useEffect(() => {
    if (account) {
      dispatch(fetchAchievements(account))
    }
  }, [account, dispatch])
}

export const useAchievements = () => {
  const achievements: AchievementState['data'] = useSelector((state: State) => state.achievements.data)
  return achievements
}

// Prices
export const useFetchPriceList = () => {
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPrices())
  }, [dispatch, slowRefresh])
}

export const useGetApiPrice = (token: string) => {
  const prices = useGetApiPrices()

  if (!prices) {
    return null
  }

  return prices[token.toLowerCase()]
}

// Block
export const useBlock = (): Block => {
  return useSelector((state: State) => state.block)
}

// Prices

export const usePriceMaticUsd = (): BigNumber => {
  const pid = 11 // MATIC-USDT LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceWingsUsd = (): BigNumber => {
  const pid = 2 // WING-MATIC LP
  const farm = useFarmFromPid(pid)
  const maticPriceUSD = usePriceMaticUsd()
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote).times(maticPriceUSD) : ZERO
}

export const usePriceEthUsd = (): BigNumber => {
  const pid = 9 // ETH-USDT LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePricePforceUsd = (): BigNumber => {
  const pid = 17 // PFORCE-MATIC LP
  const farm = useFarmFromPid(pid)
  const maticPriceUSD = usePriceMaticUsd()
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote).times(maticPriceUSD) : ZERO
}

export const usePricePswampUsd = (): BigNumber => {
  const pid = 18 // PSWAMP-USDC LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceDaiUsd = (): BigNumber => {
  const pid = 16 // USDC-DAI LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePricePiratepUsd = (): BigNumber => {
  const pid = 20 // PIRATEP-MATIC LP
  const farm = useFarmFromPid(pid)
  const maticPriceUSD = usePriceMaticUsd()
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote).times(maticPriceUSD) : ZERO
}

export const usePriceTimeUsd = (): BigNumber => {
  const pid = 21 // TIME-ETH LP
  const farm = useFarmFromPid(pid)
  const ethPriceUSD = usePriceEthUsd()
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote).times(ethPriceUSD) : ZERO
}

export const usePriceAvtoUsd = (): BigNumber => {
  const pid = 23 // AVTO-MATIC LP
  const farm = useFarmFromPid(pid)
  const maticPriceUSD = usePriceMaticUsd()
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote).times(maticPriceUSD) : ZERO
}

export const usePricePnautUsd = (): BigNumber => {
  const pid = 24 // pNAUT-MATIC LP
  const farm = useFarmFromPid(pid)
  const maticPriceUSD = usePriceMaticUsd()
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote).times(maticPriceUSD) : ZERO
}

export const useGetApiPrices = () => {
  const prices: PriceState['data'] = useSelector((state: State) => state.prices.data)
  const maticPriceUSD = usePriceMaticUsd()
  const wingsPriceUSD = usePriceWingsUsd()
  const wethPriceUSD = usePriceEthUsd()
  const pforcePriceUSD = usePricePforceUsd()
  const pswampPriceUSD = usePricePswampUsd()
  const daiPriceUSD = usePriceDaiUsd()
  const piratepPriceUSD = usePricePiratepUsd()
  const timePriceUSD = usePriceTimeUsd()
  const avtoPriceUSD = usePriceAvtoUsd()
  const pnautPriceUSD = usePricePnautUsd()

  return {
    usdt: new BigNumber(1),
    usdc: new BigNumber(1),
    wmatic: maticPriceUSD,
    pwings: wingsPriceUSD,
    weth: wethPriceUSD,
    pforce: pforcePriceUSD,
    pswamp: pswampPriceUSD,
    dai: daiPriceUSD,
    honor: new BigNumber(prices ? prices.honor : 0).times(maticPriceUSD),
    crystl: new BigNumber(prices ? prices.crystl : 0).times(maticPriceUSD),
    piratep: piratepPriceUSD,
    time: timePriceUSD,
    pear: new BigNumber(prices ? prices.pear : 0).times(maticPriceUSD),
    alpha: new BigNumber(prices ? prices.alpha : 0).times(maticPriceUSD),
    avto: avtoPriceUSD,
    collar: new BigNumber(prices ? prices.collar : 0).times(maticPriceUSD),
    pnaut: pnautPriceUSD,
    
  }
}
