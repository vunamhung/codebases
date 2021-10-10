// import { StringFormatDefinition } from 'ajv'
import BigNumber from 'bignumber.js'
import { SerializedBigNumber, TranslatableText } from 'state/types'

export interface Address {
  97?: string
  56: string
}

export interface Token {
  symbol: string
  address?: Address
  decimals?: number
  projectLink?: string
  busdPrice?: string
}

export enum PoolIds {
  poolBasic = 'poolBasic',
  poolUnlimited = 'poolUnlimited',
}

export type IfoStatus = 'idle' | 'coming_soon' | 'live' | 'finished'

interface IfoPoolInfo {
  saleAmount: string
  raiseAmount: string
  cakeToBurn: string
  distributionRatio: number // Range [0-1]
}

export interface Ifo {
  id: string
  isActive: boolean
  address: string
  name: string
  description: string
  currency: Token
  token: Token
  releaseBlockNumber: number
  articleUrl: string
  campaignId: string
  tokenOfferingPrice: number
  version: number
  [PoolIds.poolBasic]?: IfoPoolInfo
  [PoolIds.poolUnlimited]: IfoPoolInfo
}

export enum PoolCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token
  'AUTO' = 'Auto',
}

export interface FarmConfig {
  pid: number
  lpSymbol: string
  lpAddresses: Address
  token: Token
  quoteToken: Token
  earningToken?: Token
  masterChef?: string
  masterChefOutput?: string
  pendingOutput?: string
  multiplier?: string
  isCommunity?: boolean
  farmType?: 0 | 1
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  }
}

export interface NFTConfig {
  series: number
  address: string
  max: number
}

export interface VaultConfig {
  pid: number
  lpSymbol: string
  lpAddresses: Address
  token: Token
  farmToken: Token
  quoteToken: Token
  multiplier?: string
  isCommunity?: boolean
  vaultAddress: string
  calculator: string
  dashboard: string
  masterChef: string
  proxyChef?: string
  masterChefOutput: string
  singleStake?: boolean
  maximizer?: boolean
  apex?: boolean
  whitelisted?: boolean
  deprecated?: boolean
  singleMaximizer?: boolean
  boostRate: number
  core?: boolean
  maximizerId?: number
  repeated?: boolean
  swap:
    | 'panther'
    | 'ape'
    | 'pancake'
    | 'warden'
    | 'biswap'
    | 'wault'
    | 'wault-poly'
    | 'autoshark'
    | 'polycrystal'
    | 'baby'
    | 'jet'
    | 'nova'
    | 'honey'
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  }
}

export interface PoolConfig {
  sousId: number
  earningToken: Token
  stakingToken: Token
  contractAddress: Address
  poolCategory: PoolCategory
  tokenPerBlock: string
  sortOrder?: number
  harvest?: boolean
  isFinished?: boolean
  hasEnd?: boolean
  hideAPR?: boolean
  manualAPR?: boolean
  depositFees?: boolean
  enableEmergencyWithdraw?: boolean
  isSmartChef?: boolean
  disableRewards?: boolean
}

export interface DividendConfig {
  id: number
  earningToken: Token
  stakingToken: Token
  contractAddress: Address
  sortOrder?: number
  harvest?: boolean
  isFinished?: boolean
  hasEnd?: boolean
  enableEmergencyWithdraw?: boolean
  boostRate: number
}

export type Images = {
  lg: string
  md: string
  sm: string
  ipfs?: string
}

export type Rarity = '1' | '2' | '3' | '4' | '5'
export type Series = '1000' | '1'

export type NftRarities = {
  [key in Rarity]: string
}

export type NftSeries = {
  [key in Series]: string
}

export type NftImages = {
  blur?: string
} & Images

export type NftVideo = {
  webm: string
  mp4: string
}

export type NftSource = {
  [key in NftType]: {
    address: Address
    identifierKey: string
  }
}

export enum NftType {
  PANCAKE = 'pancake',
  MIXIE = 'mixie',
}

// export type Nft = {
//   id: number
//   imgSrc: string
//   rarity?: number
//   tier?: number
// }

export type Nft = {
  id: number
  collection: string
  series?: string
  rarity?: number
  tier?: number
  image?: string

  description?: string
  name?: string
  images?: NftImages
  sortOrder?: number
  type?: NftType
  video?: NftVideo

  // Uniquely identifies the nft.
  // Used for matching an NFT from the config with the data from the NFT's tokenURI
  identifier?: string

  // Used to be "bunnyId". Used when minting NFT
  variationId?: number | string
}

export type TeamImages = {
  alt: string
} & Images

export type Team = {
  id: number
  name: string
  description: string
  isJoinable?: boolean
  users: number
  points: number
  images: TeamImages
  background: string
  textColor: string
}

export type CampaignType = 'ifo' | 'teambattle' | 'participation'

export type Campaign = {
  id: string
  type: CampaignType
  title?: TranslatableText
  description?: TranslatableText
  badge?: string
}

export type PageMeta = {
  title: string
  description?: string
  image?: string
}

export enum LotteryStatus {
  PENDING = 'pending',
  OPEN = 'open',
  CLOSE = 'close',
  CLAIMABLE = 'claimable',
}

export interface LotteryTicket {
  id: string
  number: string
  status: boolean
  rewardBracket?: number
  roundId?: string
  cakeReward?: SerializedBigNumber
}

export interface LotteryTicketClaimData {
  ticketsWithUnclaimedRewards: LotteryTicket[]
  allWinningTickets: LotteryTicket[]
  cakeTotal: BigNumber
  roundId: string
}
