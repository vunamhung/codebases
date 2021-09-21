import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"
import { extractQueryParams, getBasePath } from "highline/utils/url"
import { getDocumentHeight, getScrollTop } from "highline/utils/viewport"
import { isServer } from "highline/utils/client"

const initialState = fromJS({
  isFeaturedShop: false,
  origin: "",
  path: "",
  query: {},
  referrer: "",
  referrerQuery: {},
  scrollPositionHistory: {},
  url: "",
})

const currentPageReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.CURRENT_PAGE_CHANGED:
      return state.merge({
        isFeaturedShop: false,
        path: action.path,
        query: action.query || fromJS({}),
      })

    case ActionTypes.PAGE_LOADED: {
      // Initial page load only check (no url already) - state updates after that are covered by CLIENT_ROUTE_CHANGED
      // & safety check for client (this action should only fire client side)
      if (state.get("url") || isServer) return state

      return state.merge({
        origin: window.location.origin,
        path: window.location.pathname,
        query: fromJS(extractQueryParams(window.location.search)),
        url: window.location.href,
      })
    }

    case ActionTypes.CLIENT_ROUTE_CHANGE_STARTED: {
      const positions = fromJS({
        documentHeight: getDocumentHeight(),
        scrollPosition: getScrollTop(),
      })

      return state.setIn(["scrollPositionHistory", getBasePath(state.get("path"))], positions)
    }

    case ActionTypes.CLIENT_ROUTE_CHANGED: {
      const referrerQuery = state.get("query")
      return state.merge({
        isFeaturedShop: false,
        origin: window.location.origin,
        path: window.location.pathname,
        query: fromJS(extractQueryParams(window.location.search)),
        referrer: `${state.get("origin")}${state.get("path")}`,
        referrerQuery,
        url: window.location.href,
      })
    }
    // If a user uses the mobile nav (instead of the back button) to visit a category
    // they already visited, we shouldn't try and restore their scroll depth.
    case ActionTypes.NAVIGATION_SUBNAV_TILE_CLICKED: {
      const path = getBasePath(action.link.get("as"))

      return state.setIn(["scrollPositionHistory", path], null)
    }

    case ActionTypes.CURRENT_PAGE_INIT: {
      return state.merge({
        isFeaturedShop: false,
        path: action.path,
        query: action.query,
      })
    }

    default:
      return state
  }
}

export default currentPageReducer
