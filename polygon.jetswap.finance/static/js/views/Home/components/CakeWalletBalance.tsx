import React from 'react'
import { Text } from 'jetswap-uikit-polygon'
import { useWeb3React } from '@web3-react/core'
import useTokenBalance from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import { getWingsAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceWingsUsd } from 'state/hooks'
import { BigNumber } from 'bignumber.js'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'

const CakeWalletBalance = () => {
  const { t } = useTranslation()
  const wingsBalance = useTokenBalance(getWingsAddress())
  const busdBalance = new BigNumber(getBalanceNumber(wingsBalance)).multipliedBy(usePriceWingsUsd()).toNumber()
  const { account } = useWeb3React()

  if (!account) {
    return (
      <Text fontSize="36px" color="text" style={{ lineHeight: '54px' }}>
        {t('Locked')}
      </Text>
    )
  }

  return (
    <>
      <CardValue value={getBalanceNumber(wingsBalance)} decimals={4} fontSize="24px" lineHeight="36px" />
      <CardBusdValue value={busdBalance} />
    </>
  )
}

export default CakeWalletBalance
