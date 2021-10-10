import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR, FINS_PER_YEAR, JAWS_PER_YEAR } from 'config'
import lpAprs from 'config/constants/lpAprs.json'
import { Dividend, SerializedBigNumber, Vault } from 'state/types'

const SECONDS_PER_YEAR = 365 * 24 * 60 * 60
const BLOCKS_IN_A_YEAR = SECONDS_PER_YEAR / 14

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
  canMint: boolean,
  bnbPrice: BigNumber,
  jawsPerProfitBNB: BigNumber,
  jawsPrice: BigNumber,
  boostRate: number,
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)

  // const cakeRewardsApr = yearlyTokenRewardAllocation.times(nativePriceUsd).div(poolLiquidityUsd).times(100)
  const actualCakeRewardsApr = apr.times(canMint ? 70 : 100).div(100)
  const actualJawsRewardsApr = apr
    .times(canMint ? 30 * boostRate : 0)
    .div(100)
    .div(bnbPrice)
    .times(jawsPerProfitBNB)
    .times(jawsPrice)

  const finalAPR = actualCakeRewardsApr.plus(
    actualJawsRewardsApr.isNaN() || !actualJawsRewardsApr.isFinite() ? 0 : actualJawsRewardsApr,
  )
  return finalAPR.isNaN() || !finalAPR.isFinite() ? null : finalAPR.toNumber()
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param cakePriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getFarmApr = (
  poolWeight: BigNumber,
  cakePriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  farmAddress: string,
  isFins?: boolean,
): { cakeRewardsApr: number; lpRewardsApr: number } => {
  const yearlyCakeRewardAllocation = isFins ? FINS_PER_YEAR.times(poolWeight) : JAWS_PER_YEAR.times(poolWeight)
  const cakeRewardsApr = yearlyCakeRewardAllocation.times(cakePriceUsd).div(poolLiquidityUsd).times(100)
  let cakeRewardsAprAsNumber = null
  if (!cakeRewardsApr.isNaN() && cakeRewardsApr.isFinite()) {
    cakeRewardsAprAsNumber = cakeRewardsApr.toNumber()
  }
  const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0
  return { cakeRewardsApr: cakeRewardsAprAsNumber, lpRewardsApr }
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param cakePriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getVaultApr = (
  poolWeight: BigNumber,
  nativePriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  nativeTokenPerBlock: SerializedBigNumber,
  farmAddress: string,
  canMint: boolean,
  bnbPrice: BigNumber,
  jawsPerProfitBNB: BigNumber,
  jawsPrice: BigNumber,
  boostRate: number,
  singleMaximizer: boolean,
  lpMaximizer: boolean,
  farmTokenPrice: BigNumber,
  lpTokenPrice: BigNumber,
  vault: Vault,
  dividends: Dividend[],
): { cakeRewardsApr: number; lpRewardsApr: number } => {
  if (singleMaximizer && lpMaximizer) {
    const yearlyTokenRewardAllocation = new BigNumber(nativeTokenPerBlock)
      .div(new BigNumber('1000000000000000000'))
      .times(BLOCKS_PER_YEAR)
      .times(poolWeight)

    const cakeRewardsApr = yearlyTokenRewardAllocation.times(nativePriceUsd).div(poolLiquidityUsd).times(100)
    // const dailyAPY = aprToApy(cakeRewardsApr.toNumber(), 365)

    // let x = 0.5% (daily flip apr)
    // let y = 0.87% (daily fins apr)
    // sum of yield of the year = x*(1+y)^365 + x*(1+y)^364 + x*(1+y)^363 + ... + x
    // ref: https://en.wikipedia.org/wiki/Geometric_series
    // = x * (1-(1+y)^365) / (1-(1+y))
    // = x * ((1+y)^365 - 1) / (y)
    const pool = dividends.find((item) => item.id === vault.maximizerId)

    const { rewardRate, totalSupply } = pool
    const dailyRewards = new BigNumber(rewardRate).times(86400).times(lpTokenPrice)
    const totalPrice = new BigNumber(totalSupply).times(farmTokenPrice)
    const actualDailyROI = dailyRewards.div(totalPrice).times(100)

    // const finsAPY = actualDailyROI.toNumber()
    // const finsDailyAPY = aprToApy(actualDailyROI.times(365).toNumber(), 365) / 365
    // const actualAPY = (dailyAPY * finsAPY) / finsDailyAPY
    // const actualAPR = apyToApr(actualAPY, 365)

    const actualAPR = sumYieldForYear(cakeRewardsApr.div(365).toNumber(), actualDailyROI.toNumber())

    // console.log({
    //   lpTokenPrice: lpTokenPrice.toString(),
    //   symbol: vault.lpSymbol,
    //   dailyAPY: dailyAPY.toString(),
    //   finsAPY: finsAPY.toString(),
    //   yearlyTokenRewardAllocation: yearlyTokenRewardAllocation.toString(),
    //   nativePriceUsd: nativePriceUsd.toString(),
    //   poolLiquidityUsd: poolLiquidityUsd.toString(),
    //   farmTokenPrice: farmTokenPrice.toString(),
    //   actualDailyROI: actualDailyROI.toString(),
    //   finsDailyAPY: finsDailyAPY.toString(),
    //   actualAPY: actualAPY.toString(),
    //   actualAPR: actualAPR.toString(),
    //   sumYieldForYear: sumYieldForYear(cakeRewardsApr.div(365).toNumber(), actualDailyROI.toNumber()),
    // })

    const actualCakeRewardsApr = new BigNumber(actualAPR).times(canMint ? 70 : 100).div(100)
    const actualJawsRewardsApr = new BigNumber(actualAPR)
      .times(canMint ? 30 * boostRate : 0)
      .div(100)
      .div(bnbPrice)
      .times(jawsPerProfitBNB)
      .times(jawsPrice)
    const finalAPR = actualCakeRewardsApr.plus(actualJawsRewardsApr)
    return { cakeRewardsApr: finalAPR.toNumber(), lpRewardsApr: 0 }
  }

  if (singleMaximizer) {
    const pool = dividends.find((item) => item.id === vault.pid)
    const { rewardRate, totalSupply } = pool
    const dailyRewards = new BigNumber(rewardRate).times(86400).times(lpTokenPrice)
    const totalPrice = new BigNumber(totalSupply).times(farmTokenPrice)
    const actualDailyROI = dailyRewards
      .div(totalPrice)
      .times(100)
      .times(boostRate > 0 ? boostRate : 1)

    // If this is the FINS dividend pool, we add JAWS rewards
    if (pool.id === 1) {
      const actualCakeRewardsApr = actualDailyROI
        .times(365)
        .times(canMint ? 70 : 100)
        .div(100)
      const actualJawsRewardsApr = actualDailyROI
        .times(365)
        .times(canMint ? 30 * boostRate : 0)
        .div(100)
        .div(bnbPrice)
        .times(jawsPerProfitBNB)
        .times(jawsPrice)
      const actualAPR = actualCakeRewardsApr.plus(actualJawsRewardsApr)
      return { cakeRewardsApr: actualAPR.toNumber(), lpRewardsApr: 0 }
    }

    return { cakeRewardsApr: actualDailyROI.times(365).toNumber(), lpRewardsApr: 0 }
  }

  const yearlyTokenRewardAllocation = new BigNumber(nativeTokenPerBlock)
    .div(new BigNumber('1000000000000000000'))
    .times(BLOCKS_PER_YEAR)
    .times(poolWeight)

  const cakeRewardsApr = yearlyTokenRewardAllocation.times(nativePriceUsd).div(poolLiquidityUsd).times(100)
  const actualCakeRewardsApr = cakeRewardsApr.times(canMint ? 70 : 100).div(100)
  const actualJawsRewardsApr = cakeRewardsApr
    .times(canMint ? 30 * boostRate : 0)
    .div(100)
    .div(bnbPrice)
    .times(jawsPerProfitBNB)
    .times(jawsPrice)

  const actualAPR = actualCakeRewardsApr.plus(actualJawsRewardsApr)
  let cakeRewardsAprAsNumber = null
  if (!actualAPR.isNaN() && actualAPR.isFinite()) {
    cakeRewardsAprAsNumber = actualAPR.toNumber()
  }
  const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0
  return { cakeRewardsApr: cakeRewardsAprAsNumber, lpRewardsApr }
}

const sumYieldForYear = (x: number, y: number) => {
  const percentX = x / 100
  const percentY = y / 100

  // let x = 0.5% (daily flip apr)
  // let y = 0.87% (daily fins apr)
  // sum of yield of the year = x*(1+y)^365 + x*(1+y)^364 + x*(1+y)^363 + ... + x
  // ref: https://en.wikipedia.org/wiki/Geometric_series
  // = x * (1-(1+y)^365) / (1-(1+y))
  // = x * ((1+y)^365 - 1) / (y)
  let result = 0
  for (let i = 365; i > 1; i--) {
    result += (percentX * (1 + percentY)) ** i
  }
  result += percentX
  // return percentX * ((1+percentY)**365 - 1) / (percentY)
  return result * 100 * 365
}

/**
 * Formula source: http://www.linked8.com/blog/158-apy-to-apr-and-apr-to-apy-calculation-methodologies
 *
 * @param interest {Number} APY as percentage (ie. 6)
 * @param frequency {Number} Compounding frequency (times a year)
 * @returns {Number} APR as percentage (ie. 5.82 for APY of 6%)
 */
export const apyToApr = (interest: number, frequency = 365) =>
  ((1 + interest / 100) ** (1 / frequency) - 1) * frequency * 100

/**
 * Formula source: http://www.linked8.com/blog/158-apy-to-apr-and-apr-to-apy-calculation-methodologies
 *
 * @param interest {Number} APR as percentage (ie. 5.82)
 * @param frequency {Number} Compounding frequency (times a year)
 * @returns {Number} APY as percentage (ie. 6 for APR of 5.82%)
 */
export const aprToApy = (interest: number, frequency = BLOCKS_IN_A_YEAR) =>
  ((1 + interest / 100 / frequency) ** frequency - 1) * 100

export const combinedApy = (
  apy: number,
  bnbPrice: number,
  tokenPerProfitBNB: number,
  ourTokenPrice: number,
  taxReduction: number,
  multiplier?: number,
  minterOn?: boolean,
) => {
  const initialAPY = minterOn ? apy * 0.7 : apy
  const rewardAPR = apyToApr(initialAPY)
  const rewardAPY = aprToApy(rewardAPR * (1 - taxReduction / 100))

  const ourTokenPerProfitBNBMultiply = multiplier ? tokenPerProfitBNB * multiplier : tokenPerProfitBNB
  const ourTokenAPY = (apy * 0.3 * (ourTokenPerProfitBNBMultiply * ourTokenPrice)) / bnbPrice

  const netAPY = rewardAPY + ourTokenAPY

  if (minterOn) {
    return netAPY
  }
  return initialAPY
}

export default null
