import { inCartRecommendations } from "highline/api/constructor_api"
import { get } from "highline/api/v2_client"
import { readBlacklistedProductsFromStorage } from "highline/storage/cart/suggested_item_storage"

export const fetchSuggestedItem = async (itemId) => {
  return await inCartRecommendations(itemId)
}

export const fetchSuggestedItemFlatiron = (number, token) => {
  return get("/suggested_item",
    {
      blacklisted_products: readBlacklistedProductsFromStorage().toJS(),
      order: number,
    },
    { "X-Cart-Token": token },
  )
}