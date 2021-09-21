import React from "react"
import classNames from "classnames"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import CenteredForm from "highline/components/auth/centered_form"
import Button from "highline/components/button"
import InlineGroup from "highline/components/inline_group"
import InputWithLabel from "highline/components/input_with_label"
import TermsAndPrivacy from "highline/components/terms_and_privacy/terms_and_privacy_summary"
import { getGeneralError, getInputError } from "highline/utils/form_errors"
import * as Regex from "highline/utils/inline_validation_helpers"
import styles from "highline/styles/components/auth/sign_up.module.css"

class SignUp extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      isMasked: true,
    }
  }

  onButtonClick = () => {
    this.setState({
      isMasked: !this.state.isMasked,
    })
  }

  render() {
    const {
      disabled,
      email,
      error,
      firstName,
      showCheckoutPrompt,
      lastName,
      onInfoLinkClick,
      onInputChange,
      onInputValidation,
      onSubmit,
      password,
    } = this.props

    const { isMasked } = this.state

    const termsOfService = (
      <TermsAndPrivacy
        copy={ (content) => {
          return (
            <div>
              By clicking &quot;{ showCheckoutPrompt ? "Create Account" : "Continue" }&quot; you agree to our { content }
              <span>, including receipt of emails and promotions.</span>
            </div>
          )
        } }
        indicateUpdate
        layout="light"
        openInModal={ false }
      />
    )

    const additionalCenteredFormProps = showCheckoutPrompt
      ? {
        buttonText: "Create Account",
        heading: "Save your information for next time.",
        subHeading: "Create a password to enjoy faster checkout and easy exchanges",
        className: styles.withCheckoutPrompt,
      }
      : {
        buttonText: "Continue",
        heading: "Welcome to Bonobos",
        infoLink: <a href="/sign-in" aria-label="Navigate back to Sign-In Form" onClick={ onInfoLinkClick }>Already registered? Login to your account.</a>,
        subHeading: "It looks like you're new here, we need a bit more info to create your new account",
      }

    return (
      <div className={ classNames(
        "component",
        "sign-up-component",
      ) }>
        <CenteredForm
          disabled={ disabled }
          onSubmit={ onSubmit }
          submitNote={ termsOfService }
          errorMessage={ getGeneralError(error) }
          requiredWarning
          { ...additionalCenteredFormProps }
        >
          { showCheckoutPrompt &&
              <div className={ styles.emailHeading }>{ `Email: ${ email }` }</div>
          }
          { !showCheckoutPrompt &&
              <InputWithLabel
                autoCorrect="off"
                label="Email Address"
                name="email"
                type="email"
                value={ email }
                onChange={ onInputChange }
                error={ getInputError(error, "user", "email") }
                validation = { Regex.email }
                onValidation= { onInputValidation }
                required
                sensitive
                spellCheck="false"
              />
          }
          <InlineGroup>
            <InputWithLabel
              autoCorrect="off"
              label="First Name"
              name="firstName"
              type="text"
              onChange={ onInputChange }
              error={ getInputError(error, "user", "firstName") }
              validation = { Regex.requiredField }
              onValidation= { onInputValidation }
              value={ firstName }
              required
              sensitive
              spellCheck="false"
            />
            <InputWithLabel
              autoCorrect="off"
              label="Last Name"
              name="lastName"
              type="text"
              onChange={ onInputChange }
              error={ getInputError(error, "user", "lastName") }
              validation = { Regex.requiredField }
              onValidation= { onInputValidation }
              value={ lastName }
              required
              sensitive
              spellCheck="false"
            />
          </InlineGroup>
          <div className={ styles.passwordContainer }>
            <Button
              align="inline"
              ariaLabel={ isMasked ? "Show Password" : "Hide Password" }
              className={ styles.showHideButton }
              onClick={ this.onButtonClick }
              type="button"
            >
              { isMasked ? "Show" : "Hide" }
            </Button>
            <InputWithLabel
              autoCorrect="off"
              label="Enter a Password"
              name="password"
              type={ isMasked ? "password" : "text" }
              onChange={ onInputChange }
              hint={ "Minimum 7 characters. Must include at least 1 letter and 1 number." }
              error={ getInputError(error, "user", "password") }
              validation = { Regex.password }
              onValidation= { onInputValidation }
              value={ password }
              required
              sensitive
              minlength="7"
              pattern="(?=.*\d)(?=.*[a-zA-Z]).*"
              spellCheck="false"
            />
          </div>
        </CenteredForm>
      </div>
    )
  }
}

SignUp.propTypes = {
  disabled: PropTypes.bool,
  email: PropTypes.string,
  error: ImmutablePropTypes.map,
  firstName: PropTypes.string,
  showCheckoutPrompt: PropTypes.bool,
  lastName: PropTypes.string,
  onInfoLinkClick: PropTypes.func,
  onInputChange: PropTypes.func,
  onInputValidation: PropTypes.func,
  onSubmit: PropTypes.func,
  password: PropTypes.string,
}

SignUp.defaultProps = {
  showCheckoutPrompt: false,
  onInputValidation: () => {},
}

export default SignUp
