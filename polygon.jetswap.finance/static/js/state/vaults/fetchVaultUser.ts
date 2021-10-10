import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import jetswapVaultABI from 'config/abi/jetswapVault.json'
import multicall from 'utils/multicall'
import vaultsConfig from 'config/constants/vaults'
import { getAddress } from 'utils/addressHelpers'

export const fetchVaultUserAllowances = async (account: string) => {
  const calls = vaultsConfig.map((vault) => {
    const lpContractAddress = vault.isSingle ? getAddress(vault.token.address) : getAddress(vault.lpAddresses)
    const vaultAddress = getAddress(vault.vaultAddresses)
    return { address: lpContractAddress, name: 'allowance', params: [account, vaultAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchVaultUserTokenBalances = async (account: string, web3?: Web3) => {
  const calls = vaultsConfig.map((vault) => {
    const lpContractAddress = vault.isSingle ? getAddress(vault.token.address) : getAddress(vault.lpAddresses)
    return {
      address: lpContractAddress,
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

export const fetchVaultUserStakedBalances = async (account: string) => {
  const call1 = vaultsConfig.map((vault) => {
    const vaultAddress = getAddress(vault.vaultAddresses)
    return {
      address: vaultAddress,
      name: 'balanceOf',
      params: [account],
    }
  })
  const shareBalances = await multicall(erc20ABI, call1)

  const call2 = vaultsConfig.map((vault) => {
    const vaultAddress = getAddress(vault.vaultAddresses)
    return {
      address: vaultAddress,
      name: 'getPricePerFullShare',
    }
  })
  const pricePerFullShares = await multicall(jetswapVaultABI, call2)

  const depositBalances = shareBalances.map((balance, idx) => {
    return new BigNumber(balance[0]._hex)
      .times(pricePerFullShares[idx][0]._hex)
      .div(new BigNumber(10).pow(18))
      .toString()
  })
  return depositBalances
}

export const fetchVaultUserEarnings = async (account: string) => {
  const call1 = vaultsConfig.map((vault) => {
    const vaultAddress = getAddress(vault.vaultAddresses)
    return {
      address: vaultAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const shareBalances = await multicall(erc20ABI, call1)

  const call2 = vaultsConfig.map((vault) => {
    const vaultAddress = getAddress(vault.vaultAddresses)
    return {
      address: vaultAddress,
      name: 'getPricePerFullShare',
    }
  })

  const pricePerFullShares = await multicall(jetswapVaultABI, call2)

  const depositBalances = shareBalances.map((balance, idx) => {
    return new BigNumber(balance[0]._hex)
      .times(pricePerFullShares[idx][0]._hex)
      .div(new BigNumber(10).pow(18))
      .toString()
  })

  return depositBalances
}
