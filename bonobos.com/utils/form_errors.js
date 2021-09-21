import { fromJS } from "immutable"

// Error parsing for the default format of API errors, useful for
// displaying the error message & input error in form components
// error = {
//   message: "This is the error message",
//   input: ["This input has an error"]
// }
export const getGeneralError = (error) => (
  error && error.getIn && error.getIn(["errors", "general", 0])
)

export const getGiftCardError = (error) => (
  error && error.getIn && error.getIn(["errors", "giftCard", 0])
)

// Return first error message for a given input
export const getInputError = (error, root, input) => (
  error && error.getIn && error.getIn(["errors", root, input, 0])
)

export const getPasswordResetError = (error) => (
  error && error.getIn && error.getIn(["errors", "fatal", 0]) ||
  error && error.getIn && error.getIn(["errors", "user", "resetPasswordToken", 0]) || ""
)

export const getBillingAddressErrors = (error) => {
  if (
    !error ||
    error.isEmpty() ||
    !error.getIn(["errors", "billAddress"])
  ) {
    return fromJS({})
  }

  return fromJS({
    errors: {
      address: error.getIn(["errors", "billAddress"], {}),
    },
  })
}

export const getBillingErrors = (error) => {
  if (
    !error ||
    !error.get ||
    !error.deleteIn
  ) {
    return ""
  }

  const billingErrors = error.deleteIn(["errors", "billAddress"]).deleteIn(["errors", "giftCard"])
  if (!billingErrors || billingErrors.isEmpty()) {
    return ""
  }

  const value = billingErrors.get("errors").valueSeq().first()
  if (!value || value.isEmpty()) {
    return ""
  }

  return value.first()
}

export const getCreditCardErrors = (error) => {
  if (
    !error ||
    !error.get ||
    !error.deleteIn
  ) {
    return ""
  }

  const creditCardErrors = error.getIn(["errors", "creditCard"])
  if (!creditCardErrors || creditCardErrors.isEmpty()) {
    return ""
  }

  const value = creditCardErrors.valueSeq().first()
  if (!value || (value.isEmpty && value.isEmpty())) {
    return ""
  }

  return (value.first) ? value.first() : value
}

export const getPromoErrors = (error) => {
  if (
    !error ||
    !error.get ||
    !error.deleteIn ||
    error.isEmpty()
  ) {
    return ""
  }

  return error.getIn(["errors", "promotion"], [""]).first()
}

export const getReviewOrderErrors = (error) => {
  if (
    !error ||
    !error.get ||
    error.isEmpty()
  ) {
    return ""
  }

  const value = error.get("errors").valueSeq().first()
  if (!value || value.isEmpty()) {
    return ""
  }

  if (value.first() === "can't be blank") {
    return ""
  }

  return value.first()
}

export const getShippingGeneralErrors = (error) => {
  if (
    !error ||
    !error.get ||
    !error.deleteIn
  ) {
    return ""
  }

  const generalErrors = error.get("errors", fromJS({})).delete("address")
  if (!generalErrors || generalErrors.isEmpty()) {
    return ""
  }

  return generalErrors.valueSeq().first()
}
