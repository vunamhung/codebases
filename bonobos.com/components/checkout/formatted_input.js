import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import Cleave from "cleave.js/react"
import styles from "highline/styles/components/checkout/formatted_input.module.css"

const FormattedInput = ({
  className,
  error,
  hint,
  inputRef,
  layout,
  name,
  onChange,
  options,
  sensitive,
  ...other
}) => (
  <div
    className={ classNames(
      "component",
      "formatted-input-component",
      styles.component,
      className,
      styles[layout],
      { [styles.error]: error },
    ) }
  >
    <Cleave
      className={ classNames(
        styles.input,
        { sensitive },
      ) }
      data-hj-suppress={ sensitive }
      name={ name }
      onChange={ onChange }
      options={ options }
      ref={ inputRef }
      { ...other }
    />

    { hint && !error &&
     <span className={ styles.hint }>{ hint }</span>
    }

    { error &&
     <div className={ styles.errorMessage }>{ error }</div>
    }
  </div>
)

FormattedInput.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  inputRef: PropTypes.func,
  layout: PropTypes.oneOf(["normal", "borderless", "small"]),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.object,
  sensitive: PropTypes.bool,
  styles: PropTypes.object,
  value: PropTypes.string.isRequired,
}

FormattedInput.defaultProps = {
  layout: "normal",
  inputRef: () => {},
  onChange: () => {},
  sensitive: false,
}

export default FormattedInput
