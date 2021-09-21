import messages from '../messages';

export function validateListName(value, intl) {
  if (!value) return intl.formatMessage(messages.listNameRequired);
  else if (value.length < 3) return intl.formatMessage(messages.listNameTooShort);
  else if (value.length > 50) return intl.formatMessage(messages.listNameTooLong);

  return null;
}
