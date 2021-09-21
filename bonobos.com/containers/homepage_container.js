import { connect } from "react-redux"
import Homepage from "highline/components/homepage/homepage"
import { getObjectByFirstField, getField } from "highline/utils/contentful/contentful_helper"
import { homepageNavSliderItemClicked } from "highline/redux/actions/homepage_actions"
import { contentfulComponentClicked } from "highline/redux/actions/contentful_actions"

const mapStateToProps = (state) => {
  const contentfulData = state.getIn(["contentful", "pages", "/"])
  const homepageContentfulData = getField(contentfulData, "content")

  const globalData = state.getIn(["contentful", "globals"])
  const navData = getField(getObjectByFirstField(globalData, "Navigation"), "content")
  const navSliderData = getField(getObjectByFirstField(navData, "Mobile Nav Sliders"), "navItems")

  return {
    homepageContentfulData,
    isHeaderMinified: state.getIn(["header", "isMinified"]),
    navSliderData,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    callbackFn: (contentType, target, contentId) => {
      dispatch(contentfulComponentClicked(contentType, target, contentId))
    },
    trackNavSliderItemClicked: (location, url) => {
      dispatch(homepageNavSliderItemClicked(location, url))
    },
  }
}

const HomepageContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Homepage)

export default HomepageContainer
