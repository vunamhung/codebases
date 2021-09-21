import React from 'react';
import get from 'lodash/get';
import { compose } from 'redux';
import {
  DesktopAsyncProductPageRoute,
  MobileAsyncProductPageRoute,
} from '../../routes/AsyncProductPageRoute';
import AsyncGiftCardPageRoute from '../../routes/AsyncGiftCardPageRoute';
import AsyncGiftCardRedeemPageRoute from '../../routes/AsyncGiftCardRedeemPageRoute';
import AsyncLandingPageRoute from '../../routes/AsyncLandingPageRoute';
import AsyncFavoritesPageRoute from '../../routes/AsyncFavoritesPageRoute';
import AsyncListsPageRoute from '../../routes/AsyncListsPageRoute';
import AsyncListPageRoute from '../../routes/AsyncListPageRoute';
import AsyncRangePageRoute from '../../routes/AsyncRangePageRoute';
import ErrorPage from '../../routes/ErrorPage';
import config from '../../../config';
import { clientError } from '../errorReporting';
import AsyncArtistShopPageRoute from '../../routes/AsyncArtistShopPageRoute';
import AsyncArtistExplorePageRoute from '../../routes/AsyncArtistExplorePageRoute';
import ShopSearchPageSelector from '../../routes/SearchPageRouteSelector';
import AsyncGiftLandingPageRoute from '../../routes/AsyncGiftLandingPageRoute';
import AsyncPurchaseOrderCancelPageRoute from '../../routes/AsyncPurchaseOrderCancelPageRoute';
import AsyncOrderHistoryPageRoute from '../../routes/AsyncOrderHistoryPageRoute';
import CookiePolicyPageRoute from '../../routes/CookiePolicyPageRoute';

const { en, es, fr, de } = config('availableLocales');
const enabledLocales = [en, es, fr, de];

const route = Component => (props) => {
  return <Component {...props} onError={clientError} enabledLocales={enabledLocales} />;
};

const ProductPageWrapper = (props) => {
  const Component = props.browser.is.large || props.browser.is.medium
    ? DesktopAsyncProductPageRoute
    : MobileAsyncProductPageRoute;

  return <Component {...props} />;
};

const routeWithEdgeCache = ({ ttl }) => Component => (props) => {
  if (props.staticContext) {
    // eslint-disable-next-line no-param-reassign
    props.staticContext.cacheTtl = ttl;
  }

  return <Component {...props} />;
};

const routeWithProps = customProps => Component => (props) => {
  return <Component {...props} {...customProps} />;
};

const routeWithConfiguredLandingPageParams = Component => (props) => {
  return routeWithProps({
    ...props,
    configureLandingPageSlug: get(props, 'match.params.slug', null),
    pagePathPrefix: '/g',
  })(Component)(props);
};

export default [
  {
    path: '/shop/ap/:workId([1-9][0-9]+)/comments',
    render: route(AsyncRangePageRoute),
  },
  {
    path: '/:locale/shop/ap/:workId([1-9][0-9]+)/comments',
    render: route(AsyncRangePageRoute),
  },
  {
    path: '/shop/ap/:workId([1-9][0-9]+)',
    render: route(AsyncRangePageRoute),
  },
  {
    path: '/:locale/shop/ap/:workId([1-9][0-9]+)',
    render: route(AsyncRangePageRoute),
  },
  {
    path: '/lists/:listId/:slug?',
    render: route(AsyncListPageRoute),
  },
  {
    path: '/:locale/lists/:listId/:slug?',
    render: route(AsyncListPageRoute),
  },
  {
    path: '/boom/lists/:listId/:slug?',
    render: route(AsyncListPageRoute),
  },
  {
    path: '/lists',
    render: route(AsyncListsPageRoute),
  },
  {
    path: '/:locale/lists',
    render: route(AsyncListsPageRoute),
  },
  {
    path: '/boom/lists',
    render: route(AsyncListsPageRoute),
  },
  {
    path: '/people/:username/favorites/:query?',
    render: route(AsyncFavoritesPageRoute),
  },
  {
    path: '/:locale/people/:username/favorites/:query?',
    render: route(AsyncFavoritesPageRoute),
  },
  {
    path: '/:locale/boom/people/:username/favorites/:query?',
    render: route(AsyncFavoritesPageRoute),
  },
  {
    path: '/gift-certificates',
    exact: true,
    render: route(AsyncGiftCardPageRoute),
  },
  {
    path: '/gift-certificates/new',
    exact: true,
    render: route(AsyncGiftCardPageRoute),
  },
  {
    path: '/gift-certificates/:code',
    render: route(AsyncGiftCardRedeemPageRoute),
  },
  {
    path: '/:locale/gift-certificates',
    exact: true,
    render: route(AsyncGiftCardPageRoute),
  },
  {
    path: '/:locale/gift-certificates/new',
    exact: true,
    render: route(AsyncGiftCardPageRoute),
  },
  {
    path: '/:locale/gift-certificates/:code',
    render: route(AsyncGiftCardRedeemPageRoute),
  },
  {
    path: '/boom/gift-certificates/new',
    exact: true,
    render: route(AsyncGiftCardPageRoute),
  },
  {
    path: '/boom/gift-certificates/:code',
    render: route(AsyncGiftCardRedeemPageRoute),
  },
  {
    path: '/gm/:giftId',
    render: route(AsyncGiftLandingPageRoute),
  },
  {
    path: '/:locale/gm/:giftId',
    render: route(AsyncGiftLandingPageRoute),
  },
  {
    path: '/i/:product?*/:seoSlug/:idSegments',
    inventoryProductPageRoute: true,
    render: compose(
      routeWithEdgeCache({ ttl: 10800 }),
    )(route(ProductPageWrapper)),
  },
  {
    path: '/:locale/i/:product?*/:seoSlug/:idSegments',
    inventoryProductPageRoute: true,
    render: compose(
      routeWithEdgeCache({ ttl: 10800 }),
    )(route(ProductPageWrapper)),
  },
  {
    path: '/g/:slug',
    render: compose(
      routeWithEdgeCache({ ttl: 10800 }),
      routeWithProps({ parentPath: '/shop' }),
      routeWithConfiguredLandingPageParams,
    )(route(AsyncLandingPageRoute)),
  },
  {
    path: '/:locale/g/:slug',
    render: compose(
      routeWithEdgeCache({ ttl: 10800 }),
      routeWithProps({ parentPath: '/shop' }),
      routeWithConfiguredLandingPageParams,
    )(route(AsyncLandingPageRoute)),
  },
  {
    path: '/shop/:query?',
    render: compose(
      routeWithProps({ parentPath: '/shop' }),
    )(route(ShopSearchPageSelector)),
  },
  {
    path: '/:locale/shop/:query?',
    render: compose(
      routeWithProps({ parentPath: '/shop' }),
    )(route(ShopSearchPageSelector)),
  },
  {
    path: '/people/:artistName/explore',
    render: route(AsyncArtistExplorePageRoute),
  },
  {
    path: '/:locale/people/:artistName/explore',
    render: route(AsyncArtistExplorePageRoute),
  },
  {
    path: '/people/:artistName/shop/:query?',
    render: compose(
      routeWithEdgeCache({ ttl: 10800 }),
    )(route(AsyncArtistShopPageRoute)),
  },
  {
    path: '/:locale/people/:artistName/shop/:query?',
    render: compose(
      routeWithEdgeCache({ ttl: 10800 }),
    )(route(AsyncArtistShopPageRoute)),
  },
  {
    path: '/orders/:purchaseOrderId/cancel',
    render: route(AsyncPurchaseOrderCancelPageRoute),
  },
  {
    path: '/:locale/orders/:purchaseOrderId/cancel',
    render: route(AsyncPurchaseOrderCancelPageRoute),
  },
  {
    path: '/orders',
    render: route(AsyncOrderHistoryPageRoute),
  },
  {
    path: '/:locale/orders',
    render: route(AsyncOrderHistoryPageRoute),
  },
  {
    path: '/cookie-policy',
    render: route(CookiePolicyPageRoute),
  },
  {
    path: '/:locale/cookie-policy',
    render: route(CookiePolicyPageRoute),
  },
  {
    render: route(ErrorPage),
  },
];
