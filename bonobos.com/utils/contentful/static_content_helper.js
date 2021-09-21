import { getField, getObjectByFirstField } from "highline/utils/contentful/contentful_helper"

export const getStaticContentByFirstField = (contentfulResponse, identifier) => {
  try {
    const contentfulStaticContents = getField(getObjectByFirstField(contentfulResponse, "Static Content"), "content")
    return getObjectByFirstField(contentfulStaticContents, identifier)
  } catch {
    return undefined
  }
}

export const StaticContentMap = {
  Account_Order_History_Text: "Account Order History Text",
  New_Customer_Modal_Image: "New Customer Modal Image",
  New_Customer_Modal_Data: "New Customer Modal Data",
}

