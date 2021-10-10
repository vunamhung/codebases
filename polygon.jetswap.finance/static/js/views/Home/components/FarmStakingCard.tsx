import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button } from 'jetswap-uikit-polygon'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import UnlockButton from 'components/UnlockButton'
import CakeHarvestBalance from './CakeHarvestBalance'
import CakeWalletBalance from './CakeWalletBalance'

const StyledFarmStakingCard = styled(Card)`
  background-image: url('/images/assets/cardbg.svg');
  background-repeat: no-repeat;
  min-height: 376px;
`
const StyledUnlockButton = styled(UnlockButton)`
  background: ${({ theme }) => theme.colors.button};
  color: #ffffff;
  width: 100%;
  border-radius: 7px;
`

const Block = styled.div`
  margin-bottom: 16px;
`

const CardImage = styled.img`
  margin-bottom: 16px;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textDisabled};
  font-size: 18px;
`

const Actions = styled.div`
  margin-top: 24px;
`

const FarmedStakingCard = () => {
  const [pendingTx, setPendingTx] = useState(false)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const farmsWithBalance = useFarmsWithBalance()
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)

  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward])

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Heading size="xl" mb="24px">
          {t('Farms & Staking')}
        </Heading>
        <CardImage src="/images/assets/WINGS.svg" alt="wings logo" width={64} height={64} />
        <Block>
          <Label>{t('pWINGS to Harvest')}:</Label>
          <CakeHarvestBalance />
        </Block>
        <Block>
          <Label>{t('pWINGS in Wallet')}:</Label>
          <CakeWalletBalance />
        </Block>
        <Actions>
          {account ? (
            <Button
              id="harvest-all"
              disabled={balancesWithValue.length <= 0 || pendingTx}
              onClick={harvestAllFarms}
              width="100%"
            >
              {pendingTx
                ? t('Collecting pWINGS')
                : t(`Harvest all (%count%)`, {
                    count: balancesWithValue.length,
                  })}
            </Button>
          ) : (
            <StyledUnlockButton width="100%" />
          )}
        </Actions>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default FarmedStakingCard
