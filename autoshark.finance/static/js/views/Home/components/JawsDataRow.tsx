import React from 'react'
import styled from 'styled-components'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { getJawsAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceJawsBusd } from 'state/vaults/hooks'
import { Flex, Text, Heading, Skeleton } from '@autoshark-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'

const StyledColumn = styled(Flex)<{ noMobileBorder?: boolean }>`
  flex-direction: column;
  ${({ noMobileBorder, theme }) =>
    noMobileBorder
      ? `${theme.mediaQueries.md} {
           padding: 0 16px;
           border-left: 1px ${theme.colors.inputSecondary} solid;
         }
       `
      : `border-left: 1px ${theme.colors.inputSecondary} solid;
         padding: 0 8px;
         ${theme.mediaQueries.sm} {
           padding: 0 16px;
         }
       `}
`

const Grid = styled.div`
  display: grid;
  grid-gap: 8px;
  margin-top: 24px;
  grid-template-columns: repeat(2, auto);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(3, auto);
  }
`

const JawsDataRow = () => {
  const { t } = useTranslation()
  const totalSupply = useTotalSupply()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getJawsAddress()))
  const jawsSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance : 0
  const jawsPriceBusd = usePriceJawsBusd()
  const mcap = jawsPriceBusd.times(jawsSupply)
  // const mcapString = formatLocalisedCompactNumber(mcap.toNumber())
  const priceString = jawsPriceBusd.toNumber().toFixed(5)

  return (
    <Grid>
      {/* <Flex flexDirection="column">
        <Text color="textSubtle">{t('TVL')}</Text>
        {tvl ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={tvl} prefix="$" />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </Flex> */}
      <Flex flexDirection="column">
        <Text color="textSubtle">{t('Total supply')}</Text>
        {jawsSupply ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={jawsSupply} />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </Flex>
      <StyledColumn noMobileBorder>
        <Text color="textSubtle">{t('Market cap')}</Text>
        {mcap?.gt(0) ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={mcap.toNumber()} prefix="$" />
        ) : (
          // <Heading scale="lg">{t('$%marketCap%', { marketCap: mcapString })}</Heading>
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn noMobileBorder>
        <Text color="textSubtle">{t('JAWS Price')}</Text>
        {jawsPriceBusd?.gt(0) && priceString ? (
          <Heading scale="lg">${priceString}</Heading>
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
    </Grid>
  )
}

export default JawsDataRow
