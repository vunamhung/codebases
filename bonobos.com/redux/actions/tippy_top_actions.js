import ActionTypes from "highline/redux/action_types"

export const detailsToggled = () => ({
  type: ActionTypes.TIPPY_TOP_DETAILS_TOGGLED,
})

export const tippyTopHeightHasChanged = (height) => ({
  height,
  type: ActionTypes.TIPPY_TOP_HEIGHT_CHANGED,
})

export const tippyTopDismissClicked = () => ({
  type: ActionTypes.TIPPY_TOP_DISMISSED,
})