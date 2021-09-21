import React from 'react';
import MediaCard from '@redbubble/design-system/react/MediaCard';
import { RATIO_SQUARE } from '@redbubble/design-system/react/constants';
import { defineMessages, intlShape } from 'react-intl';

const messages = defineMessages({
  loading: 'Loading...',
});

const LoadingProductCard = ({ intl }) => {
  const loadingMessage = intl.formatMessage(messages.loading);
  return (
    <MediaCard
      loading
      title={loadingMessage}
      caption={loadingMessage}
      imageSrc="/"
      imageRatio={RATIO_SQUARE}
      transparent
    />
  );
};

LoadingProductCard.propTypes = {
  intl: intlShape.isRequired,
};

export default LoadingProductCard;
