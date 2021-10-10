import React, { useState, useMemo } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Heading, Text, Flex } from 'jetswap-uikit-polygon'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import { usePools, useBlock } from 'state/hooks'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { START_BLOCK_NUMBER } from 'config'
import Coming from './components/Coming'
import PoolCard from './components/PoolCard'
import PoolTabButtons from './components/PoolTabButtons'
import Divider from './components/Divider'

const Farm: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const pools = usePools(account)

  const { blockNumber } = useBlock()
  const [stackedOnly, setStackedOnly] = useState(false)

  const [finishedPools, openPools] = useMemo(
    () => partition(pools, (pool) => pool.isFinished || blockNumber > pool.endBlock),
    [blockNumber, pools],
  )
  const stackedOnlyPools = useMemo(
    () => openPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
    [openPools],
  )

  return (
    <Background>
      <Page>
        <Hero>
          <div>
            <Heading as="h1" size="xxl" mb="16px">
              {t('Pilots Pool')}
            </Heading>
            <ul>
              <li>
                <Text>{t('Stake tokens to earn tokens.')}</Text>
              </li>
              <li>
                <Text>{t('You can unstake at any time.')}</Text>
              </li>
              <li>
                <Text>{t('Rewards are calculated per block.')}</Text>
              </li>
            </ul>
          </div>
          <img src="/images/syrup.svg" alt="SYRUP POOL icon" width={410} height={191} />
        </Hero>
        {blockNumber !== 0 && blockNumber <= START_BLOCK_NUMBER && (
          <NotifyContainer>
            <Heading as="h1" size="xl" color="secondary" mb="24px">
              {t('pWINGS Farming Countdown')}
            </Heading>
            <Flex alignItems="center" justifyContent="space-between" mb="8px">
              <Text fontSize="20px">{t(`pWINGS Farming Starts On Block ${START_BLOCK_NUMBER}`)}</Text>
              <Text fontSize="20px">{`${START_BLOCK_NUMBER - blockNumber} blocks left until pWINGS Farming`}</Text>
            </Flex>
          </NotifyContainer>
        )}
        <PoolTabButtons stackedOnly={stackedOnly} setStackedOnly={setStackedOnly} />
        <Divider />
        <FlexLayout>
          <Route exact path={`${path}`}>
            <>
              {stackedOnly
                ? orderBy(stackedOnlyPools, ['sortOrder']).map((pool) => <PoolCard key={pool.sousId} pool={pool} />)
                : orderBy(openPools, ['sortOrder']).map((pool) => <PoolCard key={pool.sousId} pool={pool} />)}
              {/* <Coming /> */}
            </>
          </Route>
          <Route path={`${path}/history`}>
            {orderBy(finishedPools, ['sortOrder'])
              .map((item) => {
                return {
                  ...item,
                  isFinished: item.isFinished || blockNumber > item.endBlock,
                }
              })
              .map((pool) => (
                <PoolCard key={pool.sousId} pool={pool} />
              ))}
          </Route>
        </FlexLayout>
      </Page>
    </Background>
  )
}
const Background = styled.div`
  width: 100%;
  background-image: url('/images/assets/bg4.svg');
  background-repeat: no-repeat;
  background-position: top right;
`

const Hero = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;
  margin-left: auto;
  margin-right: auto;
  max-width: 250px;
  padding: 48px 0;
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    font-size: 16px;
    li {
      margin-bottom: 4px;
    }
  }
  img {
    height: auto;
    max-width: 100%;
  }
  @media (min-width: 576px) {
    grid-template-columns: 1fr 1fr;
    margin: 0;
    max-width: none;
  }
`

const NotifyContainer = styled.div`
  border: 1px solid #ac7bff;
  border-radius: 8px;
  padding: 8px 16px;
  margin-bottom: 16px;
`

export default Farm
