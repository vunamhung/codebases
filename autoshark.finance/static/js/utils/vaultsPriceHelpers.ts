import { Vault } from 'state/types'

/**
 * Returns the first vault with a quote token that matches from an array of preferred quote tokens
 * @param vaults Array of vaults
 * @param preferredQuoteTokens Array of preferred quote tokens
 * @returns A preferred vault, if found - or the first element of the vaults array
 */
export const filterVaultsByQuoteToken = (vaults: Vault[], preferredQuoteTokens: string[] = ['BUSD', 'wBNB']): Vault => {
  const preferredVault = vaults.find((vault) => {
    return preferredQuoteTokens.some((quoteToken) => {
      return vault.quoteToken.symbol === quoteToken
    })
  })
  return preferredVault || vaults[0]
}

export default filterVaultsByQuoteToken
