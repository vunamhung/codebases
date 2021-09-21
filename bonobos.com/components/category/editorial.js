import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import Imgix from "highline/components/imgix"
import LazyLoad from "highline/components/lazy_load"
import styles from "highline/styles/components/category/editorial.module.css"

const Editorial = ({
  description,
  imageAlt,
  imageUrl,
  layout,
  lazyLoad,
  promotionalMessage,
  subDescription,
  title,
}) => {

  const imageComponent = imageUrl &&
    <Imgix
      className={ styles.categoryGroupImage }
      htmlAttributes={ {
        alt: imageAlt,
        "aria-label": imageAlt,
      } }
      src={ imageUrl }
      height={ false }
      width={ 700 }
    />

  return (
    <div className={ classNames(
      "component",
      "editorial-component",
      styles.component,
      imageUrl ? styles.image : styles.noImage,
      styles[layout],
    ) }>
      <div className={ styles.imageWrapper }>
        { lazyLoad &&
          <LazyLoad height={ 450 }>
            { imageComponent }
          </LazyLoad>
        }
        { !lazyLoad && imageComponent }
      </div>
      <div className={ styles.editorialText }>
        <div className={ styles.editorialTextWrapper }>
          { title &&
            <h2 className={ styles.title }>{ title }</h2>
          }
          { promotionalMessage &&
            <div className={ styles.promoMessage }>{ promotionalMessage }</div>
          }
          { description &&
            <div className={ classNames(
              styles.description,
              "editorial-description",
            ) }>
              { description }
            </div>
          }
          { subDescription &&
            <div className={ styles.subDescription }>{ subDescription }</div>
          }
        </div>
      </div>
    </div>
  )
}

Editorial.propTypes = {
  description: PropTypes.string,
  imageAlt: PropTypes.string,
  imageUrl: PropTypes.string,
  layout: PropTypes.oneOf(["banner"]),
  lazyLoad: PropTypes.bool,
  name: PropTypes.string,
  promotionalMessage: PropTypes.string,
  subDescription: PropTypes.string,
  title: PropTypes.string,
}

Editorial.defaultProps = {
  lazyLoad: false,
}

export default Editorial
