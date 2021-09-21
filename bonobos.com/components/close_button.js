import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { CloseIcon } from "highline/components/icons"

import styles from "highline/styles/components/close_button.module.css"

const CloseButton = ({
  className,
  label,
  onClick,
  useCloseIcon,
  layout,
}) => (
  <button
    aria-label={ label }
    className={ classNames(
      "component",
      "close-button-component",
      className,
      styles.component,
      styles[layout],
    ) }
    onClick={ onClick }
  >
    { useCloseIcon
      ? <CloseIcon />
      : "\u2715"
    }
  </button>
)

CloseButton.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  useCloseIcon: PropTypes.bool,
  layout:PropTypes.oneOf(["default", "noBackground"]),
}

CloseButton.defaultProps = {
  className: "",
  label: "",
  onClick: () => {},
  useCloseIcon: false,
  layout: "default",
}

export default CloseButton
