import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"
import * as SavedItemsApi from "highline/api/saved_items_api"
import { rightDrawerCloseAsync } from "highline/redux/actions/right_drawer_actions"

export const savedItemsAddProductFailed = (error) => ({
  type: ActionTypes.SAVED_ITEMS_ADD_PRODUCT_FAILED,
  error,
})

export const savedItemsAddProductStarted = () => ({
  type: ActionTypes.SAVED_ITEMS_ADD_PRODUCT_STARTED,
})

export const savedItemsAddProductSucceeded = (data, item, location) => ({
  type: ActionTypes.SAVED_ITEMS_ADD_PRODUCT_SUCCEEDED,
  data,
  item,
  location,
})

export const savedItemsAddProductCompleted = () => ({
  type: ActionTypes.SAVED_ITEMS_ADD_PRODUCT_COMPLETED,
})

export const savedItemsRemoveProductFailed = (error) => ({
  type: ActionTypes.SAVED_ITEMS_REMOVE_PRODUCT_FAILED,
  error,
})

export const savedItemsRemoveProductStarted = () => ({
  type: ActionTypes.SAVED_ITEMS_REMOVE_PRODUCT_STARTED,
})

export const savedItemsRemoveProductSucceeded = (data, item, location) => ({
  type: ActionTypes.SAVED_ITEMS_REMOVE_PRODUCT_SUCCEEDED,
  data,
  item,
  location,
})

export const savedItemsRemoveProductCompleted = () => ({
  type: ActionTypes.SAVED_ITEMS_REMOVE_PRODUCT_COMPLETED,
})

export const savedItemsFetchCompleted = () => ({
  type: ActionTypes.SAVED_ITEMS_FETCH_COMPLETED,
})

export const savedItemsFetchFailed = (error) => ({
  type: ActionTypes.SAVED_ITEMS_FETCH_FAILED,
  error,
})

export const savedItemsFetchStarted = () => ({
  type: ActionTypes.SAVED_ITEMS_FETCH_STARTED,
})

export const savedItemsFetchSucceeded = (data) => ({
  data,
  type: ActionTypes.SAVED_ITEMS_FETCH_SUCCEEDED,
})

export const savedItemsPublicLinkClicked = () => ({
  type: ActionTypes.SAVED_ITEMS_PUBLIC_LINK_CLICKED,
})

export const savedItemsEmptyListLinkClicked = () => ({
  type: ActionTypes.SAVED_ITEMS_EMPTY_LIST_LINK_CLICKED,
})

export const savedItemsUnauthenticatedAddClicked = (requestedItem, requestedLocation) => ({
  type: ActionTypes.SAVED_ITEMS_UNAUTHENTICATED_ADD_CLICKED,
  requestedLocation,
  requestedItem,
})

export const savedItemsFetchAsync = () => (
  async (dispatch, getState) => {
    const authToken = getState().getIn(["auth", "authenticationToken"])
    if (!authToken)
      return

    dispatch(savedItemsFetchStarted())

    try {
      const response = await SavedItemsApi.fetch(authToken)
      if (response.data)
        dispatch(savedItemsFetchSucceeded(response.data))

    } catch (error) {
      dispatch(savedItemsFetchFailed(error))
    }

    return dispatch(savedItemsFetchCompleted())
  }
)

export const savedItemsPublicFetchAsync = (wishlistId) => (
  async (dispatch) => {
    dispatch(savedItemsFetchStarted())

    try {
      const response = await SavedItemsApi.publicFetch(wishlistId)
      if (response.data)
        dispatch(savedItemsFetchSucceeded(response.data))

    } catch (error) {
      dispatch(savedItemsFetchFailed(error.data.get("errors")))
    }

    return dispatch(savedItemsFetchCompleted())
  }
)

export const savedItemsAddProductAsync = (item, location) => (
  async (dispatch, getState) => {
    dispatch(savedItemsAddProductStarted())

    const authToken = getState().getIn(["auth", "authenticationToken"])

    try {
      const response = await SavedItemsApi.addItem(
        authToken,
        item.get("sku"),
        item.get("productSlug"),
        item.get("options"),
      )

      dispatch(savedItemsAddProductSucceeded(response.data, item, location))
    } catch (error) {
      dispatch(savedItemsAddProductFailed(error))
    }
    dispatch(savedItemsAddProductCompleted())
  }
)

export const savedItemsRemoveProductAsync = (item, location) => (
  async (dispatch, getState) => {
    dispatch(savedItemsRemoveProductStarted())

    const authToken = getState().getIn(["auth", "authenticationToken"])

    try {
      const response = await SavedItemsApi.removeItem(
        authToken,
        item.get("sku"),
        item.get("productSlug"),
        item.get("options"),
      )
      dispatch(savedItemsRemoveProductSucceeded(response.data, item, location))
    } catch (error) {
      dispatch(savedItemsRemoveProductFailed(error))
    }
    dispatch(savedItemsRemoveProductCompleted())
  }
)

export const savedItemCtaClickedAsync = (slug, selectedOptions, saved, location) => (
  async (dispatch, getState) => {
    const state = getState()

    const isLoggedIn = state.getIn(["auth", "isLoggedIn"])

    const itemPayload = fromJS({
      productSlug: slug,
      options: selectedOptions,
    })

    const addOrRemoveItemAction = saved
      ? savedItemsRemoveProductAsync
      : savedItemsAddProductAsync

    if (isLoggedIn) {
      dispatch(addOrRemoveItemAction(itemPayload, location))
    } else {
      dispatch(savedItemsUnauthenticatedAddClicked(itemPayload, location))
    }
  }
)

export const savedItemsAddRequestedItemAsync = () => (
  async (dispatch, getState) => {
    const state = getState()
    const requestedItem = state.getIn(["savedItems", "requestedItem"])
    const requestedLocation = state.getIn(["savedItems", "requestedLocation"])

    dispatch(rightDrawerCloseAsync())
    dispatch(savedItemsAddProductAsync(requestedItem, requestedLocation))
  }
)
