import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Text, Link, ArrowForwardIcon } from '@autoshark-finance/uikit'
import { useTranslation } from 'contexts/Localization'

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`

const StyledCard = styled(Card)`
  width: 100%;
  flex: 1;

  &:hover {
    background-color: #121212;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 285px;
  }
`

const ApplyForOceanCard = () => {
  const { t } = useTranslation()
  return (
    <StyledLink external href="https://docs.google.com/forms/d/e/1FAIpQLSeO31YaJsv-yofrNDBY9odgU5CVMz-VspWMze5mfU8WesGIUg/viewform">
      <StyledCard>
        <CardBody>
          <div style={{ marginBottom: '5px' }}>
            <Text fontSize="14px" bold color="textSubtle">
              {t(`Want to start your own Ocean with AutoShark?`)}
            </Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Text textTransform="uppercase" marginTop="2px" marginRight="2px" fontSize="13.5px" bold color="textSubtle">
              {t('APPLY NOW')}
            </Text>
            <ArrowForwardIcon />
          </div>
        </CardBody>
      </StyledCard>
    </StyledLink>
  )
}

export default ApplyForOceanCard
