import { get } from "highline/api/v1_client"

export const accept = (email, authToken) => {
  return get("/terms_and_privacy_acceptance/accept_terms_and_privacy",
    { email },
    { "X-Authentication-Token": authToken },
  )
}
