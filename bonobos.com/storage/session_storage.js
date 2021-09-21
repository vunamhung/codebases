export const getItem = (key) => {
  return window.sessionStorage.getItem(key)
}

export const setItem = (key, value) => {
  window.sessionStorage.setItem(key, value)
}
