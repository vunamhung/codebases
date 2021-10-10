import { VaultConfig } from 'config/constants/types'
import fetchVault from './fetchVault'
import { MintRates } from './fetchVaultMint'

const fetchVaults = async (vaultsToFetch: VaultConfig[], mintRates: MintRates) => {
  const data = await Promise.all(
    vaultsToFetch.map(async (vaultConfig) => {
      const vault = await fetchVault(vaultConfig, mintRates)
      return vault
    }),
  )
  return data
}

export default fetchVaults
