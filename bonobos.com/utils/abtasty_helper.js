import { AB_TESTS } from "highline/utils/abtests"

export const isFeatureEnabled = (testName) => {
  if (!AB_TESTS[testName]) return false

  const aBTastyIsDefined = typeof window.ABTasty !== "undefined"
  if (!aBTastyIsDefined) return false

  const testArray = Object.values(window.ABTasty.getTestsOnPage())
  const selectedTestObject = testArray.filter((test) => test.name === AB_TESTS[testName])[0]
  const isInTestVariation = selectedTestObject && selectedTestObject.variationName === "Variation 1"
  return isInTestVariation
}
