import React from 'react';
import PropTypes from 'prop-types';
import Alert from '@redbubble/design-system/react/Alert';
import Box from '@redbubble/design-system/react/Box';
import Button from '@redbubble/design-system/react/Button';
import { ERROR } from '@redbubble/design-system/react/constants';
import { defineMessages } from 'react-intl';
import styles from './styles.css';

const messages = defineMessages({
  retryLabel: {
    defaultMessage: 'Something went wrong. Please try again.',
  },
  retryButton: {
    defaultMessage: 'Try again',
  },
});

const HydrationErrorBanner = ({ onRetry, formatMessage }) => {
  return (
    <Alert intent={ERROR}>
      <Box className={styles.alert}>
        { formatMessage(messages.retryLabel)}

        <Box className={styles.button}>
          <Button onClick={e => onRetry(e)}>
            { formatMessage(messages.retryButton)}
          </Button>
        </Box>
      </Box>
    </Alert>
  );
};


HydrationErrorBanner.propTypes = {
  onRetry: PropTypes.func,
  formatMessage: PropTypes.func,
};

HydrationErrorBanner.defaultProps = {
  onRetry: () => null,
  formatMessage: message => message.defaultMessage,
};

export default HydrationErrorBanner;
