import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import Button from "highline/components/button"
import Spinner from "highline/components/spinner"

import styles from "highline/styles/components/loading_button.module.css"

const spinnerLayoutMapping = {
  default: "light",
  primary: "light",
  secondary: "medium",
}

const LoadingButton = ({
  children,
  loading,
  ...other
}) => (
  <Button
    className={ classNames(
      "loading-button-component",
      styles.component,
      loading ? styles.loading : null,
      other.align ? styles[other.align] : null,
    ) }
    disabled={ loading }
    { ...other }
  >
    { children }

    { loading &&
      <Spinner
        className={ styles.spinner }
        layout={ spinnerLayoutMapping[other.layout] || spinnerLayoutMapping["default"] }
      />
    }
  </Button>
)

LoadingButton.propTypes = {
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
}

LoadingButton.defaultProps = {
  loading: false,
}

export default LoadingButton
