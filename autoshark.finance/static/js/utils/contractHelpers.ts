import { ethers } from 'ethers'
import { simpleRpcProvider } from 'utils/providers'
import { poolsConfig, dividendsConfig } from 'config/constants'
import { PoolCategory } from 'config/constants/types'

// Addresses
import {
  getAddress,
  getPancakeProfileAddress,
  getPancakeRabbitsAddress,
  getBunnyFactoryAddress,
  getBunnySpecialAddress,
  getCakeAddress,
  getLotteryV2Address,
  // getMasterChefAddress,
  getOceanMasterChefAddress,
  getPointCenterIfoAddress,
  getClaimRefundAddress,
  getTradingCompetitionAddress,
  getEasterNftAddress,
  getCakeVaultAddress,
  getPredictionsAddress,
  getChainlinkOracleAddress,
  getMulticallAddress,
  getBunnySpecialCakeVaultAddress,
  getBunnySpecialPredictionAddress,
  getJawsAddress,
  getFinsAddress,
  getPCSJAWSBNBAddress,
  getNFTMarketplaceAddress,
  getSwapMiningAddress,
} from 'utils/addressHelpers'

// ABI
import profileABI from 'config/abi/pancakeProfile.json'
import pancakeRabbitsAbi from 'config/abi/pancakeRabbits.json'
import bunnyFactoryAbi from 'config/abi/bunnyFactory.json'
import bunnySpecialAbi from 'config/abi/bunnySpecial.json'
import bep20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import cakeAbi from 'config/abi/cake.json'
import ifoV1Abi from 'config/abi/ifoV1.json'
import ifoV2Abi from 'config/abi/ifoV2.json'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import masterChef from 'config/abi/masterchef.json'
import masterChefNFT from 'config/abi/masterchefNFT.json'
import genericVault from 'config/abi/genericVault.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefV2 from 'config/abi/sousChefV2.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import claimRefundAbi from 'config/abi/claimRefund.json'
import dividendPoolAbi from 'config/abi/dividendPool.json'
import tradingCompetitionAbi from 'config/abi/tradingCompetition.json'
import easterNftAbi from 'config/abi/easterNft.json'
import cakeVaultAbi from 'config/abi/cakeVault.json'
import predictionsAbi from 'config/abi/predictions.json'
import chainlinkOracleAbi from 'config/abi/chainlinkOracle.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import bunnySpecialCakeVaultAbi from 'config/abi/bunnySpecialCakeVault.json'
import bunnySpecialPredictionAbi from 'config/abi/bunnySpecialPrediction.json'
import sharkNFTABI from 'config/abi/sharkNFT.json'
import nftForgeAbi from 'config/abi/nftForge.json'
import nftMarketplaceAbi from 'config/abi/nftMarketplace.json'
import swapMiningAbi from 'config/abi/swapMining.json'
import { ChainLinkOracleContract, PredictionsContract } from './types'

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider
  return new ethers.Contract(address, abi, signerOrProvider)
}

export const getBep20Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bep20Abi, address, signer)
}
export const getErc721Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(erc721Abi, address, signer)
}
export const getLpContract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(lpTokenAbi, address, signer)
}
export const getIfoV1Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(ifoV1Abi, address, signer)
}
export const getIfoV2Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(ifoV2Abi, address, signer)
}
export const getSouschefContract = (id: number, signer?: ethers.Signer | ethers.providers.Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const abi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
  return getContract(abi, getAddress(config.contractAddress), signer)
}
export const getSouschefV2Contract = (id: number, signer?: ethers.Signer | ethers.providers.Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  return getContract(sousChefV2, getAddress(config.contractAddress), signer)
}
export const getPointCenterIfoContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(pointCenterIfo, getPointCenterIfoAddress(), signer)
}
export const getCakeContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(cakeAbi, getCakeAddress(), signer)
}
export const getProfileContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(profileABI, getPancakeProfileAddress(), signer)
}
export const getPancakeRabbitContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(pancakeRabbitsAbi, getPancakeRabbitsAddress(), signer)
}
export const getBunnyFactoryContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bunnyFactoryAbi, getBunnyFactoryAddress(), signer)
}
export const getBunnySpecialContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bunnySpecialAbi, getBunnySpecialAddress(), signer)
}
export const getLotteryV2Contract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(lotteryV2Abi, getLotteryV2Address(), signer)
}
export const getMasterchefContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(masterChef, getOceanMasterChefAddress(), signer)
}
export const getClaimRefundContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(claimRefundAbi, getClaimRefundAddress(), signer)
}
export const getTradingCompetitionContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(tradingCompetitionAbi, getTradingCompetitionAddress(), signer)
}
export const getEasterNftContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(easterNftAbi, getEasterNftAddress(), signer)
}
export const getCakeVaultContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(cakeVaultAbi, getCakeVaultAddress(), signer)
}

export const getPredictionsContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(predictionsAbi, getPredictionsAddress(), signer) as PredictionsContract
}

export const getChainlinkOracleContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(chainlinkOracleAbi, getChainlinkOracleAddress(), signer) as ChainLinkOracleContract
}
export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress(), signer)
}
export const getBunnySpecialCakeVaultContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bunnySpecialCakeVaultAbi, getBunnySpecialCakeVaultAddress(), signer)
}
export const getBunnySpecialPredictionContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bunnySpecialPredictionAbi, getBunnySpecialPredictionAddress(), signer)
}
export const getVaultContract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(genericVault, address, signer)
}
export const getDividendContract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const config = dividendsConfig.find((pool) => getAddress(pool.contractAddress) === address)
  return getContract(dividendPoolAbi, getAddress(config.contractAddress), signer)
}
export const getJawsContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(cakeAbi, getJawsAddress(), signer)
}
export const getFinsContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(cakeAbi, getFinsAddress(), signer)
}
export const getPcsJawsBnbContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(cakeAbi, getPCSJAWSBNBAddress(), signer)
}
export const getSharkNFTContract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(sharkNFTABI, address, signer)
}
export const getForgeContract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(nftForgeAbi, address, signer)
}
export const getNftMarketplaceContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(nftMarketplaceAbi, getNFTMarketplaceAddress(), signer)
}
export const getSpecificMasterchefContract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const abi = address === "0x8857Af8205F224870dea119e2c75AF386EFB192a" ? masterChefNFT : masterChef
  return getContract(abi, address, signer)
}
export const getSwapMiningContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(swapMiningAbi, getSwapMiningAddress(), signer)
}
