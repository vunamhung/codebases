// stateReconcilerMap defines the areas of state that should be mainted in the client
// Be aware that when navigating directly to a static page, that client state will be empty
const STATE_RECONCILER_MAP = {
  cart: true,
  auth: ["resetPasswordToken", "encryptedValue", "encryptedParam"],
  browser: true,
  order: true,
  tippyTop: true,
}

export const reconcileState = (pageState, currentState) => (
  pageState.mergeWith((pageSubState, currentSubState, key) => {
    if (STATE_RECONCILER_MAP[key] === undefined) return pageSubState
    if (STATE_RECONCILER_MAP[key] === true) return currentSubState

    // Assumes that STATE_RECONCILER_MAP operates as include all except the listed keys
    let newSubState = currentSubState
    STATE_RECONCILER_MAP[key].forEach((key) => {
      if (pageSubState.get(key) !== undefined) newSubState = newSubState.set(key, pageSubState.get(key))
    })
    return newSubState
  }, currentState)
)