import React from 'react'
import { Button, Text, useModal, Flex, TooltipText, useTooltip, Skeleton, Heading } from '@autoshark-finance/uikit'
import { useTranslation } from 'contexts/Localization'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

const EmergencyWithdrawalMessage: React.FunctionComponent = () => {
  const { t } = useTranslation()
  return (
    <ActionContainer>
      <Text display="inline" color="primary" mb="10px">
        {t('Rewards have been disabled for this Ocean.')}{" "}
      </Text>
      <Text display="inline">
        {t(
          'Please unstake your tokens and re-stake them in other Live Oceans.',
        )}
      </Text>
    </ActionContainer>
  )
}

export default EmergencyWithdrawalMessage
