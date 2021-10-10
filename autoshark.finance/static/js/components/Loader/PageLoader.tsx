import React from 'react'
import styled from 'styled-components'
import Pearl from './Pearl/Pearl'
import Page from '../Layout/Page'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <Pearl />
    </Wrapper>
  )
}

export default PageLoader
