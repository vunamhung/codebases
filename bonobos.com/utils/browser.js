import bowser from "bowser"
import { isServer } from "highline/utils/client"

const MOBILE_HEIGHT = {
  android:  {
    default: { height: "2300px" },
  },
  default: { height: "100%" },
  "iOS": {
    "13": { height: "2300px" },
    default: { height: "100%" },
  },
}
const supportedBrowsers = {
  "Internet Explorer": {
    version: 11,
    upgradeUrl: "http://windows.microsoft.com/en-us/internet-explorer/download-ie",
  },
  "Microsoft Edge": {
    version: 13,
    upgradeUrl: "https://www.microsoft.com/en-us/download/details.aspx?id=48126",
  },
  "Firefox": {
    version: 53,
    upgradeUrl: "https://support.mozilla.org/en-US/kb/update-firefox-latest-version",
  },
  "Safari": {
    version: 8,
    upgradeUrl: "http://support.apple.com/downloads/#safari",
  },
  "Chrome": {
    version: 58,
    upgradeUrl: "https://support.google.com/chrome/answer/95414?hl=en",
  },
}

const supportedBots = /googlebot|google search/i

export const isCompatible = () => {
  const { name, version } = bowser.getParser(window.navigator.userAgent).getBrowser()

  if (name == null)
    return true

  if (supportedBots.test(navigator.userAgent))
    return true

  const browserVersion = parseInt(version, 10)
  const currentSupportedBrowser = supportedBrowsers[name]

  if (currentSupportedBrowser && browserVersion < currentSupportedBrowser.version) {
    return false
  }

  return true
}

export const upgradeUrl = () => {
  const { name } = bowser.getParser(window.navigator.userAgent).getBrowser()

  const currentSupportedBrowser = supportedBrowsers[name]

  if (currentSupportedBrowser && currentSupportedBrowser.upgradeUrl) {
    return currentSupportedBrowser.upgradeUrl
  }
  return "#"
}

export const browserSupportsCSSValue = (property, value) => {
  return (
    typeof CSS !== "undefined" &&
    CSS.supports &&
    CSS.supports(property, value)
  )
}

export const getDevice = () => {
  if (isServer) { return {} }

  const { os } = bowser.parse(window.navigator.userAgent)

  return {
    osname: os.name,
    osversion: os.version,
  }
}

export const getMobileHeight = () => {
  const { osname, osversion } = getDevice()
  const osBaseVersion = osversion.split(/\.|_/)[0]

  if (osname == "iOS" && osBaseVersion == "13") {
    return MOBILE_HEIGHT["iOS"]["13"]
  } else if (osname == "Android") {
    return MOBILE_HEIGHT.android.default
  } else {
    return MOBILE_HEIGHT.default
  }
}

// https://stackoverflow.com/questions/30569182/promise-allsettled-in-babel-es6-implementation
export const allSettled = (promises) => {
  // eslint-disable-next-line compat/compat
  const wrappedPromises = promises.map((p) => Promise.resolve(p).then(
    (val) => ({ status: "fulfilled", value: val }),
    (err) => ({ reason: err , status: "rejected" }),
  ))

  // eslint-disable-next-line compat/compat
  return Promise.all(wrappedPromises)
}
