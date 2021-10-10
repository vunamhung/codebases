import poolsConfig from 'config/constants/pools'
import masterChefABI from 'config/abi/masterchef.json'
import sousChefABI from 'config/abi/sousChef.json'
import wingsABI from 'config/abi/wings.json'
import wbnbABI from 'config/abi/weth.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress, getWmaticAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import { PWINGS_PER_BLOCK } from 'config'

export const fetchPoolsBlockLimits = async () => {
  const poolsWithEnd = poolsConfig.filter((p) => ![0, 19 /* , 1, 2, 15 */].includes(p.sousId))
  const callsStartBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'startBlock',
    }
  })
  const callsEndBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'bonusEndBlock',
    }
  })

  const starts = await multicall(sousChefABI, callsStartBlock)
  const ends = await multicall(sousChefABI, callsEndBlock)
  return poolsWithEnd.map((wingsPoolConfig, index) => {
    const startBlock = starts[index]
    const endBlock = ends[index]
    return {
      sousId: wingsPoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: new BigNumber(endBlock).toJSON(),
    }
  })
}

export const fetchPoolsTotalStaking = async () => {
  console.log('started fetchPoolsTotalStaking')
  const nonMaticPools = poolsConfig.filter((p) => p.stakingToken.symbol !== 'MATIC')
  const maticPool = poolsConfig.filter((p) => p.stakingToken.symbol === 'MATIC')

  const callsNonBnbPools = nonMaticPools.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.stakingToken.address),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  const callsBnbPools = maticPool.map((poolConfig) => {
    return {
      address: getWmaticAddress(),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  const nonBnbPoolsTotalStaked = await multicall(wingsABI, callsNonBnbPools)
  const bnbPoolsTotalStaked = await multicall(wbnbABI, callsBnbPools)
  const poolsWithAllocPoint = await Promise.all(
    nonMaticPools.map(async (pool) => {
      if (![0, 19 /* , 1, 2, 15 */].includes(pool.sousId)) {
        return pool
      }
      const [info, totalAllocPoint] = await multicall(masterChefABI, [
        {
          address: getMasterChefAddress(),
          name: 'poolInfo',
          params: [pool.sousId],
        },
        {
          address: getMasterChefAddress(),
          name: 'totalAllocPoint',
        },
      ])

      const allocPoint = new BigNumber(info.allocPoint._hex)
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))

      return {
        ...pool,
        tokenPerBlock: PWINGS_PER_BLOCK.times(poolWeight).toJSON(),
      }
    }),
  )

  return [
    ...poolsWithAllocPoint.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(nonBnbPoolsTotalStaked[index]).toJSON(),
      tokenPerBlock: p.tokenPerBlock,
    })),
    ...maticPool.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(bnbPoolsTotalStaked[index]).toJSON(),
    })),
  ]
}
