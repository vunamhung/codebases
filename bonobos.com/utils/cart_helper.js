const DIGITAL_GIFT_CARD_SLUG = "bonobos-digital-gift-card"

export const hasOnlyDigitalGiftCard = (items) => (
  items && items.size > 0 && items.every((item) => item.get("slug") === DIGITAL_GIFT_CARD_SLUG)
)

export const containsGiftCard = (items) => {
  return items.some((item) => item.get("isGiftCard") === true)
}

export const containsDigitalGiftCard = (lineItems) => {
  return lineItems.some((item) => item.get("slug") === DIGITAL_GIFT_CARD_SLUG)
}
