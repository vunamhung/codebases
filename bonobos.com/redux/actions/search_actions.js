import ActionTypes from "highline/redux/action_types"
import Router from "next/router"
import { Map } from "immutable"
import * as SearchApi from "highline/api/search_api"
import * as ConstructorApi from "highline/api/constructor_api"
import { filtersCleared } from "highline/redux/actions/filters_actions"
import { fitPreferencesUserSelectionsFetchAsync } from "highline/redux/actions/fit_preferences_actions"
import getConfig from "highline/config/application"
import { massageConstructorCategoryResponse, buildFiltersForConstructor } from "highline/utils/product_mapper_helper"
import { mapSearchResponse } from "highline/utils/flatiron_to_constructor_mapper_helper"
import { getPromoDiscount } from "highline/redux/helpers/category_helper.js"

const { isConstructorSearchDisabled } = getConfig()

export const searchFetchStarted = () => ({
  type: ActionTypes.SEARCH_FETCH_STARTED,
})

export const searchFetchSucceeded = (data) => ({
  type: ActionTypes.SEARCH_FETCH_SUCCEEDED,
  data,
})

export const searchFetchFailed = (error) => ({
  type: ActionTypes.SEARCH_FETCH_FAILED,
  error,
})

export const mobileSearchBarFocusComplete = () => ({
  type: ActionTypes.MOBILE_SEARCH_BAR_FOCUS_COMPLETE,
})

export const mobileMenuOpenedFromSearch = () => ({
  type: ActionTypes.MOBILE_SEARCH_BAR_OPENED_FROM_HEADER,
})

export const searchInputChanged = (name, value) => ({
  type: ActionTypes.SEARCH_INPUT_CHANGED,
  name,
  value,
})

export const searchFocused = () => ({
  type: ActionTypes.SEARCH_FOCUSED,
})

export const searchSubmitted = (term) => ({
  type: ActionTypes.SEARCH_SUBMITTED,
  term,
})

export const searchProductPreviewClicked = (slug, selectedOptions) => ({
  type: ActionTypes.SEARCH_PRODUCT_PREVIEW_CLICKED,
  slug,
  selectedOptions,
})

export const searchProductLinkClicked = (slug, color) => ({
  type: ActionTypes.SEARCH_PRODUCT_LINK_CLICKED,
  slug,
  color,
})

export const searchAutosuggestClicked = (target, suggestion) => ({
  type: ActionTypes.SEARCH_AUTOSUGGEST_CLICKED,
  suggestion,
  target,
})

export const searchRedirectTriggered = (term) => ({
  term,
  type: ActionTypes.SEARCH_REDIRECT_TRIGGERED,
})

export const searchProductVariantActivated = (itemKey, index) => ({
  type: ActionTypes.SEARCH_PRODUCT_VARIANT_ACTIVATED,
  itemKey,
  index,
  location: "search",
})

export const searchProductVariantDeactivated = (itemKey) => ({
  type: ActionTypes.SEARCH_PRODUCT_VARIANT_DEACTIVATED,
  itemKey,
  location: "search",
})

export const searchProductVariantSelected = (itemKey, index) => ({
  type: ActionTypes.SEARCH_PRODUCT_VARIANT_SELECTED,
  itemKey,
  index,
  location: "search",
})

export const handleSearchSubmitAsync = (term) => (
  async (dispatch, getState) => {
    if (term) {
      !getState().getIn(["filters", "myFitEnabled"]) && dispatch(filtersCleared())
      dispatch(searchSubmitted(term))
      await Router.push(`/search?term=${ term }`)
      window.scrollTo(0, 0)
    }
  }
)

export const mobileSearchInputChanged = (name, value) => (
  async (dispatch) => {
    dispatch(searchInputChanged(name, value))
  }
)

export const searchFetchSearchSourceAsync = () => (
  async (dispatch, getState) => {
    let searchSource = getState().getIn(["search", "searchSource"])
    if (!searchSource) {
      searchSource = isConstructorSearchDisabled || "constructor-on"
      return dispatch(searchSetSource(searchSource))
    }
    return
  }
)

export const searchFetchAsync = () => (
  async (dispatch, getState) => {
    dispatch(searchFetchStarted())
    const myFitEnabled = getState().getIn(["filters", "myFitEnabled"])
    const authToken = getState().getIn(["auth", "authenticationToken"])
    const searchTerm = getState().getIn(["search", "searchTerm"])
    let selectedFilters = myFitEnabled ? Map() : getState().getIn(["filters", "selectedFilters"])
    let searchSource = getState().getIn(["search", "searchSource"])

    const contentfulData = getState().getIn(["contentful", "globals"])
    const promoDiscount = getPromoDiscount(contentfulData)

    try {
      // A/B test to hit Constructor or Flatiron
      if (!searchSource) {
        searchSource = isConstructorSearchDisabled || "constructor-on"
        dispatch(searchSetSource(searchSource))
      }
      const isConstructorDisabled = searchSource !== "constructor-on"
      if (myFitEnabled) {
        await dispatch(fitPreferencesUserSelectionsFetchAsync())
        selectedFilters = getState().getIn(["fitPreferences", "myFitFilters"])
      }

      let response

      if (!isConstructorDisabled) {
        const currentSortOption = getState().getIn(["sort", "currentSortOption", "name"])
        const sortOrder = getState().getIn(["sort", "currentSortOption", "sortOrder"])
        response = await ConstructorApi.fetchSearchResult(
          searchTerm,
          {
            filters: buildFiltersForConstructor(selectedFilters),
            sortBy: currentSortOption,
            sortOrder,
          },
        )
        response = massageConstructorCategoryResponse(response, selectedFilters, { promoDiscount })
      } else {
        const flatironResponse = await SearchApi.fetch(searchTerm, selectedFilters, myFitEnabled, authToken)

        const mappedResponse = mapSearchResponse(flatironResponse.data)
        const massagedResponse = massageConstructorCategoryResponse(mappedResponse, selectedFilters, { promoDiscount })
        response = flatironResponse.data.merge({
          items: massagedResponse.get("items"),
          itemsDetails: massagedResponse.get("itemsDetails"),
          numResults: massagedResponse.get("numResults"),
          pageSize: massagedResponse.get("pageSize"),
        })
      }

      if (response.get("redirect")) {
        await Router.push(response.get("redirect"))
        return dispatch(searchRedirectTriggered(searchTerm))
      }
      return dispatch(searchFetchSucceeded(response))
    } catch (error) {
      if (searchSource === "constructor-on") {
        // fallback to fetch from flatiron if constructor fetch/processing failed
        searchFetchFailed(error)
        dispatch(searchSetSource("constructor-off"))
        return dispatch(searchFetchAsync())
      }
      return dispatch(searchFetchFailed(error.data.get("errors")))
    }
  }
)

export const searchSetSource = (source) => ({
  source,
  type: ActionTypes.SEARCH_SET_SOURCE,
})
