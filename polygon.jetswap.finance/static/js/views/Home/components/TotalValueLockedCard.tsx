import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from 'jetswap-uikit-polygon'
import { useTranslation } from 'contexts/Localization'
import { useGetStats } from 'hooks/api'
import { useFarms, useGetApiPrices, usePools } from 'state/hooks'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'

const StyledTotalValueLockedCard = styled(Card)`
  align-items: center;
  display: flex;
  flex: 1;
`

const TotalValueLockedCard = () => {
  const { t } = useTranslation()
  const data = useGetStats()
  const farms = useFarms()
  const prices = useGetApiPrices()
  const { account } = useWeb3React()
  const pools = usePools(account)

  const tvl = useMemo(() => {
    const farmTVL = farms.reduce((accum, farm) => {
      if (!farm.lpTotalInQuoteToken || !prices) {
        return accum
      }

      const quoteTokenPriceUsd = prices[farm.quoteToken.symbol.toLowerCase()]
      const liquidity = new BigNumber(farm.lpTotalInQuoteToken).times(quoteTokenPriceUsd)
      return accum.plus(liquidity)
    }, new BigNumber(0))

    const poolTVL = pools.reduce((accum, pool) => {
      if (!pool) {
        return accum
      }

      const stakingTokenPriceUsd = prices[pool.stakingToken.symbol.toLowerCase()]
      const liquidity = new BigNumber(pool.totalStaked)
        .div(new BigNumber(10).pow(pool.stakingToken.decimals))
        .times(stakingTokenPriceUsd)
      return accum.plus(liquidity)
    }, new BigNumber(0))

    const pairTVL = new BigNumber(data ? data.total_value_locked_all : 0)

    const totalTVL = farmTVL.plus(poolTVL).plus(pairTVL)

    return totalTVL.toNumber().toLocaleString('en-US', { maximumFractionDigits: 0 })
  }, [data, farms, pools, prices])

  return (
    <StyledTotalValueLockedCard>
      <CardBody>
        <Heading size="lg" mb="14px">
          {t('Total Value Locked')}
          <br />
          (TVL)
        </Heading>
        {data ? (
          <>
            <Heading fontSize="32px" size="lg" color="extra">{`$${tvl}`}</Heading>
            <Text fontSize="18px" color="textDisabled">
              {t('Across all LPs and Pilots Pools')}
            </Text>
          </>
        ) : (
          <>
            <Skeleton height={66} />
          </>
        )}
      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
