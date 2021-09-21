import get from 'lodash/get';
import messages from '../messages';

export function validateRequired(value, intl) {
  if (!value) return intl.formatMessage(messages.required);
  return null;
}

export function validateUsername(value, intl, asyncValidator) {
  if (!value) return intl.formatMessage(messages.required);
  else if (value.length < 4) return intl.formatMessage(messages.usernameTooShort);
  else if (value.length > 15) return intl.formatMessage(messages.usernameTooLong);
  else if (!/^[a-zA-Z0-9\\-]+$/i.test(value)) return intl.formatMessage(messages.usernameInvalid);
  else if (value.charAt(0) === '-') return intl.formatMessage(messages.usernameStartsWithHyphen);

  return asyncValidator({ username: value })
    .then(({ data }) => {
      const isUsernameAvailable = get(data, 'isUsernameAvailable');
      if (!isUsernameAvailable) return intl.formatMessage(messages.usernameExists);

      return null;
    })
    .catch(null);
}

export function validateEmail(value, intl) {
  if (!value) return intl.formatMessage(messages.required);
  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return intl.formatMessage(messages.emailInvalid);
  }

  return null;
}

export function validatePassword(value, intl) {
  if (!value) return intl.formatMessage(messages.required);
  else if (value.length < 8) return intl.formatMessage(messages.passwordTooShort);
  else if (/\s/.test(value)) return intl.formatMessage(messages.passwordHasSpaces);

  return null;
}
