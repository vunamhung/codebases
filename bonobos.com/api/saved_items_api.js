import { get, post, del } from "highline/api/v2_client"
import { toDecamelizedJSON } from "highline/utils/immutable_helper"

export const fetch = (authToken) => {
  return get("/wishlist", {},
    { "X-Authentication-Token": authToken },
  )
}

export const publicFetch = (wishlistId) => {
  return get(`/wishlist/${wishlistId}`)
}

export const addItem = (authToken, sku, slug, selectedOptions) => {
  return post("/wishlist/add",
    {
      sku,
      return_all_items: true,
      product_slug: slug,
      ...toDecamelizedJSON(selectedOptions),
    },
    { "X-Authentication-Token": authToken },
  )
}

export const removeItem = (authToken, sku, slug, selectedOptions) => {
  return del("/wishlist/remove",
    {},
    {
      sku,
      return_all_items: true,
      product_slug: slug,
      ...toDecamelizedJSON(selectedOptions),
    },
    { "X-Authentication-Token": authToken },
  )
}
