import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  actionDialogStep: "view",
  isActionDialogLoading: false,
  isActionDialogOpen: false,
  payments: [],
})

const walletReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.WALLET_BACK_CLICKED:
      return state.set("actionDialogStep", "view")

    case ActionTypes.WALLET_CLOSE_CLICKED:
      return state.set("isActionDialogOpen", false)
        .set("actionDialogStep", "view")

    case ActionTypes.WALLET_ADD_NEW_PAYMENT_CLICKED:
      return state.set("actionDialogStep", "new")

    case ActionTypes.WALLET_ADD_PAYMENT_SUCCEEDED:
      return state.set("payments", action.payments)
        .set("isActionDialogOpen", true)
        .set("actionDialogStep", "view")

    case ActionTypes.WALLET_DELETE_PAYMENT_SUCCEEDED:
    case ActionTypes.WALLET_FETCH_SUCCEEDED:
      return state.set("payments", action.payments)

    case ActionTypes.WALLET_REQUEST_STARTED:
      return state.set("isActionDialogLoading", true)

    case ActionTypes.WALLET_OPEN_CLICKED:
      return state.set("isActionDialogOpen", true)

    case ActionTypes.WALLET_REQUEST_COMPLETED:
      return state.set("isActionDialogLoading", false)

    case ActionTypes.WALLET_AFFIRM_CHECKOUT_SUCCEEDED:
      return state.set("isActionDialogOpen", false)

    default:
      return state
  }
}

export default walletReducer
