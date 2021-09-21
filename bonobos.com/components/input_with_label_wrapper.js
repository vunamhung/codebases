import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import Input from "highline/components/input"
import FormattedInput from "highline/components/checkout/formatted_input"
import styles from "highline/styles/components/input_with_label.module.css"

class InputWithLabelWrapper extends React.PureComponent {
  state = {
    isFocused: false,
  }

  setFocus = () => {
    this.setState({ isFocused: true })
  }

  handleOnBlur = () => {
    this.inlineValidation(this.props.value)
    this.setState({ isFocused: false })
  }

  handleOnChange = (e) => {
    const { error, onChange } = this.props
    const inputFieldValue = e.target.value
    onChange(e)
    if (error) {
      this.inlineValidation(inputFieldValue)
    }
  }

  inlineValidation(value) {
    const { name, onValidation, validation } = this.props
    if (onValidation && validation) {
      const errorMessage = validation(value.trim(), name)
      onValidation(name, errorMessage)
    }
  }

  render() {
    const {
      label,
      name,
      placeholder,
      required,
      value,
      inputType,
      className,
      onValidation, // Input component doesn't need this, so pull it out from other
      validation,   // Input component doesn't need this, so pull it out from other
      ...other
    } = this.props

    const {
      isFocused,
    } = this.state

    const inputProps = {
      className: classNames(
        styles.input,
        (isFocused || value || placeholder) && styles.inputFocus,
      ),
      id: name,
      name,
      onBlur: this.handleOnBlur,
      onFocus: this.setFocus,
      placeholder,
      required,
      value,
      ...other,
      onChange: this.handleOnChange,
    }

    return (
      <div
        className={ classNames(
          "component",
          "explicit-input-with-label-component",
          styles.component,
          className,
        ) }
      >
        <label
          className={ classNames(
            styles.label,
            (isFocused || value || placeholder) && styles.labelFocus,
          ) }
          htmlFor={ name }
        >
          { label }
          { !required &&
            <span> (Optional)</span>
          }
        </label>
        { inputType === "formatted" && <FormattedInput { ...inputProps } /> }
        { inputType === "standard" && <Input { ...inputProps } /> }
      </div>
    )
  }
}

InputWithLabelWrapper.propTypes = {
  className: PropTypes.string,
  hint: PropTypes.string,
  inputType: PropTypes.oneOf(["standard", "formatted"]),
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onValidation: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  sensitive: PropTypes.bool,
  validation: PropTypes.func,
  value: PropTypes.string,
}

InputWithLabelWrapper.defaultProps = {
  onChange: () => {},
  onValidation: () => {},
  validation: () => {},
}

export default InputWithLabelWrapper
