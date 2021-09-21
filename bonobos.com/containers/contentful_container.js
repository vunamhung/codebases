import { connect } from "react-redux"
import ContentfulPage from "highline/components/contentful/contentful_component"
import { navigationFetchAsync } from "highline/redux/actions/navigation_actions"
import { contentfulProductFetchAsync, contentfulComponentClicked } from "highline/redux/actions/contentful_actions"
import { setHeaderTransparency } from "highline/redux/actions/header_actions"
import { getField } from "highline/utils/contentful/contentful_helper"
import { List } from "immutable"

const mapStateToProps = (state, ownProps) => {
  const targetPage = state.getIn(["currentPage", "path"])
  const currentPageData = state.getIn(["contentful", "pages", targetPage])

  // display content explicitly passed in (for things like Flyout) or check the redux store for what is recorded for this page
  const content = ownProps.content || getField(currentPageData, "content") || List()
  return {
    content,
    enableTransparentHeader: getField(currentPageData, "enableTransparentHeader"),
    filterAndNavOptions: getField(currentPageData, "filterAndNavOptions"),
    pageLayout: getField(currentPageData, "pageLayout"),
    pageTitle: getField(currentPageData, "pageTitle"),
    showTitle: getField(currentPageData, "showTitle"),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    callbackFn: (contentType, target, contentId) => {
      dispatch(contentfulComponentClicked(contentType, target, contentId))
    },
    setHeaderTransparency: (enableTransparentHeader) => {
      dispatch(setHeaderTransparency(enableTransparentHeader))
    },
    pageLoaded: (products) => {
      dispatch(navigationFetchAsync())
      products.length > 0 && dispatch(contentfulProductFetchAsync(products))
    },
  }
}

const ContentfulContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContentfulPage)

export default ContentfulContainer
