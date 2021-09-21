import { get } from "highline/api/v2_client"

import { massageFlatironProductListResponse } from "highline/utils/product_mapper_helper"

export const getProductListFromFlatiron = async ( products ) => {

  const response = await get(
    "/programs/mget",
    { programs: products },
  )
  const massaged = massageFlatironProductListResponse(response.data)
  return massaged
}
