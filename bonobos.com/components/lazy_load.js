import React from "react"
import PropTypes from "prop-types"
import ReactLazyLoad from "react-lazyload"

const LazyLoad = ({ ...other }) => {

  const customProps = Object.assign({}, LazyLoad.defaultProps, other)

  return (
    <ReactLazyLoad
      { ...customProps }
    />
  )
}

LazyLoad.propTypes = {
  height: PropTypes.number,
  offset: PropTypes.number,
  once: PropTypes.bool,
  resize: PropTypes.bool,
}

LazyLoad.defaultProps = {
  height: 0,
  offset: 0,
  resize: true,
  once: true,
}

export default LazyLoad
