import ActionTypes from "highline/redux/action_types"
import { fetchNavigation } from "highline/api/navigation_api"
import { fromJS } from "immutable"
import Rollbar from "highline/utils/rollbar"

export const categoryNavigationV2ItemClicked = (item) => ({
  type: ActionTypes.CATEGORY_NAVIGATION_V2_ITEM_CLICKED,
  item,
})

export const categoryNavigationV2ItemCollapsed = (item) => ({
  type: ActionTypes.CATEGORY_NAVIGATION_V2_ITEM_COLLAPSED,
  item,
})

export const categoryNavigationV2ItemExpanded = (item) => ({
  type: ActionTypes.CATEGORY_NAVIGATION_V2_ITEM_EXPANDED,
  item,
})

export const categoryNavigationV2RequestStarted = () => ({
  type: ActionTypes.CATEGORY_NAVIGATION_V2_REQUEST_STARTED,
})

export const categoryNavigationV2FetchSucceeded = (categories, path) => ({
  type: ActionTypes.CATEGORY_NAVIGATION_V2_FETCH_SUCCEEDED,
  categories,
  path,
})

export const categoryNavigationV2FetchFailed = (error) => ({
  type: ActionTypes.CATEGORY_NAVIGATION_V2_FETCH_FAILED,
  error,
})

export const categoryNavigationV2FetchAsync = (path) => (
  async (dispatch, getState) => {
    const categoryNavItems = getState().getIn(["categoryNavigationV2", "categoryNavItems"])
    if (categoryNavItems.size > 0) return

    dispatch(categoryNavigationV2RequestStarted())

    try {
      const response = await fetchNavigation()
      const categories = response.data.get("categories")
      dispatch(categoryNavigationV2FetchSucceeded(categories, path))
    } catch (error) {
      Rollbar.error("categoryNavigationV2FetchFailed", error)
      dispatch(categoryNavigationV2FetchFailed(error))
    }
  }
)
