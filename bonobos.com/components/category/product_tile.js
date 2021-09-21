import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { fromJS } from "immutable"
import classNames from "classnames"
import ProductTileImages from "highline/components/product_tile_images"
import ProductTileImage from "highline/components/category/product_tile_image"
import Link from "highline/components/secure_link"
import ProductTileSwatches from "highline/components/category/product_tile_swatches"
import SavedItemCta from "highline/components/saved_item_cta"
import getConfig from "highline/config/application"
import styles from "highline/styles/components/category/product_tile.module.css"

const { disableCategorySavedItemCta } = getConfig()

class ProductTile extends React.Component {
  state = {
    showAlternateProductImage: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      (this.props.selectedSwatchIndex != nextProps.selectedSwatchIndex) ||
      (this.props.link.href != nextProps.link.href) ||
      (this.props.primaryImageUrl != nextProps.primaryImageUrl) ||
      (this.props.isMobile != nextProps.isMobile) ||
      (this.props.isTablet != nextProps.isTablet) ||
      (this.props.saved != nextProps.saved) ||
      (this.props.promoPrice != nextProps.promoPrice) ||
      (this.state.showAlternateProductImage != nextState.showAlternateProductImage)
    )
  }

  handleCTAClicked = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { swatches, onCTAClick, selectedOptions, slug, selectedSwatchIndex } = this.props
    const options = swatches.size > 0
      ? selectedOptions.merge({
        color: swatches.getIn([selectedSwatchIndex, "colorName"]),
      })
      : selectedOptions
    onCTAClick(slug, options)
  }

  handleSavedItemCtaClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const {
      slug,
      selectedOptions,
      saved,
      onSavedItemCtaClick,
    } = this.props

    onSavedItemCtaClick(slug, selectedOptions, saved)
  }

  handleProductTileClick = () => {
    // extracting the click to a local function prevents hard navigation
    this.props.onProductTileClick()
  }

  render() {
    const {
      ariaLabel,
      className,
      constructorTrackingId,
      countDetails,
      ctaText,
      fullPrice,
      isFinalSale,
      saved,
      itemKey,
      inStock,
      isMobile,
      isTablet,
      isTruncateSwatches,
      lazyLoad,
      link,
      name,
      onProductImageHover,
      onSwatchClick,
      onSwatchMouseEnter,
      onSwatchMouseLeave,
      price,
      promoPrice,
      primaryImageUrl,
      priority,
      placeholder,
      recommendationPodId,
      recommendationStrategyId,
      isNewColor,
      isNewProgram,
      secondaryImageUrl,
      showCTA,
      showSavedItemCta,
      showSwatches,
      subtitle,
      swatches,
      selectedSwatchIndex,
      title,
      noveltyBadge,
      urgencyBadge,
    } = this.props
    const {
      showAlternateProductImage,
    } = this.state

    const isOnSale = fullPrice !== price
    const isFinalSaleCheck = isFinalSale || (isFinalSale === undefined && isOnSale)

    return (
      <div
        className={ classNames(
          className,
          "component",
          "product-tile-component",
          styles.component,
        ) }
        data-product-id={ constructorTrackingId }
        data-pod-id={ recommendationPodId }
        data-strategy-id={ recommendationStrategyId }
      >
        <Link href={ link.get("href") } as={ link.get("as") }>
          <a href={ link.get("as") } onClick={ this.handleProductTileClick }
            onFocus={ () => { //Triggers the Quick Shop button to be visible when the product is tabbed over *ADA
              this.setState({ showAlternateProductImage: true })
              onProductImageHover()
            } }
            onKeyDown={ (k) => { //Remove Quick Shop from previously focused items when tabbing backwards between products *ADA
              if (k.shiftKey === true){
                this.setState({ showAlternateProductImage: false })
              }
            } }
          >
            <div
              onMouseOver={ isTablet ? null : () => {
                this.setState({ showAlternateProductImage: true })
                onProductImageHover()
              } }
              onMouseOut={ () => {
                this.setState({ showAlternateProductImage: false })
              } }
              onBlur={ () => {this.setState({ showAlternateProductImage: false })} }
              className={ styles.productTileCard }
            >
              <ProductTileImages
                ariaLabel={ ariaLabel }
                countDetails={ countDetails }
                isFinalSale={ isFinalSaleCheck }
                ctaText={ ctaText }
                savedItemCtaComponent={ showSavedItemCta && !disableCategorySavedItemCta ? (
                  <SavedItemCta
                    isSaved={ saved }
                    onClick={ this.handleSavedItemCtaClick }
                  />
                ) : null }
                imageComponent={
                  <ProductTileImage
                    name={ name }
                    primaryImageUrl={ primaryImageUrl || secondaryImageUrl }
                    secondaryImageUrl={ secondaryImageUrl }
                    showAlternateImage={ showAlternateProductImage }
                    priority={ priority || !lazyLoad }
                    placeholder={ placeholder }
                  />
                }
                inStock={ inStock }
                onCTAClick={ this.handleCTAClicked }
                showCTA={ showCTA }
                showAlternateProductImage={ showAlternateProductImage }
              />
              { (isNewProgram || isNewColor ) && !noveltyBadge &&
                <div className={ classNames(styles.badgeLimited) } >
                  { isNewProgram ? "New" : "New Color" }
                </div>
              }
            </div>

            <div
              className={ classNames(
                styles.productDescription,
              ) }
            >
              <div className={ styles.productContentContainer }>
                <div className={ styles.productInfo }>
                  <div className={ styles.productName }>
                    { name }
                  </div>

                  <div className={ styles.productPriceMobile }>
                    <span className={ isOnSale || promoPrice ? styles.salePrice : styles.regularPrice } >
                      { promoPrice && !isFinalSaleCheck ? promoPrice : price }
                    </span>

                    { (isOnSale || promoPrice) &&
                      <span className={ styles.fullPrice }>
                        { fullPrice }
                      </span>
                    }
                  </div>
                </div>

                <div className={ styles.productPriceDesktop }>
                  <span className={ isOnSale || promoPrice ? styles.salePrice : styles.regularPrice } >
                    { promoPrice && !isFinalSaleCheck ? promoPrice : price }
                  </span>

                  { (isOnSale || promoPrice) &&
                    <span className={ styles.fullPrice }>
                      { fullPrice }
                    </span>
                  }
                </div>
              </div>
            </div>
          </a>
        </Link>
        { title && (
          <div className={ classNames(
            "title",
            styles.title,
          ) }>
            <p>{ title }</p>
          </div>
        ) }
        { subtitle && (
          <div className={ classNames(
            "subtitle",
            styles.subtitle,
          ) }>
            <p>{ subtitle }</p>
          </div>
        ) }
        { showSwatches && (
          <div className={ classNames(styles.swatches, isTruncateSwatches && styles.leftAligned) }>
            <ProductTileSwatches
              isMobile={ isMobile }
              isTruncateSwatches={ isTruncateSwatches }
              link={ link }
              onSwatchClick={ (selectedIndex) => onSwatchClick(itemKey, selectedIndex) }
              onSwatchMouseEnter={ (activatedIndex) => onSwatchMouseEnter(itemKey, activatedIndex) }
              onSwatchMouseLeave={ () => onSwatchMouseLeave(itemKey) }
              selectedSwatchIndex={ selectedSwatchIndex }
              swatches={ swatches }
            />
          </div>
        )}
        {
          urgencyBadge &&
            <div className = { classNames(
              styles.urgencyBadge,
              "urgency-badge",
            ) } >
              { urgencyBadge }
            </div>
        }
        { showCTA && inStock &&
          <button
            aria-label={ ariaLabel }
            className={ styles.ctaButtonMobile }
            onClick={ this.handleCTAClicked }
          >
            + { ctaText }
          </button>
        }
      </div>
    )
  }
}

ProductTile.propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  constructorTrackingId: PropTypes.string,
  countDetails: PropTypes.string,
  ctaText: PropTypes.string,
  title: PropTypes.string,
  fullPrice: PropTypes.string,
  saved: PropTypes.bool,
  itemKey: PropTypes.string,
  inStock: PropTypes.bool,
  isFinalSale: PropTypes.bool,
  isMobile: PropTypes.bool,
  isTablet: PropTypes.bool,
  isTruncateSwatches: PropTypes.bool,
  lazyLoad: PropTypes.bool,
  link: ImmutablePropTypes.map,
  name: PropTypes.string,
  onCTAClick: PropTypes.func,
  onSavedItemCtaClick: PropTypes.func,
  onProductImageHover: PropTypes.func,
  onProductTileClick: PropTypes.func,
  onSwatchClick: PropTypes.func,
  onSwatchMouseEnter: PropTypes.func,
  onSwatchMouseLeave: PropTypes.func,
  price: PropTypes.string,
  promoPrice: PropTypes.string,
  primaryImageUrl: PropTypes.string,
  priority: PropTypes.bool,
  placeholder: PropTypes.string,
  isNewColor: PropTypes.bool,
  isNewProgram: PropTypes.bool,
  recommendationPodId: PropTypes.string,
  recommendationStrategyId: PropTypes.string,
  secondaryImageUrl: PropTypes.string,
  selectedOptions: ImmutablePropTypes.map,
  showCTA: PropTypes.bool,
  showSavedItemCta: PropTypes.bool,
  showSwatches: PropTypes.bool,
  slug: PropTypes.string,
  subtitle: PropTypes.string,
  swatches: ImmutablePropTypes.list,
  selectedSwatchIndex: PropTypes.number,
  noveltyBadge: PropTypes.string,
  urgencyBadge: PropTypes.string,
}

ProductTile.defaultProps = {
  constructorTrackingId: "",
  saved: false,
  inStock: true,
  isMobile: false,
  isTablet: false,
  isTruncateSwatches: false,
  isFinalSale: false,
  lazyLoad: true,
  link: fromJS({}),
  onProductImageHover: () => {},
  onProductTileClick: () => {},
  onSavedItemCtaClick: () => {},
  onSwatchClick: () => {},
  onSwatchMouseEnter: () => {},
  onSwatchMouseLeave: () => {},
  isNewColor: false,
  isNewProgram: false,
  selectedOptions: fromJS({}),
  showCTA: false,
  showSavedItemCta: false,
  showSwatches: false,
  swatches: fromJS([]),
  selectedSwatchIndex: 0,
  itemKey: "defaultKey",
  noveltyBadge: "",
  urgencyBadge: "",
}

export default ProductTile
