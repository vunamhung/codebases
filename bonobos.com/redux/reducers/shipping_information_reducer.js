import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"
import * as UserStorage from "highline/storage/user_storage"
import { isFeatureEnabled } from "highline/utils/abtasty_helper"

const initialState = fromJS({
  address1: "",
  address2: "",
  city: "",
  country: {
    code: "US",
    name: "United States",
    statesRequired: true,
  },
  default: true,
  error: {},
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
  showLoqate: false,
})

const shippingInformationReducer = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.SHIPPING_INFORMATION_COUNTRY_UPDATED: {
      const newState = state.merge({
        country: fromJS(action.country),
        statesRequired: fromJS(action.statesRequired),
      })
        .setIn(["postalCode", "label"], action.postalCodeLabel)
        .setIn(["region", "label"], action.regionLabel)

      return newState
    }

    case ActionTypes.SHIPPING_INFORMATION_REGION_UPDATED: {
      const currentRegion = state.get("region")
      const newRegion = currentRegion.merge(
        action.region,
      )

      return state.set("region", newRegion)
    }

    case ActionTypes.SHIPPING_INFORMATION_ZIP_INPUT_CHANGED: {
      const currentPostalCode = state.get("postalCode")
      const newPostalCode = currentPostalCode.merge({
        code: action.value,
      })

      return state.set("postalCode", newPostalCode)
    }

    case ActionTypes.SHIPPING_INFORMATION_INPUT_CHANGED:
      return state.set(action.name, action.value)

    case ActionTypes.ADDRESS_BOOK_EDIT_CLICKED:
      return state.merge(action.address)

    case ActionTypes.ADDRESS_BOOK_ACTION_DIALOG_NEW_CLICKED:
      return initialState.merge({ showLoqate: state.get("showLoqate") })

    case ActionTypes.ADDRESS_BOOK_UPDATE_FAILED:
    case ActionTypes.SHIPPING_INFORMATION_ADD_FAILED:
      return state.set("error", action.error)

    case ActionTypes.SHIPPING_INFORMATION_LOADED: {
      if (action.address) {
        return state.merge(action.address)
      } else {
        const { firstName, lastName } = UserStorage.load()
        return state.merge({
          firstName,
          lastName,
        })
      }
    }

    case ActionTypes.LOQATE_PREPOPULATE_RECEIVED: {
      const { Line1, Line2, City, PostalCode } = action.address
      return state.merge({
        address1: Line1,
        address2: Line2,
        city: City,
        postalCode: {
          code: PostalCode,
          label: "Zip",
        },
      })
    }

    case ActionTypes.INLINE_VALIDATION_FAILED:
      return state.setIn(["error","errors","address", action.name], fromJS([[action.errorMessage]]))

    case ActionTypes.INLINE_VALIDATION_SUCCESS: {
      return state.setIn(["error","errors","address", action.name], null)
    }

    case ActionTypes.COUNTRIES_REQUEST_COMPLETED: {
      return state.set("showLoqate", isFeatureEnabled("loqateShipping"))
    }

    default:
      return state
  }
}

export default shippingInformationReducer
