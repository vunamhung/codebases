
// Toggles the state of the order detail on a specific shipment, if the state is not
// found, set it to true
export const toggleOrderDetails = (state, shipmentNumber) => {
  const currentState = state.getIn(["detailsToggleState", shipmentNumber])
  return state.setIn(["detailsToggleState", shipmentNumber], !currentState)
}

export const toggleOrderReturn = (state, shipmentNumber) => {
  const currentState = state.getIn(["returnToggleState", shipmentNumber])
  return state.setIn(["returnToggleState", shipmentNumber], !currentState)
}