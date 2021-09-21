import getConfig from "highline/config/application"
import { isServer } from "highline/utils/client"

/*
* DOMPurify is a library used to parse chat messages in salesforce messenger. Currently
* the salesforce library has a bug where DOMPurify is not loaded if the global object
* has import.modules set. This is a problem because NEXT.JS uses import.modules when loading
* react components.
*
* Solution: Load DOMPurify and set it as part of the global object so that saleforce library can
* use the reference when parsing messages
*/
const DESKTOP = "(min-width: 1000px)"
const MOBILE = "(max-width: 599px)"
const HIDDEN_PATHS = { "/": { desktop: false, mobile: true } }
const {
  isFeatureMode,
  isTest,
  salesforceChatCommunityUrl,
  salesforceChatEnabled,
  salesforceChatEnvId,
  salesforceChatPrimaryQueueButtonId,
  salesforceChatSecondaryQueueButtonId,
  salesforceChatSecondaryQueueFilter,
  salesforceChatUrl,
  salesforceMobileChatDisabled,
} = getConfig()

if (!isServer) {
  const createDOMPurify = require("dompurify")
  window.DOMPurify = createDOMPurify()
}

const initESW = (gslbBaseURL, chatClicked, chatEstablished) => {
  window.embedded_svc.settings.displayHelpButton = true //Or false
  window.embedded_svc.settings.language = "en-US" //For example, enter "en" or "en-US"

  window.embedded_svc.settings.enabledFeatures = ["LiveAgent"]
  window.embedded_svc.settings.entryFeature = "LiveAgent"
  window.embedded_svc.settings.defaultMinimizedText = "Chat With Us"
  window.embedded_svc.addEventHandler("onHelpButtonClick", () => chatClicked())
  window.embedded_svc.addEventHandler("onChatEstablished", (data) => chatEstablished(data.liveAgentSessionKey))
  window.embedded_svc.settings.extraPrechatInfo = [{
    "entityFieldMaps": [{
      "doCreate": true,
      "doFind": false,
      "fieldName": "LastName",
      "isExactMatch": false,
      "label": "Last Name",
    }, {
      "doCreate": true,
      "doFind": false,
      "fieldName": "FirstName",
      "isExactMatch": false,
      "label": "First Name",
    }, {
      "doCreate": true,
      "doFind": true,
      "fieldName": "Email",
      "isExactMatch": true,
      "label": "Email",
    }],
    "entityName": "Contact",
    "saveToTranscript": "Contact",
    "showOnCreate": true,
  }]

  window.embedded_svc.init(
    salesforceChatUrl,
    salesforceChatCommunityUrl,
    gslbBaseURL,
    salesforceChatEnvId,
    "Bonobos_Chat",
    {
      baseLiveAgentContentURL: "https://c.la1-c1-iad.salesforceliveagent.com/content",
      baseLiveAgentURL: "https://d.la1-c1-iad.salesforceliveagent.com/chat",
      buttonId: salesforceChatPrimaryQueueButtonId,
      deploymentId: "5726A000000Ucvy",
      eswLiveAgentDevName: "EmbeddedServiceLiveAgent_Parent04I6A0000008RbGUAU_164eb7dfa74",
      isOfflineSupportEnabled: false,
    },
  )

  window.embedded_svc.settings.directToButtonRouting = function(prechatFormData) {
    if (salesforceChatSecondaryQueueFilter.split("|").includes(prechatFormData[3].value)) {
      return salesforceChatSecondaryQueueButtonId
    }
  }

  setupMessageObserver()
  hideChatObserver()
}

const initSalesforceLiveAgent = (chatClicked, chatEstablished) => {
  if (!isTest && !isFeatureMode && salesforceChatEnabled) {
    if (salesforceMobileChatDisabled && window.matchMedia(MOBILE).matches) return
    if (!window.embedded_svc) {
      const s = document.createElement("script")
      s.src = "https://bonobos.my.salesforce.com/embeddedservice/5.0/esw.min.js"
      s.onload = function () {
        initESW(null, chatClicked, chatEstablished)
      }
      document.body.appendChild(s)
    }
  }
}

// Salesforce allways adds a target=_blank to messages containing links. For this
// type of messages we don't want to open a new tab. Unfortunately sales does not allow
// such config and this seems to be the workaround.
const setupMessageObserver = () => {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
  const observer = new MutationObserver(() => {
    document.querySelectorAll(".sidebarBody a").forEach((message) => {
      const isBonobosDomainLink = (message.href.toLowerCase().indexOf(window.location.origin) > -1)
      if (isBonobosDomainLink) {
        message.removeAttribute("target")
      }
    })
  })
  observer.observe(document, {
    subtree: true,
    attributes: true,
  })
}

const hideChatObserver = () => {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
  const observer = new MutationObserver(() => {
    if (!document.getElementsByClassName("embeddedServiceHelpButton")[0]) return

    const shouldBeVisible = !document.getElementsByClassName("modalContainer")[0] && showOnPlatform()
    const display = shouldBeVisible ? "inline" : "none"

    document.getElementsByClassName("embeddedServiceHelpButton")[0].style.display = display
  })

  observer.observe(document, {
    subtree: true,
    attributes: true,
  })
}

const showOnPlatform = () => {
  if (!HIDDEN_PATHS[window.location.pathname]) return true

  return window.matchMedia(DESKTOP).matches ? !HIDDEN_PATHS[window.location.pathname].desktop
    : !HIDDEN_PATHS[window.location.pathname].mobile
}

export default initSalesforceLiveAgent
