import { MenuEntry } from 'jetswap-uikit-polygon'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: 'https://polygon.jetswap.finance',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    initialOpenState: true,
    items: [
      {
        label: 'Exchange',
        href: '/swap',
      },
      {
        label: 'Liquidity',
        href: '/pool',
      },
    ],
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    href: 'https://polygon.jetswap.finance/farms',
  },
  {
    label: 'Pools',
    icon: 'PoolIcon',
    href: 'https://polygon.jetswap.finance/pools',
  },
  {
    label: 'Vaults',
    icon: 'VaultIcon',
    href: 'https://polygon.jetswap.finance/vaults',
  },
  {
    label: 'IJO',
    icon: 'IfoIcon',
    href: 'https://polygon.jetswap.finance/ijo',
  },
  {
    label: 'Pforce',
    icon: 'PforceIcon',
    href: 'https://polygon.jetswap.finance/pforce',
  },
  {
    label: 'Info',
    icon: 'InfoIcon',
    items: [
      {
        label: 'Overview',
        href: 'https://polygon-info.jetswap.finance/home',
        target: "_blank",
      },
      {
        label: 'Tokens',
        href: 'https://polygon-info.jetswap.finance/tokens',
        target: "_blank",
      },
      {
        label: 'Pairs',
        href: 'https://polygon-info.jetswap.finance/pairs',
        target: "_blank",
      },
      {
        label: 'Accounts',
        href: 'https://polygon-info.jetswap.finance/accounts',
        target: "_blank",
      },
    ],
  },
  {
    label: 'Partnership',
    icon: 'PartnerIcon',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLSeeN_QCs_OQFfRhJQagJFCTJ6GWHWUKWbw2cb6RzXzYrsrPbw/viewform',
  },
  {
    label: 'Audit',
    icon: 'AuditIcon',
    items: [
      {
        label: 'Audit by EtherAuthority',
        href: 'https://polygon.jetswap.finance/audit-by-etherauthority.pdf',
        target: "_blank",
      },
      {
        label: 'Audit by Hash0x',
        href: 'https://polygon.jetswap.finance/audit-by-hash0x.pdf',
        target: "_blank",
      },
    ],
  },
  {
    label: 'Games',
    icon: 'DiceIcon',
    items: [
      {
        label: 'Coin Flip',
        href: 'https://polygon.jetswap.finance/coin-flip',
      },
      {
        label: 'Barbell Roll',
        href: 'https://polygon.jetswap.finance/barbell-roll',
      },
      {
        label: 'Roulette',
        href: 'https://polygon.jetswap.finance/roulette',
      },
      {
        label: 'Dice It',
        href: 'https://polygon.jetswap.finance/dice-it',
      },
    ],
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    items: [
      {
        label: 'Docs',
        href: 'https://docs.jetswap.finance',
        target: "_blank",
      },
      {
        label: 'Blog',
        href: 'https://jetfuelfinance.medium.com/',
        target: "_blank",
      },
      {
        label: 'Vote',
        href: 'https://polygon-vote.jetswap.finance/',
        target: '_blank',
      },
      {
        label: 'Jetfuel Finance',
        href: 'https://jetfuel.finance',
        target: "_blank",
      },
      {
        label: 'Fortress',
        href: 'https://fortress.loans',
        target: "_blank",
      },
      {
        label: 'Gforce',
        href: 'https://jetfuel.finance/gforce',
        target: "_blank",
      },
    ],
  },
]

export default config
