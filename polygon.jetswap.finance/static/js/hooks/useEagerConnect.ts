import { useEffect } from 'react'
import { connectorLocalStorageKey, ConnectorNames } from 'jetswap-uikit-polygon'
import useAuth from 'hooks/useAuth'

const useEagerConnect = () => {
  const { login } = useAuth()

  useEffect(() => {
    const connectorId = window.localStorage.getItem(connectorLocalStorageKey) as ConnectorNames

    // Disable eager connect for Polygon Wallet. Currently the Polygon Wallet extension does not inject BinanceChain
    // into the Window object in time causing it to throw an error
    // TODO: Figure out an elegant way to listen for when the BinanceChain object is ready
    if (connectorId) {
      login(connectorId)
    }
  }, [login])
}

export default useEagerConnect
