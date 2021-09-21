import { Map } from "immutable"
import * as UserAuthStorage from "highline/storage/user_auth_storage"
import * as Cookies from "highline/utils/cookies"
import { detectViewportWidth, detectViewportHeight } from "highline/utils/viewport"
import { isServer } from "highline/utils/client"
import getConfig from "highline/config/application"

function getCheckoutExperimentVariation() {
  return Map({ "AB TEST Checkout": "highline" })
}

function getContext() {
  const page = {
    path: window.location.pathname,
    referrer: document.referrer,
    search: window.location.search,
    title: getPageTitle(),
    url: `${ window.location.origin }${ window.location.pathname }`,
  }

  const screen = {
    density: window.devicePixelRatio || 1,
    scrollY: window.scrollY,
    scrollX: window.scrollX,
    width: detectViewportWidth(),
    height: detectViewportHeight(),
  }

  return { page, screen }
}

function defaultEventProperties() {
  return Object.assign({}, loginStatus(), location(), appName())
}

function filterEmptyValues(eventProperties = {}) {
  return Map(eventProperties).filter((value) => {
    return value !== null && value !== undefined
  }).toJS()
}

function loginStatus() {
  const is_logged_in = UserAuthStorage.load().authenticationToken ? true : false
  return { is_logged_in }
}

function appName() {
  return { app: { name: "highline" } }
}

function location() {
  return { location: getPageCategory().toLowerCase() }
}

function amplitudeSessionOverride() {
  const { bonobosSessionCookieKey } = getConfig()
  const session = Cookies.get(bonobosSessionCookieKey)
  const override = session ? { "Amplitude": { "session_id": session.get("start") } } : {}
  return override
}

function addExperimentsTrait(traits = {}) {
  const experiments = getCheckoutExperimentVariation()
  traits = Object.assign({}, traits, { experiments: experiments.toJSON() })
  return traits
}

export const getPageCategory = () => {
  const layoutEl = document.getElementById("layout-wrapper")
  if (!layoutEl)
    return ""

  return (layoutEl.getAttribute("data-page-category") || "")
}

export const getPageTitle = () => {
  const titleEl = document.getElementsByTagName("title")[0]
  return titleEl && titleEl.innerHTML
}

function formatTitle(title) {
  return (title || "").split(" |")[0]
}

export const trackEvent = (eventMessage, eventProperties = {}, callback) => {
  if (isServer || !window.analytics)
    return

  window.analytics.track(
    eventMessage,
    Object.assign({}, defaultEventProperties(), filterEmptyValues(eventProperties)),
    Object.assign({}, { context: getContext(), integrations: amplitudeSessionOverride() }),
    callback,
  )
}

export const identifyAnonymous = (traits = {}) => {
  window.analytics.identify(
    addExperimentsTrait(traits),
    { context: getContext(), integrations: amplitudeSessionOverride() },
  )
}

export const identify = (userId, traits = {}) => {
  if (userId) {
    window.analytics.identify(
      userId,
      addExperimentsTrait(traits),
      { context: getContext(), integrations: amplitudeSessionOverride() },
    )
  }
}

export const alias = (userId) => {
  if (userId) {
    window.analytics.alias(userId, { context: getContext() })
  }
}

export const trackPage = (pageCategory, title, options = {}) => {
  const page = getContext().page

  const properties = Object.assign({},
    options,
    defaultEventProperties(),
    { location: (pageCategory || "").toLowerCase() },
    { ...page },
  )

  window.analytics.page(
    pageCategory,
    formatTitle(title),
    properties,
    {
      context: getContext(),
      integrations: amplitudeSessionOverride(),
    },
  )
}
