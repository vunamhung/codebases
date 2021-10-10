import React, { useMemo } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import PageSection from 'components/PageSection'
// import { Heading, Text, Flex } from '@autoshark-finance/uikit'
// import { useWeb3React } from '@web3-react/core'
import { usePollVaultsData, usePriceBnbBusd, useVaults } from 'state/vaults/hooks'
import useTheme from 'hooks/useTheme'
import { BIG_TEN } from 'utils/bigNumber'
import { useDividends, usePollDividendsData } from 'state/dividends/hooks'
import { useFarms, usePollFarmsData } from 'state/farms/hooks'
// import Container from 'components/Layout/Container'
import Hero from './components/Hero'
import { earnSectionData, jawsSectionData, finsSectionData } from './components/SalesSection/data'
import MetricsSection from './components/MetricsSection'
import SalesSection from './components/SalesSection'
// import WinSection from './components/WinSection'
// import Footer from './components/Footer'
import JawsDataRow from './components/JawsDataRow'
import FinsDataRow from './components/FinsDataRow'
import { WedgeTopLeft, InnerWedgeWrapper, OuterWedgeWrapper } from './components/WedgeSvgs'
import FinsIntro from './components/FinsIntro'

// import UserBanner from './components/UserBanner'

const StyledHeroSection = styled(PageSection)`
  padding-top: 0px;
`

// const Wrapper = styled.div`
//   margin-bottom: 30px;
//   padding: 48px 0;
//   background: ${({ theme }) => theme.colors.background};
// `

// const StyledFlex = styled.div`
//   margin: 0 auto;
//   max-width: 1200px;
//   padding: 0 20px;

//   ${({ theme }) => theme.mediaQueries.lg} {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//   }
// `

// const StyledImg = styled.img`
//   width: 100%;
//   max-width: 500px;
//   margin-right: auto;
//   margin-left: auto;

//   ${({ theme }) => theme.mediaQueries.lg} {
//     margin-right: 140px;
//   }
// `

// const StyledIcons = styled.img`
//   width: 40px;
//   height: 40px;
//   margin-right: 15px;

//   ${({ theme }) => theme.mediaQueries.md} {
//     width: 60px;
//     height: 60px;
//     margin-right: 20px;
//   }
// `

// const UserBannerWrapper = styled(Container)`
//   z-index: 1;
//   position: absolute;
//   width: 100%;
//   top: 0px;
//   left: 50%;
//   transform: translate(-50%, 0);
//   padding-left: 0px;
//   padding-right: 0px;

//   ${({ theme }) => theme.mediaQueries.lg} {
//     padding-left: 24px;
//     padding-right: 24px;
//   }
// `

const Home: React.FC = () => {
  const { theme } = useTheme()
  // const { account } = useWeb3React()
  usePollVaultsData()
  usePollDividendsData()
  usePollFarmsData()
  const bnbPrice = usePriceBnbBusd()
  const { data } = useVaults()
  const { data: dividendData } = useDividends()
  const { data: farmData } = useFarms()
  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  const stats = useMemo(() => {
    return data.reduce((prev, curr) => {
      // if (curr.singleStake) {
      //   const value = new BigNumber(curr.vaultBalance)
      //     .times(curr.tokenPriceVsQuote)
      //     .times(curr?.quoteToken?.busdPrice)
      //     .toNumber()
      //   return prev + value
      // }
      // console.log(curr.vaultBalance)
      // const lpPrice = new BigNumber(curr.lpTotalInQuoteToken)
      //   .times(curr.quoteToken.busdPrice)
      //   .div(new BigNumber(curr.lpTotalSupply).div(BIG_TEN.pow(18)))
      // const value = new BigNumber(curr.vaultBalance).times(lpPrice).toNumber()
      // return prev + value
      return prev + parseFloat(curr?.tvlOfPool)
    }, 0)
  }, [data])

  const dividendTVL = useMemo(() => {
    return dividendData.reduce((prev, curr) => {
      return prev + new BigNumber(curr?.tvl).times(bnbPrice).div(BIG_TEN.pow(18)).toNumber()
    }, 0)
  }, [dividendData, bnbPrice])

  const farmTVL = useMemo(() => {
    return farmData.reduce((prev, curr) => {
      return prev + new BigNumber(curr?.quoteTokenAmountMc).times(curr?.quoteToken?.busdPrice).times(2).toNumber()
    }, 0)
  }, [farmData])

  return (
    <>
      <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%', backgroundSize: 'cover' } }}
        background="url('/images/ocean-bg.png')"
        index={2}
        hasCurvedDivider={false}
      >
        <Hero tvl={stats + dividendTVL + farmTVL} />
      </StyledHeroSection>
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'linear-gradient(180deg, #09070C 22%, #201335 100%)'
            : 'linear-gradient(180deg, #FFFFFF 22%, #D7CAEC 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        <MetricsSection />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
      >
        <OuterWedgeWrapper>
          <InnerWedgeWrapper top fill={theme.isDark ? '#201335' : '#D8CBED'}>
            <WedgeTopLeft />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>
        <FinsIntro />

        <div style={{ marginBottom: '100px' }} />

        <SalesSection {...finsSectionData} />
        <FinsDataRow />

        <div style={{ marginBottom: '150px' }} />

        <SalesSection {...jawsSectionData} />
        <JawsDataRow />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
      >
        <SalesSection {...earnSectionData} />
      </PageSection>
      {/* <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.gradients.cardHeader}
        index={2}
        hasCurvedDivider={false}
      >
        <OuterWedgeWrapper>
          <InnerWedgeWrapper width="150%" top fill={theme.colors.background}>
            <WedgeTopRight />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>
        <SalesSection {...swapSectionData} />
      </PageSection> */}
      {/* <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={
          theme.isDark
            ? 'linear-gradient(180deg, #0B4576 0%, #091115 100%)'
            : 'linear-gradient(180deg, #6FB6F1 0%, #EAF2F6 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        <WinSection />
      </PageSection> */}
      {/* <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background="linear-gradient(180deg, #7645D9 0%, #5121B1 100%)"
        index={2}
        hasCurvedDivider={false}
      >
        <Footer />
      </PageSection> */}
    </>
  )
}

export default Home
