import { decamelize } from "humps"
import { fromJS, List, Map } from "immutable"
import { extractQueryParams } from "highline/utils/url"
import { checkImmutable, toDecamelizedJSON } from "highline/utils/immutable_helper"
import { getClientSideLink } from "highline/utils/link"
import Qs from "qs"
import { getField } from "highline/utils/contentful/contentful_helper"
import { getPromo } from "highline/redux/helpers/product_detail_helper"

// Offset header & cat nav for scrolling to category group
export const categoryGroupOffset = 140

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

export const formatFiltersFromQueryParams = (queryParams) => {
  const params = fromJS(extractQueryParams(queryParams))

  const filters = {}

  checkImmutable(params, Map).forEach((value, type) => {
    filters[type] = List.isList(value) ? value : List([value])
  })

  return fromJS(filters)
}

export const removeMultipleFiltersPerOptionType = (selectedFilters) =>{
  return selectedFilters
    .filter((values) => checkImmutable(values))
    .filter((values) => values.size === 1)
    .map((values) => values.first())
}

export const generatePDPLink = (slug, color, isBundle, isGiftCard, selectedFilters) => {
  const filters = removeMultipleFiltersPerOptionType(selectedFilters).toJS()

  const defaultParam = isGiftCard ? { theme: color } : { color }
  const params = Object.assign({}, filters, defaultParam)
  const query = Qs.stringify(params)
  const itemType = isBundle ? "/bundles" : "/products"
  const pageType = isGiftCard ? "/gift-card" : itemType

  return fromJS({
    as: `${ itemType }/${ slug }?${ query }`,
    href: `${ pageType }?slug=${ slug }&${ query }`,
  })
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
        (value) => selectedValues.includes(value.get("name")),
      )

      if (!filterValues.isEmpty()) {
        filters = filters.push(filterType.set("values", filterValues))
      }
    }
  })

  assertFilters(appliedFilters, filters)

  return filters
}

export const generateSubcategoryAnchor = (name, category) => {
  const formattedCategory = (category || "")
    .replace(/ /g, "-")
    .replace(/,/g, "")
    .replace(/&/g, "and")
    .toLowerCase()

  return `id-${ name }_${ formattedCategory }`
}

// TODO: temporary assertion for checking that applied filters are visible
// this can be removed after some time in production
function assertFilters(appliedFilters, formattedFilters) {
  try {
    const appliedCount = appliedFilters.reduce(
      (sum, values) => sum + values.size,
      0,
    )

    const formattedCount = formattedFilters.reduce(
      (sum, filter) => sum + filter.get("values", List()).size,
      0,
    )

    if (appliedCount !== formattedCount) {
      setTimeout(() => {
        throw {
          name: "Applied Filter Mismatch",
          data: {
            appliedFilters: appliedFilters.toJS(),
            formattedFilters: formattedFilters.toJS(),
          },
        }
      })
    }
  } catch (e) {
    setTimeout(() => { throw e })
  }
}

export const formatBreadcrumbs = (breadcrumbs) => {
  return breadcrumbs.map((crumb) => {
    const path = `/shop/${crumb.get("slug")}`
    const breadcrumbData = getClientSideLink(path)

    return breadcrumbData.set("name", crumb.get("name"))
  })
}

export const getPrimaryImageUrl = (item) => {
  return item.get("imageUrl")
}

export const getSecondaryImageUrl = (item) => {
  const primaryImageUrl = getPrimaryImageUrl(item)
  const itemImages = item.get("images", List())
  const hoverImage = itemImages.find((image) => (image.get("url") !== primaryImageUrl))

  return hoverImage ?
    hoverImage.get("url") :
    primaryImageUrl
}

export const getPromoDiscount = (contentfulData) => {
  const autoAppliedPromo = getPromo(contentfulData)
  return getField(autoAppliedPromo, "discount")
}
