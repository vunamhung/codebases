import { decamelize } from "humps"
import { fromJS, List, Map } from "immutable"
import { extractQueryParams } from "highline/utils/url"
import Qs from "qs"
import * as FitPreferenceStorage from "highline/storage/fit_preference_storage"
import { checkImmutable, toDecamelizedJSON } from "highline/utils/immutable_helper"
import getConfig from "highline/config/application"

export const FILTER_TITLES = ["Size", "Fit", "Length", "Color", "Product", "More"]
const SIZE_FILTER_EXCEPTIONS = ["pant-waist", "short-waist", "underwear-waist", "shirt-neck", "shirt-sleeve"]
const { disableColorFilters } = getConfig()

// Add or remove given filter from selectedFilters
export const mergeFilters = (selectedFilters, filter) => {
  selectedFilters = checkImmutable(selectedFilters, Map)
  filter = checkImmutable(filter, Map)

  const filterType = filter.get("type")
  const filterValue = filter.get("value")

  if (!filterType || !filterValue)
    return selectedFilters

  const existingFilter = selectedFilters.get(filterType)

  // create new type => value filter
  if (!existingFilter)
    return selectedFilters.merge({ [filterType]: List([filterValue]) })

  // un-toggle filter already applied
  if (existingFilter.includes(filterValue)) {
    const remainingFilters = existingFilter.delete(existingFilter.indexOf(filterValue))

    return remainingFilters.isEmpty()
      ? selectedFilters.delete(filterType)
      : selectedFilters.set(filterType, remainingFilters)
  }

  // add new filter
  return selectedFilters.set(filterType, existingFilter.push(filterValue))
}

export const formatFilters = (filters) => {
  return toDecamelizedJSON((filters || Map()), "-")
}

export const formatFiltersFromQueryParams = (queryParams, whitelist) => {
  const params = fromJS(extractQueryParams(queryParams))
  const filteredParams = params.filter((value, key) => whitelist.contains(key))
  const filters = {}

  checkImmutable(filteredParams, Map).forEach((value, type) => {
    filters[type] = List.isList(value) ? value : List([value])
  })

  return fromJS(filters)
}

export const generateLink = (slug, color, selectedFilters, isGiftCard, isBundle) => {
  const filters = removeMultipleFiltersPerOptionType(selectedFilters).toJS()
  Object.keys(filters).forEach((filterOption) => {
    filters[filterOption] = filters[filterOption].toLowerCase()
  })

  const params = Object.assign({}, filters, { color })
  const query = Qs.stringify(params)
  const route = isBundle ? "bundles" : "products"

  return Map({
    as: `/${ route }/${ slug }?${ query }`,
    href: `/${ route }/[slug]?${ query }`,
  })
}

export const formatSelectedOptions = (color, selectedFilters) => {
  const filteredOptions = removeMultipleFiltersPerOptionType(selectedFilters)
  return filteredOptions.merge({ color })
}

// Filter out filters where multiple option values are selected (used to build the query parameters for the product link)
function removeMultipleFiltersPerOptionType(selectedFilters) {
  return selectedFilters
    .filter((values) => checkImmutable(values) && values.size === 1)
    .map((values) => values.first())
}

// Get the presentation values for appliedFilters from availableFilters
// return: List()
export const formatAppliedFilters = (appliedFilters, availableFilters) => {
  if (!appliedFilters || !availableFilters)
    return List()

  let filters = List()

  appliedFilters.forEach((selectedValues, selectedType) => {
    const filterType = availableFilters.find(
      (filter) => filter.get("name") === decamelize(selectedType, { separator: "-" }),
    )

    if (filterType) {
      const filterValues = filterType.get("values", List()).filter(
        (value) => selectedValues.includes(value.get("name")) && value.get("name") !== "no-value",
      )

      if (!filterValues.isEmpty()) {
        filters = filters.push(filterType.set("values", filterValues))
      }
    }
  })

  return filters
}

export const setInitialFilters = (state, includeQueryParams) => {
  const { isEnabled } = FitPreferenceStorage.load()
  let selectedFilters = Map()

  if (includeQueryParams) {
    // Fetch the list of available filters from SSR to filter our invalid query string params
    const whitelistedQueryParams = state.get("availableFilters").map((filter) => filter.get("name"))
    const queryParamFilters = formatFiltersFromQueryParams(window.location.search, whitelistedQueryParams)

    if (queryParamFilters && queryParamFilters.size > 0) {
      selectedFilters = queryParamFilters
    }
  }

  return state.merge({
    myFitEnabled: isEnabled,
    selectedFilters: formatFilters(selectedFilters),
  })
}

export const getCurrentAvailableFilters = (availableFilters, currentDropdown) => {
  const isFilterWithinMoreSection = currentDropdown === "More"
  const filters = availableFilters.filter((availableFilter) => {
    if (isFilterWithinMoreSection) {
      const filterIsNotColorSizeFitOrLength = !FILTER_TITLES.includes(availableFilter.get("shortPresentation"))
      const filterIsNotAnException = !SIZE_FILTER_EXCEPTIONS.includes(availableFilter.get("name"))
      return filterIsNotColorSizeFitOrLength && filterIsNotAnException
    } else {
      const filterShortPresentationMatches = availableFilter.get("shortPresentation") === currentDropdown
      const sizeFilterExceptionApplies = currentDropdown === "Size" && SIZE_FILTER_EXCEPTIONS.includes(availableFilter.get("name"))
      return filterShortPresentationMatches || sizeFilterExceptionApplies
    }
  })
  return filters.map((availableFilter) => {
    const removeNoValues = availableFilter.get("values").filter((value) => value.get("name") !== "no-value")
    return availableFilter.set("values", removeNoValues)
  })
}

export const getAvailableFilterDropdowns = (availableFilters) => {
  return FILTER_TITLES.reduce((filterDropdowns, filterTitle) => {
    if (filterTitle == "Color" && disableColorFilters) { return filterDropdowns }
    const filters = getCurrentAvailableFilters(availableFilters, filterTitle)
    const hasAnyAvailableFilters = !filters.isEmpty()
    const areAllFilterOptionsEliminated = filters.every((filterType) =>
      filterType.get("values").every((filterValue) => filterValue.get("eliminated")),
    )
    if (hasAnyAvailableFilters) {
      return filterDropdowns.push(fromJS({
        filterTitle,
        areAllFilterOptionsEliminated,
      }))
    }
    return filterDropdowns
  }, List())
}