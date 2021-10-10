import BigNumber from 'bignumber.js'
import sharkNFTABI from 'config/abi/sharkNFT.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { getAddress, getOceanMasterChefAddress } from 'utils/addressHelpers'
import { FarmConfig, NFTConfig } from 'config/constants/types'
import _ from 'lodash'

function getSeriesId(series: number) {
  if (series === 1) return '1'
  return 'hammer'
}

export const fetchBalanceOfCollection = async (account: string, nftsToFetch: NFTConfig[]) => {
  const calls = nftsToFetch.map((nft) => {
    return {
      address: nft.address,
      name: 'balanceOf',
      params: [account],
    }
  })

  const balanceOf = await multicall(sharkNFTABI, calls)
  const deepArray = balanceOf.map((numberOf, index) => {
    return { series: nftsToFetch[index].series, value: new BigNumber(numberOf).toNumber() }
  })

  return deepArray
}

export const fetchTokenIds = async (
  account: string,
  nftsToFetch: NFTConfig[],
  collectionBalances: { series: number; value: number }[],
) => {
  const calls = collectionBalances.map((item, index) => {
    const newCalls = []
    const numberOwned = new BigNumber(item.value).toNumber()
    for (let i = 0; i < numberOwned; i++) {
      const data = {
        address: nftsToFetch[index].address,
        name: 'tokenOfOwnerByIndex',
        params: [account, i],
      }
      newCalls.push(data)
    }
    return newCalls
  })

  const promises = calls.map((item) => multicall(sharkNFTABI, item))

  const results = await Promise.all(promises)

  return results.map((item, index) => {
    return {
      series: collectionBalances[index].series,
      value: item?.map((each) => new BigNumber(each).toNumber()),
    }
  })
}

export const fetchNFTUserInventory = async (tokenIds: { series: number; value: number[] }[]) => {
  const promises = tokenIds.map((item) =>
    fetch(`https://api.autoshark.finance/api/nft/${getSeriesId(item.series)}?tokenId=${item.value.join(',')}`),
  )

  const results = await Promise.all(promises)
  const json = await Promise.all(results.map((item) => item.json()))

  const finalResults = json.map((item, index) => {
    return {
      series: tokenIds[index].series,
      value: item,
    }
  })
  return finalResults
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

  const rawTokenBalances = await multicall(sharkNFTABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const masterChefAddress = getOceanMasterChefAddress()

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
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
  const masterChefAddress = getOceanMasterChefAddress()

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      name: 'pendingJaws',
      params: [farm.pid, account],
    }
  })

  const rawEarnings = await multicall(masterchefABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}
