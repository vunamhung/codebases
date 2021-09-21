import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  notifications: [],
})

const cartNotificationsReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.CART_NOTIFICATIONS_LOADED_EMPTY:
      return state.merge(initialState)
    case ActionTypes.CART_NOTIFICATIONS_LOADED:
      return state.set("notifications", action.notifications)

    default:
      return state
  }
}

export default cartNotificationsReducer
