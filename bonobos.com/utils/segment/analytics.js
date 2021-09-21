import Lockr from "lockr"
import getConfig from "highline/config/application"
import * as SodCookie from "highline/utils/sod_helper"
/*eslint no-console: "off"*/

export default function initAnalytics(writeKey) {
  const { isFeatureMode, isTest } = getConfig()

  // Create a queue, but don't obliterate an existing one!
  const analytics = window.analytics = window.analytics || []

  // If the real analytics.js is already on the page return.
  if (analytics.initialize) return

  // If the snippet was invoked already show an error.
  if (analytics.invoked) {
    if (window.console && console.error) {
      console.error("Segment snippet included twice.")
    }
    return
  }

  // Invoked flag, to make sure the snippet
  // is never invoked twice.
  analytics.invoked = true

  if (isFeatureMode) {
    window.Lockr = Lockr
  }

  // A list of the methods in Analytics.js to stub.
  analytics.methods = [
    "trackSubmit",
    "trackClick",
    "trackLink",
    "trackForm",
    "pageview",
    "identify",
    "reset",
    "group",
    "track",
    "ready",
    "alias",
    "debug",
    "page",
    "once",
    "off",
    "on",
  ]

  // Define a factory to create stubs. These are placeholders
  // for methods in Analytics.js so that you never have to wait
  // for it to load to actually record data. The `method` is
  // stored as the first argument, so we can replay the data.
  analytics.factory = function(method) {
    return function() {
      var args = Array.prototype.slice.call(arguments)
      args.unshift(method)
      analytics.push(args)
      if (isFeatureMode) {
        Lockr.sadd("segmentTestEvents", args)
      }
      return analytics
    }
  }

  // For each of our methods, generate a queueing stub.
  for (var i = 0; i < analytics.methods.length; i++) {
    var key = analytics.methods[i]
    analytics[key] = analytics.factory(key)
  }

  // Define a method to load Analytics.js from our CDN,
  // and that will be sure to only ever load it once.
  analytics.load = function(key, options) {
    // Create an async script element based on your key.
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.async = true
    script.src = ("https:" === document.location.protocol
      ? "https://" : "http://")
      + "cdn.segment.com/analytics.js/v1/"
      + key + "/analytics.min.js"

    // Insert our script next to the first script element.
    const first = document.getElementsByTagName("script")[0]
    first.parentNode.insertBefore(script, first)
    analytics._loadOptions = options
  }
  analytics._writeKey = writeKey

  // Add a version to keep track of what's in the wild.
  analytics.SNIPPET_VERSION = "4.13.2"

  const cookieId = SodCookie.getSodCookie()

  const integrations = cookieId ? { "Google Ads (Classic)": false, "Twitter Ads": false, "Facebook Pixel": false, "Bing Ads": false } : { All: true }

  // Load Analytics.js with your key, which will automatically
  // load the tools you've enabled for your account. Boosh!
  if (!isTest && !isFeatureMode) {
    analytics.load(writeKey, { integrations })
  }
  
  // Make the first page call to load the integrations. If
  // you'd like to manually name or tag the page, edit or
  // move this call however you'd like.
  // analytics.page()

  return analytics
}
