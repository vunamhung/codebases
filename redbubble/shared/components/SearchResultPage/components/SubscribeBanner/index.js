/* eslint-disable react/prop-types */
import React from 'react';
import MarketingContainer from '@redbubble/react-marketing';

const cardStyles = {
  borderRadius: 5,
  position: 'relative',
  gridColumnEnd: 'span 2',
  backgroundColor: 'var(--ds-color-background-alt-50)',
};

const fallbackStyles = {
  backgroundColor: 'var(--ds-color-background-alt-50)',
};

const SubscribeBanner = () => {
  return (
    <MarketingContainer
      fallback
      showLoader
      timeout={15000}
      containerStyles={cardStyles}
      fallbackStyles={fallbackStyles}
      contentId="digioh-subscribe-card"
      loaderStyles={{ backgroundColor: 'transparent' }}
    />
  );
};

SubscribeBanner.displayName = 'SubscribeBanner';
export default SubscribeBanner;
