import { get, put } from "highline/api/v1_client"

export const fetchOptionTypes = (authToken) =>
  get("/option_types",
    {},
    { "X-Authentication-Token": authToken })

export const fetchUserSelections = (authToken, userId) =>
  get(`/users/${userId}/fit_preferences`,
    {},
    { "X-Authentication-Token": authToken })

export const updateUserSelections = (authToken, userId, optionValueIds) =>
  put(`/users/${userId}/fit_preferences`,
    {
      fit_preferences: {
        option_value_ids: optionValueIds,
      },
    },
    { "X-Authentication-Token": authToken })
