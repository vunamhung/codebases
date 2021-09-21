import React, { Fragment } from "react"
import PropTypes from "prop-types"
import LazyLoad from "highline/components/lazy_load"
import classNames from "classnames"
import Imgix from "highline/components/imgix"
import Link from "highline/components/secure_link"
import { getClientSideLink } from "highline/utils/link"
import { PRODUCT_TILE_STANDARD_IMAGE_WIDTH } from "highline/utils/image_width_helper"

// BundlePromoTile has same style as ProductTile but with extremely pared-down functionality
import styles from "highline/styles/components/category/bundle_promo_tile.module.css"

const BundlePromoTile = ({
  description,
  image,
  imageAlt,
  link,
  markdownPrice,
  onClick,
  position,
  price,
  slug,
  title,
}) => {
  if (!image) {
    return null
  }

  const promoTileLink = getClientSideLink(link)

  const promoTile =
    <Fragment>
      <Imgix
        htmlAttributes={ { alt: imageAlt } }
        src={ image }
        width={ PRODUCT_TILE_STANDARD_IMAGE_WIDTH }
      />
      <div className={ styles.productDescription }>
        <div className={ styles.productContentContainer }>
          <div className={ styles.productInfo }>
            <div className={ styles.productName }>
              { title }
            </div>
          </div>
          <div className={ styles.productPriceDesktop }>
            <span className={ styles.salePrice } >
              { markdownPrice }
            </span>
            <span className={ markdownPrice && styles.fullPrice }>
              { price }
            </span>
          </div>
        </div>
      </div>
      <div className={ styles.subtitle }>
        <p>{ description }</p>
      </div>
    </Fragment>

  return (
    <div className={ classNames(
      "component",
      "bundle-promo-tile-component",
      styles.component,
    ) }>
      { link &&
         <LazyLoad offset={ 100 }>
           <Link as={ promoTileLink.get("as") } href={ promoTileLink.get("href") }>
             <a href={ promoTileLink.get("as") } onClick={ () => onClick(title, position, slug) }>
               { promoTile }
             </a>
           </Link>
         </LazyLoad>
      }
      { !link && promoTile }
    </div>
  )
}

BundlePromoTile.propTypes = {
  description: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  link: PropTypes.string,
  markdownPrice: PropTypes.string,
  onClick: () => {},
  position: PropTypes.number,
  price: PropTypes.string,
  slug: PropTypes.string,
  title: PropTypes.string,
}

export default BundlePromoTile
