import getConfig from "highline/config/application"
import axios from "axios"
import Qs from "qs"

const { isFeatureMode } = getConfig()

export const createClient = function(baseURL, clientAuthToken, schema) {
  return axios.create({
    baseURL,
    headers: {
      "Accept": `application/json;v=2.0;schema=${schema}`,
      "X-Client-Authentication-Token": clientAuthToken,
    },
    paramsSerializer: (params) => {
      return Qs.stringify(params, { arrayFormat: "brackets" })
    },
    validateStatus: (status) => {
      return status < 400 // only error for 400 and up
    },
    withCredentials: !isFeatureMode, // will raise CORS issues if true and app is pointed to flatiron
  })
}
