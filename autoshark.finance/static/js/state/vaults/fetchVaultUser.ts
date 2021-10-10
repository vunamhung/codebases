import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import genericVaultABI from 'config/abi/genericVault.json'
import dashboardBSCABI from 'config/abi/dashboardBSC.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { VaultConfig } from 'config/constants/types'

export const fetchVaultUserAllowances = async (account: string, vaultsToFetch: VaultConfig[]) => {
  const calls = vaultsToFetch.map((vault) => {
    const lpContractAddress = getAddress(vault.singleStake ? vault.token.address : vault.lpAddresses)
    return { address: lpContractAddress, name: 'allowance', params: [account, vault.vaultAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchVaultUserTokenBalances = async (account: string, vaultsToFetch: VaultConfig[]) => {
  const calls = vaultsToFetch.map((vault) => {
    const lpContractAddress = getAddress(vault.singleStake ? vault.token.address : vault.lpAddresses)
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

export const fetchVaultUserStakedBalances = async (account: string, vaultsToFetch: VaultConfig[]) => {
  const calls = vaultsToFetch.map((vault) => {
    return {
      address: vault.vaultAddress,
      name: 'principalOf',
      params: [account],
    }
  })

  const rawStakedBalances = await multicall(genericVaultABI, calls)

  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })

  return parsedStakedBalances
}

export const fetchVaultUserEarnings = async (account: string, vaultsToFetch: VaultConfig[]) => {
  const calls = vaultsToFetch.map((vault) => {
    return {
      address: vault.dashboard,
      name: 'infoOfPool',
      params: [vault.vaultAddress, account],
    }
  })

  const rawInfo = await multicall(dashboardBSCABI, calls)

  const parsedEarnings = rawInfo.map((earnings) => {
    return {
      base: new BigNumber(earnings?.[0]?.pBASE?._hex).toJSON(),
      jaws: new BigNumber(earnings?.[0]?.pJAWS?._hex).toJSON(),
    }
  })

  return parsedEarnings
}

export const fetchVaultUserNftSlots = async (account: string, vaultsToFetch: VaultConfig[]) => {
  const calls = vaultsToFetch.map((vault) => {
    return {
      address: vault.vaultAddress,
      name: 'getSlots',
      params: [account],
    }
  })
  const rawInfo = await multicall(genericVaultABI, calls)

  return rawInfo
}

export const fetchVaultUserNftTokenIds = async (account: string, vaultsToFetch: VaultConfig[]) => {
  const calls = vaultsToFetch.map((vault) => {
    return {
      address: vault.vaultAddress,
      name: 'getTokenIds',
      params: [account],
    }
  })

  const rawInfo = await multicall(genericVaultABI, calls)

  const parsedTokens = rawInfo.map((tokens) => {
    return tokens.map((item) => new BigNumber(item._hex).toJSON())
  })

  return parsedTokens
}

export const fetchVaultUserBoost = async (account: string, vaultsToFetch: VaultConfig[]) => {
  const calls = vaultsToFetch.map((vault) => {
    return {
      address: vault.vaultAddress,
      name: 'getBoost',
      params: [account],
    }
  })

  const rawInfo = await multicall(genericVaultABI, calls)

  const parsedEarnings = rawInfo.map((earnings) => {
    return new BigNumber(earnings?.[0]._hex).toJSON()
  })

  return parsedEarnings
}
