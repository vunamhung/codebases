import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'AutoShark',
  description:
    'The most popular AMM on BSC by user count! Earn JAWS through yield farming or win it in the Lottery, then stake it in Pool to earn more tokens! Initial Farm Offerings (new token launch model pioneered by AutoShark), NFTs, and more, on a platform you can trust.',
  image: 'https://autoshark.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('AutoShark')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('AutoShark')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('AutoShark')}`,
      }
    case '/vaults':
      return {
        title: `${t('Vaults')} | ${t('AutoShark')}`,
      }
    case '/ocean':
      return {
        title: `${t('Ocean')} | ${t('AutoShark')}`,
      }
    case '/dividends':
      return {
        title: `${t('Dividends')} | ${t('AutoShark')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('AutoShark')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('AutoShark')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('AutoShark')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('AutoShark')}`,
      }
    case '/ifo':
      return {
        title: `${t('Launchpad')} | ${t('AutoShark')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('AutoShark')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('AutoShark')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('AutoShark')}`,
      }
    default:
      return null
  }
}
