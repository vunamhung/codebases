import { Map } from "immutable"
import { categoryRegex, productRegex, giftCardRegex } from "highline/config/pages"
import { extractQueryString, getBasePath } from "highline/utils/url"

/*
 Returns an immutable object that can be used for Next.Link client side routing
 href: The value used by Next.Link to determine which page to load and parameters to pass
 as: The value that is displayed in the browsers URL
*/
export const getClientSideLink = (link) => {
  // Extract and format query parmeters if applicable
  const queryString = extractQueryString(link)
  const product_query = queryString ? `?${queryString}` : ""

  // Remove query parameters from url if applicable
  const baseLink = getBasePath(link)

  if (giftCardRegex.test(baseLink) || productRegex.test(baseLink)) { // PDP
    return Map({
      as: link,
      href: `/products/[slug]${ product_query }`,
    })
  }

  if (categoryRegex.test(baseLink)) { // Category
    return Map({
      as: link,
      href: "/shop/[...category]",
    })
  }

  // Any other page
  return Map({
    as: link,
    href: link,
  })
}
