import * as CompletedOrderStorage from "highline/storage/completed_order_storage"

import ActionTypes from "highline/redux/action_types"

const completedOrderStorageMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    case ActionTypes.SUBMIT_ORDER_REQUEST_STARTED:
    case ActionTypes.APPLE_PAY_ORDER_REQUEST_STARTED: {
      const orderFromState = store.getState().get("order")

      const order = {
        isFirstCompletedOrder: orderFromState.get("isFirstCompletedOrder"),
        number: orderFromState.get("number"),
        total: orderFromState.get("total"),
        promoCode: orderFromState.getIn(["promotion", "code"]),
        promotionTotal: orderFromState.getIn(["promotion", "totalNumeric"]),
        revenue: orderFromState.get("revenue"),
        items: orderFromState.get("items").map((item)=>({
          sku: item.get("sku"),
          name: item.get("name"),
          price: item.get("discountedTotal"),
          fullPrice: item.get("fullPriceNumeric"),
          quantity: item.get("quantity"),
        })).toJS(),
      }

      CompletedOrderStorage.save(order)
      break
    }

    case ActionTypes.APPLE_PAY_ORDER_SUBMIT_COMPLETE_FAILED:
    case ActionTypes.ORDER_SUBMIT_COMPLETE_FAILED:
    case ActionTypes.CHECKOUT_STARTED: {
      CompletedOrderStorage.remove()
      break
    }
  }

  return next(action)
}

export default completedOrderStorageMiddleware
