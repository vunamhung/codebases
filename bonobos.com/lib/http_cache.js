import Qs from "qs"
import Rollbar from "highline/utils/rollbar"
import serverRequire from "highline/utils/server_require"
import getConfig from "highline/config/application"
const crypto = serverRequire("crypto")
const Redis = serverRequire("highline/commonjs/redis")

let RedisClient = null

const defaultExpireSeconds = parseInt(getConfig().defaultExpireSeconds)
const maxExpireSeconds = parseInt(getConfig().maxExpireSeconds)

export default async function httpCache(httpClient, httpRequestOptions) {
  try {
    const cacheKey = generateCacheKey(httpRequestOptions)
    const redisClient = getRedisClient()
    const cachedResponse = await redisClient.getObject(cacheKey) // check cache

    if (cachedResponse) { // cache hit
      if (Date.now() > cachedResponse.expires) { // response stale
        setTimeout(() => {
          fetchAndUpdate(httpClient, httpRequestOptions, cacheKey, cachedResponse)
        })
      }
      return cachedResponse

    } else { // cache miss
      return await fetchAndUpdate(httpClient, httpRequestOptions, cacheKey, null)
    }

  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      Rollbar.error("Redis: HTTP Fallback - ECONNREFUSED", error)
      return httpClient.request(httpRequestOptions)

    } else {
      throw error
    }
  }
}

// make request and set cache depending on response headers
async function fetchAndUpdate(httpClient, httpRequestOptions, cacheKey, cachedResponse) {
  try {

    // use cached ETag if present
    if (cachedResponse && cachedResponse.headers && cachedResponse.headers["etag"]) {
      Object.assign(httpRequestOptions.headers, { "If-None-Match": cachedResponse.headers["etag"] })
    }

    // make request
    const response = await httpClient.request(httpRequestOptions)

    // setup response object
    const responseObject = extractResponseObject(response)
    const cacheControl = parseCacheControl(responseObject.headers)
    responseObject.expires = calculateExpires(cacheControl)

    if (response.status === 304) { // update chached response and return
      Object.assign(cachedResponse.headers, responseObject.headers)
      setCache(cacheKey, cachedResponse, cacheControl)
      return cachedResponse
    }

    if (!cacheControl["max-age"] || cacheControl["no-cache"] || cacheControl["no-store"]) // dont cache
      return responseObject

    setCache(cacheKey, responseObject, cacheControl)

    return responseObject

  } catch (error) {
    if (!error.response && !error.statusText) // log non-http errors
      Rollbar.error("HTTP_CACHE error", error)

    throw error
  }
}

function setCache(cacheKey, response, cacheControl) {
  const redisClient = getRedisClient()
  let expiry = maxExpireSeconds
  if (cacheControl["must-revalidate"])
    expiry = expireSeconds(cacheControl)
  redisClient.setObject(cacheKey, response, "EX", expiry)
}

function generateCacheKey(httpRequestOptions) {
  const method = httpRequestOptions.method
  const url = httpRequestOptions.url
  const params = Qs.stringify(httpRequestOptions.params || {})
  const headers = Qs.stringify(httpRequestOptions.headers || {})
  const hash = crypto.createHash("md5").update(`${params}&${headers}`).digest("hex")

  return `${method} ${url}:${hash}`
}

// Default axios response is a circular object
// which breaks JSON.stringify. Just pull out
// the response values we care about
function extractResponseObject(response) {
  return {
    data: response.data,
    headers: response.headers,
    status: response.status,
    statusText: response.statusText,
  }
}

function parseCacheControl(responseHeaders) {
  if (!responseHeaders["cache-control"])
    return {}

  const cacheControl = {}
  responseHeaders["cache-control"].split(",").forEach((value) => {
    value = value.trim()
    if (value.includes("=")) {
      const [k, v] = value.split("=")
      const maxAge = parseInt(v)
      if (!isNaN(maxAge)) {
        cacheControl[k] = maxAge
      }
    } else {
      cacheControl[value] = true
    }
  })

  return cacheControl
}

function calculateExpires(cacheOptions) {
  return Date.now() + (expireSeconds(cacheOptions) * 1000)
}

function expireSeconds(cacheOptions) {
  return cacheOptions["max-age"] || defaultExpireSeconds
}

function getRedisClient()  {
  if (RedisClient === null && Redis) {
    RedisClient = Redis.createClient()
  }

  return RedisClient
}
