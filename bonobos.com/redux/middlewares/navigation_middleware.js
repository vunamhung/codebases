import Router from "next/router"
import { isClient } from "highline/utils/client"
import { redirect } from "highline/utils/navigate"
import { detectTabletWidth, setScrollTop } from "highline/utils/viewport"
import { getBasePath } from "highline/utils/url"
import { getClientSideLink } from "highline/utils/link"
import { categoryGroupOffset } from "highline/redux/helpers/category_helper"
import * as UserAuthStorage from "highline/storage/user_auth_storage"
import { getCheckoutStep } from "highline/redux/helpers/checkout_helper"

import ActionTypes from "highline/redux/action_types"

const navigationMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    case ActionTypes.USER_NOT_LOGGED_IN: {
      Router.push("/sign-in")
      return next(action)
    }

    case ActionTypes.PAGE_LOADED: {
      if (action.pageCategory === "Sign-out") {
        Router.push("/")
        return
      }

      return next(action)
    }

    case ActionTypes.CATEGORY_NAV_ITEM_CLICK: {
      const subcatSection = document.getElementById(action.anchor)

      if (subcatSection) {
        subcatSection.scrollIntoView()
        window.scrollBy(0, -categoryGroupOffset) /* header & nav offset */
      }

      return next(action)
    }

    // On mobile, when changing between categories, pushState does not
    // scroll user to top of page, so we need to do that manually
    case ActionTypes.CATEGORY_FETCH_STARTED: {
      const savedPosition = store.getState().getIn(["currentPage", "scrollPositionHistory", `/shop/${action.slug}`])
      const timeout = detectTabletWidth() ? 750 : 0

      if (isClient && !savedPosition) {
        setTimeout(() => setScrollTop(0), timeout) /* wait for nav modal to close on mobile */
      }

      return next(action)
    }

    case ActionTypes.CATEGORY_LOCATION_CHANGED: {
      redirect(
        `/shop/${action.redirectSlug}`,
        action.res,
      )
      return next(action)
    }

    case ActionTypes.PRODUCT_DETAIL_LOCATION_CHANGED: {
      redirect(
        `/products/${action.redirectSlug}`,
        action.res,
      )
      return next(action)
    }

    case ActionTypes.BROWSER_HISTORY_NAVIGATED: {
      const as = action.historyEvent && action.historyEvent.state && action.historyEvent.state.as
      const path = getBasePath(as)
      const positions = store.getState().getIn(["currentPage", "scrollPositionHistory", path])

      if (positions) { // restore scroll position on back / forward navigation
        document.body.style.height = `${ positions.get("documentHeight") }px`
        setScrollTop(positions.get("scrollPosition"))
      }

      return next(action)
    }

    case ActionTypes.CLIENT_ROUTE_CHANGED: {
      // undo body height setting for scroll restore
      if (document.body.style.height)
        document.body.style.height = ""

      return next(action)
    }

    case ActionTypes.CLIENT_ROUTE_CHANGE_STARTED: {
      // check authenticated for account
      if (action.url.includes("/account")) {
        const { authenticationToken } = UserAuthStorage.load()
        if (!authenticationToken) {
          redirect("/sign-in")
          return
        }
      }

      return next(action)
    }

    case ActionTypes.EMPTY_CATEGORY_FETCHED: {
      redirect("/", action.res)
      return next(action)
    }

    case ActionTypes.ORDER_PAGE_LOCATION_EXITED:
    case ActionTypes.ORDER_NOT_FOUND:
    case ActionTypes.USER_ALREADY_LOGGED_IN: {
      Router.push("/")
      return next(action)
    }

    case ActionTypes.USER_LOGOUT_STARTED: {
      if (Router.pathname.includes("/account")) {
        Router.push("/")
        return
      }
      return next(action)
    }

    case ActionTypes.USER_LOGGED_IN:
    case ActionTypes.USER_REGISTERED: {
      if (action.redirectUrl && action.redirectUrl.includes("/reset-password")) {
        Router.push("/")
      } else if (action.redirectUrl) {
        redirect(action.redirectUrl)
        return
      }
      return next(action)
    }

    case ActionTypes.BUNDLE_DETAIL_LOCATION_CHANGED: {
      redirect(
        `/bundles/${action.redirectSlug}`,
        action.res,
      )
      return next(action)
    }

    case ActionTypes.ORDER_STEP_LOCATION_CHANGED:
    case ActionTypes.APPLE_PAY_ORDER_STEP_LOCATION_CHANGED:
    {
      if (action.path) {
        const browserHistoryState = getClientSideLink(action.path)
        const as = browserHistoryState.get("as")
        window.history.replaceState({ as }, null, as)
      }

      // Perform client side navigation
      Router.push(`/checkout/${action.redirectPath}`)
      return next(action)
    }

    case ActionTypes.SHIPPING_INFORMATION_ADD_SUCCEEDED: {
      if (!action.isUserlessOrder)
        Router.push("/checkout/billing")

      return next(action)
    }

    case ActionTypes.BILLING_INFORMATION_REVIEW_NAVIGATE_CLIKED: {
      Router.push("/checkout/review")
      return next(action)
    }

    case ActionTypes.BILLING_INFORMATION_ADD_SUCCEEDED: {
      if (action.paymentMethodType !== "giftCard") {
        const step = getCheckoutStep(action.order).get("redirectPath")
        Router.push(`/checkout/${step}`)
      }
      return next(action)
    }

    case ActionTypes.SUBMIT_CCPA_REQUEST_FAILED: {
      Router.push("/ccpa-error")
      return next(action)
    }

    default:
      return next(action)
  }
}

export default navigationMiddleware
