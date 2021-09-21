/*
The following function allows isHeroTextLight to have a default in the case that no slides
are found in the Contentful Data. This is important as the v2 header needs this field to
determine if the header should be light or dark.
*/
export const isHeroTextLight = (slides, currentSlideIndex, isMobile=false) => {
  try {
    const currentSlide = Array.from(slides.values())[currentSlideIndex]
    if (isMobile) {
      return !currentSlide.get("mobileDark")
    }
    return !currentSlide.get("dark")
  } catch {
    return false
  }
}

export const isHeroImage = (slides, currentSlideIndex, isMobile=false) => {
  try {
    const currentSlide = Array.from(slides.values())[currentSlideIndex]
    if (isMobile) {
      return !currentSlide.get("portraitVideo")
    }
    return !currentSlide.get("landscapeVideo")
  } catch {
    return true
  }
}
