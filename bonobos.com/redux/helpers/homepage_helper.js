import { toCarouselFields } from "highline/utils/contentful/component_helper"
import { getContentType } from "highline/utils/contentful/contentful_helper"

export const getHomepageSlides = (homepageData) => {
  try {
    const entry = homepageData.first()
    if (getContentType(entry) === "carousel"){
      return toCarouselFields(entry)
    }
    return null
  } catch {
    return null
  }
}
