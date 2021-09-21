import { fromJS, Map } from "immutable"
import {
  storeInLocalStorageWithCookieFallback,
  readFromLocalStorageOrCookie,
} from "highline/utils/local_storage"

export const storeBlacklistedProductColors = (sku, color) => {
  const blacklistedProductColorsLocalStorage = readBlacklistedProductsFromStorage()
  let blacklistedProducts = blacklistedProductColorsLocalStorage || Map()

  if (blacklistedProductColorsLocalStorage && blacklistedProductColorsLocalStorage.get(sku)) {
    blacklistedProducts = blacklistedProducts.updateIn([sku, "color"], (arr) => {
      return arr.includes(color) ? arr : arr.push(color)
    })
  } else {
    blacklistedProducts = blacklistedProducts.set(sku, { color: [color] })
  }

  storeInLocalStorageWithCookieFallback("blacklisted_products", blacklistedProducts)
}

export const readBlacklistedProductsFromStorage = () => {
  return fromJS(readFromLocalStorageOrCookie("blacklisted_products")) || Map()
}
