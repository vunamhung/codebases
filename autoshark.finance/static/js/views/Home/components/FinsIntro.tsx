import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text, Flex, Button } from '@autoshark-finance/uikit'

const Wrapper = styled.div`
  margin-bottom: 30px;
  padding: 48px 0;
  background: ${({ theme }) => theme.colors.background};
`

const StyledFlex = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 20px;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const StyledImg = styled.img`
  width: 100%;
  max-width: 500px;
  margin-right: auto;
  margin-left: auto;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-right: 140px;
  }
`

const StyledIcons = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 15px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 60px;
    height: 60px;
    margin-right: 20px;
  }
`

const FinsIntro: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <StyledFlex>
        <Flex justifyContent="center">
          <StyledImg src="/images/ifos/coins.png" alt="coins" />
        </Flex>
        <Flex maxWidth="600px" justifyContent="center">
          <div>
            <Heading as="h2" scale="xl" color="primary" mb="20px" textAlign="left">
              {t('AutoShark DEX (FINS)')}
            </Heading>
            <Text mb="20px">
              {t(
                `We have launched a decentralized exchange powered by a new token, FINS. We envision the independence and flexibility of a decentralized exchange together with the ease and convenience of our yield optimization service. The cherry on top of everything? NFTs with high utility, enhancing rewards and engaging the community.`,
              )}
            </Text>
            <Text mb="30px">{t('Are you ready to be at the apex of the Binance Smart Chain?')}</Text>
            <Flex alignItems="flex-start" mb="30px">
              <StyledIcons src="/images/ifos/1.png" alt="plant" />
              <div style={{ maxWidth: '600px' }}>
                <Heading as="h3" scale="lg" color="secondary" mb="10px" textAlign="left">
                  {t('First AMM with WBNB Dividends Distribution')}
                </Heading>
                <Text>
                  {t(
                    `Best explained with an example. With $10,000,000 daily trading volume, we generate $10,000 in dividends for FINS holders daily (~$3.65m yearly). We store these BNB rewards as FINS-WBNB LP to achieve a constantly rising price floor.`,
                  )}
                </Text>
              </div>
            </Flex>
            <Flex alignItems="flex-start" mb="30px">
              <StyledIcons src="/images/ifos/2.png" alt="rebate" />
              <div style={{ maxWidth: '600px' }}>
                <Heading as="h3" scale="lg" color="secondary" mb="10px" textAlign="left">
                  {t('Gamified NFT Ecosystem to Boost Farming')}
                </Heading>
                <Text>
                  {t(
                    'Users will be able to equip NFTs in farms to boost farming rewards with NFTs. These NFTs will be limited in supply. Proceeds from the sales of NFTs will go towards buybacks and burns of both JAWS and FINS.',
                  )}
                </Text>
              </div>
            </Flex>
            <Flex alignItems="flex-start">
              <StyledIcons src="/images/ifos/3.png" alt="joystick" />
              <div style={{ maxWidth: '600px' }}>
                <Heading as="h3" scale="lg" color="secondary" mb="10px" textAlign="left">
                  {t('Trade Mining to Promote Trades')}
                </Heading>
                <Text>
                  {t(
                    'By providing fee rebates of up to 100%, we essentially ensure that trades are executed at zero cost. Zero cost trading will result in increased trading volume. With increased trading volume, there will be increased dividends distribution for all FINS holders. The entire ecosystem benefits.',
                  )}
                </Text>
              </div>
            </Flex>
            <a
              href="https://medium.com/autosharkfin/making-waves-in-the-bsc-defi-scene-new-launchpad-next-gen-amm-e3a978549775"
              target="_blank"
              rel="noreferrer"
            >
              <Button mt="20px" variant="primary">
                {t('Read More')}
              </Button>
            </a>
          </div>
        </Flex>
      </StyledFlex>
    </Wrapper>
  )
}

export default FinsIntro
