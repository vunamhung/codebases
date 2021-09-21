import React from "react"
import classNames from "classnames"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import Link from "highline/components/secure_link"
import NextImages from "highline/components/next_images"
import { Map } from "immutable"

import styles from "highline/styles/components/mobile_slider_item.module.css"

const ImageResolutionTag = "?fit=clip&h=188&w=150&auto=enhance&dpr=1" //adds to the end of images src url to lower resolution for mobile

const MobileSliderItem = ({
  ariaLabel,
  imageUrl,
  layout,
  link,
  name,
  onClick,
  radius,
  text,
  maxWidth,
}) => {

  const content = (
    <div className={ styles.content }>
      <div className={ classNames(
        "image-options",
        styles[radius],
      ) }
      >
        <NextImages
          src={ imageUrl.concat(ImageResolutionTag) }
          alt={ name }
          ariaLabel={ name }
          priority
          width={ maxWidth }
          height={ maxWidth }
          objectFit="cover"
          objectPosition="top"
          wrapperClassNames={ [styles.mobileSliderImgWrapper] }
        />
      </div>
      <div className={ classNames(
        "text-wrapper",
        styles.text,
        styles[layout],
      ) }
      >
        <span>{ text }</span>
      </div>
    </div>
  )

  return (
    <div className={ classNames(
      "component",
      "mobile-slider-item",
      styles.component,
    ) }
    >
      { !link.isEmpty() &&
        <Link href={ link.get("href") } as={ link.get("as") }>
          <a onClick={ () => onClick(name, link.get("href")) }>
            { content }
          </a>
        </Link>
      }
      { link.isEmpty() &&
        <button
          aria-label={ ariaLabel }
          onClick={ () => onClick(name) }
        >
          { content }
        </button>
      }
    </div>
  )
}

MobileSliderItem.propTypes = {
  ariaLabel: PropTypes.string,
  imageUrl: PropTypes.string,
  layout: PropTypes.oneOf(["light", "dark", "large", "story"]),
  link: ImmutablePropTypes.map,
  name: PropTypes.string,
  maxWidth: PropTypes.number,
  onClick: PropTypes.func,
  radius: PropTypes.oneOf(["round", "default"]),
  text: PropTypes.string,
}

MobileSliderItem.defaultProps = {
  ariaLabel: "",
  imageUrl: "",
  layout: "light",
  link: Map({}),
  maxWidth: 60,
  name: "",
  onClick: () => {},
  text: "",
}

export default MobileSliderItem
