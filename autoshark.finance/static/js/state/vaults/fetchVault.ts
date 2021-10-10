import { Vault } from 'state/types'
import fetchPublicVaultData from './fetchPublicVaultData'
import { MintRates } from './fetchVaultMint'

const fetchVault = async (vault: Vault, mintRates: MintRates): Promise<Vault> => {
  const vaultPublicData = await fetchPublicVaultData(vault, mintRates)

  return { ...vault, ...vaultPublicData }
}

export default fetchVault
