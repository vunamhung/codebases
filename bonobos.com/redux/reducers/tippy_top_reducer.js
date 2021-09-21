import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  content: {},
  height: 0,
  isOpen: true,
  showDetails: false,
})

const tippyTopReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.TIPPY_TOP_LOADED:
      return state.merge({
        content: action.data.get("content"),
        showDetails: action.data.get("showDetails"),
        layout: action.data.get("layout"),
      })

    case ActionTypes.TIPPY_TOP_DETAILS_TOGGLED:
      return state.set("showDetails", !state.get("showDetails"))

    case ActionTypes.TIPPY_TOP_DISMISSED:
      return state.set("isOpen", false)

    case ActionTypes.TIPPY_TOP_HEIGHT_CHANGED:
      return state.set("height", action.height)

    default:
      return state
  }
}

export default tippyTopReducer
