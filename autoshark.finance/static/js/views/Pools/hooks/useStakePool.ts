import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { updateUserStakedBalance, updateUserBalance } from 'state/actions'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { useMasterchef, useSousChef } from 'hooks/useContract'

const masterStake = async (sousChefContract, sousId, amount) => {
  const estimate = await sousChefContract.estimateGas.deposit(
    sousId,
    new BigNumber(amount).times(BIG_TEN.pow(18)).toString(),
  )
  const tx = await sousChefContract.deposit(sousId, new BigNumber(amount).times(BIG_TEN.pow(18)).toString(), {
    gasLimit: estimate.mul(2000).div(1000),
  })
  const receipt = await tx.wait()
  return receipt.status
}

const sousStake = async (sousChefContract, amount) => {
  const estimate = await sousChefContract.estimateGas.deposit(new BigNumber(amount).times(BIG_TEN.pow(18)).toString())
  const tx = await sousChefContract.deposit(new BigNumber(amount).times(BIG_TEN.pow(18)).toString(), {
    gasLimit: estimate.mul(2000).div(1000),
  })
  const receipt = await tx.wait()
  return receipt.status
}

const useStakePool = (sousId: number) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string) => {
      if (sousId === 0) {
        await masterStake(masterChefContract, sousId, amount)
      } else {
        await sousStake(sousChefContract, amount)
      }

      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, masterChefContract, sousChefContract, sousId],
  )

  return { onStake: handleStake }
}

export default useStakePool
