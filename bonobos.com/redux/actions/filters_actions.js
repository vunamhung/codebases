import ActionTypes from "highline/redux/action_types"
import { searchFetchAsync } from "highline/redux/actions/search_actions"
import { categoryFetchAsync } from "highline/redux/actions/category_actions"
import { mergeFilters } from "highline/redux/helpers/filters_helper.js"
import { List } from "immutable"
import { fitPreferencesUserSelectionsUpdateAsync } from "highline/redux/actions/fit_preferences_actions"
import { signIn } from "highline/utils/navigate"
import Rollbar from "highline/utils/rollbar"
import { buildFilterUrl } from "highline/utils/url"
import { getOptionValueIdsFromAppliedFilters } from "highline/utils/fit_preferences/helper"

export const filtersCleared = () => ({
  type: ActionTypes.FILTERS_CLEARED,
})

export const filtersClosed = () => ({
  type: ActionTypes.FILTERS_CLOSED,
})

export const filtersOpened = (filterName) => ({
  type: ActionTypes.FILTERS_OPENED,
  filterName,
})

export const filtersOptionValueClicked = (optionValue, filterAdded) => ({
  type: ActionTypes.FILTERS_OPTION_VALUE_CLICKED,
  filterAdded,
  optionValue,
})

export const filtersUpdated = (filters) => ({
  type: ActionTypes.FILTERS_UPDATED,
  filters,
})

export const myFitToggled = () => ({
  type: ActionTypes.MY_FIT_TOGGLED,
})

export const toggleModalVisibility = () => ({
  type: ActionTypes.FILTER_MODAL_VISIBILITY_TOGGLED,
})

export const trackMyFitToggled = (filters) => ({
  type: ActionTypes.TRACK_MY_FIT_TOGGLED,
  filters,
})

export const editMyFitClicked = () => ({
  type: ActionTypes.EDIT_MY_FIT_CLICKED,
})

export const saveToMyFitClicked = () => ({
  type: ActionTypes.SAVE_TO_MY_FIT_CLICKED,
})

export const saveToMyFitClickedAsync = () => (
  async (dispatch, getState) => {
    dispatch(saveToMyFitClicked())

    const state = getState()
    const isLoggedIn = state.getIn(["auth", "isLoggedIn"])

    if (!isLoggedIn) {
      const currentPagePath = state.getIn(["currentPage", "path"])
      // Should be currentPage query - but that isn't update with filter selection
      const currentFilters = state.getIn(["filters", "selectedFilters"])

      return signIn({ redirect_to: buildFilterUrl(currentPagePath, currentFilters) })
    } else {
      // Current Fit Preference IDs
      const currentUserOptionValueIds = state.getIn(["fitPreferences", "userSelections"])

      // New Fit Preference IDs
      const appliedFilters = state.getIn(["filters", "appliedFilters"])
      const optionTypes = state.getIn(["filters", "optionTypes"])
      if (optionTypes.isEmpty()) {
        Rollbar.error("saveToMyFitClickedAsync aborted with empty optionTypes")
        return
      }
      const newUserOptionValueIds = getOptionValueIdsFromAppliedFilters(appliedFilters, optionTypes)

      // Combined and Unique
      const allUniqUserOptionValueIds = [...new Set(currentUserOptionValueIds.concat(newUserOptionValueIds))]

      await dispatch(fitPreferencesUserSelectionsUpdateAsync(allUniqUserOptionValueIds))
      await dispatch(toggleMyFitAsync())
    }
  }
)

export const clearFiltersAsync = () => (
  async (dispatch, getState) => {
    dispatch(filtersCleared())
    dispatchFetchAsync(dispatch, getState)
  }
)

export const filterDropdownClicked = (filterName) => (
  (dispatch, getState) => {
    const currentFilterDropdown =
      getState().getIn(["filters", "currentFilterDropdown"])

    if (currentFilterDropdown === filterName) {
      dispatch(filtersClosed())
    } else {
      dispatch(filtersOpened(filterName))
    }
  }
)

export const filterClickedAsync = (filter) => (
  (dispatch, getState) => {
    const filters = mergeFilters(
      getState().getIn(["filters", "selectedFilters"]),
      filter,
    )

    const filterType = filter.get("type")
    const filterValue = filter.get("value")
    const filterAdded = !!filters
      .get(filterType, List())
      .includes(filterValue)

    dispatch(filtersOptionValueClicked(filter, filterAdded))
    dispatch(filtersUpdated(filters))
    dispatchFetchAsync(dispatch, getState)
  }
)

export const toggleMyFitAsync = () => (
  async (dispatch, getState) => {
    dispatch(myFitToggled())

    try {
      const response = await dispatchFetchAsync(dispatch, getState)
      const appliedFilters = response.data.get("appliedFilters")

      // Separate action from myFitToggled so applied filters returned from API call can be passed in analytics event
      dispatch(trackMyFitToggled(appliedFilters))
    } catch (e) {
      console.log(e)
    }
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
