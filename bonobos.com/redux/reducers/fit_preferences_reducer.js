import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"
import { buildOptionTypeMap, buildMyFitFilters } from "highline/utils/fit_preferences/helper"

const initialState = fromJS({
  isMyFitFiltersLoaded: false,
  myFitFilters: {},
  optionTypes: {},
  optionTypesLoading: true,
  userSelections: [],
  userSelectionsLoading: true,
})

const fitPreferencesReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.FIT_PREFERENCES_OPTION_TYPES_FETCH_FAILED:
      return state.set("optionTypesLoading", false)

    case ActionTypes.FIT_PREFERENCES_USER_SELECTIONS_FETCH_FAILED:
      return state.set("userSelectionsLoading", false)

    case ActionTypes.FIT_PREFERENCES_OPTION_TYPES_FETCH_STARTED:
      return state.set("optionTypesLoading", true)

    case ActionTypes.FIT_PREFERENCES_USER_SELECTIONS_FETCH_STARTED:
      return state.set("userSelectionsLoading", true)

    case ActionTypes.FIT_PREFERENCES_OPTION_TYPES_FETCH_SUCCEEDED:
      return state.merge({
        optionTypes: buildOptionTypeMap(action.data),
        optionTypesLoading: false,
      })

    case ActionTypes.FIT_PREFERENCES_USER_SELECTIONS_FETCH_SUCCEEDED:
    case ActionTypes.FIT_PREFERENCES_USER_SELECTIONS_UPDATE_SUCCEEDED: {
      const userSelections = action.data.map((selection) => selection.get("optionValueId"))
      return state.merge({
        isMyFitFiltersLoaded: true,
        myFitFilters: buildMyFitFilters(action.data),
        userSelections,
        userSelectionsLoading: false,
      })
    }
    default:
      return state
  }
}

export default fitPreferencesReducer
