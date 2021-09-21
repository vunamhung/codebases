import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, intlShape } from 'react-intl';
import Image from '@redbubble/design-system/react/Image';
import * as constants from '@redbubble/design-system/react/constants';
import Text from '@redbubble/design-system/react/Text';
import TextLink from '@redbubble/design-system/react/TextLink';
import Card from '@redbubble/design-system/react/Card';
import List, { ListItem } from '@redbubble/design-system/react/List';
import Box from '@redbubble/design-system/react/Box';
import shippingImagePath from './assets/shipping.svg';
import secureImagePath from './assets/secure.svg';
import returnsImagePath from './assets/returns.svg';
import supportImagePath from './assets/support.svg';
import styles from './styles.css';

const TRUST_SIGNAL_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQIHWP4zwwAAgQBAy1fSHQAAAAASUVORK5CYII=';

const messages = defineMessages({
  worldwideShipping: 'Worldwide Shipping',
  standardOrExpress: 'Available as Standard or Express delivery',
  securePayments: 'Secure Payments',
  encryption: '100% Secure payment with 256-bit SSL Encryption',
  freeReturn: 'Free Return',
  guarantee: 'Exchange or money back guarantee for all orders',
  localSupport: 'Local Support',
  localSupportDescription: '24/7 Dedicated support',
  learnMore: 'Learn more',
  submitRequest: 'Submit a request',
});

const helpCenterBaseUrl = 'https://help.redbubble.com/hc/';
const TrustSignals = ({
  intl,
  locale,
}) => {
  const signals = [
    {
      image: shippingImagePath,
      imageAlt: intl.formatMessage(messages.worldwideShipping),
      title: intl.formatMessage(messages.worldwideShipping),
      subtitle: intl.formatMessage(messages.standardOrExpress),
      link: `${helpCenterBaseUrl}${locale}/articles/203024315`,
    },
    {
      image: secureImagePath,
      imageAlt: intl.formatMessage(messages.securePayments),
      title: intl.formatMessage(messages.securePayments),
      subtitle: intl.formatMessage(messages.encryption),
      link: `${helpCenterBaseUrl}${locale}/articles/206337916`,
    },
    {
      image: returnsImagePath,
      imageAlt: intl.formatMessage(messages.freeReturn),
      title: intl.formatMessage(messages.freeReturn),
      subtitle: intl.formatMessage(messages.guarantee),
      link: `${helpCenterBaseUrl}${locale}/articles/201250609`,
    },
    {
      image: supportImagePath,
      imageAlt: intl.formatMessage(messages.localSupport),
      title: intl.formatMessage(messages.localSupport),
      subtitle: intl.formatMessage(messages.localSupportDescription),
      link: `${helpCenterBaseUrl}${locale}/requests/new`,
      linkText: intl.formatMessage(messages.submitRequest),
    },
  ];

  return (
    <Card>
      <Box
        className={styles.displayLarge}
        justifyContent="space-between"
        flexWrap="wrap"
      >
        {signals.map(signal => (
          <Box className={styles.largeTustSignal} padding="xl" flex="1" key={signal.link}>
            <Box display="flex" alignItems="center" flexDirection="column">
              <Box style={{ height: 'var(--ds-size-dimension-09)', width: 'auto' }}>
                <Image
                  fluid
                  src={signal.image}
                  alt={signal.imageAlt}
                  loadOnVisible={{ placeholder: TRUST_SIGNAL_PLACEHOLDER }}
                  size={constants.MEDIUM}
                />
              </Box>
              <Box marginTop="xl" display="flex" flexDirection="column">
                <Text type="display5" display="block">
                  { signal.title }
                </Text>
                <Text type="body2" muted display="block">
                  { signal.subtitle }
                </Text>

                <Text type="body2" display="block">
                  <TextLink external href={signal.link}>
                    { signal.linkText || intl.formatMessage(messages.learnMore) }
                  </TextLink>
                </Text>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <List divided relaxed className={styles.displaySmall}>
        {signals.map(signal => (
          <ListItem
            key={signal.link}
            element="a"
            href={signal.link}
            target="_blank"
            rel="noopener noreferrer"
            arrow
          >
            <Box display="flex" alignItems="flex-start" paddingTop="xxs" paddingBottom="xxs">
              <Image
                src={signal.image}
                alt={signal.imageAlt}
                loadOnVisible={{ placeholder: TRUST_SIGNAL_PLACEHOLDER }}
                size={constants.SMALL}
              />
              <Box marginLeft="m">
                <Text type="display6" display="block">
                  { signal.title }
                </Text>
                <Text type="body2" display="block">
                  { signal.subtitle }
                </Text>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

TrustSignals.displayName = 'TrustSignals';

TrustSignals.propTypes = {
  intl: intlShape.isRequired,
  locale: PropTypes.string,
};

TrustSignals.defaultProps = {
  locale: 'en',
};

export default TrustSignals;
