import { fromJS } from "immutable"
import { containsDigitalGiftCard } from "./cart_helper"
import getConfig from "highline/config/application"

export const hasAttachedCreditCardWithOnlyFailedPayments = (order) => {
  const attachedCreditCard =  order.get("creditCard")
  const payments = order.get("payments")
  if (!attachedCreditCard || attachedCreditCard.isEmpty() || !payments){
    return false
  }
  const paymentsFromAttachedCreditCard = payments.filter((payment) => {
    return payment.get("sourceId") === attachedCreditCard.get("id") &&
      payment.get("sourceType") === "Spree::CreditCard"
  })
  const allPaymentsForAttachedCreditCardAreFailing = paymentsFromAttachedCreditCard.every((payment) => {
    return payment.get("state") === "failed"
  })
  return allPaymentsForAttachedCreditCardAreFailing
}

export const createErrorForAttachedCreditCardWithOnlyFailedPayments = (order) => {
  const attachedCreditCardLastDigits =  order.getIn(["creditCard", "lastDigits"])
  const creditCardText = attachedCreditCardLastDigits ?
    ` ending in ${attachedCreditCardLastDigits}` :
    ""
  const errorText = `There was an issue with your credit card${creditCardText}. Please enter payment details in again.`

  return fromJS({
    "errors": {
      "creditCard": [errorText],
    },
  })
}

export const findGiftCardPayment = (payments) => {
  if (!payments){
    return
  }
  return payments.find((payment) => (
    payment.get("sourceType") === "Spree::GiftCard" && payment.get("state") !== "invalid"
  ))
}

const ccModifiedInCurrentSession = (order) => {
  const orderCreatedAt = new Date(order.get("createdAt"))
  const ccUpdatedAt = new Date(order.getIn(["creditCard", "updatedAt"]))
  return orderCreatedAt < ccUpdatedAt
}

const addressModifiedInCurrentSession = (order) => {
  const orderCreatedAt = new Date(order.get("createdAt"))
  const addressUpdatedAt = new Date(order.getIn(["address", "updatedAt"]))
  return orderCreatedAt < addressUpdatedAt
}

export const shouldValidateCreditCardSecurityCode = (order, cartLineItems) => {
  const { ccSecurityCodeValidationEnabled } = getConfig()
  if (!ccSecurityCodeValidationEnabled || ccModifiedInCurrentSession(order)) {
    return false
  }

  if (order.get("coveredByStoreCredit") || order.get("giftCardCoversFullOrder")) {
    return false
  }

  return addressModifiedInCurrentSession(order) || containsDigitalGiftCard(cartLineItems)
}
