import ActionTypes from "highline/redux/action_types"

export const leftDrawerCloseStarted = () => ({
  type: ActionTypes.LEFT_DRAWER_CLOSE_STARTED,
})

export const leftDrawerCloseFinished = () => ({
  type: ActionTypes.LEFT_DRAWER_CLOSE_FINISHED,
})

export const leftDrawerOpenClicked = (contents) => ({
  type: ActionTypes.LEFT_DRAWER_OPEN_CLICKED,
  contents,
})

export const leftDrawerLeftCTAClicked = () => ({
  type: ActionTypes.LEFT_DRAWER_LEFT_CTA_CLICKED,
})

const LEFT_DRAWER_OVERLAY_DURATION = 500

export const leftDrawerCloseAsync = () => (
  async (dispatch) => {
    dispatch(leftDrawerCloseStarted())
    setTimeout(() => {
      return dispatch(leftDrawerCloseFinished())
    }, LEFT_DRAWER_OVERLAY_DURATION)
  }
)
