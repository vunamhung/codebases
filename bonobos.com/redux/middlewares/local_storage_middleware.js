import { generateSessionId } from "highline/utils/signifyd/session_id"
import * as FitPreferenceStorage from "highline/storage/fit_preference_storage"
import * as OrderStorage from "highline/storage/order_storage"
import * as SuggestedItemStorage from "highline/storage/cart/suggested_item_storage"
import * as UserAuthStorage from "highline/storage/user_auth_storage"
import * as UserStorage from "highline/storage/user_storage"
import { sha1 } from "highline/utils/sha1"

import ActionTypes from "highline/redux/action_types"

const localStorageMiddleware = (store) => (next) => (action) => {
  switch (action.type) {

    case ActionTypes.FILTERS_CLEARED:
      FitPreferenceStorage.remove()
      break

    case ActionTypes.MY_FIT_TOGGLED:
      FitPreferenceStorage.save({
        isEnabled: !store.getState().getIn(["filters", "myFitEnabled"]),
      })
      break

    case ActionTypes.FIT_PREFERENCES_CTA_CLICKED:
      FitPreferenceStorage.save({
        isEnabled: true,
      })
      break

    case ActionTypes.PAGE_LOADED: {
      const { number, signifydSessionId, token } = OrderStorage.load()

      if (!signifydSessionId)
        OrderStorage.save({ number, signifydSessionId: generateSessionId(), token })

      if (action.pageCategory === "Sign-out")
        clearAll()

      break
    }

    case ActionTypes.USER_LOGOUT_STARTED:
    case ActionTypes.AUTH_VALIDATION_FAILED:
      clearAll()
      break

    case ActionTypes.USER_LOGGED_IN:
    case ActionTypes.USER_REGISTERED: {
      const {
        authenticationToken,
        email,
        externalId,
        firstName,
        lastName,
        userId,
      } = action

      const hashedEmail = sha1(email)

      UserAuthStorage.save({ authenticationToken, userId })
      UserStorage.save({ firstName, lastName, email, hashedEmail, externalId })
      OrderStorage.removeNumberAndToken()
      break
    }

    case ActionTypes.ORDER_SUBMIT_COMPLETE_SUCCEEDED:
    case ActionTypes.APPLE_PAY_ORDER_SUBMIT_COMPLETE_SUCCEEDED: {
      if (store.getState().getIn(["auth", "isLoggedIn"])) {
        break
      }
      const paymentName = action.order.getIn(["creditCard", "name"]) || ""
      const firstName = paymentName.split(" ")[0]
      const lastName = paymentName.split(" ").slice(1).join(" ")
      const email = action.order.get("email")
      const hashedEmail = sha1(email)

      UserStorage.save({ email, hashedEmail, firstName, lastName  })
      break
    }

    case ActionTypes.LINE_ITEMS_ADDED_TO_CART:
    case ActionTypes.LINE_ITEMS_REMOVED_FROM_CART:
    case ActionTypes.CART_PROMO_APPLIED:
    case ActionTypes.CART_LOADED: {
      const { signifydSessionId } = OrderStorage.load()
      OrderStorage.save({
        number: action.cart.get("number"),
        signifydSessionId,
        token: action.cart.get("token"),
      })
      break
    }

    case ActionTypes.ORDER_FETCH_SUCCEEDED: {
      const { signifydSessionId } = OrderStorage.load()
      OrderStorage.save({
        number: action.order.get("number"),
        signifydSessionId,
        token: action.order.get("token"),
      })
      break
    }

    case ActionTypes.ORDER_CONFIRMATION_VIEWED:
      OrderStorage.remove()
      break

    case ActionTypes.ORDER_NOT_FOUND:
    case ActionTypes.CART_NOT_FOUND:
    case ActionTypes.CART_LOAD_FAILED:
    case ActionTypes.CART_LOAD_ITEM_COUNT_FAILED:
      OrderStorage.removeNumberAndToken()
      break

    case ActionTypes.AUTH_CLEARED_AND_REDIRECTED:
      clearAuthStorages()
      break

    case ActionTypes.SUGGESTED_ITEM_DISMISSED: {
      const state = store.getState()
      const sku = state.getIn(["cart", "suggestedItem", "productSku"])
      const color = state.getIn(["cart", "suggestedItem", "color", "name"])

      SuggestedItemStorage.storeBlacklistedProductColors(sku, color)

      break
    }
  }

  return next(action)
}

function clearAuthStorages() {
  FitPreferenceStorage.remove()
  UserAuthStorage.remove()
  UserStorage.remove()
}

function clearAll() {
  FitPreferenceStorage.remove()
  UserAuthStorage.remove()
  UserStorage.remove()
  OrderStorage.removeNumberAndToken()
}

export default localStorageMiddleware
