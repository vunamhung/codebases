import { List, Map, fromJS } from "immutable"
import { extractQueryParams } from "highline/utils/url"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  displayedTerm: "",
  fetchCompleted: false,
  isLoading: false,
  pageLoaded: false,
  searchSource: "",
  searchTerm: "",
  shouldMobileSearchFocusAfterOpening: false,
  term: "",
  items: [],
  itemsDetails: {},
})

const searchReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.PAGE_LOADED:
      state = action.pageCategory === "Search"
        ? state.merge({
          pageLoaded: true,
          searchTerm: setInitialSearchTerm(),
        })
        : state.set("pageLoaded", false)
      return state

    case ActionTypes.CLIENT_ROUTE_CHANGED:
      if (action.pageCategory === "Search")
        return state.set("shouldMobileSearchFocusAfterOpening", false)

      return state.merge({
        shouldMobileSearchFocusAfterOpening: false,
        term: "",
      })

    case ActionTypes.SEARCH_FETCH_STARTED:
      return state.merge({
        fetchCompleted: false,
        isLoading: true,
      })

    case ActionTypes.SEARCH_FETCH_SUCCEEDED: {
      return state.merge({
        displayedTerm: state.get("searchTerm"),
        fetchCompleted: true,
        isLoading: false,
        items: action.data.get("items"),
        itemsDetails: action.data.get("itemsDetails"),
      })
    }

    case ActionTypes.SEARCH_FETCH_FAILED:
      return state.merge({
        displayedTerm: state.get("searchTerm"),
        fetchCompleted: true,
        isLoading: false,
        items: List(),
        itemsDetails: Map(),
      })

    case ActionTypes.SEARCH_INPUT_CHANGED:
      return state.merge({
        [action.name]: action.value,
      })

    case ActionTypes.SEARCH_PRODUCT_VARIANT_ACTIVATED: {
      return state.setIn(["itemsDetails", action.itemKey, "activatedSwatchIndex"], action.index)
    }

    case ActionTypes.SEARCH_PRODUCT_VARIANT_SELECTED: {
      return state.setIn(["itemsDetails", action.itemKey, "selectedSwatchIndex"], action.index)
    }

    case ActionTypes.SEARCH_PRODUCT_VARIANT_DEACTIVATED: {
      return state.setIn(["itemsDetails", action.itemKey, "activatedSwatchIndex"], null)
    }

    case ActionTypes.MOBILE_SEARCH_BAR_OPENED_FROM_HEADER:
      return state.merge({
        "placement": "mobile",
        "shouldMobileSearchFocusAfterOpening": true,
      })

    case ActionTypes.MOBILE_SEARCH_BAR_FOCUS_COMPLETE:
      return state.merge({
        "shouldMobileSearchFocusAfterOpening": false,
      })

    case ActionTypes.SEARCH_SUBMITTED:
      return state.set("searchTerm", action.term)
    
    case ActionTypes.SEARCH_SET_SOURCE:
      return state.set("searchSource", action.source)

    default:
      return state
  }
}

function setInitialSearchTerm() {
  const params = fromJS(extractQueryParams(window.location.search))
  return params.get("term")
}

export default searchReducer
