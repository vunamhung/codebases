import { connect } from "react-redux"
import HeaderV2 from "highline/components/application/header_v2"
import { logoutAsync } from "highline/redux/actions/auth_actions"
import { paths } from "highline/utils/navigate"
import { getHomepageSlides } from "highline/redux/helpers/homepage_helper"
import { isHeroTextLight } from "highline/utils/carousel_helper"
import { navigationOpenedAsync } from "highline/redux/actions/navigation_actions"
import { cartOpenClicked, loadCartAsync } from "highline/redux/actions/cart_actions"
import { mobileMenuOpenedFromSearch } from "highline/redux/actions/search_actions"
import { getObjectByFirstField, getField } from "highline/utils/contentful/contentful_helper"
import {
  headerAccountMouseEntered,
  headerAccountClicked,
  headerNavigationItemClicked,
  headerNavigationItemMouseEntered,
  headerAccountMouseLeft,
  headerMinificationChanged,
  headerNavigationMouseLeft,
  headerNavigationStaticLinkClicked,
} from "highline/redux/actions/header_actions"

const mapStateToProps = (state) => {
  const globalData = state.getIn(["contentful", "globals"])
  const targetPage = state.getIn(["currentPage", "path"])
  const pageData = state.getIn(["contentful", "pages", targetPage])
  const pageContent = getField(pageData, "content")
  const slides = getHomepageSlides(pageContent)
  const currentSlideIndex = state.getIn(["homepage", "currentSlideIndex"])
  const textColorOverride = getField(pageData, "headerTextOverride")
  const isTextLight = textColorOverride === undefined ? isHeroTextLight(slides, currentSlideIndex) : textColorOverride
  const navData = getField(getObjectByFirstField(globalData, "Navigation"), "content")
  const isTransparentOnLoad = getField(pageData, "enableTransparentHeader")

  return {
    activeNav: state.getIn(["navigation", "activeNav"]),
    cartCount: state.getIn(["cart", "totalQuantity"]),
    contentfulDesktopNavItems: getField(getObjectByFirstField(navData, "Desktop Navigation"), "navItems"),
    firstName:  state.getIn(["auth", "firstName"]),
    globalMessageHeight: state.getIn(["tippyTop", "height"]),
    isAccountDropdownOpen: state.getIn(["header", "isAccountDropdownOpen"]),
    isDesktopNavOpen: state.getIn(["header", "isDesktopNavOpen"]),
    isHeaderMinified: state.getIn(["header", "isMinified"]),
    isLoggedIn: state.getIn(["auth", "isLoggedIn"]),
    isTextLight,
    // Pages in addition to "home" may be included in this array to load the transparent header
    isTransparentOnLoad,
    searchTerm: state.getIn(["search", "term"]),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClickCart: () => {
      dispatch(cartOpenClicked())
      dispatch(loadCartAsync())
    },
    onClickAccount: () => {
      dispatch(headerAccountClicked())
    },
    onClickMenuItem: (itemLabel, itemPath) => {
      dispatch(headerNavigationItemClicked(itemLabel, itemPath))
    },
    onMouseEnterMenuItem: (itemLabel) => {
      dispatch(headerNavigationItemMouseEntered(itemLabel))
    },
    onMouseLeaveNavigation: () => {
      dispatch(headerNavigationMouseLeft())
    },
    onMouseEnterAccount: () => {
      dispatch(headerAccountMouseEntered())
    },
    onMouseLeaveAccount: () => {
      dispatch(headerAccountMouseLeft())
    },
    onClickNavigation: () => {
      dispatch(navigationOpenedAsync())
    },
    onToggleSearch: () => {
      dispatch(mobileMenuOpenedFromSearch())
      dispatch(navigationOpenedAsync())
    },
    onClickStaticLink: (link, level, linkName, placement) => {
      dispatch(headerNavigationStaticLinkClicked(link, level, linkName, placement))
    },
    onClickLogout: () => {
      dispatch(logoutAsync())
    },
    onPageScroll: (isMinified) => {
      dispatch(headerMinificationChanged(isMinified))
    },
  }
}

const HeaderV2Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderV2)

export default HeaderV2Container
