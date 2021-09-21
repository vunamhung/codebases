import Qs from "qs"

// TODO: remove the path default empty string
// It's here because at runtime, we pull href's as the path and it can return undefined
export const buildUrl = (path = "", newQueryString = {}) => {
  const oldQueryString = extractQueryParams(path)
  const combinedQueryString = Object.assign({}, oldQueryString, newQueryString)
  const stringifiedQueryString = Qs.stringify(combinedQueryString)

  const barePath = getBasePath(path)

  return stringifiedQueryString.length
    ? `${barePath}?${stringifiedQueryString}`
    : barePath
}

export const buildFilterUrl = (path = "", filters = {}) => {
  const stringifiedQueryString = filters.toJS ? Qs.stringify(filters.toJS()) : ""
  const decodedQueryString = decodeURI(stringifiedQueryString)
  const formattedQueryString = decodedQueryString.replace(/ *\[[^\]]*]/g, "")
  const barePath = getBasePath(path)

  return formattedQueryString.length
    ? `${barePath}?${formattedQueryString}`
    : barePath
}

export const clearFiltersFromUrl = (path) => {
  return getBasePath(path)
}

export const getBasePath = (path) => {
  return stripQueryString(removeAnchor(path))
}

export const stripQueryString = (url) => {
  return url ? url.split("?")[0] : ""
}

// Remove anchor from url, preserving any query params
export const removeAnchor = (url) => {
  const parts = (url || "").split("#")

  if (parts.length == 1)
    return parts[0]

  const query = parts[1].split("?")

  return query.length == 1
    ? parts[0]
    : [parts[0], query[1]].join("?")
}

export const extractQueryString = (url) => {
  return url ? (url.split("?")[1] || "") : ""
}

export const extractQueryParams = (string) => {
  return string ? Qs.parse(extractQueryString(string)) : {}
}

export const buildHistoryUrl = (barePath, newQueryObject) => {
  const stringifiedQueryString = Qs.stringify(newQueryObject)

  return stringifiedQueryString.length
    ? `${barePath}?${stringifiedQueryString}`
    : barePath
}

export const getReferrerPathname = () => {
  // Default to homepage worse case scenario
  if (
    !window ||
    !window.document ||
    !window.document.createElement
  ) {
    return "/"
  }
  const hrefElem = window.document.createElement("a")
  hrefElem.href = window.document.referrer
  return hrefElem.pathname
}
