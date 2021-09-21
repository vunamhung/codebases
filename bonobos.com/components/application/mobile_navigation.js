import React, { Fragment } from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { fromJS } from "immutable"
import classNames from "classnames"
import List from "highline/components/list"
import Imgix from "highline/components/imgix"
import { getClientSideLink } from "highline/utils/link"
import { paths } from "highline/utils/navigate"
import { ChevronIcons } from "highline/components/icons"
import Link from "highline/components/secure_link"
import { REFER_FRIEND_LINK_TEXT } from "highline/components/application/header_v2"

import styles from "highline/styles/components/application/mobile_navigation.module.css"

const LinkItem = ({
  isParent,
  label,
  link,
  onClick,
  children,
  isMobileNavOpen,
}) => (
  <Fragment>
    { isParent &&
        <button
          aria-label={ `Open ${label} Category View` }
          className= { styles.navButton }
          onClick={ () => onClick(label, link) }
          tabIndex={ isMobileNavOpen ? 0 : -1 }
        >
          { children }
          <span>
            { label }
          </span>
          <ChevronIcons.Right />
        </button>
    }
    { !isParent &&
      <Link
        as={ link.get("as") }
        href={ link.get("href") }
      >
        <div
          aria-label={ `Open ${label}` }
          className={ styles.navButton }
          onClick={ () => onClick(label, link) }
          tabIndex={ isMobileNavOpen ? 0 : -1 }
        >
          <a href={ link.get("as") }>
            { label }
          </a>
        </div>
      </Link>
    }
  </Fragment>
)

class MobileNavigation extends React.PureComponent {
  generateAnchor = (href, text, handleClick = () => {}) => {
    const { isMobileNavOpen } = this.props
    return (
      <a
        href={ href }
        onClick={ (e) => handleClick(e, text, href, 1) }
        tabIndex={ isMobileNavOpen ? 0 : -1 }
      >
        { text }
      </a>
    )
  }

  generateNavItem = (label, path, isParent = false, imageUrl = null) => {
    const link = isParent ? path : getClientSideLink(path)
    const onClick = isParent ? this.props.onClickParentTile : this.props.onClickSubNavTile
    const { isMobileNavOpen } = this.props

    return (
      <LinkItem
        isParent={ isParent }
        key={ label }
        label={ label }
        link={ link }
        onClick={ onClick }
        isMobileNavOpen={ isMobileNavOpen }
      >
        { imageUrl && isMobileNavOpen &&
          <div className={ styles.imgWrapper }>
            <Imgix
              src={ imageUrl }
              htmlAttributes={ {
                alt: label,
                "aria-label": label,
              } }
              width={ 50 }
            />
          </div>
        }
      </LinkItem>
    )
  }

  renderRootView = () => {
    const {
      isLoggedIn,
      handleLogOut,
      handleClick,
      rootItems,
    } = this.props

    return (
      <div className={ styles.rootWrapper }>
        <List>
          { rootItems.map((item) => (
            item.get("isVisibleMobile") && this.generateNavItem(item.get("label"), item.get("path"), true, item.get("imageUrl"))
          )) }

          <div>{ this.generateAnchor(paths.get("guideshop"), "Visit Us") }</div>
          <div>{ this.generateAnchor(paths.get("referAFriend"), REFER_FRIEND_LINK_TEXT) }</div>
          <div className={ styles.menuPaddingTop }>{ this.generateAnchor(paths.get("about"), "About") }</div>
          <div>{ this.generateAnchor(paths.get("contactUs"), "Contact Us") }</div>
          <div>{ this.generateAnchor(paths.get("app"), "Bonobos App") }</div>
          <div className={ styles.menuPaddingTop }>{ this.generateAnchor(paths.get("returns"), "Returns") }</div>
          <div>{ this.generateAnchor(paths.get("help"), "Help") }</div>
          <div>
            { isLoggedIn
              ? this.generateAnchor(paths.get("signOut"), "Sign Out", handleLogOut)
              : this.generateAnchor(paths.get("signIn"), "Sign In", handleClick)
            }
          </div>
        </List>
      </div>
    )
  }

  renderSubNavView = () => {
    const {
      activeNav,
      activePath,
      shouldCollapse,
      subNavItems,
    } = this.props

    return (
      <div className={ shouldCollapse ? styles.collapsed : null }>

        { this.generateNavItem("View All " + activeNav, activePath) }

        { subNavItems.map((subNavItem) => {
          const isParent = !subNavItem.get("children").isEmpty()
          const isVisibleMobile = subNavItem.get("isVisibleMobile")

          return isVisibleMobile && this.generateNavItem(subNavItem.get("label"), subNavItem.get("path"), isParent)
        }) }

      </div>
    )
  }

  render() {
    const { view } = this.props

    return (
      <div
        className={ classNames(
          "component",
          "mobile-navigation-component",
          styles.component,
        ) }
      >
        { view === "root" &&
          this.renderRootView()
        }
        { view === "subNav" &&
          this.renderSubNavView()
        }
      </div>
    )
  }
}

MobileNavigation.propTypes = {
  activeNav: PropTypes.string,
  activePath: PropTypes.string,
  handleClick: PropTypes.func,
  handleLogOut: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  isMobileNavOpen: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClickParentTile: PropTypes.func,
  onClickSubNavTile: PropTypes.func,
  onToggleSearch: PropTypes.func,
  rootItems: ImmutablePropTypes.list,
  shouldCollapse: PropTypes.bool,
  subNavItems: ImmutablePropTypes.list,
  view: PropTypes.oneOf(["root", "subNav"]),
}

MobileNavigation.defaultProps = {
  handleClick: () => {},
  handleLogOut: () => {},
  isLoggedIn: false,
  isMobileNavOpen: false,
  isOpen: false,
  onClickParentTile: () => {},
  onClickSubNavTile: () => {},
  onToggleSearch: () => {},
  rootItems: fromJS([]),
  shouldCollapse: false,
  subNavItems: fromJS([]),
  view: "root",
}

export default MobileNavigation
