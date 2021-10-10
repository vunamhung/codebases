import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT * 3,
}

export const stakeFarm = async (masterChefContract, pid, amount) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  if (pid === 0) {
    const tx = await masterChefContract.enterStaking(value, options)
    const receipt = await tx.wait()
    return receipt.status
  }

  const tx = await masterChefContract.deposit(pid, value, options)
  const receipt = await tx.wait()
  return receipt.status
}

export const unstakeFarm = async (masterChefContract, pid, amount) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  if (pid === 0) {
    const tx = await masterChefContract.leaveStaking(value, options)
    const receipt = await tx.wait()
    return receipt.status
  }

  const tx = await masterChefContract.withdraw(pid, value, options)
  const receipt = await tx.wait()
  return receipt.status
}

export const harvestFarm = async (masterChefContract, pid) => {
  if (pid === 0) {
    const tx = await await masterChefContract.leaveStaking('0', options)
    const receipt = await tx.wait()
    return receipt.status
  }

  const tx = await masterChefContract.deposit(pid, '0', options)
  const receipt = await tx.wait()
  return receipt.status
}

/**
 * Allows depositing NFT into slot, need to ensure TOKEN approval first
 * @param masterChefContract
 * @param nft address of NFT that you are depositing
 * @param tokenId tokenId of NFT that you are depositing
 * @param slot between 1 - 5 for each slot
 * @returns
 */
export const depositFarmNFT = async (masterChefContract, nft: string, tokenId: string, slot: string, pid: number) => {
  const estimate = await masterChefContract.estimateGas.depositNFT(nft, tokenId, slot, pid)
  const tx = await masterChefContract.depositNFT(nft, tokenId, slot, pid, { gasLimit: estimate.mul(2000).div(1000) })
  const receipt = await tx.wait()
  return receipt.status
}

/**
 * Allows withdrawing NFT from slot
 * @param masterChefContract
 * @param slot between 1 - 5 for each slot
 * @returns
 */
export const withdrawFarmNFT = async (masterChefContract, slot: string, pid: number) => {
  const estimate = await masterChefContract.estimateGas.withdrawNFT(slot, pid)
  const tx = await masterChefContract.withdrawNFT(slot, pid, { gasLimit: estimate.mul(2000).div(1000) })
  const receipt = await tx.wait()
  return receipt.status
}
