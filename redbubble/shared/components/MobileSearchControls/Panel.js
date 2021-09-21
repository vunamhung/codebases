import React from 'react';
import PropTypes from 'prop-types';

import styles from './Panel.css';
import Header from './Header';

const Panel = ({
  title,
  leftAction,
  rightAction,
  children,
}) => {
  return (
    <div className={styles.wrapper}>
      <Header
        title={title}
        leftAction={leftAction}
        rightAction={rightAction}
      />
      {children}
    </div>
  );
};

Panel.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  leftAction: PropTypes.node,
  rightAction: PropTypes.node,
};

Panel.defaultProps = {
  leftAction: null,
  rightAction: null,
};

export default Panel;
