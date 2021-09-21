import { fromJS, Map } from "immutable"
import { isServer } from "highline/utils/client.js"

function getCookies() {
  // prevents ReferenceError in SSR
  if (isServer) return Map()

  const cookies = document.cookie.split(/;\s*/).map((cookie) => {
    const [key, value] = cookie.split("=")
    return { key: decodeURI(key) , value: decode(value) }
  })

  return fromJS(cookies)
}

export const get = (key) => {
  const cookie = getCookies().find(
    (cookie) => cookie.get("key") === decodeURI(key),
    Map(), /* not found */
  )
  if (cookie)
    return cookie.get("value")
  else
    return undefined
}

export const set = (key, value, options = {}) => {
  // document check needed due to Next.js server-side rendering
  if (isServer) return undefined

  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 10)

  const opts = Object.assign(
    {},
    { expires: expires.toUTCString(), path: "/" },
    options,
  )

  let cookie = `${encodeURI(key)}=${encodeURI(JSON.stringify(value))}`

  if (opts.expires)
    cookie += `; expires=${opts.expires}`

  if (opts.path)
    cookie += `; path=${opts.path}`

  if (window.location.protocol === "https:") {
    cookie += "; secure"
  }
  
  document.cookie = cookie
  return cookie
}

export const expire = (key, options = {}) => {
  const expires = new Date(1984, 1, 1)

  const opts = Object.assign(
    {},
    { expires: expires.toUTCString(), path: "/" },
    options,
  )

  set(key, undefined, opts)
}

function decode(value) {
  if (value) {
    const decoded = decodeURI(value)
    try {
      return JSON.parse(decoded)
    } catch (error) {
      return decoded
    }
  }
}
