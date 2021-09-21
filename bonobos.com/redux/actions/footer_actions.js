import ActionTypes from "highline/redux/action_types"

export const footerLinkClicked = (url, name) => ({
  type: ActionTypes.FOOTER_LINK_CLICKED,
  url,
  name,
})

export const submitCCPARequestFailed = () => ({
  type: ActionTypes.SUBMIT_CCPA_REQUEST_FAILED,
})
