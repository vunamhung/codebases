import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { getNullAddress } from 'utils/addressHelpers'

export const stakeVault = async (vaultContract, vaultAddress, amount) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  // TODO: account for special vaults here next time
  if (vaultAddress === 0) {
    const tx = await vaultContract.deposit(value, getNullAddress())
    const receipt = await tx.wait()
    return receipt.status
  }
  const estimate = await vaultContract.estimateGas.deposit(value, getNullAddress())
  const tx = await vaultContract.deposit(value, getNullAddress(), { gasLimit: estimate.mul(1500).div(1000) })
  const receipt = await tx.wait()
  return receipt.status
}

export const unstakeVault = async (vaultContract, vaultAddress, amount) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  // TODO: account for special vaults here next time
  if (vaultAddress === 0) {
    const estimate = await vaultContract.estimateGas.withdrawUnderlying(value)
    const tx = await vaultContract.withdraw(value, { gasLimit: estimate.mul(2000).div(1000) })
    const receipt = await tx.wait()
    return receipt.status
  }
  const estimate = await vaultContract.estimateGas.withdrawUnderlying(value)
  const tx = await vaultContract.withdrawUnderlying(value, { gasLimit: estimate.mul(2000).div(1000) })
  const receipt = await tx.wait()
  return receipt.status
}

/**
 * This allows us to CLAIM & WITHDRAW
 * @param vaultContract Thi
 * @param vaultAddress
 * @param amount
 * @returns
 */
export const unstakeAllVault = async (vaultContract, vaultAddress) => {
  const estimate = await vaultContract.estimateGas.withdrawAll()
  // TODO: account for special vaults here next time
  if (vaultAddress === 0) {
    const tx = await vaultContract.withdrawAll({ gasLimit: estimate.mul(2000).div(1000) })
    const receipt = await tx.wait()
    return receipt.status
  }

  const tx = await vaultContract.withdrawAll({ gasLimit: estimate.mul(2000).div(1000) })
  const receipt = await tx.wait()
  return receipt.status
}

export const harvestVault = async (vaultContract, _vaultAddress) => {
  const estimate = await vaultContract.estimateGas.getReward()
  const tx = await vaultContract.getReward({ gasLimit: estimate.mul(2000).div(1000) })
  const receipt = await tx.wait()
  return receipt.status
}

/**
 * Allows depositing NFT into slot, need to ensure TOKEN approval first
 * @param vaultContract
 * @param nft address of NFT that you are depositing
 * @param tokenId tokenId of NFT that you are depositing
 * @param slot between 1 - 5 for each slot
 * @returns
 */
export const depositNFT = async (vaultContract, nft: string, tokenId: string, slot: string) => {
  const estimate = await vaultContract.estimateGas.depositNFT(nft, tokenId, slot)
  const tx = await vaultContract.depositNFT(nft, tokenId, slot, { gasLimit: estimate.mul(2000).div(1000) })
  const receipt = await tx.wait()
  return receipt.status
}

/**
 * Allows withdrawing NFT from slot
 * @param vaultContract
 * @param slot between 1 - 5 for each slot
 * @returns
 */
export const withdrawNFT = async (vaultContract, slot: string) => {
  const estimate = await vaultContract.estimateGas.withdrawNFT(slot)
  const tx = await vaultContract.withdrawNFT(slot, { gasLimit: estimate.mul(2000).div(1000) })
  const receipt = await tx.wait()
  return receipt.status
}
