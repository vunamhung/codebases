import BigNumber from 'bignumber.js'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'
import { filterVaultsByQuoteToken } from 'utils/vaultsPriceHelpers'
import { Vault } from 'state/types'

const getVaultFromTokenSymbol = (vaults: Vault[], tokenSymbol: string, preferredQuoteTokens?: string[]): Vault => {
  const vaultsWithTokenSymbol = vaults.filter((vault) => vault.token.symbol === tokenSymbol)
  const filteredVault = filterVaultsByQuoteToken(vaultsWithTokenSymbol, preferredQuoteTokens)
  return filteredVault
}

const getVaultBaseTokenPrice = (vault: Vault, quoteTokenVault: Vault, bnbPriceBusd: BigNumber): BigNumber => {
  const hasTokenPriceVsQuote = Boolean(vault.tokenPriceVsQuote)

  if (vault.quoteToken.symbol === 'BUSD') {
    return hasTokenPriceVsQuote ? new BigNumber(vault.tokenPriceVsQuote) : BIG_ZERO
  }

  if (vault.quoteToken.symbol === 'wBNB') {
    return hasTokenPriceVsQuote ? bnbPriceBusd.times(vault.tokenPriceVsQuote) : BIG_ZERO
  }

  // We can only calculate profits without a quoteTokenVault for BUSD/BNB vaults
  if (!quoteTokenVault) {
    return BIG_ZERO
  }

  // Possible alternative vault quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the vault's quote token isn't BUSD or wBNB, we then use the quote token, of the original vault's quote token
  // i.e. for vault PNT - pBTC we use the pBTC vault's quote token - BNB, (pBTC - BNB)
  // from the BNB - pBTC price, we can calculate the PNT - BUSD price
  if (quoteTokenVault.quoteToken.symbol === 'wBNB') {
    const quoteTokenInBusd = bnbPriceBusd.times(quoteTokenVault.tokenPriceVsQuote)
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(vault.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  if (quoteTokenVault.quoteToken.symbol === 'BUSD') {
    const quoteTokenInBusd = quoteTokenVault.tokenPriceVsQuote
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(vault.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  // Catch in case token does not have immediate or once-removed BUSD/wBNB quoteToken
  return BIG_ZERO
}

const getVaultQuoteTokenPrice = (vault: Vault, quoteTokenVault: Vault, bnbPriceBusd: BigNumber): BigNumber => {
  if (vault.quoteToken.symbol === 'BUSD') {
    return BIG_ONE
  }

  if (vault.quoteToken.symbol === 'wBNB') {
    return bnbPriceBusd
  }

  if (!quoteTokenVault) {
    return BIG_ZERO
  }

  if (quoteTokenVault.quoteToken.symbol === 'wBNB') {
    return quoteTokenVault.tokenPriceVsQuote ? bnbPriceBusd.times(quoteTokenVault.tokenPriceVsQuote) : BIG_ZERO
  }

  if (quoteTokenVault.quoteToken.symbol === 'BUSD') {
    return quoteTokenVault.tokenPriceVsQuote ? new BigNumber(quoteTokenVault.tokenPriceVsQuote) : BIG_ZERO
  }

  return BIG_ZERO
}

const fetchVaultsPrices = async (vaults) => {
  const bnbBusdVault = vaults.find((vault: Vault) => vault.pid === 252)
  const bnbPriceBusd = bnbBusdVault.tokenPriceVsQuote ? BIG_ONE.div(bnbBusdVault.tokenPriceVsQuote) : BIG_ZERO

  const vaultsWithPrices = vaults.map((vault) => {
    const quoteTokenVault = getVaultFromTokenSymbol(vaults, vault.quoteToken.symbol)
    const baseTokenPrice = getVaultBaseTokenPrice(vault, quoteTokenVault, bnbPriceBusd)
    const quoteTokenPrice = getVaultQuoteTokenPrice(vault, quoteTokenVault, bnbPriceBusd)
    const token = { ...vault.token, busdPrice: baseTokenPrice.toJSON() }
    const quoteToken = { ...vault.quoteToken, busdPrice: quoteTokenPrice.toJSON() }

    return { ...vault, token, quoteToken }
  })

  return vaultsWithPrices
}

export default fetchVaultsPrices
