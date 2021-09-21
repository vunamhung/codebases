import React, { Component } from 'react';
import styles from './Loading.css';

// eslint-disable-next-line react/prefer-stateless-function
class Loading extends Component {
  render() {
    return (
      <div className={styles.spinner} />
    );
  }
}

Loading.displayName = 'Loading';

export default Loading;
