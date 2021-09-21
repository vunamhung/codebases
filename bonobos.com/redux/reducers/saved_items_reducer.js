import { fromJS, List, Map } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  currentPage: 0,
  externalId: "",
  firstName: "",
  items: List(),
  isLoading: true,
  requestedLocation: "",
  requestedItem: Map(),
  totalItems: 0,
  totalPages: 0,
})

const savedItemsReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.SAVED_ITEMS_FETCH_SUCCEEDED:
    case ActionTypes.SAVED_ITEMS_ADD_PRODUCT_SUCCEEDED:
    case ActionTypes.SAVED_ITEMS_REMOVE_PRODUCT_SUCCEEDED:
      return state.merge({
        currentPage: action.data.get("currentPage"),
        externalId: action.data.get("externalId"),
        firstName: action.data.get("firstName"),
        items: action.data.get("items"),
        totalItems: action.data.get("totalItems"),
        totalPages: action.data.get("totalPages"),
      })

    case ActionTypes.SAVED_ITEMS_UNAUTHENTICATED_ADD_CLICKED:
      return state.merge({
        requestedLocation: action.requestedLocation,
        requestedItem: action.requestedItem,
      })

    case ActionTypes.RIGHT_DRAWER_CLOSE_FINISHED:
      return state.merge({
        requestedLocation: "",
        requestedItem: Map(),
      })

    case ActionTypes.SAVED_ITEMS_FETCH_STARTED:
    case ActionTypes.SAVED_ITEMS_ADD_PRODUCT_STARTED:
    case ActionTypes.SAVED_ITEMS_REMOVE_PRODUCT_STARTED:
      return state.set("isLoading", true)

    case ActionTypes.SAVED_ITEMS_FETCH_COMPLETED:
    case ActionTypes.SAVED_ITEMS_FETCH_FAILED:
    case ActionTypes.SAVED_ITEMS_ADD_PRODUCT_COMPLETED:
    case ActionTypes.SAVED_ITEMS_ADD_PRODUCT_FAILED:
    case ActionTypes.SAVED_ITEMS_REMOVE_PRODUCT_COMPLETED:
    case ActionTypes.SAVED_ITEMS_REMOVE_PRODUCT_FAILED:
      return state.set("isLoading", false)

    default:
      return state
  }
}

export default savedItemsReducer
