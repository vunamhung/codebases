import React from "react"
import HorizontalScrollArea from "highline/components/horizontal_scroll_area"
import MobileSliderItem from "highline/components/mobile_slider_item"
import PropTypes from "prop-types"
import classNames from "classnames"
import { getClientSideLink } from "highline/utils/link"
import { getImgixUrl, getField, getContentfulEntriesByContentType } from "highline/utils/contentful/contentful_helper"

import styles from "highline/styles/components/navigation_slider.module.css"

const NavigationSlider = ({ onClick, contentfulData }) => {
  const sliderItemsArray = getContentfulEntriesByContentType(contentfulData, "mobileNavigationSliderItem")
  if (!sliderItemsArray){
    return null
  }
  return (
    <div className={ classNames(
      "navigation-slider-component",
      styles.component,
    ) }>
      <HorizontalScrollArea>
        <div className={ classNames (styles.leftSliderPadding) } >
          {
            sliderItemsArray.map(
              (sliderItem) => renderMobileSliderItems(onClick, sliderItem))
          }
        </div>
      </HorizontalScrollArea>
    </div>
  )
}

const renderMobileSliderItems = (onClick, sliderItem) => {
  if ( !(getField(sliderItem, "image") || getField(sliderItem, "imageUrl")) ) { return null }
  return (
    <MobileSliderItem
      ariaLabel={ getField(sliderItem, "ariaLabel") }
      imageUrl={ getField(sliderItem, "image") ? getImgixUrl(getField(sliderItem, "image")) : getField(sliderItem, "imageUrl") }
      key={ `slider-item-${ getField(sliderItem, "text") }` }
      radius="round"
      text={ getField(sliderItem, "text") }
      link={ getClientSideLink( getField(sliderItem, "itemTarget") ) }
      onClick={ onClick }
    />
  )
}

NavigationSlider.propTypes = {
  contentfulData: PropTypes.object,
  onClick: PropTypes.func,
}

NavigationSlider.defaultProps = {
  onClick: () => {},
}

export default NavigationSlider