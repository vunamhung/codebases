import getConfig from "highline/config/application"

export const shouldExcludeProgram = (productSlug, finalSale) => {
  const { holidayExclusionsForPromoAutoApplyEnabled } = getConfig()
  if (!holidayExclusionsForPromoAutoApplyEnabled){
    return false
  }
  return finalSale || !!excludedProgramSlugs[productSlug]
}

// TODO: should be loaded from Contentful - https://bonobos.atlassian.net/browse/SUP-1377
const excludedProgramSlugs = {
  "bonobos-wrapping-paper": true,
  "physical-gift-card": true,
}
