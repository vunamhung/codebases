import React, { useState, useEffect } from 'react'

import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
`

const BscToggle = styled.div<{ active: boolean }>`
  color: ${({ active }) => (active ? '#fbbe24' : '#fff')};
  border-right: 1px #666666 solid;
  padding: 7.5px 15px 2.5px 15px;
`
const PolyToggle = styled.a<{ active: boolean }>`
  margin: 5px 5px 2.5px 5px;
  color: ${({ active }) => (active ? '#8347e6' : '#fff')};
  padding: 7.5px 10px 5px 10px;
  border-radius: 10px;

  &:hover {
    color: #fff;
    background-color: #8347e6;
  }
`

const ChainToggler = () => {
  const isBrowser = () => typeof window !== 'undefined'
  const ethereum = isBrowser() ? (window as any).ethereum : {}
  const chainId = ethereum?.chainId

  const [network, setNetwork] = useState('bsc')
  useEffect(() => {
    if (chainId) {
      if (chainId === '0x38') {
        setNetwork('bsc')
      } else if (chainId === '0x89') {
        setNetwork('poly')
      }
    }
  }, [chainId])

  return (
    <Container>
      <BscToggle active={network === 'bsc'}>BSC</BscToggle>
      <PolyToggle
        active={network === 'poly'}
        href="https://old.autoshark.finance/?chain=poly"
        rel="noreferrer"
        target="_blank"
      >
        POLY
      </PolyToggle>
    </Container>
  )
}

export default ChainToggler
