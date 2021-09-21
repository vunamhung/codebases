import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"
import { camelizeOptionNames } from "highline/redux/helpers/product_detail_helper"
import {
  formatInventoryUnits,
  isExchangeValid,
  renameKeysForReturnReasonDropdown,
  updateReasonCode,
} from "highline/redux/helpers/exchange_helper"

const initialState = fromJS({
  inventoryUnits: [],
  isExchangeEnabled: false,
  isPerformingSubmissionAPIRequest: false,
  orderDetails: {},
  reasonCodes: [],
  returnAuthorizationCompleted: false,
  returnAuthorizationError: null,
})

const exchangeReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.PAGE_LOADED: {
      state = action.pageCategory === "Exchange"
        ? state.set("pageLoaded", true)
        : state.set("pageLoaded", false)
      return state.set("returnAuthorizationCompleted", false)
    }

    case ActionTypes.EXCHANGE_ORDER_DETAILS_FETCH_SUCCEEDED:
      return state.set("orderDetails", action.data)

    case ActionTypes.EXCHANGE_INVENTORY_UNITS_FETCH_SUCCEEDED: {
      const formattedInventoryUnits = formatInventoryUnits(action.data)
      return state.set("inventoryUnits", formattedInventoryUnits)
    }

    case ActionTypes.EXCHANGE_INVENTORY_UNIT_OPTIONS_FETCH_SUCCEEDED: {
      // Get inventory unit to update
      const unitIndex = state.get("inventoryUnits").findIndex((unit) => unit.get("id") === action.data.getIn(["inventoryUnit", "id"]))
      let inventoryUnits = state.get("inventoryUnits")
      let newInventoryUnit = state.getIn(["inventoryUnits", unitIndex])

      // Delete reasonCode and exchangeInitiated if the exchange was cancelled
      if (!action.isFromSelectedOption) {
        newInventoryUnit = newInventoryUnit.delete("reasonCodeId").delete("exchangeInitiated")
      }

      // Determine new remaining options
      const remainingOptions = newInventoryUnit
        .get("exchangeOptions")
        .filter((optionType) => !action.data.hasIn(["inventoryUnit", "selectedOptions", optionType.get("name")]))

      const camelizedExchangeOptions = camelizeOptionNames(action.data.getIn(["inventoryUnit", "exchangeOptions"]))

      newInventoryUnit = newInventoryUnit.merge({
        exchangeOptions: camelizedExchangeOptions,
        exchangeVariant: action.data.getIn(["inventoryUnit", "exchangeVariant"]),
        remainingOptions,
        selectedOptions: action.data.getIn(["inventoryUnit", "selectedOptions"]),
      })

      inventoryUnits = inventoryUnits.set(unitIndex, newInventoryUnit)

      return state.merge({
        inventoryUnits,
        isExchangeEnabled: isExchangeValid(inventoryUnits),
      })
    }

    case ActionTypes.EXCHANGE_REASON_CODES_FETCH_SUCCEEDED:
      return state.set("reasonCodes", renameKeysForReturnReasonDropdown(action.data))

    case ActionTypes.EXCHANGE_REASON_CODE_SELECTED: {
      const updatedInventoryUnits = updateReasonCode(action.inventoryUnitId, action.reasonCodeId, state.get("inventoryUnits"))

      return state.merge({
        inventoryUnits: updatedInventoryUnits,
        isExchangeEnabled: isExchangeValid(updatedInventoryUnits),
      })
    }

    case ActionTypes.EXCHANGE_START_CLICKED: {
      let inventoryUnits = state.get("inventoryUnits")
      const unitIndex = inventoryUnits.findIndex((unit) => unit.get("id") === action.inventoryUnitId)
      inventoryUnits = inventoryUnits.setIn([unitIndex, "exchangeInitiated"], true)

      return state.merge({
        inventoryUnits,
        isExchangeEnabled: isExchangeValid(inventoryUnits),
      })
    }

    case ActionTypes.EXCHANGE_SUBMIT_RETURN_AUTHORIZATION_STARTED:
      return state.set("isPerformingSubmissionAPIRequest", true)

    case ActionTypes.EXCHANGE_SUBMIT_RETURN_AUTHORIZATION_SUCCEEDED:
      return state.merge({
        isPerformingSubmissionAPIRequest: false,
        returnAuthorizationCompleted: true,
        returnAuthorizationError: null,
      })

    case ActionTypes.EXCHANGE_SUBMIT_RETURN_AUTHORIZATION_FAILED:
      return state.merge({
        isPerformingSubmissionAPIRequest: false,
        returnAuthorizationCompleted: false,
        returnAuthorizationError: action.error,
      })

    default:
      return state
  }
}

export default exchangeReducer
