import { fromJS, Map } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  browserUpgradeUrl: "",
  showCompatibilityModal: false,
})

const browserReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.UNSUPPORTED_BROWSER_VERSION_DETECTED:
      return state.merge(Map({
        browserUpgradeUrl: action.upgradeUrl,
        showCompatibilityModal: true,
      }))
    case ActionTypes.COMPATIBILITY_MODAL_CLOSE_CLICKED:
      return state.set("showCompatibilityModal", false)

    default:
      return state
  }
}

export default browserReducer
