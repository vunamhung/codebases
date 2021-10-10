import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import {
  fetchFarmUserDataAsync,
  fetchVaultUserDataAsync,
  updateUserBalance,
  updateUserPendingReward,
} from 'state/actions'
import { soushHarvest, soushHarvestBnb, harvest, harvestVault } from 'utils/callHelpers'
import { useMasterchef, useSousChef, useJetswapStrategy } from './useContract'

export const useHarvest = (farmPid: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    const txHash = await harvest(masterChefContract, farmPid, account)
    dispatch(fetchFarmUserDataAsync(account))
    return txHash
  }, [account, dispatch, farmPid, masterChefContract])

  return { onReward: handleHarvest }
}

export const useAllHarvest = (farmPids: number[]) => {
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    const harvestPromises = farmPids.reduce((accum, pid) => {
      return [...accum, harvest(masterChefContract, pid, account)]
    }, [])

    return Promise.all(harvestPromises)
  }, [account, farmPids, masterChefContract])

  return { onReward: handleHarvest }
}

export const useSousHarvest = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const sousChefContract = useSousChef(sousId)
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    if ([0, 19 /* , 1, 2, 15 */].includes(sousId)) {
      await harvest(masterChefContract, sousId, account)
    } else if (isUsingBnb) {
      await soushHarvestBnb(sousChefContract, account)
    } else {
      await soushHarvest(sousChefContract, account)
    }
    dispatch(updateUserPendingReward(sousId, account))
    dispatch(updateUserBalance(sousId, account))
  }, [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId])

  return { onReward: handleHarvest }
}

export const useVaultHarvest = (strategyAddress: string) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const jetswapStrategyContract = useJetswapStrategy(strategyAddress)

  const handleHarvest = useCallback(async () => {
    const txHash = await harvestVault(jetswapStrategyContract, account)
    dispatch(fetchVaultUserDataAsync(account))
    return txHash
  }, [account, dispatch, jetswapStrategyContract])

  return { onReward: handleHarvest }
}
