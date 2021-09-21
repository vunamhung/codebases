import Rollbar, { formatHttpError } from "highline/utils/rollbar"
import getConfig from "highline/config/application"
import { isServer } from "highline/utils/client"
import { toCamelizedImmutable } from "highline/utils/immutable_helper"
import httpCache from "highline/lib/http_cache"
import * as CookieUtils from "highline/utils/cookies"
import cookie from "cookie"
import axios from "axios"

// API CONFIG
export const apiURL = getConfig().apiUrl
export const prefix = "api"
export const authPrefix = "user/spree_user/auth"
export const baseURL = `${apiURL}/${prefix}`
export const authURL = `${apiURL}/${authPrefix}`
export const schema = "gramercy"
export const clientAuthToken = getConfig().clientAuthToken
export const adminClientAuthToken = getConfig().adminClientAuthToken

const API_AUTH_COOKIE_NAME = "bff_sid" // constant also exists in bff codebase

// Acts as global state on the highline server and on each highline client
let pendingApiAuthSessionRequest = undefined // global state Promise for api auth cookie request
let apiAuthCookie = undefined // global state api auth cookie

// Make API request with configured client and
// process response data to immutable object
export async function performRequest(client, options) {
  return isServer
    ? serverSideRequest(client, options)
    : clientSideRequest(client, options)
}

async function clientSideRequest(client, options) {
  await fetchApiAuthSessionPromise()

  try {
    const response = await client.request(options)
    response.data = toCamelizedImmutable(response.data)
    return response

  } catch (error) {
    logHttpError("Client", error)

    if (error.response) {
      const response = error.response
      response.data = toCamelizedImmutable(response.data)
      throw response // surface failed api call
    } else {
      throw error
    }
  }
}

async function serverSideRequest(client, options) {
  await fetchApiAuthSessionPromise()
  const modifiedOptions = addServerSideCookieHeader(options)

  try {
    const response = await httpCache(client, modifiedOptions)
    response.data = toCamelizedImmutable(response.data)
    return response

  } catch (error) {
    logHttpError("Server", error)

    if (error.response) {
      const response = error.response
      response.data = toCamelizedImmutable(response.data)
      throw response // surface failed api call
    } else {
      throw error
    }
  }
}

// Log all 500 level http errors
export const logHttpError = (location, error) => {
  if (error.response && error.response.status >= 500) {
    Rollbar.error(`${ location } HTTP Error: ${ error.response.status }`, formatHttpError(error))
  }
}

const addServerSideCookieHeader = (options) => {
  if (!apiAuthCookie) return options

  // Warning. Will override other server-side request cookies
  options.headers = { ...options.headers, Cookie: `${ API_AUTH_COOKIE_NAME }=${ apiAuthCookie }` }

  return options
}

// Only do this once. Return the promise of the pending request for additional requests
const fetchApiAuthSessionPromise = () => {
  if (pendingApiAuthSessionRequest) return pendingApiAuthSessionRequest

  pendingApiAuthSessionRequest = fetchApiAuthSession()
  return pendingApiAuthSessionRequest
}

const { isFeatureMode } = getConfig()

const fetchApiAuthSession = async () => {
  if (isFeatureMode) return

  const authCookie  = isServer ? apiAuthCookie : CookieUtils.get(API_AUTH_COOKIE_NAME)
  if (authCookie) return

  try {
    const response = await apiAuthSession()

    // TODO: Works because the response is controlled by the bff. Make more robust.
    if (isServer) apiAuthCookie = cookie.parse(response.headers["set-cookie"][0])[API_AUTH_COOKIE_NAME]
  } catch (error) {
    Rollbar.error("Error in fetchApiAuthSession", error)
  }
}

// Need to define outside the standard clients to avoid a circular import reference
const apiAuthSession = () => (
  axios.get("/session", {
    baseURL,
    withCredentials: !isFeatureMode, // will raise CORS issues if true and app is pointed to flatiron
  })
)
