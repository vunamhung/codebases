import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"
import { formatBreadcrumbs } from "highline/redux/helpers/category_helper"
import { buildFilterUrl, buildHistoryUrl, clearFiltersFromUrl } from "highline/utils/url.js"

const initialState = fromJS({
  breadcrumbs: [{
    name: "",
    href: "",
    as: "",
  }],
  editorial: {},
  groups: [],
  heroImageDesktop: "",
  heroImageMobile: "",
  isConstructorBlocked: false,
  isFeaturedShop: false,
  isNarrativeCollapsed: true,
  items: [],
  itemsDetails: {},
  metaCanonicalPath: null,
  metaDescription: null,
  metaTitle: null,
  name: null,
  narrative: "",
  navigationItems: [],
  pageLoaded: false,
  slug: null,
  categoryId: "",
  pageNumber: 1,
  pageSize: 0,
  hasNextPage: false,
  isLoadingMore: false,
})

const categoryReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.PAGE_LOADED:
      state = action.pageCategory === "Category"
        ? state.set("pageLoaded", true)
        : state.set("pageLoaded", false)
      return state

    case ActionTypes.CATEGORY_FETCH_SUCCEEDED: {
      const slug = action.data.get("slug")
      return state.merge({
        breadcrumbs: formatBreadcrumbs(action.data.get("breadcrumbs")),
        editorial: action.data.get("editorial"),
        groups: action.data.get("groups"),
        heroImageDesktop: action.data.get("primaryImage"),
        heroImageMobile: action.data.get("secondaryImage"),
        isFeaturedShop: slug && slug.startsWith("featured-shops/"),
        metaCanonicalPath: action.data.get("metaCanonicalPath"),
        metaDescription: action.data.get("metaDescription"),
        metaTitle: action.data.get("metaTitle"),
        name: action.data.get("name"),
        narrative: action.data.get("narrative"),
        slug,
      })
    }

    case ActionTypes.CATEGORY_PLP_FETCH_SUCCEEDED: {
      const slug = action.data.get("slug")
      return state.merge({
        breadcrumbs: formatBreadcrumbs(action.data.get("breadcrumbs")),
        editorial: action.data.get("editorial"),
        heroImageDesktop: action.data.get("primaryImage"),
        heroImageMobile: action.data.get("secondaryImage"),
        isFeaturedShop: slug && slug.startsWith("featured-shops/"),
        items: action.data.get("items"),
        itemsDetails: action.data.get("itemsDetails"),
        metaCanonicalPath: action.data.get("metaCanonicalPath"),
        metaDescription: action.data.get("metaDescription"),
        metaTitle: action.data.get("metaTitle"),
        name: action.data.get("name"),
        narrative: action.data.get("narrative"),
        slug,
        categoryId: action.data.get("categoryId"),
        pageNumber: action.data.get("pageNumber"),
        pageSize: action.data.get("pageSize"),
        hasNextPage: action.data.get("hasNextPage"),
      })
    }

    case ActionTypes.CATEGORY_CONSTRUCTOR_FETCH_MORE_SUCCEEDED: {
      return state.merge({
        items: action.data.get("items"),
        itemsDetails: action.data.get("itemsDetails"),
        pageNumber: state.get("pageNumber") + 1,
        pageSize: action.data.get("pageSize"),
        hasNextPage: action.data.get("hasNextPage"),
        isLoadingMore: false,
      })
    }

    case ActionTypes.CATEGORY_CONSTRUCTOR_FETCH_MORE_STARTED: {
      return state.merge({
        isLoadingMore: true,
      })
    }

    case ActionTypes.CATEGORY_CONSTRUCTOR_FETCH_MORE_FAILED: {
      return state.merge({
        isLoadingMore: false,
      })
    }

    case ActionTypes.CATEGORY_PRODUCT_VARIANT_ACTIVATED: {
      return state.setIn(["itemsDetails", action.itemKey, "activatedSwatchIndex"], action.index)
    }

    case ActionTypes.CATEGORY_PRODUCT_VARIANT_SELECTED: {
      return state.setIn(["itemsDetails", action.itemKey, "selectedSwatchIndex"], action.index)
    }

    case ActionTypes.CATEGORY_PRODUCT_VARIANT_DEACTIVATED: {
      return state.setIn(["itemsDetails", action.itemKey, "activatedSwatchIndex"], null)
    }

    case ActionTypes.NARRATIVE_CLICKED: {
      return state.merge({
        isNarrativeCollapsed: !state.get("isNarrativeCollapsed"),
      })
    }

    case ActionTypes.CATEGORY_CONSTRUCTOR_FETCH_BLOCKED:
      return state.set("isConstructorBlocked", true)

    case ActionTypes.FILTERS_CLEARED: {
      if (window && state.get("pageLoaded")) {
        const as = clearFiltersFromUrl(window.location.pathname)
        const url = buildHistoryUrl(
          "/category",
          { category: state.get("slug") },
        )
        window.history.replaceState({ as, url }, null, as)
      }
      return state
    }

    case ActionTypes.FILTERS_UPDATED: {
      if (window && state.get("pageLoaded")) {
        const as = buildFilterUrl(window.location.pathname, action.filters)
        const url = buildHistoryUrl(
          "/category",
          { category: state.get("slug") },
        )
        window.history.replaceState({ as, url }, null, as)
      }
      return state
    }

    default:
      return state
  }
}

export default categoryReducer
