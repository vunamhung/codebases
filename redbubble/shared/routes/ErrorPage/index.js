import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ErrorPage.css';
import { publicAssetPath } from '../../lib/routing';

class ErrorPage extends Component {
  constructor(props) {
    super(props);
    const { staticContext, errorStatus, errorMessage, errorData } = props;
    if (staticContext) {
      staticContext.errorStatus = errorStatus;
      staticContext.errorMessage = errorMessage;
      staticContext.errorData = errorData;
    }
  }

  render() {
    return (
      <div>
        <img alt="Redbubble logo" className={styles.logo} src={publicAssetPath('logo.svg')} />
        <div className={styles.wrap}>
          <img className={styles.illustration} alt="Illustration" src={publicAssetPath('feature-img.jpg')} />
          <h1 className={styles.title}>Computer says &quot;No&quot;.</h1>
          <p className={styles.message}>
            We’ve been notified of a { this.props.errorStatus } Error. You can {' '}
            <a className={styles.messageLink} href="https://help.redbubble.com/">ask for help</a>
            { ' or ' }
            <a className={styles.messageLink} href="/">return home</a>.
          </p>
        </div>
      </div>
    );
  }
}

ErrorPage.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  staticContext: PropTypes.object,
  errorStatus: PropTypes.number,
  errorMessage: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  errorData: PropTypes.object,
};

ErrorPage.defaultProps = {
  staticContext: {},
  errorData: {},
  errorStatus: 404,
  errorMessage: 'Error',
};

export default ErrorPage;
