import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"
import {
  buildBundleClassifications,
  buildBundleOptions,
  buildProductSeparates,
  getSwatches,
  isBundleAllFinalSale,
  isBundleInError,
  isBundleOfSameProduct,
  updateBundleOptions,
  updateCollapsedOptions,
} from "highline/redux/helpers/bundle_detail_helper"
import {
  deduplicateProductProperties,
  ensureImagesAreObjects,
  updatePriceWithPromo,
  camelizeOptionNames,
} from "highline/redux/helpers/product_detail_helper"

const initialState = fromJS({
  bundleClassifications: {},
  bundleOptions: {},
  collapsedOptions: [],
  currentProductOptions: [],
  currentSwatchIndex: 0,
  finalSale: false,
  hasCompletedSwatchSelection: false,
  images: [],
  isAddingToCart: false,
  isLoading: false,
  isReady: false,
  isSameProduct: false,
  isSuit: false,
  metaDescription: "",
  metaTitle: "",
  name: "",
  price: {},
  products: [],
  productSeparates: [],
  properties: {},
  requestedOptions: {},
  shortDescription: "",
  showAddToCartError: false,
  showErrors: false,
  slug: "",
  swatchGroupData: [],
  url: "",
  variant: {},
  visitedSwatches: [],
  zoomImageIndex: 0,
  zoomImageUrl: null,
  zoomOpen: false,
})

const bundleDetailReducer = (state = initialState, action)  => {
  switch (action.type) {

    case ActionTypes.BUNDLE_DETAIL_FETCH_SUCCEEDED: {
      state = state.merge(action.bundle)
      state = updatePriceWithPromo(state, action.promo)
      const products = state.get("products").map((product) => {
        const imagesAsObjects = ensureImagesAreObjects(product.get("images"))
        const properties = deduplicateProductProperties(product.get("properties"))
        return product.merge({
          images: imagesAsObjects,
          options: camelizeOptionNames(product.get("options")),
          properties,
        })
      })
      const productSeparates = buildProductSeparates(products, action.promo)
      const isSameProduct = isBundleOfSameProduct(products)
      const currentSwatchIndex = state.get("currentSwatchIndex")
      const isSuit = state.get("isSuit")
      const bundleOptions = buildBundleOptions(products, isSameProduct, currentSwatchIndex, isSuit)
      const images = ensureImagesAreObjects(state.get("images"))
      let collapsedOptions = state.get("collapsedOptions")

      // On first fetch, construct a boolean array with the first element true and
      // the rest false. On subsequent fetches, grab current array from state.
      const visitedSwatches = state.get("visitedSwatches").size === 0 ?
        products.map((p, i) => i === 0) :
        state.get("visitedSwatches")

      const swatchGroupData = getSwatches(products, visitedSwatches)
      const finalSale = isBundleAllFinalSale(products)

      if (!action.isFromOptionChange) {
        // Collapse the options that already have a selection
        // only on page load, not after a user makes a change to the options.
        collapsedOptions= updateCollapsedOptions(products)
      }

      // Set the product options for the selected swatch position
      if (isSameProduct || !isSuit) {
        state = state.set(
          "currentProductOptions",
          camelizeOptionNames(products.getIn([currentSwatchIndex, "options"])),
        )
      }

      return state.merge({
        bundleOptions,
        collapsedOptions,
        images,
        isReady: true,
        isSameProduct,
        isSuit,
        products,
        productSeparates,
        showAddToCartError: false,
        swatchGroupData,
        finalSale,
        visitedSwatches,
        zoomImageUrl: null,
        zoomOpen: false,
      })
    }

    case ActionTypes.BUNDLE_DETAIL_ZOOM_OPEN_CLICKED:
      return state.merge({
        zoomImageIndex: action.zoomImageIndex,
        zoomImageUrl: action.url,
        zoomOpen: true,
      })

    case ActionTypes.BUNDLE_DETAIL_ZOOM_CLOSE_CLICKED:
      return state.merge({
        zoomImageIndex: 0,
        zoomImageUrl: null,
        zoomOpen: false,
      })

    case ActionTypes.BUNDLE_DETAIL_PREV_IMAGE_CLICKED: {
      const zoomImageIndex = state.get("zoomImageIndex")
      // Loop back to the end of the image list if we are on the first image
      const newImageIndex = zoomImageIndex > 0 ? zoomImageIndex - 1 : state.get("images").size - 1
      return state.merge({
        zoomImageIndex: newImageIndex,
        zoomImageUrl: state.getIn(["images", newImageIndex, "url"]),
      })
    }

    case ActionTypes.BUNDLE_DETAIL_NEXT_IMAGE_CLICKED: {
      const zoomImageIndex = state.get("zoomImageIndex")
      // Loop to the beginning of the image list if we are at the last image
      const newImageIndex = zoomImageIndex < state.get("images").size - 1 ? zoomImageIndex + 1 : 0
      return state.merge({
        zoomImageIndex: newImageIndex,
        zoomImageUrl: state.getIn(["images", newImageIndex, "url"]),
      })
    }

    case ActionTypes.BUNDLE_DETAIL_OPTIONS_CHANGED: {
      const bundleOptions = state.get("bundleOptions")
      const isSameProduct = state.get("isSameProduct")

      const newBundleOptions = updateBundleOptions(
        bundleOptions,
        action.optionName,
        action.optionValue,
        action.productSlug,
        action.productPosition,
      )

      const isInError = isBundleInError(
        bundleOptions,
        newBundleOptions,
        isSameProduct,
      )

      if (!isInError) {
        state = state.set("showErrors", false)
      }

      return state.set("bundleOptions", newBundleOptions)
    }

    case ActionTypes.BUNDLE_DETAIL_REQUESTED_WITH_OPTIONS:
      return state.set("requestedOptions", action.requestedOptions)

    case ActionTypes.BUNDLE_DETAIL_FETCH_STARTED:
      return state.set("isLoading", true)

    case ActionTypes.BUNDLE_DETAIL_FETCH_COMPLETED:
      return state.set("isLoading", false)

    case ActionTypes.BUNDLE_DETAIL_ADD_TO_CART_CLICKED:
      return !state.get("variant") || (state.get("isSameProduct") && !state.get("hasCompletedSwatchSelection"))
        ? state.set("showErrors", true)
        : state.merge({
          isAddingToCart: true,
          showAddToCartError: false,
        })

    case ActionTypes.SIZE_AND_FIT_CLASSIFICATIONS_FETCH_SUCCEEDED: {
      const bundleClassifications = buildBundleClassifications(action.classifications)
      return state.merge({ bundleClassifications })
    }

    case ActionTypes.BUNDLE_DETAIL_OPTION_TOGGLED: {
      const collapsedOptions = state.get("collapsedOptions")
      if (collapsedOptions.includes(action.optionName)) {
        const optionIndex = collapsedOptions.indexOf(action.optionName)
        return state.set("collapsedOptions", collapsedOptions.splice(optionIndex, 1))
      } else {
        return state.set("collapsedOptions", collapsedOptions.push(action.optionName))
      }
    }

    case ActionTypes.BUNDLE_DETAIL_SWATCH_CHANGED: {
      // If the current tabbed swatch is not in the set of visitedSwatches,
      // add it and update the swatch group data to reflect that.
      const index = parseInt(action.index)

      // Set the product options for the selected swatch position
      const products = state.get("products")
      state = state.set(
        "currentProductOptions",
        camelizeOptionNames(products.getIn([index, "options"])),
      )
      const isSuit = state.get("isSuit")

      // rebuild bundle options when moving to a different swatch
      const bundleOptions = buildBundleOptions(products, state.get("isSameProduct"), index, isSuit)

      if (!state.getIn(["visitedSwatches", index])) {
        const visitedSwatches = state.get("visitedSwatches").set(index, true)
        const swatchGroupData = getSwatches(products, visitedSwatches)

        return state.merge({
          currentSwatchIndex: index,
          visitedSwatches,
          swatchGroupData,
          hasCompletedSwatchSelection: visitedSwatches.toSet().size === 1 && visitedSwatches.get(0), // Have we visited each of the tabs?
          bundleOptions,
        })
      }

      return state.merge({
        currentSwatchIndex: index,
        bundleOptions,
      })
    }

    case ActionTypes.LINE_ITEMS_ADDED_TO_CART:
      return state.set("isAddingToCart", false)

    case ActionTypes.CART_ADD_LINE_ITEMS_FAILED:
      return state.merge({
        isAddingToCart: false,
        showAddToCartError: true,
      })

    case ActionTypes.CLIENT_ROUTE_CHANGE_STARTED:
      return state.merge({
        currentSwatchIndex: 0,
        visitedSwatches: [],
      })

    default:
      return state
  }
}

export default bundleDetailReducer
