import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, Toggle, Text } from 'jetswap-uikit-polygon'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'

const PoolTabButtons = ({ stackedOnly, setStackedOnly }) => {
  const { url, isExact } = useRouteMatch()
  const { t } = useTranslation()
  const { isDark, toggleTheme } = useTheme()
  const textColor = isDark ? '' : '#2A2A2A'

  return (
    <Wrapper>
      <ToggleWrapper>
        <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />
        <Text> {t('Staked only')}</Text>
      </ToggleWrapper>
      <ButtonMenu activeIndex={isExact ? 0 : 1} scale="sm" variant="primary">
        <ButtonMenuItem as={Link} to={`${url}`} style={{ borderRadius: '30px', width: '100px', color: textColor }}>
          {t('Live')}
        </ButtonMenuItem>
        <ButtonMenuItem
          as={Link}
          to={`${url}/history`}
          style={{ borderRadius: '30px', width: '100px', color: textColor }}
        >
          {t('Finished')}
        </ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  )
}

export default PoolTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 32px;

  ${Text} {
    margin-left: 8px;
  }
`
