import get from 'lodash/get';

export const completeHydrationFailure = (requestedItems, receivedItems) => {
  return (
    requestedItems.length > 0 &&
    receivedItems.length === 0
  );
};

export const pricingHydrationFailure = (inventoryItems) => {
  const ignoreEmptyItems = inventoryItems.filter(i => i && i.id);
  const missingPrices = ignoreEmptyItems.filter(i => !get(i, 'price.amount'));

  return missingPrices.length;
};

export const previewsHydrationFailure = (inventoryItems) => {
  const ignoreEmptyItems = inventoryItems.filter(i => i && i.id);
  const missingPreviews = ignoreEmptyItems.filter((i) => {
    return (get(i, 'previewSet.previews') || []).length === 0;
  });

  return missingPreviews.length;
};

export const productPageUrlsHydrationFailure = (inventoryItems) => {
  const ignoreEmptyItems = inventoryItems.filter(i => i && i.id);
  const missingProductPageUrls = ignoreEmptyItems.filter(i => !get(i, 'productPageUrl'));

  return missingProductPageUrls.length;
};
