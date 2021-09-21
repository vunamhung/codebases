import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import get from 'lodash/get';
import * as constants from '@redbubble/design-system/react/constants';

import { browserPropType as browserInfoShape } from '../redux/withBrowserInfo';
import { SIGNUP } from '../../components/LoginSignup';
import LoginSignupModal from '../../components/LoginSignup/LoginSignupModal';

const DEFAULT_ANALYTICS_LABEL = 'header';

const withLoginSignupModal = (Component) => {
  const LoginSignupModalStateManager = (props) => {
    const [modalState, setModalState] = useState({
      analyticsLabel: DEFAULT_ANALYTICS_LABEL,
      header: null,
      initialForm: SIGNUP,
      isOpen: false,
      loginTitle: null,
      onCompleted: null,
      scrollBackFn: () => {},
      signupTitle: null,
    });

    const userInfo = get(props, 'userInfo');
    const intl = get(props, 'intl');
    const profile = get(props, 'browser.is.large') ? constants.DESKTOP : constants.MOBILE;

    const openModal = useCallback(({
      analyticsLabel,
      header,
      initialForm,
      loginTitle,
      onCompleted,
      scrollBackFn,
      signupTitle,
    }) => {
      setModalState({
        analyticsLabel,
        header,
        initialForm,
        isOpen: true,
        loginTitle,
        onCompleted,
        scrollBackFn,
        signupTitle,
      });
    }, []);

    const closeModal = () => {
      setModalState({ isOpen: false });
      if (modalState.scrollBackFn) {
        modalState.scrollBackFn();
      }
    };

    if (props.userInfoLoading) return null;

    return (
      <React.Fragment>
        <Component {...props} openLoginSignupModal={openModal} />
        <LoginSignupModal
          intl={intl}
          onCloseRequested={closeModal}
          userInfo={userInfo}
          profile={profile}
          {...modalState}
        />
      </React.Fragment>
    );
  };

  LoginSignupModalStateManager.propTypes = {
    intl: intlShape.isRequired,
    browser: browserInfoShape,
    userInfo: PropTypes.shape({
      locale: PropTypes.string,
      currency: PropTypes.string,
      country: PropTypes.string,
      showMatureContent: PropTypes.bool,
      isEligibleForAutoSubscribe: PropTypes.bool,
    }),
  };

  LoginSignupModalStateManager.defaultProps = {
    userInfo: null,
    browser: null,
  };

  LoginSignupModalStateManager.displayName = Component.displayName;
  LoginSignupModalStateManager.fragment = Component.fragment;

  return LoginSignupModalStateManager;
};

export default withLoginSignupModal;
