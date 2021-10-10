import { AbiItem } from 'web3-utils'
import poolsConfig from 'config/constants/pools'
import masterChefABI from 'config/abi/masterchef.json'
import sousChefABI from 'config/abi/sousChef.json'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { getWeb3NoAccount } from 'utils/web3'
import BigNumber from 'bignumber.js'

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// MATIC pools use the native MATIC token (wrapping ? unwrapping is done at the contract level)

const masterPools = poolsConfig.filter((p) => [0, 19 /* , 1, 2, 15 */].includes(p.sousId))
const sousPools = poolsConfig.filter((p) => ![0, 19 /* , 1, 2, 15 */].includes(p.sousId))

const web3 = getWeb3NoAccount()
const masterChefContract = new web3.eth.Contract((masterChefABI as unknown) as AbiItem, getMasterChefAddress())

export const fetchPoolsAllowance = async (account) => {
  const calls = poolsConfig.map((p) => ({
    address: getAddress(p.stakingToken.address),
    name: 'allowance',
    params: [account, getAddress(p.contractAddress)],
  }))

  const allowances = await multicall(erc20ABI, calls)
  return poolsConfig.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(allowances[index]).toJSON() }),
    {},
  )
}

export const fetchUserBalances = async (account) => {
  const calls = poolsConfig.map((p) => ({
    address: getAddress(p.stakingToken.address),
    name: 'balanceOf',
    params: [account],
  }))
  const tokenBalancesRaw = await multicall(erc20ABI, calls)
  const tokenBalances = poolsConfig.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(tokenBalancesRaw[index]).toJSON() }),
    {},
  )

  return tokenBalances
}

export const fetchUserStakeBalances = async (account) => {
  const masterCalls = masterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'userInfo',
    params: [p.sousId, account],
  }))
  const masterUserInfo = await multicall(masterChefABI, masterCalls)
  const masterStakedBalances = masterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(masterUserInfo[index].amount._hex).toJSON(),
    }),
    {},
  )

  const sousCalls = sousPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'userInfo',
    params: [account],
  }))
  const sousUserInfo = await multicall(sousChefABI, sousCalls)
  const sousStakedBalances = sousPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(sousUserInfo[index].amount._hex).toJSON(),
    }),
    {},
  )

  return { ...masterStakedBalances, ...sousStakedBalances }
}

export const fetchUserPendingRewards = async (account) => {
  const masterCalls = masterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'pendingCake',
    params: [p.sousId, account],
  }))
  const masterRes = await multicall(masterChefABI, masterCalls)
  const masterPendingRewards = masterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(masterRes[index]).toJSON(),
    }),
    {},
  )

  const sousCalls = sousPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'pendingReward',
    params: [account],
  }))
  const sousRes = await multicall(sousChefABI, sousCalls)
  const sousPendingRewards = sousPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(sousRes[index]).toJSON(),
    }),
    {},
  )

  return { ...masterPendingRewards, ...sousPendingRewards }
}
