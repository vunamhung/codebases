import React from 'react'
import styled from 'styled-components'
import orderBy from 'lodash/orderBy'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon } from 'jetswap-uikit-polygon'
import { NavLink } from 'react-router-dom'
import pools from 'config/constants/pools'
import { Pool } from 'state/types'
import { useTranslation } from 'contexts/Localization'

const StyledFarmStakingCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`
const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  line-height: 44px;
`
const Circle = styled.div`
  background: #ac7bff;
  margin-top: -50px;
  width: 59px;
  height: 59px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
`

const EarnAssetCard = () => {
  const { t } = useTranslation()
  const activeNonCakePools = pools.filter((pool) => !pool.isFinished && !pool.earningToken.symbol.includes('CAKE'))
  const latestPools: Pool[] = orderBy(activeNonCakePools, ['sortOrder', 'pid'], ['desc', 'desc']).slice(0, 3)
  // Always include CAKE
  const assets = 'pWINGS'
  const assetText = t('Earn %assets% in Pools', { assets })
  const [earn, InPools] = assetText.split(assets)
  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Heading color="text" size="lg">
          {earn}
        </Heading>
        <CardMidContent color="extra">{assets}</CardMidContent>
        <Flex justifyContent="space-between">
          <Heading color="text" size="lg">
            {InPools}
          </Heading>
          <NavLink exact activeClassName="active" to="/syrup" id="pool-cta">
            <Circle>
              <ArrowForwardIcon color="#000000" />
            </Circle>
          </NavLink>
        </Flex>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default EarnAssetCard
