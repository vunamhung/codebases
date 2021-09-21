import { List } from "immutable"

/*
 * Restyle variant options to be smaller for this list of options. This performs a "fuzzy"
 * search, so the option must just contain the value. You can add to this list if additional options should be resized.
*/

const smallVariantOptions = RegExp(/(pant-?length|shirt-?neck|sleeve|size|waist)/)

export const optionSizeMapper = (option) => {
  return !!option && smallVariantOptions.test(option.toLowerCase()) ? "small" : "large"
}

export const getFinalSaleToggleGroups = (options) => {
  let containsNullPrice = false
  const min = options.get(0).get("price")
  const max = options.get(options.size -1).get("price")

  let minPriceItems = List()
  let maxPriceItems = List()
  let middlePriceItems = List()

  options.forEach((option) => {
    if (!option.get("price")) containsNullPrice = true
    switch (option.get("price")) {
      case min:
        minPriceItems = minPriceItems.push(option)
        break
      case max:
        maxPriceItems = maxPriceItems.push(option)
        break
      default:
        middlePriceItems = middlePriceItems.push(option)
    }
  })

  return containsNullPrice
    ? getGroupsByPrice(options)
    : getGroupsByPrice(minPriceItems, maxPriceItems, middlePriceItems, min, max )
}


const getGroupsByPrice = (minPriceItems, maxPriceItems, middlePriceItems, min, max) => {
  if (!min || !max) return [ { price: null, toggleGroup: minPriceItems } ]
  if (middlePriceItems.size > 0){ //Display all 3 price groups
    return [ { price: `$${max}`, toggleGroup: maxPriceItems },
      { price: getMiddlePriceTitle(middlePriceItems), toggleGroup: middlePriceItems },
      { price: `$${min}`, toggleGroup: minPriceItems }]
  } else if (min != max) { //Display 2 price groups
    return [ { price: `$${max}`, toggleGroup: maxPriceItems },
      { price: `$${min}`, toggleGroup: minPriceItems }]
  } else { //Display 1 price group
    return [ { price: null, toggleGroup: minPriceItems } ]
  }
}

const getMiddlePriceTitle = (middlePriceItems) => {
  const middleMin = middlePriceItems.get(0).get("price")
  const middleMax = middlePriceItems.get(middlePriceItems.size -1).get("price")

  return middleMax === middleMin ? `$${middleMin}` : `$${middleMin} - $${middleMax}`
}
