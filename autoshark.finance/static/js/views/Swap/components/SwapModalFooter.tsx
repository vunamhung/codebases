import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Trade, TradeType } from '@autoshark-finance/sdk'
import { Button, Text, AutoRenewIcon } from '@autoshark-finance/uikit'
import { Field } from 'state/swap/actions'
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  computeRebate,
  formatExecutionPrice,
  warningSeverity,
} from 'utils/prices'
import { AutoColumn } from 'components/Layout/Column'
import QuestionHelper from 'components/QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import { useTranslation } from 'contexts/Localization'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'

const SwapModalFooterContainer = styled(AutoColumn)`
  margin-top: 24px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
  hasTradingRebates,
  tradingRebatesAmount,
}: {
  trade: Trade
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
  hasTradingRebates: boolean
  tradingRebatesAmount: string
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade],
  )
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)
  const { tradingRebate } = computeRebate(tradingRebatesAmount)
  const { t } = useTranslation()

  return (
    <>
      <SwapModalFooterContainer>
        <RowBetween align="center">
          <Text fontSize="14px">Price</Text>
          <Text
            fontSize="14px"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            {formatExecutionPrice(trade, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <AutoRenewIcon width="14px" />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">
              {trade.tradeType === TradeType.EXACT_INPUT ? t('Minimum received') : t('Maximum sold')}
            </Text>
            <QuestionHelper
              text={t(
                'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
              )}
              ml="4px"
            />
          </RowFixed>
          <RowFixed>
            <Text fontSize="14px">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </Text>
            <Text fontSize="14px" marginLeft="4px">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{t('Price Impact')}</Text>
            <QuestionHelper
              text={t('The difference between the market price and estimated price due to trade size.')}
              ml="4px"
            />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px" color="textSubtle">
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
          <Text fontSize="14px">
            {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
          </Text>
        </RowBetween>
        {hasTradingRebates && (
          <RowBetween>
            <RowFixed>
              <Text fontSize="14px" color="secondary">
                {t('Fee Rebate')}
              </Text>
              {/* <QuestionHelper
                text={
                  <>
                    <Text mb="12px">
                      For each trade, we return a portion of trading fees up to 150% of your fees incurred through us
                    </Text>
                    <Text>- 0.20% charged by AutoShark and returned as JAWS (Up to 150% return)</Text>
                    <Text>- 0.25% charged by main exchange (PCS)</Text>
                  </>
                }
                ml="4px"
              /> */}
            </RowFixed>
            <Text color="secondary" fontSize="14px">
              {hasTradingRebates ? `~${tradingRebate.toSignificant(4)} FINS` : '-'}
            </Text>
          </RowBetween>
        )}
      </SwapModalFooterContainer>

      <AutoRow>
        <Button
          variant={severity > 2 ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={disabledConfirm}
          mt="12px"
          id="confirm-swap-or-send"
          width="100%"
        >
          {severity > 2 ? 'Swap Anyway' : 'Confirm Swap'}
        </Button>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
