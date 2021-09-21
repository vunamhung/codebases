import Image from "next/image"
import classNames from "classnames"
import PropTypes from "prop-types"

import styles from "highline/styles/components/next_images.module.css"

const imgixOptimizationParams = "auto=format%2Ccompress&fit=clip&cs=srgb"
const getOptimizedSrc = (src) => {
  const delimiter = src && src.includes("?") ? "&" : "?"
  return src ? `${src}${delimiter}${imgixOptimizationParams}` : "src undefined"
}

const srcsetLoader = ({ width, src }) => {
  const delimiter = src && src.includes("?") ? "&" : "?"
  return src ? `${src}${delimiter}w=${width}` : "src undefined"
}

const getBlurredUrl = (src) => {
  const delimiter = src && src.includes("?") ? "&" : "?"
  return src ? `${src}${delimiter}w=16&q=1` : "src undefined"
}

const NextImages = ({
  alt,
  ariaLabel,
  height,
  imageClassNames,
  priority,
  src,
  width,
  objectFit,
  objectPosition,
  wrapperClassNames,
  onLoad,
  placeholder,
  sizes,
}) => {

  const hasDimensions = width && height
  const optimizedSrc = getOptimizedSrc(src)
  return (
    <span 
      className={ classNames(
        styles.nextImageWrapper,
        ...wrapperClassNames,
      ) }
      role="img"
      aria-label={ ariaLabel }
    >
      <Image
        src={ optimizedSrc }
        loader={ srcsetLoader }
        alt={ alt }
        className={ classNames(
          styles.nextImage,
          hasDimensions ? undefined : styles.nextImageLayoutFill,
          ...imageClassNames,
        ) } 
        width={ hasDimensions ? width : undefined }
        height={ hasDimensions ? height : undefined }
        priority={ priority }
        layout={ hasDimensions ? "responsive" : "fill" }
        placeholder={ placeholder || "blur" }
        blurDataURL={ getBlurredUrl(src) }
        objectFit={ objectFit }
        objectPosition={ objectPosition }
        sizes={ sizes }
        // TODO: remove comment after upgrading to next v11.0.2
        // onLoadingComplete not ready in this version of next (v11.0.0), but will be in v11.0.2
        // this attribute is ignored for now until we upgrade
        // current behavior that's affected: the carousel showing which images are visible on first load
        onLoadingComplete={ onLoad }
      />
    </span>
  )
}

NextImages.propTypes = {
  alt: PropTypes.string,
  ariaLabel: PropTypes.string,
  height: PropTypes.number,
  imageClassNames: PropTypes.array,
  objectFit: PropTypes.string,
  objectPosition: PropTypes.string,
  onLoad: PropTypes.func,
  placeholder: PropTypes.string,
  priority: PropTypes.bool,
  ref: PropTypes.func,
  src: PropTypes.string,
  width: PropTypes.number,
  wrapperClassNames: PropTypes.array,
  sizes: PropTypes.string,
}

NextImages.defaultProps = {
  wrapperClassNames: [],
  imageClassNames: [],
  objectFit: "initial",
  objectPosition: "initial",
  onLoad: () => {},
  ref: () => {},
}

export default NextImages
