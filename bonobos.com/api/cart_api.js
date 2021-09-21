import { get, del, put, post } from "highline/api/v2_client"
import { toDecamelizedJSON } from "highline/utils/immutable_helper"

// might need to add toDecamelizedJSON
export const create = (items, authToken) => {
  return post("/carts",
    { items: toDecamelizedJSON(items) },
    { "X-Authentication-Token": authToken },
  )
}

export const fetch = (number, token) => {
  return get(`/carts/${number}`, {}, {
    "X-Cart-Token": token,
    "Cache-Control": "no-cache, no-store",
  })
}

export const fetchItemCount = (number, token) => {
  return get(`/carts/${number}`, {}, {
    "Accept": "application/json;v=2.0;schema=gramercy.item_count",
    "Cache-Control": "no-cache, no-store",
    "X-Cart-Token": token,
  })
}

export const fetchItemCountByUser = (authToken) => {
  return get("/cart", {}, {
    "Accept": "application/json;v=2.0;schema=gramercy.item_count",
    "Cache-Control": "no-cache, no-store",
    "X-Authentication-Token": authToken,
  })
}

export const current = (authToken) => {
  return get("/cart", {}, {
    "X-Authentication-Token": authToken,
  })
}

export const addLineItems = (number, token, items) => {
  return post(`/carts/${number}/items`,
    {
      items: toDecamelizedJSON(items),
      skip_shipping_and_tax_calc: true,
    },
    { "X-Cart-Token": token },
  )
}

export const removeLineItems = (number, token, items) => {
  return del(`/carts/${number}/items`,
    {},
    {
      items: toDecamelizedJSON(items),
      skip_shipping_and_tax_calc: true,
    },
    { "X-Cart-Token": token },
  )
}

export const applyPromo = (number, token, promotion) => {
  return put(`/carts/${number}/promotion`,
    {},
    {
      promotion,
      skip_shipping_and_tax_calc: true,
    },
    { "X-Cart-Token": token },
  )
}

export const removePromo = (number, token) => {
  return del(`/carts/${number}/promotion`,
    {},
    {},
    {
      "X-Cart-Token": token,
    },
  )
}

export const update = (number, token, update_attributes) => {
  return put(`/carts/${number}`,
    {},
    update_attributes,
    {
      "Cache-Control": "no-cache, no-store",
      "X-Cart-Token": token,
    })
}

export const addGift = (number, token, gift_note, isGift) => {
  return put(`/carts/${number}/gift`,
    {},
    {
      gift: isGift,
      gift_note,
    },
    { "X-Cart-Token": token },
  )
}

export const removeGiftCard = (number, token, giftCardId) =>
  put(`/carts/${number}`,
    {},
    {
      payments_attributes: {
        _destroy: true,
        id: giftCardId,
      },
    },
    {
      "Cache-Control": "no-cache, no-store",
      "X-Cart-Token": token,
    })
