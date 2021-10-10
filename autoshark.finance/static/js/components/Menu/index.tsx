import React from 'react'
import { Menu as UikitMenu, Text, CheckmarkIcon, useMatchBreakpoints } from '@autoshark-finance/uikit'
import styled, { keyframes } from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useAuth from 'hooks/useAuth'
import { usePriceJawsBusd, usePriceFinsBusd } from 'state/vaults/hooks'
import { useProfile } from 'state/profile/hooks'
import config from './config'
import UserMenu from './UserMenu'
import ChainToggler from './ChainToggler'

const ChainTogglerContainer = styled.div`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: inline-flex;
  }
`

// const orangePulseAnim = () => keyframes`
//   0% {
//     transform: scale(0.95);
//     box-shadow: 0 0 0 0 rgba(255, 177, 66, 0.7);
//   }

//   70% {
//     transform: scale(1);
//     box-shadow: 0 0 0 10px rgba(255, 177, 66, 0);
//   }

//   100% {
//     transform: scale(0.95);
//     box-shadow: 0 0 0 0 rgba(255, 177, 66, 0);
//   }
// `

const greenPulseAnim = () => keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(49, 208, 170, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 7px rgba(49, 208, 170, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(49, 208, 170, 0);
  }
`

const DoneIcon = styled.div`
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  margin: 10px;
  height: 7px;
  width: 7px;
  transform: scale(1);
  background: ${({ theme }) => theme.colors.success};
  box-shadow: 0 0 0 0 rgba(255, 177, 66, 1);
  animation: ${greenPulseAnim} 2s infinite;
`

// const WaitIcon = styled.div`
//   border-radius: 50%;
//   box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
//   margin: 10px;
//   height: 10px;
//   width: 10px;
//   transform: scale(1);
//   background: rgba(255, 177, 66, 1);
//   box-shadow: 0 0 0 0 rgba(255, 177, 66, 1);
//   animation: ${orangePulseAnim} 2s infinite;
// `

const CertikContainer = styled.div`
  ${({ theme }) => theme.mediaQueries.sm} {
    display: inline-flex;
    align-items: center;
    padding-top: 3px;
  }
`

const ExtraContainer = styled.div`
  display: none;

  ${({ theme }) => theme.mediaQueries.xl} {
    display: inline-flex;
    align-items: center;
    padding-top: 3px;
  }
`

const AuditLogo = styled.img<{ width: string }>`
  height: auto;
  width: ${({ width }) => width};
  margin-right: 10px;
`

const Menu = (props) => {
  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const jawsPriceUsd = usePriceJawsBusd()
  const finsPriceUsd = usePriceFinsBusd()
  const { profile } = useProfile()
  const { currentLanguage, setLanguage, t } = useTranslation()

  return (
    <UikitMenu
      chainToggler={
        <>
          <ChainTogglerContainer>
            <a href="https://www.certik.org/projects/autoshark" target="_blank" rel="noreferrer">
              <CertikContainer>
                <CheckmarkIcon margin="3px 5px 3px 0" color="success" />
                <div style={{ paddingTop: '4px' }}>
                  <AuditLogo width="80px" src="/images/certik.svg" alt="certik logo" />
                </div>
              </CertikContainer>
            </a>
            <a href="https://www.certik.org/projects/autoshark" target="_blank" rel="noreferrer">
              <ExtraContainer>
                <DoneIcon />
                <div style={{ paddingTop: '3px', marginRight: '10px' }}>
                  <Text>Skynet</Text>
                </div>
              </ExtraContainer>
            </a>
            <a href="https://www.certik.org/projects/autoshark" target="_blank" rel="noreferrer">
              <ExtraContainer>
                <DoneIcon />
                <div style={{ paddingTop: '3px', marginRight: '10px' }}>
                  <Text>CertikShield</Text>
                </div>
              </ExtraContainer>
            </a>
            <a href="https://immunefi.com/bounty/autoshark/" target="_blank" rel="noreferrer">
              <CertikContainer>
                <DoneIcon />
                <AuditLogo width="80px" src="/images/immunefi.svg" alt="immunefi logo" />
              </CertikContainer>
            </a>
            <a
              href="https://autosharkgw.gitbook.io/autoshark/audit#watchpug-audit-for-autoshark-v-2-0"
              target="_blank"
              rel="noreferrer"
            >
              <CertikContainer>
                <DoneIcon />
                <div style={{ paddingTop: '5px' }}>
                  <AuditLogo width="100px" src="/images/home/security/watchpug.png" alt="watchpug logo" />
                </div>
              </CertikContainer>
            </a>
            <ChainToggler />
          </ChainTogglerContainer>
        </>
      }
      userMenu={<UserMenu />}
      logoSrc="/images/jaws.png"
      account={account}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      finsPriceUsd={finsPriceUsd.toNumber()}
      jawsPriceUsd={jawsPriceUsd.toNumber()}
      links={config(t)}
      profile={{
        username: profile?.username,
        image: profile?.nft ? `/images/nfts/${profile.nft?.images.sm}` : undefined,
        profileLink: '/profile',
        noProfileLink: '/profile',
        showPip: !profile?.username,
      }}
      {...props}
    />
  )
}

export default Menu
