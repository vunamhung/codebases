import ActionTypes from "highline/redux/action_types"

export const emailCaptured = (location, email, list, externalID) => ({
  type: ActionTypes.EMAIL_CAPTURED,
  location,
  email,
  list,
  externalID,
})
