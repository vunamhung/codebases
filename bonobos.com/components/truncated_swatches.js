import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { fromJS } from "immutable"
import classNames from "classnames"
import Link from "highline/components/secure_link"
import Swatch from "highline/components/swatch"
import styles from "highline/styles/components/truncated_swatches.module.css"

const TruncatedSwatches = ({
  className,
  checkedSwatchIndex,
  isTruncateSwatches,
  limit,
  moreLink,
  onSwatchClick,
  onSwatchMouseEnter,
  onSwatchMouseLeave,
  size,
  swatches,
  width,
}) => {
  let visibleCount = swatches.size
  if (swatches.size > limit && isTruncateSwatches) {
    visibleCount = limit - 1 // The `- 1` because the "+ #" link takes up 1 swatches worth of space
  } else if (swatches.size > limit && !isTruncateSwatches) {
    visibleCount = limit - 2 // The `- 2` because the "+ # more" link takes up 2 swatches worth of space
  }


  const visibleSwatches = swatches.slice(0, visibleCount)
  const remainingCount = swatches.size - visibleCount

  return (
    <div
      className={ classNames(
        styles.component,
        styles[size],
        isTruncateSwatches && styles.skinny,
        className,
      ) }
    >
      { visibleSwatches.map((swatch, index) => (
        <Swatch
          key={ index }
          checked={ index === checkedSwatchIndex }
          className={ classNames(
            styles.swatch,
            styles.item,
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
      { (remainingCount > 0) && (
        <div className={ classNames(
          styles.seeMore,
          styles.item,
        ) }>
          <Link href={ moreLink.get("href") } as={ moreLink.get("as") }>
            <a href={ moreLink.get("as") }>
              {`+ ${ remainingCount }${ isTruncateSwatches ? "" : " more"}`}
            </a>
          </Link>
        </div>
      ) }
    </div>
  )
}

TruncatedSwatches.propTypes = {
  className: PropTypes.string,
  checkedSwatchIndex: PropTypes.number,
  isTruncateSwatches: PropTypes.bool,
  limit: PropTypes.number,
  moreLink: ImmutablePropTypes.map,
  onSwatchClick: PropTypes.func,
  onSwatchMouseEnter: PropTypes.func,
  onSwatchMouseLeave: PropTypes.func,
  size: PropTypes.string,
  swatches: ImmutablePropTypes.list,
  width: PropTypes.string,
}

TruncatedSwatches.defaultProps = {
  className: "",
  checkedSwatchIndex: 0,
  isTruncateSwatches: false,
  limit: 5,
  moreLink: fromJS({ href: "#" }),
  onSwatchClick: () => {},
  onSwatchMouseEnter: () => {},
  onSwatchMouseLeave: () => {},
  size: "default",
  swatches: fromJS([]),
  width: "default",
}

export default TruncatedSwatches
