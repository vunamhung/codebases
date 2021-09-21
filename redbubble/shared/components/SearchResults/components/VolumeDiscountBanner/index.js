import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Box from '@redbubble/design-system/react/Box';
import Text from '@redbubble/design-system/react/Text';
import { FormattedMessage } from 'react-intl';
import Skeleton from '@redbubble/design-system/react/Skeleton';
import Alert from '@redbubble/design-system/react/Alert';
import {
  searchResultsPropType,
} from '../../../../containers/apollo/withSearchResults';

const VolumeDiscountBanner = ({ results, searchResultPageLoading }) => {
  if (searchResultPageLoading) {
    // TODO: We should find a better way to set the height instead of
    // hardcoded pixels. Ideally font-size/text of some sort.
    return (
      <Box marginBottom="m" paddingLeft="xs" paddingRight="xs">
        <Skeleton width="100%" height="50px" />
      </Box>
    );
  }

  const volumeDiscounts = new Set(results.map(r => get(r, 'inventoryItem.volumeDiscount')));
  const volumeDiscount = volumeDiscounts.values().next().value;
  const pageHasOneVolumeDiscount = volumeDiscounts.size === 1;
  const eligible = pageHasOneVolumeDiscount && get(volumeDiscount, 'thresholds.length') > 0;
  if (!eligible) return null;

  return (
    <Box marginBottom="m" paddingLeft="xs" paddingRight="xs">
      <Alert label={false} centered>
        <Box display="flex" flexDirection="row" alignItems="center" flexWrap="wrap" justifyContent="center">
          {
            volumeDiscount
              .thresholds
              .slice()
              .sort((a, b) => a.quantity - b.quantity)
              .map(({ quantity, percentOff }) => (
                <div key={`volume-discount-${quantity}`} style={{ color: '#6551CC', marginRight: 16 * 0.5 }}>
                  <Text type="body">
                    <strong>
                      <FormattedMessage
                        defaultMessage="Buy any {quantity} and get {percentOff}% off."
                        values={{ quantity, percentOff }}
                      />
                    </strong>
                  </Text>
                </div>
            ))
          }
        </Box>
      </Alert>
    </Box>
  );
};

VolumeDiscountBanner.propTypes = {
  results: searchResultsPropType.isRequired,
  searchResultPageLoading: PropTypes.bool,
};

VolumeDiscountBanner.defaultProps = {
  searchResultPageLoading: false,
};

export default VolumeDiscountBanner;

