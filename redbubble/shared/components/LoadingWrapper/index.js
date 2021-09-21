import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../Loading';

import styles from './LoadingWrapper.css';

const LoadingWrapper = ({ loading, children }) => (
  <div className={styles.content}>
    {loading && <div className={styles.loading}><Loading /></div>}
    {children}
  </div>
);

LoadingWrapper.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.node,
};


LoadingWrapper.defaultProps = {
  loading: false,
  children: null,
};

export default LoadingWrapper;
