import { Trade } from '@autoshark-finance/sdk'
import { useSwapMining } from 'hooks/useContract'
import { useEffect, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import useGetSingleTokenPrice from 'state/swap/useGetSingleTokenPrice'
import { usePriceFinsBusd } from 'state/vaults/hooks'

export const useTradingRebatesAmount = (trade: Trade) => {
  const contract = useSwapMining()
  const [hasTradingRebates, setHasTradingRebates] = useState(false)
  const [rebateAmount, setRebateAmount] = useState('')
  const pathLength = trade?.route.path.length
  const inputToken = trade?.route.path[0]?.address
  const outputToken = trade?.route.path[pathLength - 1]?.address
  const inputAmount = new BigNumber(trade?.inputAmount.toExact()).times(BIG_TEN.pow(18))
  const { price: inputPrice } = useGetSingleTokenPrice(inputToken)
  // const { price: outputPrice } = useGetSingleTokenPrice(outputToken)
  const outputPrice = usePriceFinsBusd()

  const query = useCallback(async () => {
    const isWhitelisted = await contract.isPathWhitelisted(trade?.route.path.map((item) => item.address))
    setHasTradingRebates(isWhitelisted)

    const _rebateAmount = new BigNumber(inputPrice)
      .times(inputAmount)
      .times(0.3)
      .div(100)
      .div(outputPrice)
      .times(trade?.route.path.length - 1)
      .times(1.2)
      .dp(0)
    setRebateAmount(_rebateAmount.toString())
  }, [contract, inputPrice, outputPrice, inputAmount, trade?.route.path])

  useEffect(() => {
    if (inputToken && outputToken && inputAmount.gt(new BigNumber(0))) {
      query()
    }
  }, [query, inputToken, outputToken, inputAmount])

  return { hasTradingRebates, amount: rebateAmount, query }
}
