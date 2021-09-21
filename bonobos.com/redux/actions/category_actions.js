import { Map, List } from "immutable"
import * as CategoryApi from "highline/api/category_api"
import * as ConstructorApi from "highline/api/constructor_api"
import ActionTypes from "highline/redux/action_types"
import { fitPreferencesUserSelectionsFetchAsync } from "highline/redux/actions/fit_preferences_actions"
import getConfig from "highline/config/application"
import {
  convertPrice,
  massageConstructorCategoryResponse,
  buildFiltersForConstructor,
} from "highline/utils/product_mapper_helper"
import { mapCategoryResponse } from "highline/utils/flatiron_to_constructor_mapper_helper"
import { getPromoDiscount } from "highline/redux/helpers/category_helper.js"
import { getDiscountedPrice } from "highline/redux/helpers/product_detail_helper"
import { shouldExcludeProgram } from "highline/utils/promo_auto_apply_helper"

const { isConstructorPlpDisabled } = getConfig()

export const categoryBackToTopClicked = () => ({
  type: ActionTypes.CATEGORY_BACK_TO_TOP_CLICKED,
})

export const categoryFetchFailed = (error) => ({
  type: ActionTypes.CATEGORY_FETCH_FAILED,
  error,
})

export const categoryFetchStarted = (slug) => ({
  type: ActionTypes.CATEGORY_FETCH_STARTED,
  slug,
})

export const categoryFetchSucceeded = (data) => ({
  type: ActionTypes.CATEGORY_FETCH_SUCCEEDED,
  data,
})

export const categoryImageHovered = () => ({
  type: ActionTypes.CATEGORY_IMAGE_HOVERED,
})

export const categoryNavItemClick = (name, anchor) => ({
  type: ActionTypes.CATEGORY_NAV_ITEM_CLICK,
  name,
  anchor,
})

export const navPillItemClicked = (name, path) => ({
  type: ActionTypes.NAV_PILL_ITEM_CLICKED,
  name,
  path,
})

export const categoryLocationChanged = (res, redirectSlug) => ({
  type: ActionTypes.CATEGORY_LOCATION_CHANGED,
  res,
  redirectSlug,
})

export const emptyCategoryFetched = (res) => ({
  type: ActionTypes.EMPTY_CATEGORY_FETCHED,
  res,
})

export const productPreviewClicked = (slug, selectedOptions) => ({
  type: ActionTypes.PRODUCT_PREVIEW_CLICKED,
  slug,
  selectedOptions,
})

export const categoryProductVariantActivated = (itemKey, index) => ({
  type: ActionTypes.CATEGORY_PRODUCT_VARIANT_ACTIVATED,
  itemKey,
  index,
  location: "category",
})

export const categoryProductVariantDeactivated = (itemKey) => ({
  type: ActionTypes.CATEGORY_PRODUCT_VARIANT_DEACTIVATED,
  itemKey,
  location: "category",
})

export const categoryProductVariantSelected = (itemKey, index) => ({
  type: ActionTypes.CATEGORY_PRODUCT_VARIANT_SELECTED,
  itemKey,
  index,
  location: "category",
})

export const categoryPromoTileClicked = (title, position, slug) => ({
  type: ActionTypes.CATEGORY_PROMO_TILE_CLICKED,
  title,
  position,
  slug,
})

export const categoryBreadcrumbClicked = (path) => ({
  type: ActionTypes.CATEGORY_BREADCRUMB_CLICKED,
  path,
})

export const narrativeClicked = () => ({
  type: ActionTypes.NARRATIVE_CLICKED,
})

export const categoryPLPFetchSucceeded = (data) => ({
  type: ActionTypes.CATEGORY_PLP_FETCH_SUCCEEDED,
  data,
})

export const categoryConstructorFetchMoreStarted = () => ({
  type: ActionTypes.CATEGORY_CONSTRUCTOR_FETCH_MORE_STARTED,
})

export const categoryConstructorFetchMoreSucceeded = (data) => ({
  type: ActionTypes.CATEGORY_CONSTRUCTOR_FETCH_MORE_SUCCEEDED,
  data,
})

export const categoryConstructorFetchMoreFailed = (err) => ({
  type: ActionTypes.CATEGORY_CONSTRUCTOR_FETCH_MORE_FAILED,
  err,
})

export const categoryChanged = () => ({
  type: ActionTypes.CATEGORY_CHANGED,
})

export const categoryLoaded = (hasQueryParams) => ({
  type: ActionTypes.CATEGORY_LOADED,
  hasQueryParams,
})

export const categoryContructorFetchBlocked = () => ({
  type: ActionTypes.CATEGORY_CONSTRUCTOR_FETCH_BLOCKED,
})

const productTileClicked = (product) => ({
  product,
  type: ActionTypes.PRODUCT_TILE_CLICKED,
})

export const onProductTileClicked = (slug) => (
  async (dispatch, getState) => {
    const productDetails = getState().getIn(["category", "itemsDetails", slug])
    const productDetailsData = productDetails.get("data").toJS()
    const {
      isBundle,
      isNewColor,
      isNewProgram,
      colorName,
      finalSale,
    } = productDetailsData
    const name = productDetails.get("value")
    const product = {
      color: colorName,
      isBundle,
      isFinalSale: finalSale,
      isNewColor,
      isNewProgram,
      name,
    }
    dispatch(productTileClicked(product))
  }
)

export const categoryConstructorFetchMoreAsync = () => (
  async (dispatch, getState) => {
    dispatch(categoryConstructorFetchMoreStarted())
    const id = getState().getIn(["category", "categoryId"])
    const page = getState().getIn(["category", "pageNumber"]) + 1
    const myFitEnabled = getState().getIn(["filters", "myFitEnabled"])
    let selectedFilters = getState().getIn(["filters", "selectedFilters"])
    const sortBy = getState().getIn(["sort", "currentSortOption", "name"])
    const sortOrder = getState().getIn(["sort", "currentSortOption", "sortOrder"])
    const path = getState().getIn(["category", "path"])
    const displayOnlyMarkdownSwatches = path && path.includes("/sale")
    const promoDiscount = getPromoDiscount(getState().getIn(["contentful", "globals"]))

    if (myFitEnabled) {
      getState().getIn(["fitPreferences", "myFitFilters"]).isEmpty() &&
      await dispatch(fitPreferencesUserSelectionsFetchAsync())
      selectedFilters = getState().getIn(["fitPreferences", "myFitFilters"])
    }

    try {
      const constructorResponse = await ConstructorApi.fetchCategory(id, {
        filters: buildFiltersForConstructor(selectedFilters),
        sortBy,
        sortOrder,
        page,
      })
      const response = massageConstructorCategoryResponse(constructorResponse, selectedFilters, { displayOnlyMarkdownSwatches, promoDiscount })
      const currentItems = getState().getIn(["category", "items"])
      const currentItemsDetails = getState().getIn(["category", "itemsDetails"])
      const items = currentItems.concat(response.get("items"))
      const itemsDetails = currentItemsDetails.merge(response.get("itemsDetails"))
      dispatch(categoryConstructorFetchMoreSucceeded(response.merge({
        items,
        itemsDetails,
        hasNextPage: items.size < response.get("numResults"),
      })))
    } catch (err) {
      dispatch(categoryConstructorFetchMoreFailed(err))
    }
  }
)

// make api call for category items
export const categoryFetchAsync = (category, res, isServer) => (
  async (dispatch, getState) => {
    let authToken = getState().getIn(["auth", "authenticationToken"])
    let myFitEnabled = getState().getIn(["filters", "myFitEnabled"])
    const isConstructorBlocked = getState().getIn(["category", "isConstructorBlocked"])
    let slug = getState().getIn(["category", "slug"])
    let pageNumber = getState().getIn(["category", "pageNumber"])
    const path = getState().getIn(["category", "path"]) || slug
    const displayOnlyMarkdownSwatches = path && path.includes("/sale")
    const isSameCategoryBeingRequested = slug === category

    if (category && !isSameCategoryBeingRequested) {
      slug = category
      dispatch(categoryChanged())
      pageNumber = 1
    }

    let selectedFilters = getState().getIn(["filters", "selectedFilters"])

    // We need to fetch all items for server-side requests for SEO
    if (isServer) {
      authToken = null
      myFitEnabled = false
      selectedFilters = Map()
    }

    dispatch(categoryFetchStarted(slug))

    const isFeaturedShop = slug.startsWith("featured-shops/")
    const version = isFeaturedShop ? "2.0" : "2.1"
    const useConstructor = !isFeaturedShop && !isConstructorPlpDisabled && !isConstructorBlocked
    const currentSortOption = version === "2.1" ? getState().getIn(["sort", "currentSortOption", "name"]) : null

    try {
      if (myFitEnabled) {
        await dispatch(fitPreferencesUserSelectionsFetchAsync())
        selectedFilters = getState().getIn(["fitPreferences", "myFitFilters"])
      }

      const promoDiscount = getPromoDiscount(getState().getIn(["contentful", "globals"]))

      let response
      if (useConstructor) {
        const categoryMetaData = await CategoryApi.fetchMetaData(slug)
        const categoryId = categoryMetaData.data.get("categoryId")
        const sortOrder = getState().getIn(["sort", "currentSortOption", "sortOrder"])
        const constructorResponse = await ConstructorApi.fetchCategory(
          categoryId,
          {
            filters: buildFiltersForConstructor(selectedFilters),
            sortBy: currentSortOption || "relevance",
            sortOrder: sortOrder || "descending",
          },
          pageNumber,
        )

        response = {
          data: massageConstructorCategoryResponse(constructorResponse, selectedFilters, { displayOnlyMarkdownSwatches, promoDiscount })
            .merge(categoryMetaData.data)
            .merge({ categoryId, initialPageNumber: pageNumber }),
        }
      } else {
        response = await CategoryApi.fetch(
          authToken,
          currentSortOption,
          myFitEnabled,
          selectedFilters,
          slug,
          version,
        )
        const responseSlug = response.data.get("slug")

        if (slug !== responseSlug) { // redirect to new location
          pageNumber = 1
          return dispatch(categoryLocationChanged(res, responseSlug))
        }

        if (!isFeaturedShop) {
          const convertedResponse = mapCategoryResponse(response.data)
          const massagedResponse = massageConstructorCategoryResponse(convertedResponse, selectedFilters, { displayOnlyMarkdownSwatches, promoDiscount })
          response = {
            data: response.data.merge({
              items: massagedResponse.get("items"),
              itemsDetails: massagedResponse.get("itemsDetails"),
              numResults: massagedResponse.get("numResults"),
              pageSize: massagedResponse.get("pageSize"),
            }),
          }
        }
      }

      const data = response.data

      if (version === "2.1") {
        const numResults = data.get("numResults")
        const hasNextPage = data.get("items").size < numResults
        const pageSize = pageNumber > 0 ? data.get("pageSize") / pageNumber : 0
        const dataWithPageAndCount = data.merge({
          numResults,
          hasNextPage,
          pageNumber,
          pageSize,
        })
        return dispatch(categoryPLPFetchSucceeded(dataWithPageAndCount))
      }

      let categoryData = data
      if (promoDiscount) {
        const isFinalSale = path && path.includes("/final-sale")
        categoryData = applyPromoDiscount(categoryData, promoDiscount, isFinalSale)
      }

      return dispatch(categoryFetchSucceeded(categoryData))
    } catch (error) {
      const emptyCategory = !error.data || error.data.getIn(["errors", "category"], List()).includes("Category does not contain any purchasable items.")
      if (useConstructor) {
        // fallback to fetch from flatiron if constructor fetch/processing failed
        dispatch(categoryFetchFailed(error))
        dispatch(categoryContructorFetchBlocked())
        return dispatch(categoryFetchAsync(category, res, isServer))
      }
      return emptyCategory ?
        dispatch(emptyCategoryFetched(res)) :
        dispatch(categoryFetchFailed(error))
    }
  }
)

const applyPromoDiscount = (data, promoDiscount, isFinalSale) => {
  const groups = data.get("groups").map((group) => {
    const items = group.get("items").map((item) =>
      shouldExcludeItemFromPromoApply(item, isFinalSale)
        ? item
        : item.set("promoPrice", convertPrice(getDiscountedPrice(item.get("price").substring(1), promoDiscount))),
    )
    return group.set("items", items)
  })
  return data.set("groups", groups)
}

const shouldExcludeItemFromPromoApply = (item, isFinalSale) => {
  if (item.get("isGiftCard") || !item.get("price")) {
    return true
  }
  return shouldExcludeProgram(item.get("slug"), isFinalSale)
}
