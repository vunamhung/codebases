import { fromJS, List } from "immutable"
import { checkImmutable } from "highline/utils/immutable_helper"
import Qs from "qs"

export const defaultCategories = fromJS([
  {
    name: "Bonobos App",
    permalink: "/app",
    subCategories: List(),
  },
  {
    name: "Gift Cards",
    permalink: "/gift-cards",
    subCategories: List(),
  },
  {
    name: "Gift Box",
    permalink: "/products/gift-box",
    subCategories: List(),
  },
  {
    name: "Guideshop Locations",
    permalink: "/guideshop",
    subCategories: List(),
  },
])

function buildCategory(category) {
  const navItems = fromJS({
    label: category.get("name"),
    path: `/shop/${category.get("permalink")}`,
  })
  const subCategories = category.get("subCategories")
  if (subCategories.size > 0) {
    return navItems.merge({
      children: setupCategories(category.get("subCategories")),
    })
  }
  return navItems
}

export const setupCategories = (categories) => {
  return categories
    .map((category) => {
      return buildCategory(category)
    })
}

// un-set expanded category if already set
export const toggleCategory = (state, categoryName) => {
  return state.get("expandedCategory") === categoryName
    ? state.set("expandedCategory", "")
    : state.set("expandedCategory", categoryName)
}

export const findActiveCategory = (categories, path) => {
  let activeCategory = ""
  let activePermalink = ""
  let expandedCategory = ""

  categories.forEach((category) => {
    category.get("subCategories", List()).forEach((subCategory) => {
      if (path.endsWith(subCategory.get("permalink"))) {
        activeCategory = subCategory.get("name")
        activePermalink = subCategory.get("permalink")
        expandedCategory = category.get("name")
        return // short circut
      }
    })

    // matching sub-cat takes precedence
    // stop searching if found
    if (activeCategory)
      return

    if (path.endsWith(category.get("permalink"))) {
      activeCategory = category.get("name")
      activePermalink = category.get("permalink")
      expandedCategory = category.get("name")
      return // short circut
    }
  })

  return { activeCategory, activePermalink, expandedCategory }
}

/*
* Navigation V2 helpers
*/

export const getSubNavItems = (items, label) => {
  if (!items || !checkImmutable(items)) {
    return fromJS([])
  }

  const subNavItems = items.find(
    (item) => item.get("label") === label,
  )

  if (!subNavItems || !checkImmutable(subNavItems)) {
    return fromJS([])
  }

  return subNavItems.get("children") || fromJS([])
}

export const getRootCategoryPath = (path) => {
  return path ? path.substr(0, path.lastIndexOf("/")) : ""
}

export const shouldNavItemCollapse = (items, label) => {
  const subNavItems = getSubNavItems(items, label)
  // returns true if all L2's have no L3's
  return subNavItems.every((subNavItem) => subNavItem.get("children").isEmpty())
}

export const getRedirectUrl = (currentPage, onSuccessUrl) => {
  if (onSuccessUrl) return onSuccessUrl

  const haveReferrerAndOriginData = currentPage.get("referrer") && currentPage.get("origin")
  const referrerHasBonobosOrigin = currentPage.get("referrer").startsWith(currentPage.get("origin"))
  if (!haveReferrerAndOriginData || !referrerHasBonobosOrigin) return "/"

  const query = Qs.stringify(currentPage.get("referrerQuery").toJS(), { arrayFormat: "brackets" })
  return query ? `${currentPage.get("referrer")}?${query}` : currentPage.get("referrer")
}