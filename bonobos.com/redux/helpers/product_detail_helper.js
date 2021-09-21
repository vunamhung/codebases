import { camelize } from "humps"
import { List, Map } from "immutable"
import { convertPrice } from "highline/utils/product_mapper_helper"
import { getField, getObjectByIdentifier } from "highline/utils/contentful/contentful_helper"
import { onModelProductsData } from "highline/utils/on_model_products_data"
import { shouldExcludeProgram } from "highline/utils/promo_auto_apply_helper"

// Camelize option names to match keys
export const camelizeOptionNames = (options) => (
  options.map((option) => (
    option.set("name", camelize(option.get("name")))
  ))
)

export const handleOptionChange = (state, action) => {
  const optionName = action.optionName
  const optionValue = action.optionValue

  if (optionValue) {
    state = state.setIn(["selectedOptions", optionName], optionValue)
  } else if (optionCanBeDeselected(state, action)) {
    state = state.deleteIn(["selectedOptions", optionName])
  }

  return state
}

// Update remaining options for selection
export const updateRemainingOptions = (state) => {
  const remainingOptions = state
    .get("options")
    .filter((optionType) =>
      !state.hasIn(["selectedOptions", optionType.get("name")]),
    )

  return state.set("remainingOptions", remainingOptions)
}

// Legacy flatiron API sends images as lists of strings rather than of objects.
// However, highline assumes images are objects with `url` and `caption` properties.
// TODO - remove after flatiron PR 4915 is merged and deployed
// (https://github.com/bonobos/flatiron/pull/4915)
export const ensureImagesAreObjects = (images) => {
  return images.map((imageData) => {
    if (typeof(imageData) === "string") {
      return Map({
        caption: "",
        url: imageData,
      })
    } else {
      return imageData
    }
  })
}

// Update whether product can be added to cart
export const updateIsPurchasable = (state) => {
  return state.set("isPurchasable", Boolean(state.get("variant")))
}

// Clear errors if user changes one of the existing selections
export const updateErrors = (state, prevState) => {
  if (state.get("remainingOptions").isEmpty())
    return state.set("showErrors", false)

  const remainingOptionsAreSame = prevState.get("remainingOptions").equals(state.get("remainingOptions"))
  const selectedOptionsAreDifferent = !prevState.get("selectedOptions").equals(state.get("selectedOptions"))

  if (remainingOptionsAreSame && selectedOptionsAreDifferent) {
    return state.set("showErrors", false)
  }

  return state
}

// Only allow option to be de-selected under
// certian circumstances
function optionCanBeDeselected(state, action) {
  if (action.optionName === "color")
    return false

  const options = state.get("options").find(
    (optionType) => optionType.get("name") === action.optionName,
  )

  return options.get("values").count() > 1
}

export const productDetailSegmentProperties = (product) => {
  const isMarkdown = Boolean(product.getIn(["price", "onSale"]))
  const price = isMarkdown ? product.getIn(["price", "price"], "0") : product.getIn(["price", "fullPrice"], "0")

  return {
    currency: "USD",
    is_bundle: false,
    is_markdown: isMarkdown,
    name: product.get("name"),
    price: parseInt(price.replace("$", "")),
    sku: product.get("sku"),
    product_id: product.getIn(["analytics", "selectedVariant", "sku"], ""),
    variant: product.get("selectedOptions").toJS(),
  }
}

export const productNameAndIdDetails = (state) => {
  return {
    product_id: state.get("sku"),
    product_name: state.get("name"),
  }
}

export const updateCollapsedOptions = (state) => {
  const selectedOptions = state.get("selectedOptions")
  let updatedCollapsedOptions = List()

  selectedOptions.forEach((_, selectedOptionKey) => {
    updatedCollapsedOptions = updatedCollapsedOptions.push(selectedOptionKey)
  })

  return updatedCollapsedOptions
}

export const updateOnModelProducts = (state) => {
  const color = state.getIn(["selectedOptions", "color"])
  const sku = state.get("sku")

  return state.set("onModelProducts", onModelProductsData.getIn([sku, color]) || List())
}

export const filterFinalSaleSwatches = (state) => {
  const swatches = state.getIn(["options", "0", "values"])
  if (!swatches)
    return state
  const isFinalSale = state.get("finalSale")
  const finalSaleSwatches = swatches.filter((value) => isFinalSale ? value.get("finalSale") : !value.get("finalSale"))
  const values = finalSaleSwatches.sort((a, b) => {
    return (a.get("price") > b.get("price")) ? 1 : -1
  })

  return state.setIn(["options", "0", "values"], values)
}

export const deduplicateProductProperties = (properties) => {
  if (!properties) return properties
  return properties.map((property) => List([...new Set(property)]))
}

export const getDiscountedPrice = (price, discount) => {
  return Math.ceil(price * ((100 - discount) / 100))
}

export const updateSwatchPrice = (state, promo) => {
  const isFinalSale = state.get("finalSale")
  const swatches = state.getIn(["options", "0", "values"])
  if (isFinalSale || !swatches) return state
  const promoDiscount = getField(promo, "discount")
  const values = swatches.map((swatch) => {
    const discountedPrice = getDiscountedPrice(swatch.get("price"), promoDiscount)
    swatch = swatch.set("price", discountedPrice)
    return swatch
  })
  return state.setIn(["options", "0", "values"], values)
}

export const getPromo = (contentfulData) => {
  const autoAppliedPromos = contentfulData && getField(getObjectByIdentifier(contentfulData, "target", "Auto-Apply Promo"), "content")
  return  autoAppliedPromos && autoAppliedPromos.first()
}

export const updatePriceWithPromo = (state, promo) => {
  const isFinalSale = state.get("finalSale")
  const slug = state.get("slug")
  if (isFinalSale || !promo || shouldExcludeProgram(slug, isFinalSale)) return state
  const priceNumeric = state.getIn(["price", "priceNumeric"])
  const promoDiscount = getField(promo, "discount")

  const promoPrice = convertPrice(getDiscountedPrice(priceNumeric, promoDiscount))
  const promoCode = getField(promo, "promoCode")
  return state.setIn(["price", "promoPrice"], promoPrice)
    .setIn(["price", "promoCode"], promoCode)
}

// only "options" has the purchasability information
export const allSelectedOptionsPurchasable = (selectedOptions, options) => {
  try {
    return List(selectedOptions).every((keyValueList) => {
      const optionTypeName = keyValueList[0]
      const optionValueName = keyValueList[1]
  
      return options
        .find((optionType) => optionType.get("name") === optionTypeName)
        .get("values")
        .find((optionValue) => optionValue.get("name") === optionValueName)
        .get("purchasable")
    })

  // Returning undefined tells the caller that the selection options are missing data
  // This is set in place to make sure we just disable those purchase attempts instead of
  // sending the user to an error page due to an exception
  } catch (e) {
    return undefined
  }
  
}

export const getLoadingButtonText = (isPreorder, selectedOptions, options, isFinalSale, variantIsOutOfStock, price) => {
  if (isPreorder) return "Preorder"
  if (variantIsOutOfStock) return "Notify Me" // Shouldn't need this but do for now
  if (allSelectedOptionsPurchasable(selectedOptions, options)) return `Add to Cart — ${price}`
  if (isFinalSale) return "Sold Out"

  return "Notify Me"
}

export const getOnlyOptions = (productOptions) => {
  if (!productOptions || productOptions.size === 0) return {}

  return productOptions

    // filter only options with only one purchasable option
    .filter((option) => option
      .get("values")
      .filter((choice) => choice.get("purchasable")).size === 1)

    // and make a map with those options that looks like:
    // { optionA: valueA, optionB: valueB, ... }
    .reduce((optionsMap, option) => {
      const optionName = option.get("name")
      const optionValue = option
        .get("values")
        .filter((choice) => choice.get("purchasable"))
        .getIn([0, "name"])
      optionsMap[optionName] = optionValue
      return optionsMap
    }, {})
}
