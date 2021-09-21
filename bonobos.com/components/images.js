import React, { Fragment } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { smartphoneBreakpoint } from "highline/utils/breakpoints"
import Imgix from "highline/components/imgix"

import styles from "highline/styles/components/images.module.css"

const Images = ({
  altText,
  ariaLabel,
  desktopPercentageWidth,
  landscapeSrc,
  mobilePercentageWidth,
  portraitSrc,
  viewPortWidths,
}) => {

  // Split by smartphone breakpoint and sort in acending order (required)
  const smartphoneBreakpointsSortedAsc = viewPortWidths.filter((n) => n < smartphoneBreakpoint)
  const desktopAndTabletBreakpointsSortedAsc = viewPortWidths.filter((n) => n >= smartphoneBreakpoint)
  const defaultImageWidth = desktopAndTabletBreakpointsSortedAsc.pop()

  const createImgixOptions = (widths, imageSrc, percentageWidth) => (
    widths.map((width) => (
      <Imgix
        htmlAttributes={ { media: `(max-width: ${ width }px)` } }
        key={ `${ imageSrc }-w=${ width }` }
        src={ imageSrc }
        type="source"
        width={ Math.round(width * percentageWidth) }
      />
    ))
  )

  return (
    <Imgix
      type="picture"
      className={ classNames(
        "component",
        "images-component",
        styles.component,
      ) }
    >
      <Fragment>
        { portraitSrc &&
          createImgixOptions(smartphoneBreakpointsSortedAsc, portraitSrc, mobilePercentageWidth)
        }
        { portraitSrc &&
          <Imgix
            htmlAttributes={ { media: `(max-width: ${ smartphoneBreakpoint - 1 }px)` } }
            src={ portraitSrc }
            type="source"
            width={ Math.round((smartphoneBreakpoint - 1) *  mobilePercentageWidth) }
          />
        }
        { landscapeSrc &&
          createImgixOptions(desktopAndTabletBreakpointsSortedAsc, landscapeSrc, desktopPercentageWidth)
        }
        { landscapeSrc &&
          <Imgix
            src={ landscapeSrc }
            type="source"
            width={ Math.round(defaultImageWidth * desktopPercentageWidth) }
          />
        }
        { (landscapeSrc || portraitSrc) &&
          <Imgix
            className={ styles.picture }
            htmlAttributes={ {
              alt: altText,
              "aria-label": ariaLabel,
            } }
            src={ landscapeSrc || portraitSrc }
            width={ 1 }
          />
        }
      </Fragment>
    </Imgix>
  )
}

Images.propTypes = {
  altText: PropTypes.string,
  ariaLabel: PropTypes.string,
  desktopPercentageWidth: PropTypes.number,
  landscapeSrc: PropTypes.string,
  mobilePercentageWidth: PropTypes.number,
  portraitSrc: PropTypes.string,
  viewPortWidths: PropTypes.array,
}

Images.defaultProps = {
  desktopPercentageWidth: 1,
  mobilePercentageWidth: 1,
  viewPortWidths: [375, 414, 768, 1280, 1366, 1440, 1536, 1680, 1920, 2560], // Unique set of the most common user screen widths according to google analytics
}

export default Images

