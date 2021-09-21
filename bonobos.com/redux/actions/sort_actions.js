import ActionTypes from "highline/redux/action_types"
import { categoryFetchAsync } from "highline/redux/actions/category_actions"
import { searchFetchAsync } from "highline/redux/actions/search_actions"

export const sortDropdownValueClicked = (sortOption) => ({
  type: ActionTypes.SORT_DROPDOWN_VALUE_CLICKED,
  sortOption,
})

export const sortMouseEntered = () => ({
  type: ActionTypes.SORT_MOUSE_ENTERED,
})

export const sortMouseLeft = () => ({
  type: ActionTypes.SORT_MOUSE_LEFT,
})

export const sortDropdownClicked = () => ({
  type: ActionTypes.SORT_DROPDOWN_CLICKED,
})

export const sortOptionClickedAsync = (sortOption) => (
  (dispatch, getState) => {
    dispatch(sortDropdownValueClicked(sortOption))
    dispatchFetchAsync(dispatch, getState)
  }
)

async function dispatchFetchAsync(dispatch, getState) {
  const currentPage = getState().getIn(["filters", "currentPage"])

  if (currentPage === "Category") {
    return dispatch(categoryFetchAsync())
  } else if (currentPage === "Search") {
    return dispatch(searchFetchAsync())
  }
}
