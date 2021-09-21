import React from 'react';
import PropTypes from 'prop-types';

import Text from '@redbubble/design-system/react/Text';

import styles from './Header.css';

const Header = ({ leftAction, rightAction, title }) => (
  <div className={styles.header}>
    <div className={styles.leftAction}>
      {leftAction}
    </div>
    <Text className={styles.title} display="block" type="display3">{title}</Text>
    <div className={styles.rightAction}>
      {rightAction}
    </div>
  </div>
);

Header.propTypes = {
  leftAction: PropTypes.node,
  rightAction: PropTypes.node,
  title: PropTypes.string.isRequired,
};

Header.defaultProps = {
  leftAction: null,
  rightAction: null,
};

export default Header;
