import BigNumber from 'bignumber.js'
import sharkNFTABI from 'config/abi/sharkNFT.json'
import masterchefABI from 'config/abi/masterchef.json'
import marketplaceABI from 'config/abi/nftMarketplace.json'
import multicall from 'utils/multicall'
import {
  getAddress,
  // getNFTHammer1Address,
  getNFTMarketplaceAddress,
  // getNFTSeries1Address,
  getOceanMasterChefAddress,
} from 'utils/addressHelpers'
import { FarmConfig, NFTConfig } from 'config/constants/types'
import { Auction } from 'state/types'
import moment, { Moment } from 'moment-timezone'

// interface Meta {
//   description: string
//   id: string
//   image: string
//   name: string
//   rarity: number
//   tier: number
// }

function getSeriesId(series: number) {
  if (series === 1) return '1'
  return 'hammer'
}

// function getSeriesIdFromAddress(address: string) {
//   if (address === getNFTSeries1Address()) {
//     return '1'
//   }
//   if (address === getNFTHammer1Address()) {
//     return 'hammer'
//   }
//   return '1'
// }

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

// export const fetchAuctionsLength = async (
//   sortBy?: string,
//   _active?: boolean,
//   _sold?: boolean,
//   _ended?: boolean,
//   owner?: string,
// ) => {
//   const order = sortBy ?? 'id'
//   const active = _active ?? true
//   const sold = _sold ?? false
//   const ended = _ended ?? false

//   try {
//     const results = await fetch(
//       // `https://auto-shark.uc.r.appspot.com/api/auction?sortby=${order}&isSold=${sold}`,
//       `https://api.autoshark.finance/api/nft/count?order=${order}&active=${active}&sold=${sold}&ended=${ended}&owner=${owner}`,
//     )
//     const count = await results.json()
//     return count
//   } catch (e) {
//     console.log(e)
//     return 0
//   }
// }

export const fetchAuctions = async (
  sortBy?: string,
  _active?: boolean,
  _sold?: boolean,
  _ended?: boolean,
  owner?: string,
  _time?: Moment,
  _rarities?: string[],
  auctionTypes?: null | number,
  myBids?: boolean,
  myAuctions?: boolean,
  series?: null | string,
) => {
  const limit = 20
  const sold = _sold ?? false
  const time = _time.unix()
  const active = _active ? _time : 0
  // const ended = _ended ? now : 2147483647

  const url = () => {
    let _url = null
    if (!myBids && !myAuctions) {
      _url = `https://auto-shark.uc.r.appspot.com/api/auction?orderby=endTime&startAfter=${time}&limit=${limit}&isSold=${sold}`
      _url = active
        ? (_url += `&endsAfter=${moment().unix()}`)
        : (_url += `&endsBefore=${moment().unix()}&direction=desc`)
      _url = _rarities.length > 0 ? (_url += `&rarity=${_rarities.sort().join(',')}`) : _url
      _url = [0, 1].includes(auctionTypes) ? (_url += `&auctionType=${auctionTypes}`) : _url
      _url = owner ? (_url += `&owner=${owner}`) : _url
      _url = series ? (_url += `&nftToken=${series}`) : _url
    } else if (myAuctions) {
      _url = `https://auto-shark.uc.r.appspot.com/api/auction?orderby=endTime&limit=${limit}&owner=${owner}&direction=desc`
    } else {
      _url = `https://auto-shark.uc.r.appspot.com/api/userbidsinfo/${owner}?orderby=endTime&startAfter=${time}&limit=${limit}&isSold=${sold}`
    }
    return _url
  }

  try {
    const results = await fetch(url())
    const auctions = await results.json()
    const data = myBids ? auctions.bids : auctions
    return data?.map((item) => {
      const auction = myBids ? item.auctionData : item
      return {
        auctionId: auction.auctionId,
        auctionType: auction.auctionType,
        endTime: auction.endTime,
        finalHighestBid: auction.finalHighestBid,
        highestBid: auction.highestBid,
        highestBidder: auction.highestBidder,
        isSettled: auction.isSettled,
        isSold: auction.isSold,
        lastPrice: auction.lastPrice,
        lastToken: auction.lastToken,
        minIncrement: auction.minIncrement,
        nftToken: auction.nftToken,
        nftTokenId: auction.nftTokenId,
        owner: auction.owner,
        reservePrice: auction.reservePrice,
        targetPrice: auction.targetPrice,
        token: auction.token,

        // nft data
        itemName: auction.nftData.name,
        image: auction.nftData.image,
        rarity: auction.nftData.rarity,
        tier: auction.nftData.tier,
      }
    })
  } catch (e) {
    console.log(e)
    return []
  }
}

export const fetchAuctionsMeta = async (auctions: Auction[], account: string) => {
  const marketplaceAddress = getNFTMarketplaceAddress()
  const calls = auctions.map((auction) => ({
    address: marketplaceAddress,
    name: 'bidBalance',
    params: [auction.auctionId, auction.highestBidder],
  }))

  const myCalls = auctions.map((auction) => ({
    address: marketplaceAddress,
    name: 'bidBalance',
    params: [auction.auctionId, account],
  }))
  const auctionsBidData = await multicall(marketplaceABI, calls)
  const myAuctionsBidData = await multicall(marketplaceABI, myCalls)

  // const promises = auctions.map((item) => {
  //   return fetch(`https://api.autoshark.finance/api/nft/${getSeriesIdFromAddress(item.nftToken)}/${item.nftTokenId}`)
  // })

  // const results = await Promise.all(promises)
  // const json = await Promise.all<Meta>(results.map((item) => item.json()))

  return auctions.map((item, index) => {
    return {
      ...auctions[index],
      highestBid: new BigNumber(auctionsBidData?.[index]?.[0]._hex).toJSON(),
      myBidBalance: new BigNumber(myAuctionsBidData?.[index]?.[0]._hex).toJSON(),
    }
  })
}
