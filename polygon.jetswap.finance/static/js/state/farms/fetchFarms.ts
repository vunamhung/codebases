import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import farmsConfig from 'config/constants/farms'
import { client } from 'apollo/client'
import { PAIR_DAY_DATA_BULK } from 'apollo/queries'

const fetchFarms = async () => {
  const lpAddresses = farmsConfig.map((farm) => getAddress(farm.lpAddresses).toLowerCase())
  const { data: results } = await client.query({
    query: PAIR_DAY_DATA_BULK(lpAddresses),
    fetchPolicy: 'cache-first',
  })
  const pairDayDatas = results.pairDayDatas
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
      const lpAddress = getAddress(farmConfig.lpAddresses)
      const calls = [
        // Balance of token in the LP contract
        {
          address: getAddress(farmConfig.token.address),
          name: 'balanceOf',
          params: [lpAddress],
        },
        // Balance of quote token on LP contract
        {
          address: getAddress(farmConfig.quoteToken.address),
          name: 'balanceOf',
          params: [lpAddress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: lpAddress,
          name: 'balanceOf',
          params: [getMasterChefAddress()],
        },
        // Total supply of LP tokens
        {
          address: lpAddress,
          name: 'totalSupply',
        },
        // Token decimals
        {
          address: getAddress(farmConfig.token.address),
          name: 'decimals',
        },
        // Quote token decimals
        {
          address: getAddress(farmConfig.quoteToken.address),
          name: 'decimals',
        },
      ]

      const [
        tokenBalanceLP,
        quoteTokenBlanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals,
      ] = await multicall(erc20, calls)

      // Ratio in % a LP tokens that are in staking, vs the total number in circulation
      const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

      // console.log('lpTokenRatio :>> ', new BigNumber(lpTokenRatio).toNumber());
      // Total value in staking in quote token value
      const lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .times(new BigNumber(2))
        .times(lpTokenRatio)

      // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
      const tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals))
      const quoteTokenAmount = new BigNumber(quoteTokenBlanceLP).div(new BigNumber(10).pow(quoteTokenDecimals))

      const [info, totalAllocPoint] = await multicall(masterchefABI, [
        {
          address: getMasterChefAddress(),
          name: 'poolInfo',
          params: [farmConfig.pid],
        },
        {
          address: getMasterChefAddress(),
          name: 'totalAllocPoint',
        },
      ])

      const allocPoint = new BigNumber(info.allocPoint._hex)
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))

      const pairData = pairDayDatas.find((pair) => pair.pairAddress.toLowerCase() === lpAddress.toLowerCase())
      let feeApr = 0
      if (pairData) {
        const { dailyVolumeUSD, reserveUSD } = pairData
        feeApr =
          !reserveUSD || Number(reserveUSD) === 0
            ? 0
            : (Number(dailyVolumeUSD) / Number(reserveUSD)) * 365 * 100 * 0.0005
      }

      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        quoteTokenAmount: quoteTokenAmount.toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: tokenAmount.isZero() ? null : quoteTokenAmount.div(tokenAmount).toJSON(),
        poolWeight: poolWeight.toJSON(),
        multiplier: `${allocPoint.div(100).toString()}X`,
        lpTokenBalanceMC: new BigNumber(lpTokenBalanceMC).div(1e18),
        feeApr,
      }
    }),
  )
  return data
}

export default fetchFarms
