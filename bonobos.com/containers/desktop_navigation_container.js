import { connect } from "react-redux"
import DesktopNavigationCollection from "highline/components/application/desktop_navigation_collection"
import { 
  navigationItemClicked,
  navigationImageCtaClicked,
  navigationImageCtaTitleClicked, 
} from "highline/redux/actions/navigation_actions"
import { getObjectByFirstField, getField } from "highline/utils/contentful/contentful_helper"


const mapStateToProps = (state) => {
  const contentfulData = state.getIn(["contentful", "globals"])
  const navData = getField(getObjectByFirstField(contentfulData, "Navigation"), "content")
  return {
    activeNav: state.getIn(["navigation", "activeNav"]),
    contentfulDesktopNavItems: getField(getObjectByFirstField(navData, "Desktop Navigation"), "navItems"),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClickNavItem: (link, itemLabel) => {
      dispatch(navigationItemClicked(link, itemLabel))
    },
    onClickNavImageCta: (altText, link, imageUrl, metadata) => {
      dispatch(navigationImageCtaClicked(altText, link, imageUrl, metadata))
    },
    onClickNavImageCtaTitle: (link, imageTitle, metadata) => {
      dispatch(navigationImageCtaTitleClicked(link, imageTitle, metadata))
    },
  }
}

const DesktopNavigationContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DesktopNavigationCollection)

export default DesktopNavigationContainer
