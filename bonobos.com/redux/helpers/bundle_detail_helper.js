import { toDecamelizedJSON } from "highline/utils/immutable_helper"
import { buildUrl, buildHistoryUrl } from "highline/utils/url"
import { generatePDPLink } from "highline/redux/helpers/category_helper"
import { Set, Map, List, fromJS } from "immutable"
import { camelize } from "humps"
import { getField } from "highline/utils/contentful/contentful_helper"
import { convertPrice } from "highline/utils/product_mapper_helper"
import { getDiscountedPrice, camelizeOptionNames } from "highline/redux/helpers/product_detail_helper"
import { shouldExcludeProgram } from "highline/utils/promo_auto_apply_helper"

/*
  Function returns an object with format:

  options: {
    slug1: {
      optionType: optionValue
    },
    slug2: {
      optionType: optionValue
    },
    ...
  }

  This object will get stringify to the following format:
  options[slug_1][option_type]=option_value&options[slug_2][option_type]=option_value
*/
export const buildRequestSelectedOptions = (bundleOptions) => {
  const requestSelectedOptions = bundleOptions.reduce(
    (options, value, key) => options.set(key, value.get("selectedOptions")),
    Map(),
  )

  return Map({
    options: requestSelectedOptions,
  })
}

/*
  Function returns object with format:

  {
    productClassificationKey1: {
      sizeAndFitOptionTypes: [optionType, ...],
      optionTypesClassifications: { ... }
    },
    productClassificationKey2: {
      ...
    }
  }

  This object is used to map each bundle product to it's corresponding classification data
*/
export const buildBundleClassifications = (classifications) => {
  if (!classifications) {
    return Map()
  }

  let bundleClassifications = Map()

  classifications.forEach((classification) => {
    let sizeAndFitOptionTypes = Set()
    let optionTypesClassifications = Map()
    const classificationKey = classification.get("classificationKey")
    const data = classification.get("data")

    if (!data.get("educationGroups").isEmpty()) {
      data.get("educationGroups").keySeq().toSet().forEach((optionType) => {
        optionTypesClassifications = optionTypesClassifications.set(optionType, data)
        sizeAndFitOptionTypes = sizeAndFitOptionTypes.add(optionType)
      })
    }

    if (data.get("defaultOptionType")) {
      const defaultOptionType = camelize(data.get("defaultOptionType"))
      sizeAndFitOptionTypes = sizeAndFitOptionTypes.add(defaultOptionType)
      optionTypesClassifications = optionTypesClassifications.set(defaultOptionType, data)
    }

    bundleClassifications = bundleClassifications.set(
      classificationKey,
      Map({
        optionTypesClassifications,
        sizeAndFitOptionTypes: sizeAndFitOptionTypes.toList(),
      }),
    )
  })

  return bundleClassifications
}

/*
  Function returns a list of data representing each of the product separates
*/
export const buildProductSeparates = (products, promo) => {
  const productSeparates = products.map((product, index) => {
    const id = index

    const route = generatePDPLink(
      product.get("slug"),
      product.getIn(["selectedOptions", "color"]),
      false,
      false,
      List(),
    )

    const name = product.get("name")
    const description = product.getIn(["selectedOptions", "color"])
    let price = product.getIn(["price", "price"])
    const isFinalSale = product.get("finalSale")
    const slug = product.get("slug")
    const shouldApplyAutoDiscount = !shouldExcludeProgram(slug, isFinalSale)
    if (!isFinalSale && promo && shouldApplyAutoDiscount) {
      const promoDiscount = getField(promo, "discount")
      price = convertPrice(getDiscountedPrice(price.substring(1), promoDiscount))
    }
    const fullPrice = product.getIn(["price", "fullPrice"])
    const image = product.getIn(["images", 0, "url"], "")
    const productId = product.get("sku") // aka the product_id
    const sku = product.getIn(["analytics", "selectedVariant", "sku"]) // variant
    const variant = Map({
      color: product.getIn(["selectedOptions", "color"]),
    })
    const currency = "USD"

    // In PDP we render markdown by checking this flag
    const isMarkDown = product.getIn(["price", "onSale"])

    const data = Map({
      currency,
      fullPrice,
      id,
      isMarkDown,
      name,
      price,
      productId,
      sku,
      variant,
    })

    return Map({
      description,
      id,
      image,
      name,
      price,
      product: data,
      route,
    })
  })

  return productSeparates
}

/*
  Function returns an object represeting all the options for each bundle product.

  {
    slug1: {
      options: [{...}],
      selectedOptions: {...},
      remainingOptions: [{...}],
    },
    slug2: {
      options: [{...}],
      selectedOptions: {...},
      remainingOptions: [{...}],
    },
  }
*/
export const buildBundleOptions = (products, isSameProduct = false, currentSwatchIndex = null, isSuit = false) => {
  if (!products || products.isEmpty()) {
    return List()
  }

  let bundleOptions = Map()
  let remainingOptions = List()
  products.forEach((product, productPosition) => {
    const slug = product.get("slug")
    const classificationKey = product.get("classificationKey")
    let options = product
      .get("options")

    if (!isSameProduct) {
      options = options.filter((option) => option.get("name") !== "color")
    }

    options = camelizeOptionNames(options)

    if (slug.endsWith("vest")) {
      options = repurposeVestOption(options)
    }

    // The isSuit check might be able to replace the isSameProduct check
    const productSelectedOptions =  !isSameProduct && product.getIn(["selectedOptions", "color"]) && isSuit
      ? product.get("selectedOptions").delete("color")
      : product.get("selectedOptions")

    const selectedOptions = bundleOptions
      .getIn([slug, "selectedOptions"], Map())
      .set(productPosition, productSelectedOptions)

    if (!isSameProduct || (isSameProduct && productPosition === currentSwatchIndex)) {
      remainingOptions = buildRemainingOptions(options, productSelectedOptions)
    }

    bundleOptions = bundleOptions.set(slug, Map({
      classificationKey,
      options,
      remainingOptions,
      selectedOptions,
    }))
  })

  return bundleOptions
}

/*
  Function returns an updated version of bundleOptions object
*/
export const updateBundleOptions = (
  bundleOptions,
  optionName,
  optionValue,
  productSlug,
  productPosition = 0,
  isSameProduct = false,
) => {
  const selectedOptions = bundleOptions
    .getIn([productSlug, "selectedOptions", productPosition], Map())

  const options = bundleOptions
    .getIn([productSlug, "options"])

  const newSelectedOptions = buildNewSelectedOptions(
    optionName,
    optionValue,
    selectedOptions,
  )

  const newRemainingOptions = buildRemainingOptions(options, newSelectedOptions)

  let newBundleOptions = bundleOptions
    .setIn([productSlug, "remainingOptions"], newRemainingOptions)

  newBundleOptions = newBundleOptions
    .setIn([productSlug, "selectedOptions", productPosition], newSelectedOptions)

  return newBundleOptions
}

/*
  Function returns T/F if a bundle is in error state.
  NOTE: We need to check each of the bundle product options to determine overall bundle error state
*/
export const isBundleInError = (bundleOptions, newBundleOptions, isSameProduct) => {
  const isInErrorList = bundleOptions
    .keySeq()
    .map((productSlug) => isSameProduct ?
      isInErrorSameProduct(newBundleOptions, productSlug) :
      isInError(bundleOptions, newBundleOptions, productSlug))
    .filter((isInError) => isInError == true)

  return !isInErrorList.isEmpty()
}

/*
  Function updates window.history used by client side navigation in browser
*/
export const updateQueryParameters = (bundleOptions, slug) => {
  const bundleSelectedOptions = buildRequestSelectedOptions(bundleOptions)
  const params = toDecamelizedJSON(bundleSelectedOptions, "-")
  const as = buildUrl(window.location.pathname, params)

  const url = buildHistoryUrl(
    "/bundles",
    Object.assign({}, { slug }, params),
  )

  window.history.replaceState({ as, url }, null, as)
}

export const buildBundleDetailSegmentProperties = (name, bundleOptions, priceObject) => {
  const isMarkdown = Boolean(priceObject.get("onSale"))
  const price = isMarkdown ? priceObject.get("price") : priceObject.get("fullPrice")
  const selectedOptions = bundleOptions.valueSeq()
    .map((bundleOption) => bundleOption.get("selectedOptions"))
    .filter((options) => !options.isEmpty())
    .toJS()

  return {
    currency: "USD",
    is_bundle: true,
    is_markdown: isMarkdown,
    name,
    price,
    variant: selectedOptions,
  }
}

function isInError(bundleOptions, newBundleOptions, productSlug) {
  const remainingOptions = bundleOptions
    .getIn([productSlug, "remainingOptions"])
  const selectedOptions = bundleOptions
    .getIn([productSlug, "selectedOptions"])
  const newRemainingOptions = newBundleOptions
    .getIn([productSlug, "remainingOptions"])
  const newSelectedOptions = newBundleOptions
    .getIn([productSlug, "selectedOptions"])

  if (newRemainingOptions.isEmpty()) {
    return false
  }

  const isRemainingOptionsSame = remainingOptions.equals(newRemainingOptions)
  const isSelectedOptionsDifferent = !(selectedOptions.equals(newSelectedOptions))

  return !(isRemainingOptionsSame && isSelectedOptionsDifferent)
}

function isInErrorSameProduct(newBundleOptions, productSlug) {
  const newRemainingOptions = newBundleOptions
    .getIn([productSlug, "remainingOptions"])
  const newSelectedOptions = newBundleOptions
    .getIn([productSlug, "selectedOptions"])

  return newRemainingOptions.isEmpty() ?
    // for same product bundles, make sure each item has all options selected
    !(newSelectedOptions.every((option) => option.size === newSelectedOptions.get(0).size)) :
    true
}

function buildRemainingOptions(options, selectedOptions) {
  const remainingOptions = options.filter(
    (optionType) => !selectedOptions.get(optionType.get("name")),
  )

  return remainingOptions
}

function buildNewSelectedOptions(optionName, optionValue, selectedOptions) {
  return optionValue
    ? selectedOptions.set(optionName, optionValue)
    : selectedOptions.delete(optionName)
}

/*
  Function only updates the presentation value for vest product.
  @TODO: This is a workaround for having two products (jacket and vest) have equal name
         optiontypes. This will go away (removed) once data is fixed
*/
function repurposeVestOption(options) {
  return options.map((option) => {
    if (option.get("name") === "blazerSize") {
      return option
        .set("presentation", "Vest Size")
    }
    if (option.get("name") === "blazerFit") {
      return option
        .set("presentation", "Vest Fit")
    }
  })
}

export const updateCollapsedOptions = (products) => {
  let updatedCollapsedOptions = List()

  products.forEach((product) => {
    product.get("selectedOptions").forEach((_, optionName) => {
      if (optionName !== "color") {
        updatedCollapsedOptions = updatedCollapsedOptions.push(optionName)
      }
    })
  })

  return updatedCollapsedOptions
}

/* TODO: Remove this once we have boolean in api 2.1 response. */
export const isBundleOfSameProduct = (products) => {
  if (!products || products.isEmpty()) {
    return false
  }

  const distinctSkus = products.map((p) => p.get("sku")).toSet()

  return distinctSkus.first() && distinctSkus.size == 1 // Check that sku isn't ""
}

export const getSwatches = (products, visitedSwatches) => {
  return products.map((product, index) => {
    const colorName = product.getIn(["selectedOptions", "color"])
    const colors = product.getIn(["options", 0, "values"])
    const color = colors.filter((color) => color.get("name") === colorName).first()
    const imageUrl = color.get("url")
    const visited = visitedSwatches.get(index)

    return fromJS({
      title: index,
      name: colorName,
      imageUrl: visited ? imageUrl : "",
    })
  })
}

export const isBundleAllFinalSale = (products) => {
  return products.every((product) => product.get("finalSale"))
}
