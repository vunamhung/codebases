import { buildUrl } from "highline/utils/url"
const { Map } = require("immutable")
import getConfig from "highline/config/application"
const DEFAULT_PATH_KEY = "home"
const { brandCode, ccpaUrlAffirmation, ccpaUrlRedirect } = getConfig()

export const paths = Map({
  about: "/about",
  account: "/account",
  admin: "/admin-new",
  app: "/app",
  ccpaReport: "/account/ccpa-report",
  checkout: "/checkout/address",
  contactUs: "/contact-us",
  fitPreferences: "/account/fit-preferences",
  guideshop: "/guideshop",
  help: "/help",
  home: "/",
  recoverPassword: "/recover-password",
  referAFriend: "/refer-a-friend",
  returns: "/returns",
  savedItems: "/account/saved-items",
  shipping: "/account/shipping",
  signIn: "/sign-in",
  signOut: "/sign-out",
  wallet: "/account/wallet",
  writeAReview: "/write-a-review",
})

function to(pathKey, options = {}) {
  const path = paths.get(pathKey) || paths.get(DEFAULT_PATH_KEY)
  window.location.replace(buildUrl(path, options))
}

export const checkout = (options = {}) => {
  to("checkout", options)
}

export const recoverPassword = (options = {}) => {
  to("recoverPassword", options)
}

export const signIn = (options = {}) => {
  to("signIn", options)
}

export const admin = (options = {}) => {
  to("admin", options)
}

export const ccpa = (encryptedValue) => {
  window.location.replace(`${ccpaUrlRedirect}?brandCode=${brandCode}&params=${encodeURIComponent(encryptedValue)}`)
}

export const ccpaAffirmation = (requestType, encryptedValue) => {
  window.location.replace(`${ccpaUrlAffirmation}?brandCode=${brandCode}&requestType=${requestType}&params=${encryptedValue}`)
}

export const redirect = (url = "/", serverRes = null) => {
  if (serverRes) {
    serverRes.writeHead(302, { Location: url })
    serverRes.end()
  } else {
    window.location.replace(url)
  }
}
