import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  data: {},
  showModal: false,
})

const newCustomerModalReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.NEW_CUSTOMER_MODAL_LOADED:
      return state.merge({ data: action.data, showModal: true })

    case ActionTypes.NEW_CUSTOMER_MODAL_DISMISSED:
      return state.set("showModal", false)

    default:
      return state
  }
}

export default newCustomerModalReducer
