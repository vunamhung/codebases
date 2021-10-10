import React from 'react'
import { useWeb3React } from '@web3-react/core'
import styled, { keyframes } from 'styled-components'
import {
  Flex,
  LogoutIcon,
  useModal,
  UserMenu as UIKitUserMenu,
  UserMenuDivider,
  UserMenuItem,
  Text,
  CheckmarkIcon,
} from '@autoshark-finance/uikit'
import useAuth from 'hooks/useAuth'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useGetBnbBalance } from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import WalletModal, { WalletView, LOW_BNB_BALANCE } from './WalletModal'
import WalletUserMenuItem from './WalletUserMenuItem'
import ChainToggler from '../ChainToggler'

const AuditContainer = styled.div`
  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`

const ChainTogglerContainer = styled.div`
  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
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
    box-shadow: 0 0 0 5px rgba(49, 208, 170, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(49, 208, 170, 0);
  }
`

const DoneIcon = styled.div`
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  margin-right: 5px;
  margin-bottom: 5px;
  height: 5px;
  width: 5px;
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
  display: flex;
  align-items: center;
  justify-content: center;
`

const AuditLogo = styled.img<{ width: string }>`
  height: auto;
  width: ${({ width }) => width};
  margin-right: 10px;
`

const UserMenu = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { logout } = useAuth()
  const { balance } = useGetBnbBalance()
  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />)
  // const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)
  const hasLowBnbBalance = balance.lte(LOW_BNB_BALANCE)

  if (!account) {
    return <ConnectWalletButton scale="sm" />
  }

  return (
    <UIKitUserMenu account={account}>
      <AuditContainer>
        <div style={{ marginBottom: '5px' }}>
          <a href="https://www.certik.org/projects/autoshark" target="_blank" rel="noreferrer">
            <CertikContainer>
              <CheckmarkIcon margin="5px" color="success" />
              <AuditLogo width="80px" src="/images/certik.svg" alt="certik logo" />
            </CertikContainer>
          </a>
        </div>
        <div style={{ marginBottom: '5px' }}>
          <a href="https://www.certik.org/projects/autoshark" target="_blank" rel="noreferrer">
            <CertikContainer>
              <DoneIcon />
              <Text>Skynet</Text>
            </CertikContainer>
          </a>
        </div>
        <div style={{ marginBottom: '5px' }}>
          <a href="https://www.certik.org/projects/autoshark" target="_blank" rel="noreferrer">
            <CertikContainer>
              <DoneIcon />
              <Text>CertikShield</Text>
            </CertikContainer>
          </a>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <a href="https://immunefi.com/bounty/autoshark/" target="_blank" rel="noreferrer">
            <CertikContainer>
              <DoneIcon />
              <AuditLogo width="80px" src="/images/immunefi.svg" alt="immunefi logo" />
            </CertikContainer>
          </a>
        </div>

        <a
          href="https://autosharkgw.gitbook.io/autoshark/audit#watchpug-audit-for-autoshark-v-2-0"
          target="_blank"
          rel="noreferrer"
        >
          <CertikContainer>
            <DoneIcon />
            <AuditLogo width="100px" src="/images/home/security/watchpug.png" alt="watchpug logo" />
          </CertikContainer>
        </a>
      </AuditContainer>
      <ChainTogglerContainer>
        <ChainToggler />
      </ChainTogglerContainer>
      <WalletUserMenuItem hasLowBnbBalance={hasLowBnbBalance} onPresentWalletModal={onPresentWalletModal} />
      {/* <UserMenuItem as="button" onClick={onPresentTransactionModal}>
        {t('Transactions')}
      </UserMenuItem> */}
      <UserMenuDivider />
      <UserMenuItem as="button" onClick={logout}>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          {t('Disconnect')}
          <LogoutIcon />
        </Flex>
      </UserMenuItem>
    </UIKitUserMenu>
  )
}

export default UserMenu
