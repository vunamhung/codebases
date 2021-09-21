import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { fromJS, Map } from "immutable"
import classNames from "classnames"
import ImageCta from "highline/components/image_cta"
import { getClientSideLink } from "highline/utils/link"
import Link from "highline/components/secure_link"
import { getImgixUrl, getField, getContentfulId } from "highline/utils/contentful/contentful_helper"

import styles from "highline/styles/components/application/desktop_navigation.module.css"

const DesktopNavigation = ({
  categoryName,
  navImages,
  navColumns,
  navPath,
  onClickNavItem,
  onMouseEnterNavItem,
  onClickNavImageCta,
  onClickNavImageCtaTitle,
}) => {
  return (
    <div
      className={ classNames(
        "component",
        "desktop-navigation-component",
        styles.component,
      ) }
    >
      { navColumns &&
        navColumns.map((navColumn, index) => {
          const columnName = getField(navColumn, "displayText")
          const subNavItems = getField(navColumn, "subNavItems")
          const columnLink = getField(navColumn, "columnHyperlink") ? getClientSideLink(getField(navColumn, "columnHyperlink")) : null
          return (
            <div className="navColumn" key={ `${columnName || "columnHeader"}-${index}` }>
              { columnName && columnLink &&
                <Link
                  as={ columnLink.get("as") }
                  href={ columnLink.get("href") }
                >
                  <a
                    href={ columnLink.get("as") }
                  >
                    <h3 className={ classNames(styles.columnHeader, styles.linkText ) }>{ columnName }</h3>
                  </a>
                </Link>
              }
              { columnName && !columnLink &&
                <h3 className={ styles.columnHeader }>{ columnName }</h3>
              }
              <div className={ classNames(styles.textWrapper) }>
                { subNavItems &&
                  subNavItems.map((subNavItem, index) => {
                    const navHeadingLink = getClientSideLink(getField(subNavItem, "path"))
                    const navHeadingLabel = getField(subNavItem, "label") || getField(subNavItem, "title")
                    const navHeadingImageUrl = getField(subNavItem, "imageUrl")
                    const navBadge = getField(subNavItem, "badge")
                    if (!navHeadingLabel){
                      return null
                    }

                    return (
                      <div
                        className={ styles.navWrapper }
                        key={ `L1-${columnName}-${index}-${navHeadingLabel}` }
                      >
                        <Link
                          as={ navHeadingLink.get("as") }
                          href={ navHeadingLink.get("href") }
                        >
                          <a
                            onClick={ () => onClickNavItem(navHeadingLink, navHeadingLabel) }
                            onMouseEnter={ () => onMouseEnterNavItem(navHeadingImageUrl, navHeadingLabel, navHeadingLink) }
                            href={ navHeadingLink.get("as") }
                          >{ navHeadingLabel }
                            { navBadge && <div className={ styles.navBadge }>{ navBadge }</div> }
                          </a>
                        </Link>
                      </div>
                    )
                  },
                  ) }
              </div>
            </div>
          )
        })
      }
      <div className={ classNames("image-area", styles.imageArea) }>
        {
          navImages &&
          navImages.map((navImage, index) => {
            if (!getField(navImage, "altText")){
              return null
            }
            const link = getClientSideLink(getField(navImage, "targetUrl") || navPath)
            const title = getField(navImage, "title")
            const entryId = getContentfulId(navImage)
            const metadata = Map({ categoryName, title, entryId })
            const textExtended = getField(navImage, "textExtended")
            return (
              <div className={ styles.imageCtaWrapper } key={ `Nav-image-${ index }` }>
                <ImageCta
                  imageUrl={ getImgixUrl(getField(navImage, "image")) }
                  link={ link }
                  layout="large"
                  height={ 350 }
                  altText={ getField(navImage, "altText") }
                  text={ `Shop all ${categoryName}` }
                  onClickCTA={ onClickNavImageCta }
                  metadata={ metadata }
                />
                { //First text line under image
                  textExtended && textExtended.get(0) &&
                  <Link
                    as={ link.get("as") }
                    href={ link.get("href") }
                  >
                    <a
                      className={ styles.imageTextFirst }
                      href={ link.get("as") }
                      onClick={ () => onClickNavImageCtaTitle(link, textExtended.get(0), metadata) }
                    >
                      { textExtended.get(0) }
                    </a>
                  </Link>
                }
                <div>
                  { //Second text line under image
                    textExtended && textExtended.get(1) &&
                    <Link
                      as={ link.get("as") }
                      href={ link.get("href") }
                    >
                      <a
                        className={ styles.imageTextSecond }
                        href={ link.get("as") }
                        onClick={ () => onClickNavImageCtaTitle(link, textExtended.get(1), metadata) }
                      >
                        { textExtended.get(1) }
                      </a>
                    </Link>
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

DesktopNavigation.propTypes = {
  categoryName: PropTypes.string,
  navColumns: ImmutablePropTypes.list,
  navImages: PropTypes.object,
  navPath: PropTypes.string,
  onClickImage: PropTypes.func,
  onClickNavItem: PropTypes.func,
  onClickNavImageCta: PropTypes.func,
  onClickNavImageCtaTitle: PropTypes.func,
  onMouseEnterNavItem: PropTypes.func,
}

DesktopNavigation.defaultProps = {
  navImages: [],
  navItems: fromJS([]),
  onClickNavItem: () => {},
  onClickNavImageCta: () => {},
  onClickNavImageCtaTitle: () => {},
  onMouseEnterNavItem: () => {},
}

export default DesktopNavigation
