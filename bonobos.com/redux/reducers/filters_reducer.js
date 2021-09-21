import { List, Map, fromJS } from "immutable"
import {
  formatAppliedFilters,
  formatFilters,
  setInitialFilters,
  getCurrentAvailableFilters,
  getAvailableFilterDropdowns,
} from "highline/redux/helpers/filters_helper"
import ActionTypes from "highline/redux/action_types"
import { buildOptionTypeAndValueMap } from "highline/utils/fit_preferences/helper"

// There are three types of data for representing filters
//
//   selectedFilters (from storage):
//      Any filter a user selects is saved in localStorage
//      and re-used across pages. This is also sent with
//      each request to the api, and returned as provided_filters
//
//   availableFilters (from api):
//      The list of all possible filters for the current category or search results
//
//   appliedFilters (from api):
//      Selected filters for the current category or search results
//      (intersection of provided & available filters)

const initialState = fromJS({
  appliedFilters: List(),
  availableFilters: List(),
  availableFilterDropdowns: List(),
  currentAvailableFilters: List(),
  currentFilterDropdown: "",
  currentPage: "",
  filtersOpen: false,
  modalVisible: false,
  myFitEnabled: false,
  optionTypes: {}, // Different format than fitPreferences optionTypes
  selectedFilters: Map(),
})

const filtersReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.PAGE_LOADED:
    case ActionTypes.CLIENT_ROUTE_CHANGED:
      if (action.pageCategory === "Search") {
        return setInitialFilters(state, false).set("currentPage", action.pageCategory)
      } else if (action.pageCategory === "Category") {
        return setInitialFilters(state, true).set("currentPage", action.pageCategory)
      }
      return state

    case ActionTypes.FILTERS_OPENED: {
      return state.merge({
        filtersOpen: true,
        currentFilterDropdown: action.filterName,
        currentAvailableFilters: getCurrentAvailableFilters(state.get("availableFilters"), action.filterName),
      })
    }

    case ActionTypes.FILTERS_CLOSED:
      return state.merge({
        filtersOpen: false,
        modalVisible: false,
        currentFilterDropdown: "",
      })

    case ActionTypes.FILTERS_CLEARED:
      return state.merge({
        myFitEnabled: false,
        selectedFilters: Map(),
      })

    case ActionTypes.FILTERS_OPTION_VALUE_CLICKED:
      if (state.get("myFitEnabled")) {
        return state.merge({
          myFitEnabled: false,
          selectedFilters: Map(),
        })
      } else {
        return state
      }

    case ActionTypes.FILTERS_UPDATED:
      return state.set("selectedFilters", action.filters)

    case ActionTypes.MY_FIT_TOGGLED: {
      return state.merge({
        myFitEnabled: !state.get("myFitEnabled"),
        selectedFilters: Map(),
      })
    }

    case ActionTypes.FIT_PREFERENCES_CTA_CLICKED:
      return state.set("myFitEnabled", true)

    case ActionTypes.FILTER_MODAL_VISIBILITY_TOGGLED:
      return state.set("modalVisible", !state.get("modalVisible"))

    case ActionTypes.CATEGORY_CHANGED:
      return state.get("myFitEnabled")
        ? state
        : state.set("selectedFilters", Map())

    case ActionTypes.CATEGORY_LOADED:
      return action.hasQueryParams
        ? setInitialFilters(state, true)
        : state.set("selectedFilters", Map())

    case ActionTypes.CATEGORY_FETCH_SUCCEEDED:
    case ActionTypes.CATEGORY_PLP_FETCH_SUCCEEDED:
    case ActionTypes.SEARCH_FETCH_SUCCEEDED: {
      const myFitEnabled = state.get("myFitEnabled")
      const availableFiltersFromAction = action.data.get("availableFilters")
      return state.merge({
        appliedFilters: formatAppliedFilters(
          action.data.get("appliedFilters"),
          availableFiltersFromAction,
        ),
        availableFilters: availableFiltersFromAction,
        availableFilterDropdowns: getAvailableFilterDropdowns(availableFiltersFromAction),
        currentAvailableFilters: getCurrentAvailableFilters(availableFiltersFromAction, state.get("currentFilterDropdown")),
        selectedFilters: formatFilters(
          action.data.get("providedFilters"),
        ),
        filtersOpen: myFitEnabled ? false : state.get("filtersOpen"),
        currentFilterDropdown: myFitEnabled? initialState.get("currentFilterDropdown") : state.get("currentFilterDropdown"),
      })
    }

    case ActionTypes.FIT_PREFERENCES_OPTION_TYPES_FETCH_SUCCEEDED: {
      return state.merge({
        optionTypes: buildOptionTypeAndValueMap(action.data),
      })
    }

    default:
      return state
  }
}

export default filtersReducer
