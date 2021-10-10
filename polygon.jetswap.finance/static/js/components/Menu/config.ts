import { MenuEntry } from 'jetswap-uikit-polygon'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: t('Trade'),
    icon: 'TradeIcon',
    items: [
      {
        label: t('Exchange'),
        href: 'https://polygon-exchange.jetswap.finance/#/swap',
      },
      {
        label: t('Liquidity'),
        href: 'https://polygon-exchange.jetswap.finance/#/pool',
      },
    ],
  },
  {
    label: t('Farms'),
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: t('Pools'),
    icon: 'PoolIcon',
    href: '/pools',
  },
  {
    label: t('Vaults'),
    icon: 'VaultIcon',
    href: '/vaults',
  },
  {
    label: t('Lottery'),
    icon: 'TicketIcon',
    href: '/lottery',
  },
  // {
  //   label: t('Lottery'),
  //   icon: 'TicketIcon',
  //   items: [
  //     {
  //       label: t('Dice Game'),
  //       href: '/dice'
  //     },
  //   ]
  // },
  // {
  //   label: 'Collectibles',
  //   icon: 'NftIcon',
  //   href: '/collectibles',
  // },
  // {
  //   label: 'Teams & Profile',
  //   icon: 'GroupsIcon',
  //   calloutClass: 'rainbow',
  //   items: [
  //     {
  //       label: 'Leaderboard',
  //       href: '/teams',
  //     },
  //     {
  //       label: 'Task Center',
  //       href: '/profile/tasks',
  //     },
  //     {
  //       label: 'Your Profile',
  //       href: '/profile',
  //     },
  //   ],
  // },
  {
    label: 'IJO',
    icon: 'IfoIcon',
    href: '/ijo',
  },
  {
    label: t('Pforce'),
    icon: 'PforceIcon',
    href: '/pforce',
  },
  {
    label: t('Info'),
    icon: 'InfoIcon',
    items: [
      {
        label: t('Overview'),
        href: 'https://polygon-info.jetswap.finance/home',
        target: '_blank',
      },
      {
        label: t('Tokens'),
        href: 'https://polygon-info.jetswap.finance/tokens',
        target: '_blank',
      },
      {
        label: t('Pairs'),
        href: 'https://polygon-info.jetswap.finance/pairs',
        target: '_blank',
      },
      {
        label: t('Accounts'),
        href: 'https://polygon-info.jetswap.finance/accounts',
        target: '_blank',
      },
    ],
  },
  {
    label: t('Partnership'),
    icon: 'PartnerIcon',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLSeeN_QCs_OQFfRhJQagJFCTJ6GWHWUKWbw2cb6RzXzYrsrPbw/viewform',
  },
  {
    label: t('Audit'),
    icon: 'AuditIcon',
    items: [
      {
        label: t('Audit by EtherAuthority'),
        href: 'https://jetswap.finance/audit-by-etherauthority.pdf',
        target: '_blank',
      },
      {
        label: t('Audit by Hash0x'),
        href: 'https://jetswap.finance/audit-by-hash0x.pdf',
        target: '_blank',
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
      {
        label: t('Docs'),
        href: 'https://docs.jetswap.finance',
        target: '_blank',
      },
      {
        label: t('Blog'),
        href: 'https://jetfuelfinance.medium.com/',
        target: '_blank',
      },
      {
        label: t('Vote'),
        href: 'https://polygon-vote.jetswap.finance/',
        target: '_blank',
      },
      {
        label: t('Jetfuel Finance'),
        href: 'https://jetfuel.finance',
        target: '_blank',
      },
      {
        label: t('Fortress'),
        href: 'https://fortress.loans',
        target: '_blank',
      },
      {
        label: t('Gforce'),
        href: 'https://jetfuel.finance/gforce',
        target: '_blank',
      },
    ],
  },
]

export default config
