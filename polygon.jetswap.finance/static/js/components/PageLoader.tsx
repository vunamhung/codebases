import React from 'react'
import styled from 'styled-components'
import { Spinner } from 'jetswap-uikit-polygon'
import Page from './layout/Page'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <Spinner img="/images/assets/logo.gif" size={150} />
    </Wrapper>
  )
}

export default PageLoader
