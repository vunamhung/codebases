import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"
import { generateCategoryNavigationData } from "highline/redux/helpers/category_navigation_helper"
import { setupCategories } from "highline/redux/helpers/navigation_helper"

const initialState = fromJS({
  expandedItemSiblings: [],
  activeItem: {},
  categoryNavItems: [],
  expandedItem: {},
})

const categoryNavigationV2Reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.PAGE_LOADED: {
      const categoryNavItems = state.get("categoryNavItems")

      return action.pageCategory === "Category" && categoryNavItems.size > 0
        ? state.merge({ ...generateCategoryNavigationData(categoryNavItems, window.location.pathname) })
        : state
    }

    case ActionTypes.CATEGORY_NAVIGATION_V2_ITEM_EXPANDED:
      return state.set("expandedItem", action.item)

    case ActionTypes.CATEGORY_NAVIGATION_V2_ITEM_COLLAPSED:
      return state.set("expandedItem", fromJS({}))

    case ActionTypes.CATEGORY_NAVIGATION_V2_FETCH_SUCCEEDED: {
      const categoryNavItems = setupCategories(action.categories)

      return state.merge({
        categoryNavItems,
        ...generateCategoryNavigationData(categoryNavItems, action.path),
      })
    }

    default:
      return state
  }
}

export default categoryNavigationV2Reducer
