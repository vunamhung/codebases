import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  isAccountDropdownOpen: false,
  isDesktopNavOpen: false,
  isHeaderTransparent: false,
  isMinified: false,
})

const headerReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.HEADER_ACCOUNT_MOUSE_ENTERED:
    case ActionTypes.HEADER_ACCOUNT_CLICKED:
      return state.set("isAccountDropdownOpen", true)

    case ActionTypes.HEADER_ACCOUNT_MOUSE_LEFT:
      return state.set("isAccountDropdownOpen", false)

    case ActionTypes.HEADER_NAVIGATION_ITEM_CLICKED:
    case ActionTypes.HEADER_NAVIGATION_ITEM_MOUSE_ENTERED:
      return state.set("isDesktopNavOpen", true)

    case ActionTypes.CLIENT_ROUTE_CHANGED:
    case ActionTypes.HEADER_NAVIGATION_MOUSE_LEFT:
      return state.set("isDesktopNavOpen", false)

    case ActionTypes.PAGE_LOADED:
      return state.merge({ isAccountDropdownOpen: false, isDesktopNavOpen: false })

    case ActionTypes.HEADER_HAS_MINIFIED:
      return state.set("isMinified", true)

    case ActionTypes.HEADER_NO_LONGER_MINIFIED:
      return state.set("isMinified", false)

    case ActionTypes.SET_HEADER_TRANSPARENCY:
      return state.set("isHeaderTransparent", action.enableTransparentHeader)

    default:
      return state
  }
}

export default headerReducer
