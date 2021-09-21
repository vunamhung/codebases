import { toDecamelizedJSON } from "highline/utils/immutable_helper"
import { fromJS, OrderedSet } from "immutable"
import { buildUrl, buildHistoryUrl } from "highline/utils/url"
import { camelize } from "humps"

import ActionTypes from "highline/redux/action_types"

import {
  camelizeOptionNames,
  deduplicateProductProperties,
  filterFinalSaleSwatches,
  handleOptionChange,
  updateCollapsedOptions,
  updateIsPurchasable,
  ensureImagesAreObjects,
  updateRemainingOptions,
  updateErrors,
  updateOnModelProducts,
  updateSwatchPrice,
  updatePriceWithPromo,
} from "highline/redux/helpers/product_detail_helper"

const initialState = fromJS({
  analytics: {},
  collapsedOptions: [],
  errors: OrderedSet(),
  finalSale: false,
  fitData: {},
  giftCardDetails: {
    giftMessage: "",
    purchaserName: "",
    recipientEmail: "",
    recipientName: "",
    sendEmailAt: null,
  },
  id: 0,
  images: [],
  isAddingToCart: false,
  isDigital: false,
  isGiftCard: false,
  isLoading: false,
  isReady: false,
  masterSku: "",
  metaDescription: "",
  metaTitle: "",
  name: "",
  options: [],
  onModelProducts: [],
  powerReviewsDetails: {},
  price: {},
  promoPrice: "",
  properties: {},
  remainingOptions: [],
  requestedOptions: {},
  selectedOptions: {},
  shortDescription: "",
  showAddToCartError: false,
  showErrors: false,
  sizeAndFitOptionTypes: [],
  sku: "",
  slug: "",
  updatedAt: "",
  url: "",
  variant: {},
  zoomImageUrl: null,
  zoomOpen: false,
  zoomImageIndex: 0,
})

const productDetailReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.PRODUCT_DETAIL_ADD_TO_CART_CLICKED:
      return !state.get("variant")
        ? state.set("showErrors", true)
        : state.merge({
          isAddingToCart: true,
          showAddToCartError: false,
        })

    case ActionTypes.PRODUCT_DETAIL_GIFT_CARD_INPUT_CHANGED: {
      const giftCardState = state.get("giftCardDetails").set(action.name, action.value)
      return state.set("giftCardDetails", giftCardState)
    }

    case ActionTypes.PRODUCT_DETAIL_FETCH_FAILED:
      return state.merge({ isLoading: false, isReady: true })

    case ActionTypes.PRODUCT_DETAIL_FIT_EDUCATION_LOADED:
      return state.set("fitData", action.fitEducation)

    case ActionTypes.PRODUCT_DETAIL_POWER_REVIEWS_DISPLAYED: {
      const powerReviewsDetails = fromJS({
        averageRating: action.averageRating.toString(),
        reviewsCount: action.reviewsCount.toString(),
      })
      return state.set("powerReviewsDetails", powerReviewsDetails)
    }

    case ActionTypes.PRODUCT_DETAIL_FETCH_SUCCEEDED: {
      // const allOptions = action.product.get("allOptions")
      const options = action.product.get("options")
      const productData = action.product.delete("allOptions")
      state = state.merge(productData)
      state = state.set("options", camelizeOptionNames(options))
      state = updateRemainingOptions(state)
      state = updateIsPurchasable(state)
      state = updateOnModelProducts(state)
      state = filterFinalSaleSwatches(state)
      state = updatePriceWithPromo(state, action.promo)

      const images = ensureImagesAreObjects(state.get("images"))
      const properties = deduplicateProductProperties(state.get("properties"))
      let collapsedOptions = state.get("collapsedOptions")

      if (action.isFromOptionChange) {
        updateQueryParams(state)
      } else {
        // Collapse the options that already have a selection
        collapsedOptions = updateCollapsedOptions(state)
      }

      if (action.promo) {
        state = updateSwatchPrice(state, action.promo)
      }

      return state.merge({
        collapsedOptions,
        images,
        isLoading: false,
        isReady: true,
        properties,
        showAddToCartError: false,
        zoomImageUrl: null,
        zoomOpen: false,
      })
    }

    case ActionTypes.PRODUCT_DETAIL_FETCH_STARTED:
      return state.set("isLoading", true)

    case ActionTypes.CLIENT_ROUTE_CHANGED:
      return state.merge({
        errors: OrderedSet(),
        showErrors: false,
      })

    case ActionTypes.PRODUCT_DETAIL_OPTIONS_CHANGED: {
      const prevState = state
      state = handleOptionChange(state, action)
      state = updateRemainingOptions(state)
      state = updateErrors(state, prevState)
      return state.set("isLoading", true)
    }

    case ActionTypes.PRODUCT_DETAIL_REQUESTED_WITH_OPTIONS:
      return state.set("requestedOptions", action.requestedOptions)

    case ActionTypes.PRODUCT_DETAIL_ZOOM_OPEN_CLICKED:
      return state.merge({
        zoomImageIndex: action.zoomImageIndex,
        zoomImageUrl: action.url,
        zoomOpen: true,
      })

    case ActionTypes.PRODUCT_DETAIL_ZOOM_CLOSE_CLICKED:
      return state.merge({
        zoomImageIndex: 0,
        zoomImageUrl: null,
        zoomOpen: false,
      })

    case ActionTypes.PRODUCT_DETAIL_PREV_IMAGE_CLICKED: {
      const zoomImageIndex = state.get("zoomImageIndex")
      // Loop back to the end of the image list if we are on the first image
      const newImageIndex = zoomImageIndex > 0 ? zoomImageIndex - 1 : state.get("images").size - 1
      return state.merge({
        zoomImageIndex: newImageIndex,
        zoomImageUrl: state.getIn(["images", newImageIndex, "url"]),
      })
    }

    case ActionTypes.PRODUCT_DETAIL_NEXT_IMAGE_CLICKED: {
      const zoomImageIndex = state.get("zoomImageIndex")
      // Loop to the beginning of the image list if we are at the last image
      const newImageIndex = zoomImageIndex < state.get("images").size - 1 ? zoomImageIndex + 1 : 0
      return state.merge({
        zoomImageIndex: newImageIndex,
        zoomImageUrl: state.getIn(["images", newImageIndex, "url"]),
      })
    }

    case ActionTypes.SIZE_AND_FIT_CLASSIFICATION_FETCH_SUCCEEDED:
      return state.set("sizeAndFitOptionTypes", getOptionTypes(action.classification))

    case ActionTypes.PRODUCT_DETAIL_OPTION_TOGGLED: {
      const collapsedOptions = state.get("collapsedOptions")
      if (collapsedOptions.includes(action.optionName)) {
        const optionIndex = collapsedOptions.indexOf(action.optionName)
        return state.set("collapsedOptions", collapsedOptions.splice(optionIndex, 1))
      } else {
        return state.set("collapsedOptions", collapsedOptions.push(action.optionName))
      }
    }

    case ActionTypes.LINE_ITEMS_ADDED_TO_CART:
      return state.set("isAddingToCart", false)

    case ActionTypes.CART_ADD_LINE_ITEMS_FAILED:
      return state.merge({
        isAddingToCart: false,
        showAddToCartError: true,
      })

    case ActionTypes.SAVED_ITEMS_ADD_PRODUCT_SUCCEEDED:
      return state.set("inWishlist", true)

    case ActionTypes.SAVED_ITEMS_REMOVE_PRODUCT_SUCCEEDED:
      return state.set("inWishlist", false)
    default:
      return state
  }
}

// Set query parameters in URL
function updateQueryParams(state) {
  const isGiftCard = state.get("isGiftCard")
  const params = toDecamelizedJSON(state.get("selectedOptions"), "-")
  const as = buildUrl(window.location.pathname, params)

  // Next Router uses the url parameter to load the page when doing client
  // side navigation. Therefore we need special logic to handle a GiftCard and
  // tell next router to use the /gift-card page instead of the /products page
  const url = buildHistoryUrl(
    isGiftCard ? "/gift-card" : "/products",
    Object.assign({}, { slug: state.get("slug") }, params),
  )

  window.history.replaceState({ as, url }, null, as)
}

function getOptionTypes(classification) {
  const optionTypes = classification.get("educationGroups").keySeq().toSet()
  const defaultOptionType = camelize(classification.get("defaultOptionType"))
  return optionTypes.add(defaultOptionType).toList()
}

export default productDetailReducer
