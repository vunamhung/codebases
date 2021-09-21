/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-restricted-globals */
import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import get from 'lodash/get';
import * as constants from '@redbubble/design-system/react/constants';
import Button from '@redbubble/design-system/react/Button';
import Alert from '@redbubble/design-system/react/Alert';
import Form, { FieldSet, FieldRow, Field, FieldMessage } from '@redbubble/design-system/react/Form';
import Input from '@redbubble/design-system/react/Form/Input';
import Box from '@redbubble/design-system/react/Box';
import Text from '@redbubble/design-system/react/Text';
import styles from './styles.css';
import {
  LoginFormMessages as messages,
  FormLabelMessages as formLabelMessages,
} from './messages';

const LoginForm = ({
  onSubmit, validateId, validatePassword, profile, intl,
}) => {
  return (
    <Form
      profile={profile}
      onSubmit={onSubmit}
    >
      {
        (innerProps) => {
          const { isSubmitting, status } = innerProps;
          const errors = get(innerProps, 'errors') || {};
          const touched = get(innerProps, 'touched') || {};

          return (
            <React.Fragment>
              {
                status && (
                  <Box marginBottom="m">
                    <Alert intent="error">
                      <Text display="block">{status}</Text>
                    </Alert>
                  </Box>
                )
              }
              <FieldSet>
                <FieldRow>
                  <Field
                    label={intl.formatMessage(formLabelMessages.usernameOrEmail)}
                    type="text"
                    name="id"
                    intent={touched.id && errors.id && constants.ERROR}
                    validate={validateId}
                    fluid
                    autocapitalize="off"
                    autocomplete="email"
                  >
                    {
                      () => (errors.id && touched.id ?
                        <FieldMessage intent={constants.ERROR}>{errors.id}</FieldMessage> :
                        null
                      )
                    }
                  </Field>
                </FieldRow>
                <FieldRow>
                  <Field
                    label={intl.formatMessage(formLabelMessages.password)}
                    type="password"
                    name="password"
                    autocomplete="current-passsword"
                    actionSlot={(
                      <a href="/account_recovery" className={styles.forgotPasswordLink}>
                        {intl.formatMessage(messages.forgotPassword)}
                      </a>
                    )}
                    intent={touched.password && errors.password && constants.ERROR}
                    validate={validatePassword}
                    fluid
                  >
                    {
                      () => (errors.password && touched.password ?
                        <FieldMessage intent={constants.ERROR}>{errors.password}</FieldMessage> :
                        null
                      )
                    }
                  </Field>
                </FieldRow>
                <FieldRow>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="baseline"
                    style={{ width: '100%' }}
                  >
                    <label style={{ display: 'block' }} aria-label={name} id="rememberMe">
                      <Box display="flex" alignItems="center" padding="m">
                        <Box
                          display="flex"
                          alignItems="flex-start"
                          marginRight="xs"
                          marginTop="xxs"
                        >
                          <Input
                            type="checkbox"
                            name="rememberMe"
                            defaultChecked
                          />
                        </Box>
                        <Box display="flex" alignItems="flex-start">
                          <Text display="block" type="body">{intl.formatMessage(messages.rememberMe)}</Text>
                        </Box>
                      </Box>
                    </label>
                  </Box>
                </FieldRow>
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
                  {intl.formatMessage(messages.login)}
                </Button>
              </Box>
            </React.Fragment>
          );
        }
      }
    </Form>
  );
};

LoginForm.displayName = 'LoginForm';

LoginForm.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: PropTypes.func,
  profile: PropTypes.string,
  validateId: PropTypes.func,
  validatePassword: PropTypes.func,
};

LoginForm.defaultProps = {
  onSubmit: () => null,
  validateId: () => null,
  validatePassword: () => null,
  profile: '',
};

export default LoginForm;
