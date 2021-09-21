
import { fromJS } from "immutable"
import { isServer } from "highline/utils/client"
import serverRequire from "highline/utils/server_require"

// All config settings are set in commonjs/config
//
// On server, settings are read directly from the process
// On client, settings are read from the window object __HIGHLINE_CONFIG__

let clientConfig

export default function() {
  if (isServer || process.env.APP_ENV === "test") {
    return serverRequire("highline/commonjs/config")
  }

  if (clientConfig) {
    return clientConfig.toJS()
  }

  // Set client config as immutable first time called to avoid mutation
  clientConfig = fromJS(window.__HIGHLINE_CONFIG__)

  if (clientConfig.get("isFeatureMode")) {
    clientConfig = clientConfig.merge(fromJS(window.__FEATURE_TEST_CONFIG_STUBS__ || {}))
  }

  if (clientConfig.some((value) => value === "true" || value === "false")) {
    // eslint-disable-next-line no-console
    console.warning("String versions of booleans detected in clientConfig. Convention is boolean type")
  }

  return clientConfig.toJS()
}