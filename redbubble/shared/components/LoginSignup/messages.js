import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import TextLink from '@redbubble/design-system/react/TextLink';

const errorMessages = defineMessages({
  // sign up errors
  emailExists: 'There is already an account using this email address.',
  emailInvalid: 'Please check your email address is correct.',
  usernameExists: 'Unfortunately this username is already taken.',
  usernameInvalid: 'Must use only letters, numbers and \'-\'.',
  // login errors
  credentialsInvalid: 'Username or password is invalid.',
  loginAttemptsExceeded: 'Too many login attempts. Please reset your password.',
  emailDuplicate: 'Looks like your email address is used for multiple accounts. Please log in using your username and update your email address.',
  userStateForbidden: 'Looks like this account is no longer active. Visit the Help Center for more information.',
  userSuspended: 'Looks like this account has been suspended. Visit the {helpCenter} for more information.',
  // common errors
  unknownError: 'Sorry, something went wrong. Please contact customer support so we can help sort this out.',
  captchaInvalid: 'Please confirm you are not a robot.',
  openIdTokenInvalid: 'Your session has expired. Please reload the page and try again.',
  // form validation errors
  required: 'Please fill in this field.',
  usernameStartsWithHyphen: 'The first character can’t be a \'-\'.',
  usernameTooShort: 'Too short. Must be at least 4 characters long.',
  usernameTooLong: 'Too long. Must be less than 15 characters long.',
  passwordTooShort: 'Must be at least 8 characters long.',
  passwordHasSpaces: 'Must not contain any spaces.',
});

const otherMessages = defineMessages({
  helpCenter: 'Help Center',
});

const errorMessageValuesProvider = {
  userSuspended: ({ locale }) => ({
    helpCenter: <TextLink href={`https://help.redbubble.com/hc/${locale}/articles/201350809-Content-Suspension`}><FormattedMessage {...otherMessages.helpCenter} /></TextLink>,
  }),
};

const formLabelMessages = defineMessages({
  usernameOrEmail: 'Username or Email',
  username: 'Username',
  password: 'Password',
  email: 'Email',
});

const loginFormMessages = defineMessages({
  rememberMe: 'Remember Me',
  forgotPassword: 'Forgot Password?',
  login: 'Log In',
});

const signupFormMessages = defineMessages({
  signup: 'Sign Up',
  usernameInfoMessage: 'Only letters, numbers, and \'-\', no spaces, 4-15 characters.\nAnd the first character can’t be a \'-\'.',
  passwordInfoMessage: 'At least 8 characters, no spaces.',
  subscribeToNewsletterLabel: 'Email me special offers and artist news.',
  emailFieldPlaceholder: 'Your email address',
  usernameFieldPlaceholder: 'e.g. coolcat',
  passwordFieldPlaceholder: 'Choose a password',
});

const modalMessages = defineMessages({
  title: 'Login or signup to your Redbubble account',
});

const legalMessages = defineMessages({
  userAgreementText: 'User Agreement',
  privacyPolicyText: 'Privacy Policy',
  termsOfServiceText: 'Terms of Service',
});

export default errorMessages;
export { errorMessageValuesProvider as ErrorMessageValuesProvider };
export { modalMessages as ModalMessages };
export { loginFormMessages as LoginFormMessages };
export { signupFormMessages as SignupFormMessages };
export { formLabelMessages as FormLabelMessages };
export { legalMessages as LegalMessages };
