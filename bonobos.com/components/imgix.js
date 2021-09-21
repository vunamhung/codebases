import React from "react"
import PropTypes from "prop-types"
import ReactImgix, { Picture, Source, PublicConfigAPI } from "react-imgix"
import classNames from "classnames"
import getConfig from "highline/config/application"
import "lazysizes"
import styles from "highline/styles/components/imgix.module.css"

PublicConfigAPI.disableWarning("fallbackImage")
PublicConfigAPI.disableWarning("sizesAttribute")

const isProduction = getConfig().isProduction

// in ssl mode, this will automatically rewrite unsecured http:// url to https://
const convertSrcSsl = (src) => {
  const sslMode = getConfig().sslMode

  if (!sslMode || !src) {
    return src
  } else {
    return src.replace(/^http:\/\//, "https://")
  }
}

const Imgix = ({ className, flex, type, ...other }) => {
  // don't run this in production, for performance reasons, we expect
  // all the urls to be formatted properly in production without rewriting
  if (!isProduction) {
    // rewrite url to https if the src is http
    other = Object.assign(
      {},
      other,
      { src: convertSrcSsl(other.src) },
    )
  }

  other.imgixParams = Object.assign(
    {},
    Imgix.defaultProps.imgixParams,
    other.imgixParams,
  )

  other.htmlAttributes = Object.assign(
    {},
    Imgix.defaultProps.htmlAttributes,
    other.htmlAttributes,
  )

  if (!other.height) delete other.height

  if (type === "default") {
    return (
      <ReactImgix
        className={ classNames(
          "component",
          "imgix-component",
          "lazyload",
          className,
          flex ? styles.flex : "",
        ) }
        { ...other }
      />
    )
  } else if (type === "source") {
    return (
      <Source
        className={ classNames(
          "component",
          "imgix-component",
          "lazyload",
          className,
          flex ? styles.flex : "",
        ) }
        { ...other }
      />
    )
  } else if (type === "picture") {
    return (
      <Picture
        className={ classNames(
          "component",
          "imgix-component",
          "lazyload",
          className,
          flex ? styles.flex : "",
        ) }
        { ...other }
      />
    )
  }
}

Imgix.propTypes = {
  className: PropTypes.string,
  disableSrcSet: PropTypes.bool,
  flex: PropTypes.bool,
  htmlAttributes: PropTypes.object,
  imgixParams: PropTypes.object,
  type: PropTypes.oneOf(["default", "source", "picture"]),
}

Imgix.defaultProps = {
  disableSrcSet: false,
  flex: false,
  height: 1,
  htmlAttributes: { alt: "" },
  imgixParams: {
    auto: ["format", "compress"],
    cs: "srgb",
    fit: "clip",
  },
  type: "default",
}

export default Imgix
