import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import masterchefNFTABI from 'config/abi/masterchefNFT.json'
import multicall from 'utils/multicall'
import { getAddress, getOceanMasterChefAddress } from 'utils/addressHelpers'
import { FarmConfig } from 'config/constants/types'

function getABI(farm: any, tempMasterChef: any) {
  if (farm.masterChef === getOceanMasterChefAddress()) {
    return masterchefABI
  }
  return tempMasterChef.map((item) => (item.name === 'pendingJaws' ? { ...item, name: farm.pendingOutput } : item))
}

export const fetchFarmUserAllowances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    return { address: lpContractAddress, name: 'allowance', params: [account, farm.masterChef] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
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

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    return {
      address: farm.masterChef,
      name: 'userInfo',
      params: [farm.pid, account],
    }
  })

  const rawStakedBalances = await multicall(masterchefABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: FarmConfig[]) => {
  const batches = farmsToFetch.reduce(
    (prev, curr) => ({ ...prev, [curr.masterChef]: prev[curr.masterChef] ? [...prev[curr.masterChef], curr] : [curr] }),
    {},
  )

  let results = []
  const keys = Object.keys(batches)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const batch = batches[key]

    const calls = batch.map((farm) => {
      return {
        address: farm.masterChef,
        name: farm.pendingOutput,
        params: [farm.pid, account],
      }
    })

    // eslint-disable-next-line no-await-in-loop
    const rawEarnings = await multicall(getABI(batch[0], masterchefABI), calls)
    const parsedEarnings = rawEarnings.map((earnings) => {
      return new BigNumber(earnings).toJSON()
    })
    results = [...results, ...parsedEarnings]
  }

  return results
}

export const fetchFarmUserNftSlots = async (account: string, farmsToFetch: FarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    return {
      address: farm.masterChef,
      name: 'getSlots',
      params: [account, farm.pid],
    }
  })

  const rawInfo = await multicall(masterchefNFTABI, calls)

  return rawInfo
}

export const fetchFarmUserNftTokenIds = async (account: string, farmsToFetch: FarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    return {
      address: farm.masterChef,
      name: 'getTokenIds',
      params: [account, farm.pid],
    }
  })

  const rawInfo = await multicall(masterchefNFTABI, calls)
  const parsedTokens = rawInfo.map((tokens) => {
    return tokens.map((item) => new BigNumber(item._hex).toJSON())
  })

  return parsedTokens
}

export const fetchFarmUserBoost = async (account: string, farmsToFetch: FarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    return {
      address: '0x8857Af8205F224870dea119e2c75AF386EFB192a',
      name: 'getBoost',
      params: [account, farm.pid],
    }
  })

  const rawInfo = await multicall(masterchefNFTABI, calls)
  
  const parsedEarnings = rawInfo.map((earnings) => {
    return new BigNumber(earnings?.[0]._hex).toJSON()
  })

  return parsedEarnings
}
