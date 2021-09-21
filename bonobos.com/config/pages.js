import { fromJS, List } from "immutable"

export const ncoRegex = /^\/nco$/
export const appPageRegex = /^\/app$/
export const categoryRegex = /^\/shop\/.+$/
export const giftCardRegex = /^\/products\/bonobos-digital-gift-card|bonobos-physical-gift-card\/.+$/
export const giftCardsRegex = /^\/gift-cards$/
export const homepageRegex = /^\/$/
export const jobsRegex = /^\/jobs$/
export const productRegex = /^\/products\/.+$/
export const rolemodelsRegex = /^\/rolemodels/
export const signInRegex = /^\/sign-in&/

export const highlinePages = fromJS([
  ncoRegex,
  appPageRegex,
  categoryRegex,
  giftCardsRegex,
  homepageRegex,
  jobsRegex,
  productRegex,
  rolemodelsRegex,
  signInRegex,
])

export const funnelPageCategories = List(["Homepage", "Product", "Category", "Checkout"])
