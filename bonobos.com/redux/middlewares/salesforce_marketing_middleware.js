import ActionTypes from "highline/redux/action_types"
import * as Cookies from "highline/utils/cookies"
import { extractQueryParams } from "highline/utils/url"

export const SFMC_KEY = "sfmcEmailCampaign"

/*
Only set the sfmcEmailCampaign cookie if all of the following parameters are present: 
j        - Job ID (identifier of this email)
jb       - Job batch ID
l        - List ID
mid      - Your account number (member ID)
sfmc_sub - Subscriber ID
u        - ID of the landing page URL
*/

const salesforceMarketingMiddleware = () => (next) => (action) => {
  switch (action.type) {
    case ActionTypes.PAGE_LOADED:
      const query = extractQueryParams(window.location.search)

      if (!query)
        break

      const j = query.j
      const jb = query.jb
      const l = query.l
      const mid = query.mid
      const sfmc_sub = query.sfmc_sub
      const u = query.u

      if ( j && jb && l && mid && sfmc_sub && u ) {
        Cookies.set(SFMC_KEY, { j, jb, l, mid, sfmc_sub, u })
      }
      break

    case ActionTypes.ORDER_CONFIRMATION_VIEWED:
      Cookies.set(SFMC_KEY, null)
      break
    
    /* 
      TODO: After salesforce chat is refactored as a React component, update state in the
      contentful_reducer.js rather than rely on this global method

      Details: The salesforce chat is currently not connected to state. Until this 
      is refactored, we're using this middleware to open the chat box as a "side effect" 
      of the CONTENTFUL_CHAT_TRIGGER_CLICKED action.
      This method for opening the chat box is defined in `salesforce_live_agent.js`
    */
    case ActionTypes.CONTENTFUL_CHAT_TRIGGER_CLICKED:
      if (window.embedded_svc && window.embedded_svc.onHelpButtonClick) {
        window.embedded_svc.onHelpButtonClick()
      }
      break
  }

  return next(action)
}

export default salesforceMarketingMiddleware
