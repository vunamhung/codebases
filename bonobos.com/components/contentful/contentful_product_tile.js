import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import classNames from "classnames"
import { Map } from "immutable"
import ProductTile from "highline/components/category/product_tile"
import { detectSmartphoneWidth, detectTabletWidth } from "highline/utils/viewport"
import debounce from "lodash.debounce"
import { getDynamicProps } from "highline/utils/category_hybrid_props_helper"
import styles from "highline/styles/components/contentful_product_tile.module.css"

const RESIZE_DEBOUNCE_TIMEOUT = 200

class ContentfulProductTile extends React.PureComponent {
  state = { isMobile: true, isTablet: false }

  componentDidMount = () => {
    window.addEventListener("resize", this.handleResize)
    this.setState({
      isMobile: detectSmartphoneWidth(),
      isTablet: detectTabletWidth(),
    })
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
  }

  handleResize = () => {
    debounce(() => {
      this.setState({
        isSmartphone: detectSmartphoneWidth(),
        isTablet: detectTabletWidth(),
      })
    }, RESIZE_DEBOUNCE_TIMEOUT)()
  }

  renderProductTile()  {
    const {
      isMobile,
      isTablet,
    } = this.state
    const {
      color,
      contentfulId,
      handleProductTileClick,
      handleQuickAddClick,
      handleSwatchClick,
      handleSwatchMouseEnter,
      handleSwatchMouseLeave,
      itemsDetails,
      primaryImageOverride,
      secondaryImageOverride,
      sku,
      shouldShowSwatches,
      placeholder,
      priority,
    } = this.props

    const productKey = `${sku}-${color}`
    const itemDetail = itemsDetails.get(productKey)
    const id = itemDetail.get("id")
    const slug = itemDetail.get("programSlug")
    const itemName = itemDetail.get("name")
    const selectedFilters = Map() // When filters are added to Contentful page this will need to be updated
    const isGiftCard = itemDetail.get("isGiftCard")
    const isBundle = itemDetail.get("isBundle")
    const swatches = itemDetail.get("swatches")
    const hoveredIndex = itemDetail.get("activatedSwatchIndex")
    const selectedIndex = itemDetail.get("selectedSwatchIndex")
    let selectedSwatchIndex = 0
    if (hoveredIndex != null) {
      selectedSwatchIndex = hoveredIndex
    } else {
      selectedSwatchIndex = selectedIndex
    }

    const numberOfFits = itemDetail.get("numberOfFits")
    const countDetails = numberOfFits > 1 ? `${numberOfFits} Fits` : ""
    const swatch = swatches.get(selectedSwatchIndex)
    const {
      fullPrice,
      price,
      primaryImageUrl,
      secondaryImageUrl,
      link,
      selectedOptions,
      ariaLabel,
      title,
    } = getDynamicProps(swatch ? swatch : itemDetail, slug, selectedFilters, isBundle, isGiftCard, itemName)

    /*
     * The following flags determine if swatches are shown in the product tile or not.
     * shouldShowSwatches is chosen by a contentful editor. If its a bundle or has an override image swatches are not shown.
     * If swatches don't exit or if there is only 1 swatch, they aren't shown
    */
    const showSwatches = shouldShowSwatches && !isBundle && !primaryImageOverride && swatches && swatches.size > 1

    let primaryImage = primaryImageUrl
    let secondaryImage = secondaryImageUrl
    if (primaryImageOverride) {
      primaryImage = primaryImageOverride
      secondaryImage = secondaryImageOverride || null
    }

    return (
      <ProductTile
        className={ classNames(styles.productTile) }
        countDetails={ countDetails }
        ctaText="Quick Shop"
        isMobile={ isMobile }
        isTablet={ isTablet }
        isTruncateSwatches // Will override Scrolling Swatches from showing up on Mobile and show Truncated swatches instead
        subtitle={ itemDetail.get("description") }
        name={ itemName }
        showCTA={ !isBundle && !isGiftCard }
        showSavedItemCta={ false }
        showSwatches={ showSwatches }
        slug={ slug }
        itemKey={ id }
        onCTAClick={ handleQuickAddClick }
        onProductTileClick={ () => {
          handleProductTileClick(
            slug,
            contentfulId,
          )
        } }
        onSwatchClick={ handleSwatchClick }
        onSwatchMouseEnter={ handleSwatchMouseEnter }
        onSwatchMouseLeave= { handleSwatchMouseLeave }
        swatches={ swatches }
        priority={ priority }
        placeholder={ placeholder }
        // props below will change based on selected swatch index
        selectedSwatchIndex={ selectedSwatchIndex }
        fullPrice={ `$${fullPrice}` }
        price={ `$${price}` }
        primaryImageUrl={ primaryImage }
        secondaryImageUrl={ secondaryImage }
        link={ link }
        selectedOptions={ selectedOptions }
        ariaLabel={ ariaLabel }
        title={ title }
      />
    )
  }

  render() {
    const {
      color,
      itemsDetails,
      sku,
    } = this.props

    const productKey = `${sku}-${color}`

    return (
      <div
        className={
          classNames(
            "component",
            "contentful-component",
            "contentful-product-tile",
            styles.contentfulComponent,
          )
        }
        data-sku={ sku }
        data-color={ color }
      >
        {
          itemsDetails.get(productKey) &&
          this.renderProductTile()
        }
      </div>
    )
  }
}

ContentfulProductTile.propTypes = {
  color: PropTypes.string,
  contentfulId: PropTypes.string,
  handleProductTileClick: PropTypes.func,
  handleQuickAddClick: PropTypes.func,
  handleSwatchClick: PropTypes.func,
  handleSwatchMouseEnter: PropTypes.func,
  handleSwatchMouseLeave: PropTypes.func,
  itemsDetails: ImmutablePropTypes.map,
  primaryImageOverride: PropTypes.string,
  secondaryImageOverride: PropTypes.string,
  sharedProductsData: ImmutablePropTypes.map,
  shouldShowSwatches: PropTypes.bool,
  sku: PropTypes.string,
  tileLoaded: PropTypes.func,
  placeholder: PropTypes.string,
  priority: PropTypes.bool,
}

export default ContentfulProductTile
