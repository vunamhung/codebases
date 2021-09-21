import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import classNames from "classnames"
import { List, Map } from "immutable"
import ProductTile from "highline/components/category/product_tile"
import BundlePromoTile from "highline/components/category/bundle_promo_tile"
import { getProps } from "highline/utils/category_hybrid_props_helper"
import LoadingButton from "highline/components/loading_button"
import { getField } from "highline/utils/contentful/contentful_helper"
import { toPromoTileFields } from "highline/utils/contentful/component_helper"
import styles from "highline/styles/components/category/category_hybrid_layout.module.css"

const CategoryHybridLayout = ({
  bundlePromoTileData,
  isMobile,
  isTablet,
  items,
  itemsDetails,
  handleProductTileClick,
  handlePromoTileClick,
  handleQuickAddClick,
  handleSwatchClick,
  handleSwatchMouseEnter,
  handleSwatchMouseLeave,
  // This removes "name" from { ...other } so we do not override the "name" prop on the Product Tile
  // eslint-disable-next-line no-unused-vars
  name,
  selectedFilters,
  slug,
  hasNextPage,
  loadMore,
  isLoadingMore,
  ...other
}) => {
  let productResults = items.map((itemKey, index) => {
    const lazyLoad = index > 5 // Lazyload after 6 tiles
    const productTileProps = getProps(itemsDetails, itemKey, selectedFilters)

    const isFinalSaleCheck = productTileProps.finalSale || (productTileProps.finalSale === undefined && productTileProps.currentPrice !== productTileProps.fullPrice)
    return (
      <ProductTile
        ctaText="Quick Shop"
        constructorTrackingId={ productTileProps.id }
        isFinalSale={ isFinalSaleCheck }
        isMobile={ isMobile }
        isTablet={ isTablet }
        isTruncateSwatches // Will override Scrolling Swatches from showing up on Mobile and show Truncated swatches instead
        lazyLoad={ lazyLoad }
        key={ `${itemKey}-${index}` }
        showSavedItemCta={ false }
        itemKey={ itemKey }
        onCTAClick={ handleQuickAddClick }
        onProductTileClick={ () => handleProductTileClick(itemKey) }
        onSwatchClick={ handleSwatchClick }
        onSwatchMouseEnter={ handleSwatchMouseEnter }
        onSwatchMouseLeave= { handleSwatchMouseLeave }
        { ...productTileProps }
        { ...other }
      />
    )
  })

  if (bundlePromoTileData){
    bundlePromoTileData.map((promoTile, index) => {
      productResults = productResults.insert((getField(promoTile, "position") - 1),
        <BundlePromoTile key={ `promo-tile-${index}` } slug={ slug } onClick={ handlePromoTileClick } { ...toPromoTileFields(promoTile) } />)
    })
  }

  return (
    <div className={ classNames(
      "component",
      "hybrid-layout-container",
      styles.container,
    ) }>
      <div
        className={ classNames(
          "component",
          "category-hybrid-layout-component",
          styles.component,
        ) }
      >
        { productResults }
      </div>
      { hasNextPage &&
        <div className={ classNames(
          "component",
          "load-more-btn-container",
          styles.buttonContainer,
        ) }>
          <LoadingButton
            aria-label="Show More"
            loading={ isLoadingMore }
            type="submit"
            layout="secondary-outline"
            onClick={ loadMore }
          >
            Show More
          </LoadingButton>
        </div>}
    </div>
  )
}

CategoryHybridLayout.propTypes = {
  bundlePromoTileData: ImmutablePropTypes.list,
  handleProductTileClick: PropTypes.func,
  handlePromoTileClick: PropTypes.func,
  handleQuickAddClick: PropTypes.func,
  handleSwatchClick: PropTypes.func,
  handleSwatchMouseEnter: PropTypes.func,
  handleSwatchMouseLeave: PropTypes.func,
  items: ImmutablePropTypes.list,
  itemsDetails: ImmutablePropTypes.map,
  isMobile: PropTypes.bool,
  isTablet: PropTypes.bool,
  name: PropTypes.string,
  selectedFilters: ImmutablePropTypes.map,
  slug: PropTypes.string,
  hasNextPage: PropTypes.bool,
  loadMore: PropTypes.func,
  isLoadingMore: PropTypes.bool,
}

CategoryHybridLayout.defaultProps = {
  handleProductTileClick: () => {},
  handleQuickAddClick: () => {},
  items: List(),
  itemsDetails: Map(),
  isMobile: false,
  isTablet: false,
  selectedFilters: Map(),
  sharedProductsData: Map(),
}

export default CategoryHybridLayout
