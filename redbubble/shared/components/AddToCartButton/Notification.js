import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Text from '@redbubble/design-system/react/Text';
import Alert from '@redbubble/design-system/react/Alert';
import Box from '@redbubble/design-system/react/Box';
import Button from '@redbubble/design-system/react/Button';
import * as constants from '@redbubble/design-system/react/constants';
import Image from '@redbubble/design-system/react/Image';
import CheckDiscIcon from '@redbubble/design-system/react/Icons/CheckDisc';
import { analyticsPayload } from '../../lib/analytics';
import { getAllAttributeValues } from '../../lib/inventory';
import { useUserInfo } from '../../containers/apollo/withUserInfo';
import { useAnalyticsActions } from '../../containers/redux/withAnalytics';
import { nsfwImageByLocale } from '../../lib/nsfw';
import { useQuickCartContext } from '../../components/QuickCart/useQuickCartContext';

import VolumeDiscount from '../VolumeDiscount';
import styles from './styles.css';

function getProductImage({ inventoryItem, work, userInfo }) {
  const showNsfwImage = work.isMatureContent && !userInfo.showMatureContent;
  if (showNsfwImage) return nsfwImageByLocale(userInfo.locale);

  const previews = get(inventoryItem, 'previewSet.previews', []);
  const preview = previews.find(p => p.previewTypeId === 'product_close');
  return preview && preview.url ? preview.url : null;
}

const AddedToCartMessage = ({
  href,
  imageUrl,
  loading,
  caption,
  body,
  onClick,
}) => {
  return (
    <a
      className={styles.notification}
      href={href}
      onClick={onClick}
    >
      <Box
        display="flex"
        alignItems="center"
        marginRight="xs"
        marginBottom="xs"
      >
        <Box marginRight="xs">
          <div className={styles.productImage}>
            <CheckDiscIcon />
            <Image style={{ width: 56, height: 56 }} src={imageUrl} roundedCorners />
          </div>
        </Box>
        <Box flex="1" style={{ minWidth: 0 }}>
          <Text className={styles.text} display="block" type="display5">
            <FormattedMessage defaultMessage="Added to Cart" />
          </Text>
          <Text loading={loading} className={styles.text} display="block" type="body2">{body}</Text>
          <Text loading={loading} className={styles.text} display="block" type="caption">{caption}</Text>
        </Box>
      </Box>
    </a>
  );
};

AddedToCartMessage.propTypes = {
  href: PropTypes.string,
  imageUrl: PropTypes.string,
  loading: PropTypes.bool,
  caption: PropTypes.string,
  body: PropTypes.string,
  onClick: PropTypes.func,
};

AddedToCartMessage.defaultProps = {
  href: null,
  imageUrl: null,
  loading: false,
  caption: null,
  body: null,
  onClick: () => {},
};

const Notification = ({ inventoryItem, work }) => {
  const { id, productUrl } = inventoryItem;
  const { userInfo } = useUserInfo();
  const { logEvent } = useAnalyticsActions();
  const { isEnabled: isQuickCartEnabled } = useQuickCartContext();

  const attributes = get(inventoryItem, 'attributes') || [];
  const description = get(inventoryItem, 'description', null);
  const volumeDiscount = get(inventoryItem, 'volumeDiscount', null);

  return (
    <div
      style={{ minWidth: '100%' }}
      data-testid="addToCartNotification"
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <AddedToCartMessage
          imageUrl={getProductImage({ inventoryItem, work, userInfo })}
          href={productUrl}
          caption={getAllAttributeValues(attributes, 'defaultText').join(', ')}
          body={description}
          onClick={() => {
            logEvent(analyticsPayload.toastProductClicked(id));
          }}
        />

        <Button
          onClick={() => {
            logEvent(analyticsPayload.toastViewCartClicked(id));
            window.location.href = '/cart';
          }}
          intent={constants.PRIMARY}
          size={constants.MEDIUM}
        >
          {isQuickCartEnabled
            ? <FormattedMessage defaultMessage="Checkout" />
            : <FormattedMessage defaultMessage="View Cart" />
          }
        </Button>
      </Box>
      {get(volumeDiscount, 'thresholds.length') > 0 &&
        <Box marginTop="m">
          <Alert label={false} >
            <Box display="flex" flexDirection="column" alignItems="center">
              <VolumeDiscount
                currency={get(inventoryItem, 'price.currency')}
                amount={get(inventoryItem, 'price.amount')}
                volumeDiscount={volumeDiscount}
              />
            </Box>
          </Alert>
        </Box>
      }
    </div>
  );
};

Notification.propTypes = {
  inventoryItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired,
    }),
    productTypeId: PropTypes.string,
    productPageUrl: PropTypes.string.isRequired,
    gaCode: PropTypes.string,
    gaCategory: PropTypes.string,
  }),
  work: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    isMatureContent: PropTypes.bool,
    artistName: PropTypes.string,
  }),
};

Notification.defaultProps = {
  inventoryItem: {},
  work: {},
};

export default Notification;
