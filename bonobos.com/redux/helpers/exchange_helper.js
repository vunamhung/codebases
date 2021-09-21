import { fromJS } from "immutable"
import { camelizeOptionNames } from "highline/redux/helpers/product_detail_helper"

export const formatInventoryUnits = (inventoryUnits) => {
  return inventoryUnits.map((inventoryUnit) => {
    inventoryUnit = inventoryUnit.set("exchangeOptions", camelizeOptionNames(inventoryUnit.get("exchangeOptions")))

    return inventoryUnit.set("purchasedOptions", inventoryUnit.get("selectedOptions"))
      .set("remainingOptions", fromJS([]))
      .set("collapsedOptions", fromJS([]))
  })
}

/* <Dropdown/> component is using ReactSelect, which requires
 * the key names "value" and "label" for the select options.
 * Rename keys to accommodate */
export const renameKeysForReturnReasonDropdown = (reasonCodes) => (
  reasonCodes.map((reason) =>
    reason
      .set("value", reason.get("id"))
      .set("label", reason.get("name"))
      .delete("id")
      .delete("name"))
)

export const updateReasonCode = (inventoryUnitId, reasonCodeId, inventoryUnits) => (
  inventoryUnits.map((inventoryUnit) =>
    inventoryUnit.get("id") === inventoryUnitId ? inventoryUnit.set("reasonCodeId", reasonCodeId) : inventoryUnit)
)

export const isExchangeValid = (inventoryUnits) => {
  const exchangeInitiated = inventoryUnits.filter((inventoryUnit) => inventoryUnit.get("exchangeInitiated") == true)
  return exchangeInitiated.size > 0 && exchangeInitiated.every((inventoryUnit) => inventoryUnit.get("exchangeVariant") && inventoryUnit.get("reasonCodeId"))
}

export const buildReturnAuthorizationDataForSubmit = (inventoryUnits) => {
  let returnItemsAttributes = fromJS([])

  inventoryUnits.forEach((inventoryUnit) => {
    if (inventoryUnit.get("exchangeVariant") && inventoryUnit.get("reasonCodeId") && inventoryUnit.get("exchangeInitiated")) {
      returnItemsAttributes = returnItemsAttributes.push(fromJS({
        exchangeVariantId: inventoryUnit.getIn(["exchangeVariant", "id"]),
        inventoryUnitId: inventoryUnit.get("id"),
        returnReasonId: inventoryUnit.get("reasonCodeId"),
      }))
    }
  })

  return fromJS({
    returnAuthorization: {
      returnItemsAttributes,
    },
    termsAccepted: true,
  })
}

export const buildSuccessResponseSegmentData = (returnItemsAttributes, inventoryUnits) => (
  returnItemsAttributes.map((returnItem) => {
    const index = inventoryUnits.findIndex((unit) => unit.get("id") === returnItem.get("inventoryUnitId"))
    return returnItem.merge({
      name: inventoryUnits.getIn([index, "variant", "name"]),
      optionsText: inventoryUnits.getIn([index, "variant", "optionsText"]),
      masterSku: inventoryUnits.getIn([index, "variant", "masterSku"]),
      sku: inventoryUnits.getIn([index, "variant", "sku"]),
    })
  })
)
