import { fromJS } from "immutable"
import rollbar from "rollbar"
import { isServer } from "highline/utils/client"
import getConfig from "highline/config/application"
import * as UserStorage from "highline/storage/user_storage"
import serverRequire from "highline/utils/server_require"
const ServerRollbar = serverRequire("highline/commonjs/rollbar")

const ignoreErrorList = fromJS([
  {
    filename: "adroll.com",
  },
  {
    filename: "cdnwidget.com",
  },
  {
    filename: "olark.com",
  },
  {
    filename: "phantomjs://",
  },
  {
    filename: "safari-extension://",
  },
  {
    filename: "2mdn.net",
  },
  {
    filename: "salesforce.com", // ignoring all rollbars for now. Errors are not actionable items in our end and not resulting in chat not working
  },
  {
    filename: "facebook", // could be .net or .com
  },
  {
    filename: "salesforce_live_agent",
  },
  {
    filename: "(unknown)",
  },
  {
    filename: "page-loader.js",
  },
  {
    filename: "sdk.js",
  },
  {
    filename: "bonobos.com/help", // Is a salesforce page
  },
  {
    filename: "segment.com",
    message: "Cannot read property 'record_adroll_email' of undefined",
  },
  {
    filename: "segment.com",
    message: "window.UET is not a constructor",
  },
  {
    filename: "segment.com",
    message: "Unable to get property 'record_adroll_email' of undefined or null reference",
  },
  {
    filename: "segment.com",
    message: "Unable to get property 'record_user' of undefined or null reference",
  },
  {
    filename: "googletagmanager.com",
    message: "Cannot read property 'getItem' of null",
  },
  {
    filename: "(unknown)",
    message: "jQuery is not defined",
  },
  {
    filename: "(unknown)",
    message: "$ is not defined",
  },
  {
    filename: "(unknown)",
    message: "$img is not defined",
  },
  {
    filename: "friendbuy",
    message: "Unrecognized token '<'",
  },
  {
    filename: "/Default/Extensions/", // catch chrome extensions
  },
  {
    filename: "chrome-extension://",
  },
])

function hasStackTrace(errorPayload) {
  const trace = errorPayload && errorPayload.body && errorPayload.body.trace

  if (!trace)
    return false

  return trace.frames && trace.exception
}

let Rollbar = {
  critical: () => {},
  debug: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
}

const {
  environment,
  isProductionLike,
  isTest,
  rollbarClientAccessToken,
  isRollbarSourceMapEnabled,
} = getConfig()

if (isServer) {
  Rollbar = ServerRollbar

} else if (isTest) {
  window.Rollbar = Rollbar

} else { // isClient

  const _clientRollbarConfig = {
    accessToken: rollbarClientAccessToken,
    captureUncaught: isProductionLike,
    captureUnhandledRejections: isProductionLike,
    reportLevel: "info",
    ignoredMessages: [
      "Script error",
      "undefined is not an object (evaluating '__gCrWeb.autofill.extractForms')",
      "null is not an object (evaluating '__gCrWeb.form.wasEditedByUser.set')",
      "Can't find variable: dzPlayer",
      "undefined is not an object (evaluating 'r.get')",
    ],
    payload: {
      client: {
        javascript: {
          guess_uncaught_frames: true,
          source_map_enabled: true,
        },
      },
      environment,
    },
    checkIgnore: (isUncaught, args, payload) => {
      if (!hasStackTrace(payload))
        return false

      const trace = payload.body.trace

      const shouldIgnore = ignoreErrorList.find((error) => {
        // true if error does not have a message or message equals trace message
        const ignoreMessage = !error.has("message") ||
          error.get("message") == trace.exception.message

        // true if trace filename includes error filename value
        const ignoreFileName = trace.frames.find((frame) =>
          frame.filename && frame.filename.includes(error.get("filename")),
        )

        return ignoreMessage && ignoreFileName
      })

      return isUncaught && shouldIgnore
    },
    telemetryScrubber: (domNode) => {
      return domNode.classes.includes("sensitive")
    },
  }

  if (isRollbarSourceMapEnabled) {
    _clientRollbarConfig.payload.client.javascript.code_version = process.env.SOURCE_VERSION
  }

  const userStorage = UserStorage.load()
  if (userStorage.externalId) {
    // id is required
    _clientRollbarConfig.payload.person = {
      id: userStorage.externalId,
    }
    // username and email are optional, I only set it if we have a value
    // because the default value rollbar uses for these are not null
    if (userStorage.email) {
      _clientRollbarConfig.payload.person.username = userStorage.email
      _clientRollbarConfig.payload.person.email = userStorage.email
    }
  }

  Rollbar = new rollbar(_clientRollbarConfig)
  Rollbar.global({ maxItems: 100 })
}

export default Rollbar

// format http error from request api for better logging
export const formatHttpError = (error) => {
  const response = error.statusText // error is a respone object
    ? error
    : error.response

  if (!response)
    return error

  const data = response.data || {}

  return {
    data: data.toJS ? data.toJS() : data,
    method: response.config && response.config.method,
    status: response.status,
    statusText: response.statusText,
    url: response.config && response.config.url,
  }
}
