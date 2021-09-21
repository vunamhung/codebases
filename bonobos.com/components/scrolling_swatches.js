import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { fromJS } from "immutable"
import Swiper from "react-id-swiper/lib/custom"
import classNames from "classnames"
import Swatch from "highline/components/swatch"
import styles from "highline/styles/components/scrolling_swatches.module.css"

const isValidSize = (num) => (num !== null && num !== undefined && num !== NaN && num > 0)

const clamp = (num, range) => {
  if (num < range[0]) {
    return range[0]
  } else if (num > range[1]) {
    return range[1]
  } else {
    return num
  }
}

class ScrollingSwatches extends React.PureComponent {
  componentDidMount() {
    if (this.innerRef.current) {
      this.swiper = this.innerRef.current.swiper
    }
  }

  componentDidUpdate() {
    const { swatches, checkedSwatchIndex } = this.props

    // This is better than using `slideToClickedSlide` for `Swiper`.
    // Because `slideToClickedSlide` only scroll the swatches when clicked and not when the
    // swatches' selection status is updated from the outside.
    // Also we want to be able to "center selected swatch when possible" which isn't doable
    // with the `centeredSlides` prop.
    if (this.swiper) {
      const availableSpace = this.swiper.width
      const slideSize = this.swiper.slidesSizesGrid[0]

      if (this.swiper.realIndex !== checkedSwatchIndex) {
        if (isValidSize(availableSpace) && isValidSize(slideSize)) {
          const visibleSlidesCount = Math.round(availableSpace / slideSize)
          const space = Math.floor(visibleSlidesCount / 2)

          this.swiper.slideTo(
            clamp(
              checkedSwatchIndex - space,
              [0, swatches.size - 1],
            ),
          )
        } else {
          this.swiper.slideTo(checkedSwatchIndex)
        }
      }
    }

    window.swiper = this.swiper
  }

  innerRef = React.createRef()
  swiper = null

  render() {
    const {
      className,
      checkedSwatchIndex,
      onSwatchClick,
      onSwatchMouseEnter,
      onSwatchMouseLeave,
      size,
      swatches,
      width,
    } = this.props

    return (
      <Swiper
        ref={ this.innerRef }
        containerClass={ classNames(
          styles.component,
          styles[size],
          className,
        ) }
        slidesPerView="auto"
        watchSlidesVisibility
      >
        { swatches.map((swatch, index) => (
          <Swatch
            key={ index }
            checked={ index === checkedSwatchIndex }
            className={ classNames(
              styles.swatch,
            ) }
            imageUrl={ swatch.get("swatchImageUrl") }
            layout={ size }
            width={ width }
            onClick={ (e) => {
              e.preventDefault()
              e.stopPropagation()
              onSwatchClick(index)
            } }
            onMouseEnter={ (e) => {
              e.preventDefault()
              e.stopPropagation()
              onSwatchMouseEnter(index)
            } }
            onMouseLeave={ (e) => {
              e.preventDefault()
              e.stopPropagation()
              onSwatchMouseLeave(index)
            } }
            onKeyPress={ (e) => {
              e.preventDefault()
              e.stopPropagation()
              onSwatchClick(index)
            } }
            tabIndex="0"
            role="button"
          />
        )) }
      </Swiper>
    )
  }
}

ScrollingSwatches.propTypes = {
  className: PropTypes.string,
  checkedSwatchIndex: PropTypes.number,
  onSwatchClick: PropTypes.func,
  onSwatchMouseEnter: PropTypes.func,
  onSwatchMouseLeave: PropTypes.func,
  size: PropTypes.string,
  swatches: ImmutablePropTypes.list,
  width: PropTypes.string,
}

ScrollingSwatches.defaultProps = {
  className: "",
  checkedSwatchIndex: 0,
  onSwatchClick: () => {},
  onSwatchMouseEnter: () => {},
  onSwatchMouseLeave: () => {},
  size: "default",
  swatches: fromJS([]),
  width: "default",
}

export default ScrollingSwatches
