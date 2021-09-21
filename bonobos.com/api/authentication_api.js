import { post, put, del, get } from "highline/api/v2_client"
import { get as getCookie } from "highline/utils/cookies"

export const createAccount = (userAndOrderInfo) => {
  return post("/users", { 
    ...userAndOrderInfo,
    skip_shipping_and_tax_calc: true,
    constructorio_cookie: getCookie("ConstructorioID_client_id"),
  })
}

export const login = (loginAndOrderInfo) => {
  return post("/sessions", { 
    ...loginAndOrderInfo,
    skip_shipping_and_tax_calc: true,
    constructorio_cookie: getCookie("ConstructorioID_client_id"),
  })
}

export const recoverPassword = (email) => {
  return post("/password_recovery", { email })
}

export const resetPassword = (password, reset_password_token) => {
  return put("/password_recovery", { password, reset_password_token })
}

export function logout(authenticationToken) {
  return del("/sessions", { authentication_token: authenticationToken })
}

export const checkEmail = (encryptedValue) => {	
  return get("/ccpa/email_exists", 
    { encryptedValue },
  )	
}
export const checkOptanonStatus = (emailId) => {
  return post("/ccpa/cookie_exists",
    { emailId },
  )
}
