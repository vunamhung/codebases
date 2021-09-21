import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import SpinnerIcon from "highline/svg/icons/spinner.svg"

import styles from "highline/styles/components/spinner.module.css"

const Spinner = ({
  className,
  layout,
  ...other
}) => (
  <div
    className={ classNames(
      "component",
      "spinner-component",
      styles.component,
      styles[layout],
      className,
    ) }
    { ...other }
  >
    <SpinnerIcon />
  </div>
)

Spinner.propTypes = {
  className: PropTypes.string,
  layout: PropTypes.oneOf(["dark", "light", "medium"]),
}

Spinner.defaultProps = {
  layout: "medium",
}

export default Spinner
