import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import classNames from "classnames"
import SignIn from "highline/components/auth/sign_in"
import SignUp from "highline/components/auth/sign_up"
import ResetPassword from "highline/components/auth/reset_password"
import styles from "highline/styles/components/auth/user_auth.module.css"

const UserAuth = ({
  className,
  disabled,
  error,
  email,
  useSignInForm,
  signInOverride,
  firstName,
  isLoggedIn,
  lastName,
  layout,
  handleIsCCPARedirect,
  handleInfoLinkClick,
  handleInputChange,
  handleIsLoggedIn,
  handlePasswordReset,
  handleSignInSubmit,
  handleSignUpSubmit,
  handleToggleExistingUserLogin,
  onInputValidation,
  password,
  ccpaEmail,
  hideForms,
  shouldShowResetPasswordPrompts,
  resetPasswordSuccess,
}) => {
  React.useEffect(() => {
    if (ccpaEmail) {
      handleIsCCPARedirect()
    }
  }, [])

  if (!ccpaEmail && isLoggedIn && layout === "page") {
    handleIsLoggedIn()
    return null
  }

  const renderSignInForm = signInOverride ? signInOverride === "sign-in" : useSignInForm

  let component

  if (shouldShowResetPasswordPrompts)
    component = (
      <ResetPassword
        disabled={ disabled }
        error={ error }
        shouldShowResetPasswordPrompts={ shouldShowResetPasswordPrompts }
        onInputChange={ handleInputChange }
        onSubmit={ handlePasswordReset }
        resetPasswordSuccess={ resetPasswordSuccess }
        inputValue={ email }
      />
    )

  else if (renderSignInForm)
    component = (
      <SignIn
        disabled={ disabled }
        email={ email }
        password={ password }
        onInputChange={ handleInputChange }
        onInputValidation= { onInputValidation }
        onPasswordReset={ handlePasswordReset }
        onCreateNewAccount={ handleToggleExistingUserLogin }
        onSubmit={ handleSignInSubmit }
        error={ error }
        ccpaEmail={ ccpaEmail }
      />
    )

  else
    component = (
      <SignUp
        disabled={ !!ccpaEmail || disabled }
        onInputChange={ handleInputChange }
        onSubmit={ handleSignUpSubmit }
        email={ email }
        firstName = { firstName }
        showCheckoutPrompt={ !!signInOverride }
        lastName = { lastName }
        password = { password }
        error={ error }
        onInfoLinkClick={ handleInfoLinkClick }
        onInputValidation= { onInputValidation }
      />
    )

  return (
    <div className={ classNames(
      "component",
      "user-auth-component",
      styles[layout],
      className,
    ) }>
      { hideForms? null : component }
    </div>
  )
}

UserAuth.propTypes = {
  ccpaEmail: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  email: PropTypes.string,
  error: ImmutablePropTypes.map,
  useSignInForm: PropTypes.bool,
  firstName: PropTypes.string,
  handleIsCCPARedirect: PropTypes.func,
  handleInfoLinkClick: PropTypes.func,
  handleInputChange: PropTypes.func,
  handleIsLoggedIn: PropTypes.func,
  handlePasswordReset: PropTypes.func,
  handleSignInSubmit: PropTypes.func,
  handleSignUpSubmit: PropTypes.func,
  handleToggleExistingUserLogin: PropTypes.func,
  hideForms: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  lastName: PropTypes.string,
  layout: PropTypes.oneOf(["page", "drawer"]),
  onInputValidation: PropTypes.func,
  password: PropTypes.string,
  shouldShowResetPasswordPrompts: PropTypes.bool,
  signInOverride: PropTypes.oneOf(["sign-in", "sign-up"]),
  validEmail: PropTypes.bool,
  resetPasswordSuccess: PropTypes.bool,
}

UserAuth.defaultProps = {
  ccpaEmail: "",
  email: "",
  hideForms: false,
  layout: "page",
  onInputValidation: () => {},
  handleIsCCPARedirect: () => {},
}

export default UserAuth
