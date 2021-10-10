import React from 'react'
import styled from 'styled-components'
import { Flex } from '@autoshark-finance/uikit'
import SubNav from 'components/Menu/SubNav'
import Footer from 'components/Menu/Footer'
import { PageMeta } from 'components/Layout/Page'

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 16px;
  padding-bottom: 0;
  min-height: calc(100vh - 64px);
  background-image: url('/images/ocean-bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 40px;
    padding-bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    min-height: calc(100vh - 64px);
  }
`

const Page: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <>
      <PageMeta />
      <StyledPage {...props}>
        <SubNav />
        {children}
        <Flex flexGrow={1} />
        <Footer />
      </StyledPage>
    </>
  )
}

export default Page
