import React from 'react';
import PropTypes from 'prop-types';

import Box from '@redbubble/design-system/react/Box';

import styles from './ControlsList.css';

const ControlsList = ({ children }) => (
  <Box className={styles.list}>{children}</Box>
);

ControlsList.propTypes = {
  children: PropTypes.node,
};

ControlsList.defaultProps = {
  children: [],
};

export default ControlsList;
