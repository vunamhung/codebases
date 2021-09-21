import { connect } from "react-redux"
import UserAuth from "highline/components/auth/user_auth"
import {
  toggleExistingUserLogin,
  authInputChanged,
  inlineValidation,
  loginAsync,
  registerAsync,
  recoverPasswordAsync,
  ccpaLoginAsync,
  userAlreadyLoggedIn,
} from "highline/redux/actions/auth_actions"

const mapStateToProps = (state, ownProps) => {
  return {
    disabled: state.getIn(["auth", "isLoading"]),
    email: state.getIn(["auth", "email"]),
    error: state.getIn(["auth", "error"]),
    useSignInForm: state.getIn(["auth", "useSignInForm"]),
    firstName: state.getIn(["auth", "firstName"]),
    isLoggedIn: state.getIn(["auth", "isLoggedIn"]),
    lastName: state.getIn(["auth", "lastName"]),
    layout: ownProps.layout,
    password: state.getIn(["auth", "password"]),
    signInOverride: ownProps.signInOverride,
    validEmail: state.getIn(["auth", "validEmail"]),
    ccpaEmail: state.getIn(["auth", "encryptedValue", "emailId"]),
    hideForms: state.getIn(["auth", "hideForms"]),
    shouldShowResetPasswordPrompts: state.getIn(["auth", "shouldShowResetPasswordPrompts"]),
    resetPasswordSuccess: state.getIn(["auth", "resetPasswordSuccess"]),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleInputChange: (e) => {
      e.preventDefault()
      dispatch(authInputChanged(e.target.name, e.target.value))
    },

    handleInfoLinkClick: (e) => {
      e.preventDefault()
      dispatch(toggleExistingUserLogin())
    },

    handleIsCCPARedirect: () => {
      dispatch(ccpaLoginAsync())
    },

    handleToggleExistingUserLogin: () => {
      dispatch(toggleExistingUserLogin())
    },

    handleIsLoggedIn: () => {
      dispatch(userAlreadyLoggedIn())
    },

    handlePasswordReset: (e) => {
      e.preventDefault()
      dispatch(recoverPasswordAsync())
    },

    handleSignInSubmit: (e) => {
      e.preventDefault()
      dispatch(loginAsync(ownProps.redirectOnSuccessUrl))
    },

    handleSignUpSubmit: (e) => {
      e.preventDefault()
      dispatch(registerAsync(ownProps.redirectOnSuccessUrl))
    },

    onInputValidation: (name, errorMessage) => {
      dispatch(inlineValidation(name, errorMessage))
    },
  }
}

const AuthContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserAuth)

export default AuthContainer
