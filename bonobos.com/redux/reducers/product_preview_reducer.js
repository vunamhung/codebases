import { toDecamelizedJSON } from "highline/utils/immutable_helper"
import { fromJS, List, OrderedSet } from "immutable"
import { buildUrl, buildHistoryUrl } from "highline/utils/url"

import ActionTypes from "highline/redux/action_types"

import {
  camelizeOptionNames,
  filterFinalSaleSwatches,
  handleOptionChange,
  updateCollapsedOptions,
  updateIsPurchasable,
  ensureImagesAreObjects,
  updateRemainingOptions,
  updateErrors,
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
  price: {},
  properties: {},
  remainingOptions: [],
  requestedOptions: {},
  selectedOptions: {},
  shortDescription: "",
  showErrors: false,
  sizeAndFitOptionTypes: [],
  sku: "",
  slug: "",
  updatedAt: "",
  url: "",
  variant: {},
  zoomOpen: false,
})

const productPreviewReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.PRODUCT_PREVIEW_ADD_TO_CART_CLICKED:
      return !state.get("variant")
        ? state.set("showErrors", true)
        : state.set("isAddingToCart", true)

    case ActionTypes.PRODUCT_PREVIEW_GIFT_CARD_INPUT_CHANGED: {
      const giftCardState = state.get("giftCardDetails").set(action.name, action.value)
      return state.set("giftCardDetails", giftCardState)
    }

    case ActionTypes.PRODUCT_PREVIEW_FETCH_FAILED:
      return state.merge({ isLoading: false, isReady: true })

    case ActionTypes.PRODUCT_PREVIEW_FIT_EDUCATION_LOADED:
      return state.set("fitData", action.fitEducation)

    case ActionTypes.PRODUCT_PREVIEW_FETCH_SUCCEEDED: {
      // const allOptions = action.product.get("allOptions")
      const options = action.product.get("options")
      const productData = action.product.delete("allOptions")
      state = state.merge(productData)
      state = state.set("options", camelizeOptionNames(options))
      state = updateRemainingOptions(state)
      state = updateIsPurchasable(state)
      state = filterFinalSaleSwatches(state)
      state = updatePriceWithPromo(state, action.promo)

      const images = ensureImagesAreObjects(state.get("images"))
      let collapsedOptions = state.get("collapsedOptions")

      if (action.isFromOptionChange) {
        updateQueryParams(state)
      } else {
        // Collapse the options that already have a selection
        collapsedOptions = updateCollapsedOptions(state)
      }

      return state.merge({
        collapsedOptions,
        images,
        isLoading: false,
        isReady: true,
      })
    }

    case ActionTypes.PRODUCT_PREVIEW_FETCH_STARTED:
      return state.set("isLoading", true)

    case ActionTypes.CLIENT_ROUTE_CHANGED:
      return state.merge({
        errors: OrderedSet(),
        showErrors: false,
      })

    case ActionTypes.PRODUCT_PREVIEW_OPTIONS_CHANGED: {
      const prevState = state
      state = handleOptionChange(state, action)
      state = updateRemainingOptions(state)
      state = updateErrors(state, prevState)
      return state.set("isLoading", true)
    }

    case ActionTypes.PRODUCT_PREVIEW_REQUESTED_WITH_OPTIONS:
      return state.set("requestedOptions", action.requestedOptions)

    case ActionTypes.PRODUCT_PREVIEW_ZOOM_OPEN_CLICKED:
      return state.merge({
        zoomImageUrl: action.url,
        zoomOpen: true,
      })

    case ActionTypes.PRODUCT_PREVIEW_ZOOM_CLOSE_CLICKED:
      return state.merge({
        zoomImageUrl: null,
        zoomOpen: false,
      })

    case ActionTypes.PRODUCT_PREVIEW_CLICKED:
    case ActionTypes.SEARCH_PRODUCT_PREVIEW_CLICKED:
    case ActionTypes.SUGGESTED_ITEM_PRODUCT_PREVIEW_CLICKED:
      return state.merge({
        images: List(),
        isLoading: true,
        requestedOptions: action.selectedOptions,
        slug: action.slug,
      })

    case ActionTypes.PRODUCT_PREVIEW_OPTION_TOGGLED: {
      const collapsedOptions = state.get("collapsedOptions")
      if (collapsedOptions.includes(action.optionName)) {
        const optionIndex = collapsedOptions.indexOf(action.optionName)
        return state.set("collapsedOptions", collapsedOptions.splice(optionIndex, 1))
      } else {
        return state.set("collapsedOptions", collapsedOptions.push(action.optionName))
      }
    }

    case ActionTypes.LINE_ITEMS_ADDED_TO_CART:
    case ActionTypes.CART_ADD_LINE_ITEMS_FAILED:
      return state.set("isAddingToCart", false)

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

export default productPreviewReducer
