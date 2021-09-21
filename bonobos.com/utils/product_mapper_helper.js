import { Map, List, fromJS } from "immutable"
import { camelize } from "humps"
import { getDiscountedPrice } from "highline/redux/helpers/product_detail_helper"
import { shouldExcludeProgram } from "highline/utils/promo_auto_apply_helper"

const convertToProduct = (constructorResult) => {
  const product = constructorResult.get("data")
  return Map({
    currentColor: product.get("colorName"),
    finalSale: product.get("finalSale"),
    fullPrice: `$${product.get("fullPrice")}`,
    id: product.get("id"),
    isBundle: product.get("isBundle"),
    isGiftCard: product.get("isGiftCard"),
    name: constructorResult.get("value"),
    price: `$${product.get("currentPrice")}`,
    primaryImageUrl: product.get("imageUrl"),
    secondaryImageUrl: product.get("hoverImageUrl"),
    slug: product.get("url"),
  })
}

export const convertToProducts = (constructorResults) => {
  return constructorResults.map((result) => convertToProduct(result))
}

export const convertToRecommendationProducts = (constructorResults, podId) => {
  return constructorResults.map((result) => {
    const product = convertToProduct(result)
    return product.merge({
      podId,
      strategyId: result.getIn(["strategy", "id"]),
    })
  })
}

const mapFacetsToFilters = (facets) => (
  facets.reduce((filters, currentFacet) => {
    const presentation = currentFacet.get("displayName")
    // Ensure filters have options returned
    let options = currentFacet.get("options")
    // Hide the "Product" filter if exceeding a certain number of programs
    const isProductFilter = presentation == "Product"
    const hideProductFilter = isProductFilter && options.size > 15
    // Exclude color to avoid listing tons of swatches in facets (we only show base colors)
    const isColorFilter = presentation == "Color"
    if (!options || isColorFilter || hideProductFilter) return filters
    // Sort Products by count to ensure core products appear first in the list
    if (isProductFilter) {
      options = options.sort((a, b) => b.get("count") - a.get("count"))
    }

    return filters.push(Map({
      name: convertFacetName(currentFacet.get("name")),
      presentation,
      shortPresentation: convertToShortPresentation(presentation),
      values: convertOptionsToValues(options),
    }))
  }, List())
)

const convertToShortPresentation = (displayName) => displayName.includes(" ") ? displayName.split(" ")[1] : displayName

const convertOptionsToValues = (options) => {
  return options.map((option, idx) => {
    return Map({
      name: option.get("value"), // button-down, slim, etc
      position: idx, // TODO: understand how position is used, confirm filter value sequence
      presentation: option.get("displayName"), // Semi Spread, Button Down, Slim
    })
  })
}

// i.e. convert from "pant-fit" to "Pant Fit"
const convertNameToPresentation = (option, separator = "-") => {
  return option && option
    .split(separator)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

const convertColorToPresentation = (option) => {
  return option
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export const buildFiltersForConstructor = (selectedFilters) => {
  const filters = selectedFilters.toJS()
  return Object.keys(filters).reduce((newFilters, currentFilterOption) => {
    return { ...newFilters, [convertNameToPresentation(currentFilterOption)]: filters[currentFilterOption] }
  }, {})
}

const convertFacetName = (name) => {
  return name.toLowerCase().replace(" ", "-")
}

export const massageConstructorCategoryResponse = (rawResponse, filters, options = {}) => {
  const redirect = rawResponse.getIn(["response", "redirect"])
  if (redirect) {
    return fromJS({ redirect: redirect && redirect.getIn(["data", "url"]) })
  }
  const productResult = convertItemsDetails(rawResponse.getIn(["response", "results"]), options)
  const facets = rawResponse.getIn(["response", "facets"])
  const sortOptions = convertSortOptions(rawResponse.getIn(["response", "sortOptions"]))
  const availableFilters = facets && mapFacetsToFilters(facets)
  const response = fromJS({
    availableFilters,
    numResults: rawResponse.getIn(["response", "totalNumResults"]),
    pageSize: rawResponse.getIn(["request", "numResultsPerPage"]),
    sortOptions,
  }).merge(productResult)
  if (filters) {
    return response.merge(fromJS({
      appliedFilters: filters,
      providedFilters: filters,
    }))
  }
  return response
}

const convertSortOptions = (sortOptions) => {
  return sortOptions.map((option) => fromJS({
    presentation: option.get("displayName"),
    name: option.get("sortBy"),
    sortOrder: option.get("sortOrder"),
  }))
}

const convertItemsDetails = (products, options) => {
  let itemsDetails = Map()
  let items = List()
  products.forEach((prod) => {
    let data = prod.get("data")
    const key = camelize(`${data.get("url")} ${data.get("colorName")}`)
    const isFinalSale = data.get("finalSale")
    const currentPriceNumeric = data.get("currentPrice")
    const shouldApplySitewidePromo = options.promoDiscount && !shouldExcludeProgram(data.get("url", isFinalSale))
    const promoPriceNumeric = shouldApplySitewidePromo && getDiscountedPrice(currentPriceNumeric, options.promoDiscount)
    const swatches = convertSwatches(data, options)
    data = data.merge({
      swatches,
      colorPresentation: convertNameToPresentation(data.get("colorName"), " "),
      primaryImageUrl: data.get("imageUrl"), // convert to match with swatches
      activatedSwatchIndex: 0,
      selectedSwatchIndex: 0,
      currentPrice: convertPrice(data.get("currentPrice")),
      fullPrice: convertPrice(data.get("fullPrice")),
      currentPriceNumeric,
      fullPriceNumeric: data.get("fullPrice"),
      promoPrice: isFinalSale ? null : promoPriceNumeric && convertPrice(promoPriceNumeric),
      promoPriceNumeric: isFinalSale ? null : promoPriceNumeric,
    })
    data = data.delete("imageUrl")
    itemsDetails = itemsDetails.set(key, prod.set("data", data))
    items = items.push(key)
  })
  return fromJS({
    items,
    itemsDetails,
    sharedProductsData: Map(),
  })
}

const convertSwatches = (data, options) => {
  const markdownSwatches = data.get("markdownSwatches")
  if (options.displayOnlyMarkdownSwatches) {
    return padSwatches(markdownSwatches, data.get("numberOfMarkdownSwatches"))
  } else if (data.get("finalSale")) {
    return padSwatches(data.get("finalSaleSwatches"), data.get("numberOfFinalSaleSwatches"))
  }

  const fullPriceSwatches = data.get("fullPriceSwatches")
  // Display markdown first if the current product is marked down, otherwise display full price first
  const fullPriceMix = data.get("currentPrice") == data.get("fullPrice")
    ? fullPriceSwatches && fullPriceSwatches.concat(markdownSwatches)
    : markdownSwatches && markdownSwatches.size > 0 ? markdownSwatches.concat(fullPriceSwatches) : fullPriceSwatches
  const fullPriceMixCount = data.get("numberOfFullPriceSwatches") + data.get("numberOfMarkdownSwatches")
  return padSwatches(fullPriceMix, fullPriceMixCount)
}

export const convertPrice = (priceNumber) => {
  return `$${priceNumber}`
}

/*
The following function is used to map data coming from flatiron to be used for Product tiles sourced by Contentful.
The Flatiron response leverages the Constructor feed and is the reason for the similarities between this response and a Constructor response.
This function is included here for that reason as well as leveraging the existing mapping functions.
Program is the Flatiron equivalant to Product
*/
export const massageFlatironProductListResponse = (data) => {
  const products = data.get("programs")
  let itemsDetails = Map()
  products.forEach((product) => {
    itemsDetails = itemsDetails.set(product.get("id"), product)
  })
  return fromJS({
    itemsDetails,
  })
}

/**
 * Constructor returns a subset of swatches. This function pad empty objects
 * to the swatch array so the Product Tile renders the swatch count appropriately
 */
const padSwatches = (swatches, numberOfSwatches) => {
  if (swatches && swatches.size > 0) {
    const bufferSize = numberOfSwatches ? numberOfSwatches - swatches.size : 0
    const swatchBuffer = fromJS(new Array(bufferSize).fill({
      colorName: "",
      colorPresentation: "",
      currentPrice: "",
      fullPrice: "",
      primaryImageUrl: "",
      hoverImageUrl: "",
      swatchImageUrl: "",
    }))
    const updatedSwatches = swatches.map((swatch) => (swatch.merge({
      currentPrice: convertPrice(swatch.get("currentPrice")),
      fullPrice: convertPrice(swatch.get("fullPrice")),
    })))
    return updatedSwatches.concat(swatchBuffer)
  }
  return fromJS([])
}

export const convertRecForConstructor = (constructorResponse, podId) => {
  const firstResult = constructorResponse.getIn(["response", "results", "0"])
  const data = firstResult.get("data")
  const name = firstResult.get("value")
  const splitProductID = (data.get("id").split("-"))
  const productSku = splitProductID[0]
  const color = data.get("colorName")
  const recColorPresentation = convertColorToPresentation(color)
  const presentation = convertNameToPresentation(color, " ")
  const productSlug = data.get("url")
  const image = data.get("imageUrl")
  const price = `$${data.get("currentPrice")}`
  const finalSale = data.get("finalSale")

  return Map({
    color: Map({
      name: color,
      presentation,
    }),
    description: recColorPresentation,
    finalSale,
    image,
    name,
    price,
    productSku,
    productSlug,
    id: data.get("id"),
    podId,
    strategyId: firstResult.getIn(["strategy", "id"]),
  })
}
