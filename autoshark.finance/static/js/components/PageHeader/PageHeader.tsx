import React from 'react'
import styled from 'styled-components'
import { Box } from '@autoshark-finance/uikit'
import Container from '../Layout/Container'

const Outer = styled(Box)<{ background?: string }>`
  background-image: url('/images/ocean-bg.png');
  background-position: center;
  background-size: cover;
`

const Inner = styled(Container)`
  padding-top: 32px;
  padding-bottom: 32px;
`

const PageHeader: React.FC<{ background?: string }> = ({ background, children, ...props }) => (
  <Outer background={background} {...props}>
    <Inner>{children}</Inner>
  </Outer>
)

export default PageHeader
