import { Map, List, fromJS } from "immutable"
import Rollbar, { formatHttpError } from "highline/utils/rollbar"
import ActionTypes from "highline/redux/action_types"
import * as CartApi from "highline/api/cart_api"
import * as SuggestedItemApi from "highline/api/suggested_item_api"
import { checkout as navigateToCheckout } from "highline/utils/navigate"
import { authValidationFailed } from "highline/redux/actions/auth_actions"
import { savedItemsAddProductAsync } from "highline/redux/actions/saved_items_actions"
import { getPromoCodeForRequest } from  "highline/redux/helpers/checkout_helper"
import getConfig from "highline/config/application"
import { addToast } from "highline/redux/actions/toast_actions.js"
import { getObjectByFirstField, getField } from "highline/utils/contentful/contentful_helper"
import { convertPrice } from "highline/utils/product_mapper_helper"
import { getPromoDiscount } from "highline/redux/helpers/category_helper"
import { getDiscountedPrice } from "highline/redux/helpers/product_detail_helper"
import { shouldExcludeProgram } from "highline/utils/promo_auto_apply_helper"

const ERROR_TIMEOUT = 5000 /* 5s */
const { disableCartRecommendations, enableGifting } = getConfig()

export const cartLoaded = (cart) => ({
  type: ActionTypes.CART_LOADED,
  cart,
})

export const cartNotFetched = () => ({
  type: ActionTypes.CART_NOT_FETCHED,
})

export const cartLoadFailed = (error) => ({
  type: ActionTypes.CART_LOAD_FAILED,
  error,
})

export const cartLoadItemCountStarted = () => ({
  type: ActionTypes.CART_LOAD_ITEM_COUNT_STARTED,
})

export const cartLoadItemCountSucceeded = (itemCount) => ({
  type: ActionTypes.CART_LOAD_ITEM_COUNT_SUCCEEDED,
  itemCount,
})

export const cartLoadItemCountFailed = () => ({
  type: ActionTypes.CART_LOAD_ITEM_COUNT_FAILED,
})

export const cartLoadItemCountCompleted = () => ({
  type: ActionTypes.CART_LOAD_ITEM_COUNT_COMPLETED,
})

export const cartPromoApplied = (cart) => ({
  type: ActionTypes.CART_PROMO_APPLIED,
  cart,
})

export const cartPromoRemoved = (cart) => ({
  type: ActionTypes.CART_PROMO_REMOVED,
  cart,
})

export const cartPromoFailed = (error, promo, orderNumber) => ({
  type: ActionTypes.CART_PROMO_FAILED,
  error,
  promo,
  orderNumber,
})

export const cartPromoCodeInputChanged = (name, value) => ({
  name,
  type: ActionTypes.CART_PROMO_CODE_INPUT_CHANGED,
  value,
})

export const cartPromoStarted = (promo, orderNumber) => ({
  type: ActionTypes.CART_PROMO_STARTED,
  promo,
  orderNumber,
})

export const cartPromoErrorTimedOut = () => ({
  type: ActionTypes.CART_PROMO_ERROR_TIMED_OUT,
})

const cartPromoAutoApplied = () => ({
  type: ActionTypes.CART_PROMO_AUTO_APPLIED,
})

const cartPromoAutoRemoved = () => ({
  type: ActionTypes.CART_PROMO_AUTO_REMOVED,
})

export const cartAddLineItemsFailed = (status, message, error) => ({
  type: ActionTypes.CART_ADD_LINE_ITEMS_FAILED,
  status,
  message,
  error,
})

export const cartAddLineItemsStarted = (orderNumber, lineItems, isIncrement, isTablet) => ({
  type: ActionTypes.CART_ADD_LINE_ITEMS_STARTED,
  lineItems,
  orderNumber,
  isIncrement,
  isTablet,
})

export const cartItemAddedToWishlist = (lineItem, location = "cart") => ({
  type: ActionTypes.CART_ITEM_ADDED_TO_WISHLIST,
  lineItem,
  location,
})

export const cartOpenClicked = () => ({
  type: ActionTypes.CART_OPEN_CLICKED,
})

export const cartCloseClicked = () => ({
  type: ActionTypes.CART_CLOSE_CLICKED,
})

export const cartNotFound = () => ({
  type: ActionTypes.CART_NOT_FOUND,
})

export const cartUnauthorizedCheckoutStarted = () => ({
  type: ActionTypes.CART_UNAUTHORIZED_CHECKOUT_STARTED,
})

export const cartBackClicked = () => ({
  type: ActionTypes.CART_BACK_CLICKED,
})

export const cartPaypalButtonClicked = () => ({
  type: ActionTypes.CART_PAYPAL_BUTTON_CLICKED,
})

export const cartPromoFieldToggled = () => ({
  type: ActionTypes.CART_PROMO_FIELD_TOGGLED,
})

export const checkoutClicked = (isLoggedIn) => ({
  type: ActionTypes.CHECKOUT_CLICKED,
  isLoggedIn,
})

export const lineItemsAddedToCart = (cart, lineItems) => ({
  type: ActionTypes.LINE_ITEMS_ADDED_TO_CART,
  cart,
  lineItems,
})

export const lineItemsRemovedFromCart = (cart, lineItems) => ({
  type: ActionTypes.LINE_ITEMS_REMOVED_FROM_CART,
  cart,
  lineItems,
})

export const suggestedItemAddedToCart = (suggestedItem) => ({
  type: ActionTypes.SUGGESTED_ITEM_ADDED_TO_CART,
  suggestedItem,
})

export const suggestedItemDismissed = (suggestedItem) => ({
  type: ActionTypes.SUGGESTED_ITEM_DISMISSED,
  suggestedItem,
})

export const suggestedItemFetchSucceeded = (suggestedItem) => ({
  type: ActionTypes.SUGGESTED_ITEM_FETCH_SUCCEEDED,
  suggestedItem,
})

export const suggestedItemFetchFailed = (error) => ({
  type: ActionTypes.SUGGESTED_ITEM_FETCH_FAILED,
  error,
})

export const suggestedItemProductPreviewClicked = (item) => ({
  type: ActionTypes.SUGGESTED_ITEM_PRODUCT_PREVIEW_CLICKED,
  selectedOptions: { color: item.getIn(["color", "name"]) },
  sku: item.get("productSku"),
  slug: item.get("productSlug"),
  swappableContents: "cart",
})

export const checkoutAsync = () => (
  async (dispatch, getState) => {
    const state = getState()

    if (state.getIn(["cart", "totalQuantity"]) === 0)
      return

    const isLoggedIn = state.getIn(["auth", "isLoggedIn"])

    await dispatch(cartAddAsGiftAsync())

    dispatch(checkoutClicked(isLoggedIn))

    if (isLoggedIn)
      navigateToCheckout()
    else
      dispatch(cartUnauthorizedCheckoutStarted())
  }
)

export const loadCartItemCountAsync = () => (
  async (dispatch, getState) => {
    const number = getState().getIn(["cart", "number"])
    const token = getState().getIn(["cart", "token"])
    const authenticationToken = getState().getIn(["auth", "authenticationToken"])
    dispatch(cartLoadItemCountStarted())

    try {
      let response
      if (number && token) {
        response = await CartApi.fetchItemCount(number, token)
      } else if (authenticationToken) {
        response = await CartApi.fetchItemCountByUser(authenticationToken)
      }

      if (response && response.data !== "") {
        return dispatch(cartLoadItemCountSucceeded(response.data.getIn(["cart", "itemCount"])))
      }

      dispatch(cartLoadItemCountCompleted())

    } catch (error) {
      if (error.status === 401) {
        logUnauthorizedCartFetch(error)
      } else {
        setTimeout(() => { throw error })
      }
      return dispatch(cartLoadItemCountFailed())
    }
  }
)

export const loadCartAsync = () => (
  async (dispatch, getState) => {
    const number = getState().getIn(["cart", "number"])
    const token = getState().getIn(["cart", "token"])

    if (number && token) {
      try {
        const response = await CartApi.fetch(number, token)

        dispatch(cartLoaded(response.data.get("cart")))
        dispatch(fetchSuggestedItemAsync(response.data.getIn(["cart", "items"])))
        dispatch(autoApplyPromoCodeAsync())
      } catch (error) {
        if (error.status === 401) {
          logUnauthorizedCartFetch(error)
        }

        if ([401, 404].includes(error.status)) {
          dispatch(cartLoadFailed())
          return dispatch(loadCurrentCartAsync())
        } else {
          setTimeout(() => { throw error })
        }
      }

    } else {
      return dispatch(loadCurrentCartAsync())
    }
  }
)

export const loadCurrentCartAsync = () => (
  async (dispatch, getState) => {
    const authenticationToken = getState().getIn(["auth", "authenticationToken"])

    if (!authenticationToken)
      return dispatch(cartNotFetched())

    try {
      const response = await CartApi.current(authenticationToken)
      if (response.data) { /* response.data will be empty if no current cart */
        dispatch(cartLoaded(response.data.get("cart")))
        dispatch(fetchSuggestedItemAsync(response.data.getIn(["cart", "items"])))
      } else {
        return dispatch(cartNotFound())
      }

    } catch (error) {
      if (error.status === 401) {
        logUnauthorizedCartFetch(error)
        return dispatch(authValidationFailed())
      }

      Rollbar.error("loadCurrentCartAsync: ", formatHttpError(error))
      return dispatch(cartLoadFailed())
    }
  }
)

export const fetchSuggestedItemAsync = (cartItems = List()) => (
  async (dispatch, getState) => {
    const shouldFetch = !disableCartRecommendations
      && !getState().getIn(["cart", "suggestedItemFetchFailed"])
      && cartItems.size > 0

    if (!shouldFetch) { return }

    try {
      const cartItemIds = cartItems.map((cartItem) => `${cartItem.get("productId")}-${cartItem.getIn(["options", "color"])}`)
      const responseData = await SuggestedItemApi.fetchSuggestedItem(cartItemIds.toJS())
      if (responseData.get("finalSale")) {
        return dispatch(suggestedItemFetchSucceeded(responseData))
      } else {
        const promoDiscount = getPromoDiscount(getState().getIn(["contentful", "globals"]))
        const shouldApplySitewideDiscount = promoDiscount && !shouldExcludeProgram(responseData.get("productSlug", responseData.get("finalSale")))
        const priceNumeric = parseInt(responseData.get("price").substring(1))
        const promoPriceNumeric = getDiscountedPrice(priceNumeric, promoDiscount)
        const response = fromJS({
          promoPrice: shouldApplySitewideDiscount && promoPriceNumeric && convertPrice(promoPriceNumeric),
          promoPriceNumeric: shouldApplySitewideDiscount && promoPriceNumeric,
        }).merge(responseData) || Map()
        return dispatch(suggestedItemFetchSucceeded(response))
      }
    } catch (error) {
      return dispatch(suggestedItemFetchFailed(error))
    }
  }
)

export const addLineItemsToCartAsync = (lineItems, onComplete, isIncrement, isTablet = false ) => (
  async (dispatch, getState) => {
    const state = getState()
    const number = state.getIn(["cart", "number"])
    const token = state.getIn(["cart", "token"])
    const authenticationToken = state.getIn(["auth", "authenticationToken"])
    dispatch(cartAddLineItemsStarted(number, lineItems, isIncrement, isTablet))

    const apiCall = (number && token) // current cart
      ? CartApi.addLineItems(number, token, lineItems)
      : CartApi.create(lineItems, authenticationToken)

    try {
      const response = await apiCall
      dispatch(lineItemsAddedToCart(response.data.get("cart"), lineItems))

      const suggestedItemAdded = lineItems.some((item) => item.get("slug") === state.getIn(["cart", "suggestedItem", "productSlug"]))
      if (suggestedItemAdded) {
        dispatch(suggestedItemAddedToCart(state.getIn(["cart", "suggestedItem"])))
      }

      dispatch(fetchSuggestedItemAsync(response.data.getIn(["cart", "items"])))
      dispatch(autoApplyPromoCodeAsync())
      // Do not trigger "Added to Cart" toast while on certain pages
      const triggerToast = lineItems.every((item) => !["quick shop", "cart"].includes(item.get("location")))
      if (triggerToast) {
        dispatch(addToast({ displayOn: "mobile", message: "Item added to cart" }))
      }
    } catch (error) {
      if (error.status === 404) {
        Rollbar.error("404: Could Not Add To Cart", formatHttpError(error))
        dispatch(cartNotFound()) // remove order from storage

        await dispatch(loadCurrentCartAsync())
        return dispatch(addLineItemsToCartAsync(lineItems, onComplete, isIncrement, isTablet))

      } else {
        dispatch(cartAddLineItemsFailed(error.status, error.statusText, error.data))
      }
    }

    if (onComplete)
      onComplete()
  }
)

export const removeLineItemsFromCartAsync = (lineItems, onComplete) => (
  async (dispatch, getState) => {
    const state = getState()
    const number = state.getIn(["cart", "number"])
    const token = state.getIn(["cart", "token"])

    if (!number || !token) {
      if (onComplete)
        onComplete()
      return
    }

    try {
      const response = await CartApi.removeLineItems(number, token, lineItems)
      dispatch(lineItemsRemovedFromCart(response.data.get("cart"), lineItems))
      dispatch(fetchSuggestedItemAsync(response.data.getIn(["cart", "items"])))
    } catch (error) {
      setTimeout(() => { throw error })
    }

    if (onComplete)
      onComplete()
  }
)

export const deleteLineItemFromCartAsync = (sku) => (
  async (dispatch, getState) => {
    const lineItem = getState().getIn(["cart", "lineItems"], List()).find(
      (lineItem) => lineItem.get("sku") === sku,
    )
    if (lineItem) {
      return dispatch(removeLineItemsFromCartAsync(List([lineItem])))
    }
  }
)

export const addToWishlistAsync = (sku) => (
  async (dispatch, getState) => {
    const state = getState()

    const lineItem = state.getIn(["cart", "lineItems"], List()).find(
      (lineItem) => lineItem.get("sku") === sku,
    )

    if (!lineItem)
      return

    try {
      await dispatch(savedItemsAddProductAsync(
        fromJS({
          sku,
          productSlug: lineItem.get("slug"),
          options: lineItem.get("options"),
        }),
        "cart",
      ))

      dispatch(cartItemAddedToWishlist(lineItem))
      dispatch(deleteLineItemFromCartAsync(sku))

    } catch (error) {
      setTimeout(() => { throw error })
    }
  }
)

function getPromoErrorMessage(error) {
  const data = error && error.data

  if (!data || !Map.isMap(data))
    return ""

  return data.getIn(["errors", "promotion", 0]) || data.get("error") || ""
}

const logUnauthorizedCartFetch = (error) => {
  Rollbar.error("401: Cart Unauthorized", formatHttpError(error))
}

export const autoApplyPromoCodeAsync = () => (
  async (dispatch, getState) => {
    const state = getState()
    const contentfulData = state.getIn(["contentful", "globals"])
    const promos = getField(getObjectByFirstField(contentfulData, "Auto-Apply Promo"), "content")
    const promo = promos && promos.first()
    const code = getField(promo, "promoCode")
    const cart = state.get("cart")
    const isLoading = cart.get("isLoading")
    const isPromoCodeApplied = getState().getIn(["cart", "promoCodeDetails", "isPromoCodeApplied"])

    if (!code || isLoading || isPromoCodeApplied) {
      return
    }

    const number = cart.get("number")
    const token = cart.get("token")

    dispatch(cartPromoStarted(code, number))

    if (number && token) {
      try {
        const requestCall = CartApi.applyPromo(number, token, code)

        const response = await requestCall
        dispatch(cartPromoAutoApplied())
        dispatch(cartPromoApplied(response.data.get("cart")))
      } catch (error) {
        const message = getPromoErrorMessage(error)
        dispatch(cartPromoFailed(message, code, number))

        setTimeout(() => {
          dispatch(cartPromoErrorTimedOut())
        }, ERROR_TIMEOUT)
      }
    }
  }
)

export const submitAddPromoCodeAsync = () => (
  async (dispatch, getState) => {
    const cart = getState().get("cart")
    const number = cart.get("number")
    const token = cart.get("token")
    const promoCodeDetails = cart.get("promoCodeDetails")
    const code = promoCodeDetails.get("code")
    const isLoading = cart.get("isLoading")

    if (!code || isLoading) {
      return
    }

    dispatch(cartPromoStarted(code, number))

    if (number && token) {
      try {
        const promoCodeForRequest = getPromoCodeForRequest(promoCodeDetails)
        const requestCall = CartApi.applyPromo(number, token, promoCodeForRequest)

        const response = await requestCall
        dispatch(cartPromoApplied(response.data.get("cart")))
      } catch (error) {
        const message = getPromoErrorMessage(error)
        dispatch(cartPromoFailed(message, code, number))

        setTimeout(() => {
          dispatch(cartPromoErrorTimedOut())
        }, ERROR_TIMEOUT)
      }
    }

  }
)

export const submitRemovePromoCodeAsync = () => (
  async (dispatch, getState) => {
    const cart = getState().get("cart")
    const number = cart.get("number")
    const token = cart.get("token")
    const promoCodeDetails = cart.get("promoCodeDetails")
    const code = promoCodeDetails.get("code")
    const isLoading = cart.get("isLoading")

    if (!code || isLoading) {
      return
    }

    dispatch(cartPromoStarted(code, number))

    if (number && token) {
      try {
        const requestCall = CartApi.removePromo(number, token)

        const response = await requestCall
        dispatch(cartPromoRemoved(response.data.get("cart")))
        if (cart.get("isPromoAutoApplied")) {
          dispatch(cartPromoAutoRemoved())
        }
      } catch (error) {
        const message = getPromoErrorMessage(error)
        dispatch(cartPromoFailed(message, code, number))

        setTimeout(() => {
          dispatch(cartPromoErrorTimedOut())
        }, ERROR_TIMEOUT)
      }
    }

  }
)

export const cartAddAsGiftAsync = () => (
  async (dispatch, getState) => {
    const cart = getState().get("cart")
    const { giftingEdited, giftNote, isGift, number, token } = cart.toJS()

    if (enableGifting && giftingEdited && number && token) {
      dispatch(cartAddAsGiftStarted(giftNote, isGift, number))
      try {
        const requestCall = CartApi.addGift(number, token, giftNote, isGift)

        const response = await requestCall
        dispatch(cartAddAsGiftSucceeded(response.data.get("cart")))

      } catch (error) {
        dispatch(cartAddAsGiftFailed(error.status))
      }
    }
  }
)

export const cartAddAsGiftFailed = (error) => ({
  error,
  type: ActionTypes.CART_ADD_AS_GIFT_FAILED,
})

export const cartAddAsGiftStarted = (giftNote, isGift, number) => ({
  giftNote,
  isGift,
  number,
  type: ActionTypes.CART_ADD_AS_GIFT_STARTED,
})

export const cartAddAsGiftSucceeded = (cart) => ({
  cart,
  type: ActionTypes.CART_ADD_AS_GIFT_SUCCEEDED,
})

export const cartGiftNoteChanged = (giftingEdited, giftNote) => ({
  giftingEdited,
  giftNote,
  type: ActionTypes.CART_GIFT_NOTE_INPUT_CHANGED,
})

export const cartIsGiftInputToggled = (giftingEdited, isGift) => ({
  giftingEdited,
  isGift,
  type: ActionTypes.CART_IS_GIFT_INPUT_TOGGLED,
})
