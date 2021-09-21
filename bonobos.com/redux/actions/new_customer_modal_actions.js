import { fromJS, Map } from "immutable"
import * as Cookies from "highline/utils/cookies"
import ActionTypes from "highline/redux/action_types"
import { StaticContentMap, getStaticContentByFirstField } from "highline/utils/contentful/static_content_helper"
import { getField } from "highline/utils/contentful/contentful_helper"

const LEGACY_COOKIE_START_VALUE = "show"
const DEFAULT_TARGET_VISITS = 2
const NEW_CUSTOMER_MODAL_COOKIE_KEY = "optimizely_NewCustomerPopupModal"

export const dismiss = () => ({
  type: ActionTypes.NEW_CUSTOMER_MODAL_DISMISSED,
})

export const loadAsync = () => (
  async (dispatch, getState) => {
    const contentfulData = getState().getIn(["contentful", "globals"])
    const contentfulNewCustomerModalData = getStaticContentByFirstField(contentfulData, StaticContentMap.New_Customer_Modal_Data) || Map()

    const NCM_DEFAULT_FIELDS = fromJS({
      description: "+ Free Shipping & Returns",
      emailList: "signup_popup_15%_GETSTARTED15",
      finePrint: "Offer valid for new customers only. One use per customer. Not valid on final sale items. Cannot be combined with any other offers or promotions. Offer is non-transferable and cannot be applied to the purchase of gift cards. Terms of offer are subject to change. Void where prohibited by law. To redeem online, [create a user account](https://bonobos.com/sign-in) and enter promo code at checkout.",
      placeholder: "Your email address",
      successMessage: "<p>Use Code</p><h1>GETSTARTED15</h1>",
      title: "Enjoy 15% Off Your First Order",
    })
    const newCustomerModalData = contentfulNewCustomerModalData.get("fields") || NCM_DEFAULT_FIELDS
    dispatch(loaded(newCustomerModalData))
  }
)

export const triggerNewCustomerModalByPageVisitAsync = () => (
  async (dispatch, getState) => {
    const contentfulData = getState().getIn(["contentful", "globals"])
    const contentfulNewCustomerModalData = getStaticContentByFirstField(contentfulData, StaticContentMap.New_Customer_Modal_Data)
    
    const ncmCookie = Cookies.get(NEW_CUSTOMER_MODAL_COOKIE_KEY)
    const currentVisitCount = (typeof ncmCookie === "object") ? ncmCookie.get("visits", 0)+1 : 1
    const targetVisitCount = getField(contentfulNewCustomerModalData, "targetVisitCount") || DEFAULT_TARGET_VISITS
    
    // legacy cookie values should follow the new process
    if (typeof ncmCookie === "string") {
      const legacyValueReplacement = (ncmCookie === LEGACY_COOKIE_START_VALUE) ? 1 : targetVisitCount
      Cookies.set(NEW_CUSTOMER_MODAL_COOKIE_KEY, { visits: legacyValueReplacement })

    // save our visit count in the cookie for future checks
    } else if (currentVisitCount <= targetVisitCount) {
      Cookies.set(NEW_CUSTOMER_MODAL_COOKIE_KEY, { visits: currentVisitCount })
    }

    // show the modal if we hit our target count
    if (currentVisitCount === targetVisitCount) {
      dispatch(loadAsync())
    }
  }
)


export const invalidateModalAsync = () => (
  async (dispatch) => {
    Cookies.set(NEW_CUSTOMER_MODAL_COOKIE_KEY, { visits: Number.MAX_SAFE_INTEGER })
    return dispatch(invalidated())
  }
)

const invalidated = () => ({
  type: ActionTypes.NEW_CUSTOMER_MODAL_INVALIDATED,
})

const loaded = (data) => ({
  type: ActionTypes.NEW_CUSTOMER_MODAL_LOADED,
  data,
})
