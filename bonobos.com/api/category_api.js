import { fromJS, Map } from "immutable"
import { toDecamelizedJSON } from "highline/utils/immutable_helper"
import { get } from "highline/api/v2_client"
import { schema } from "highline/api/base"

export const fetch = async (
  authToken,
  currentSortOption = "by_mix",
  myFitEnabled = false,
  selectedFilters = Map(),
  slug,
  version,
) => {
  const decamelizedFilters = toDecamelizedJSON(fromJS(selectedFilters), "-")
  return await get(
    `/category/${ slug }`,
    { filters: decamelizedFilters, my_fit: myFitEnabled, sort: currentSortOption },
    {
      "Accept": `application/json;v=${version};schema=${schema}`,
      "X-Authentication-Token": authToken,
    },
  )
}

export const fetchMetaData = async (categorySlug) => (
  await get(
    `/category_meta_data/${ categorySlug }`,
    {},
    { "Accept": `application/json;v=2.1;schema=${schema}` },
  )
)
