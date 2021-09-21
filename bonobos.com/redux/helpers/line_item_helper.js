export const getLineItem = (item, cart) => {
  const matchingLineItem = cart.get("items").find((lineItem) => {
    return lineItem.get("sku") === item.get("sku")
  })
  return item.merge(matchingLineItem).set("quantity", 1)
}
