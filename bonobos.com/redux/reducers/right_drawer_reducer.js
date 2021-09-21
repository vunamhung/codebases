import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  cmsContent: null,
  contents: "",
  isOpen: false,
  swappableContents: null,
})

const rightDrawerReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.CLIENT_ROUTE_CHANGE_STARTED:
    case ActionTypes.RIGHT_DRAWER_CLOSE_FINISHED:
      return state.merge({
        cmsContent: null,
        contents: "",
        isOpen: false,
      })

    case ActionTypes.RIGHT_DRAWER_CLOSE_STARTED:
    case ActionTypes.CART_ADD_LINE_ITEMS_FAILED:
      return state.set("isOpen", false)

    case ActionTypes.RIGHT_DRAWER_CONTENTS_CHANGED:
      return state.merge({ contents: action.contents, swappableContents: action.swappableContents })

    case ActionTypes.RIGHT_DRAWER_OPEN_CLICKED:
      return state.set("isOpen", true)

    case ActionTypes.PRODUCT_PREVIEW_CLICKED:
    case ActionTypes.CONTENTFUL_PRODUCT_PREVIEW_CLICKED:
    case ActionTypes.SEARCH_PRODUCT_PREVIEW_CLICKED:
    case ActionTypes.SUGGESTED_ITEM_PRODUCT_PREVIEW_CLICKED:
      return state.merge({
        contents: "quickShop",
        isOpen: true,
        swappableContents: action.swappableContents,
      })

    case ActionTypes.CART_UNAUTHORIZED_CHECKOUT_STARTED:
      return state.merge({ contents: "auth", swappableContents: "cart" })

    case ActionTypes.CART_OPEN_CLICKED:
    case ActionTypes.ORDER_EXIT_USERLESS_CHECKOUT_SUCCEEDED:
    case ActionTypes.EXIT_CHECKOUT_FLOW_SUCCEEDED:
      return state.merge({ contents: "cart", isOpen: true, swappableContents: null })

    case ActionTypes.CART_ADD_LINE_ITEMS_STARTED:
      return state.merge({ contents: "cart", isOpen: state.get("isOpen") || !action.isTablet, swappableContents: null })

    case ActionTypes.CONTENTFUL_FLYOUT_OPEN_CLICKED:
      return state.merge({ cmsContent: action.content, contents: "contentful", isOpen: true })

    case ActionTypes.SAVED_ITEMS_UNAUTHENTICATED_ADD_CLICKED:
      return state.merge({
        contents: "auth",
        isOpen: true,
        swappableContents: null,
      })

    default:
      return state
  }
}

export default rightDrawerReducer
