import Lockr from "lockr"
import * as Cookies from "highline/utils/cookies"

export const isLocalStorageSupported = () => {
  const testKey = "test", storage = window.localStorage
  try {
    storage.setItem(testKey, "1")
    storage.removeItem(testKey)
    return true
  } catch (error) {
    if (error.message && !error.name.includes("QuotaExceededError")) {
      setTimeout(() => {
        throw error
      })
    }
    return false
  }
}

export const storeInLocalStorageWithCookieFallback = (key, value) => {
  if (isLocalStorageSupported()) {
    Lockr.set(key, value)
  } else {
    Cookies.set(key, value)
  }
}

export const readFromLocalStorageOrCookie = (key) => {
  if (isLocalStorageSupported()) {
    return Lockr.get(key)
  } else {
    return Cookies.get(key)
  }
}