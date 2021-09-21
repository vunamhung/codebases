import * as FitPreferencesApi from "highline/api/fit_preferences_api"
import Rollbar, { formatHttpError } from "highline/utils/rollbar"
import { getOptionValueName } from "highline/utils/fit_preferences/helper"
import ActionTypes from "highline/redux/action_types"
import { List } from "immutable"

export const fitPreferencesCtaClicked = () => ({
  type: ActionTypes.FIT_PREFERENCES_CTA_CLICKED,
})

export const fitPreferencesOptionTypesFetchFailed = (error) => ({
  error,
  type: ActionTypes.FIT_PREFERENCES_OPTION_TYPES_FETCH_FAILED,
})

export const fitPreferencesOptionTypesFetchStarted = () => ({
  type: ActionTypes.FIT_PREFERENCES_OPTION_TYPES_FETCH_STARTED,
})

export const fitPreferencesOptionTypesFetchSucceeded = (data) => ({
  data,
  type: ActionTypes.FIT_PREFERENCES_OPTION_TYPES_FETCH_SUCCEEDED,
})

export const fitPreferencesUserSelectionsFetchFailed = (error) => ({
  error,
  type: ActionTypes.FIT_PREFERENCES_USER_SELECTIONS_FETCH_FAILED,
})

export const fitPreferencesUserSelectionsFetchStarted = () => ({
  type: ActionTypes.FIT_PREFERENCES_USER_SELECTIONS_FETCH_STARTED,
})

export const fitPreferencesUserSelectionsFetchSucceeded = (data) => ({
  data,
  type: ActionTypes.FIT_PREFERENCES_USER_SELECTIONS_FETCH_SUCCEEDED,
})

export const fitPreferencesUserSelectionsUpdateFailed = (error) => ({
  error,
  type: ActionTypes.FIT_PREFERENCES_USER_SELECTIONS_UPDATE_FAILED,
})

export const fitPreferencesUserSelectionsUpdateStarted = () => ({
  type: ActionTypes.FIT_PREFERENCES_USER_SELECTIONS_UPDATE_STARTED,
})

export const fitPreferencesUserSelectionsUpdateSucceeded = (data) => ({
  data,
  type: ActionTypes.FIT_PREFERENCES_USER_SELECTIONS_UPDATE_SUCCEEDED,
})

export const fitPreferencesOptionToggled = (data) => ({
  data,
  type: ActionTypes.FIT_PREFERENCES_OPTION_TOGGLED,
})

export const fitPreferencesOptionClicked = (optionTypeName, optionValueId) => (
  async (dispatch, getState) => {
    try {
      const optionValueName = getOptionValueName(getState, optionTypeName, optionValueId)
      const userSelections = getState().getIn(["fitPreferences", "userSelections"])
      const isSelected = userSelections.find((id) => id === optionValueId)
      const newSelections = isSelected ?
        userSelections.filter((id) => id !== optionValueId) :
        userSelections.push(optionValueId)

      dispatch(fitPreferencesOptionToggled({ optionTypeName, optionValueId, optionValueName }))
      return dispatch(fitPreferencesUserSelectionsUpdateAsync(newSelections))
    } catch (error) {
      setTimeout(() => { throw error })
    }
  }
)

export const fitPreferencesOptionTypesFetchAsync = () => (
  async (dispatch, getState) => {
    dispatch(fitPreferencesOptionTypesFetchStarted())

    const authToken = getState().getIn(["auth", "authenticationToken"])

    try {
      const response = await FitPreferencesApi.fetchOptionTypes(authToken)
      let data
      if (List.isList(response.data)) {
        Rollbar.debug("fitPreferencesOptionTypesFetchAsync with response.data as List")
        data = response.data
      } else {
        Rollbar.debug("fitPreferencesOptionTypesFetchAsync with response.data as Map")
        data = response.data.get("optionTypes")
      }
      return dispatch(fitPreferencesOptionTypesFetchSucceeded(data))
    } catch (error) {
      dispatch(fitPreferencesOptionTypesFetchFailed(error.data))
    }
  }
)

export const fitPreferencesUserSelectionsFetchAsync = () => (
  async (dispatch, getState) => {
    const authToken = getState().getIn(["auth", "authenticationToken"])
    const userId = getState().getIn(["auth", "userId"])
    const isMyFitFiltersLoaded = getState().getIn(["fitPreferences", "isMyFitFiltersLoaded"])

    // Only fetch MyFit if the user is logged in and the filters were not already loaded
    if (authToken && userId && !isMyFitFiltersLoaded) {
      dispatch(fitPreferencesUserSelectionsFetchStarted())

      try {
        const response = await FitPreferencesApi.fetchUserSelections(authToken, userId)
        const data = response.data.get("fitPreferenceItems")

        return dispatch(fitPreferencesUserSelectionsFetchSucceeded(data))
      } catch (error) {
        dispatch(fitPreferencesUserSelectionsFetchFailed(error.data))
      }
    }
  }
)

export const fitPreferencesUserSelectionsUpdateAsync = (optionValueIds) => (
  async (dispatch, getState) => {
    dispatch(fitPreferencesUserSelectionsUpdateStarted())

    const authToken = getState().getIn(["auth", "authenticationToken"])
    const userId = getState().getIn(["auth", "userId"])
    try {
      const response = await FitPreferencesApi.updateUserSelections(authToken, userId, optionValueIds)
      const data = response.data.get("fitPreferenceItems")

      return dispatch(fitPreferencesUserSelectionsUpdateSucceeded(data))
    } catch (error) {
      dispatch(fitPreferencesUserSelectionsUpdateFailed(error.data))
      Rollbar.error("fitPreferencesUserSelectionsUpdateAsync: ", formatHttpError(error))
    }
  }
)
