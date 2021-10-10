import { ChainId } from '@autoshark-finance/sdk'
import BigNumber from 'bignumber.js/bignumber'
import { BIG_TEN } from 'utils/bigNumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const BSC_BLOCK_TIME = 3

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: 'https://bscscan.com',
  [ChainId.TESTNET]: 'https://testnet.bscscan.com',
}

// JAWS_PER_BLOCK details
// 40 JAWS is minted per block
// 20 JAWS per block is sent to Burn pool (A farm just for burning cake)
// 10 JAWS per block goes to JAWS syrup pool
// 9 JAWS per block goes to Yield farms and lottery
// JAWS_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// JAWS/Block in src/views/Home/components/CakeDataRow.tsx = 19 (40 - Amount sent to burn pool)
export const JAWS_PER_BLOCK = new BigNumber(0.5)
export const FINS_PER_BLOCK = new BigNumber(10)
export const BLOCKS_PER_YEAR = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24 * 365) // 10512000
export const JAWS_PER_YEAR = JAWS_PER_BLOCK.times(BLOCKS_PER_YEAR)
export const FINS_PER_YEAR = FINS_PER_BLOCK.times(BLOCKS_PER_YEAR)
export const BASE_URL = 'https://autoshark.finance'
export const BASE_ADD_LIQUIDITY_URL = `https://autoshark.finance/add`
export const BASE_LIQUIDITY_POOL_URL = `https://autoshark.finance/pool`
export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[ChainId.MAINNET]
export const LOTTERY_MAX_NUMBER_OF_TICKETS = 50
export const LOTTERY_TICKET_PRICE = 1
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
export const DEFAULT_GAS_LIMIT = 200000
export const DEFAULT_GAS_PRICE = 5
