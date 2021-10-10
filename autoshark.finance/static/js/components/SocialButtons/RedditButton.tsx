import React from 'react'
import { Text, Flex } from '@autoshark-finance/uikit'
import styled from 'styled-components'
import { RedditShareButton } from 'react-share'
// import { useTranslation } from 'contexts/Localization'

const RedditIcon = styled.img`
  width: 16px;
  height: 16px;
`

const RedditBtn = styled(RedditShareButton)`
  background-color: #FF5700 !important;
  border-radius: 6px !important;
  height: 32px !important;
  padding: 0 16px !important;
`

const RedditButton = ({ url, title, disabled }: { url: string; title?: string | undefined; disabled?: boolean }) => {
  // const { t } = useTranslation()

  return (
    <>
      <RedditBtn url={url} disabled={disabled} title={title}>
        <Flex alignItems="center">
          <Text fontSize="14px" mr="4px">
            Reddit
          </Text>{' '}
          <RedditIcon src="/images/social-icons/reddit.svg" alt="reddit" />
        </Flex>
      </RedditBtn>
    </>
  )
}

export default RedditButton
