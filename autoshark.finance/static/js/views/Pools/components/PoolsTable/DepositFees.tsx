import React from 'react'
import styled from 'styled-components'
import { Skeleton } from '@autoshark-finance/uikit'

export interface DepositFeesProps {
  value: string
  // multiplier: string
  // lpLabel: string
  // tokenAddress?: Address
  // quoteTokenAddress?: Address
  // cakePrice: BigNumber
  originalValue: number
  // hideButton?: boolean
}

const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};

  button {
    width: 20px;
    height: 20px;

    svg {
      path {
        fill: ${({ theme }) => theme.colors.textSubtle};
      }
    }
  }
`

const DepositFeesWrapper = styled.div`
  min-width: 60px;
  text-align: left;
`

const DepositFees: React.FC<DepositFeesProps> = ({ value, originalValue }) => {
  return originalValue !== 0 ? (
    <Container>
      {originalValue ? (
        <>
          <DepositFeesWrapper>{value}%</DepositFeesWrapper>
        </>
      ) : (
        <DepositFeesWrapper>
          <Skeleton width={60} />
        </DepositFeesWrapper>
      )}
    </Container>
  ) : (
    <Container>
      <DepositFeesWrapper>{originalValue}%</DepositFeesWrapper>
    </Container>
  )
}

export default DepositFees
