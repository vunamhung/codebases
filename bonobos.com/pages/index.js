import withApplicationLayout from "highline/layouts/with_application_layout"
import HomepageContainer from "highline/containers/homepage_container"
import { getField } from "highline/utils/contentful/contentful_helper"
import { reduxWrapper } from "highline/redux/store"
import { getAnyPageProps } from "highline/utils/app_data_fetch"
import { DEFAULT_PAGE_REVALIDATION_TIME } from "highline/utils/constants"

const PAGE_PATH = "/" // url that contentful fetch expects

const Homepage = () => (
  <HomepageContainer />
)

const getSpecificPageProps = async ({ store }) => {
  const state = store.getState()
  const contentfulData = state.getIn(["contentful", "pages", "/"])
  const seoData = getField(contentfulData, "seo")
  const contentfulMetaTitle = getField(seoData, "metaTitle")
  const contentfulMetaDescription = getField(seoData, "metaDescription")

  const metaDescription = contentfulMetaDescription ? contentfulMetaDescription : "Bonobos is the pioneer of better fitting, better looking menswear. Summer through winter, casual or formal, we’ve got a fit for every man. Shopping made easy with free shipping."
  const title = contentfulMetaTitle ? contentfulMetaTitle : "Bonobos: Men’s Clothing & Accessories"

  return {
    canonicalPath: "",
    metaDescription,
    pageCategory: "Homepage",
    title,
  }
}

export const getStaticProps = reduxWrapper.getStaticProps((store) => (
  async (getStaticPropsCtx) => ({
    props: await getAnyPageProps(store, undefined, { ...getStaticPropsCtx, staticPath: PAGE_PATH }, getSpecificPageProps),
    revalidate: DEFAULT_PAGE_REVALIDATION_TIME,
  })
))

export default withApplicationLayout(Homepage)
