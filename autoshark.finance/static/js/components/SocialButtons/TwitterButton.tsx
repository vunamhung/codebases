import React from 'react'
import { Text, Flex } from '@autoshark-finance/uikit'
import styled from 'styled-components'
import { TwitterShareButton } from 'react-share'
// import { useTranslation } from 'contexts/Localization'

const TwitterIcon = styled.img`
  width: 16px;
  height: 16px;
`

const TwitterBtn = styled(TwitterShareButton)`
  background-color: #1da1f2 !important;
  border-radius: 6px !important;
  height: 32px !important;
  padding: 0 16px !important;
`

const TwitterButton = ({
  url,
  title,
  via,
  hashtags,
  related,
  disabled,
}: {
  url: string
  title?: string | undefined
  via?: string | undefined
  hashtags?: string[] | undefined
  related?: string[] | undefined
  disabled?: boolean
}) => {
  // const { t } = useTranslation()

  return (
    <>
      <TwitterBtn url={url} disabled={disabled} title={title} via={via} hashtags={hashtags} related={related}>
        <Flex alignItems="center">
          <Text fontSize="14px" mr="4px">
            Twitter
          </Text>{' '}
          <TwitterIcon src="/images/social-icons/twitter.svg" alt="twitter" />
        </Flex>
      </TwitterBtn>
    </>
  )
}

export default TwitterButton
