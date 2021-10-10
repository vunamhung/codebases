import { getJawsAddress, getFinsAddress } from 'utils/addressHelpers'
import { SalesSectionProps } from '.'

export const swapSectionData: SalesSectionProps = {
  headingText: 'Trade anything. No registration, no hassle.',
  bodyText: 'Trade any token on Binance Smart Chain in seconds, just by connecting your wallet.',
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: 'Trade Now',
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.autoshark.finance/',
    text: 'Learn',
    external: true,
  },
  images: {
    path: '/images/home/trade/',
    attributes: [
      { src: 'BNB', alt: 'BNB token' },
      { src: 'BTC', alt: 'BTC token' },
      { src: 'JAWS', alt: 'JAWS token' },
    ],
  },
}

export const earnSectionData: SalesSectionProps = {
  headingText: 'Robust security.',
  bodyText:
    'Security is our key focus. Our contracts are audited by the best yield optimiser auditors/flash-loan specialists to ensure our protocol is safe from attacks.',
  reverse: true,
  primaryButton: {
    to: 'https://autosharkgw.gitbook.io/autoshark/general/audit#watchpug-audit-for-autoshark-v-2-0',
    text: 'See Audit',
    external: true,
  },
  secondaryButton: {
    to: 'https://watchpug.medium.com/',
    text: 'About WatchPug',
    external: true,
  },
  images: {
    path: '/images/home/security/',
    attributes: [
      { src: 'watchpug', alt: 'watch pug' },
      // { src: 'secure', alt: 'secure' },
      // { src: 'stonks', alt: 'Stocks chart' },
      // { src: 'folder', alt: 'Folder with cake token' },
    ],
  },
}

export const jawsSectionData: SalesSectionProps = {
  headingText: `JAWS powers AutoShark's Vaults and Ocean`,
  bodyText: 'Auto-compounding and staking for new projects',
  reverse: true,
  primaryButton: {
    to: `/swap?outputCurrency=${getJawsAddress()}`,
    text: 'Buy $JAWS',
    external: false,
  },
  secondaryButton: {
    to: 'https://autosharkgw.gitbook.io/autoshark/general/usdshark-token',
    text: 'Learn More',
    external: true,
  },

  images: {
    path: '/images/home/',
    attributes: [
      { src: 'large-jaws', alt: 'JAWS token' },
      // { src: 'jaws-left-1', alt: 'jaws' },
      // { src: 'jaws-left-2', alt: 'jaws' },
      // { src: 'jaws-right', alt: 'jaws' },
    ],
  },
}

export const finsSectionData: SalesSectionProps = {
  headingText: `FINS are the lifeblood of AutoShark's Farms and Swap`,
  bodyText: 'Earn by providing liquidity to the decentralized exchange',
  reverse: false,
  primaryButton: {
    to: `/swap?outputCurrency=${getFinsAddress()}`,
    text: 'Buy $FINS',
    external: false,
  },
  secondaryButton: {
    to: 'https://autosharkgw.gitbook.io/autoshark/the-usdfins-token',
    text: 'Learn More',
    external: true,
  },

  images: {
    path: '/images/home/',
    attributes: [
      { src: 'large-fins', alt: 'FINS token' },
    ],
  },
}
