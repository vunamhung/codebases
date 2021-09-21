import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"

const STATIC_PAGES = fromJS([
  {
    title: "About Bonobos",
    links: [
      { name: "About Page", slug: "/about" },
      { name: "Help", slug: "/help" },
      { name: "Contact Us", slug: "/contact-us" },
      { name: "Privacy", slug: "/privacy" },
      { name: "Terms of Service", slug: "/terms" },
      { name: "Press", slug: "/press" },
      { name: "Jobs", slug: "/jobs" },
      { name: "Role Models", slug: "/rolemodels" },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "Sign In", slug: "/sign-in" },
      { name: "General", slug: "/account" },
      { name: "Exchange", slug: "/account" },
      { name: "My Fit", slug: "/account/fit-preferences" },
      { name: "Addresses", slug: "/account/shipping" },
      { name: "Wallet", slug: "/account/wallet" },
      { name: "Saved Items", slug: "/account/saved-items" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "Guideshop Locations", slug: "/guideshop" },
    ],
  },
  {
    title: "Gifting",
    links: [
      { name: "Gift Cards", slug: "/gift-cards" },
      { name: "Gift Box", slug: "/products/gift-box" },
    ],
  },
])

const initialState = fromJS({
  categories: [],
  staticPages: STATIC_PAGES,
})

const sitemapReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.SITEMAP_FETCH_SUCCEEDED: {
      return initialState.set("categories", action.data.get("categories"))
    }

    default:
      return state
  }
}

export default sitemapReducer
