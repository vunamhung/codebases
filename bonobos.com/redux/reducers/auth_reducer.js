import { Map, fromJS } from "immutable"
import * as UserAuthStorage from "highline/storage/user_auth_storage"
import * as UserStorage from "highline/storage/user_storage"
import ActionTypes from "highline/redux/action_types"
import Rollbar from "highline/utils/rollbar"

const initialState = fromJS({
  authenticationToken: null,
  ccpaRedirectType: "",
  email: "",
  encryptedValue: Map(),
  encryptedParam: "",
  error: Map(),
  externalId: null,
  firstName: "",
  isBonobosUser: false,
  isLoading: false,
  isLoggedIn: false,
  lastName: "",
  password: "",
  passwordResetSuccess: false,
  newPassword: "",
  shouldRedirectOnSuccess: true,
  termsAndPrivacyAccepted: true, // show terms banner when false
  userId: null,
  useSignInForm: true,
  validEmail: false,
  ccpaRequestFailed: false,
  shouldShowResetPasswordPrompts: false,
})

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.AUTH_REQUEST_STARTED:
      return state.set("isLoading", true)

    case ActionTypes.AUTH_REQUEST_COMPLETED:
      return state.set("isLoading", false)

    case ActionTypes.PAGE_LOADED:
      return updateFromStorage(state)

    case ActionTypes.RESET_PASSWORD_FAILED:
    case ActionTypes.AUTH_FAILED: {
      let error = action.error
      if (!Map.isMap(error)) {
        Rollbar.info(
          "Received non-Map error during auth call",
          {
            status: action.status,
            message: action.message,
            error,
            debugMessage: action.debugMessage,
          },
        )
        error = Map() // If error field in state is not an immutable Map, .setIn will error
      }
      return state.set("error", error)
    }

    case ActionTypes.TOGGLE_EXISTING_USER_LOGIN:
      return state.merge({
        useSignInForm: !state.get("useSignInForm"),
      })

    case ActionTypes.TOGGLE_CCPA_LOGIN:
      return state.merge({
        hideForms: state.get("hideForms"),
      })

    case ActionTypes.AUTH_INPUT_CHANGED:
      return state.set(action.name, action.value)

    case ActionTypes.CART_UNAUTHORIZED_CHECKOUT_STARTED:
      return state.merge({
        email: "",
        firstName: "",
        isBonobosUser: false,
        lastName: "",
        password: "",
        error: Map(),
        validEmail: false,
      })

    case ActionTypes.RESET_PASSWORD_SUCCEEDED:
      return state.set("resetPasswordSuccess", true)

    case ActionTypes.AUTH_CLEARED_AND_REDIRECTED:
    case ActionTypes.USER_LOGGED_OUT:
      return initialState

    case ActionTypes.USER_REGISTERED:
    case ActionTypes.USER_LOGGED_IN:
      return state.merge({
        authenticationToken: action.authenticationToken,
        email: action.email,
        firstName: action.firstName,
        isBonobosUser: determineIfBonobosUser(action.email),
        isLoggedIn: true,
        lastName: action.lastName,
        userId: action.userId,
      })

    case ActionTypes.RESET_PASSWORD_LOADED_WITH_QUERY_TOKEN:
      return state.merge({
        resetPasswordToken: action.token,
      })

    case ActionTypes.RESET_PASSWORD_FORCED:
      return state.set("shouldShowResetPasswordPrompts", true)

    case ActionTypes.SAVED_ITEMS_UNAUTHENTICATED_ADD_CLICKED:
    case ActionTypes.SAVE_TO_MY_FIT_CLICKED:
      return state.set("shouldRedirectOnSuccess", false)

    case ActionTypes.RIGHT_DRAWER_CLOSE_FINISHED:
      return state.set("shouldRedirectOnSuccess", true)

    case ActionTypes.INLINE_VALIDATION_FAILED:
      return state.setIn(["error", "errors", "user", action.name], fromJS([[action.errorMessage]]))

    case ActionTypes.INLINE_VALIDATION_SUCCESS:
      return state.setIn(["error", "errors", "user", action.name], null)

    case ActionTypes.CCPA_PARAM_DECRYPTED:
      return state.set("encryptedValue", fromJS(action.encryptedValue))

    case ActionTypes.CCPA_PARAM_RECEIVED:
      return state.set("encryptedParam", fromJS(action.encryptedParam))

    case ActionTypes.CCPA_REDIRECT_REQUESTED:
      return state.set("ccpaRedirectType", fromJS(action.ccpaRedirectType))

    case ActionTypes.SUBMIT_CCPA_REQUEST_FAILED:
      return state.set("ccpaRequestFailed", true)

    default:
      return state
  }
}

function updateFromStorage(state) {
  const { authenticationToken, userId } = UserAuthStorage.load()
  const { externalId, email, firstName, lastName } = UserStorage.load()

  return state.merge(Map({
    authenticationToken,
    email: email || "",
    externalId,
    firstName,
    isBonobosUser: determineIfBonobosUser(email),
    isLoggedIn: Boolean(authenticationToken),
    lastName,
    userId,
  }))
}

function determineIfBonobosUser(email) {
  return /.*@bonobos.com$/.test(email)
}

export default authReducer
