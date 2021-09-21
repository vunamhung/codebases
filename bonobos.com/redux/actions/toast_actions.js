import ActionTypes from "highline/redux/action_types"

export const addToast = (toast) => ({
  toast,
  type: ActionTypes.TOAST_ADDED,
})

export const showToast = () => ({
  type: ActionTypes.TOAST_DISPLAYED,
})

export const dismissToast = () => ({
  type: ActionTypes.TOAST_DISMISSED,
})

export const toastHasDismissed = () => (
  (dispatch, getState) => {
    const state = getState()
    if (state.getIn(["toast", "toasts"]).size > 0) {
      dispatch(showToast())
    }
  }
)
