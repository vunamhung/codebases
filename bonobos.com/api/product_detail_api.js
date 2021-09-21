import { fromJS } from "immutable"
import { toDecamelizedJSON } from "highline/utils/immutable_helper"
import { get } from "highline/api/v2_client"

export const fetch = (productSlug, selectedOptions) => {
  return get(`/products/${ productSlug }`,
    toDecamelizedJSON(fromJS(selectedOptions), "-"),
  )
}
