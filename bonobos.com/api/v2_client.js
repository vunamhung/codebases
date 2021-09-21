import { createClient } from "highline/api/v2_client_factory"
import {
  baseURL,
  clientAuthToken,
  performRequest,
  schema,
} from "highline/api/base"

export const apiClient = createClient(baseURL, clientAuthToken, schema)

export const get = function(url, params = {}, headers = {}, client = apiClient) {
  return performRequest(client, {
    method: "get",
    url,
    params,
    headers,
  })
}

export const put = function(url, params = {}, data = {}, headers = {}) {
  return performRequest(apiClient, {
    method: "put",
    url,
    params,
    data,
    headers,
  })
}

export const del = function(url, params = {}, data = {}, headers = {}) {
  return performRequest(apiClient, {
    method: "delete",
    url,
    params,
    data,
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
