import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout } from 'jetswap-uikit-polygon'
import Page from 'components/layout/Page'
import FarmStakingCard from 'views/Home/components/FarmStakingCard'
// import LotteryCard from 'views/Home/components/LotteryCard'
import CakeStats from 'views/Home/components/CakeStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
import EarnAPYCard from 'views/Home/components/EarnAPYCard'
import EarnAssetCard from 'views/Home/components/EarnAssetCard'
import AllTimeVolumeCard from 'views/Home/components/AllTimeVolumeCard'
import AllTimeFeeCard from 'views/Home/components/AllTimeFeeCard'
// import WinCard from 'views/Home/components/WinCard'
import { useTranslation } from 'contexts/Localization'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

// Jets
import Jet1 from './components/Jet1'
import Jet2 from './components/Jet2'
import JetMobile from './components/JetMobile'

const Hero = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 40px;
  }
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

// const CTACards = styled(BaseLayout)`
//   align-items: start;
//   margin-bottom: 32px;

//   & > div {
//     grid-column: span 6;
//   }

//   ${({ theme }) => theme.mediaQueries.sm} {
//     & > div {
//       grid-column: span 8;
//     }
//   }

//   ${({ theme }) => theme.mediaQueries.lg} {
//     & > div {
//       grid-column: span 4;
//     }
//   }
// `
const Background = styled.div`
  width: 100%;
  background-image: url('/images/assets/bg5.svg');

  background-repeat: no-repeat;
  background-position: center center;
`
const Flex = styled.div`
  display: flex;
`
const Container = styled.div``

const StatusWrapper = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: grid;
    grid-gap: 20px;
    & > div {
      width: 100%;
    }
  }
`

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
}

const StyledCarousel = styled(Carousel)`
  & .react-multi-carousel-item--active ~ .react-multi-carousel-item--active {
    padding-left: 20px;
  }
  @media (max-width: 768px) {
    display: none !important;
  }
`

const Home: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Background>
      <Page>
        <Hero>
          <JetMobile />
          <Flex>
            <Jet1 />
            <Container>
              <Heading as="h1" size="xl" mb="24px" color="text">
                {t('JetSwap')}
              </Heading>
              <Text>{t("Welcome to Jetswap, Jetfuel.Finance's AMM on BSC & Polygon")}</Text>
            </Container>
            <Jet2 />
          </Flex>
        </Hero>
        <div>
          <Cards>
            <FarmStakingCard />
            <CakeStats />
          </Cards>
          <StatusWrapper>
            <EarnAPYCard />
            <EarnAssetCard />
            <TotalValueLockedCard />
            <AllTimeVolumeCard />
            <AllTimeFeeCard />
          </StatusWrapper>
          <StyledCarousel
            responsive={responsive}
            itemClass="carousel-item"
            infinite
            autoPlay
            autoPlaySpeed={3000}
            arrows={false}
          >
            <EarnAPYCard />
            <EarnAssetCard />
            <TotalValueLockedCard />
            <AllTimeVolumeCard />
            <AllTimeFeeCard />
          </StyledCarousel>
        </div>
      </Page>
    </Background>
  )
}

export default Home
