import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR, PWINGS_PER_BLOCK, VAULTS_DISTRIBUTION_PERCENTAGE } from 'config'
import { isConstructorDeclaration } from 'typescript'

/**
 * Get the APY value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new wings allocated to the pool for each new block
 * @returns Null if the APY is NaN or infinite.
 */
export const getPoolApy = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apy = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apy.isNaN() || !apy.isFinite() ? null : apy.toNumber()
}

/**
 * Get farm APY value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param wingsPriceUSD pWINGS price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getFarmApy = (poolWeight: BigNumber, wingsPriceUSD: BigNumber, poolLiquidityUsd: BigNumber): number => {
  const yearlyCakeRewardAllocation = PWINGS_PER_BLOCK.times(BLOCKS_PER_YEAR).times(poolWeight)
  const apy = yearlyCakeRewardAllocation.times(wingsPriceUSD).div(poolLiquidityUsd).times(100)
  return apy.isNaN() || !apy.isFinite() ? null : apy.toNumber()
}
export const compound = (r, p = 1, n = 365, t = 1) => (1 + (p * r) / (n * t)) ** (n * t) - 1

/**
 * Get vault APY value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param cakePriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getVaultApy = (
  poolWeight: BigNumber,
  rewardPriceUSD: BigNumber,
  poolLiquidityUsd: BigNumber,
  provider?: string,
): number => {
  const yearlyWingsRewardAllocation = PWINGS_PER_BLOCK.times(BLOCKS_PER_YEAR).times(poolWeight)
  const _apy = yearlyWingsRewardAllocation.times(rewardPriceUSD).div(poolLiquidityUsd).toString(10)
  const apy = new BigNumber(compound(_apy, VAULTS_DISTRIBUTION_PERCENTAGE, 365, 1)).times(100)
  return apy.isNaN() || !apy.isFinite() ? null : apy.toNumber()
}

export default null
