import { fromJS } from "immutable"
import { camelize } from "humps"

const numSwatches = 7

export const mapCategoryResponse = (flatironResponse) => {
  return fromJS({
    request: {
      numResultsPerPage: flatironResponse.get("items").size,
      page: 1,
    },
    response: {
      facets: flatironResponse.get("availableFilters").map((optionType) => (transformOptionType(optionType))),
      results: flatironResponse.get("items").map((itemId) => (transformItem(itemId, flatironResponse))),
      sortOptions: flatironResponse.get("sortOptions").map((sortOption) => transformSortOption(sortOption)),
      totalNumResults: flatironResponse.get("items").size,
    },
  })
}

const transformItem = (itemId, flatironResponse) => {
  const camelizedItemId = camelize(itemId)
  const itemDetails = flatironResponse.getIn(["itemsDetails", camelizedItemId])
  const slug = itemDetails.get("slug")
  const productData = flatironResponse.getIn(["sharedProductsData", camelize(slug)])
  const colorName = itemDetails.getIn(["color", "name"])
  const currentPrice = convertPriceToInt(itemDetails.get("price"))
  const fullPrice = convertPriceToInt(itemDetails.get("fullPrice"))
  const swatchArray = productData.get("swatches").map((colorName) => (buildSwatch(productData, colorName, currentPrice, fullPrice)))
  const swatches = moveCurrentSwatchColorToFront(swatchArray, colorName)
  const isBundle = itemDetails.get("isBundle")
  const imageUrl = isBundle
    ? itemDetails.getIn(["images", 0, "url"])
    : productData.getIn(["colors", camelize(colorName), "images", 0, "url"])
  const hoverImageUrl = isBundle
    ? itemDetails.getIn(["images", 1, "url"])
    : productData.getIn(["colors", camelize(colorName), "images", 1, "url"])
  const numberOfSwatches = productData.get("swatches").size
  return fromJS({
    data: {
      numberOfFits: sumFits(productData.get("numberOfFits")),
      numberOfFullPriceSwatches: numberOfSwatches,
      numberOfMarkdownSwatches: 0,
      numberOfFinalSaleSwatches: 0,
      fullPriceSwatches: swatches,
      markdownSwatches: {},
      finalSaleSwatches: {},
      isGiftCard: itemDetails.get("isGiftCard"),
      isBundle,
      colorName,
      url: slug,
      currentPrice,
      fullPrice,
      id: [slug, colorName].join("_"),
      description: productData.get("programShortDescription"),
      imageUrl,
      hoverImageUrl,
    },
    value: productData.get("name"),
  })
}

const buildSwatch = (productData, colorName, currentPrice, fullPrice) => {
  const colorData = productData.getIn(["colors", camelize(colorName)])

  return fromJS({
    colorName,
    colorPresentation: colorData.get("presentation"),
    currentPrice,
    fullPrice,
    hoverImageUrl: colorData.getIn(["images", 1, "url"]),
    primaryImageUrl: colorData.getIn(["images", 0, "url"]),
    swatchImageUrl: colorData.get("swatch"),
  })
}

const moveCurrentSwatchColorToFront = (swatches, currentColorName) => {
  const currentColorIndex = swatches.findIndex((swatch) => (swatch.get("colorName") === currentColorName))
  if (currentColorIndex === -1) { return swatches.slice(0, numSwatches) }

  return swatches
    .delete(currentColorIndex)
    .insert(0, swatches.get(currentColorIndex))
    .slice(0, numSwatches)
}

const convertPriceToInt = (priceStr) => (
  parseInt(priceStr.replace(/,/g, "").match(/[0-9]+/)[0])
)

const transformOptionType = (optionType) => (
  fromJS({
    displayName: optionType.get("presentation"),
    name: optionType.get("name"),
    options: optionType.get("values").map((value) => (fromJS({
      displayName: value.get("presentation"),
      value: value.get("name"),
    }))),
  })
)

const sumFits = (fitsArray) => {
  return fitsArray.reduce((fitCount, elementMap) => {
    let sum = 0

    elementMap.valueSeq().forEach((fitValue) => {
      sum += fitValue
    })
    return sum + fitCount
  }, 0)
}

const transformSortOption = (sortOption) => (
  fromJS({
    displayName: sortOption.get("presentation"),
    sortBy: sortOption.get("name"),
    sortOrder: "",
  })
)

export const mapSearchResponse = (flatironResponse) => {
  return fromJS({
    request: {
      numResultsPerPage: flatironResponse.get("products").size,
      page: 1,
    },
    response: {
      facets: flatironResponse.get("availableFilters").map((optionType) => (transformOptionType(optionType))),
      results: flatironResponse.get("products").map((product) => (transformSearchProduct(product))),
      sortOptions: [],
      totalNumResults: flatironResponse.get("products").size,
    },
  })
}

const transformSearchProduct = (product) => {
  const slug = product.get("slug")
  const colorName = product.get("marketingColor").toLowerCase()
  const currentPrice = convertPriceToInt(product.get("price"))
  const fullPrice = convertPriceToInt(product.get("fullPrice"))

  return fromJS({
    data: {
      numberOfFits: 0,
      numberOfFullPriceSwatches: 0,
      numberOfMarkdownSwatches: 0,
      numberOfFinalSaleSwatches: 0,
      fullPriceSwatches: [],
      markdownSwatches: [],
      finalSaleSwatches: [],
      isGiftCard: false,
      isBundle: false,
      colorName,
      url: slug,
      currentPrice,
      fullPrice,
      id: [slug, colorName].join("_"),
      description: "",
      imageUrl: product.get("image"),
      hoverImageUrl: "",
    },
    value: product.get("name"),
  })
}