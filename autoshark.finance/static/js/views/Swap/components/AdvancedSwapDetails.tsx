import React from 'react'
import { Trade, TradeType } from '@autoshark-finance/sdk'
import { Text } from '@autoshark-finance/uikit'
import { Field } from 'state/swap/actions'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, computeRebate } from 'utils/prices'
import { AutoColumn } from 'components/Layout/Column'
import QuestionHelper from 'components/QuestionHelper'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { useTranslation } from 'contexts/Localization'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'

function TradeSummary({
  trade,
  allowedSlippage,
  hasTradingRebates,
  tradingRebatesAmount,
}: {
  trade: Trade
  allowedSlippage: number
  hasTradingRebates: boolean
  tradingRebatesAmount: string
}) {
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)
  const { tradingRebate } = computeRebate(tradingRebatesAmount)
  const { t } = useTranslation()

  return (
    <AutoColumn style={{ padding: '0 16px' }}>
      <RowBetween>
        <RowFixed>
          <Text fontSize="15px" color="textSubtle">
            {isExactIn ? t('Minimum received') : t('Maximum sold')}
          </Text>
          <QuestionHelper
            text={t(
              'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
            )}
            ml="4px"
          />
        </RowFixed>
        <RowFixed>
          <Text fontSize="15px">
            {isExactIn
              ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                '-'
              : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ?? '-'}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <RowFixed>
          <Text fontSize="15px" color="textSubtle">
            {t('Price Impact')}
          </Text>
          <QuestionHelper
            text={t('The difference between the market price and estimated price due to trade size.')}
            ml="4px"
          />
        </RowFixed>
        <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
      </RowBetween>

      <RowBetween>
        <RowFixed>
          <Text fontSize="15px" color="textSubtle">
            {t('Main Exchange Fee')}
          </Text>
          <QuestionHelper
            text={
              <>
                <Text mb="12px">{t('For each trade a ~0.3% fee is paid')}</Text>
                <Text>- 0.1% to {t('liquidity providers')}</Text>
                <Text>- 0.2% to {t('buyback FINS to form LP to redistribute back to FINS dividends pool')}</Text>
              </>
            }
            ml="4px"
          />
        </RowFixed>
        <Text fontSize="15px">
          {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
        </Text>
      </RowBetween>

      {hasTradingRebates && (
        <RowBetween>
          <RowFixed>
            <Text fontSize="15px" color="secondary">
              {t('Fee Rebate')}
            </Text>
          </RowFixed>
          <Text color="secondary" fontSize="15px">
            {hasTradingRebates ? `~${tradingRebate.toSignificant(4)} FINS` : '-'}
          </Text>
        </RowBetween>
      )}
    </AutoColumn>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
  hasTradingRebates: boolean
  tradingRebatesAmount: string
}

export function AdvancedSwapDetails({ trade, hasTradingRebates, tradingRebatesAmount }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = Boolean(trade && trade.route.path.length > 2)

  return (
    <AutoColumn gap="0px">
      {trade && (
        <>
          <TradeSummary
            trade={trade}
            allowedSlippage={allowedSlippage}
            hasTradingRebates={hasTradingRebates}
            tradingRebatesAmount={tradingRebatesAmount}
          />
          {showRoute && (
            <>
              <RowBetween style={{ padding: '0 16px' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Text fontSize="15px" color="textSubtle">
                    Route
                  </Text>
                  <QuestionHelper
                    text="Routing through these tokens resulted in the best price for your trade."
                    ml="4px"
                  />
                </span>
                <SwapRoute trade={trade} />
              </RowBetween>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}
