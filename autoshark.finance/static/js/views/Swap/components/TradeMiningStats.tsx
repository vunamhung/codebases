import React, { useCallback } from 'react'
import { Button, useTooltip, HelpIcon, Text, Flex, Skeleton } from '@autoshark-finance/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { AppBody } from 'components/App'
import { usePriceFinsBusd } from 'state/vaults/hooks'
import { useTradeMiningContract } from 'hooks/useContract'
import BigNumber from 'bignumber.js'

const ReferenceElement = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

const FlexWrapper = styled.div`
  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
`

const MobileFlexOnly = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
    justify-content: none;
    align-items: none;
  }
`

const FlexInner = styled.div`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 50%;
  }
`

const StyledText = styled(Text)`
  text-align: left;
  margin-left: 1rem;

  ${({ theme }) => theme.mediaQueries.sm} {
    text-align: right;
    margin-left: 0;
  }
`

const StyledText1 = styled(Text)`
  margin-right: auto;
  margin-left: 1rem;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-right: 0;
    margin-left: auto;
  }
`

const StyledFlex = styled(Flex)`
  justify-content: start;
  margin-left: 1rem;
  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: end;
  }
`

const UserRewardsWrapper = styled(Flex)`
  margin-left: 1rem;
`

const VestedRewardsWrapper = styled(Flex)`
  margin-left: 1rem;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 0;
    justify-content: end;
  }
`

export default function TradeMiningStats({
  rewardsLoaded,
  userRewards,
  vestedRewards,
}: {
  rewardsLoaded: boolean
  userRewards: BigNumber
  vestedRewards: BigNumber
}) {
  const { t } = useTranslation()
  const finsPrice = usePriceFinsBusd()
  const contract = useTradeMiningContract()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'Every time you perform a trade, 24% of the rebates are instantly released to your wallet. The remaining rewards (76%) will be unlocked over a weighted average of 14 days.',
    ),
    {
      placement: 'bottom',
      tooltipOffset: [20, 10],
    },
  )

  const {
    targetRef: claimableRewardsTargetRef,
    tooltip: claimableRewardsTooltip,
    tooltipVisible: claimableRewardsTooltipVisible,
  } = useTooltip(t('Claimable rewards will gradually increase as vested rewards are unlocked.'), {
    placement: 'bottom',
    tooltipOffset: [20, 10],
  })

  const claim = useCallback(async () => {
    await contract.withdrawAll()
  }, [contract])

  const displayUserRewards =
    rewardsLoaded && !userRewards.isNaN() ? userRewards.toFixed(3, BigNumber.ROUND_DOWN) : <Skeleton width={60} />
  const displayVestedRewards =
    rewardsLoaded && !vestedRewards.isNaN() ? vestedRewards.toFixed(3, BigNumber.ROUND_DOWN) : <Skeleton width={60} />

  const userRewardsBusd =
    rewardsLoaded && !finsPrice.isNaN() ? (
      `$${finsPrice.times(userRewards).toFixed(3, BigNumber.ROUND_DOWN)}`
    ) : (
      <Skeleton display="inline-block" width={40} />
    )
  const vestedRewardsBusd =
    rewardsLoaded && !finsPrice.isNaN() ? (
      `$${finsPrice.times(vestedRewards).toFixed(3, BigNumber.ROUND_DOWN)}`
    ) : (
      <Skeleton display="inline-block" width={40} />
    )

  return (
    <AppBody>
      <div
        style={{
          padding: 12,
          paddingTop: 24,
          paddingBottom: 24,
        }}
      >
        <Flex marginLeft="1rem" marginBottom="5px" alignItems="center">
          <Text display="inline" paddingRight="3px" fontSize="20px" bold>
            {t('Trading Fee Rebates')}
          </Text>
          <ReferenceElement ref={targetRef}>
            <HelpIcon height="16px" color="textSubtle" />
          </ReferenceElement>
        </Flex>

        <FlexWrapper>
          <FlexInner>
            <Flex marginLeft="1rem" marginBottom="3px">
              <Text paddingRight="2px">{t('Claimable Rewards')}</Text>
              <ReferenceElement ref={claimableRewardsTargetRef}>
                <HelpIcon height="16px" color="textSubtle" />
              </ReferenceElement>
            </Flex>
            <MobileFlexOnly>
              <div>
                <Flex alignItems="center" paddingRight="10px" marginLeft="1rem">
                  <Text color="secondary" fontSize="22px" marginRight="5px" lineHeight="1">
                    {displayUserRewards}
                  </Text>{' '}
                  <Text fontSize="20px" lineHeight="1.1">
                    FINS
                  </Text>
                </Flex>
                <UserRewardsWrapper justifyContent="start" alignItems="center" paddingRight="10px">
                  <Text color="#999999" fontSize="14px">
                    {userRewardsBusd}
                  </Text>
                </UserRewardsWrapper>
              </div>

              <Button
                style={{ marginLeft: '15px', marginTop: '5px' }}
                onClick={claim}
                scale="sm"
                disabled={!rewardsLoaded || userRewards.isEqualTo(new BigNumber(0))}
              >
                {t('Claim')}
              </Button>
            </MobileFlexOnly>
          </FlexInner>
          <FlexInner>
            <Flex paddingRight="10px" marginBottom="3px">
              <StyledText1 textAlign="left" bold>
                {t('Vested Rewards')}
              </StyledText1>
            </Flex>

            <StyledFlex alignItems="center" paddingRight="10px">
              <Text color="secondary" fontSize="22px" marginRight="5px" lineHeight="1">
                {displayVestedRewards}
              </Text>{' '}
              <Text fontSize="20px" lineHeight="1.1">
                FINS
              </Text>
            </StyledFlex>
            <VestedRewardsWrapper alignItems="center" paddingRight="10px">
              <Text color="#999999" fontSize="14px">
                {vestedRewardsBusd}
              </Text>
            </VestedRewardsWrapper>

            <Flex marginRight="10px">
              <StyledText color="#888888" fontSize="13px" marginTop="5px" textAlign="right" lineHeight="1.2">
                {t('Vested rewards will be unlocked over the next 14 days.')}{' '}
              </StyledText>
            </Flex>
            <Flex justifyContent="end" marginRight="10px">
              <a
                href="https://autosharkgw.gitbook.io/autoshark/120-trading-fees-rebate"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#fff' }}
              >
                <StyledText color="primary" fontSize="13px" textAlign="right" lineHeight="1.2">
                  {t('More details.')}
                </StyledText>
              </a>
            </Flex>
          </FlexInner>
        </FlexWrapper>

        {tooltipVisible && tooltip}
        {claimableRewardsTooltipVisible && claimableRewardsTooltip}
      </div>
    </AppBody>
  )
}
