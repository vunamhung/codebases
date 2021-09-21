import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"
import { addPaymentError } from  "highline/utils/billing_information_helper"

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
    id: "",
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
  affirmError: "",
  authPaymentFails: 0, 
  cardNumber: "",
  error: {},
  isAffirmModalOpen: false,
  isDefault: true,
  isInWallet: true,
  isSameAsShippingAddress: true,
  month: "",
  name: "",
  paymentType: "creditCard",
  securityCode: "",
  securityCodeValidated: false,
  useExistingCreditCard: true,
  visaCheckoutEnabled: false,
  year: "",
})

const billingInformationReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.BILLING_INFORMATION_CHECKBOX_CHANGED:
    case ActionTypes.BILLING_INFORMATION_INPUT_CHANGED:
      return state.set(action.name, action.value)

    case ActionTypes.BILLING_INFORMATION_CREDIT_CARD_INPUT_CHANGED:
      return state.set(action.name, action.rawValue)

    case ActionTypes.BILLING_INFORMATION_EXPIRY_DATE_INPUT_CHANGED:
      return state.merge({ month: action.month, year: action.year })

    case ActionTypes.BILLING_INFORMATION_ADDRESS_INPUT_CHANGED:
      return state.setIn(["address", action.name], action.value)

    case ActionTypes.BILLING_INFORMATION_PAYMENT_TYPE_CHANGED:
      return state.set("paymentType", action.value)
        .set("affirmError", "")

    case ActionTypes.BILLING_EXISTING_CREDIT_CARD_TOGGLED:
      return state.set("useExistingCreditCard", !state.get("useExistingCreditCard"))

    case ActionTypes.WALLET_ADD_NEW_PAYMENT_CLICKED:
    case ActionTypes.BILLING_INFORMATION_STATE_RESET:
      return initialState

    case ActionTypes.BILLING_INFORMATION_COUNTRY_UPDATED: {
      const address = state.get("address")
      const newAddress =  address.merge({
        country: fromJS(action.country),
      })
        .setIn(["postalCode", "label"], action.postalCodeLabel)
        .setIn(["region", "label"], action.regionLabel)

      return state.merge({ address: newAddress })
    }

    case ActionTypes.BILLING_INFORMATION_RECAPTCHA_SUCCEEDED:
      return state.set("authPaymentFails", 0)

    case ActionTypes.BILLING_INFORMATION_REGION_UPDATED: {
      const region = state.getIn(["address", "region"])
      const newRegion = region.merge(action.region)

      return state.setIn(["address", "region"], newRegion)
    }

    case ActionTypes.BILLING_INFORMATION_ZIP_INPUT_CHANGED: {
      const postalCode = state.getIn(["address", "postalCode"])
      const newPostalCode = postalCode.merge({ code: action.value })

      return state.setIn(["address", "postalCode"], newPostalCode)
    }

    case ActionTypes.BILLING_INFORMATION_ADD_FAILED:
    case ActionTypes.WALLET_ADD_PAYMENT_FAILED:
      return state.set("error", addPaymentError(action.error))
        .set("authPaymentFails", state.get("authPaymentFails") + 1)

    case ActionTypes.BILLING_ADD_PAYPAL_FAILED:
      return state.set("error", fromJS({
        "errors": {
          "paypal": ["We're sorry, there was an error with your Paypal payment. Please check your payment information or use a different payment method"],
        },
      }))

    case ActionTypes.VISA_CHECKOUT_BUTTON_TOGGLED:
      return state.set("visaCheckoutEnabled", true)

    case ActionTypes.BILLING_INFORMATION_NAME_SET:
      return state.set("name", action.name)

    case ActionTypes.INLINE_VALIDATION_FAILED:
      return state.setIn(["error","errors","billAddress", action.name], fromJS([[action.errorMessage]]))

    case ActionTypes.INLINE_VALIDATION_SUCCESS:
      return state.setIn(["error","errors","billAddress", action.name], null)

    case ActionTypes.AFFIRM_CHECKOUT_MODAL_OPENED:
      return state.set("isAffirmModalOpen", true)
        .set("affirmError", "")

    case ActionTypes.AFFIRM_CHECKOUT_MODAL_CLOSED:
      return state.set("isAffirmModalOpen", false)

    case ActionTypes.AFFIRM_CHECKOUT_FAILED:
      return state.set("affirmError", action.errorMessage)

    case ActionTypes.SECURITY_CODE_VALIDATED:
      return state.set("securityCodeValidated", true)

    default:
      return state
  }
}

export default billingInformationReducer
