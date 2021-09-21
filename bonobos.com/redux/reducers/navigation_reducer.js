import { List, fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"
import { getSubNavItems, shouldNavItemCollapse } from "highline/redux/helpers/navigation_helper"

const initialState = fromJS({
  activeNav: "",
  currentLink: {
    as: "/",
    href: "/",
  },
  isLoading: false,
  isOpen: false,
  items: [],
  mobileNavBreadcrumbs: [],
  mobileNavVisibleItems: [],
  placement: "",
  shouldCollapse: false,
  subNavItems: [],
  view: "root",
})

const navigationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.NAVIGATION_FETCH_SUCCEEDED:
      return state.merge({
        items: action.items,
        subNavItems: action.items.getIn([0, "children"]),
      })

    case ActionTypes.NAVIGATION_OPENED:
      return state.merge({
        isOpen: true,
      })


    case ActionTypes.NAVIGATION_CLOSED:
      return state.merge({
        isOpen: false,
      })

    case ActionTypes.NAVIGATION_PARENT_TILE_CLICKED: {
      // When navigating, pull from "items" if a level 1 category, or "subNavItems" if a level 2 category
      const mobileNavBreadcrumbs = state.get("mobileNavBreadcrumbs")
      const navLevel = mobileNavBreadcrumbs.size
      const navToFetch = navLevel === 0 ? "items" : "subNavItems"
      return state.merge({
        activeNav: action.itemLabel,
        activePath: action.itemPath,
        mobileNavBreadcrumbs: state.get("mobileNavBreadcrumbs").push(action.itemLabel),
        mobileNavVisibleItems: getSubNavItems(state.get(navToFetch), action.itemLabel),
        placement: "mobile",
        shouldCollapse: shouldNavItemCollapse(state.get("items"), action.itemLabel),
        subNavItems: navLevel === 0
          ? getSubNavItems(state.get("items"), action.itemLabel)
          : state.get("subNavItems"),
        view: "subNav",
      })}

    case ActionTypes.HEADER_NAVIGATION_ITEM_CLICKED:
    case ActionTypes.HEADER_NAVIGATION_ITEM_MOUSE_ENTERED: {
      const subNavItems = getSubNavItems(state.get("items"), action.itemLabel)
      const shouldCollapse = shouldNavItemCollapse(state.get("items"), action.itemLabel)
      return state.merge({
        placement: "desktop",
        subNavItems,
        activeNav: action.itemLabel,
        shouldCollapse,
      })
    }

    case ActionTypes.LEFT_DRAWER_OPEN_CLICKED:
      return state.set("placement", "mobile")

    case ActionTypes.LEFT_DRAWER_CLOSE_FINISHED:
      return state.merge({
        activeNav: "",
        isOpen: false,
        mobileNavBreadcrumbs: [],
        mobileNavVisibleItems: [],
        shouldCollapse: false,
        subNavItems: List(),
        view: "root",
      })

    case ActionTypes.LEFT_DRAWER_LEFT_CTA_CLICKED: {
      // When going back, clear the last breadcrumb and fetch the visble nav items from "items" in the store
      const mobileNavBreadcrumbs = state.get("mobileNavBreadcrumbs").pop()
      const activeNav = mobileNavBreadcrumbs.get(0)

      return state.merge({
        activeNav,
        isOpen: true,
        mobileNavBreadcrumbs,
        mobileNavVisibleItems: getSubNavItems(state.get("items"), activeNav),
        shouldCollapse: false,
        view: mobileNavBreadcrumbs.size === 0 ? "root" : "subNav",
      })}

    case ActionTypes.NAVIGATION_SUBNAV_TILE_CLICKED:
      return state.merge({
        isLoading: true,
        isOpen: false,
      })

    case ActionTypes.CLIENT_ROUTE_CHANGED:
      return state.merge({
        isLoading: false,
        activeNav: "",
      })

    case ActionTypes.PAGE_LOADED:
    case ActionTypes.HEADER_NAVIGATION_MOUSE_LEFT:
      return state.set("activeNav", "")

    default:
      return state
  }
}

export default navigationReducer
