import { createClient } from "highline/api/v1_client_factory"
import { baseURL, performRequest } from "highline/api/base"

export const apiClient = createClient(baseURL)

export const get = function(url, params = {}, headers = {}, client = apiClient) {
  return performRequest(client, {
    method: "get",
    url,
    params,
    headers,
  })
}

export const post = function(url, data = {}, headers = {}) {
  return performRequest(apiClient, {
    method: "post",
    url,
    data,
    headers,
  })
}

export const put = function(url, data = {}, headers = {}) {
  return performRequest(apiClient, {
    method: "put",
    url,
    data,
    headers,
  })
}
