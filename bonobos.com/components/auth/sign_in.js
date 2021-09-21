import React from "react"
import classNames from "classnames"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import CenteredForm from "highline/components/auth/centered_form"
import InputWithLabel from "highline/components/input_with_label"
import TermsAndPrivacy from "highline/components/terms_and_privacy/terms_and_privacy_summary"
import getConfig from "highline/config/application"
import { getGeneralError, getInputError } from "highline/utils/form_errors"
import * as Regex from "highline/utils/inline_validation_helpers"
import styles from "highline/styles/components/auth/sign_in.module.css"

const { google2faEnabled } = getConfig()

const accountActionButtons = (onPasswordReset, onCreateNewAccount) => (
  <div className={ styles.forgotPasswordOrCreateAccount }>
    { onPasswordReset &&
      <button
        aria-label="Send a link to your email to reset your password"
        onClick={ onPasswordReset }
      >
        Forgot Password?
      </button>
    }
    { onCreateNewAccount &&
      <button
        aria-label="Create New Account"
        onClick={ onCreateNewAccount }
      >
        Create an Account
      </button>
    }
  </div>
)

const termsOfService = (
  <TermsAndPrivacy
    copy={ (content) => {
      return (
        <div>
          By clicking &quot;Continue&quot; you agree to our { content }.
        </div>
      )
    } }
    indicateUpdate
    layout="light"
    openInModal={ false }
  />
)

const SignIn = ({
  disabled,
  onCreateNewAccount,
  onSubmit,
  onInputChange,
  onInputValidation,
  onPasswordReset,
  email,
  error,
  password,
  ccpaEmail,
}) => {
  const disablePasswordInput = google2faEnabled && Regex.bonobosEmail.test(email)

  return (
    <div className={ classNames(
      "component",
      "sign-in-component",
    ) }>
      <CenteredForm
        buttonText="Continue"
        disabled={ disabled }
        heading="Welcome Back!"
        infoLink={ accountActionButtons(onPasswordReset, onCreateNewAccount) }
        onSubmit={ onSubmit }
        submitNote={ termsOfService }
        errorMessage={ getGeneralError(error) }
        requiredWarning
        subHeading="Please log in to your account"
      >
        <InputWithLabel
          autocorrect="off"
          error={ getInputError(error, "user", "email") }
          validation = { Regex.email }
          onValidation= { onInputValidation }
          label="Email Address"
          name="email"
          type="email"
          onChange={ onInputChange }
          value={ ccpaEmail || email }
          required
          sensitive
          spellCheck="false"
          disabled={ !!ccpaEmail }
        />
        <InputWithLabel
          autocorrect="off"
          error={ !disablePasswordInput && getInputError(error, "user", "password") }
          validation = { Regex.requiredField }
          onValidation= { onInputValidation }
          label="Enter Password"
          name="password"
          type="password"
          onChange={ onInputChange }
          value={ password }
          required
          sensitive
          spellCheck="false"
          disabled={ disablePasswordInput }
        />
      </CenteredForm>
    </div>
  )
}

SignIn.propTypes = {
  ccpaEmail: PropTypes.string,
  disabled: PropTypes.bool,
  email: PropTypes.string,
  error: ImmutablePropTypes.map,
  onCreateNewAccount: PropTypes.func,
  onInputChange: PropTypes.func,
  onInputValidation: PropTypes.func,
  onPasswordReset: PropTypes.func,
  onSubmit: PropTypes.func,
  password: PropTypes.string,
}

SignIn.defaultProps = {
  ccpaEmail: "",
  disabled: false,
  onInputChange: () => {},
  onInputValidation: () => {},
  onSubmit: () => {},
  email: "",
}

export default SignIn
