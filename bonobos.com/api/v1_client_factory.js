import getConfig from "highline/config/application"
import axios from "axios"

const { isFeatureMode } = getConfig()

export const createClient = (baseURL) =>
  axios.create({
    baseURL,
    headers: {
      "Accept": "application/json",
    },
    validateStatus: (status) => {
      return status < 400 // only error for 400 and up
    },
    withCredentials: !isFeatureMode, // will raise CORS issues if true and app is pointed to flatiron
  })
