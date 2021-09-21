import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { compose } from 'redux';
import Image from '@redbubble/design-system/react/Image';
import * as constants from '@redbubble/design-system/react/constants';
import Modal, { ModalBody } from '@redbubble/design-system/react/Modal';
import Box from '@redbubble/design-system/react/Box';
import { withAnalytics } from '@redbubble/boom-analytics';
import withLogin from '../../containers/apollo/withLogin';
import withSignup from '../../containers/apollo/withSignup';
import withIsUsernameAvailable from '../../containers/apollo/withIsUsernameAvailable';
import LoginSignup, { SIGNUP } from './';
import styles from './styles.css';
import { ModalMessages as messages } from './messages';
import keyFace from './keyFace.svg';

const LoginSignupModal = (props) => {
  const {
    analyticsLabel,
    header,
    initialForm,
    intl,
    isOpen,
    loginTitle,
    onCloseRequested,
    profile,
    signupTitle,
    userInfo,
  } = props;

  const LoginSignupWithActions = compose(
    withLogin,
    withSignup,
    withIsUsernameAvailable,
    withAnalytics,
  )(LoginSignup);

  let { onCompleted } = props;
  if (!onCompleted) {
    onCompleted = () => {
      window.location.reload();
    };
  }

  return (
    <Modal
      accessibleTitle={intl.formatMessage(messages.title)}
      open={isOpen}
      onCloseRequested={onCloseRequested}
      getApplicationNode={() => document.getElementById('app')}
    >
      <ModalBody>
        <Box className={styles.modalBody} id="LoginSignupModal">
          {
            header || <Image src={keyFace} alt="" className={styles.keyFace} />
          }
          <LoginSignupWithActions
            analyticsLabel={analyticsLabel}
            initialForm={initialForm}
            intl={intl}
            loginTitle={loginTitle}
            onCompleted={onCompleted}
            profile={profile}
            signupTitle={signupTitle}
            userInfo={userInfo}
          />
        </Box>
      </ModalBody>
    </Modal>
  );
};

LoginSignupModal.displayName = 'LoginSignupModal';

LoginSignupModal.propTypes = {
  isOpen: PropTypes.bool,
  onCloseRequested: PropTypes.func.isRequired,
  userInfo: PropTypes.shape({
    locale: PropTypes.string,
    currency: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    showMatureContent: PropTypes.bool,
    isEligibleForAutoSubscribe: PropTypes.bool,
  }),
  intl: intlShape.isRequired,
  profile: PropTypes.string,
  analyticsLabel: PropTypes.string.isRequired,
  initialForm: PropTypes.string,
  onCompleted: PropTypes.func,
  header: PropTypes.node,
  loginTitle: PropTypes.node,
  signupTitle: PropTypes.node,
};

LoginSignupModal.defaultProps = {
  isOpen: false,
  initialForm: SIGNUP,
  userInfo: null,
  onCompleted: null,
  profile: constants.DESKTOP,
  header: null,
  loginTitle: null,
  signupTitle: null,
};

export default LoginSignupModal;
