import { List, Map } from "immutable"
import Rollbar, { formatHttpError } from "highline/utils/rollbar"
import { addLineItemsToCartAsync } from "highline/redux/actions/cart_actions"
import { savedItemsFetchAsync } from "highline/redux/actions/saved_items_actions"
import { getPromo } from "highline/redux/helpers/product_detail_helper"
import * as ProductDetailApi from "highline/api/product_detail_api"
import Router from "next/router"

import ActionTypes from "highline/redux/action_types"

export const productDetailAddToCartClicked = () => ({
  type: ActionTypes.PRODUCT_DETAIL_ADD_TO_CART_CLICKED,
})

export const productDetailEducationCtaClicked = (optionTypeName) => ({
  type: ActionTypes.PRODUCT_DETAIL_EDUCATION_CTA_CLICKED,
  optionTypeName,
})

export const productDetailHelpLinkClicked = (helpLink) => ({
  type: ActionTypes.PRODUCT_DETAIL_HELP_LINK_CLICKED,
  helpLink,
})

export const productDetailZoomClicked = (direction) => ({
  type: ActionTypes.PRODUCT_DETAIL_ZOOM_CLICKED,
  direction,
})

export const productDetailOptionsChanged = (optionName, optionValue) => ({
  type: ActionTypes.PRODUCT_DETAIL_OPTIONS_CHANGED,
  optionName,
  optionValue,
})

export const productDetailFetchFailed = (error) => ({
  type: ActionTypes.PRODUCT_DETAIL_FETCH_FAILED,
  error,
})

export const productDetailFetchStarted = () => ({
  type: ActionTypes.PRODUCT_DETAIL_FETCH_STARTED,
})

export const productDetailFitEducationLoaded = (fitEducation) => ({
  type: ActionTypes.PRODUCT_DETAIL_FIT_EDUCATION_LOADED,
  fitEducation,
})

export const productDetailFetchSucceeded = (product, isFromOptionChange, promo) => ({
  type: ActionTypes.PRODUCT_DETAIL_FETCH_SUCCEEDED,
  product,
  isFromOptionChange,
  promo,
})

export const productDetailOptionLoaded = () => ({
  type: ActionTypes.PRODUCT_DETAIL_OPTION_LOADED,
})

export const productDetailThumbnailClicked = (url) => ({
  type: ActionTypes.PRODUCT_DETAIL_THUMBNAIL_CLICKED,
  url,
})

export const productDetailZoomOpenClicked = (url, zoomImageIndex) => ({
  type: ActionTypes.PRODUCT_DETAIL_ZOOM_OPEN_CLICKED,
  url,
  zoomImageIndex,
})

export const productDetailZoomCloseClicked = () => ({
  type: ActionTypes.PRODUCT_DETAIL_ZOOM_CLOSE_CLICKED,
})

export const productDetailNextImageClicked = () => ({
  type: ActionTypes.PRODUCT_DETAIL_NEXT_IMAGE_CLICKED,
})

export const productDetailProductPropertiesAccordionClicked = (productName, productSlug, accordionHeader, location) => ({
  type: ActionTypes.BUNDLE_DETAIL_PRODUCT_PROPERTIES_ACCORDION_CLICKED,
  productName,
  productSlug,
  accordionHeader,
  location,
})

export const productDetailPrevImageClicked = () => ({
  type: ActionTypes.PRODUCT_DETAIL_PREV_IMAGE_CLICKED,
})

export const productDetailLocationChanged = (res, redirectSlug) => ({
  type: ActionTypes.PRODUCT_DETAIL_LOCATION_CHANGED,
  res,
  redirectSlug,
})

export const productDetailRequestedWithOptions = (requestedOptions) => ({
  type: ActionTypes.PRODUCT_DETAIL_REQUESTED_WITH_OPTIONS,
  requestedOptions,
})

export const productDetailGiftCardInputChanged = (name, value) => ({
  type: ActionTypes.PRODUCT_DETAIL_GIFT_CARD_INPUT_CHANGED,
  name,
  value,
})

export const productPreviewViewed = (product) => ({
  type: ActionTypes.PRODUCT_PREVIEW_VIEWED,
  product,
})

export const productShareToEmailClicked = () => ({
  type: ActionTypes.PRODUCT_SHARE_TO_EMAIL_CLICKED,
})

export const productShareToTextClicked = () => ({
  type: ActionTypes.PRODUCT_SHARE_TO_TEXT_CLICKED,
})

export const productDetailOptionToggled = (optionName) => ({
  type: ActionTypes.PRODUCT_DETAIL_OPTION_TOGGLED,
  optionName,
})

export const productDetailOnModelProductClicked = (product) => ({
  type: ActionTypes.PRODUCT_DETAIL_ON_MODEL_PRODUCT_CLICKED,
  product,
})

export const productDetailPowerReviewsDisplayed = (averageRating, reviewsCount) => ({
  averageRating,
  reviewsCount,
  type: ActionTypes.PRODUCT_DETAIL_POWER_REVIEWS_DISPLAYED,
})

export const productDetailFetchAsync = (slug, selectedOptions, isFromOptionChange = false, res = null, location = null) => (
  async (dispatch, getState) => {
    dispatch(productDetailFetchStarted())
    dispatch(savedItemsFetchAsync())

    try {
      const response = await ProductDetailApi.fetch(slug, selectedOptions.toJS())
      const responseSlug = response.data.get("slug")

      const contentfulData = getState().getIn(["contentful", "globals"])
      const autoAppliedPromo = getPromo(contentfulData)

      if (slug !== responseSlug)
        return dispatch(productDetailLocationChanged(res, responseSlug))

      if (location === "quick shop") {
        dispatch(productPreviewViewed(response.data))
      }
      return dispatch(productDetailFetchSucceeded(response.data, isFromOptionChange, autoAppliedPromo))

    } catch (error) {
      if (error.status === 422 && selectedOptions.get("color")) {
        try {
          // Fallback request to retrieve a product by color
          const innerResponse = await ProductDetailApi.fetch(slug, { color: selectedOptions.get("color") })
          return dispatch(productDetailFetchSucceeded(innerResponse.data, isFromOptionChange))

        } catch (error) {
          logProductFetchFailed(error)
          return dispatch(productDetailFetchFailed(error))
        }

      } else {
        logProductFetchFailed(error)
        return dispatch(productDetailFetchFailed(error))
      }
    }
  }
)

export const productDetailUpdateOptionsAsync = (optionName, optionValue, updateQueryParams = true) => (
  async (dispatch, getState) => {
    // don't allow deselect color
    if (optionName === "color" && !optionValue)
      return

    const selectedOptions = getState()
      .getIn(["productDetail", "selectedOptions"])
      .set(optionName, optionValue)

    const newSelectedOptions = optionValue
      ? selectedOptions.set(optionName, optionValue)
      : selectedOptions.delete(optionName)

    const slug = getState().getIn(["productDetail", "slug"])

    dispatch(productDetailOptionsChanged(optionName, optionValue))
    await dispatch(productDetailFetchAsync(slug, newSelectedOptions, updateQueryParams))
    dispatch(productDetailOptionLoaded())
  }
)

export const productDetailAddToCartAsync = (isTablet) => (
  (dispatch, getState) => {
    if (getState().getIn(["productDetail", "isLoading"]))
      return // short circut request when loading

    const location = getState().getIn(["rightDrawer", "contents"]) === "quickShop" ? "quick shop" : null

    dispatch(productDetailAddToCartClicked())
    const product = getState().get("productDetail")

    if (product.get("isPurchasable")) {
      const variant = product.get("variant")

      let lineItem = Map({
        id: variant.get("id"),
        isBundle: false,
        location,
        name: product.get("productName"),
        productSku: product.get("sku"),
        quantity: 1,
        sku: variant.get("sku"),
        slug: product.get("slug"),
      })

      if (product.get("isGiftCard") && product.get("isDigital")) {
        lineItem = lineItem.set("giftCardDetails", product.get("giftCardDetails"))
      }

      return dispatch(addLineItemsToCartAsync(List([lineItem]), null, false, isTablet))
    }
  }
)

export const productDetailRequestedWithOptionsAsync = (requestedOptions) => (
  async (dispatch) => (
    dispatch(productDetailRequestedWithOptions(requestedOptions))
  )
)

function logProductFetchFailed(error) {
  if (error.status === 422)
    Rollbar.error("422: Product Request Failed", formatHttpError(error))
}

export const onModelProductClickedAsync = (route, product) => (
  (dispatch) => {
    dispatch(productDetailOnModelProductClicked(product))
    Router.push(route.get("href"), route.get("as"))
    window.scrollTo(0, 0)
  }
)

export const fitEducatorClosed = (productName) => ({
  type: ActionTypes.FIT_EDUCATOR_CLOSED,
  productName,
})

export const affirmEstimateClicked = (source, totalAmount, product) => ({
  type: ActionTypes.AFFIRM_ESTIMATE_CLICKED,
  source,
  totalAmount,
  product,
})
