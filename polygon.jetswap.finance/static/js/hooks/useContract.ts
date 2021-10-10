import { useMemo } from 'react'
import useWeb3 from 'hooks/useWeb3'
import {
  getBep20Contract,
  getWingsContract,
  getBunnyFactoryContract,
  getBunnySpecialContract,
  getPancakeRabbitContract,
  getProfileContract,
  getIfoContract,
  getLotteryContract,
  getLotteryTicketContract,
  getMasterchefContract,
  getJetswapStrategyContract,
  getJetswapVaultContract,
  getPointCenterIfoContract,
  getSouschefContract,
  getClaimRefundContract,
} from 'utils/contractHelpers'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoContract = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getIfoContract(address, web3), [address, web3])
}

export const useERC20 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getBep20Contract(address, web3), [address, web3])
}

export const useWings = () => {
  const web3 = useWeb3()
  return useMemo(() => getWingsContract(web3), [web3])
}

export const useBunnyFactory = () => {
  const web3 = useWeb3()
  return useMemo(() => getBunnyFactoryContract(web3), [web3])
}

export const usePancakeRabbits = () => {
  const web3 = useWeb3()
  return useMemo(() => getPancakeRabbitContract(web3), [web3])
}

export const useProfile = () => {
  const web3 = useWeb3()
  return useMemo(() => getProfileContract(web3), [web3])
}

export const useLottery = () => {
  const web3 = useWeb3()
  return useMemo(() => getLotteryContract(web3), [web3])
}

export const useLotteryTicket = () => {
  const web3 = useWeb3()
  return useMemo(() => getLotteryTicketContract(web3), [web3])
}

export const useMasterchef = () => {
  const web3 = useWeb3()
  return useMemo(() => getMasterchefContract(web3), [web3])
}

export const useJetswapStrategy = (strategyAddress: string) => {
  const web3 = useWeb3()
  return useMemo(() => getJetswapStrategyContract(web3, strategyAddress), [web3, strategyAddress])
}

export const useJetswapVault = (vaultAddress: string) => {
  const web3 = useWeb3()
  return useMemo(() => getJetswapVaultContract(web3, vaultAddress), [web3, vaultAddress])
}

export const useSousChef = (id) => {
  const web3 = useWeb3()
  return useMemo(() => getSouschefContract(id, web3), [id, web3])
}

export const usePointCenterIfoContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getPointCenterIfoContract(web3), [web3])
}

export const useBunnySpecialContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getBunnySpecialContract(web3), [web3])
}

export const useClaimRefundContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getClaimRefundContract(web3), [web3])
}
