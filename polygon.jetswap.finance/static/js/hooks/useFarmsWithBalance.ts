import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import masterChefABI from 'config/abi/masterchef.json'
import { farmsConfig } from 'config/constants'
import useRefresh from './useRefresh'

export interface FarmWithBalance {
  pid: number
  balance: BigNumber
}

const useFarmsWithBalance = () => {
  const [farmsWithBalances, setFarmsWithBalances] = useState<FarmWithBalance[]>([])
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalances = async () => {
      const farmPids = farmsConfig.map((farm) => farm.pid)
      const allPids = [...farmPids, 0, 19 /* , 1, 2, 15 */]
      const calls = allPids.map((pid) => ({
        address: getMasterChefAddress(),
        name: 'pendingCake',
        params: [pid, account],
      }))

      const rawResults = await multicall(masterChefABI, calls)
      const results = allPids.map((pid, index) => ({ pid, balance: new BigNumber(rawResults[index]) }))

      setFarmsWithBalances(results)
    }

    if (account) {
      fetchBalances()
    }
  }, [account, fastRefresh])

  return farmsWithBalances
}

export default useFarmsWithBalance
