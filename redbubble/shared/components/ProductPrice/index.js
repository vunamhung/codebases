import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Box from '@redbubble/design-system/react/Box';
import Text from '@redbubble/design-system/react/Text';
import get from 'lodash/get';
import { calculateBestVolumeDiscount } from '../../lib/fromPrice';

const PriceDisplay = ({ children }) => (
  <Box data-testid="product-price">
    <Text display="block" type="display5">{children}</Text>
  </Box>
);

const ProductPrice = ({ inventoryItem, loading, allowEmptyPrice }) => {
  if (loading) {
    return (
      <Text display="block" type="display5" loading>
        00.00
      </Text>
    );
  }

  if (!inventoryItem) {
    return null;
  }

  const bestPrice = calculateBestVolumeDiscount({
    thresholds: get(inventoryItem, 'volumeDiscount.thresholds'),
    amount: get(inventoryItem, 'price.amount'),
    currency: get(inventoryItem, 'price.currency'),
  });

  if (bestPrice) {
    return (
      <PriceDisplay>
        <FormattedMessage
          defaultMessage="From {amount}"
          values={{
            amount: (
              <FormattedNumber
                value={bestPrice.price.amount}
                // eslint-disable-next-line
                style="currency"
                currency={bestPrice.price.currency}
              />
            ),
            quantity: bestPrice.quantity,
          }}
        />
      </PriceDisplay>
    );
  }

  if (inventoryItem.price) {
    return (
      <PriceDisplay>
        <FormattedNumber
          value={inventoryItem.price.amount}
          // eslint-disable-next-line
          style="currency"
          currency={inventoryItem.price.currency}
        />
      </PriceDisplay>
    );
  }

  if (allowEmptyPrice) {
    return <PriceDisplay>&nbsp;</PriceDisplay>;
  }

  return null;
};

PriceDisplay.propTypes = {
  children: PropTypes.node,
};

PriceDisplay.defaultProps = {
  children: null,
};

ProductPrice.propTypes = {
  loading: PropTypes.bool,
  allowEmptyPrice: PropTypes.bool,
  inventoryItem: PropTypes.shape({
    price: PropTypes.shape({
      amount: PropTypes.number,
      currency: PropTypes.string,
    }),
    volumeDiscount: PropTypes.shape({
      thresholds: PropTypes.arrayOf(PropTypes.shape({
        quantity: PropTypes.number,
        percentOff: PropTypes.number,
      })),
    }),
  }),
};

ProductPrice.defaultProps = {
  loading: false,
  allowEmptyPrice: false,
  inventoryItem: null,
};

export default ProductPrice;
