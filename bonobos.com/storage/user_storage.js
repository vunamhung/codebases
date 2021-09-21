import Lockr from "lockr"
import * as Cookies from "highline/utils/cookies"
import { isLocalStorageSupported } from "highline/utils/local_storage"

const STORAGE_KEY = "user"
const DEFAULTS = { email: null, externalId: null, firstName: "", hashedEmail: null, lastName: "" }

export const load = () => {
  // Add a cookie fallback for private browsing mode
  if (!isLocalStorageSupported()) {
    return {
      email: Cookies.get("email") || null,
      externalId: Cookies.get("externalId") || null,
      firstName: Cookies.get("firstName") || "",
      lastName: Cookies.get("lastName") || "",
    }
  }

  return Lockr.get(STORAGE_KEY) || DEFAULTS
}

export const save = (attributes) => {
  Lockr.set(STORAGE_KEY, attributes)

  if (!isLocalStorageSupported()) {
    Cookies.set("email", attributes.email)
    Cookies.set("externalId", attributes.externalId)
    Cookies.set("firstName", attributes.firstName)
    Cookies.set("lastName", attributes.lastName)
  }
}

export const remove = () => {
  Lockr.rm(STORAGE_KEY)

  Cookies.expire("email")
  Cookies.expire("externalId")
  Cookies.expire("firstName")
  Cookies.expire("lastName")
}
