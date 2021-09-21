import { Map, List } from "immutable"

export const buildOptionTypeMap = (optionTypes) =>
  optionTypes.reduce((acc, optionType) => acc.set(
    optionType.get("name"),
    optionType,
  ), Map())

export const buildOptionTypeAndValueMap = (optionTypes) =>
  optionTypes.reduce((acc, optionType) => {
    const optionTypeValuesData = optionType.get("optionValues").reduce((acc, optionValue) => (
      acc.set(optionValue.get("presentation"), optionValue)
    ), Map())

    return acc.set(optionType.get("name"), optionTypeValuesData)
  }, Map())

export const getOptionValueIdsFromAppliedFilters = (appliedFilters, optionTypesAndValueMap) => {  
  return appliedFilters.reduce((optionValueIdArray, optionValuesByoptionType) => {
    const optionValueIdsForOptionType = optionValuesByoptionType.get("values").map((optionValue) => (
      optionTypesAndValueMap.getIn([optionValuesByoptionType.get("name"), optionValue.get("presentation"), "id"])
    ))

    return optionValueIdArray.concat(optionValueIdsForOptionType)
  }, List())
}

export const getOptionValueName = (state, optionTypeName, optionValueId) => (
  state()
    .getIn(["fitPreferences", "optionTypes", optionTypeName, "optionValues"])
    .find((optionType) => optionType.get("id") === optionValueId)
    .get("presentation")
)

export const buildMyFitFilters = (data) => {
  return data.reduce((myFitOptions, myFitOption) => {
    const optionName = myFitOption.get("optionTypeName")
    const optionValue = myFitOption.get("optionValuePresentation")
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!myFitOptions[optionName]) {
      return { ...myFitOptions, [optionName]: [...myFitOptions[optionName], optionValue] }
    } else {
      // "no-value" allows Constructor to return products that do not contain the chosen fit preference
      // i.e. if you search "brown", it will return shirts even if you only fit preference is for pants
      return { ...myFitOptions, [optionName]: [optionValue, "no-value"] }
    }
  }, {})
}
