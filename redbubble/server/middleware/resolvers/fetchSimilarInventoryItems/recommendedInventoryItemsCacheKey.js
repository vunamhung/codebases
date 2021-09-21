const recommendedInventoryItemsCacheKey = (prefix, args) => ([
  prefix,
  ...args.inventoryItemId.split('_').slice(0, 2),
  args.locale,
  args.artistUserName,
].join(':'));

export default recommendedInventoryItemsCacheKey;
