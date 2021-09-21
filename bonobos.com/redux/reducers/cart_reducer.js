import { fromJS, Map, List } from "immutable"
import * as OrderStorage from "highline/storage/order_storage"
import ActionTypes from "highline/redux/action_types"
import LineItemRecord from "highline/records/line_item"
import emojiRegex from "emoji-regex"
import Rollbar from "highline/utils/rollbar"

const initialState = fromJS({
  adyenMerchantSignature: "",
  availableShippingRates: [],
  coveredByStoreCredit: false,
  creditCard: {},
  currentStep: 0,
  errorStatusCode: null,
  giftingEdited: false,
  giftNote: null,
  isFirstCompletedOrder: false,
  isGift: false,
  isInitialLoad: true,
  isLastStep: false,
  isLoading: false,
  isNavigatingToCheckout: false,
  isOrderCompleted: false,
  isOrderSummaryOpen: false,
  isPromoAutoApplied: false,
  isPromoFieldOpen: false,
  isTaxCalculated: false,
  itemCount: 0,
  lineItems: [],
  markdown: {},
  number: "",
  paypalInputs: {},
  promoCodeDetails: {
    code: "",
    error: {},
    isLoading: false,
    isPromoCodeApplied: false,
  },
  promotion: {},
  shippingRate: {},
  showError: false,
  signifydSessionId: "",
  storeCreditRemainingAfterCapture: "",
  storeCreditTotal: "",
  storeCreditTotalNumeric: 0,
  subtotal: "",
  subtotalNumeric: 0,
  suggestedItem: {},
  suggestedItemFetchFailed: false,
  surchargeTotal: "",
  surchargeTotalNumeric: 0,
  taxTotal: "",
  taxTotalNumeric: 0,
  token: "",
  total: "",
  totalNumeric: 0,
})

const cartReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.CART_ADD_LINE_ITEMS_STARTED:
      return action.isIncrement ? state : state.set("newLineItemLoading", true)

    case ActionTypes.PAGE_LOADED:
      return updateFromStorage(state).set("isReady", true)

    case ActionTypes.USER_LOGGED_IN:
    case ActionTypes.USER_LOGGED_OUT:
    case ActionTypes.CART_NOT_FOUND:
    case ActionTypes.CART_NOT_FETCHED:
    case ActionTypes.CART_LOAD_FAILED:
    case ActionTypes.CART_LOAD_ITEM_COUNT_FAILED:
      return initialState

    case ActionTypes.CART_OPEN_CLICKED:
      return state.set("isLoading", true)

    case ActionTypes.CART_LOAD_ITEM_COUNT_SUCCEEDED:
      return state.set("totalQuantity", action.itemCount)

    case ActionTypes.CART_PROMO_CODE_INPUT_CHANGED:
      return state.setIn(["promoCodeDetails", action.name], action.value)
        .setIn(["promoCodeDetails", "error"], fromJS({}))

    case ActionTypes.CART_ADD_AS_GIFT_SUCCEEDED:
    case ActionTypes.CART_LOADED:
    case ActionTypes.CART_PROMO_APPLIED:
    case ActionTypes.CART_PROMO_REMOVED:
    case ActionTypes.LINE_ITEMS_ADDED_TO_CART:
    case ActionTypes.LINE_ITEMS_REMOVED_FROM_CART: {
      if (!action.cart.get("items")) {
        Rollbar.info(`Received no items for action: ${ action.type }`, action.cart)
      }

      return state.merge(Map({
        adyenMerchantSignature: action.cart.get("adyenMerchantSignature"),
        bundleDiscountTotal: action.cart.get("bundleDiscountTotal"),
        bundleDiscountTotalNumeric: action.cart.get("bundleDiscountTotalNumeric"),
        isPromoFieldOpen: false,
        itemCount: action.cart.get("itemCount"),
        estimatedStoreCredit: action.cart.get("estimatedStoreCredit"),
        estimatedStoreCreditNumeric: action.cart.get("estimatedStoreCreditNumeric"),
        estimatedTotal: action.cart.get("estimatedTotal"),
        giftingEdited: false,
        giftNote: action.cart.get("giftNote"),
        internationalSurcharge: action.cart.get("surchargeTotal"),
        isGift: action.cart.get("gift"),
        isLoading: false,
        lineItems: action.cart.get("items") ? action.cart.get("items").map((item) => new LineItemRecord(item)) : List(),
        markdown: action.cart.get("estimatedMarkdown"),
        newLineItemLoading: false,
        number: action.cart.get("number"),
        paypalInputs: action.cart.get("paypalInputs"),
        promo: getUpdatedPromo(action.cart.get("promotion")),
        promoCodeDetails: getUpdatedPromoCodeDetails(state, action.cart.get("promotion")),
        shipping: action.cart.get("shippingRate"),
        storeCredit: action.cart.get("storeCreditTotal"),
        subtotal: action.cart.get("estimatedOriginalPriceTotal"),
        subtotalNumeric: action.cart.get("subtotalNumeric"),
        surchargeTotal: action.cart.get("surchargeTotal"),
        surchargeTotalNumeric: action.cart.get("surchargeTotalNumeric"),
        taxTotal: action.cart.get("taxTotal"),
        taxTotalNumeric: action.cart.get("taxTotalNumeric"),
        token: action.cart.get("token"),
        total: action.cart.get("total"),
        totalNumeric: action.cart.get("totalNumeric"),
        totalQuantity: action.cart.get("itemCount"),
      }))
    }

    case ActionTypes.CART_PROMO_STARTED:
      return state.setIn(["promoCodeDetails", "isLoading"], true)

    case ActionTypes.CART_PROMO_FAILED:
      return state.set("promoError", action.error)
        .setIn(["promoCodeDetails", "isLoading"], false)

    case ActionTypes.CART_PROMO_ERROR_TIMED_OUT:
      return state.set("promoError", "")

    case ActionTypes.CART_PROMO_FIELD_TOGGLED:
      return state.merge({
        isPromoFieldOpen: !state.get("isPromoFieldOpen"),
      })

    case ActionTypes.CART_PROMO_AUTO_APPLIED:
      return state.set("isPromoAutoApplied", true)

    case ActionTypes.CART_PROMO_AUTO_REMOVED:
      return state.set("isPromoAutoApplied", false)

    case ActionTypes.SUGGESTED_ITEM_DISMISSED:
    case ActionTypes.SUGGESTED_ITEM_ADDED_TO_CART:
      return state.set("suggestedItem", fromJS({}))

    case ActionTypes.SUGGESTED_ITEM_FETCH_SUCCEEDED:
      return state.merge({
        suggestedItem: action.suggestedItem,
      })

    case ActionTypes.SUGGESTED_ITEM_FETCH_FAILED:
      return state.set("suggestedItemFetchFailed", true)

    case ActionTypes.CHECKOUT_CLICKED:
      return action.isLoggedIn ? state.set("isNavigatingToCheckout", true) : state

    case ActionTypes.CART_ADD_LINE_ITEMS_FAILED:
      return state.set("newLineItemLoading", false)


    case ActionTypes.CART_ADD_AS_GIFT_FAILED:
      return state.set("errorStatusCode", action.error)

    case ActionTypes.CART_GIFT_NOTE_INPUT_CHANGED:
      const giftNote = action.giftNote === null ? null : action.giftNote.replace(emojiRegex(), "")

      return state.merge({
        giftingEdited: action.giftingEdited,
        giftNote,
      })

    case ActionTypes.CART_IS_GIFT_INPUT_TOGGLED:
      return state.merge({
        giftingEdited: action.giftingEdited,
        isGift: action.isGift,
      })

    default:
      return state
  }
}

function updateFromStorage(state) {
  const { number, signifydSessionId, token } = OrderStorage.load()

  return state.merge(Map({
    number,
    signifydSessionId,
    token,
  }))
}

function getUpdatedPromo(promotion) {
  return promotion && !promotion.isEmpty() ? promotion : fromJS({})
}

function getUpdatedPromoCodeDetails(oldCart, promotion) {
  let promoCodeDetails = oldCart.get("promoCodeDetails")

  if (promotion && !promotion.isEmpty()) {
    promoCodeDetails = fromJS({
      code: promotion.get("code"),
      error: null,
      isLoading: false,
      isPromoCodeApplied: true,
    })
  } else {
    if (promoCodeDetails.get("isPromoCodeApplied")) {
      promoCodeDetails = fromJS({
        code: "",
        error: {},
        isLoading: false,
        isPromoCodeApplied: false,
      })
    }
  }

  return promoCodeDetails
}

export default cartReducer
