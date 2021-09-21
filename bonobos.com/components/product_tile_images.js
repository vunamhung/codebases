import React from "react"
import PropTypes from "prop-types"
import Button from "highline/components/button"
import AlertTag from "highline/components/alert_tag"
import classNames from "classnames"
import styles from "highline/styles/components/product_tile_images.module.css"

const ProductTileImages = ({
  ariaLabel,
  badge,
  countDetails,
  ctaText,
  savedItemCtaComponent,
  imageComponent,
  inStock,
  onCTAClick,
  showCTA,
  showAlternateProductImage,
}) => (
  <div className={ classNames([
    styles.imageWrapper,
    showAlternateProductImage ? styles.showQuickShop : styles.hideQuickShop,
  ]) }>
    { showCTA && inStock &&
      <Button
        ariaLabel={ ariaLabel }
        className={ styles.ctaButton }
        layout="alternate"
        align="inline"
        onClick={ onCTAClick }
      >
        { ctaText }
      </Button>
    }

    { !inStock &&
      <AlertTag
        className={ styles.soldOut }
        layout="adaptive"
      >
        Out Of Stock
      </AlertTag>
    }
    { imageComponent }

    { savedItemCtaComponent && savedItemCtaComponent }

    { countDetails &&
      <span className={ styles.countDetails } >{countDetails}</span>
    }

    { badge }
  </div>
)

ProductTileImages.propTypes = {
  ariaLabel: PropTypes.string,
  badge: PropTypes.node,
  countDetails: PropTypes.string,
  ctaText: PropTypes.string,
  savedItemCtaComponent: PropTypes.node,
  imageComponent: PropTypes.node,
  inStock: PropTypes.bool,
  onCTAClick: PropTypes.func,
  showCTA: PropTypes.bool,
  showAlternateProductImage: PropTypes.bool,
}

ProductTileImages.defaultProps = {
  badge: null,
  inStock: true,
  onCTAClick: () => {},
  showCTA: false,
  showAlternateProductImage: false,
}

export default ProductTileImages
