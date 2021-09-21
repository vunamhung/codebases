import { generateLink, formatSelectedOptions } from "highline/redux/helpers/filters_helper"

export const getDynamicProps = (swatchOrItemDetail, slug, selectedFilters, isBundle, isGiftCard, itemName) => {
  const link = generateLink(
    slug,
    swatchOrItemDetail.get("colorName"),
    selectedFilters,
    isGiftCard,
    isBundle,
  )
  return {
    ariaLabel: `Open Quick Shop for ${itemName} in ${swatchOrItemDetail.get("colorPresentation")}`,
    finalSale: swatchOrItemDetail.get("finalSale") !== undefined ? swatchOrItemDetail.get("finalSale") : swatchOrItemDetail.get("fullPrice") !== swatchOrItemDetail.get("currentPrice"),
    fullPrice: swatchOrItemDetail.get("fullPrice"),
    link,
    price: swatchOrItemDetail.get("currentPrice"),
    primaryImageUrl: swatchOrItemDetail.get("primaryImageUrl"),
    secondaryImageUrl: swatchOrItemDetail.get("hoverImageUrl"),
    selectedOptions: formatSelectedOptions(swatchOrItemDetail.get("colorName"), selectedFilters),
    title: swatchOrItemDetail.get("colorPresentation"),
  }
}

export const getProps = (itemsDetails, key, selectedFilters) => {
  const itemDetail = itemsDetails.get(key)
  const data = itemDetail.get("data")
  const slug = data.get("url")
  const itemName = itemDetail.get("value")
  const isGiftCard = data.get("isGiftCard")
  const isBundle = data.get("isBundle")
  const swatches = data.get("swatches")
  const hoveredIndex = itemDetail.get("activatedSwatchIndex")
  const noveltyBadge = data.get("noveltyBadge")
  const selectedIndex = itemDetail.get("selectedSwatchIndex")
  const isNewColor = data.get("isNewColor")
  const isNewProgram = data.get("isNewProgram")
  const urgencyBadge = data.get("urgencyBadge")
  const promoPrice = data.get("promoPrice")
  let selectedSwatchIndex = 0
  if (hoveredIndex != null) {
    selectedSwatchIndex = hoveredIndex
  } else {
    selectedSwatchIndex = selectedIndex
  }
  const numberOfFits = data.get("numberOfFits")
  const swatch = swatches.get(selectedSwatchIndex)
  const {
    finalSale,
    fullPrice,
    price,
    primaryImageUrl,
    secondaryImageUrl,
    link,
    selectedOptions,
    ariaLabel,
    title,
  } = getDynamicProps(swatch ? swatch : data, slug, selectedFilters, isBundle, isGiftCard, itemName)

  return {
    name: itemName,
    slug,
    swatches,
    id: data.get("id"),
    isNewColor,
    isNewProgram,
    subtitle: data.get("description"),
    showCTA: !isBundle && !isGiftCard,
    showSwatches: !isBundle && swatches && swatches.size > 1,
    countDetails: numberOfFits > 1 ? `${numberOfFits} Fits` : "",
    // dynamic props
    selectedSwatchIndex,
    finalSale,
    fullPrice,
    price,
    promoPrice,
    primaryImageUrl,
    secondaryImageUrl,
    link,
    selectedOptions,
    ariaLabel,
    title,
    noveltyBadge,
    urgencyBadge,
  }
}
