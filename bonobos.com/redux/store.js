import { fromJS, Map } from "immutable"
import { createStore, applyMiddleware, compose } from "redux"
import { combineReducers } from "redux-immutable"
import { isClient } from "highline/utils/client"
import { createWrapper, HYDRATE } from "next-redux-wrapper"
import { reconcileState } from "highline/utils/state_reconciler"

import thunkMiddleware from "redux-thunk"
import analyticsMiddleware from "highline/redux/middlewares/analytics_middleware"
import localStorageMiddleware from "highline/redux/middlewares/local_storage_middleware"
import completedOrderStorageMiddleware from "highline/redux/middlewares/completed_order_storage_middleware"
import navigationMiddleware from "highline/redux/middlewares/navigation_middleware"
import sessionStorageMiddleware from "highline/redux/middlewares/session_storage_middleware"
import salesforceMarketingMiddleware from "highline/redux/middlewares/salesforce_marketing_middleware"

import accountReducer from "highline/redux/reducers/account_reducer"
import applePayLoadingReducer from "highline/redux/reducers/apple_pay_loading_reducer"
import authReducer from "highline/redux/reducers/auth_reducer"
import browserReducer from "highline/redux/reducers/browser_reducer"
import cartReducer from "highline/redux/reducers/cart_reducer"
import cartNotificationsReducer from "highline/redux/reducers/cart_notifications_reducer"
import categoryReducer from "highline/redux/reducers/category_reducer"
import categoryNavigationV2Reducer from "highline/redux/reducers/category_navigation_v2_reducer"
import contentfulReducer from "highline/redux/reducers/contentful_reducer"
import currentPageReducer from "highline/redux/reducers/current_page_reducer"
import exchangeReducer from "highline/redux/reducers/exchange_reducer"
import filtersReducer from "highline/redux/reducers/filters_reducer"
import fitPreferencesReducer from "highline/redux/reducers/fit_preferences_reducer"
import headerReducer from "highline/redux/reducers/header_reducer"
import homepageReducer from "highline/redux/reducers/homepage_reducer"
import newCustomerEmailListReducer from "highline/redux/reducers/new_customer_email_list_reducer"
import newCustomerModalReducer from "highline/redux/reducers/new_customer_modal_reducer"
import tippyTopReducer from "highline/redux/reducers/tippy_top_reducer"
import toastReducer from "highline/redux/reducers/toast_reducer"
import productDetailReducer from "highline/redux/reducers/product_detail_reducer"
import productPreviewReducer from "highline/redux/reducers/product_preview_reducer"
import outOfStockSubscriptionReducer from "highline/redux/reducers/out_of_stock_subscription_reducer"
import rightDrawerReducer from "highline/redux/reducers/right_drawer_reducer"
import leftDrawerReducer from "highline/redux/reducers/left_drawer_reducer"
import savedItemsReducer from "highline/redux/reducers/saved_items_reducer"
import searchReducer from "highline/redux/reducers/search_reducer"
import sizeAndFitReducer from "highline/redux/reducers/size_and_fit_reducer"
import sortReducer from "highline/redux/reducers/sort_reducer"
import bundleDetailReducer from "highline/redux/reducers/bundle_detail_reducer"
import locationReducer from "highline/redux/reducers/location_reducer"
import orderReducer from "highline/redux/reducers/order_reducer"
import billingInformationReducer from "highline/redux/reducers/billing_information_reducer"
import shippingInformationReducer from "highline/redux/reducers/shipping_information_reducer"
import addressBookReducer from "highline/redux/reducers/address_book_reducer"
import walletReducer from "highline/redux/reducers/wallet_reducer"
import navigationReducer from "highline/redux/reducers/navigation_reducer"
import sitemapReducer from "highline/redux/reducers/sitemap_reducer"
import { loadingBarReducer } from "react-redux-loading-bar"

const appReducers = combineReducers({
  account: accountReducer,
  applePayLoading: applePayLoadingReducer,
  addressBook: addressBookReducer,
  auth: authReducer,
  billingInformation: billingInformationReducer,
  browser: browserReducer,
  bundleDetail: bundleDetailReducer,
  cart: cartReducer,
  cartNotifications: cartNotificationsReducer,
  category: categoryReducer,
  categoryNavigationV2: categoryNavigationV2Reducer,
  contentful: contentfulReducer,
  currentPage: currentPageReducer,
  exchange: exchangeReducer,
  filters: filtersReducer,
  fitPreferences: fitPreferencesReducer,
  header: headerReducer,
  homepage: homepageReducer,
  leftDrawer: leftDrawerReducer,
  location: locationReducer,
  navigation: navigationReducer,
  newCustomerEmailList: newCustomerEmailListReducer,
  newCustomerModal: newCustomerModalReducer,
  order: orderReducer,
  outOfStockSubscription: outOfStockSubscriptionReducer,
  productDetail: productDetailReducer,
  productPreview: productPreviewReducer,
  rightDrawer: rightDrawerReducer,
  savedItems: savedItemsReducer,
  search: searchReducer,
  shippingInformation: shippingInformationReducer,
  sitemap: sitemapReducer,
  sizeAndFit: sizeAndFitReducer,
  sort: sortReducer,
  tippyTop: tippyTopReducer,
  toast: toastReducer,
  wallet: walletReducer,
  loadingBar: loadingBarReducer,
})

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    // pageState is the state from server side renders (getInitialProps)
    // or the state from static pages at build time (getStaticProps)
    const pageState = Map.isMap(action.payload) ? action.payload : fromJS(action.payload)

    // When client side navigating to a static page, we need to make sure certain state remains
    return reconcileState(pageState, state)
  } else {
    return appReducers(state, action)
  }
}

let middleware = [
  thunkMiddleware, /* needs to be first */
  analyticsMiddleware,
  localStorageMiddleware,
  completedOrderStorageMiddleware,
  navigationMiddleware,
  sessionStorageMiddleware,
  salesforceMarketingMiddleware,
]

// TODO: need to figure out a better way to conditionally
// require this, where it's not bundled in production.
// process.env.NODE_ENV is the only way webpack will ignore
if (process.env.NODE_ENV !== "production" && isClient) {
  const createLogger = require("redux-logger").createLogger
  const logger = createLogger({
    stateTransformer: (state) => state && state.toJS(), // readable immutable
  })

  middleware = [...middleware, logger]
}

export const makeStore = () => {
  const initialState = {}
  const composeEnhancers = isClient && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  return createStore(
    reducer,
    fromJS(initialState),
    composeEnhancers(applyMiddleware(...middleware)),
  )
}

export const reduxWrapper = createWrapper(makeStore, {
  deserializeState: (state) => fromJS(state),
  serializeState: (state) => state.toJS(),
})