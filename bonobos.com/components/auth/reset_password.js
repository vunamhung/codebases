import React from "react"
import classNames from "classnames"
import ImmutablePropTypes from "react-immutable-proptypes"
import PropTypes from "prop-types"
import CenteredForm from "highline/components/auth/centered_form"
import InputWithLabel from "highline/components/input_with_label"
import TermsAndPrivacy from "highline/components/terms_and_privacy/terms_and_privacy_summary"
import { getPasswordResetError, getInputError } from "highline/utils/form_errors"
import styles from "highline/styles/components/auth/reset_password.module.css"

const termsOfService = (
  <TermsAndPrivacy
    copy={ (content) => {
      return (
        <div>
          By clicking &quot;Submit&quot; you agree to our { content }
          <span>, including receipt of emails and promotions.</span>
        </div>
      )
    } }
    indicateUpdate
    layout="light"
    openInModal={ false }
  />
)

const ResetPassword = ({
  disabled,
  error,
  inputValue,
  shouldShowResetPasswordPrompts,
  onInputChange,
  onSubmit,
  resetPasswordSuccess,
  shouldShowRotatePasswordPrompts,
}) => {
  let component
  if (shouldShowRotatePasswordPrompts)
    component = (
      <CenteredForm
        buttonText={ "Reset Password" }
        disabled={ disabled }
        errorMessage={ getPasswordResetError(error) }
        heading={ "Time to Reset your Password" }
        onSubmit={ onSubmit }
        requiredWarning
        subHeading={ "To protect the security of your account, we are resetting your password and have logged you out of your account. Please click the link below to reset your password." }
      >
        <InputWithLabel
          error={ getInputError(error, "user", "password") }
          label={ "email" }
          name="email"
          type={ "text" }
          onChange={ onInputChange }
          value={ inputValue }
          required
        />
      </CenteredForm>
    )
  else if (shouldShowResetPasswordPrompts)
    component = (
      <CenteredForm
        buttonText={ "Reset Password" }
        disabled={ disabled }
        errorMessage={ getPasswordResetError(error) }
        heading={ "Time to Reset your Password" }
        onSubmit={ onSubmit }
        requiredWarning
        subHeading={ "To protect the security of your account, we are resetting your password and have logged you out of your account. Please click the link below to reset your password." }
      >
        <InputWithLabel
          error={ getInputError(error, "user", "password") }
          label={ "email" }
          name="newPassword"
          type={ "text" }
          onChange={ onInputChange }
          value={ inputValue }
          required
        />
      </CenteredForm>
    )

  else
    component = (
      <CenteredForm
        buttonText={ "Submit" }
        disabled={ disabled }
        errorMessage={ getPasswordResetError(error) }
        heading={ "Hi there!" }
        onSubmit={ onSubmit }
        requiredWarning
        subHeading={ "Let's get you set up with a new password" }
        submitNote={ termsOfService }
      >
        <InputWithLabel
          error={ getInputError(error, "user", "password") }
          label={ "Enter a New Password" }
          name="newPassword"
          type={ "password" }
          onChange={ onInputChange }
          value={ inputValue }
          required
        />
      </CenteredForm>
    )

  return (
    <div className={ classNames(
      "component",
      "reset-password-component",
    ) }>
      { resetPasswordSuccess ?
        <div className={ classNames("reset-password-success", styles.success) }>
          <h1>All set</h1>
          <p>
            We&apos;ve changed your password and you can now sign in.
          </p>
        </div>
        : component
      }

    </div>
  )
}

ResetPassword.propTypes = {
  disabled: PropTypes.bool,
  email: PropTypes.string,
  error: ImmutablePropTypes.map,
  inputValue: PropTypes.string,
  onInputChange: PropTypes.func,
  onSubmit: PropTypes.func,
  password: PropTypes.string,
  resetPasswordSuccess: PropTypes.bool,
  shouldShowResetPasswordPrompts: PropTypes.bool,
  shouldShowRotatePasswordPrompts: PropTypes.bool,
}

export default ResetPassword
