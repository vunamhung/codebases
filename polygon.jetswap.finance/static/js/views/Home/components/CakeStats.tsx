import React from 'react'
import { Card, CardBody, Heading, Text } from 'jetswap-uikit-polygon'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import { getWingsAddress } from 'utils/addressHelpers'
import CardValue from './CardValue'

const StyledWingsStats = styled(Card)`
  background-image: url('/images/assets/bg2.svg');
  background-repeat: no-repeat;
  background-position: bottom right;
  min-height: 376px;
`

const Block = styled.div`
  margin-bottom: 16px;
`
const CardImage = styled.img`
  margin-bottom: 16px;
`

const CakeStats = () => {
  const { t } = useTranslation()
  const totalSupply = useTotalSupply()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getWingsAddress()))
  const wingsSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance : 0

  return (
    <StyledWingsStats>
      <CardBody>
        <Heading size="xl" mb="24px">
          {t('pWINGS Stats')}
        </Heading>
        <CardImage src="/images/assets/WINGS.svg" alt="wings logo" width={64} height={64} />
        <Block>
          {wingsSupply && <CardValue fontSize="36px" value={wingsSupply} />}
          <Text fontSize="14px" color="#808080">
            {t('Total pWINGS Supply')}
          </Text>
        </Block>
        <Block>
          <CardValue fontSize="36px" decimals={0} value={burnedBalance} />
          <Text fontSize="14px" color="#808080">
            {t('Total pWINGS Burned')}
          </Text>
        </Block>
        <Block>
          <CardValue fontSize="36px" decimals={0} value={2} />
          <Text fontSize="14px" color="#808080">
            {t('New pWINGS/block')}
          </Text>
        </Block>
      </CardBody>
    </StyledWingsStats>
  )
}

export default CakeStats
