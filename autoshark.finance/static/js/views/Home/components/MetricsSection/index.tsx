import React from 'react'
import { Heading, Flex, VaultIcon, WaveIcon, SwapVertIcon, Link, ArrowForwardIcon } from '@autoshark-finance/uikit'
import { useTranslation } from 'contexts/Localization'
// import { useGetStats } from 'hooks/api'
import useTheme from 'hooks/useTheme'
// import { formatLocalisedCompactNumber } from 'utils/formatBalance'
import styled, { keyframes } from 'styled-components'
import IconCard, { IconCardData } from '../IconCard'
import StatCardContent from './StatCardContent'
// import GradientLogo from '../GradientLogoSvg'

const FlexBox = styled.div`
  display: flex;
  max-width: 300px;

  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: 300px;
  }
`

const StyledLink = styled(Link)`
  width: 100%;
  text-decoration: none !important;
`

// Values fetched from bitQuery effective 28/7/21
// const txCount = 30673865
// const addressCount = 1966700

const Stats = () => {
  const { t } = useTranslation()
  // const data = useGetStats()
  const { theme } = useTheme()

  // const tvlString = data ? formatLocalisedCompactNumber(data.tvl) : '-'
  // const trades = formatLocalisedCompactNumber(txCount)
  // const users = formatLocalisedCompactNumber(addressCount)

  // const tvlText = t('And those users are now entrusting the platform with over $%tvl% in funds.', { tvl: tvlString })
  // const [entrusting, inFunds] = tvlText.split(tvlString)

  const UsersCardData: IconCardData = {
    icon: <VaultIcon color="failure" width="36px" />,
    background: theme.colors.background,
    borderColor: theme.colors.cardBorder,
  }

  const TradesCardData: IconCardData = {
    icon: <WaveIcon color="secondary" width="36px" />,
    background: theme.colors.background,
    borderColor: theme.colors.cardBorder,
  }

  const StakedCardData: IconCardData = {
    icon: <SwapVertIcon color="primary" width="36px" />,
    background: theme.colors.background,
    borderColor: theme.colors.cardBorder,
  }

  const imagePath = '/images/home/products/'
  const imageSrc = 'shark'

  const flyingAnim = () => keyframes`
    from {
      transform: translate(0,  0px);
    }
    50% {
      transform: translate(0, -10px);
    }
    to {
      transform: translate(0, 0px);
    }  
  `

  const SecureWrapper = styled.div`
    width: 42px;
    animation: ${flyingAnim} 3.5s ease-in-out infinite;
  `

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <SecureWrapper>
        <img style={{ marginBottom: '10px' }} src={`${imagePath}${imageSrc}.svg`} alt={t('secure')} />
      </SecureWrapper>
      <Heading textAlign="center" scale="xl" mb="32px">
        {t('Earn in Multiple Ways')}
      </Heading>
      {/* <Text textAlign="center" color="textSubtle" mb="32px" maxWidth="800px">
        {t(
          'Be it',
        )}
      </Text> */}

      <Flex alignItems="center" justifyContent="center" flexDirection={['column', null, null, 'row']}>
        <StyledLink href="/vaults">
          <FlexBox>
            <IconCard
              title={t('Vaults')}
              color="failure"
              {...UsersCardData}
              mr={[null, null, null, '16px']}
              mb={['16px', null, null, '0']}
            >
              <StatCardContent
                headingText={t('Your favourite DeFi projects, all in one place')}
                bodyText={t('Earn JAWS on top of regular returns and accelerate your returns via auto-compounding')}
                highlightColor={theme.colors.secondary}
              />
              <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                <ArrowForwardIcon color="white" />
              </div>
            </IconCard>
          </FlexBox>
        </StyledLink>

        <StyledLink href="/ocean">
          <FlexBox>
            <IconCard
              title={t('Ocean')}
              color="secondary"
              {...TradesCardData}
              mr={[null, null, null, '16px']}
              mb={['16px', null, null, '0']}
            >
              <StatCardContent
                headingText={t('Amplify earnings with single asset staking')}
                bodyText={t('Stake assets and acquire JAWS, or stake JAWS to earn tokens from participating projects')}
                highlightColor={theme.colors.primary}
              />
              <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                <ArrowForwardIcon color="white" />
              </div>
            </IconCard>
          </FlexBox>
        </StyledLink>
        
        <StyledLink href="/swap">
          <FlexBox>
            <IconCard title="Trading" color="primary" {...StakedCardData}>
              <StatCardContent
                headingText={t('Earn FINS from every trade on our exchange')}
                bodyText={t('Enjoy the highest liquidity and lowest fees for your trades with our fee rebates')}
                highlightColor={theme.colors.failure}
              />
              <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                <ArrowForwardIcon color="white" />
              </div>
            </IconCard>
          </FlexBox>
        </StyledLink>
      </Flex>
    </Flex>
  )
}

export default Stats
