import ActionTypes from "highline/redux/action_types"
import Router from "next/router"

export const RIGHT_DRAWER_OVERLAY_DURATION = 500

export const productPreviewClosed = () => ({
  type: ActionTypes.PRODUCT_PREVIEW_CLOSED,
})

export const rightDrawerCloseStarted = () => ({
  type: ActionTypes.RIGHT_DRAWER_CLOSE_STARTED,
})

export const rightDrawerCloseFinished = () => ({
  type: ActionTypes.RIGHT_DRAWER_CLOSE_FINISHED,
})

export const openRightDrawer = () => ({
  type: ActionTypes.RIGHT_DRAWER_OPEN_CLICKED,
})

export const swapRightDrawerContents = (contents) => ({
  type: ActionTypes.RIGHT_DRAWER_CONTENTS_CHANGED,
  contents,
})

export const productPreviewViewDetailsClicked = () => ({
  type: ActionTypes.PRODUCT_PREVIEW_VIEW_DETAILS_CLICKED,
})

export const productPreviewViewDetailsClickedAsync = (route) => (
  async (dispatch) => {
    dispatch(productPreviewViewDetailsClicked())
    dispatch(rightDrawerCloseAsync("quickShop"))
    setTimeout(() => {
      Router.push(route.get("as"))
    }, RIGHT_DRAWER_OVERLAY_DURATION)
  }
)

export const rightDrawerCloseAsync = (contents) => (
  async (dispatch) => {
    dispatch(rightDrawerCloseStarted())
    setTimeout(() => {
      if (contents === "quickShop") {
        dispatch(productPreviewClosed())
      }
      return dispatch(rightDrawerCloseFinished())
    }, RIGHT_DRAWER_OVERLAY_DURATION)
  }
)
