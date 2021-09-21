export const registerInputEvents = () => {
  document.addEventListener("keydown", handleKeyboardEvent)
  document.addEventListener("touchstart", handleTouchEvents)
  document.addEventListener("mousemove", handleMouseEvents)

  // We only need to call this function once. It will set the
  // data-touch-events-supported attribute and we can use this
  // throughout the application
  setTouchEventsSupported()
}

function addMouseEvents() {
  document.addEventListener("mousemove", handleMouseEvents)
  document.addEventListener("mousedown", handleMouseEvents)
}

function removeMouseEvents() {
  document.removeEventListener("mousemove", handleMouseEvents)
  document.removeEventListener("mousedown", handleMouseEvents)
}

function handleKeyboardEvent() {
  document.body.setAttribute("data-keyboard", "true")
  document.body.setAttribute("data-mouse", "false")
  document.body.setAttribute("data-touch", "false")
  addMouseEvents()
}

function handleMouseEvents() {
  document.body.setAttribute("data-keyboard", "false")
  document.body.setAttribute("data-mouse", "true")
  document.body.setAttribute("data-touch", "false")
  removeMouseEvents()
}

function handleTouchEvents() {
  document.body.setAttribute("data-keyboard", "false")
  document.body.setAttribute("data-mouse", "false")
  document.body.setAttribute("data-touch", "true")
}

function setTouchEventsSupported() {
  // Source: https://github.com/viljamis/feature.js/blob/master/feature.js
  const isTouchEventsSupported = !!(
    ("ontouchstart" in window) ||
    window.navigator &&
    window.navigator.msPointerEnabled &&
    window.MSGesture ||
    window.DocumentTouch &&
    document instanceof DocumentTouch
  )

  document.body.setAttribute("data-touch-events-supported", isTouchEventsSupported)
}

export const setCursorToEnd = (inputElement) => {
  if (!inputElement)
    return

  if (inputElement.setSelectionRange) {
    const inputLength = inputElement.value.length
    inputElement.setSelectionRange(inputLength, inputLength)
  }
}
