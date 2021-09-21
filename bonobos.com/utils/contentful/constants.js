import {
  contentfulFlyoutOpenClicked,
  contentfulHeroImageClicked,
  contentfulStoryPodClicked,
  contentfulModalOpenClicked,
  contentfulTabGroupTabClicked,
  contentfulVideoPlayed,
  contentfulCtaClicked,
  contentfulCarouselScrollAsync,
  contentfulCarouselClick,
  contentfulChatTriggerClicked,
} from "highline/redux/actions/contentful_actions"

export const BASE_CONTENTFUL_URL = "images.ctfassets.net"
export const IMGIX_CONTENTFUL_URL = "bonobos-contentful.imgix.net"

export const mobileAlignMap = {
  "bottom": "mobileBottom",
  "middle": "mobileMiddle",
  "top": "mobileTop",
}

export const contentfulAnalyticEvents = {
  "carouselClicked": contentfulCarouselClick,
  "carouselScrolled": contentfulCarouselScrollAsync,
  "chatTrigger": contentfulChatTriggerClicked,
  "cta": contentfulCtaClicked,
  "flyout": contentfulFlyoutOpenClicked,
  "heroImage": contentfulHeroImageClicked,
  "modal": contentfulModalOpenClicked,
  "storyPod": contentfulStoryPodClicked,
  "tabGroup": contentfulTabGroupTabClicked,
  "video": contentfulVideoPlayed,
}

// These content types will be stored in redux as "contentful.globals"
export const defaultGlobals = [
  "Auto-Apply Promo",
  "Cart Messages",
  "Fit Educators",
  "GMBs",
  "Legal",
  "Navigation",
  "Static Content",
]

// paths with this prefix will query for content type, "Page Extras"
export const pdpPathPrefix = "/products"
export const plpPathPrefix = "/shop"
export const bundlesPathPrefix = "/bundles"
export const pageExtrasPathPrefixes = [
  pdpPathPrefix,
  plpPathPrefix,
  bundlesPathPrefix,
]

export const CONTENTFUL_CACHE_CLEAR_QUERY_PARAM = "clearContentfulCache"