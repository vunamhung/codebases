import { ChainId } from '@autoshark-finance/sdk'
import addresses from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import { Address } from 'config/constants/types'

export const getAddress = (address: Address): string => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  return address[chainId] ? address[chainId] : address[ChainId.MAINNET]
}

export const getJawsAddress = () => {
  return getAddress(tokens.jaws.address)
}
export const getFinsAddress = () => {
  return getAddress(tokens.fins.address)
}
export const getCakeAddress = () => {
  return getAddress(tokens.cake.address)
}
export const getMasterChefAddress = () => {
  return getAddress(addresses.masterChef)
}
export const getOceanMasterChefAddress = () => {
  return getAddress(addresses.oceanMasterChef)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
}
export const getWbnbAddress = () => {
  return getAddress(tokens.wbnb.address)
}
export const getBusdAddress = () => {
  return getAddress(tokens.busd.address)
}
export const getLotteryV2Address = () => {
  return getAddress(addresses.lotteryV2)
}
export const getPancakeProfileAddress = () => {
  return getAddress(addresses.pancakeProfile)
}
export const getPancakeRabbitsAddress = () => {
  return getAddress(addresses.pancakeRabbits)
}
export const getBunnyFactoryAddress = () => {
  return getAddress(addresses.bunnyFactory)
}
export const getClaimRefundAddress = () => {
  return getAddress(addresses.claimRefund)
}
export const getPointCenterIfoAddress = () => {
  return getAddress(addresses.pointCenterIfo)
}
export const getBunnySpecialAddress = () => {
  return getAddress(addresses.bunnySpecial)
}
export const getTradingCompetitionAddress = () => {
  return getAddress(addresses.tradingCompetition)
}
export const getEasterNftAddress = () => {
  return getAddress(addresses.easterNft)
}
export const getCakeVaultAddress = () => {
  return getAddress(addresses.cakeVault)
}
export const getPredictionsAddress = () => {
  return getAddress(addresses.predictions)
}
export const getChainlinkOracleAddress = () => {
  return getAddress(addresses.chainlinkOracle)
}
export const getBunnySpecialCakeVaultAddress = () => {
  return getAddress(addresses.bunnySpecialCakeVault)
}
export const getBunnySpecialPredictionAddress = () => {
  return getAddress(addresses.bunnySpecialPrediction)
}
export const getNullAddress = () => {
  return '0x0000000000000000000000000000000000000000'
}
export const getDeadAddress = () => {
  return '0x000000000000000000000000000000000000dEaD'
}
export const getNFTControllerAddress = () => {
  return '0xc404446f0C5f93D665Cf905fEa7ef0C3b31deb41'
}
export const getNFTForgeAddress = () => {
  return '0xEF89314f36D5f64C3B4dc70cD7Eb7eda0B3618a9'
}
export const getNFTMarketplaceAddress = () => {
  return '0x7579Cc6c2edC67Cf446bA11C4FfFae874A6808C0'
}
export const getNFTSeries1Address = () => {
  return '0x13e14f6EC8fee53b69eBd4Bd69e35FFCFe8960DE'
}
export const getNFTSeries2Address = () => {
  return '0x13e14f6EC8fee53b69eBd4Bd69e35FFCFe8960DE'
}
export const getNFTHammer1Address = () => {
  return '0xcA56AF4bde480B3c177E1A4115189F261C2af034'
}
export const getPCSJAWSBNBAddress = () => {
  return "0x9348B45c542db53FE750F01F014BF6ae04b1395a";
}
export const getSwapMiningAddress = () => {
  return "0xb817f55bff9e8a3bF50601fc089cd439d3480084";
}
