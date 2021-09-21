import ActionTypes from "highline/redux/action_types"
import { fetchNavigationItems } from "highline/api/navigation_item_api"
import {
  leftDrawerCloseAsync ,
  leftDrawerOpenClicked,
} from "highline/redux/actions/left_drawer_actions"

export const navigationLoaded = () => ({
  type: ActionTypes.NAVIGATION_LOADED,
})

export const navigationRequestStarted = () => ({
  type: ActionTypes.NAVIGATION_REQUEST_STARTED,
})

export const navigationRequestCompleted = () => ({
  type: ActionTypes.NAVIGATION_REQUEST_COMPLETED,
})

export const navigationFetchSucceeded = (items) => ({
  type: ActionTypes.NAVIGATION_FETCH_SUCCEEDED,
  items,
})

export const navigationFetchFailed = (error) => ({
  type: ActionTypes.NAVIGATION_FETCH_FAILED,
  error,
})

export const navigationOpened = () => ({
  type: ActionTypes.NAVIGATION_OPENED,
})

export const navigationClosed = () => ({
  type: ActionTypes.NAVIGATION_CLOSED,
})

export const navigationParentTileClicked = (itemLabel, itemPath) => ({
  type: ActionTypes.NAVIGATION_PARENT_TILE_CLICKED,
  itemLabel,
  itemPath,
  level: 1,
})

export const navigationSubNavTileClicked = (link, label) => ({
  type: ActionTypes.NAVIGATION_SUBNAV_TILE_CLICKED,
  label,
  level: 2,
  link,
})

export const navigationItemClicked = (link, itemLabel) => ({
  type: ActionTypes.NAVIGATION_ITEM_CLICKED,
  link,
  itemLabel,
})

export const navigationImageCtaClicked = (altText, link, imageUrl, metadata) => ({
  type: ActionTypes.NAVIGATION_IMAGE_CLICKED,
  altText,
  link,
  imageUrl,
  metadata,
})

export const navigationImageCtaTitleClicked = (link, imageTitle, metadata) => ({
  type: ActionTypes.NAVIGATION_IMAGE_TITLE_CLICKED,
  link,
  imageTitle,
  metadata,
})

export const navigationOpenedAsync = () => (
  async (dispatch) => {
    dispatch(leftDrawerOpenClicked("navigation"))
    dispatch(navigationOpened())
  }
)

export const navigationSubNavTileClickedAsync = (link, label) => (
  async (dispatch) => {
    dispatch(leftDrawerCloseAsync())
    dispatch(navigationSubNavTileClicked(link, label))
  }
)

export const navigationFetchAsync = () => (
  async (dispatch, getState) => {
    const navigation_items = getState().getIn(["navigation", "items"])
    if (navigation_items.size > 0) return

    dispatch(navigationRequestStarted())

    try {
      const response = await fetchNavigationItems()

      dispatch(navigationFetchSucceeded(response.data.get("items")))
    } catch (error) {
      dispatch(navigationFetchFailed(error.data))
    }

    dispatch(navigationRequestCompleted())
  }
)
