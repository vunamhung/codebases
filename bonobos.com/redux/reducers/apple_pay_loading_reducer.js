import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  show: false,
})

const applePayLoadingReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.PAGE_LOADED:
      return state.set("show", false)

    case ActionTypes.APPLE_PAY_ORDER_SUBMIT_COMPLETE_SUCCEEDED:
      return state.set("show", true)

    default:
      return state
  }
}

export default applePayLoadingReducer
