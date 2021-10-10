import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Flex, Heading, Link, Button, Skeleton } from '@autoshark-finance/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useTheme from 'hooks/useTheme'
import Balance from 'components/Balance'
import { SlideSvgDark, SlideSvgLight } from './SlideSvg'
import CompositeImage, { CompositeImageProps } from './CompositeImage'

const flyingAnim = () => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(0, 20px);
  }
  to {
    transform: translate(0, 0px);
  }  
`

const fading = () => keyframes`
  from {
    opacity: 0.9;
  }
  50% {
    opacity: 0.1;
  }
  to {
    opacity: 0.9;
  }  
`

const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0px;
  left: 0px;
`

const InnerWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: -15px;
`

const SharkWrapper = styled.div`
  display: flex;
  align-items: end;
  width: 100%;
  animation: ${flyingAnim} 3.5s ease-in-out infinite;
`

const StarsWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  & :nth-child(2) {
    animation: ${fading} 2s ease-in-out infinite;
    animation-delay: 1s;
  }

  & :nth-child(3) {
    animation: ${fading} 5s ease-in-out infinite;
    animation-delay: 0.66s;
  }

  & :nth-child(4) {
    animation: ${fading} 2.5s ease-in-out infinite;
    animation-delay: 0.33s;
  }
`

const imagePath = '/images/home/scary-shark/'
const imageSrc = 'shark-clampack'

const starsImage: CompositeImageProps = {
  path: '/images/home/scary-shark/',
  attributes: [
    { src: 'star-left-1', alt: '3D Star' },
    { src: 'star-left-2', alt: '3D Star' },
    { src: 'star-right-1', alt: '3D Star' },
    { src: 'star-right-2', alt: '3D Star' },
    { src: 'bubbles', alt: 'bubbles' },
  ],
}

const StyledAnnouncement = styled.div`
  width: 100%;
  text-align: center;
  color: #fff;
  // background: linear-gradient(139.73deg,rgb(229 140 21) 0%,rgb(212 62 24) 100%);
  background: ${({ theme }) => theme.colors.gradients.inverseBubblegum};
  padding: 10px 20px;
  margin: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border-radius: 12px;
  line-height: 1.2;
`

export interface HeroProps {
  tvl: number
}

const Hero: React.FC<HeroProps> = (props) => {
  const { tvl } = props
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()

  return (
    <>
      <BgWrapper>
        <InnerWrapper>{theme.isDark ? <SlideSvgDark width="100%" /> : <SlideSvgLight width="100%" />}</InnerWrapper>
      </BgWrapper>
      <Flex alignItems="center" justifyContent="center" mb="10px">
        <StyledAnnouncement>{t('Use our swap and receive 120% in trading fee rebates. EARN a profit by simply trading on AutoShark.')}</StyledAnnouncement>
      </Flex>
      <Flex
        position="relative"
        flexDirection={['column-reverse', null, null, 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="center"
      >
        <Flex flex="1" flexDirection="column">
          <Heading scale="xxl" color="secondary" mb="14px">
            {t('Apex predators in the DeFi ocean')}
          </Heading>
          <Heading scale="md" mb="20px">
            {t(
              'Make waves trading & earning crypto safely and securely on our platform in this vast ocean of decentralized finance',
            )}
          </Heading>
          <div style={{ marginBottom: '20px' }}>
            <Heading color="text" mb="5px">
              {t('Total Value Locked')}
              <div />
            </Heading>
            {tvl ? (
              <Balance color="secondary" decimals={0} lineHeight="1.1" fontSize="24px" bold value={tvl} prefix="$" />
            ) : (
              <Skeleton height={24} width={126} my="4px" />
            )}
          </div>
          <Flex mb="32px">
            {!account ? (
              <ConnectWalletButton mr="16px" />
            ) : (
              <>
                <Link
                  external
                  mr="10px"
                  href="https://autoshark.finance/swap?outputCurrency=0x1b219aca875f8c74c33cff9ff98f3a9b62fcbff5"
                >
                  <Button variant="primary">{t('Buy $FINS')}</Button>
                </Link>
                <Link
                  external
                  mr="10px"
                  href="https://autoshark.finance/swap?outputCurrency=0xdd97ab35e3c0820215bc85a395e13671d84ccba2"
                >
                  <Button variant="primary">{t('Buy $JAWS')}</Button>
                </Link>
                <Link href="/vaults">
                  <Button variant="secondary">{t('Stake Now')}</Button>
                </Link>
              </>
            )}
          </Flex>
        </Flex>
        <Flex
          height={['192px', null, null, '100%']}
          width={['192px', null, null, '100%']}
          flex={[null, null, null, '1']}
          mb={['24px', null, null, '0']}
          position="relative"
        >
          <SharkWrapper>
            <img src={`${imagePath}${imageSrc}.png`} alt={t('A very scary shark')} />
          </SharkWrapper>
          <StarsWrapper>
            <CompositeImage {...starsImage} />
          </StarsWrapper>
        </Flex>
      </Flex>
    </>
  )
}

export default Hero
