import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { ethers } from 'ethers'
import { useDispatch } from 'react-redux'
import { updateUserAllowance, fetchFarmUserDataAsync, fetchVaultUserDataAsync } from 'state/actions'
import { approve, approveVault } from 'utils/callHelpers'
import { useMasterchef, useJetswapVault, useWings, useSousChef, useLottery } from './useContract'

// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, account)
      dispatch(fetchFarmUserDataAsync(account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, masterChefContract])

  return { onApprove: handleApprove }
}

// Approve a Vault
export const useApproveVault = (lpContract: Contract, vaultAddress: string) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const jetswapVaultContract = useJetswapVault(vaultAddress)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approveVault(lpContract, jetswapVaultContract, account)
      dispatch(fetchVaultUserDataAsync(account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, jetswapVaultContract])

  return { onApprove: handleApprove }
}

// Approve a Pool
export const useSousApprove = (lpContract: Contract, sousId) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const sousChefContract = useSousChef(sousId)
  const masterChefContract = useMasterchef()

  const handleApprove = useCallback(async () => {
    try {
      let tx
      if ([0, 19 /* , 1, 2, 15 */].includes(sousId)) {
        tx = await approve(lpContract, masterChefContract, account)
      } else {
        tx = await approve(lpContract, sousChefContract, account)
      }

      dispatch(updateUserAllowance(sousId, account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, sousChefContract, masterChefContract, sousId])

  return { onApprove: handleApprove }
}

// Approve the lottery
export const useLotteryApprove = () => {
  const { account } = useWeb3React()
  const wingsContract = useWings()
  const lotteryContract = useLottery()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(wingsContract, lotteryContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, wingsContract, lotteryContract])

  return { onApprove: handleApprove }
}

// Approve an IFO
export const useIfoApprove = (tokenContract: Contract, spenderAddress: string) => {
  const { account } = useWeb3React()
  const onApprove = useCallback(async () => {
    const tx = await tokenContract.methods.approve(spenderAddress, ethers.constants.MaxUint256).send({ from: account })
    return tx
  }, [account, spenderAddress, tokenContract])

  return onApprove
}
