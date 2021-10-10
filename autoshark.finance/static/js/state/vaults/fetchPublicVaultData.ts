import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import genericVault from 'config/abi/genericVault.json'
import masterchefABI from 'config/abi/cakeMasterchef.json'
import dashboardABI from 'config/abi/dashboardBSC.json'
import pantherMasterChefABI from 'config/abi/pantherMasterchef.json'
import novaMasterChefABI from 'config/abi/novaMasterchef.json'
import { getAddress, getNullAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import multicall from 'utils/multicall'
import { Vault, SerializedBigNumber } from '../types'
import { MintRates } from './fetchVaultMint'

type PublicVaultData = {
  tokenAmountMc: SerializedBigNumber
  quoteTokenAmountMc: SerializedBigNumber
  tokenAmountTotal: SerializedBigNumber
  quoteTokenAmountTotal: SerializedBigNumber
  lpTotalInQuoteToken: SerializedBigNumber
  lpTotalSupply: SerializedBigNumber
  tokenPriceVsQuote: SerializedBigNumber
  vaultBalance: SerializedBigNumber
  canMint: boolean
  rewardsToken: string
  poolWeight: SerializedBigNumber
  multiplier: string
  depositFeeBP: string
  nativeTokenPerBlock: SerializedBigNumber
  singleStakeBalance: SerializedBigNumber
  jawsPerBNB: SerializedBigNumber
  performanceFees: SerializedBigNumber
  tvlOfPool: SerializedBigNumber
  baseBoostRate: SerializedBigNumber
}

function getABI(vault: Vault, tempMasterChef: any) {
  if (vault.swap === 'panther') {
    return pantherMasterChefABI
  }
  if (vault.swap === 'nova') {
    return novaMasterChefABI
  }
  return tempMasterChef.map((item) => (item.name === 'cakePerBlock' ? { ...item, name: vault.masterChefOutput } : item))
}

const fetchVault = async (vault: Vault, mintRates: MintRates): Promise<PublicVaultData> => {
  const { pid, lpAddresses, token, quoteToken } = vault
  const lpAddress = getAddress(lpAddresses)
  const calls = [
    // Balance of token in the LP contract
    {
      address: getAddress(token.address),
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      address: getAddress(quoteToken.address),
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of LP tokens in the master chef contract
    {
      address: lpAddress,
      name: 'balanceOf',
      params: [vault.proxyChef ? vault.proxyChef : vault.masterChef],
    },
    // Total supply of LP tokens
    {
      address: lpAddress,
      name: 'totalSupply',
    },
    // Token decimals
    {
      address: getAddress(token.address),
      name: 'decimals',
    },
    // Quote token decimals
    {
      address: getAddress(quoteToken.address),
      name: 'decimals',
    },
    // balance of staked tokens that are staked in MC
    {
      address: getAddress(token.address),
      name: 'balanceOf',
      params: [vault.masterChef],
    },
  ]

  const vaultCalls = [
    // Total balance staked in vault
    {
      address: vault.vaultAddress,
      name: 'balance',
    },
    // Check whether vault has minter
    {
      address: vault.vaultAddress,
      name: 'minter',
    },
    // The rewards token that the vault emits
    {
      address: vault.vaultAddress,
      name: 'rewardsToken',
    },
    // The rewards token that the vault emits
    {
      address: vault.vaultAddress,
      name: 'baseBoostRate',
    },
  ]

  const dashboardCalls = [
    {
      address: vault.dashboard,
      name: 'tvlOfPool',
      params: [vault.vaultAddress],
    },
  ]

  const [
    tokenBalanceLP,
    quoteTokenBalanceLP,
    lpTokenBalanceMC,
    lpTotalSupply,
    tokenDecimals,
    quoteTokenDecimals,
    singleStakeBalance,
  ] = await multicall(erc20, calls)

  const [vaultBalance, minter, rewardsToken, baseBoostRate] = await multicall(genericVault, vaultCalls)
  const [tvlOfPool] = await multicall(dashboardABI, dashboardCalls)
  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

  // Raw amount of token in the LP, including those not staked
  const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals))
  const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals))

  // Amount of token in the LP that are staked in the MC (i.e amount of token * lp ratio)
  const tokenAmountMc = tokenAmountTotal.times(lpTokenRatio)
  const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)

  // Total staked in LP, in quote token value
  const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2))

  const tempMasterChef = [...masterchefABI]

  // Only make masterchef calls if farm has pid
  const [info, totalAllocPoint, nativeTokenPerBlock] =
    pid || pid === 0
      ? await multicall(getABI(vault, tempMasterChef), [
          {
            address: vault.masterChef,
            name: 'poolInfo',
            params: [pid],
          },
          {
            address: vault.masterChef,
            name: 'totalAllocPoint',
          },
          {
            address: vault.masterChef,
            name: vault.masterChefOutput,
          },
        ])
      : [null, null]

  const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
  const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO
  const depositFeeBP = info ? new BigNumber(info.depositFeeBP?._hex) : BIG_ZERO
  const [jawsPerBNB, performanceFees] = mintRates
  return {
    tokenAmountMc: tokenAmountMc.toJSON(),
    quoteTokenAmountMc: quoteTokenAmountMc.toJSON(),
    tokenAmountTotal: tokenAmountTotal.toJSON(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toJSON(),
    lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
    tokenPriceVsQuote: quoteTokenAmountTotal.div(tokenAmountTotal).toJSON(),
    vaultBalance: new BigNumber(vaultBalance).div(BIG_TEN.pow(18)).toJSON(),
    canMint: minter?.[0] !== getNullAddress(),
    rewardsToken: rewardsToken?.[0],
    poolWeight: poolWeight.toJSON(),
    multiplier: `${allocPoint.div(100).toString()}X`,
    depositFeeBP: depositFeeBP.div(100).toString(),
    nativeTokenPerBlock: new BigNumber(nativeTokenPerBlock)?.toJSON(),
    singleStakeBalance: new BigNumber(singleStakeBalance)?.toJSON(),
    jawsPerBNB,
    performanceFees,
    tvlOfPool: new BigNumber(tvlOfPool)?.div(BIG_TEN.pow(18)).toJSON(),
    baseBoostRate: new BigNumber(baseBoostRate)?.toJSON(),
  }
}

export default fetchVault
