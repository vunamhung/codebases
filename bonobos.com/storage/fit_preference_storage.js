import Lockr from "lockr"
import * as Cookies from "highline/utils/cookies"
import { isLocalStorageSupported } from "highline/utils/local_storage"

const STORAGE_KEY = "fitPreferences"
const DEFAULTS = { isEnabled: false }

export const load = () => {
  // Add a cookie fallback for private browsing mode
  if (!isLocalStorageSupported()) {
    return {
      isEnabled: Cookies.get("fitPreferencesEnabled") || null,
    }
  }

  return Lockr.get(STORAGE_KEY) || DEFAULTS
}

export const save = (fitPreferences) => {
  Lockr.set(STORAGE_KEY, fitPreferences)

  if (!isLocalStorageSupported()) {
    Cookies.set("fitPreferencesEnabled", fitPreferences.isEnabled)
  }
}

export const remove = () => {
  Lockr.rm(STORAGE_KEY)
  Cookies.expire("fitPreferencesEnabled")
}
