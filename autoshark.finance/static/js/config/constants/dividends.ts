import tokens from './tokens'
import { DividendConfig } from './types'

const pools: DividendConfig[] = [
  {
    id: 0,
    stakingToken: tokens.jaws,
    earningToken: tokens.wbnb,
    contractAddress: {
      97: '',
      56: '0x5D2112Ba0969EC66012380C1fb88F2A3D182Eb90',
    },
    harvest: true,
    sortOrder: 1,
    isFinished: false,
    hasEnd: false,
    boostRate: 1.2,
  },
  {
    id: 1,
    stakingToken: tokens.fins,
    earningToken: tokens.wbnb,
    contractAddress: {
      97: '',
      56: '0xee8c659c08adA7AE879404eB31b69aCbb1f19Ff8',
    },
    harvest: true,
    sortOrder: 2,
    isFinished: false,
    hasEnd: false,
    boostRate: 0,
  },
  {
    id: 2,
    stakingToken: tokens.pirate,
    earningToken: tokens.wbnb,
    contractAddress: {
      97: '',
      56: '0x9216ea2ea67E5E3Dae8d942929B420178e96cD89',
    },
    harvest: true,
    sortOrder: 2,
    isFinished: false,
    hasEnd: false,
    boostRate: 1.8,
  },
]

export default pools
