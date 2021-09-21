import React from "react"
import PropTypes from "prop-types"
import NextImages from "highline/components/next_images"
import { environmentVariables as cssEnvVars } from "highline/css-env-variables"
import { smartphoneBreakpoint } from "highline/utils/breakpoints"
import { PRODUCT_TILE_STANDARD_IMAGE_WIDTH } from "highline/utils/image_width_helper"

import styles from "highline/styles/components/category/product_tile_image.module.css"

const ProductTileImage = ({
  name,
  primaryImageUrl,
  secondaryImageUrl,
  showAlternateImage,
  priority,
  placeholder,
}) => {
  const imgSrc = (showAlternateImage && secondaryImageUrl) || primaryImageUrl

  const smartphoneProductTileImageWidth = cssEnvVars["--productTileMobileWidth"]
  const plpMaxWidth = cssEnvVars["--plpMaxWidth"]
  const desktopProductTileImageWidth = cssEnvVars["--productTileTabletAndDesktopWidth"]
  const ASPECT_RATIO = 640 / 960

  const sizes =
    `(max-width: ${ smartphoneBreakpoint }px) ${ smartphoneProductTileImageWidth }vw,` +
    `(max-width: ${ plpMaxWidth }px) ${ desktopProductTileImageWidth }vw,` +
    `${ PRODUCT_TILE_STANDARD_IMAGE_WIDTH }px`

  return (
    <div className={ styles.image }>
      <NextImages
        src={ imgSrc }
        alt={ name }
        ariaLabel={ name }
        wrapperClassNames={ [styles.portraitStoryImage, styles.storyImageWrapper] }
        width={ PRODUCT_TILE_STANDARD_IMAGE_WIDTH }
        height={ PRODUCT_TILE_STANDARD_IMAGE_WIDTH / ASPECT_RATIO }
        priority= { priority }
        placeholder={ placeholder }
        sizes={ sizes }
      />
    </div>
  )
}

ProductTileImage.propTypes = {
  name: PropTypes.string,
  primaryImageUrl: PropTypes.string,
  placeholder: PropTypes.string,
  priority: PropTypes.bool,
  secondaryImageUrl: PropTypes.string,
  showAlternateImage: PropTypes.bool,
}

ProductTileImage.defaultProps = {
  showAlternateImage: false,
  priority: false,
}

export default ProductTileImage
