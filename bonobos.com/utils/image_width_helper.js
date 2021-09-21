import { List, Map } from "immutable"
import { environmentVariables as cssEnvVars } from "highline/css-env-variables"

//////////////////////////// PLP
const PLP_MOBILE_IMAGE_WIDTH = cssEnvVars["--productTileMobileWidth"] / 100  // 49%
const PLP_TABLET_AND_DESKTOP_IMAGE_WIDTH = cssEnvVars["--productTileTabletAndDesktopWidth"] / 100 // 32%

const PLP_STANDARD_WIDTH = cssEnvVars["--categoryGroupWidth"] / 100 // 100%
const PLP_MAX_PIXEL_WIDTH = cssEnvVars["--plpMaxWidth"] // 1440

// Almost comprehaensive formula based on current css: PLP_TILE_WIDTH = (PLP_max_width - (viewport_width * 2 * PLP_padding_per)) * category_width_per * PLP_tile_width_per
const plpMaxImageWidth = Math.ceil(PLP_MAX_PIXEL_WIDTH * PLP_STANDARD_WIDTH * PLP_TABLET_AND_DESKTOP_IMAGE_WIDTH)

export const PRODUCT_TILE_STANDARD_IMAGE_WIDTH = 352

export const PLP_VIEWPORT_TO_IMAGE_WIDTH_MAP = Map({
  375: Math.ceil(375 * PLP_MOBILE_IMAGE_WIDTH),
  414: Math.ceil(414 * PLP_MOBILE_IMAGE_WIDTH),
  768: Math.ceil(768 * PLP_TABLET_AND_DESKTOP_IMAGE_WIDTH),
  1280: plpMaxImageWidth,
})

//////////////////////////// PDP
const PDP_MOBILE_MULTI_IMAGE_WIDTH = cssEnvVars["--mobilePdpMultiImageWidth"] / 100
const PDP_DESKTOP_MULTI_IMAGE_WIDTH = cssEnvVars["--desktopPdpMultiImageWidth"] / 100
const PDP_SINGLE_IMAGE_WIDTH = cssEnvVars["--pdpSingleImageWidth"] / 100

const PDP_MAX_PIXEL_WIDTH = cssEnvVars["--productWrapperMaxWidth"]
const PDP_MAX_PADDING = cssEnvVars["--productWrapperHorizonalPadding"] / 100
const PDP_DESKTOP_IMAGE_CONTAINER_WIDTH = cssEnvVars["--desktopLeftWidth"] / 100
const PDP_THUMBNAIL_PIXEL_WIDTH = cssEnvVars["--thumbnailWidth"]

const calculateDesktopPdpImageWidth = (viewportWidth, imagePercentWidth) => (
  Math.ceil(viewportWidth * (1 - (2 * PDP_MAX_PADDING)) * PDP_DESKTOP_IMAGE_CONTAINER_WIDTH * imagePercentWidth) - PDP_THUMBNAIL_PIXEL_WIDTH
)

export const calculatePdpImageWidth = (numImages) => {
  const pdpMobileImagePercent = numImages < 2 ? PDP_SINGLE_IMAGE_WIDTH : PDP_MOBILE_MULTI_IMAGE_WIDTH // 100 or 75
  const pdpDesktopImagePercent = numImages < 2 ? PDP_SINGLE_IMAGE_WIDTH : PDP_DESKTOP_MULTI_IMAGE_WIDTH // 100

  const pdpMaxImageWidth = calculateDesktopPdpImageWidth(PDP_MAX_PIXEL_WIDTH, pdpDesktopImagePercent)

  return Map({
    375: Math.ceil(375 * pdpMobileImagePercent),
    414: Math.ceil(414 * pdpMobileImagePercent),
    768: Math.ceil(768 * pdpMobileImagePercent),
    1280: calculateDesktopPdpImageWidth(1280, pdpDesktopImagePercent),
    1366: calculateDesktopPdpImageWidth(1366, pdpDesktopImagePercent),
    1440: pdpMaxImageWidth,
  })
}

export const getImageWidths = (sizes) => {
  const viewportWidthMap = List.isList(sizes) // If the sizes is a List, convert to a Map
    ? sizes.reduce((hash, size) => hash.set(size.toString(), size), Map())
    : sizes

  const viewportSizes = List(viewportWidthMap).map(([viewportSize]) => parseInt(viewportSize))
  const ascendingImageWidths = viewportSizes.sort() // Sizes need to be in ascending order
  const imageWidths = ascendingImageWidths.slice(0, -1)

  const defaultImageWidth = viewportWidthMap.get(ascendingImageWidths.last().toString())

  return {
    defaultImageWidth,
    imageWidths,
    viewportWidthMap,
  }
}
