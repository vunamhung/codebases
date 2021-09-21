import React from 'react';
import PropTypes from 'prop-types';

import Box from '@redbubble/design-system/react/Box';
import Text from '@redbubble/design-system/react/Text';

import styles from './ControlGroupItem.css';

const ControlGroupItem = ({ text, onClick, active, disabled }) => (
  <button onClick={onClick} className={styles.button} disabled={disabled}>
    <Box
      display="flex"
      justifyContent="space-between"
      padding="m"
    >
      <Text muted={disabled} display="block">
        {active ? <strong>{text}</strong> : text}
      </Text>
    </Box>
  </button>
);

ControlGroupItem.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
};

ControlGroupItem.defaultProps = {
  onClick: () => {},
  active: false,
  disabled: false,
};

export default ControlGroupItem;
