import { MenuEntry } from '@autoshark-finance/uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: t('Swap'),
    icon: 'TradeIcon',
    href: '/swap',
  },
  {
    label: t('Farms'),
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: t('Vaults'),
    icon: 'VaultIcon',
    href: '/vaults',
  },
  {
    label: t('Dividends'),
    icon: 'PlantIcon',
    href: '/dividends',
  },
  {
    label: t('Ocean'),
    icon: 'WaveIcon',
    href: '/ocean',
  },
  {
    label: t('Contest'),
    icon: 'TrophyIcon',
    items: [
      {
        label: t('Weekly Trading Contest'),
        href: '/contest/trading',
      },
      {
        label: t('NFT Giveaway'),
        href: '/contest/nft',
      },
    ],
  },
  // {
  //   label: t('Contest'),
  //   icon: 'TrophyIcon',
  //   href: '/contest',
  // },
  {
    label: t('Academy'),
    icon: 'GraduationCapIcon',
    items: [
      {
        label: t('FINS-BNB Maximizer'),
        href: '/academy/fins-bnb-maximizer-vault',
      },
    ],
  },
  {
    label: t('Stats'),
    icon: 'InfoIcon',
    href: '/stats',
  },
  {
    label: t('Info'),
    icon: 'ChartIcon',
    href: 'https://autoshark.info',
  },
  {
    label: t('Launchpad'),
    icon: 'RocketIcon',
    href: '/launchpad',
  },
  {
    label: t('Partnerships'),
    icon: 'GroupsIcon',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLSeO31YaJsv-yofrNDBY9odgU5CVMz-VspWMze5mfU8WesGIUg/viewform',
  },
  {
    label: t('NFTs'),
    icon: 'NftPaintingIcon',
    items: [
      {
        label: t('Cavern'),
        href: '/nft/cavern',
      },
      {
        label: t('Forge'),
        href: '/nft/forge',
      },
      {
        label: t('Aquarium'),
        href: '/nft/aquarium',
      },
      {
        label: t('Emporium'),
        href: '/nft/emporium',
      },
    ],
  },
  {
    label: t('Games'),
    icon: 'DiceIcon',
    items: [
      {
        label: t('Coin Flip'),
        href: '/coin-flip',
      },
      {
        label: t('Barbell Roll'),
        href: '/barbell-roll',
      },
      {
        label: t('Roulette'),
        href: '/roulette',
      },
      {
        label: t('Dice It'),
        href: '/dice-it',
      },
    ],
  },
  {
    label: t('More'),
    icon: 'MoreIcon',
    items: [
      // {
      //   label: t('Contact'),
      //   href: 'https://docs.autoshark.finance/contact-us',
      // },
      {
        label: t('Github'),
        href: 'https://github.com/autoshark-finance/',
      },
      {
        label: t('Docs'),
        href: 'https://autosharkgw.gitbook.io/autoshark/',
      },
      {
        label: t('Blog'),
        href: 'https://medium.com/autosharkfin',
      },
      {
        label: t('NFT Rarity Tool'),
        href: 'https://rarity.autoshark.finance/',
      },
      {
        label: t('Old (v2)'),
        href: 'https://old.autoshark.finance/',
      },
      {
        label: t('CoinMarketCap'),
        href: 'https://coinmarketcap.com/currencies/autoshark/',
      },
      // {
      //   label: t('Merch'),
      //   href: 'https://pancakeswap.creator-spring.com/',
      // },
    ],
  },
]

export default config
