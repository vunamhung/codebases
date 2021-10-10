import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import useRefresh from 'hooks/useRefresh'
import { FINS_MASTER_CHEF } from 'config/constants/vaults'
import { useFarmFromPidAndChef } from 'state/farms/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { fetchVaultsPublicDataAsync, fetchVaultUserDataAsync } from '.'
import { State, VaultsState, Vault } from '../types'

export const usePollVaultsData = (includeArchive = false) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    dispatch(fetchVaultsPublicDataAsync([]))

    if (account) {
      dispatch(fetchVaultUserDataAsync({ account, addresses: [] }))
    }
  }, [includeArchive, dispatch, slowRefresh, account])
}

/**
 * Fetches the "core" Vault data used globally
 * 251 = JAWS-BNB LP
 * 252 = BUSD-BNB LP
 */
export const usePollCoreVaultData = () => {
  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    dispatch(
      fetchVaultsPublicDataAsync([
        '0xb3d84a9365B0C2cf6B0b17e16ecA6B1B6ca8f9d6',
        '0x4A88DC9955aB00aD3Ac0dD96317072aB32Ab88B4',
        '0xD50f3900B047f38eB6eBc946142A3C652BCc4240',
      ]),
    )
  }, [dispatch, fastRefresh])
}

export const useVaults = (): VaultsState => {
  const vaults = useSelector((state: State) => state.vaults)
  return vaults
}

export const useVaultFromAddress = (address: string): Vault => {
  const vault = useSelector((state: State) => state.vaults.data.find((f) => f.vaultAddress === address))
  return vault
}

export const useVaultFromLpSymbol = (lpSymbol: string): Vault => {
  const farm = useSelector((state: State) => state.vaults.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useVaultFromTokenSymbol = (symbol: string): Vault => {
  const farm = useSelector((state: State) => state.vaults.data.find((f) => f.token.symbol === symbol))
  return farm
}

export const useVaultUser = (address: string) => {
  const vault = useVaultFromAddress(address)

  return {
    allowance: vault?.userData ? new BigNumber(vault.userData.allowance) : BIG_ZERO,
    tokenBalance: vault?.userData ? new BigNumber(vault.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: vault?.userData ? new BigNumber(vault.userData.stakedBalance) : BIG_ZERO,
    baseEarnings: vault?.userData ? new BigNumber(vault.userData.baseEarnings) : BIG_ZERO,
    jawsEarnings: vault?.userData ? new BigNumber(vault.userData.jawsEarnings) : BIG_ZERO,
  }
}

// Return the base token price for a farm, from a given pid
export const useBusdPriceFromVault = (address: string): BigNumber => {
  const vault = useVaultFromAddress(address)
  return vault && new BigNumber(vault.token.busdPrice)
}

export const useLpTokenPrice = (symbol: string) => {
  const vault = useVaultFromLpSymbol(symbol)
  const farmTokenPriceInUsd = useBusdPriceFromVault(vault?.vaultAddress)
  let lpTokenPrice = BIG_ZERO

  if (vault?.lpTotalSupply && vault?.lpTotalInQuoteToken) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(vault.tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(new BigNumber(vault.lpTotalSupply))
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
  }

  return lpTokenPrice
}

// export const useLpTokenPriceFromVault = (symbol: string) => {
//   const vault = useVaultFromLpSymbol(symbol)
//   const farm = useFarmFromLpSymbol(symbol)
//   const farmTokenPriceInUsd = useBusdPriceFromVault(vault?.vaultAddress)
//   let lpTokenPrice = BIG_ZERO

//   if (farm?.lpTotalSupply && farm?.lpTotalInQuoteToken) {
//     // Total value of base token in LP
//     const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmountTotal)
//     // Double it to get overall value in LP
//     const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
//     // Divide total value of all tokens, by the number of LP tokens
//     const totalLpTokens = getBalanceAmount(new BigNumber(farm.lpTotalSupply))
//     lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
//   }

//   return lpTokenPrice
// }

export const useTokenPrice = (symbol: string) => {
  const vault = useVaultFromTokenSymbol(symbol)
  return vault?.token?.busdPrice
}

// /!\ Deprecated , use the BUSD hook in /hooks

export const usePriceBnbBusd = (): BigNumber => {
  const bnbBUSDFarm = useVaultFromAddress('0x8f463Ffcf6A4fdCca7A201D2c426a81224d1D00e')
  return new BigNumber(bnbBUSDFarm.token.busdPrice)
}

export const usePriceCakeBusd = (): BigNumber => {
  // const cakeBnbFarm = useFarmFromPid(251)
  // return new BigNumber(cakeBnbFarm.token.busdPrice)
  return new BigNumber(0)
}

export const usePriceJawsBusd = (): BigNumber => {
  const jawsBnbFarm = useVaultFromAddress('0xb3d84a9365B0C2cf6B0b17e16ecA6B1B6ca8f9d6')
  return new BigNumber(jawsBnbFarm.token.busdPrice)
  // return new BigNumber(0)
}

export const usePriceFinsBusd = (): BigNumber => {
  const jawsBnbFarm = useFarmFromPidAndChef(1, FINS_MASTER_CHEF)
  return new BigNumber(jawsBnbFarm.token.busdPrice)
  // return new BigNumber(0)
}
