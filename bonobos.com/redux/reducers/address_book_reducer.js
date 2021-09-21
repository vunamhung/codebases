import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  actionDialogStep: "view",
  addresses: [],
  isActionDialogLoading: false,
  isActionDialogOpen: false,
})

const addressBookReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.ADDRESS_BOOK_FETCH_SUCCEEDED:
      return state.set("addresses", action.addresses)

    case ActionTypes.ADDRESS_BOOK_ACTION_DIALOG_OPEN_CLICKED:
      return state.set("isActionDialogOpen", true)

    case ActionTypes.ADDRESS_BOOK_ACTION_DIALOG_CLOSE_CLICKED:
      return state.merge({
        actionDialogStep: "view",
        isActionDialogOpen: false,
      })

    case ActionTypes.ADDRESS_BOOK_ACTION_DIALOG_NEW_CLICKED:
      return state.set("actionDialogStep", "new")

    case ActionTypes.ADDRESS_BOOK_EDIT_CLICKED:
      return state.set("actionDialogStep", "edit")

    case ActionTypes.ADDRESS_BOOK_DELETE_SUCCEEDED:
    case ActionTypes.ADDRESS_BOOK_UPDATE_SUCCEEDED:
      return state.merge({
        actionDialogStep: "view",
        addresses: action.addresses,
      })

    case ActionTypes.ADDRESS_BOOK_ACTION_DIALOG_BACK_CLICKED:
      return state.set("actionDialogStep", "view")

    case ActionTypes.ADDRESS_BOOK_REQUEST_STARTED:
      return state.set("isActionDialogLoading", true)

    case ActionTypes.ADDRESS_BOOK_REQUEST_COMPLETED:
      return state.set("isActionDialogLoading", false)

    default:
      return state
  }
}

export default addressBookReducer
