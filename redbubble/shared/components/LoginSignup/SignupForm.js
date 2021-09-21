import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import get from 'lodash/get';
import * as constants from '@redbubble/design-system/react/constants';
import Button from '@redbubble/design-system/react/Button';
import Alert from '@redbubble/design-system/react/Alert';
import Form, { FieldSet, FieldRow, Field, FieldMessage } from '@redbubble/design-system/react/Form';
import Box from '@redbubble/design-system/react/Box';
import Text from '@redbubble/design-system/react/Text';
import {
  SignupFormMessages as messages,
  FormLabelMessages as formLabelMessages,
} from './messages';

const SignupForm = (props) => {
  const {
    showSubscribeToNewsletterCheckbox,
    onSubmit,
    validateUsername,
    validateEmail,
    validatePassword,
    profile,
    intl,
  } = props;

  function showInfoOrError(focused, error, touched, options) {
    const infoMessage = get(options, 'infoMessage');
    if (touched && error && !focused) {
      return (
        <FieldMessage intent={constants.ERROR}>
          <span style={{ whiteSpace: 'pre-line' }}>
            {error}
          </span>
        </FieldMessage>
      );
    } else if (focused && infoMessage) {
      return (
        <FieldMessage intent={constants.INFORMATION}>
          <span style={{ whiteSpace: 'pre-line' }}>
            {infoMessage}
          </span>
        </FieldMessage>
      );
    }

    return null;
  }

  return (
    <Form
      profile={profile}
      onSubmit={onSubmit}
      validateOnChange={false}
    >
      {
        (innerProps) => {
          const { isSubmitting, status } = innerProps;
          const errors = get(innerProps, 'errors') || {};
          const touched = get(innerProps, 'touched') || {};

          return (
            <div>
              {
                status && (
                  <Box marginTop="m">
                    <Alert intent="error">
                      <Text display="block">{status}</Text>
                    </Alert>
                  </Box>
                )
              }
              <FieldSet>
                <FieldRow>
                  <Field
                    label={intl.formatMessage(formLabelMessages.email)}
                    type="email"
                    name="email"
                    fluid
                    autocomplete="email"
                    intent={touched.email && errors.email && constants.ERROR}
                    validate={validateEmail}
                    placeholder={intl.formatMessage(messages.emailFieldPlaceholder)}
                  >
                    {
                      field => (showInfoOrError(field.focused, errors.email, touched.email))
                    }
                  </Field>
                </FieldRow>
                <FieldRow>
                  <Field
                    label={intl.formatMessage(formLabelMessages.username)}
                    type="text"
                    name="username"
                    autocomplete="off"
                    autocapitalize="none"
                    fluid
                    intent={touched.username && errors.username && constants.ERROR}
                    validate={validateUsername}
                    placeholder={intl.formatMessage(messages.usernameFieldPlaceholder)}
                  >
                    {
                      field => (
                        showInfoOrError(field.focused, errors.username, touched.username, {
                          infoMessage: intl.formatMessage(messages.usernameInfoMessage),
                        })
                      )
                    }
                  </Field>
                </FieldRow>
                <FieldRow>
                  <Field
                    label={intl.formatMessage(formLabelMessages.password)}
                    type="password"
                    name="password"
                    autocomplete="new-password"
                    fluid
                    intent={touched.password && errors.password && constants.ERROR}
                    validate={validatePassword}
                    placeholder={intl.formatMessage(messages.passwordFieldPlaceholder)}
                  >
                    {
                      field => (
                        showInfoOrError(field.focused, errors.password, touched.password, {
                          infoMessage: intl.formatMessage(messages.passwordInfoMessage),
                        })
                      )
                    }
                  </Field>
                </FieldRow>
                {
                  showSubscribeToNewsletterCheckbox && (
                    <FieldRow>
                      <Field
                        label=""
                        type="checkbox"
                        name="subscribeToNewsletter"
                        options={[
                          {
                            value: true,
                            label: intl.formatMessage(messages.subscribeToNewsletterLabel),
                          },
                        ]}
                        fluid
                      />
                    </FieldRow>
                  )
                }
              </FieldSet>
              <Box marginTop="xxs" marginBottom="m">
                <Button
                  intent={constants.PRIMARY}
                  size={constants.LARGE}
                  fluid
                  strong
                  type="submit"
                  loading={isSubmitting}
                >
                  {intl.formatMessage(messages.signup)}
                </Button>
              </Box>
            </div>
          );
        }
      }
    </Form>
  );
};

SignupForm.displayName = 'SignupForm';

SignupForm.propTypes = {
  onSubmit: PropTypes.func,
  validateUsername: PropTypes.func,
  validatePassword: PropTypes.func,
  validateEmail: PropTypes.func,
  profile: PropTypes.string,
  showSubscribeToNewsletterCheckbox: PropTypes.bool,
  intl: intlShape.isRequired,
};

SignupForm.defaultProps = {
  onSubmit: () => null,
  validateUsername: () => null,
  validateEmail: () => null,
  validatePassword: () => null,
  profile: '',
  showSubscribeToNewsletterCheckbox: true,
};

export default SignupForm;
