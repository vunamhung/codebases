export const generateCategoryNavigationData = (baseNavItems, path) => {
  let activeItem, expandedItem
  let navItems = baseNavItems
  // If no base Level 0 Category is found this page is not in any Category tree
  // in this case, we just render the baseNavItems (the Level 0 categories)
  let expandedItemSiblings = baseNavItems
  // additionally, expandedItemSiblings (which are used for mobile dropdown) are set to base nav items
  const baseNavItem = findItemMatchingPath(path, baseNavItems)

  // Level 0 Category is active
  if (baseNavItem) {
    if (baseNavItem.get("path") === path) {
      activeItem = baseNavItem
      expandedItem = activeItem
      expandedItemSiblings = baseNavItems
    } else {
      expandedItemSiblings = baseNavItem.get("children")
      expandedItem = findItemMatchingPath(path, expandedItemSiblings)

      if (!expandedItem) {
        activeItem = baseNavItem
        expandedItem = activeItem
        expandedItemSiblings = baseNavItems
      } else {
        // Check for an active child, otherwise the expanded item is the active item
        const expandedChildren = expandedItem.get("children")
        const activeChildItem = expandedChildren && expandedChildren.find((item) => item.get("path") === path)
        activeItem = activeChildItem || expandedItem
      }
    }
    // Displayed navigation items are always the expanded siblings for typical category pages
    navItems = expandedItemSiblings
  }

  return {
    activeItem,
    expandedItem,
    expandedItemSiblings,
    navItems,
  }
}

const findItemMatchingPath = (path, items) => (
  items.find((item) => {
    const itemPath = item.get("path")
    const pathsMatchExactly = path === itemPath
    const pathIsChildOfItemPath = path && path.includes(itemPath) && path[itemPath.length] === "/"
    return  pathsMatchExactly || pathIsChildOfItemPath
  })
)
