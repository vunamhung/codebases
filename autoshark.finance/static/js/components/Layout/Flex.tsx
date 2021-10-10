import styled from 'styled-components'

const FlexLayout = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  & > * {
    min-width: 280px;
    max-width: 365px;
    width: 100%;
    margin: 0 8px;
    margin-bottom: 32px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    & > * {
      max-width: 47%;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > * {
      max-width: 31.5%;
    }
  }
`

export default FlexLayout
