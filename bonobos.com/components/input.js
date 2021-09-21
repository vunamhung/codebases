import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import styles from "highline/styles/components/input.module.css"

const Input = ({
  className,
  children,
  error,
  inputRef,
  layout,
  name,
  hint,
  onChange,
  sensitive,
  ...other
}) => (
  <div
    className={ classNames(
      "component",
      "input-component",
      styles.component,
      styles[layout],
      className,
      (error ? styles.error : ""),
    ) }
  >
    <input
      className={ classNames(
        styles.input,
        sensitive ? "sensitive" : null,
      ) }
      data-hj-suppress={ sensitive }
      name={ name }
      onChange={ onChange }
      ref={ inputRef }
      { ...other }
    />

    { hint && !error &&
      <span className={ styles.hint }>{ hint }</span>
    }

    { error &&
      <div className={ styles.errorMessage }>{ error }</div>
    }

    { children }
  </div>
)

Input.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  inputRef: PropTypes.func,
  layout: PropTypes.oneOf(["normal", "borderless", "small"]),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  sensitive: PropTypes.bool,
  styles: PropTypes.object,
  value: PropTypes.string.isRequired,
}

Input.defaultProps = {
  layout: "normal",
  inputRef: () => {},
  onChange: () => {},
  sensitive: false,
}

export default Input
