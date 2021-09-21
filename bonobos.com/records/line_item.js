import { Record } from "immutable"

const schema = {
  amount: null,
  bundleDiscount: false,
  canAdjustQuantity: true,
  description: null,
  description2: null,
  discountedBundles: null,
  discountedTotal: null,
  finalSale: null,
  fullPrice: null,
  fullPriceNumeric: null,
  id: null,
  image: null,
  isGiftCard: false,
  inStock: true,
  isPreorder: false,
  limitedQuantity: null,
  name: null,
  onSale: false,
  options: null,
  path: null,
  price: null,
  priceNumeric: null,
  productId: null,
  quantity: null,
  sku: null,
  slug: null,
  subtotalNumeric: null,
}

const isDigitalGiftCard = (lineItem) => (
  lineItem.getIn(["giftCardDetails", "giftCard"]) && lineItem.getIn(["giftCardDetails", "digital"])
)

const digitalGiftCardLineItem = (lineItem) => (
  lineItem.merge({
    description: lineItem.getIn(["giftCardDetails", "recipientInfo"]),
    description2: lineItem.getIn(["giftCardDetails", "deliveryInfo"]),
    canAdjustQuantity: false,
  })
)

class LineItemRecord extends Record(schema) {
  constructor(lineItemResponse) {
    const lineItem = isDigitalGiftCard(lineItemResponse)
      ? digitalGiftCardLineItem(lineItemResponse)
      : lineItemResponse

    super(lineItem)
  }
}

export default LineItemRecord
