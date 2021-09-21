import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  currentSortOption: null,
  sortOptions: [],
  numItems: 0,
  isOpen: false,
})

const sortReducer = (state = initialState, action)  => {
  switch (action.type) {

    case ActionTypes.SORT_MOUSE_ENTERED:
      return state.set("isOpen", true)

    case ActionTypes.SORT_MOUSE_LEFT:
      return state.set("isOpen", false)

    case ActionTypes.SORT_DROPDOWN_CLICKED:
      return state.set("isOpen", !state.get("isOpen"))

    case ActionTypes.SORT_DROPDOWN_VALUE_CLICKED:
      return state.set("currentSortOption", action.sortOption)

    case ActionTypes.CATEGORY_PLP_FETCH_SUCCEEDED:
      return state.merge({
        sortOptions: action.data.get("sortOptions"),
        currentSortOption: state.get("currentSortOption") || action.data.getIn(["sortOptions", 0]),
        numItems: action.data.get("numResults"),
        isOpen: false,
      })

    case ActionTypes.CATEGORY_FETCH_SUCCEEDED:
      return state.merge({
        sortOptions: [],
        numItems: action.data.get("groups").reduce((accumulator, curr) => accumulator + curr.get("items").size, 0),
        isOpen: false,
      })

    case ActionTypes.SEARCH_FETCH_SUCCEEDED: {
      const isFromConstructor = !!action.data.get("items")
      return state.merge({
        sortOptions: action.data.get("sortOptions"),
        currentSortOption: state.get("currentSortOption") || action.data.getIn(["sortOptions", 0]),
        numItems: isFromConstructor ? action.data.get("items").size : action.data.get("products").size,
        isOpen: false,
      })
    }

    default:
      return state
  }
}

export default sortReducer
