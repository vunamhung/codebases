import uuidv4 from "uuid/v4"
import * as CookieUitl from "highline/utils/cookies"

const SOD_COOKIE_NAME = "SOD"

export const setSodCookie = () => {
  const encodedCookieName = `${SOD_COOKIE_NAME}=true_${uuidv4()}`
  document.cookie = encodeURI(encodedCookieName)
}

export const getSodCookie = () => {
  const cookieId = CookieUitl.get(SOD_COOKIE_NAME)
  if (cookieId) {
    return cookieId.split("true_")[1]
  }
  return null
}