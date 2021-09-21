import ActionTypes from "highline/redux/action_types"
import { isCompatible, upgradeUrl } from "highline/utils/browser"
import { getItem } from "highline/storage/session_storage"

export const unsupportedBrowserVersionDetected = (upgradeUrl) => ({
  type: ActionTypes.UNSUPPORTED_BROWSER_VERSION_DETECTED,
  upgradeUrl,
})

export const compatibilityModalCloseClicked = () => ({
  type: ActionTypes.COMPATIBILITY_MODAL_CLOSE_CLICKED,
})

export const checkBrowserCompatibility = () => (
  (dispatch) => {
    if (!isCompatible() && !getItem("browserCompatibilityModalSeen")) {
      dispatch(unsupportedBrowserVersionDetected(upgradeUrl()))
    }
  }
)
