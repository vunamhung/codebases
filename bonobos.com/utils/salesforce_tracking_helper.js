import {
  salesforceChatClicked,
  salesforceChatEstablished,
} from "highline/redux/actions/application_layout_actions"

export const onSalesforceChatClicked = (dispatch) => () => dispatch(salesforceChatClicked())

export const onSalesforceChatEstablished = (dispatch) => (liveAgentSessionKey) => (
  dispatch(salesforceChatEstablished(liveAgentSessionKey))
)