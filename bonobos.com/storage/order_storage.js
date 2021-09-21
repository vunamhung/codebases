import * as Cookies from "highline/utils/cookies"
import { isLocalStorageSupported } from "highline/utils/local_storage"
import Lockr from "lockr"

const STORAGE_KEY = "currentOrder"
const DEFAULTS = { number: undefined, token: undefined }
const CURRENT_ORDER_NUMBER_KEY = "spree_currentOrderNumber"
const CURRENT_ORDER_SIGNIFYD_SESSION_ID_KEY = "spree_currentOrderSignifydSessionId"
const CURRENT_ORDER_TOKEN_KEY = "spree_currentOrderToken"

export const load = () => {
  if (!isLocalStorageSupported()) {
    return {
      number: Cookies.get(CURRENT_ORDER_NUMBER_KEY),
      signifydSessionId: Cookies.get(CURRENT_ORDER_SIGNIFYD_SESSION_ID_KEY),
      token: Cookies.get(CURRENT_ORDER_TOKEN_KEY),
    }
  }

  return Lockr.get(STORAGE_KEY) || DEFAULTS
}

export const save = (order) => {
  if (!isLocalStorageSupported()) {
    Cookies.set(CURRENT_ORDER_NUMBER_KEY, order.number)
    Cookies.set(CURRENT_ORDER_SIGNIFYD_SESSION_ID_KEY, order.signifydSessionId)
    Cookies.set(CURRENT_ORDER_TOKEN_KEY, order.token)
  }

  // Store in localStorage now, so we can deprecate cookies in the future
  Lockr.set(STORAGE_KEY, {
    number: order.number,
    signifydSessionId: order.signifydSessionId,
    token: order.token,
  })
}

export const remove = () => {
  Cookies.expire(CURRENT_ORDER_NUMBER_KEY)
  Cookies.expire(CURRENT_ORDER_SIGNIFYD_SESSION_ID_KEY)
  Cookies.expire(CURRENT_ORDER_TOKEN_KEY)

  // Clean up localStorage
  Lockr.rm(STORAGE_KEY)
}

export const removeNumberAndToken = () => {
  const { signifydSessionId } = load()

  Cookies.expire(CURRENT_ORDER_NUMBER_KEY)
  Cookies.expire(CURRENT_ORDER_TOKEN_KEY)

  // Save only signifydSessionId to localstorage
  save({ signifydSessionId })
}

// V2 order info
export const extendWithCartAttrs = (attrs) => {
  const { number, signifydSessionId, token } = load()

  if (number && signifydSessionId && token) {
    return Object.assign({}, attrs, {
      cart_number: number,
      cart_signifyd_session_id: signifydSessionId,
      cart_token: token,
    })
  }

  return attrs
}
