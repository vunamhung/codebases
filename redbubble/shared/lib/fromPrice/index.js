const calculateVolumeDiscount = ({ amount, percentOff }) => {
  if (!amount || !percentOff) return null;

  const discount = amount * (percentOff / 100);
  return amount - discount;
};

const calculateBestVolumeDiscount = ({ thresholds, amount, currency }) => {
  if (!amount || !currency || !Array.isArray(thresholds) || thresholds.length === 0) {
    return null;
  }

  const bestPercentOff = Math.max(...thresholds.map(({ percentOff }) => percentOff));
  const highestQuantity = Math.max(...thresholds.map(({ quantity }) => quantity));
  const bestAmount = calculateVolumeDiscount({ amount, percentOff: bestPercentOff });
  return {
    price: {
      currency,
      amount: bestAmount,
    },
    quantity: highestQuantity,
  };
};


export { calculateVolumeDiscount, calculateBestVolumeDiscount };
