import React, { Fragment } from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import classNames from "classnames"
import DesktopNavigation from "highline/components/application/desktop_navigation"
import { getImgixUrl, getField } from "highline/utils/contentful/contentful_helper"

import styles from "highline/styles/components/application/desktop_navigation_collection.module.css"

const DesktopNavigationCollection = ({
  activeNav,
  contentfulDesktopNavItems,
  onClickNavItem,
  onClickNavImageCta,
  onClickNavImageCtaTitle,
}) => {
  return (
    <Fragment>
      { contentfulDesktopNavItems &&
        contentfulDesktopNavItems.map((navItem, index) => {
          const navItemName = getField(navItem, "displayText") || getField(navItem, "title")
          const isActiveNav = activeNav === getField(navItem, "title")

          return (
            <div
              className={ classNames(
                styles.desktopNav,
                isActiveNav ? styles.active : null,
              ) }
              key={ `${navItemName}-DesktopNav-${index}` }
            >
              <DesktopNavigation
                categoryName= { activeNav }
                navImageUrl={ getImgixUrl(getField(navItem, "imageUrl")) }
                navImages={ getField(navItem, "images") }
                navItemAltText={ `Navigate to ${navItemName}` }
                navPath={ getField(navItem, "path") }
                navColumns={ getField(navItem, "columns") }
                onClickNavItem={ onClickNavItem }
                onClickNavImageCta={ onClickNavImageCta }
                onClickNavImageCtaTitle={ onClickNavImageCtaTitle }
              />
            </div>
          )
        })
      }
    </Fragment>
  )
}

DesktopNavigationCollection.propTypes = {
  activeNav: PropTypes.string,
  contentfulDesktopNavItems: ImmutablePropTypes.list,
  onClickNavItem: PropTypes.func,
  onClickNavImageCta: PropTypes.func,
  onClickNavImageCtaTitle: PropTypes.func,
}

DesktopNavigationCollection.defaultProps = {
  onClickNavItem: () => {},
}

export default DesktopNavigationCollection
