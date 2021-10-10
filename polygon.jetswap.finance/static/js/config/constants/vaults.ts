import tokens from './tokens'
import { VaultConfig } from './types'

const vaults: VaultConfig[] = [
  {
    pid: 0,
    lpSymbol: 'pWINGS',
    isSingle: true,
    lpAddresses: {
      80001: '',
      137: '0xaf623E96d38191038C48990Df298e07Fb77b56c3',
    },
    vaultAddresses: {
      80001: '',
      137: '0xd93104bd22d61f7880Cfce08A8671796FC0fA22f',
    },
    strategyAddresses: {
      80001: '',
      137: '0xB63F64704F78C67B12E3B8846F240E382Ec42e85',
    },
    token: tokens.pwings,
    quoteToken: tokens.pwings,
    provider: 'Jetswap',
  },
  {
    pid: 2,
    lpSymbol: 'pWINGS-MATIC LP',
    lpAddresses: {
      80001: '',
      137: '0xA0A6e9A5185d5737CF6F7920CB417EA2F07F03B3',
    },
    vaultAddresses: {
      80001: '',
      137: '0x5725356DA7f05322148f19fd10F89e846048D1f3',
    },
    strategyAddresses: {
      80001: '',
      137: '0x6399BBf2e094fC4E3Bdf3BA52D6856508bD92C92',
    },
    token: tokens.pwings,
    quoteToken: tokens.wmatic,
    provider: 'Jetswap',
  },
  {
    pid: 7,
    lpSymbol: 'ETH-MATIC LP',
    lpAddresses: {
      80001: '',
      137: '0x951E38875a93df95bbd24fe31f409b7933B35BED',
    },
    vaultAddresses: {
      80001: '',
      137: '0x2B66426a019E43e9e025C62278076a38c6CB33c3',
    },
    strategyAddresses: {
      80001: '',
      137: '0x0E290Bb18a5d90c84B7a5c0ED01B7c9C108Ab79c',
    },
    token: tokens.weth,
    quoteToken: tokens.wmatic,
    provider: 'Jetswap',
  },
  {
    pid: 8,
    lpSymbol: 'ETH-USDC LP',
    lpAddresses: {
      80001: '',
      137: '0xFEFF91C350bB564cA5Dc7D6F7DcD12ac092F94FF',
    },
    vaultAddresses: {
      80001: '',
      137: '0xEC57bf1eD0a2297A3e3911bF6Fa389aa2c112A38',
    },
    strategyAddresses: {
      80001: '',
      137: '0x1Df7b5df1b29A850D642DD989F2b9664A56596C0',
    },
    token: tokens.weth,
    quoteToken: tokens.usdc,
    provider: 'Jetswap',
  },
  {
    pid: 9,
    lpSymbol: 'ETH-USDT LP',
    lpAddresses: {
      80001: '',
      137: '0xc7f1B47F4ed069E9B34e6bD59792B8ABf5a66339',
    },
    vaultAddresses: {
      80001: '',
      137: '0x3468348D60429b5a735940A84Dc5762f0C5F4b08',
    },
    strategyAddresses: {
      80001: '',
      137: '0x098DAF85bed3AD16A284c4C5f2B04E5D84Cd057c',
    },
    token: tokens.weth,
    quoteToken: tokens.usdt,
    provider: 'Jetswap',
  },
  {
    pid: 10,
    lpSymbol: 'USDC-MATIC LP',
    lpAddresses: {
      80001: '',
      137: '0x5E58e0CeD3a272CAeb8bA00F4A4C2805Df6BE495',
    },
    vaultAddresses: {
      80001: '',
      137: '0x1Ac0193A6a4691B832CE3B299cAD934988af9c32',
    },
    strategyAddresses: {
      80001: '',
      137: '0x33c5FbE4772aBA8235f62010c72857039dB0EF18',
    },
    token: tokens.usdc,
    quoteToken: tokens.wmatic,
    provider: 'Jetswap',
  },
  {
    pid: 11,
    lpSymbol: 'USDT-MATIC LP',
    lpAddresses: {
      80001: '',
      137: '0x101640e107C4a72DeC79826768C239F1eB48cc85',
    },
    vaultAddresses: {
      80001: '',
      137: '0x1D6543B57Fe973a09ceEbf6e6872de0aa6C04377',
    },
    strategyAddresses: {
      80001: '',
      137: '0xaE7fe3228C2889F409578c3e7dD5038FBceFEd9A',
    },
    token: tokens.usdt,
    quoteToken: tokens.wmatic,
    provider: 'Jetswap',
  },
  {
    pid: 12,
    lpSymbol: 'BTC-USDT LP',
    lpAddresses: {
      80001: '',
      137: '0x7641d6b873877007697D526EF3C50908779a6993',
    },
    vaultAddresses: {
      80001: '',
      137: '0x6e06ce36F6314ccBd6367107363886eCC8Fd133a',
    },
    strategyAddresses: {
      80001: '',
      137: '0x008eb69912c584dB05c8130FE0e8D4FD3B9bfd9d',
    },
    token: tokens.wbtc,
    quoteToken: tokens.usdt,
    provider: 'Jetswap',
  },
  {
    pid: 13,
    lpSymbol: 'pAUTO-MATIC LP',
    lpAddresses: {
      80001: '',
      137: '0x5EA7253D8c9C2E2fdB535AD3767E249B0Df6442F',
    },
    vaultAddresses: {
      80001: '',
      137: '0x31a85811322211F5f7b2405E5eB2B2567f98f79a',
    },
    strategyAddresses: {
      80001: '',
      137: '0x25Ce54D8d9564Db2DC20BB0AD8286d50d8Bd503a',
    },
    token: tokens.pauto,
    quoteToken: tokens.wmatic,
    provider: 'Jetswap',
  },
  {
    pid: 14,
    lpSymbol: 'BTC-ETH LP',
    lpAddresses: {
      80001: '',
      137: '0x173E90f2a94Af3b075DeEC7e64Df4d70EfB4Ac3D',
    },
    vaultAddresses: {
      80001: '',
      137: '0x3De32Fe1Dc3FDa78A9bcc14fe10f3924b6891122',
    },
    strategyAddresses: {
      80001: '',
      137: '0xd8E1BDc702b7F2ddb5Ff5e68bA527dB402A488A0',
    },
    token: tokens.wbtc,
    quoteToken: tokens.weth,
    provider: 'Jetswap',
  },
  {
    pid: 15,
    lpSymbol: 'USDC-USDT LP',
    lpAddresses: {
      80001: '',
      137: '0x20BF018FDDBa3b352f3d913FE1c81b846fE0F490',
    },
    vaultAddresses: {
      80001: '',
      137: '0x76B7dC95AD02a03304Ab91F5539A14457Fcc9035',
    },
    strategyAddresses: {
      80001: '',
      137: '0x7Cf9601735c80e7B7Deb2508163328dF59653353',
    },
    token: tokens.usdc,
    quoteToken: tokens.usdt,
    provider: 'Jetswap',
  },
  {
    pid: 16,
    lpSymbol: 'USDC-DAI LP',
    lpAddresses: {
      80001: '',
      137: '0x4A53119dd905fD39ccC532C68e69505dfB47fc2C',
    },
    vaultAddresses: {
      80001: '',
      137: '0x8C25E175fC88c19BE6138F741B6A9d7De3aD9d3A',
    },
    strategyAddresses: {
      80001: '',
      137: '0xC344a33Ac93023A18D75bdce967f9D46f50A7f8A',
    },
    token: tokens.usdc,
    quoteToken: tokens.dai,
    provider: 'Jetswap',
  },
  {
    pid: 17,
    lpSymbol: 'pforce-MATIC LP',
    lpAddresses: {
      80001: '',
      137: '0x4461677151ec95b2B4121122Cd07fECcde6b8A28',
    },
    vaultAddresses: {
      80001: '',
      137: '0x1CaB6FB5DB1D669C8bd0AEf76fA07c92Bce91c03',
    },
    strategyAddresses: {
      80001: '',
      137: '0x19643E919210dB8046Fd2F4727C6b0B1bC0D4fE2',
    },
    token: tokens.pforce,
    quoteToken: tokens.wmatic,
    provider: 'Jetswap',
  },
  {
    pid: 18,
    lpSymbol: 'pSWAMP-USDC LP',
    lpAddresses: {
      80001: '',
      137: '0x979b711B779138073997C5ce1EAac11c11D9436B',
    },
    vaultAddresses: {
      80001: '',
      137: '0x6B9040Ef98Aa616f19321D2eDf33eA82C6263Aaf',
    },
    strategyAddresses: {
      80001: '',
      137: '0x5FE89617B8B0Af22bd5a0b42A5ca4966F6fbA7bd',
    },
    token: tokens.pswamp,
    quoteToken: tokens.usdc,
    provider: 'Jetswap',
  },
  {
    pid: 20,
    lpSymbol: 'PIRATEP-MATIC LP',
    lpAddresses: {
      80001: '',
      137: '0xC5Ad09A1317c3F40e45076F9114D5e951b97a343',
    },
    vaultAddresses: {
      80001: '',
      137: '0xa6B4c20A45dF1B47d15c66aF601F5aa599BdbB60',
    },
    strategyAddresses: {
      80001: '',
      137: '0x87b7972453D03e344D4fdf8Dd5bef6cA692352f1',
    },
    token: tokens.piratep,
    quoteToken: tokens.wmatic,
    provider: 'Jetswap',
  },
]

export default vaults
