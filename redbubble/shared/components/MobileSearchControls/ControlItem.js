import React from 'react';
import PropTypes from 'prop-types';

import Box from '@redbubble/design-system/react/Box';
import Text from '@redbubble/design-system/react/Text';
import ChevronRightBigIcon from '@redbubble/design-system/react/Icons/ChevronRightBig';
import { MEDIUM } from '@redbubble/design-system/react/constants';

import styles from './ControlItem.css';

const ControlItem = ({ text, onClick, label }) => (
  <button onClick={onClick} className={styles.button}>
    <Box
      display="flex"
      className={styles.content}
      flexDirection="column"
      padding="m"
    >
      <Box display="flex">
        <Box flex="1">
          <Text display="block"><strong>{text}</strong></Text>
        </Box>
        <Box display="flex">
          <ChevronRightBigIcon size={MEDIUM} />
        </Box>
      </Box>
      <Box>
        {/* eslint-disable-next-line @redbubble/design-system/no-style-overrides */}
        {label && <Text display="block" className={styles.label} type="body2">{label}</Text>}
      </Box>
    </Box>
  </button>
);

ControlItem.propTypes = {
  text: PropTypes.string.isRequired,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

ControlItem.defaultProps = {
  onClick: () => {},
  label: null,
};

export default ControlItem;
