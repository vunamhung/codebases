import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  {
    pid: 1,
    lpSymbol: 'pWINGS-USDC LP',
    lpAddresses: {
      80001: '',
      137: '0xaf623E96d38191038C48990Df298e07Fb77b56c3',
    },
    token: tokens.pwings,
    quoteToken: tokens.usdc,
  },
  {
    pid: 2,
    lpSymbol: 'pWINGS-MATIC LP',
    lpAddresses: {
      80001: '',
      137: '0xA0A6e9A5185d5737CF6F7920CB417EA2F07F03B3',
    },
    token: tokens.pwings,
    quoteToken: tokens.wmatic,
  },
  {
    pid: 3,
    lpSymbol: 'pWINGS-USDT LP',
    lpAddresses: {
      80001: '',
      137: '0xA39a7640790907D4865a74c1F9715715DBd00431',
    },
    token: tokens.pwings,
    quoteToken: tokens.usdt,
  },
  {
    pid: 4,
    lpSymbol: 'pWINGS-ETH LP',
    lpAddresses: {
      80001: '',
      137: '0xFa4218D03Ae852858C01505A7227EdCbe2f0b293',
    },
    token: tokens.pwings,
    quoteToken: tokens.weth,
  },
  {
    pid: 5,
    lpSymbol: 'pWINGS-BTC LP',
    lpAddresses: {
      80001: '',
      137: '0x44472e389C000a4c433F66A709eAF1068fADCfa9',
    },
    token: tokens.wbtc,
    quoteToken: tokens.pwings,
  },
  {
    pid: 6,
    lpSymbol: 'pWINGS-QUICK LP',
    lpAddresses: {
      80001: '',
      137: '0xE331666Df4F2618CfB18Ab930Ae554f8fc0a695e',
    },
    token: tokens.quick,
    quoteToken: tokens.pwings,
  },
  {
    pid: 7,
    lpSymbol: 'ETH-MATIC LP',
    lpAddresses: {
      80001: '',
      137: '0x951E38875a93df95bbd24fe31f409b7933B35BED',
    },
    token: tokens.weth,
    quoteToken: tokens.wmatic,
  },
  {
    pid: 8,
    lpSymbol: 'ETH-USDC LP',
    lpAddresses: {
      80001: '',
      137: '0xFEFF91C350bB564cA5Dc7D6F7DcD12ac092F94FF',
    },
    token: tokens.weth,
    quoteToken: tokens.usdc,
  },
  {
    pid: 9,
    lpSymbol: 'ETH-USDT LP',
    lpAddresses: {
      80001: '',
      137: '0xc7f1B47F4ed069E9B34e6bD59792B8ABf5a66339',
    },
    token: tokens.weth,
    quoteToken: tokens.usdt,
  },
  {
    pid: 10,
    lpSymbol: 'USDC-MATIC LP',
    lpAddresses: {
      80001: '',
      137: '0x5E58e0CeD3a272CAeb8bA00F4A4C2805Df6BE495',
    },
    token: tokens.wmatic,
    quoteToken: tokens.usdc,
  },
  {
    pid: 11,
    lpSymbol: 'USDT-MATIC LP',
    lpAddresses: {
      80001: '',
      137: '0x101640e107C4a72DeC79826768C239F1eB48cc85',
    },
    token: tokens.wmatic,
    quoteToken: tokens.usdt,
  },
  {
    pid: 12,
    lpSymbol: 'BTC-USDT LP',
    lpAddresses: {
      80001: '',
      137: '0x7641d6b873877007697D526EF3C50908779a6993',
    },
    token: tokens.wbtc,
    quoteToken: tokens.usdt,
  },
  {
    pid: 13,
    lpSymbol: 'pAUTO-MATIC LP',
    lpAddresses: {
      80001: '',
      137: '0x5EA7253D8c9C2E2fdB535AD3767E249B0Df6442F',
    },
    token: tokens.pauto,
    quoteToken: tokens.wmatic,
  },
  {
    pid: 14,
    lpSymbol: 'BTC-ETH LP',
    lpAddresses: {
      80001: '',
      137: '0x173E90f2a94Af3b075DeEC7e64Df4d70EfB4Ac3D',
    },
    token: tokens.wbtc,
    quoteToken: tokens.weth,
  },
  {
    pid: 15,
    lpSymbol: 'USDC-USDT LP',
    lpAddresses: {
      80001: '',
      137: '0x20BF018FDDBa3b352f3d913FE1c81b846fE0F490',
    },
    token: tokens.usdc,
    quoteToken: tokens.usdt,
  },
  {
    pid: 16,
    lpSymbol: 'USDC-DAI LP',
    lpAddresses: {
      80001: '',
      137: '0x4A53119dd905fD39ccC532C68e69505dfB47fc2C',
    },
    token: tokens.dai,
    quoteToken: tokens.usdc,
  },
  {
    pid: 17,
    lpSymbol: 'PFORCE-MATIC LP',
    lpAddresses: {
      80001: '',
      137: '0x4461677151ec95b2B4121122Cd07fECcde6b8A28',
    },
    token: tokens.pforce,
    quoteToken: tokens.wmatic,
  },
  {
    pid: 18,
    lpSymbol: 'pSWAMP-USDC LP',
    lpAddresses: {
      80001: '',
      137: '0x979b711B779138073997C5ce1EAac11c11D9436B',
    },
    token: tokens.pswamp,
    quoteToken: tokens.usdc,
  },
  {
    pid: 20,
    lpSymbol: 'PIRATEP-MATIC LP',
    lpAddresses: {
      80001: '',
      137: '0xC5Ad09A1317c3F40e45076F9114D5e951b97a343',
    },
    token: tokens.piratep,
    quoteToken: tokens.wmatic,
  },
  {
    pid: 21,
    lpSymbol: 'TIME-ETH LP',
    lpAddresses: {
      80001: '',
      137: '0xf5831d326b386d6b2a7470284853ffca9790b417',
    },
    token: tokens.time,
    quoteToken: tokens.weth,
  },
  {
    pid: 22,
    lpSymbol: 'TIME-USDC LP',
    lpAddresses: {
      80001: '',
      137: '0xE44cFd418D8B8207eB0A059207C807922D165C05',
    },
    token: tokens.time,
    quoteToken: tokens.usdc,
  },
  {
    pid: 23,
    lpSymbol: 'AVTO-MATIC LP',
    lpAddresses: {
      80001: '',
      137: '0x00E288acF24e2DB00f5569159F1007158a38a1Fb',
    },
    token: tokens.avto,
    quoteToken: tokens.wmatic,
  },
  {
    pid: 24,
    lpSymbol: 'pNAUT-MATIC LP',
    lpAddresses: {
      80001: '',
      137: '0x9586c9ADD103547275aD86024f1DC6FE05040B35',
    },
    token: tokens.pnaut,
    quoteToken: tokens.wmatic,
  },
]

export default farms
