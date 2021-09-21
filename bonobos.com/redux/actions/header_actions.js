import ActionTypes from "highline/redux/action_types"

export const headerAccountMouseEntered = () => ({
  type: ActionTypes.HEADER_ACCOUNT_MOUSE_ENTERED,
})

export const headerAccountClicked = () => ({
  type: ActionTypes.HEADER_ACCOUNT_CLICKED,
})

export const headerAccountMouseLeft = () => ({
  type: ActionTypes.HEADER_ACCOUNT_MOUSE_LEFT,
})

export const headerNavigationItemClicked = (itemLabel, itemPath) => ({
  type: ActionTypes.HEADER_NAVIGATION_ITEM_CLICKED,
  itemLabel,
  itemPath,
})

export const headerNavigationItemMouseEntered = (itemLabel) => ({
  type: ActionTypes.HEADER_NAVIGATION_ITEM_MOUSE_ENTERED,
  itemLabel,
})

export const headerNavigationMouseLeft = () => ({
  type: ActionTypes.HEADER_NAVIGATION_MOUSE_LEFT,
})

export const headerNavigationStaticLinkClicked = (link, level, linkName, placement) => ({
  type: ActionTypes.HEADER_NAVIGATION_STATIC_LINK_CLICKED,
  link,
  level,
  linkName,
  placement,
})

const headerNoLongerMinified = () => ({
  type: ActionTypes.HEADER_NO_LONGER_MINIFIED,
})
const headerHasMinified = () => ({
  type: ActionTypes.HEADER_HAS_MINIFIED,
})

export const headerMinificationChanged = (isMinified) => (
  (dispatch) => {
    dispatch((isMinified ? headerHasMinified : headerNoLongerMinified)())
  }
)

export const setHeaderTransparency = (enableTransparentHeader) => ({
  type: ActionTypes.SET_HEADER_TRANSPARENCY,
  enableTransparentHeader,
})
