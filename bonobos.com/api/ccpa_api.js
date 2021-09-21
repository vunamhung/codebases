import axios from "axios"
import getConfig from "highline/config/application"
import * as SodCookieHelper from "highline/utils/sod_helper"
import { put } from "highline/api/v2_client"

const { ccpaIntake, ccpaDecrypt, ccpaEncrypt, brandCode } = getConfig()

const ccpaClient = axios.create()

ccpaClient.interceptors.response.use(
  (response) => (response),
  (error) => {
    const originalRequest = { ...error.config }
    originalRequest.headers.retryCount = originalRequest.headers.retryCount || 0
    originalRequest.headers.retryCount += 1
    if (originalRequest.headers.retryCount < 3) {
      return ccpaClient(originalRequest)
    }

    return Promise.reject(error)
  },
)

export const access = (intakeData, accountType = 1) => {
  return ccpaClient.post(ccpaIntake,
    {
      brandCode,
      intakeRequestId: intakeData.get("intakeRequestId"),
      emailId: intakeData.get("emailId"),
      accountType,
    },
  )
}

export const optout = (intakeData, accountType = 1) => {
  const cookieId = SodCookieHelper.getSodCookie()
  const isFLAGSet = accountType === 1 ? true : null
  const emailId = intakeData.get("emailId")
  const payload = {
    brandCode,
    intakeRequestId: intakeData.get("intakeRequestId"),
    emailId,
    accountType,
    cookieId,
    agentType: navigator.userAgent,
    isSODSet: cookieId ? true : null,
    isFLAGSet,
    isOptAnonCookieSet: null,
    OptOutType: null,
    requestForSelf: true,
  }
  if (!emailId) {
    delete payload.accountType
  }
  return ccpaClient.post(ccpaIntake, payload)
}

export const decrypt = (encryptedValue) => {
  return ccpaClient.get(`${ccpaDecrypt}?encryptedValue=${encodeURIComponent(encryptedValue)}`)
}

export const encrypt = (emailId, timeStamp) => {
  if (emailId) {
    return ccpaClient.post(ccpaEncrypt, { emailId, timeStamp })
  } else {
    return ccpaClient.post(ccpaEncrypt, { timeStamp })
  }
}

export const saveOptOutStatus = (authToken, email) => {
  return put("/ccpa/optout_flag", {}, { email },
    { "X-Authentication-Token": authToken },
  )
}

export const sodLoginOptout = (emailId, firstName, lastName) => {
  const cookieId = SodCookieHelper.getSodCookie()
  const payload = {
    brandCode,
    firstName,
    lastName,
    emailId,
    accountType: 1,
    cookieId,
    userAgent: navigator.userAgent,
    userType: ["customer"],
    requestType: "OptOut",
    isSODSet: true,
    isOptAnonCookieSet: null,
    OptOutType: "Infection",
  }
  return ccpaClient.post(ccpaIntake, payload)
}
