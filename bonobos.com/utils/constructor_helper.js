export const constructorItemId = (item) => {
  const color = item.getIn(["options", "color"])
  const id = item.get("productId")
  return `${id}${color ? `-${color}` : ""}` // i think there will always be color and this might be unnecessary
}

// Should return a plain JS array of individual items, separating multiple quantities of the same variant
export const convertOrderItemsForConstructorTracking = (orderItems) => (
  orderItems.reduce((accItemArr, curItem) => {
    const timesToAddItem = curItem.get("quantity")

    for (let numberOfTimesItemAdded = 0; numberOfTimesItemAdded < timesToAddItem; numberOfTimesItemAdded++) {
      accItemArr.push({
        item_id: constructorItemId(curItem),
        variation_id: curItem.get("sku"),
      })
    }

    return accItemArr
  }, [])
)
