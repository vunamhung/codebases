import { fromJS, List, Map } from "immutable"
import ActionTypes from "highline/redux/action_types"
import { toggleOrderDetails, toggleOrderReturn } from "highline/redux/helpers/order_detail_helper"

const initialState = fromJS({
  currentPage: "account",
  detailsToggleState: Map(),
  loggedIn: false,
  orderHistories: List(),
  orderHistoriesCurrentPage: 0,
  orderHistoriesTotalPages: 1,
  pageLoaded: false,
  reportLinkUrl: null,
  returnToggleState: Map(),
  storeCredits: List(),
  storeCreditsCurrentPage: 0,
  storeCreditsTotalPages: 1,
})

const accountReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.PAGE_LOADED:
      state = action.pageCategory === "Account"
        ? state.set("pageLoaded", true)
        : state.set("pageLoaded", false)
      return state
    case ActionTypes.ACCOUNT_LOGGED_IN:
      return state.set("loggedIn", true)
    case ActionTypes.ACCOUNT_NAV_ITEM_CLICKED:
      return state.set("currentPage", action.navItem)
    case ActionTypes.ACCOUNT_ORDER_HISTORY_FETCH_SUCCEEDED:
      return state.merge({
        orderHistories: state.get("orderHistories").concat(action.data.get("result")),
        orderHistoriesCurrentPage: action.data.get("page"),
        orderHistoriesTotalPages: action.data.get("totalPages"),
      })
    case ActionTypes.ACCOUNT_REPORT_LINK_FETCH_SUCCEEDED:
      return state.set("reportLinkUrl", action.reportLinks)
    case ActionTypes.ACCOUNT_STORE_CREDIT_FETCH_SUCCEEDED:
      return state.merge({
        storeCredits: state.get("storeCredits").concat(action.data.get("result")),
        storeCreditsCurrentPage: action.data.get("page"),
        storeCreditsTotalPages: action.data.get("totalPages"),
      })
    case ActionTypes.ACCOUNT_ORDER_DETAIL_TOGGLED:
      return toggleOrderDetails(state, action.shipmentNumber)
    case ActionTypes.ACCOUNT_ORDER_RETURN_TOGGLED:
      return toggleOrderReturn(state, action.shipmentNumber)
    case ActionTypes.ACCOUNT_REDEEM_GIFT_CERTIFICATE_SUCCEEDED:
      return state.merge({
        "giftCertificateCode": "",
        "redeemGiftCertificateError": Map(),
        "redeemGiftCertificate": true,
      })
    case ActionTypes.ACCOUNT_REDEEM_GIFT_CERTIFICATE_FAILED:
      return state.set("redeemGiftCertificateError", action.error)
    case ActionTypes.ACCOUNT_GIFT_CERTIFICATE_INPUT_CHANGED:
      return state.set("giftCertificateCode", action.giftCertificateCode)
    default:
      return state
  }
}

export default accountReducer
