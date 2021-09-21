import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  showToast: false,
  toasts: [],
})

const toastReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.TOAST_ADDED:
      return state.merge({
        showToast: true,
        toasts: state.get("toasts").push(action.toast).toJS(),
      })

    case ActionTypes.TOAST_DISMISSED:
      return state.merge({
        showToast: false,
        toasts: state.get("toasts").shift().toJS(),
      })

    case ActionTypes.TOAST_DISPLAYED:
      return state.merge({
        showToast: true,
      })

    default:
      return state
  }
}

export default toastReducer
