import Rollbar, { formatHttpError } from "highline/utils/rollbar"
import addSodCookie from "highline/utils/add_sod_cookie"
import { getSodCookie } from "highline/utils/sod_helper"
import ActionTypes from "highline/redux/action_types"
import * as Navigate from "highline/utils/navigate"
import * as AuthenticationApi from "highline/api/authentication_api"
import { savedItemsAddRequestedItemAsync } from "highline/redux/actions/saved_items_actions"
import { email as emailRegex, bonobosEmail } from "highline/utils/inline_validation_helpers"
import getConfig from "highline/config/application"
import * as CCPAApi from "highline/api/ccpa_api"
import * as SodCookieHelper from "highline/utils/sod_helper"
import { getRedirectUrl } from "highline/redux/helpers/navigation_helper"

const { google2faEnabled } = getConfig()

export const authRequestStarted = () => ({
  type: ActionTypes.AUTH_REQUEST_STARTED,
})

export const authRequestCompleted = () => ({
  type: ActionTypes.AUTH_REQUEST_COMPLETED,
})

export const authFailed = (status, message, error, debugMessage = "") => ({
  type: ActionTypes.AUTH_FAILED,
  status,
  message,
  error,
  debugMessage,
})

export const authInputChanged = (name, value) => ({
  type: ActionTypes.AUTH_INPUT_CHANGED,
  name,
  value,
})

export const authValidationFailed = () => ({
  type: ActionTypes.AUTH_VALIDATION_FAILED,
})

export const inlineValidation = (name, errorMessage) => (
  (dispatch) => {
    if (errorMessage) {
      dispatch(inlineValidationFailure(name, errorMessage))
    } else {
      dispatch(inlineValidationSuccess(name))
    }
  }
)

export const inlineValidationFailure = (name, errorMessage) => ({
  errorMessage,
  name,
  type: ActionTypes.INLINE_VALIDATION_FAILED,
})

export const inlineValidationSuccess = (name) => ({
  name,
  type: ActionTypes.INLINE_VALIDATION_SUCCESS,
})

export const userLogoutStarted = (categoryName, level, link) => ({
  type: ActionTypes.USER_LOGOUT_STARTED,
  categoryName,
  level,
  link,
})

export const userLoggedOut = () => ({
  type: ActionTypes.USER_LOGGED_OUT,
})

export const userAlreadyLoggedIn = () => ({
  type: ActionTypes.USER_ALREADY_LOGGED_IN,
})

export const userNotLoggedIn = () => ({
  type: ActionTypes.USER_NOT_LOGGED_IN,
})

export const userLoggedIn = (firstName, lastName, email, externalId, authenticationToken, userId, redirectUrl) => ({
  type: ActionTypes.USER_LOGGED_IN,
  firstName,
  lastName,
  email,
  externalId,
  authenticationToken,
  userId,
  redirectUrl,
})

export const userRegistered = (firstName, lastName, email, externalId, authenticationToken, userId, redirectUrl) => ({
  type: ActionTypes.USER_REGISTERED,
  firstName,
  lastName,
  email,
  externalId,
  authenticationToken,
  userId,
  redirectUrl,
})

export const resetPasswordLoadedWithQueryToken = (token) => ({
  type: ActionTypes.RESET_PASSWORD_LOADED_WITH_QUERY_TOKEN,
  token,
})

export const resetPasswordSucceeded = () => ({
  type: ActionTypes.RESET_PASSWORD_SUCCEEDED,
})

export const resetPasswordFailed = (status, message, error) => ({
  type: ActionTypes.RESET_PASSWORD_FAILED,
  status,
  message,
  error,
})

export const shouldShowResetPasswordPrompts = () => ({
  type: ActionTypes.RESET_PASSWORD_FORCED,
})

export const authClearedAndRedirected = () => ({
  type: ActionTypes.AUTH_CLEARED_AND_REDIRECTED,
})

export const toggleExistingUserLogin = () => ({
  type: ActionTypes.TOGGLE_EXISTING_USER_LOGIN,
})

export const toggleCCPALogin = () => ({
  type: ActionTypes.TOGGLE_CCPA_LOGIN,
})

export const submitCCPARequestStarted = () => ({
  type: ActionTypes.SUBMIT_CCPA_REQUEST_STARTED,
})

export const submitCCPARequestCompleted = () => ({
  type: ActionTypes.SUBMIT_CCPA_REQUEST_COMPLETED,
})

export const submitCCPARequestFailed = () => ({
  type: ActionTypes.SUBMIT_CCPA_REQUEST_FAILED,
})

export const ccpaParamDecrypted = (encryptedValue) => ({
  encryptedValue,
  type: ActionTypes.CCPA_PARAM_DECRYPTED,
})

export const ccpaParamReceived = (encryptedParam) => ({
  encryptedParam,
  type: ActionTypes.CCPA_PARAM_RECEIVED,
})

export const ccpaRedirectRequested = (ccpaRedirectType) => ({
  type: ActionTypes.CCPA_REDIRECT_REQUESTED,
  ccpaRedirectType,
})

export const loginAsync = (onSuccessUrl) => (
  async (dispatch, getState) => {
    const auth = getState().get("auth")
    const ccpaEmail = auth.getIn(["encryptedValue", "emailId"])
    const email = ccpaEmail || auth.get("email")

    if (google2faEnabled && bonobosEmail.test(email)) {
      Navigate.admin({ redirect_to: "/" })
      return
    }

    dispatch(authRequestStarted())

    const cart = getState().get("cart")
    const shouldRedirectOnSuccess = auth.get("shouldRedirectOnSuccess")

    const loginInfo = {
      email,
      password: auth.get("password"),
    }

    const orderInfo = {
      cart_number: cart.get("number"),
      cart_token: cart.get("token"),
    }

    // CCPA Optout if OptanonConsent cookie already exist
    const optanonConsentCookieId = SodCookieHelper.getSodCookie()
    const loginAndOrderInfo = Object.assign({}, loginInfo, orderInfo, { optanonConsentCookieId })

    let redirectUrl

    try {
      const response = await AuthenticationApi.login(loginAndOrderInfo)
      if (ccpaEmail) {
        dispatch(ccpaLoginAsync(true))
        return
      }
      if (!getSodCookie()) {
        const optanonResponse = await AuthenticationApi.checkOptanonStatus(response.data.get("email"))
        if (optanonResponse.data.get("optanonConsentCookieId")) {
          await addSodCookie(async () => {
            await CCPAApi.sodLoginOptout(response.data.get("email"), response.data.get("firstName"), response.data.get("lastName"))
          })
        }
      }

      redirectUrl = shouldRedirectOnSuccess
        ? getRedirectUrl(getState().get("currentPage"), onSuccessUrl)
        : null

      dispatch(userLoggedIn(
        response.data.get("firstName"),
        response.data.get("lastName"),
        response.data.get("email"),
        response.data.get("externalId"),
        response.data.get("authenticationToken"),
        response.data.get("userId"),
        redirectUrl,
      ))
      const requestedSavedItem = getState().getIn(["savedItems", "requestedItem"])
      if (!requestedSavedItem.isEmpty()) {
        dispatch(savedItemsAddRequestedItemAsync())
      }

    } catch (error) {
      if (error.status == "401" && error.data.getIn(["errors","general", "0"]) === "This user needs to reset their password") {
        dispatch(shouldShowResetPasswordPrompts())
      }
      const debugMessage = `loginAsync - redirectUrl: ${ redirectUrl }, shouldRedirectOnSuccess: ${ shouldRedirectOnSuccess }`
      dispatch(authFailed(error.status, error.message, error.data, debugMessage))
    }

    dispatch(authRequestCompleted())
  }
)

export const registerAsync = (onSuccessUrl) => (
  async (dispatch, getState) => {
    dispatch(authRequestStarted())

    const auth = getState().get("auth")
    const cart = getState().get("cart")
    const order = getState().get("order")
    const shouldRedirectOnSuccess = auth.get("shouldRedirectOnSuccess")

    const userInfo = {
      email: auth.get("email"),
      first_name: auth.get("firstName"),
      last_name: auth.get("lastName"),
      password: auth.get("password"),
    }

    const orderInfo = {
      cart_number: cart.get("number") || order.get("number"), // Cart state is empty on confimation page. Get from order state
      cart_token: cart.get("token") || order.get("token"), // Cart state is empty on confimation page. Get from order state
    }

    const termsAndPrivacy = {
      accept_terms_of_service: true,
      accept_privacy_policy: true,
    }

    // CCPA Optout if OptanonConsent cookie already exist
    const optanonConsentCookieId = SodCookieHelper.getSodCookie()

    const userAndOrderInfo = Object.assign({},
      userInfo,
      orderInfo,
      termsAndPrivacy,
      { optanonConsentCookieId },
    )

    let redirectUrl

    try {
      const response = await AuthenticationApi.createAccount(userAndOrderInfo)

      redirectUrl = shouldRedirectOnSuccess
        ? getRedirectUrl(getState().get("currentPage"), onSuccessUrl)
        : null

      dispatch(userRegistered(
        response.data.get("firstName"),
        response.data.get("lastName"),
        response.data.get("email"),
        response.data.get("externalId"),
        response.data.get("authenticationToken"),
        response.data.get("id"),
        redirectUrl,
      ))

      const requestedSavedItem = getState().getIn(["savedItems", "requestedItem"])
      if (!requestedSavedItem.isEmpty()) {
        dispatch(savedItemsAddRequestedItemAsync())
      }

    } catch (error) {
      const debugMessage = `registerAsync - redirectUrl: ${ redirectUrl }, shouldRedirectOnSuccess: ${ shouldRedirectOnSuccess }`
      dispatch(authFailed(error.status, error.message, error.data, debugMessage))
      Rollbar.error("User Registration Failed", formatHttpError(error))
    }

    dispatch(authRequestCompleted())
  }
)

export const recoverPasswordAsync = () => (
  async (dispatch, getState) => {
    const email = getState().getIn(["auth", "email"])

    // if no email is set, trigger validation warning before trying to recover password
    const errorMessage = emailRegex(email.trim(), "email")
    if (errorMessage !== null) {
      dispatch(inlineValidation("email", errorMessage))
      return
    }

    dispatch(authRequestStarted())
    try {
      await AuthenticationApi.recoverPassword(email)
      Navigate.recoverPassword()

    } catch (error) {
      const debugMessage = `recoverPasswordAsync`
      dispatch(authFailed(error.status, error.message, error.data, debugMessage))
      Rollbar.error("recoverPasswordAsync: ", formatHttpError(error))
    }

    dispatch(authRequestCompleted())
  }
)

export const resetPasswordAsync = () => (
  async (dispatch, getState) => {
    dispatch(authRequestStarted())
    const token = getState().getIn(["auth", "resetPasswordToken"])
    const newPassword = getState().getIn(["auth", "newPassword"])

    try {
      await AuthenticationApi.resetPassword(newPassword, token)
      dispatch(resetPasswordSucceeded())
    } catch (error) {
      dispatch(resetPasswordFailed(error.status, error.message, error.data))
    }

    dispatch(authRequestCompleted())
  }
)

export const logoutAsync = (categoryName, level, link) => (
  async (dispatch, getState) => {
    dispatch(authRequestStarted())
    dispatch(userLogoutStarted(categoryName, level, link))

    try {
      const authenticationToken = getState().getIn(["auth", "authenticationToken"])
      await AuthenticationApi.logout(authenticationToken)
    } catch (error) {
      Rollbar.error("Destroy User Token Failed", formatHttpError(error))
    }

    const logoutAction = dispatch(userLoggedOut())
    dispatch(authRequestCompleted())
    return logoutAction
  }
)

export const ccpaLoginAsync = (skipLoggedInCheck = false) => (
  async (dispatch, getState) => {
    const encryptedValue = getState().getIn(["auth", "encryptedValue"])
    const encryptedParam = getState().getIn(["auth", "encryptedParam"])
    const otpResult = getState().getIn(["auth", "encryptedValue", "otpResult"])
    const isLoggedIn = getState().getIn(["auth", "isLoggedIn"])

    if (skipLoggedInCheck || isLoggedIn) {
      if (otpResult == "false") {
        dispatch(submitCCPARequestFailed())
        Rollbar.error("CCPA Request Failed", formatHttpError(new Error("otp failed")))
        return
      }
      try {
        dispatch(submitCCPARequestStarted())
        await CCPAApi.access(encryptedValue, 1)
      } catch (error) {
        dispatch(submitCCPARequestFailed(error.data))
        Rollbar.error("CCPA Request Failed", formatHttpError(error))
        return
      }
      dispatch(submitCCPARequestCompleted())
      Navigate.ccpa(encryptedParam)
      return
    }

    try {
      dispatch(submitCCPARequestStarted())
      const response = await AuthenticationApi.checkEmail(encryptedParam)
      if (response.data.get("hasAccount")) {
        if (otpResult == "false") {
          dispatch(submitCCPARequestFailed())
          Rollbar.error("CCPA Request Failed", formatHttpError(new Error("otp failed")))
          return
        }
        dispatch(toggleCCPALogin())
        return
      } else if (response.data.get("isGuest")) {
        await CCPAApi.access(encryptedValue, 2)
      } else {
        await CCPAApi.access(encryptedValue, 3)
      }
    } catch (error) {
      dispatch(submitCCPARequestFailed(error))
      Rollbar.error("CCPA Request Failed", formatHttpError(error))
      return
    }
    dispatch(submitCCPARequestCompleted())
    Navigate.ccpa(encryptedParam)
  }
)

export const ccpaOptoutAsync = () => (
  async (dispatch, getState) => {
    const encryptedValue = getState().getIn(["auth", "encryptedValue"])
    const isLoggedIn = getState().getIn(["auth", "isLoggedIn"])
    const accountType = isLoggedIn ? 1 : 3
    const email = getState().getIn(["auth", "email"])
    const authToken = getState().getIn(["auth", "authenticationToken"])
    try {
      dispatch(submitCCPARequestStarted())
      await CCPAApi.optout(encryptedValue, accountType)
      if (isLoggedIn)
        CCPAApi.saveOptOutStatus(authToken, email)
    } catch (error) {
      dispatch(submitCCPARequestFailed(error))
      Rollbar.error("CCPA Request Failed", formatHttpError(error))
      return
    }
    dispatch(submitCCPARequestCompleted())
  }
)

export const decryptCCPAAsync = (encryptedParam) => (
  async (dispatch) => {
    dispatch(ccpaParamReceived(encryptedParam))
    try {
      dispatch(submitCCPARequestStarted())
      const response = await CCPAApi.decrypt(encryptedParam)
      dispatch(toggleCCPALogin())
      dispatch(ccpaParamDecrypted(response.data))
    } catch (error) {
      dispatch(submitCCPARequestFailed())
      Rollbar.error("CCPA Request Failed", formatHttpError(error))
      return
    }
    dispatch(submitCCPARequestCompleted())
  }
)

export const ccpaRedirectAsync = () => (
  async (dispatch, getState) => {
    const email = getState().getIn(["auth", "email"])
    const timestamp = (new Date).getTime().toString()
    const typeOfRedirect = getState().getIn(["auth", "ccpaRedirectType"])
    try {
      if (typeOfRedirect) {
        const response = await CCPAApi.encrypt(email, timestamp)
        Navigate.ccpaAffirmation(typeOfRedirect, response.data.encryptedValue)
      } else {
        Navigate.redirect()
      }
    } catch (error) {
      dispatch(submitCCPARequestFailed(error))
      Rollbar.error("CCPA Request Failed", formatHttpError(error))
    }
  }
)
