import React from 'react'
import { Text, Flex } from '@autoshark-finance/uikit'
import styled from 'styled-components'
import { TelegramShareButton } from 'react-share'
// import { useTranslation } from 'contexts/Localization'

const TelegramIcon = styled.img`
  width: 16px;
  height: 16px;
`

const TelegramBtn = styled(TelegramShareButton)`
  background-color: #0088cc !important;
  border-radius: 6px !important;
  height: 32px !important;
  padding: 0 16px !important;
`

const TelegramButton = ({ url, title, disabled }: { url: string; title?: string | undefined; disabled?: boolean }) => {
  // const { t } = useTranslation()

  return (
    <>
      <TelegramBtn url={url} disabled={disabled} title={title}>
        <Flex alignItems="center">
          <Text fontSize="14px" mr="4px">
            Telegram
          </Text>{' '}
          <TelegramIcon src="/images/social-icons/telegram.svg" alt="telegram" />
        </Flex>
      </TelegramBtn>
    </>
  )
}

export default TelegramButton
