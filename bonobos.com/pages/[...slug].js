import PropTypes from "prop-types"
import withApplicationLayout from "highline/layouts/with_application_layout"
import ContentfulContainer from "highline/containers/contentful_container"
import { getField, getImgixUrl } from "highline/utils/contentful/contentful_helper"
import { categoryNavigationV2FetchAsync } from "highline/redux/actions/category_navigation_v2_actions"
import Rollbar from "highline/utils/rollbar"

const ContentfulPage = () =>
  <ContentfulContainer />

ContentfulPage.getInitialProps = async ({ asPathWithoutQuery, store }) => {
  //Fetch Category V2 data with default of "New" being expanded
  const categorySelected = "/shop/new-arrivals"
  await store.dispatch(categoryNavigationV2FetchAsync(categorySelected))

  const state = store.getState()
  const currentPageData = state.getIn(["contentful", "pages", asPathWithoutQuery])
  if (!currentPageData || currentPageData.isEmpty()) {
    Rollbar.info(`Returning 404 from contentful page for ${asPathWithoutQuery}`)
    return { errorStatusCode: 404 }
  }

  const seoData = getField(currentPageData, "seo")
  const canonicalOverride = getField(seoData, "canonicalOverride") || asPathWithoutQuery
  const metaImageLink = getField(seoData, "socialShareImageLink") || getImgixUrl(getField(seoData,"socialShareImage"))
  return {
    canonicalPath: canonicalOverride || "",
    metaDescription: getField(seoData, "metaDescription") || "",
    metaImageLinkOg: metaImageLink || "",
    metaImageLinkTwitter: metaImageLink || "",
    noIndexTag: getField(seoData, "noIndexTag") || false,
    pageCategory: "Contentful",
    publishedTime: getField(seoData, "createdAt") || "",
    title: getField(seoData, "metaTitle") || "Bonobos",
  }
}

export default withApplicationLayout(ContentfulPage)
