import ActionTypes from "highline/redux/action_types"

export const browserHistoryNavigated = (historyEvent) => ({
  type: ActionTypes.BROWSER_HISTORY_NAVIGATED,
  historyEvent,
})

export const pageLoaded = (pageCategory, title) => ({
  type: ActionTypes.PAGE_LOADED,
  pageCategory,
  title,
})

export const routeChangeStarted = (url) => ({
  type: ActionTypes.CLIENT_ROUTE_CHANGE_STARTED,
  url,
})

export const routeChanged = (pageCategory, url) => ({
  type: ActionTypes.CLIENT_ROUTE_CHANGED,
  pageCategory,
  url,
})

// Client-side navigating between the same dynamic pages (Category or PDP)
// does not trigger a PAGE_LOADED event. We detect that change client-side here.
export const routeChangedAsync = (pageCategory, title, url) => (
  (dispatch, getState) => {

    const prevPage = getState().getIn(["currentPage", "path"])

    const action = dispatch(routeChanged(pageCategory, url))

    // Navigate from one category to another
    if (pageCategory == "Category" && prevPage.startsWith("/shop")) {
      dispatch(pageLoaded(pageCategory, title))

    // Navigate from one PDP to another
    } else if (pageCategory == "Product" && prevPage.startsWith("/products")) {
      dispatch(pageLoaded(pageCategory, title))
    }

    return action
  }
)

export const salesforceChatClicked = () => ({
  type: ActionTypes.SALESFORCE_CHAT_CLICKED,
})

export const salesforceChatEstablished = (liveAgentChatSessionKey) => ({
  liveAgentChatSessionKey,
  type: ActionTypes.SALESFORCE_CHAT_ESTABLISHED,
})

export const currentPageInit = (path, query) => ({
  path,
  query,
  type: ActionTypes.CURRENT_PAGE_INIT,
})
