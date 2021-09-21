import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"

import TruncatedSwatches from "highline/components/truncated_swatches"
import ScrollingSwatches from "highline/components/scrolling_swatches"

import styles from "highline/styles/components/category/product_tile_swatches.module.css"

const DESKTOP_SWATCHES_LIMIT = 7
const MOBILE_SWATCH_LIMIT = 5

const ProductTileSwatches = ({
  isMobile,
  isTruncateSwatches,
  link,
  onSwatchClick,
  onSwatchMouseEnter,
  onSwatchMouseLeave,
  selectedSwatchIndex,
  swatches,
}) => (
  <React.Fragment>
    { isMobile && !isTruncateSwatches &&
      <ScrollingSwatches
        checkedSwatchIndex={ selectedSwatchIndex }
        className={ styles.component }
        layout="small"
        onSwatchClick={ onSwatchClick }
        swatches={ swatches }
      />
    }
    { !isMobile &&
      <TruncatedSwatches
        checkedSwatchIndex={ selectedSwatchIndex }
        className={ styles.component }
        limit={ DESKTOP_SWATCHES_LIMIT }
        moreLink={ link }
        onSwatchClick={ onSwatchClick }
        onSwatchMouseEnter={ onSwatchMouseEnter }
        onSwatchMouseLeave={ onSwatchMouseLeave }
        swatches={ swatches }
        width="skinny"
      />
    }
    { isMobile && isTruncateSwatches &&
      <TruncatedSwatches
        checkedSwatchIndex={ selectedSwatchIndex }
        className={ styles.component }
        limit={ MOBILE_SWATCH_LIMIT }
        moreLink={ link }
        onSwatchClick={ onSwatchClick }
        onSwatchMouseEnter={ onSwatchMouseEnter }
        onSwatchMouseLeave={ onSwatchMouseLeave }
        swatches={ swatches }
        isTruncateSwatches={ isTruncateSwatches }
        width="skinny"
      />
    }
  </React.Fragment>
)

ProductTileSwatches.propTypes = {
  isMobile: PropTypes.bool,
  isTruncateSwatches: PropTypes.bool,
  link: ImmutablePropTypes.map,
  onSwatchClick: PropTypes.func,
  onSwatchMouseEnter: PropTypes.func,
  onSwatchMouseLeave: PropTypes.func,
  selectedSwatchIndex: PropTypes.number,
  swatches: ImmutablePropTypes.list,
}

ProductTileSwatches.defaultProps = {
  isMobile: false,
  isTruncateSwatches: false,
}

export default ProductTileSwatches
