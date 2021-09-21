export const EXPIRY_DATE_DELIMITER = " / "

export const EXPIRY_DATE_YEAR_PREFIX = "20"

const modifyCreditCardErrors = (errors) =>
  errors.update("creditCard", (creditCardErrors) =>
    creditCardErrors.map((error) => error.replace("MM/YYYY", "MM / YY")))

export const addPaymentError = (error) =>
  error.update("errors", (errors) =>
    errors.has("creditCard") ? modifyCreditCardErrors(errors) : errors)
