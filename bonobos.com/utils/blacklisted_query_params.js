const blacklistedQueryParams = new Set([
  "email",
  "password",
  "firstname",
  "lastname",
  // Shipping
  "address1",
  "address2",
  "country",
  "city",
  "State",
  "postalcode",
  "phone",
  // Billing
  "name",
  "cardnumber",
  "expirydate",
  "securitycode",
])

const isQueryParamBlacklisted = (paramName) => {
  const normalizedParamName = paramName.trim().toLowerCase()

  return blacklistedQueryParams.has(normalizedParamName)
}

module.exports = isQueryParamBlacklisted
