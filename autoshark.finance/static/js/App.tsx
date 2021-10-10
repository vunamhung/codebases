import React, { lazy } from 'react'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import { ResetCSS } from '@autoshark-finance/uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import { useFetchProfile } from 'state/profile/hooks'
import { DatePickerPortal } from 'components/DatePicker'
import { usePollCoreVaultData } from 'state/vaults/hooks'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity,
} from 'views/AddLiquidity/redirects'
import AddLiquidity from 'views/AddLiquidity'
import RedirectOldRemoveLiquidityPathStructure from 'views/RemoveLiquidity/redirects'
import RemoveLiquidity from 'views/RemoveLiquidity'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import { ToastListener } from './contexts/ToastsContext'
import PageLoader from './components/Loader/PageLoader'
import history from './routerHistory'
// Views included in the main bundle
import Pools from './views/Pools'
import Swap from './views/Swap'
import { RedirectPathToSwapOnly, RedirectToSwap } from './views/Swap/redirects'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy(() => import('./views/Home'))
const Farms = lazy(() => import('./views/Farms'))
const Vaults = lazy(() => import('./views/Vaults'))
const Ifos = lazy(() => import('./views/Ifos'))
const Dividends = lazy(() => import('./views/Dividends'))
const NftsMinting = lazy(() => import('./views/NftsMinting'))
const NftsGallery = lazy(() => import('./views/NftsGallery'))
const NftsForge = lazy(() => import('./views/NftsForge'))
const NftsMarketplace = lazy(() => import('./views/NftsMarketplace'))
const Stats = lazy(() => import('./views/Stats'))
const Liquidity = lazy(() => import('./views/Pool'))
const CoinFlip = lazy(() => import('./views/Games/CoinFlip'))
const BarbellRoll = lazy(() => import('./views/Games/BarbellRoll'))
const Roulette = lazy(() => import('./views/Games/Roulette'))
const DiceIt = lazy(() => import('./views/Games/DiceIt'))
const NotFound = lazy(() => import('./views/NotFound'))
const PoolFinder = lazy(() => import('./views/PoolFinder'))
const Info = lazy(() => import('./views/Info'))
const Academy = lazy(() => import('./views/Academy'))
const TradingContest = lazy(() => import('./views/Contest/trading'))
const NftContest = lazy(() => import('./views/Contest/nft'))

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  usePollBlockNumber()
  useEagerConnect()
  useFetchProfile()
  usePollCoreFarmData()
  usePollCoreVaultData()

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/vaults">
              <Vaults />
            </Route>
            <Route path="/dividends">
              <Dividends />
            </Route>
            <Route path="/farms">
              <Farms />
            </Route>
            <Route path="/ocean">
              <Pools />
            </Route>
            <Route path="/launchpad">
              <Ifos />
            </Route>
            <Route path="/nft/cavern">
              <NftsMinting />
            </Route>
            <Route path="/nft/forge">
              <NftsForge />
            </Route>
            <Route path="/nft/aquarium">
              <NftsGallery />
            </Route>
            <Route path="/nft/emporium">
              <NftsMarketplace />
            </Route>
            <Route path="/stats">
              <Stats />
            </Route>
            <Route path="/coin-flip">
              <CoinFlip />
            </Route>
            <Route path="/barbell-roll">
              <BarbellRoll />
            </Route>
            <Route path="/roulette">
              <Roulette />
            </Route>
            <Route path="/dice-it">
              <DiceIt />
            </Route>
            <Route path="/info">
              <Info />
            </Route>
            <Route path="/academy/fins-bnb-maximizer-vault">
              <Academy />
            </Route>
            <Route path="/contest/trading">
              <TradingContest />
            </Route>
            <Route path="/contest/nft">
              <NftContest />
            </Route>

            {/* Using this format because these components use routes injected props. We need to rework them with hooks */}
            <Route exact strict path="/swap" component={Swap} />
            <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
            <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
            <Route exact strict path="/find" component={PoolFinder} />
            <Route exact strict path="/liquidity" component={Liquidity} />
            <Route exact strict path="/create" component={RedirectToAddLiquidity} />
            <Route exact path="/add" component={AddLiquidity} />
            <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact path="/create" component={AddLiquidity} />
            <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
            <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

            {/* Redirect */}
            <Route path="/pool">
              <Redirect to="/liquidity" />
            </Route>
            <Route path="/staking">
              <Redirect to="/pools" />
            </Route>
            <Route path="/syrup">
              <Redirect to="/pools" />
            </Route>

            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </SuspenseWithChunkError>
      </Menu>
      <ToastListener />
      <DatePickerPortal />
    </Router>
  )
}

export default React.memo(App)
