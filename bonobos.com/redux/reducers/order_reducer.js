import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"
import * as OrderStorage from "highline/storage/order_storage"
import { getNewMergedOrder } from "highline/redux/helpers/checkout_helper"

const initialState = fromJS({
  address: {
    address1: "",
    address2: "",
    city: "",
    country: {
      code: "US",
      name: "United States",
    },
    firstName: "",
    id: null,
    lastName: "",
    phone: "",
    postalCode: {
      code: "",
      label: "Zip",
    },
    region: {
      code: "",
      label: "State",
      name: "",
    },
  },
  adyenMerchantSignature: "",
  availableShippingRates: [],
  coveredByStoreCredit: false,
  creditCard: {},
  currentStep: 0,
  errorStatusCode: null,
  gift: false,
  giftNote: null,
  isCompletedGuestOrderLinkedToAccount: false,
  isEditingOrderEmail: false,
  isEditingShippingOnReview: false,
  isFirstCompletedOrder: false,
  isInitialLoad: true,
  isLastStep: false,
  isLoading: true,
  isOrderCompleted: false,
  isOrderSummaryOpen: false,
  isSubmittingOrder: false,
  isTaxCalculated: false,
  itemCount: 0,
  items: [],
  markdown: "",
  number: "",
  paidWithAffirm: false,
  payments: [],
  paypalInputs: {},
  promoCodeDetails: {
    code: "",
    error: {},
    isLoading: false,
    isPromoCodeApplied: false,
  },
  promotion: {},
  shippingRate: {},
  signifydSessionId: "",
  showErrorOnEmail: false,
  storeCreditRemainingAfterCapture: "",
  storeCreditTotal: "",
  storeCreditTotalNumeric: 0,
  subtotal: "",
  subtotalNumeric: "",
  surchargeTotal: "",
  surchargeTotalNumeric: 0,
  taxTotal: "",
  taxTotalNumeric: "",
  token: "",
  total: "",
  totalNumeric: "",
  bundleDiscountTotal: "",
  bundleDiscountTotalNumeric: 0,
})

const orderReducer = (state = initialState, action)  => {
  switch (action.type) {

    case ActionTypes.UPDATE_ORDER_ADDRESS_SUCCEEDED:
    case ActionTypes.ORDER_DELETE_LINE_ITEM_SUCCEEDED:
    case ActionTypes.BILLING_INFORMATION_ADD_SUCCEEDED:
    case ActionTypes.SHIPPING_INFORMATION_ADD_SUCCEEDED:
    case ActionTypes.APPLE_PAY_SHIPPING_INFORMATION_ADD_SUCCEEDED:
    case ActionTypes.ORDER_UPDATE_SUCCEEDED:
    case ActionTypes.ORDER_FETCH_SUCCEEDED:
    case ActionTypes.REMOVE_GIFT_CARD_REQUEST_SUCCEEDED: {
      const { signifydSessionId } = OrderStorage.load()

      const updateEditShipping = action.type === ActionTypes.SHIPPING_INFORMATION_ADD_SUCCEEDED
        ? { isEditingShippingOnReview: false }
        : {}

      return getNewMergedOrder(state, action.order).merge({
        isLoading: false,
        signifydSessionId,
        ...updateEditShipping,
      })
    }

    case ActionTypes.ORDER_SUMMARY_TOGGLED:
      return state.merge({
        isOrderSummaryOpen: !state.get("isOrderSummaryOpen"),
      })

    case ActionTypes.ORDER_EMAIL_UPDATE_FAILED: {
      return state.set("showErrorOnEmail", true)
    }

    case ActionTypes.ORDER_EMAIL_UPDATE_SUCCEEDED:
      return state.merge({
        email: action.email,
        isEditingOrderEmail: false,
        showErrorOnEmail: false,
      })

    case ActionTypes.ORDER_CHANGED_EMAIL_CLICKED: {
      return state.set("isEditingOrderEmail", true)
    }

    case ActionTypes.ORDER_EMAIL_UPDATE_CANCELLED: {
      return state.set("isEditingOrderEmail", false)
    }

    case ActionTypes.ORDER_STEP_LOCATION_CHANGED:
    case ActionTypes.SHIPPING_INFORMATION_REQUEST_STARTED:
    case ActionTypes.APPLE_PAY_SHIPPING_INFORMATION_REQUEST_STARTED:
    case ActionTypes.BILLING_INFORMATION_REQUEST_STARTED:
    case ActionTypes.ORDER_REQUEST_STARTED:
    case ActionTypes.APPLE_PAY_ORDER_REQUEST_STARTED:
      return state.set("isLoading", true)
    case ActionTypes.SUBMIT_ORDER_REQUEST_STARTED:
    case ActionTypes.APPLE_PAY_SUBMIT_ORDER_REQUEST_STARTED:
      return state.merge({
        isLoading: true,
        isSubmittingOrder: true,
      })

    case ActionTypes.ORDER_PROMO_CODE_INPUT_CHANGED:
      return state.setIn(["promoCodeDetails", action.name], action.value)
        .setIn(["promoCodeDetails", "error"], {})

    case ActionTypes.ORDER_SUBMIT_COMPLETE_SUCCEEDED:
    case ActionTypes.APPLE_PAY_ORDER_SUBMIT_COMPLETE_SUCCEEDED:
      return getNewMergedOrder(state, action.order)
        .merge({
          isOrderCompleted: true,
          isOrderSummaryOpen: true,
        })

    case ActionTypes.ORDER_SUBMIT_PROMO_CODE_SUCCEEDED:
    case ActionTypes.ORDER_SHIPPING_RATE_CHANGED_SUCCEEDED:
    case ActionTypes.APPLE_PAY_ORDER_SHIPPING_RATE_CHANGED_SUCCEEDED:
      return getNewMergedOrder(state, action.order)
        .set("isLoading", false)

    case ActionTypes.ORDER_FATAL_ERROR_RECEIVED:
    case ActionTypes.APPLE_PAY_ORDER_FATAL_ERROR_RECEIVED:
      return state.set("errorStatusCode", action.errorStatusCode)

    case ActionTypes.BILLING_INFORMATION_ADD_FAILED:
    case ActionTypes.SHIPPING_INFORMATION_REQUEST_COMPLETED:
    case ActionTypes.ORDER_REQUEST_COMPLETED:
    case ActionTypes.APPLE_PAY_ORDER_REQUEST_COMPLETED:
      return state.merge({
        isLoading: false,
        isSubmittingOrder: false,
      })

    case ActionTypes.ORDER_SUBMIT_PROMO_CODE_FAILED:
      return state.set("isLoading", false)
        .setIn(["promoCodeDetails", "error"], action.error)

    case ActionTypes.ORDER_SUBMIT_COMPLETE_FAILED:
    case ActionTypes.APPLE_PAY_ORDER_SUBMIT_COMPLETE_FAILED:
    case ActionTypes.ORDER_DELETE_LINE_ITEM_FAILED:
      return state.set("isLoading", false)
        .set("error", action.error)

    case ActionTypes.ORDER_SHIPPING_RATE_CHANGED_FAILED:
      return state.merge({
        error: action.error,
        shippingRate: action.shippingRate,
      })

    case ActionTypes.ORDER_NOT_FOUND:
      return initialState

    case ActionTypes.TOGGLE_REVIEW_SHIPPING_EDIT:
      return state.set("isEditingShippingOnReview", !state.get("isEditingShippingOnReview"))

    case ActionTypes.ORDER_SHIPPING_RATE_CHANGED_STARTED:
      return state.merge({
        isLoading: true,
        shippingRate: action.shippingRate,
      })

    default:
      return state
  }
}

export default orderReducer
