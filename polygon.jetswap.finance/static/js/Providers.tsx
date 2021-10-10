import React from 'react'
import { ModalProvider } from 'jetswap-uikit-polygon'
import { Web3ReactProvider } from '@web3-react/core'
import { Provider } from 'react-redux'
import { getLibrary } from 'utils/web3React'
import { LanguageProvider } from 'contexts/Localization'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import store from 'state'

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <ThemeContextProvider>
          <LanguageProvider>
            <RefreshContextProvider>
              <ModalProvider>{children}</ModalProvider>
            </RefreshContextProvider>
          </LanguageProvider>
        </ThemeContextProvider>
      </Provider>
    </Web3ReactProvider>
  )
}

export default Providers
