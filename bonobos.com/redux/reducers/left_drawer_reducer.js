import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  contents: "navigation",
  isLeftCtaVisible: false,
  isOpen: false,
})

const leftDrawerReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.LEFT_DRAWER_CLOSE_STARTED:
      return initialState

    case ActionTypes.LEFT_DRAWER_OPEN_CLICKED:
      return state.merge({
        "contents": action.contents,
        "isOpen": true,
      })

    case ActionTypes.LEFT_DRAWER_LEFT_CTA_CLICKED:
      return state.set("isLeftCtaVisible", false)

    case ActionTypes.NAVIGATION_PARENT_TILE_CLICKED:
      return state.set("isLeftCtaVisible", true)

    default:
      return state
  }
}

export default leftDrawerReducer
