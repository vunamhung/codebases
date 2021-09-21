import { get } from "highline/api/v2_client"
import { fromJS } from "immutable"
import { toDecamelizedJSON } from "highline/utils/immutable_helper"

export const fetch = async (
  searchTerms,
  filters,
  myFitEnabled = false,
  authToken = null,
) => {
  if (myFitEnabled && authToken) {
    return await fetchWithMyFit(searchTerms, authToken)
  } else {
    return await fetchFromFlatiron(searchTerms, filters)
  }
}

export const fetchWithMyFit = (searchTerms, authToken) => {
  const params = {
    my_fit: true,
    search_terms: searchTerms,
  }

  return get("/search",
    toDecamelizedJSON(fromJS(params), "-"),
    { "X-Authentication-Token": authToken },
  )
}

const fetchFromFlatiron = async (searchTerms, filters) => {
  return await get("/search", {
    filters: filters.toJS(),
    search_terms: searchTerms,
  })
}
