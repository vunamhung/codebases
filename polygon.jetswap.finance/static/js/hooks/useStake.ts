import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { getAddress } from 'utils/addressHelpers'
import {
  fetchFarmUserDataAsync,
  fetchVaultUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
} from 'state/actions'
import { stake, stakeVault, sousStake, sousStakeBnb } from 'utils/callHelpers'
import vaultsConfig from 'config/constants/vaults'
import { useMasterchef, useSousChef, useJetswapVault } from './useContract'

const useStake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if ([0, 19 /* , 1, 2, 15 */].includes(sousId)) {
        await stake(masterChefContract, sousId, amount, account, decimals)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account)
      } else {
        await sousStake(sousChefContract, amount, decimals, account)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId],
  )

  return { onStake: handleStake }
}

export const useStakeVault = (vaultAddress: string, tokenBalance: BigNumber) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const jetswapVaultContract = useJetswapVault(vaultAddress)
  const vaultInfo = vaultsConfig.find((v) => getAddress(v.vaultAddresses) === vaultAddress)

  const handleStakeVault = useCallback(
    async (amount: string) => {
      const txHash = await stakeVault(
        vaultInfo.lpSymbol === 'MATIC',
        jetswapVaultContract,
        amount,
        account,
        tokenBalance.isEqualTo(new BigNumber(amount).times(new BigNumber(10).pow(18))),
      )
      dispatch(fetchVaultUserDataAsync(account))
      return txHash
    },
    [account, vaultInfo, tokenBalance, dispatch, jetswapVaultContract],
  )

  return { onStake: handleStakeVault }
}

export default useStake
