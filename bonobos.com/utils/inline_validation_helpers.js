export const requiredField = (value, name , errorMessage = formatName(name) + " is required") => (RegExp(/^\w+.*$/).test(value)) ? null : errorMessage
// ^ Starts with a number or letter, with any other characters following
export const ccSecurityCode = (value, name, errorMessage = formatName(name) + " is required: 3-4 digits") => (RegExp(/^\d{3,4}/).test(value)) ? null : errorMessage
export const number = (value, name, errorMessage = formatName(name) + " is required") => (RegExp(/^\d/).test(value)) ? null : errorMessage
export const password = (value, name, errorMessage = "Required: Min. of 7 characters- Must include at least 1 letter and 1 number") => (RegExp(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).{7,}$/).test(value)) ? null : errorMessage
export const email = (value, name, errorMessage = "Valid " + formatName(name) + " is required") => (RegExp(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/).test(value)) ? null : errorMessage
// ^ Starts with alpha-numeric characters or a few accepted symbols, followed by an @, alpha-numeric, ".", and more alpha-numeric
export const phoneNumber = (value, name = "phone number", errorMessage = formatName(name) + " Required: Can only contain numbers, '()', and '-'") => (RegExp(/^\(?\d+\)?\d*-?\d*-?\d*-?\d*-?$/).test(value)) ? null : errorMessage
// ^ Starts with a numbers or "()", with optional numbers and "-" following
const SHIPPABLE_COUNTRIES = {
  AU: { regex: /^\d{4}$/, name: "Australia" },
  CA: { regex: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/, name: "Canada" },
  JP: { regex: /^\d{3}-\d{4}$/, name: "Japan" },
  MG: { regex: /^\d{3}$/, name: "Madagascar" },
  MX: { regex: /^\d{5}$/, name: "Mexico" },
  NZ: { regex: /^\d{4}$/, name: "New Zealand" },
  PE: { regex: /^\d{5}$/, name: "Peru" },
  US: { regex: /^(\d{5}|\d{5}-\d{4})$/, name: "US" },
}
export const zipcode = (
  value,
  name,
  country,
  errorMessage,
) => {
  errorMessage = errorMessage ?? formatName(name) + ` Required: Invalid postal code for ${SHIPPABLE_COUNTRIES[country].name}`
  return  SHIPPABLE_COUNTRIES[country].regex.test(value)? null : errorMessage
}
// ^ Starts with a number, with optional "-" and numbers following
// --------------------------------
// Used to format name and make camelCase fields have spaces
const formatName = (camelCase) => camelCase
  .replace(/([A-Z])/g, (match) => ` ${match}`)
  .replace(/^./, (match) => match.toUpperCase())

// Validates if email ends in @bonobos.com
export const bonobosEmail = /.+@bonobos\.com$/