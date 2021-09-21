import { fromJS, Map } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  email: "",
  errors: Map(),
  formErrors: Map(),
  isLoading: false,
  wasSucess: false,
})

const outOfStockSubscriptionReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.OUT_OF_STOCK_SUBSCRIPTION_EMAIL_CHANGED:
      return state.merge({
        email: action.email,
        formErrors: Map(),
        wasSucess: false,
      })

    case ActionTypes.OUT_OF_STOCK_SUBSCRIPTION_FORM_VALIDATION_FAILED:
      return state.merge({
        formErrors: action.formErrors,
        isLoading: false,
      })

    case ActionTypes.PRODUCT_DETAIL_OPTIONS_CHANGED:
    case ActionTypes.PRODUCT_PREVIEW_OPTIONS_CHANGED:
      return state.merge({
        email: "",
        errors: Map(),
        wasSucess: false,
      })

    case ActionTypes.OUT_OF_STOCK_SUBSCRIPTION_SUBMIT_FAILED:
      return state.merge({
        errors: Map({ message: action.message }),
        isLoading: false,
        wasSucess: false,
      })

    case ActionTypes.OUT_OF_STOCK_SUBSCRIPTION_SUBMIT_STARTED:
      return state.merge({
        errors: Map(),
        formErrors: Map(),
        isLoading: true,
        wasSucess: false,
      })

    case ActionTypes.OUT_OF_STOCK_SUBSCRIPTION_SUBMIT_SUCCEEDED:
      return state.merge({
        isLoading: false,
        wasSucess: true,
      })

    default:
      return state
  }
}

export default outOfStockSubscriptionReducer
