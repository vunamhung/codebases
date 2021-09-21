import Lockr from "lockr"
import * as Cookies from "highline/utils/cookies"
import { isLocalStorageSupported } from "highline/utils/local_storage"
import { isServer } from "highline/utils/client"

const STORAGE_KEY = "userAuth"
const DEFAULTS = { authenticationToken: null, userId: null }
const AUTHENTICATION_TOKEN_KEY = "spree_authenticationToken"
const CURRENT_USER_ID_KEY = "spree_currentUserId"

export const load = () => {
  if (isServer)
    return DEFAULTS

  // Add a cookie fallback for private browsing mode
  if (!isLocalStorageSupported()) {
    return {
      authenticationToken: Cookies.get(AUTHENTICATION_TOKEN_KEY) || null,
      userId: Cookies.get(CURRENT_USER_ID_KEY) || null,
    }
  }

  return Lockr.get(STORAGE_KEY) || DEFAULTS
}

export const save = (attributes) => {
  Lockr.set(STORAGE_KEY, {
    authenticationToken: attributes.authenticationToken,
    userId: attributes.userId,
  })

  // Still need the cookie for the shipping label controller for now
  Cookies.set(AUTHENTICATION_TOKEN_KEY, attributes.authenticationToken)
  Cookies.set(CURRENT_USER_ID_KEY, attributes.userId)
}

export const remove = () => {
  Lockr.rm(STORAGE_KEY)
  Cookies.expire(AUTHENTICATION_TOKEN_KEY)
  Cookies.expire(CURRENT_USER_ID_KEY)
}
