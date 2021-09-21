import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import styles from "highline/styles/components/button.module.css"

const Button = ({
  align,
  ariaLabel,
  children,
  className,
  disabled,
  layout,
  name,
  size,
  type,
  rounded,
  ...other
}) => (
  <button
    className={ classNames(
      "component",
      "button-component",
      styles.component,
      className,
      styles[align],
      styles[layout],
      styles[size],
      rounded && styles.rounded,
    ) }
    disabled={ disabled }
    name={ name }
    type={ type }
    aria-label={ ariaLabel }
    onClick={ (e) => {
      if (!this.props.disabled)
        this.props.onClick(e)
    } }
    { ...other }
  >
    { children }
  </button>
)

Button.propTypes = {
  align: PropTypes.oneOf(["block", "stretch", "inline"]),
  ariaLabel: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  layout: PropTypes.oneOf([
    "primary",
    "primary-outline",
    "primary-transparent",
    "secondary",
    "secondary-outline",
    "secondary-transparent",
    "alternate",
    "alternate-outline",
    "alternate-transparent",
    "cancel-link",
    "warning",
    "warning-link",
    "disabled-style",
    "plain-text",
  ]),
  name: PropTypes.string,
  onClick: PropTypes.func,
  rounded: PropTypes.bool,
  size: PropTypes.oneOf(["xsmall", "small", "medium", "large"]),
  type: PropTypes.string,
}

Button.defaultProps = {
  align: "block",
  ariaLabel: "",
  disabled: false,
  layout: "primary",
  onClick: () => {},
  rounded: false,
  size: "medium",
  type: "submit",
}

export default Button
