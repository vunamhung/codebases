import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { calculateVolumeDiscount } from '../../lib/fromPrice';
import styles from './VolumeDiscount.css';

const VolumeDiscount = (props) => {
  const {
    volumeDiscount,
    currency,
    amount,
  } = props;
  const thresholds = get(volumeDiscount, 'thresholds', []);

  if (!thresholds.length) return null;

  const sortedThresholds = thresholds.slice().sort((a, b) => a.quantity - b.quantity);
  const [firstThreshold, ...remainingThresholds] = sortedThresholds;
  const firstItem = (
    <strong key={firstThreshold.quantity}>
      <DiscountItem
        threshold={firstThreshold}
        currency={currency}
        amount={amount}
      />
    </strong>
  );
  const remainingItems = remainingThresholds.map(threshold => (
    <DiscountItem
      key={threshold.quantity}
      threshold={threshold}
      currency={currency}
      amount={amount}
    />
  ));

  return [firstItem, ...remainingItems];
};

VolumeDiscount.propTypes = {
  volumeDiscount: PropTypes.shape({
    thresholds: PropTypes.arrayOf(PropTypes.shape({
      quantity: PropTypes.number.isRequired,
      percentOff: PropTypes.number.isRequired,
    })).isRequired,
  }),
  currency: PropTypes.string,
  amount: PropTypes.number,
};

VolumeDiscount.defaultProps = {
  volumeDiscount: null,
};

const DiscountItem = ({ threshold, amount, currency }) => {
  const { quantity, percentOff } = threshold;

  return (
    <div className={styles.volumeDiscount}>
      <FormattedMessage
        defaultMessage="{amount} when you buy {quantity}+"
        values={{
          quantity,
          amount: (
            <FormattedNumber
              value={calculateVolumeDiscount({ amount, percentOff })}
              // eslint-disable-next-line
              style="currency"
              currency={currency}
            />
          ),
        }}
      />
    </div>
  );
};

DiscountItem.propTypes = {
  threshold: PropTypes.shape({
    quantity: PropTypes.number.isRequired,
    percentOff: PropTypes.number.isRequired,
  }).isRequired,
  amount: PropTypes.number,
  currency: PropTypes.string,
};

DiscountItem.defaultProps = {
  amount: 1.00,
  currency: 'USD',
};

export default VolumeDiscount;
