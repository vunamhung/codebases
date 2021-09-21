import React from "react"
import classNames from "classnames"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import Imgix from "highline/components/imgix"
import Link from "highline/components/secure_link"
import { Map } from "immutable"
import LazyLoad from "highline/components/lazy_load"

import styles from "highline/styles/components/image_cta.module.css"

const ImageCta = ({
  altText,
  imageUrl,
  height,
  lazyLoad,
  link,
  onClickCTA,
  metadata,
}) => {
  if (!altText) {
    return null
  }

  const image = (
    <Imgix
      className={ styles.image }
      htmlAttributes={ {
        alt: altText,
        "aria-label": altText,
      } }
      src={ imageUrl }
      height={ height }
    />
  )

  const content = (
    <div className={ styles.content }>
      { !lazyLoad && image }
      { lazyLoad &&
        <LazyLoad>{ image }</LazyLoad>
      }
    </div>
  )

  return (
    <div className={ classNames(
      "component",
      "image-cta-component",
      styles.component,
    ) }
    >
      { !link.isEmpty() &&
        <Link href={ link.get("href") } as={ link.get("as") }>
          <a
            href={ link.get("as") }
            onClick={ () => onClickCTA(altText, link, imageUrl, metadata) }
          >
            { content }
          </a>
        </Link>
      }
      { link.isEmpty() &&
        <button
          aria-label={ altText }
          onClick={ () => onClickCTA(altText) }
        >
          { content }
        </button>
      }
    </div>
  )
}

ImageCta.propTypes = {
  height: PropTypes.number,
  imageUrl: PropTypes.string,
  layout: PropTypes.oneOf(["light", "dark", "large"]),
  lazyLoad: PropTypes.bool,
  link: ImmutablePropTypes.map,
  altText: PropTypes.string,
  onClickCTA: PropTypes.func,
  text: PropTypes.string,
  maxWidth: PropTypes.number,
  metadata: PropTypes.map,
}

ImageCta.defaultProps = {
  altText: "",
  height: 350,
  imageUrl: "",
  layout: "light",
  lazyLoad: false,
  link: Map({}),
  onClickCTA: () => {},
  text: "",
  maxWidth: 1,
  metadata: Map({}),
}

export default ImageCta
