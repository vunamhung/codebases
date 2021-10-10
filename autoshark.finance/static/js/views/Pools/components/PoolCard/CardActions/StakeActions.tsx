import React, { useState } from 'react'
import {
  Flex,
  Text,
  Button,
  IconButton,
  AddIcon,
  MinusIcon,
  useModal,
  Skeleton,
  useTooltip,
} from '@autoshark-finance/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { Pool } from 'state/types'
import useToast from 'hooks/useToast'
import Balance from 'components/Balance'
import NotEnoughTokensModal from '../Modals/NotEnoughTokensModal'
import StakeModal from '../Modals/StakeModal'
import useUnstakePool from '../../../hooks/useUnstakePool'

interface StakeActionsProps {
  pool: Pool
  stakingTokenBalance: BigNumber
  stakedBalance: BigNumber
  isStaked: ConstrainBoolean
  isLoading?: boolean
}

const StakeAction: React.FC<StakeActionsProps> = ({
  pool,
  stakingTokenBalance,
  stakedBalance,
  isStaked,
  isLoading = false,
}) => {
  const { stakingToken, stakingTokenPrice, stakingLimit, isFinished, userData } = pool
  const { t } = useTranslation()
  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  )
  const [pendingTx, setPendingTx] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { onUnstake } = useUnstakePool(pool.sousId, pool.enableEmergencyWithdraw)

  const handleWithdrawAll = async () => {
    setPendingTx(true)
    try {
      await onUnstake(stakedBalance.toString())
      toastSuccess(
        `${t('Unstaked')}!`,
        t('You have withdrawn successfully', {
          symbol: pool.earningToken.symbol,
        }),
      )
      setPendingTx(false)
    } catch (e) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setPendingTx(false)
    }
  }

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const [onPresentStake] = useModal(
    <StakeModal pool={pool} stakingTokenBalance={stakingTokenBalance} stakingTokenPrice={stakingTokenPrice} />,
  )

  const [onPresentUnstake] = useModal(
    <StakeModal
      stakingTokenBalance={stakingTokenBalance}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
      isRemovingStake
    />,
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('You’ve already staked the maximum amount you can stake in this pool!'),
    { placement: 'bottom' },
  )

  const reachStakingLimit = stakingLimit.gt(0) && userData.stakedBalance.gte(stakingLimit)

  const renderStakeAction = () => {
    return isStaked ? (
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          <>
            <Balance bold fontSize="20px" decimals={3} value={stakedTokenBalance} />
            {stakingTokenPrice !== 0 && (
              <Text fontSize="12px" color="textSubtle">
                <Balance fontSize="12px" color="textSubtle" decimals={2} value={stakedTokenDollarBalance} prefix="$ " />
              </Text>
            )}
          </>
        </Flex>
        {!(pool.enableEmergencyWithdraw && pool.disableRewards) && (
          <Flex>
            <IconButton variant="secondary" onClick={onPresentUnstake} mr="6px">
              <MinusIcon color="primary" width="24px" />
            </IconButton>
            {reachStakingLimit ? (
              <span ref={targetRef}>
                <IconButton variant="secondary" disabled>
                  <AddIcon color="textDisabled" width="24px" height="24px" />
                </IconButton>
              </span>
            ) : (
              <IconButton
                variant="secondary"
                onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}
                disabled={isFinished}
              >
                <AddIcon color="primary" width="24px" height="24px" />
              </IconButton>
            )}
          </Flex>
        )}
        {pool.enableEmergencyWithdraw && pool.disableRewards && (
          <Flex onClick={handleWithdrawAll}>
            <Button isLoading={pendingTx}>{t('Withdraw All')}</Button>
          </Flex>
        )}
        {tooltipVisible && tooltip}
      </Flex>
    ) : (
      <Button disabled={isFinished} onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}>
        {t('Stake')}
      </Button>
    )
  }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
}

export default StakeAction
