import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import classNames from "classnames"
import Link from "highline/components/secure_link"
import SearchContainer from "highline/containers/search_container"
import DesktopNavigationContainer from "highline/containers/desktop_navigation_container"
import Logo from "highline/svg/icons/bonobos-logo-dark.svg"
import AccountContent from "highline/components/application/account_content"
import HeaderV2MenuItem from  "highline/components/application/header_v2_menu_item"
import { detectTabletWidth, getScrollTop, detectLargeDesktopWidth } from "highline/utils/viewport"
import debounce from "lodash.debounce"
import { ImmutableLoadingBar as LoadingBar } from "react-redux-loading-bar"
import { CartIcon, HamburgerIcon, SearchIcon } from "highline/components/icons"
import { getField } from "highline/utils/contentful/contentful_helper"
import { environmentVariables as cssEnvVars } from "highline/css-env-variables"

import styles from "highline/styles/components/application/header_v2.module.css"

export const REFER_FRIEND_LINK_TEXT = "Get 25% Off"

const NAV_OPEN_DELAY = 250
const NAV_DISPLAY_DELAY = 100
const RESIZE_DEBOUNCE_TIMEOUT = 200
const LOADING_BAR_MAX_PROGRESS = 95

class HeaderV2 extends React.PureComponent {
  static propTypes = {
    activeNav: PropTypes.string,
    cartCount: PropTypes.number,
    firstName: PropTypes.string,
    globalMessageHeight: PropTypes.number,
    isLoggedIn: PropTypes.bool,
    isAccountDropdownOpen: PropTypes.bool,
    isDesktopNavOpen: PropTypes.bool,
    isHeaderMinified: PropTypes.bool,
    isTextLight: PropTypes.bool,
    isTransparentOnLoad: PropTypes.bool,
    contentfulDesktopNavItems: ImmutablePropTypes.list,
    onMouseEnterAccount: PropTypes.func,
    onClickAccount: PropTypes.func,
    onClickCart: PropTypes.func,
    onClickMenuItem: PropTypes.func,
    onClickLogout: PropTypes.func,
    onMouseEnterMenuItem: PropTypes.func,
    onMouseLeaveNavigation: PropTypes.func,
    onMouseLeaveAccount: PropTypes.func,
    onClickNavigation: PropTypes.func,
    onToggleSearch: PropTypes.func,
    onClickStaticLink: PropTypes.func,
    onPageScroll: PropTypes.func,
    searchTerm: PropTypes.string,
  }

  static defaultProps = {
    activeNav: "",
    cartCount: 0,
    firstName: "",
    globalMessageHeight: 0,
    isAccountDropdownOpen: false,
    isDesktopNavOpen: false,
    isHeaderMinified: false,
    isLoggedIn: false,
    onMouseEnterAccount: () => {},
    onClickAccount: () => {},
    onClickCart: () => {},
    onClickMenuItem: () => {},
    onClickLogout: () => {},
    onMouseLeaveAccount: () => {},
    onMouseLeaveNavigation: () => {},
    onClickNavigation: () => {},
    onToggleSearch: () => {},
    onClickStaticLink: () => {},
    onPageScroll: () => {},
  }

  state = {
    headerBreakpoint: 60,
    isDesktopWidth: true,
    isHovered: false,
    isTablet: true,
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize)
    window.addEventListener("scroll", this.handleScroll)

    this.setState({
      headerBreakpoint: cssEnvVars["--desktopMinifiedHeaderBreakpoint"],
      isDesktopWidth: detectLargeDesktopWidth(),
      isTablet: detectTabletWidth(),
    })
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
    window.removeEventListener("scroll", this.handleScroll)
  }

  handleResize = () => {
    debounce(() => {
      this.setState({
        isDesktopWidth: detectLargeDesktopWidth(),
        isTablet: detectTabletWidth(),
      })
    }, RESIZE_DEBOUNCE_TIMEOUT)()
  }

  handleScroll = () => {
    const { globalMessageHeight, isHeaderMinified, onPageScroll } = this.props
    const { isTablet, headerBreakpoint } = this.state

    const isMinified = !isTablet && getScrollTop() > headerBreakpoint + globalMessageHeight
    if (isMinified != isHeaderMinified) {
      onPageScroll(isMinified)
    }

    const offset = getScrollTop()
    const isBelowHeaderBreakpoint = offset > 150
    const isScrollingDown = offset > this.state.offset
    const showSearchHeader = this.state.isTablet && isBelowHeaderBreakpoint && isScrollingDown
    this.setState({
      offset,
      showSearchHeader,
    })
  }

  handleMouseEnterOrLeave = (isHovered) => {
    this.setState({ isHovered })
  }

  render() {
    const {
      activeNav,
      cartCount,
      firstName,
      globalMessageHeight,
      isAccountDropdownOpen,
      isDesktopNavOpen,
      isHeaderMinified,
      isLoggedIn,
      isTextLight,
      isTransparentOnLoad,
      contentfulDesktopNavItems,
      onMouseEnterAccount,
      onClickAccount,
      onClickCart,
      onClickMenuItem,
      onClickNavigation,
      onClickLogout,
      onMouseEnterMenuItem,
      onMouseLeaveAccount,
      onMouseLeaveNavigation,
      onToggleSearch,
      onClickStaticLink,
      searchTerm,
    } = this.props

    const { isHovered, isTablet, isDesktopWidth } = this.state
    const displayTransparent = !isHeaderMinified && !isHovered && isTransparentOnLoad && !searchTerm

    // if scrolling down show search message, otherwise show Bonobos logo
    const titleContent = this.state.showSearchHeader
      ? <div className={ styles.logoIcon }>
        <div aria-label="Homepage" onClick={ onToggleSearch }>Search Bonobos...</div>
      </div>
      : <Link href="/">
        <a aria-label="Homepage" href="/"
          onClick={ () => onClickStaticLink("/", "0", "Home", "top nav") }>
          <div className={ styles.logoIcon }>
            <Logo />
          </div>
        </a>
      </Link>

    return (
      <div className={ classNames(
        "header-component",
        styles.component,
        (isTablet || isHeaderMinified) && styles.sticky,
        isHeaderMinified && styles.minified,
        !isTablet && [
          isTransparentOnLoad ? styles.transparentOnLoad : styles.solidOnLoad,
          (!isTransparentOnLoad || isHovered || searchTerm) && styles.whiteBackground,
          displayTransparent && isTextLight && styles.light,
        ],
      ) }
      // Bump the header down if the global message is visible
      style={ !isHeaderMinified && isTransparentOnLoad && !isTablet && { top: `${globalMessageHeight}px` } || null }
      onMouseEnter={
        () => this.handleMouseEnterOrLeave(true)
      }
      onMouseLeave={
        () => this.handleMouseEnterOrLeave(false)
      }>
        <div
          className={ classNames(
            styles.curtain,
            isDesktopNavOpen ? styles.open : styles.closed,
          ) }
        />
        <a className={ styles.skip } href="#main-content">Skip to Main Content</a>
        <a className={ styles.skip } href="#footer">Skip to Footer</a>
        <a className={ styles.skip } href="/sitemap">Navigate to Sitemap</a>
        <a className={ styles.skip } href="/accessibility">Accessibility Features</a>
        <header>
          <div className={ styles.topPortion }>
            <div className={ styles.navButtonContainer }>
              <div className={ styles.navButtonContainerWrapper }>
                <button
                  aria-label="Open Navigation"
                  className={ styles.navButton }
                  onClick={ onClickNavigation }
                >
                  <HamburgerIcon />
                </button>
                <button
                  aria-label="Toggle Search"
                  className={ styles.mobileSearchIconWrapper }
                  onClick={ onToggleSearch }
                >
                  <SearchIcon  key="search-nav-icon" className={ styles.searchIcon } />
                </button>
              </div>
            </div>

            { !isHeaderMinified &&
              <Link href="/guideshop">
                <a
                  className={ styles.guideshopContainer }
                  href="/guideshop"
                  onClick={ () => onClickStaticLink("/guideshop", "0", "Visit Us", "top nav") }
                >
                  <div className={ styles.staticPageLink }>
                    Find a Location
                  </div>
                </a>
              </Link>
            }

            <div className={ styles.logoContainer }>
              { titleContent }
            </div>

            <div className={ styles.accountContainer }>
              <div className={ styles.accountContainerWrapper }>
                { (isDesktopWidth || !isTablet && !isHeaderMinified) && <div className={
                  classNames(styles.searchContainer,
                    "stickyAutosuggest",
                  ) }>
                  <SearchContainer />
                </div> }

                { !isHeaderMinified && <Link href="/refer-a-friend">
                  <a
                    href="/refer-a-friend"
                    className={ styles.staticPageLink }
                    onClick={ () => onClickStaticLink("/refer-a-friend", "0", REFER_FRIEND_LINK_TEXT, "top nav") }
                  >
                    { REFER_FRIEND_LINK_TEXT }
                  </a>
                </Link> }

                <AccountContent
                  firstName={ firstName }
                  isLoggedIn={ isLoggedIn }
                  isAccountDropdownOpen={ isAccountDropdownOpen }
                  onClickLogout={ onClickLogout }
                  onMouseEnterAccount={ onMouseEnterAccount }
                  onMouseLeaveAccount={ onMouseLeaveAccount }
                  onClickAccount={ onClickAccount }
                  isTablet={ isTablet }
                />

                <button
                  aria-label="Open Your Shopping Cart"
                  className={ styles.cartBtn }
                  onClick={ onClickCart }
                >
                  <div className={ styles.cartIcon }>
                    <CartIcon />
                    { !!cartCount &&
                      <span
                        aria-label={ `${ cartCount } Items in Your Cart` }
                        className={ styles.cartQtyNumber }
                      >
                        { cartCount }
                      </span>
                    }
                  </div>
                </button>
              </div>
            </div>
          </div>
          { !isTablet && contentfulDesktopNavItems &&
            <div className={ classNames([styles.navigationContainer]) }>
              <div
                className={ classNames(
                  styles.navigationWrapper,
                ) }
                onMouseLeave={ onMouseLeaveNavigation }
              >
                { contentfulDesktopNavItems &&
                  contentfulDesktopNavItems.map((navItem, index) => (
                    <HeaderV2MenuItem
                      active={ activeNav === getField(navItem, "title") }
                      displayText={ getField(navItem, "displayText") }
                      key={ `L0-navItem-${ index }` }
                      onClick={ () => onClickMenuItem(getField(navItem, "title"), getField(navItem, "path")) }
                      onMouseEnter={
                        () => this.navTimer = setTimeout(() => {
                          onMouseEnterMenuItem(getField(navItem, "title"))
                        }, activeNav ? NAV_DISPLAY_DELAY : NAV_OPEN_DELAY)
                      }
                      onMouseLeave={ () => clearTimeout(this.navTimer) }
                      path={ getField(navItem, "path") }
                      title={ getField(navItem, "title") }
                    />
                  ) ) }
                <div
                  className={ classNames(
                    styles.desktopNavigationContainer,
                    activeNav !== "" ? styles.open : null,
                  ) }
                >
                  {isDesktopNavOpen &&
                    <DesktopNavigationContainer />
                  }
                </div>
              </div>
            </div>
          }
          { isTablet &&
          <div className={ styles.loadingBg }>
            <LoadingBar maxProgress={ LOADING_BAR_MAX_PROGRESS } className={ styles.loadingBar } showFastActions />
          </div>
          }
        </header>
      </div>
    )
  }
}

export default HeaderV2
