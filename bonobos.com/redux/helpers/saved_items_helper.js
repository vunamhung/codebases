
export const isSavedItem = (slug, colorName, savedItems) => (
  !savedItems.isEmpty() && savedItems.some((savedItem) => (
    savedItem.get("productSlug") === slug && savedItem.getIn(["options", "color"]) === colorName
  ))
)
