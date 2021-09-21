/* eslint-disable no-return-assign */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import get from 'lodash/get';
import Recaptcha from 'react-google-invisible-recaptcha';
import Text from '@redbubble/design-system/react/Text';
import Box from '@redbubble/design-system/react/Box';
import * as constants from '@redbubble/design-system/react/constants';
import { analyticsPayload } from '../../lib/analytics';
import config from '../../../config';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import {
  validateRequired,
  validateUsername,
  validateEmail,
  validatePassword,
} from './validators';
import styles from './styles.css';
import messages, { LegalMessages, ErrorMessageValuesProvider } from './messages';

export const LOGIN = 'login';
export const SIGNUP = 'signup';

function renderSignupDisclaimer(autoSubscribeToNewsletter, intl) {
  const values = {
    userAgreement: (
      <a href="https://www.redbubble.com/agreement">
        { intl.formatMessage(LegalMessages.userAgreementText) }
      </a>
    ),
    privacyPolicy: (
      <a href="https://www.redbubble.com/privacy">
        { intl.formatMessage(LegalMessages.privacyPolicyText) }
      </a>
    ),
  };

  if (autoSubscribeToNewsletter) {
    return (
      <FormattedMessage
        defaultMessage={'By clicking Sign Up, you agree to our {userAgreement} and {privacyPolicy}, and to receive our promotional emails (opt out any time).'}
        values={values}
      />
    );
  }

  return (
    <FormattedMessage
      defaultMessage="By clicking Sign Up, you agree to our {userAgreement} and {privacyPolicy}"
      values={values}
    />
  );
}

function renderRecaptchaDisclaimer(intl) {
  return (
    <FormattedMessage
      defaultMessage={'This site is protected by reCAPTCHA and the Google {privacyPolicy} and {termsOfService} apply.'}
      values={{
        privacyPolicy: (
          <a href="https://policies.google.com/privacy">
            { intl.formatMessage(LegalMessages.privacyPolicyText) }
          </a>
        ),
        termsOfService: (
          <a href="https://policies.google.com/terms">
            { intl.formatMessage(LegalMessages.termsOfServiceText) }
          </a>
        ),
      }}
    />
  );
}

class LoginSignup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: null,
      actions: null,
      activeForm: props.initialForm,
      loginFormActiveEventSent: false,
      signupFormActiveEventSent: false,
    };

    this.recaptcha = null;
    this.handleRecaptchaResolved = this.handleRecaptchaResolved.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleException = this.handleException.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.handleError = this.handleError.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleFormSwitch = this.handleFormSwitch.bind(this);

    this.handleValidateRequiredOnly = this.handleValidateRequiredOnly.bind(this);
    this.handleValidateUsername = this.handleValidateUsername.bind(this);
    this.handleValidateEmail = this.handleValidateEmail.bind(this);
    this.handleValidatePassword = this.handleValidatePassword.bind(this);
    this.handleLogViewEvents = this.handleLogViewEvents.bind(this);
  }

  componentDidMount() {
    this.handleLogViewEvents();
  }

  componentDidUpdate() {
    this.handleLogViewEvents();
  }

  handleRecaptchaResolved(recaptchaToken) {
    const { userInfo, login, signup } = this.props;
    const { values, activeForm } = this.state;

    if (activeForm === LOGIN) {
      const rememberMe = get(this.state, 'values.rememberMe[0]') || false;

      login({ variables: { login: { ...values, rememberMe, recaptchaToken } } })
        .then(result => this.handleResponse(result.data.login, analyticsPayload.login))
        .catch(this.handleException);
    } else if (activeForm === SIGNUP) {
      const { locale, currency, country, showMatureContent } = userInfo;

      const { subscribeToNewsletter } = values;
      const optIn = userInfo.isEligibleForAutoSubscribe || Boolean(subscribeToNewsletter);

      signup({
        variables: {
          signup: {
            ...values,
            subscribeToNewsletter: optIn,
            showMatureContent,
            currency,
            country,
            locale,
            recaptchaToken,
          },
        },
      })
        .then(result => this.handleResponse(result.data.signup, analyticsPayload.signup))
        .catch(this.handleException);
    }
  }

  handleResponse(result, gaAction) {
    if (get(result, 'tokens')) {
      this.props.logEvent({ analytics: gaAction('complete', this.props.analyticsLabel) });
      if (this.props.onCompleted) this.props.onCompleted();
    } else if (get(result, 'errors')) {
      this.handleError(result.errors);
    } else {
      this.handleException(new Error('Unexpected response from server'));
    }
  }

  handleLogViewEvents() {
    const { logEvent, analyticsLabel } = this.props;
    const { activeForm, signupFormActiveEventSent, loginFormActiveEventSent } = this.state;
    if (activeForm === SIGNUP && !signupFormActiveEventSent) {
      logEvent({ analytics: analyticsPayload.signup('view', analyticsLabel) });
      this.setState({ signupFormActiveEventSent: true });
    }
    if (activeForm === LOGIN && !loginFormActiveEventSent) {
      logEvent({ analytics: analyticsPayload.login('view', analyticsLabel) });
      this.setState({ loginFormActiveEventSent: true });
    }
  }

  handleValidateRequiredOnly(value) {
    return validateRequired(value, this.props.intl);
  }

  handleValidateUsername(value) {
    return validateUsername(value, this.props.intl, this.props.isUsernameAvailableQuery.refetch);
  }

  handleValidateEmail(value) {
    return validateEmail(value, this.props.intl);
  }

  handleValidatePassword(value) {
    return validatePassword(value, this.props.intl);
  }

  handleFormSwitch() {
    this.setState(prevState => ({ activeForm: prevState.activeForm === LOGIN ? SIGNUP : LOGIN }));
  }

  resetForm() {
    this.state.actions.setSubmitting(false);
    this.setState({ values: null });
    // See https://github.com/google/google-api-javascript-client/issues/281
    if (this.recaptcha) this.recaptcha.reset();
  }

  handleError(errors) {
    const { actions } = this.state;
    const locale = get(this.props, 'userInfo.locale');
    this.resetForm();

    const errorData = {};
    const errorMessages = errors.map((error) => {
      const values = ErrorMessageValuesProvider[error.code]
        ? ErrorMessageValuesProvider[error.code]({ locale })
        : {};
      const errorMessage = <FormattedMessage {...messages[error.code]} values={{ ...values }} />;
      errorData[error.field] = errorMessage;
      return (<Text>{ errorMessage }</Text>);
    });

    actions.setErrors(errorData);
    actions.setStatus(errorMessages);
  }

  handleException(e) {
    const { actions } = this.state;
    const { intl } = this.props;

    this.resetForm();

    actions.setStatus(intl.formatMessage(messages.unknownError));

    if (get(e, 'graphQLErrors[0].originalError.extensions.code') !== 'NETWORK_ERROR') throw e;
  }

  handleSubmit(values, actions) {
    this.setState({ values, actions });
    actions.setStatus(null);
    this.recaptcha.execute();
  }

  render() {
    const { activeForm } = this.state;
    const {
      userInfo,
      profile,
      intl,
      signupTitle,
      loginTitle,
    } = this.props;

    const {
      locale,
      isEligibleForAutoSubscribe,
    } = userInfo;

    return (
      <React.Fragment>
        <Recaptcha
          ref={ref => this.recaptcha = ref}
          sitekey={config('googleRecaptchaSiteKey')}
          onResolved={this.handleRecaptchaResolved}
          locale={locale}
        />
        { activeForm === LOGIN ? (
          <React.Fragment>
            {
              loginTitle || (
                <Text type="display2" element="h2" display="block">
                  <FormattedMessage defaultMessage="Log In" />
                </Text>
              )
            }
            <Box marginTop="l">
              <LoginForm
                onSubmit={this.handleSubmit}
                validateId={this.handleValidateRequiredOnly}
                validatePassword={this.handleValidateRequiredOnly}
                profile={profile}
                intl={intl}
              />
              <Box marginTop="xs" className={styles.formSwitch}>
                <Box display="inline" marginRight="xs">
                  <Text element="p" type="body2">
                    <FormattedMessage defaultMessage="Need an account?" />
                  </Text>
                </Box>
                <button
                  size={constants.MEDIUM}
                  onClick={this.handleFormSwitch}
                  className={styles.buttonLink}
                >
                  <FormattedMessage defaultMessage="Sign Up" />
                </button>
              </Box>
              <Box marginTop="m" className={styles.disclaimer}>
                <Text type="body2" muted display="block" element="p">{renderRecaptchaDisclaimer(intl)}</Text>
              </Box>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {
              signupTitle || (
                <React.Fragment>
                  <Text type="display2" element="h2" display="block">
                    <FormattedMessage defaultMessage="Join Redbubble" />
                  </Text>
                </React.Fragment>
              )
            }
            {
              <Box marginTop="m">
                <Text element="p" display="block" type="body2">
                  <FormattedMessage
                    defaultMessage="Order history, faster checkout, a personalized home page, and more."
                  />
                </Text>
              </Box>
            }
            <Box marginTop="l">
              <SignupForm
                onSubmit={this.handleSubmit}
                validateUsername={this.handleValidateUsername}
                validateEmail={this.handleValidateEmail}
                validatePassword={this.handleValidatePassword}
                profile={profile}
                intl={intl}
                showSubscribeToNewsletterCheckbox={!isEligibleForAutoSubscribe}
              />
            </Box>
            <Box marginTop="xs" className={styles.formSwitch}>
              <Box display="inline" marginRight="xs">
                <Text element="p" type="body2">
                  <FormattedMessage defaultMessage="Already have an account?" />
                </Text>
              </Box>
              <button
                size={constants.MEDIUM}
                onClick={this.handleFormSwitch}
                className={styles.buttonLink}
              >
                <FormattedMessage defaultMessage="Log In" />
              </button>
            </Box>
            <Box marginTop="m" className={styles.disclaimer}>
              <Text type="body2" muted display="block" element="p">
                {renderSignupDisclaimer(isEligibleForAutoSubscribe, intl)}
              </Text>
              <Box marginTop="m">
                <Text type="body2" muted display="block" element="p">{renderRecaptchaDisclaimer(intl)}</Text>
              </Box>
            </Box>
          </React.Fragment>
        ) }
      </React.Fragment>
    );
  }
}

LoginSignup.displayName = 'LoginSignup';

LoginSignup.propTypes = {
  intl: intlShape.isRequired,
  userInfo: PropTypes.shape({
    locale: PropTypes.string,
    currency: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    showMatureContent: PropTypes.bool,
    isEligibleForAutoSubscribe: PropTypes.bool,
  }),
  profile: PropTypes.string.isRequired,
  login: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
  isUsernameAvailableQuery: PropTypes.func.isRequired,
  logEvent: PropTypes.func.isRequired,
  analyticsLabel: PropTypes.string.isRequired,
  onCompleted: PropTypes.func,
  initialForm: PropTypes.string,
  signupTitle: PropTypes.node,
  loginTitle: PropTypes.node,
};

LoginSignup.defaultProps = {
  initialForm: SIGNUP,
  onCompleted: null,
  isEligibleForAutoSubscribe: false,
  signupTitle: null,
  loginTitle: null,
  userInfo: {
    locale: 'en',
    showMatureContent: false,
    isEligibleForAutoSubscribe: false,
  },
};

export default LoginSignup;
