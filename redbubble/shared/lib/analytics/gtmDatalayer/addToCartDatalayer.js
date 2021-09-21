import { ADD_TO_CART_ACTION } from '../../analytics';

export class AddToCartDatalayer {
  constructor() {
    this.inventoryItemId = null;
    this.retargetingId = null;
    this.gaCode = null;
    this.workTitle = null;
    this.price = null;
    this.currency = null;
    this.quantity = null;
  }

  setInventoryItemId(inventoryItemId) {
    this.inventoryItemId = inventoryItemId;
    return this;
  }

  setRetargetingId(retargetingId) {
    this.retargetingId = retargetingId;
    return this;
  }

  setGaCode(gaCode) {
    this.gaCode = gaCode;
    return this;
  }

  setWorkTitle(workTitle) {
    this.workTitle = workTitle;
    return this;
  }

  setPrice(price) {
    this.price = price;
    return this;
  }

  setCurrency(currency) {
    this.currency = currency;
    return this;
  }

  setQuantity(quantity) {
    this.quantity = quantity;
    return this;
  }

  build() {
    return {
      event: ADD_TO_CART_ACTION,
      ecommerce: {
        currencyCode: this.currency,
        add: {
          products: [{
            name: this.workTitle,
            id: this.inventoryItemId,
            retargeting_id: this.retargetingId,
            price: this.price,
            category: this.gaCode,
            quantity: this.quantity,
          }],
        },
      },
    };
  }
}
