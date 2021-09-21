import { get } from "highline/api/v2_client"

export const fetchNavigation = () => get("/navigation")