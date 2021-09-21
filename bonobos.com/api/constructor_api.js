import getConfig from "highline/config/application"
import ConstructorIOClient from "@constructor-io/constructorio-client-javascript"
import { toCamelizedImmutable } from "highline/utils/immutable_helper"
import { convertRecForConstructor, convertToRecommendationProducts } from "highline/utils/product_mapper_helper"
import { convertOrderItemsForConstructorTracking } from "highline/utils/constructor_helper"
import { detectTabletWidth } from "highline/utils/viewport"
import { fromJS } from "immutable"
import constructorBrowseGroupFixture from "highline/cypress/fixtures/constructor/browse_group.json"
import { isServer } from "highline/utils/client"
import Rollbar from "highline/utils/rollbar"

const {
  constructorKey,
  constructorPlpNumResultsPerPageMobile,
  constructorPlpNumResultsPerPageDesktop,
  constructorSearchNumResultsPerPageMobile,
  constructorSearchNumResultsPerPageDesktop,
  isFeatureMode,
  numPdpRecommendations,
  numZeroResultsRecommendations,
} = getConfig()
export const client = new ConstructorIOClient({
  apiKey: constructorKey || "mock-string",
  segments: ["ecomm"],
  sendTrackingEvents: true,
})

export const fetchSearchResult = async (searchTerm, params = {}) => {
  const isTablet = detectTabletWidth()
  params["resultsPerPage"] = (isTablet)
    ? constructorSearchNumResultsPerPageMobile
    : constructorSearchNumResultsPerPageDesktop
  try {
    const response = await client.search.getSearchResults(searchTerm, params)
    return toCamelizedImmutable(response)
  } catch (err) {
    Rollbar.error(`Constructor: Search Failed - ${err.toString()}`, err)
    throw fromJS({ err })
  }
}

export const fetchCategory = async (categoryId, params = {}, initialPageNumber = 1) => {
  // Conditional to support server-side constructor call in cypress test to route "/shop/clothing"
  if (isFeatureMode && isServer) {
    if (categoryId === 1027) {
      return toCamelizedImmutable(constructorBrowseGroupFixture)
    } else {
      throw "Blocking Constructor for Cypress Tests. Routing to Flatiron"
    }
  }

  const isTablet = detectTabletWidth()
  const pageSize = (isTablet)
    ? constructorPlpNumResultsPerPageMobile
    : constructorPlpNumResultsPerPageDesktop
  params["resultsPerPage"] = initialPageNumber * parseInt(pageSize)
  try {
    const response = await client.browse.getBrowseResults("group_id", categoryId.toString(), params)
    return toCamelizedImmutable(response)
  } catch (err) {
    Rollbar.error(`Constructor: Category Fetch Failed - ${err.toString()}`, err)
    throw fromJS({ err })
  }
}

export const inCartRecommendations = async (itemIds) => {
  return client.recommendations.getRecommendations(recommendationPods.inCartPod1, { itemIds, numResults: 1 })
    .then((data) => {
      const immutableData = toCamelizedImmutable(data)
      const massagedData = convertRecForConstructor(immutableData, recommendationPods.inCartPod1)
      return (massagedData)
    }).catch((err) => {
      Rollbar.error(`Constructor: In Cart Recommendation Fetch Failed - ${err.toString()}`, err)
    })
}

const productRecommendations = async(itemIds, pod, numResults) => {
  return client.recommendations.getRecommendations(pod, { itemIds, numResults })
    .then((data) => {
      const immutableData = toCamelizedImmutable(data)
      const massagedData = convertToRecommendationProducts(immutableData.getIn(["response", "results"]), pod)
      return (massagedData)
    }).catch((err) => {
      Rollbar.error(`Constructor: Product Recommendation Fetch Failed - ${err.toString()}`, err)
    })
}
export const pdpRecommendations = async (itemIds) => {
  return productRecommendations(itemIds, recommendationPods.pdpPod1, numPdpRecommendations)
}
export const zeroResultsRecommendations = async () => {
  return productRecommendations("", recommendationPods.zeroResultsPod1, numZeroResultsRecommendations)
}

// https://constructor-io.github.io/constructorio-client-javascript/module-tracker.html#~trackPurchase
export const trackCustomerPurchase = (order) => {
  const items = convertOrderItemsForConstructorTracking(order.get("items"))
  const orderNumber = order.get("number")
  const revenue = parseFloat(order.get("totalNumeric"))

  client.tracker.trackPurchase({
    items,
    order_id: orderNumber,
    revenue,
  })
}

const recommendationPods = {
  homePagePod1: "home_page_1",
  homePagePod2: "home_page_2",
  inCartPod1: "cart_page_1", // As of 11/14/19 - this is Complementary Items
  pdpPod1: "item_page_1", // As of 11/14/19 - this is Alternative Items
  pdpPod2: "item_page_2", // As of 11/14/19 - this is Complementary Items
  zeroResultsPod1: "zero_results_1",
}
