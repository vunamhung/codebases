import { post } from "highline/api/v2_client"

export const save = (email, leadSource) => {
  return post("/user_leads", {
    email,
    lead_source: leadSource,
  })
}
