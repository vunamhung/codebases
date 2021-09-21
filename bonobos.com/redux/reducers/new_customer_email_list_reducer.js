import { fromJS, Map } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  email: "",
  error: {},
  isLoading: false,
  subscribed: false,
})

const newCustomerEmailListReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.NEW_CUSTOMER_EMAIL_LIST_EMAIL_CHANGED:
      return state.set("email", action.email)

    case ActionTypes.NEW_CUSTOMER_EMAIL_LIST_MAILING_LIST_FAILED: {
      const errorMessage = (action.error && action.error.getIn(["errors", "userLead", 0])) || "Something went wrong"

      return state.merge({
        error: { email: errorMessage },
        isLoading: false,
      })
    }
    case ActionTypes.NEW_CUSTOMER_EMAIL_LIST_MAILING_LIST_STARTED:
      return state.set("isLoading", true)

    case ActionTypes.NEW_CUSTOMER_EMAIL_LIST_MAILING_LIST_SUCCEEDED:
      return state.merge({
        error: Map(),
        isLoading: false,
        subscribed: true,
      })

    default:
      return state
  }
}

export default newCustomerEmailListReducer
