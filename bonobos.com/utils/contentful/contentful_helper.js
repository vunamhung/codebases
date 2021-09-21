import { camelize } from "humps"
import { fromJS, List, Map } from "immutable"
import { BASE_CONTENTFUL_URL, IMGIX_CONTENTFUL_URL } from "highline/utils/contentful/constants"
import classNames from "classnames"
import CategoryNavigationV2Container from "highline/containers/category_navigation_v2_container"

import styles from "highline/styles/utils/contentful/contentful_helper.module.css"

/* Used to get a Contentful object by any field which may be a specific entry or array of entries */
export const getObjectByIdentifier = (contentArray,  identifier, parameter) => {
  try {
    const result = contentArray.find((content) => {
      const field = getField(content, identifier)
      return field ? camelize(field) === camelize(parameter) : false
    })
    return result
  } catch {
    return undefined
  }
}

/* Used to get a Contentful object by its first field */
export const getObjectByFirstField = (contentArray, identifier) => {
  try {
    const result = contentArray.find((content) => {
      const field = content.get("fields").first()
      return field ? camelize(field) === camelize(identifier) : false
    })
    return result
  } catch {
    return undefined
  }
}

export const getField = (entry, fieldId) => {
  try {
    return entry.getIn(["fields", fieldId], undefined)
  } catch {
    return undefined
  }
}

/* Fallback included here in case image is not included in the Content Entry.
This function also converts the image to be the appropriate URL for imgix */
export const getImgixUrl = (image) => {
  try {
    const contentfulUrl = image.getIn(["fields", "file", "url"])
    return contentfulUrl ? `https:${contentfulUrl.replace(BASE_CONTENTFUL_URL, IMGIX_CONTENTFUL_URL)}` : image
  } catch {
    return image
  }
}

// This function attempts to find the width/height details for an image object from Contentful
// Otherwise, defaults to 0 width and 0 height
export const getImageDimensions = (image) => {
  return image.getIn(["fields", "file", "details", "image"]) || fromJS({ width: 0, height: 0 })
}

/* Fallback included here in case asset is not included in the Content Entry.
This function also converts the asset to be the appropriate URL*/
export const getAssetUrl = (asset) => {
  try {
    const assetUrl = asset.getIn(["fields", "file", "url"])
    return assetUrl ? `https:${assetUrl}` : asset
  } catch {
    return asset
  }
}

export const getContentType = (entry) => {
  try {
    return entry.getIn(["sys", "contentType", "sys", "id"])
  } catch {
    return null
  }
}

export const getContentfulEntriesByContentType = (entries, contentType) => {
  return entries ? entries.filter((entry) => entry.getIn(["sys", "contentType", "sys", "id"]) === contentType) : null
}

export const getContentfulProducts = (productTiles) => {
  return productTiles.map((tile) => {
    return {
      sku: tile.dataset.sku,
      color: tile.dataset.color,
    }
  })
}

export const renderTabletNavigationHeader = (showNav) => {
  return (
    <div
      className={
        classNames(
          styles.tabletNavigationWrapper,
          styles.hideOnDesktop,
        )
      }
    >
      { showNav && <CategoryNavigationV2Container showForSmartPhoneAndTablet /> }
    </div>
  )
}

export const filterContentByUrl = (contentArray, currentPath) => {
  if (typeof currentPath !== "string" || !List.isList(contentArray)) return Map()

  const bestMatch = contentArray.reduce((currentBestMatch, content) => {
    // account for the different "disabled" fields of contentful GMBs and PLP Content Blocks - should fix this
    if (getField(content, "disableBlock") || getField(content, "disableGmb")) return currentBestMatch

    const currentBestPath = currentBestMatch ? getField(currentBestMatch, "path") : ""
    const contentPath = getField(content, "path")
    const canBePartialMatch = getField(content, "matchType") === "Include Child URLs"

    if (currentPath.includes(contentPath)
      && contentPath.length > currentBestPath.length
      && (canBePartialMatch || contentPath.length === currentPath.length)
    ) {
      currentBestMatch = content
    }

    return currentBestMatch
  }, null)

  if (bestMatch) return bestMatch
  return Map()
}

export const getPageGmb = (currentPath, allContentfulGmbs) => {
  let gmbPath = filterContentByUrl(allContentfulGmbs, currentPath)
  // If no matches by url, see if there is a "default" path gmb
  if (gmbPath.isEmpty()) {
    gmbPath = getObjectByIdentifier(allContentfulGmbs, "path", "default")
  }
  const gmbs = getField(gmbPath, "gmbs")
  // "gmbs" isn't a required field, and may not exist on the object
  if (!gmbs) return null

  // Only support one GMB
  const gmbObject = gmbs.first()
  return {
    backgroundColor: getField(gmbObject, "backgroundColor"),
    description: getField(gmbObject, "description"),
    textColor: getField(gmbObject, "textColor"),
    title: getField(gmbObject, "title"),
  }
}

export const doesFilterHaveMatch = (params, selectedFilters) => {
  const urlObject = {}
  params.split("&").forEach((param) => {
    const pair = param.split("=")
    pair[0] in urlObject
      ? urlObject[pair[0]].push(pair[1])
      : urlObject[pair[0]] = [pair[1]]
  })
  const filterMatch = fromJS(urlObject)
  return filterMatch.some((filterValues, filterType) => {
    return selectedFilters.has(filterType)
      ? filterValues.some((filterValue) => selectedFilters.get(filterType).includes(filterValue))
      : false
  })
}

export const getBundlePromoTileData = (bundlePromoTiles, selectedFilters, slug) => {
  try {
    return bundlePromoTiles.find((content) => {
      const field = getField(content, "target")
      if (field.includes("?")) {
        const path = field.split("?")[0]
        const params = field.split("?")[1]
        const isFilterMatch = doesFilterHaveMatch(params, selectedFilters)
        return camelize(path) === camelize(slug) && isFilterMatch
      }
      return field ? camelize(field) === camelize(slug) : false
    })
  } catch {
    return undefined
  }
}

export const getAutoApplyPromoFields = (contentfulData) => {
  const data = getObjectByIdentifier(contentfulData, "target", "Auto-Apply Promo")
  if (!data) { return null }
  return data.getIn(["fields", "content", "0", "fields"])
}

export const getContentfulId = (entry) => {
  try {
    return entry.getIn(["sys", "id"])
  } catch {
    return undefined
  }
}
