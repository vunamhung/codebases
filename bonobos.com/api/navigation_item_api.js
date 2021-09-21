import { get } from "highline/api/v2_client"

export const fetchNavigationItems = () => {
  return get("/navigation_items")
}
