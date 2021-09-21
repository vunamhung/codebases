import React, { Fragment }  from "react"
import classNames from "classnames"
import PropTypes from "prop-types"
import CategoryNavigationV2Container from "highline/containers/category_navigation_v2_container"
import { renderContentfulComponent } from "highline/utils/contentful/component_helper"
import { renderTabletNavigationHeader, getContentfulProducts } from "highline/utils/contentful/contentful_helper"
import styles from "highline/styles/components/contentful.module.css"


class ContentfulPage extends React.PureComponent {
  componentDidMount = () => {
    /*
      This is used to check the Contentful page for any product tiles and if they exist acquire the data
      needed to make an API call that would provide the full data in order to render the product tiles
    */
    this.requestDataForProducts()
    this.props.setHeaderTransparency(this.props.enableTransparentHeader)
  }

  componentDidUpdate = (prevProps) => {
    // If we have new content, we need to do a request for product tiles that could have been added
    if (!prevProps.content.equals(this.props.content)) {
      this.requestDataForProducts()
    }
  }

  componentWillUnmount() {
    this.props.setHeaderTransparency(false)
  }

  requestDataForProducts = () => {
    const productTiles = [...document.querySelectorAll(".contentful-product-tile")]
    const products = getContentfulProducts(productTiles)
    this.props.pageLoaded(products)
  }

  renderHeader = (showNav) => {
    return (
      <Fragment>
        { renderTabletNavigationHeader(showNav) }
      </Fragment>
    )
  }

  renderPage () {
    const {
      content,
      filterAndNavOptions,
      pageLayout,
      pageTitle,
      showTitle,
      callbackFn,
    } = this.props
    const showNav = filterAndNavOptions === "SubNav"
    let bodyWidth, layoutStyle
    if (showNav) { bodyWidth = styles.bodyWithNav }
    if (pageLayout === "Box") {
      layoutStyle = styles.boxLayout
    } else if (showNav) {
      layoutStyle = styles.fullWidthWithNav
    } else {
      layoutStyle = styles.fullWidth
    }

    return (
      <div className={ styles.contentfulPage }>
        <div className={ classNames(layoutStyle) }>
          { showTitle && <h1 className={ styles.pageTitle }> { pageTitle }</h1> }
          { showNav && this.renderHeader(showNav) }
        </div>
        <div className={ classNames(styles.body, layoutStyle) }>
          { showNav && <CategoryNavigationV2Container /> }
          <div className={ bodyWidth }>
            {
              content.map(
                (component, index) => renderContentfulComponent(component, callbackFn, index))
            }
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div
        className={
          classNames(
            "component",
            "contentful-component",
          )
        }
      >
        { this.renderPage() }
      </div>
    )
  }
}

ContentfulPage.propTypes = {
  callbackFn: PropTypes.func,
  content: PropTypes.object,
  enableTransparentHeader: PropTypes.bool,
  filterAndNavOptions: PropTypes.string,
  pageLayout: PropTypes.string,
  pageLoaded: PropTypes.func,
  pageTitle: PropTypes.string,
  setHeaderTransparency: PropTypes.func,
  showTitle: PropTypes.bool,
}

ContentfulPage.defaultProps = {
  callbackFn: () => {},
  setHeaderTransparency: () => {},
}

export default ContentfulPage
