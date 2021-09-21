import { connect } from "react-redux"
import Category from "highline/components/category/category"
import {
  getField,
  getObjectByFirstField,
  filterContentByUrl,
} from "highline/utils/contentful/contentful_helper"
import { plpPathPrefix } from "highline/utils/contentful/constants"

import {
  categoryBackToTopClicked,
  categoryBreadcrumbClicked,
  categoryFetchAsync,
  categoryImageHovered,
  categoryLoaded,
  categoryNavItemClick,
  categoryProductVariantActivated,
  categoryProductVariantDeactivated,
  categoryProductVariantSelected,
  categoryPromoTileClicked,
  productPreviewClicked,
  narrativeClicked,
  navPillItemClicked,
  categoryConstructorFetchMoreAsync,
  onProductTileClicked,
} from "highline/redux/actions/category_actions"

import {
  clearFiltersAsync,
  saveToMyFitClickedAsync,
} from "highline/redux/actions/filters_actions"
import { savedItemCtaClickedAsync } from "highline/redux/actions/saved_items_actions"
import { fitPreferencesOptionTypesFetchAsync } from "highline/redux/actions/fit_preferences_actions"
import { contentfulComponentClicked } from "highline/redux/actions/contentful_actions"

const mapStateToProps = (state) => {
  const currentPath = state.getIn(["currentPage", "path"])
  const plpPageContentfulData = state.getIn(["contentful", "pages", plpPathPrefix])
  const plpPageContents = getField(plpPageContentfulData, "content")
  const allPlpContentPaths = getField(getObjectByFirstField(plpPageContents, "PLP Content Blocks"), "content")
  const plpContentPath = filterContentByUrl(allPlpContentPaths, currentPath)
  const plpContentBlocks = getField(plpContentPath, "plpContentBlocks")
  const bundlePromoTiles = getField(getObjectByFirstField(plpPageContents, "Promo Tiles"), "content")
  
  return {
    activeItem: state.getIn(["categoryNavigationV2", "activeItem"]),
    appliedFilters: state.getIn(["filters", "appliedFilters"]),
    availableFilters: state.getIn(["filters", "availableFilters"]),
    breadcrumbs: state.getIn(["category", "breadcrumbs"]),
    bundlePromoTiles,
    categoryId: state.getIn(["category", "categoryId"]),
    editorial: state.getIn(["category", "editorial"]),
    expandedItem: state.getIn(["categoryNavigationV2", "expandedItem"]),
    groups: state.getIn(["category", "groups"]),
    hasNextPage: state.getIn(["category", "hasNextPage"]),
    heroImageDesktop: state.getIn(["category", "heroImageDesktop"]),
    heroImageMobile: state.getIn(["category", "heroImageMobile"]),
    isFeaturedShop: state.getIn(["category", "isFeaturedShop"]),
    isLoadingMore: state.getIn(["category", "isLoadingMore"]),
    isLoggedIn: state.getIn(["auth", "isLoggedIn"]),
    isNarrativeCollapsed: state.getIn(["category", "isNarrativeCollapsed"]),
    items: state.getIn(["category", "items"]),
    itemsDetails: state.getIn(["category", "itemsDetails"]),
    metaCanonicalPath: state.getIn(["category", "metaCanonicalPath"]),
    metaDescription: state.getIn(["category", "metaDescription"]),
    metaTitle: state.getIn(["category", "metaTitle"]),
    myFitEnabled: state.getIn(["filters", "myFitEnabled"]),
    name: state.getIn(["category", "name"]),
    narrative: state.getIn(["category", "narrative"]),
    navigationItems: state.getIn(["category", "navigationItems"]),
    optionTypes: state.getIn(["filters", "optionTypes"]),
    pageLoaded: state.getIn(["category", "pageLoaded"]),
    plpContentBlocks,
    savedItems: state.getIn(["savedItems", "items"]),
    selectedFilters: state.getIn(["filters", "selectedFilters"]),
    sharedProductsData: state.getIn(["category", "sharedProductsData"]),
    slug: state.getIn(["category", "slug"]),
    userHasFitPreferences: !state.getIn(["fitPreferences", "userSelections"]).isEmpty(),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleBackToTopClick: () => {
      dispatch(categoryBackToTopClicked())
    },

    handleBreadcrumbClick: (path) => {
      dispatch(categoryBreadcrumbClicked(path))
    },

    handleClearFiltersClick: () => {
      dispatch(clearFiltersAsync())
    },

    handleNarrativeClick: () => {
      dispatch(narrativeClicked())
    },

    handleNavClick: (name, anchor) => {
      dispatch(categoryNavItemClick(name, anchor))
    },

    handleProductImageHover: () => {
      dispatch(categoryImageHovered())
    },

    handleProductTileClick: (slug) => {
      dispatch(onProductTileClicked(slug))
    },

    handlePromoTileClick: (title, position, slug) => {
      dispatch(categoryPromoTileClicked(title, position, slug))
    },


    handleQuickAddClick: (slug, selectedOptions) => {
      dispatch(productPreviewClicked(slug, selectedOptions))
    },

    handleSwatchClick: (slug, optionValue) => {
      dispatch(categoryProductVariantSelected(slug, optionValue))
    },

    handleSwatchMouseEnter: (slug, optionValue) => {
      dispatch(categoryProductVariantActivated(slug, optionValue))
    },

    handleSwatchMouseLeave: (slug) => {
      dispatch(categoryProductVariantDeactivated(slug))
    },

    loadCategory: (hasQueryParams) => {
      dispatch(categoryLoaded(hasQueryParams))
      dispatch(categoryFetchAsync())
    },

    loadMore: () => {
      dispatch(categoryConstructorFetchMoreAsync())
    },

    onSavedItemCtaClick: (slug, selectedOptions, saved) => {
      dispatch(savedItemCtaClickedAsync(slug, selectedOptions, saved, "category"))
    },

    trackNavPillItemClick: (name, path) => {
      dispatch(navPillItemClicked(name, path))
    },

    getOptionValueIds: () => {
      dispatch(fitPreferencesOptionTypesFetchAsync())
    },

    handleSaveToMyFitClick: () => {
      dispatch(saveToMyFitClickedAsync())
    },

    contentfulAnalyticCallbackFn: (contentType, target, contentId) => {
      dispatch(contentfulComponentClicked(contentType, target, contentId))
    },
  }
}

const CategoryContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Category)

export default CategoryContainer
