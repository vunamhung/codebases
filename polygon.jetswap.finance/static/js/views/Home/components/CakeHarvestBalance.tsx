import React from 'react'
import { Text } from 'jetswap-uikit-polygon'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import { usePriceWingsUsd } from 'state/hooks'
import styled from 'styled-components'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'

const Block = styled.div`
  margin-bottom: 24px;
}
`

const CakeHarvestBalance = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const allPending = useFarmsWithBalance()
  const earningsSum = allPending.reduce((accum, pending) => {
    return accum + new BigNumber(pending.balance).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)
  const earningsBusd = new BigNumber(earningsSum).multipliedBy(usePriceWingsUsd()).toNumber()

  if (!account) {
    return (
      <Text fontSize="36px" color="text" style={{ lineHeight: '76px' }}>
        {t('Locked')}
      </Text>
    )
  }

  return (
    <Block>
      <CardValue value={earningsSum} lineHeight="1.5" />
      <CardBusdValue value={earningsBusd} />
    </Block>
  )
}

export default CakeHarvestBalance
