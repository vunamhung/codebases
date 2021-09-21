import { navigationFetchAsync } from "highline/redux/actions/navigation_actions"
import { contentfulPageFetchAsync } from "highline/redux/actions/contentful_actions"
import { currentPageInit } from "highline/redux/actions/application_layout_actions"
import { CONTENTFUL_CACHE_CLEAR_QUERY_PARAM } from "highline/utils/contentful/constants"
import Rollbar from "highline/utils/rollbar"

export const getParamsFromNextContext = (getInitalPropsCtx, getStaticPropsCtx) => {
  // getInitalProps Context: https://nextjs.org/docs/api-reference/data-fetching/getInitialProps#context-object
  // getStaticProps Context: https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
  let asPathWithoutQuery, clearContentfulCache, contentfulPreview, query

  if (getInitalPropsCtx) {
    // Example getInitialProps Context for a dynamic page
    // pathname = /products/[slug]
    // query    = { slug: 'someProduct', contentfulPreview: 'true' }
    // asPath   = /products/someProduct?contentfulPreview=true
    contentfulPreview = getInitalPropsCtx.query.contentfulPreview === "true"
    clearContentfulCache = getInitalPropsCtx.query.clearContentfulCache === "true"
    asPathWithoutQuery = getInitalPropsCtx.asPath.split("?")[0]
    query = getInitalPropsCtx.query

  } else if (getStaticPropsCtx) {
    if (getStaticPropsCtx.staticPath === undefined) {
      Rollbar.error("Static pages must manually insert staticPath to NextJS context object")
    }

    if (getStaticPropsCtx.preview) {
      if (getStaticPropsCtx.previewData[CONTENTFUL_CACHE_CLEAR_QUERY_PARAM]) {
        contentfulPreview = false
        clearContentfulCache = true
      } else {
        contentfulPreview = true
        clearContentfulCache = false
      }
    } else {
      contentfulPreview = false
      clearContentfulCache = false
    }

    asPathWithoutQuery = getStaticPropsCtx.staticPath
    query = {}
  } else {
    Rollbar.error("Must provide either getInitalPropsCtx or getStaticPropsCtx")
  }

  return {
    asPathWithoutQuery,
    clearContentfulCache,
    contentfulPreview,
    query,
  }
}

export const getAnyPageProps = async (store, getInitalPropsCtx, getStaticPropsCtx, getSpecificPageProps) => {
  const {
    contentfulPreview,
    clearContentfulCache,
    asPathWithoutQuery,
    query,
  } = getParamsFromNextContext(getInitalPropsCtx, getStaticPropsCtx)

  store.dispatch(currentPageInit(asPathWithoutQuery, query))

  // get page data if we haven't already (the check to see if we already have data is in contentfulPageFetchAsync)
  await store.dispatch(contentfulPageFetchAsync(asPathWithoutQuery, contentfulPreview, clearContentfulCache))

  const navRequest = store.dispatch(navigationFetchAsync())
  const pageRequest = getSpecificPageProps({
    ...getInitalPropsCtx,
    asPathWithoutQuery,
    store,
    ...getStaticPropsCtx,
  })
  const [pageResult, navResult] = await Promise.all([pageRequest, navRequest])

  return Object.assign({}, pageResult, navResult) // nav & page data
}