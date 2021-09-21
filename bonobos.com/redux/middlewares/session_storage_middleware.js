import ActionTypes from "highline/redux/action_types"
import { setItem } from "highline/storage/session_storage"

const sessionStorageMiddleware = () => (next) => (action) => {
  switch (action.type) {
    case ActionTypes.UNSUPPORTED_BROWSER_VERSION_DETECTED:
      setItem("browserCompatibilityModalSeen", true)
      break
  }

  return next(action)
}

export default sessionStorageMiddleware
