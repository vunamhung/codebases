import React from "react"
import NextLink from "next/link"
import Qs from "qs"
import isQueryParamBlacklisted from "highline/utils/blacklisted_query_params"

const sanitizeUrlString = (urlString = "") => {
  const urlParts = urlString.split("?")
  if (urlParts.length === 1) { return urlString }

  const queryParamsString = urlParts.pop()
  const queryParamssObject = Qs.parse(queryParamsString)
  for (const paramName in queryParamssObject) {
    if (isQueryParamBlacklisted(paramName)) {
      delete queryParamssObject[paramName]
    }
  }

  const sanitizedParamsString = Qs.stringify(queryParamssObject)
  urlParts.push(sanitizedParamsString)
  return urlParts.join("?")
}


const Link = ({
  as,
  href,
  ...props
}) => {
  const sanitizedAs = sanitizeUrlString(as)
  const sanitizedHref = sanitizeUrlString(href)

  return <NextLink
    { ...props }
    as={ sanitizedAs }
    href={ sanitizedHref }
  />
}

Link.propTypes = {
  ...NextLink.propTypes,
}

export default Link
