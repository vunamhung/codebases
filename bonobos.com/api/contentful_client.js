import getConfig from "highline/config/application"
import Rollbar from "highline/utils/rollbar"
import serverRequire from "highline/utils/server_require"
import axios from "axios"
import { fromJS } from "immutable"
import { isServer } from "highline/utils/client"

const Redis = serverRequire("highline/commonjs/redis")
const fs = serverRequire("fs-extra")
const contentful = require("contentful")
const config = getConfig()

const publishedClient = !config.contentfulEnvironment ? {} : contentful.createClient({
  accessToken: config.contentfulAccessToken,
  environment: config.contentfulEnvironment,
  removeUnresolved: true, // This filters out any entry that is in a draft state
  space: config.contentfulSpace,
})

const previewClient = !config.contentfulEnvironment ? {} : contentful.createClient({
  accessToken: config.contentfulPreviewAccessToken,
  environment: config.contentfulEnvironment,
  host: config.contentfulPreviewHost,
  space: config.contentfulSpace,
})

let RedisClient = null
function getRedisClient()  {
  if (RedisClient === null && Redis) {
    RedisClient = Redis.createClient()
  }
  return RedisClient
}

// One hour expiration because Contentful will force the cache to clear on any record publish
const CONTENTFUL_REDIS_EXPIRATION = config.contentfulCacheExpireSeconds || 3600

const contentfulFetch = async (isPreview, contentType) => {
  const client = isPreview ? previewClient : publishedClient

  let contentfulResponse
  try {
    contentfulResponse = await client.getEntries({
      "content_type": contentType,
      "include": 10, //Include nested content data up to 10 levels
      "limit": 1000, //Hard limit of 1000 items from Contentful
    })
  } catch (err) { // on critical contentful failure, use backup json
    Rollbar.error(`Contentful Response Failed for ${contentType} - Err: ${err}: Backup data used`)
    await fetchStaticContentfulData("contentful_backup_data.json")
  }

  if (contentfulResponse.items.length < 1) {
    Rollbar.error(`204: Contentful Response Empty for ${contentType}: Backup data used`)
    await fetchStaticContentfulData("contentful_backup_data.json")
  }

  // Try to save response in redis, if it is not preview content
  if (!isPreview) {
    try {
      const redisClient = getRedisClient()
      redisClient && redisClient.setObject(`contentfulData-${contentType}`, contentfulResponse.items, "EX", CONTENTFUL_REDIS_EXPIRATION)
    } catch (err) {
      Rollbar.error(`Failed to save Contentful Response in redis: ${ err }`)
    }
  }

  return contentfulResponse.items
}

export const fetchContentfulDataAsync = async (contentType, isPreview = false, clearContentfulCache = false) => {
  if (isPreview) return await contentfulFetch(isPreview, contentType)
  if (config.isFeatureMode) return await fetchStaticContentfulData("mock_data/contentful_test_data.json")
  if (config.isContentfulDisabled) return await fetchStaticContentfulData("contentful_backup_data.json")
  if (clearContentfulCache) return await contentfulFetch(isPreview, contentType) // Really just replace cached value in redis

  // Try from Redis
  try {
    const redisClient = getRedisClient()
    const contentfulData = redisClient && await redisClient.getObject(`contentfulData-${contentType}`)
    if (contentfulData) return contentfulData
  } catch {
    Rollbar.error(`Error with Redis Cache for ${contentType}: Contentful Queried Instead`)
  }

  // Fallback to hitting contentful
  return await contentfulFetch(isPreview, contentType)
}

const fetchStaticContentfulData = async (filename) => {
  try {
    if (isServer) {
      const fileData = await fs.readFile(`./static/${filename}`)
      return fromJS(JSON.parse(fileData))
    } else {
      const response = await axios.get(`/static/${filename}`)
      return fromJS(response.data)
    }
  } catch (err) {
    Rollbar.error(`fetchLocalContentfulData err: ${err}`)
  }
}

// ===================================================================================
// Contentful Page Fetch
// ===================================================================================

const baseContentfulQuery = {
  "include": 10,
  "limit": 1000,
}

export const fetchContentfulPageAsync = async (url, isPreview = false, clearContentfulCache = false) => {
  // fetch the url '/' as 'index'
  if (url === "/") { 
    url = "index"
  }
  
  // remove any leading forward slashes
  if (url && url[0] === "/"){
    url = url.substring(1)
  }

  const query = {
    ...baseContentfulQuery,
    "content_type": "contentfulPage",
    "fields.url": url,
  }
  const redisKey = `contentfulData-contentfulPage-${encodeURIComponent(url)}`

  if (config.isFeatureMode) return await fetchStaticContentfulData(`mock_data/${redisKey}.json`)
  return await getContentfulData(query, redisKey, isPreview, clearContentfulCache)
}

// ===================================================================================
// Contentful Page Extras Fetch
// ===================================================================================
export const fetchContentfulPageExtrasAsync = async (pathPrefix, isPreview = false, clearContentfulCache = false) => {
  const query = {
    ...baseContentfulQuery,
    "content_type": "pageExtras",
    "fields.exactPathPrefix": pathPrefix,
  }
  const redisKey = `contentfulData-pageExtras-${encodeURIComponent(pathPrefix)}`
  return await getContentfulData(query, redisKey, isPreview, clearContentfulCache)
}

// ===================================================================================
// Contentful "Globals" Fetch
// ===================================================================================

export const fetchContentfulContentInsertionAsync = async (targets, isPreview = false, clearContentfulCache = false, redisAlias = null) => {
  const joinedTargets = targets.join(",")
  const query = {
    ...baseContentfulQuery,
    "content_type": "contentInsertion",
    "fields.target[in]": joinedTargets,
  }
  const redisKey = redisAlias ? redisAlias : `contentfulData-${joinedTargets}`
  return await getContentfulData(query, redisKey, isPreview, clearContentfulCache)
}

// ===================================================================================
// Contentful query helpers
// ===================================================================================

const getContentfulData = async (query, redisKey, isPreview, clearContentfulCache) => {
  if (config.isFeatureMode) return await fetchStaticContentfulData(`mock_data/${redisKey}.json`)

  let response
  if (!isPreview && !clearContentfulCache){
    response = await fetchFromRedis(redisKey)

    if (!response){
      Rollbar.info(`Error trying to fetch key, ${redisKey}: Contentful Queried Instead`)
    }
  }
  
  if (!response) {
    response = await fetchFromContentfulAndCache(query, isPreview, redisKey)
  }

  return response
}

const fetchFromRedis = async (redisKey) => {
  try {
    const redisClient = getRedisClient()
    const contentfulData = redisClient && await redisClient.getObject(redisKey)
    if (contentfulData) {
      return fromJS(contentfulData)
    }
  } catch (err) {
    Rollbar.error(`Unexpected exception when getting object from Redis: ${ err }`)
    return undefined
  }
}

const fetchFromContentfulAndCache = async (query, isPreview, redisKey) => {
  try {
    const client = isPreview ? previewClient : publishedClient
    const contentfulResponse = await client.getEntries(query)

    // if there's no response from contentful, return
    if (!contentfulResponse || contentfulResponse.items.length === 0) {
      return undefined
    }
  
    // Try to save response in redis, if it is not preview content
    if (!isPreview) {
      try {
        const redisClient = getRedisClient()
        redisClient && redisClient.setObject(redisKey, contentfulResponse.items, "EX", CONTENTFUL_REDIS_EXPIRATION)
      } catch (err) {
        Rollbar.error(`Failed to save Contentful Response in redis for "${redisKey}": ${ err }`)
      }
    }
    return fromJS(contentfulResponse.items)

  } catch (err) {
    Rollbar.error(`Unexpected exception when querying Contentful: ${ err }`)
    return undefined
  }

}
