import { fromJS, Map } from "immutable"
import { adyenKey } from "highline/utils/constants"
import getConfig from "highline/config/application"

const { isFeatureMode } = getConfig()

export const getNonceForRequest = (billingInformation) => {
  const options = {
    enableValidations: false,
    numberIgnoreNonNumber: true,
  }

  const cardData = {
    cvc: billingInformation.get("securityCode"),
    expiryMonth: billingInformation.get("month"),
    expiryYear: billingInformation.get("year"),
    generationtime: new Date().toISOString(),
    holderName: billingInformation.get("name"),
    number: billingInformation.get("cardNumber"),
  }

  return window.adyen.encrypt.createEncryption(adyenKey, options).encrypt(cardData)
}

export const getGiftCardNonceForRequest = (cardNumber) => {
  const options = {
    enableValidations: false,
    numberIgnoreNonNumber: true,
  }

  const cardData = {
    generationtime: new Date().toISOString(),
    number: cardNumber,
  }

  return window.adyen.encrypt.createEncryption(adyenKey, options).encrypt(cardData)
}

export const getSecurityCodeValidationdNonceForRequest = (securityCode) => {
  const options = {
    enableValidations: false,
    numberIgnoreNonNumber: true,
  }

  const cardData = {
    cvc: securityCode,
    generationtime: new Date().toISOString(),
  }

  return window.adyen.encrypt.createEncryption(adyenKey, options).encrypt(cardData)
}

export const getNewMergedOrder = (oldOrder, newOrder) => {
  const address = newOrder.get("address")
  const creditCard = newOrder.get("creditCard")
  const shippingRate = newOrder.get("shippingRate")
  const promotion = newOrder.get("promotion")
  const payments = newOrder.get("payments")
  let promoCodeDetails = oldOrder.get("promoCodeDetails")

  const step = getCheckoutStep(newOrder)

  const order = newOrder
    .delete("address")
    .delete("creditCard")
    .delete("shippingRate")
    .delete("promotion")
    .delete("payments")

  let newMergedOrder = oldOrder.merge(order)

  if (address && !address.isEmpty()) {
    newMergedOrder = newMergedOrder.set("address", address)
  }

  if (newOrder.has("creditCard")) {
    newMergedOrder = newMergedOrder.set("creditCard", creditCard)
  }

  if (shippingRate && !shippingRate.isEmpty()) {
    newMergedOrder = newMergedOrder.set("shippingRate", shippingRate)
  }
  if (newOrder.has("payments")) {
    newMergedOrder = newMergedOrder.set("payments", payments)
  }

  if (promotion && !promotion.isEmpty()) {
    newMergedOrder = newMergedOrder.set("promotion", promotion)
    promoCodeDetails = fromJS({
      code: promotion.get("code"),
      error: null,
      isLoading: false,
      isPromoCodeApplied: true,
    })
  } else {
    newMergedOrder = newMergedOrder.set("promotion", fromJS({}))

    // User has removed the promotion code so is ok to reset
    // the values to their initial state
    if (promoCodeDetails.get("isPromoCodeApplied")) {
      promoCodeDetails = fromJS({
        code: "",
        error: {},
        isLoading: false,
        isPromoCodeApplied: false,
      })
    }
  }

  newMergedOrder = newMergedOrder.merge({
    currentStep: step.get("currentStep"),
    isInitialLoad: false,
    promoCodeDetails,
  })

  return newMergedOrder
}

export const getAddressForRequest = (address) => {
  return fromJS({
    address1: address.get("address1"),
    address2: address.get("address2"),
    city: address.get("city"),
    countryCode: address.getIn(["country", "code"]),
    default: address.get("default"),
    firstName: address.get("firstName"),
    id: address.get("id"),
    lastName: address.get("lastName"),
    phone: address.get("phone"),
    postalCode: address.getIn(["postalCode", "code"]),
    regionCode: address.getIn(["region", "code"]),
  })
}

export const getSelectedShippingRate = (availableShippingRates, shippingRateCode) => {
  if (
    !availableShippingRates ||
    !availableShippingRates.isEmpty ||
    availableShippingRates.isEmpty()
  ) {
    return fromJS({})
  }

  const selectedShippingRate = availableShippingRates.find((shippingRate) => {
    return shippingRate.get("code") === shippingRateCode
  })

  return selectedShippingRate || fromJS({})
}

export const getShippingRateForRequest = (shippingRate) => {
  return fromJS({
    name: shippingRate.get("code"),
  })
}

export const getBillingInformationForRequest = (
  processor,
  isInWallet,
  isDefault,
  nonce,
  name,
  address,
) => {
  return fromJS({
    cardDetails: {
      billAddress: address,
      name,
      nonce,
    },
    processor,
    saveCreditCardInWallet: isInWallet,
    setNewCardAsDefault: isDefault,
  })
}

export const getVCBillingInformationForRequest = (
  visaCheckoutDetails,
) => {
  const vc = fromJS(visaCheckoutDetails)
  return fromJS({
    visaCheckoutDetails: {
      callId: vc.get("callid"),
      encryptedKey: vc.get("encKey"),
      encryptedPayload: vc.get("encPaymentData"),
    },
  })
}

export const getBillingInformationForUpdate = (id) => {
  return fromJS({
    id,
  })
}

export const getPromoCodeForRequest = (promoCodeDetails) => {
  return promoCodeDetails.get("code")
}

export const getCompleteCheckoutDataForRequest = (address, shippingRate, signifydSessionId, checkoutToken) => {
  return fromJS({
    acceptPrivacyPolicy: true,
    acceptTermsOfService: true,
    address: getAddressForRequest(address),
    affirm: { checkoutToken },
    shippingRate: getShippingRateForRequest(shippingRate),
    signifydSessionId,
  })
}

export const getCheckoutStep = (order) => {
  const isAddressPresent = !!order.get("address") && !order.get("address").isEmpty()
  const isCreditCardPresent = !!order.get("creditCard") && !order.get("creditCard").isEmpty()

  if (isCreditCardPresent && isAddressPresent) {
    return fromJS({
      currentStep: 2,
      redirectPath: "review",
    })
  }

  if (isAddressPresent) {
    return fromJS({
      currentStep: 1,
      redirectPath: "billing",
    })
  }

  return fromJS({
    currentStep: 0,
  })
}

export const isUserNotFound = (error) => {
  const value = error && error.getIn && error.getIn(["errors", "notFound", 0], "")
  return value === "User not found"
}

export const sendFriendBuyOrderDetail = (order, email) => {
  if (!window.friendbuy) {
    return
  }

  window.friendbuy.push(["track", "order",
    {
      id: order.get("number"),
      amount: order.get("totalNumeric"),
      coupon_code: order.getIn(["promoCodeDetails", "code"]),
      email,
    },
  ])
}

// Preserves null values while typecasting strings into numbers
const toNumber = (num) => {
  if (num === null) { return null }

  return Number(num.replace(/\$/g, ""))
}

export const sendABTastyOrderDetails = (order) => {
  if (isFeatureMode) return
  const sendToABTasty = window.abtasty.send
  const orderNumber = order.get("number")
  const lineItems = order.get("items")
  let paymentMethod

  if (order.get("paidWithAffirm")) {
    paymentMethod = "Affirm"
  } else if (order.getIn(["creditCard", "type"]) === "paypal") {
    paymentMethod = "Paypal"
  } else {
    paymentMethod = "Spree::CreditCard"
  }

  /* eslint-disable sort-keys */
  sendToABTasty("transaction", {
    tid: orderNumber,                                             // __TRANSACTION_ID__, Format: STRING, value example: "OD564"
    ta: "Order Complete",                                         // __TRANSACTION_NAME__, Format: STRING, value example: "Purchase"
    tr: toNumber(order.get("subtotalNumeric")),                   // __TRANSACTION_REVENUE__, Format: FLOAT, value example: 15.47
    ts: toNumber(order.getIn(["shippingRate", "totalNumeric"])),  // __TRANSACTION_SHIPPING__, Format: FLOAT, value example: 3.5
    tt: toNumber(order.get("taxTotalNumeric")),                   // __TRANSACTION_TAXES__, Format: FLOAT, value example: 2.60
    tc: "USD",                                                    // __TRANSACTION_CURRENCY__, Format: STRING, value example: "EUR"

    tcc: order.getIn(["promotion", "code"]),                      // __TRANSACTION_COUPON_CODE__, // Format: STRING, value example: "Coupon"
    pm: paymentMethod,                                            // __TRANSACTION_PAYMENT_METHOD__, Format: STRING, value example: "Paypal"
    sm: order.getIn(["shippingRate", "name"]),                    // __TRANSACTION_SHIPPING_METHOD__, Format: STRING, value example: "Fedex"
    icn: order.get("itemCount"),                                  // __TRANSACTION_ITEM_COUNT__, Format: INTEGER, value example: 12
  })

  lineItems.forEach((lineItem) => {
    const isMarkdown = toNumber(lineItem.getIn(["amount", "discounted"])) < toNumber(lineItem.getIn(["amount", "full"]))
    const itemCategory = lineItem.getIn(["options", "color"]) || lineItem.getIn(["options", "theme"])

    sendToABTasty("item", {
      tid: orderNumber,                                       // __TRANSACTION_ITEMS[i].TRANSACTION_ID, Format: STRING, value example: "OD564"
      in: lineItem.get("name"),                               // __TRANSACTION_ITEMS[i].ITEM_NAME__, Format: STRING, value example: "Shoe"
      ip: toNumber(lineItem.getIn(["amount", "discounted"])), // __TRANSACTION_ITEMS[i].ITEM_PRICE__, Format: FLOAT, value example: 3.5
      iq: lineItem.get("quantity"),                           // __TRANSACTION_ITEMS[i].ITEM_QUANTITY__, Format: INTEGER, value example: 4
      ic: lineItem.get("sku"),                                // __TRANSACTION_ITEMS[i].ITEM_CODE__, Format: STRING, value example: "SKU47"
      iv: itemCategory,                                       // __TRANSACTION_ITEMS[i].ITEM_CATEGORY__, Format: STRING, value example: "Blue"
      cv: {
        0: `finalSale, ${lineItem.get("finalSale")}`,
        1: `markdown, ${isMarkdown}`,
        2: `productId, ${lineItem.get("productId")}`,
      },
    })
  })
  /* eslint-enable sort-keys */
}

function toICents(value) {
  // nothing to convert so simple return null
  if (!value) {
    return null
  }

  // removes commas, decimal, and symbol
  const newValue = value.replace(/[.|,|$]/g, "")

  // return null if newValue is empty after remove
  if (!newValue) {
    return null
  }

  // finally return integer value
  return parseInt(newValue)

}

const RETRY_INTERVAL = 100 // ms
const MAX_RETRIES = 10 // 2s

export const getVisaCheckoutFromWindow = () => {
  let retries = 0
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (retries > MAX_RETRIES) {
        clearInterval(interval)
        resolve(Map()) // no data
      }

      try {
        const visaCheckoutSDK = (typeof window !== "undefined" && fromJS(window.V)) || Map()
        clearInterval(interval)
        resolve(visaCheckoutSDK)
      } catch (error){
        retries += 1
      }
    }, RETRY_INTERVAL)
  }) // 100ms
}

export const isUnauthorized = (response) => {
  if (response.status == 401) {
    return true
  }

  const data = response.data && response.data.toJS()
  if (data.errors && data.errors.fatalErrorKey == "invalid_user_token") {
    return true
  }

  return false
}
