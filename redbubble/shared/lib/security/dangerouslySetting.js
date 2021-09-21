import isPlainObject from 'lodash/isPlainObject';
import mapValues from 'lodash/mapValues';

const SPECIAL_CHARACTERS = [
  { character: '"', encoded: '%22' },
  { character: '\'', encoded: '%27' },
  { character: '/', encoded: '%2F' },
  { character: '@', encoded: '%40' },
  { character: '=', encoded: '%3D' },
  { character: '*', encoded: '%2A' },
  { character: '[', encoded: '%5B' },
  { character: ']', encoded: '%5D' },
  { character: '(', encoded: '%28' },
  { character: ')', encoded: '%29' },
  { character: ' ', encoded: '%20' },
];

// eslint-disable-next-line no-useless-escape
const PREPENSION = '\{\{';
// eslint-disable-next-line no-useless-escape
const APPENSION = '\}\}';

const escapeValue = (value) => {
  let escapedValue = value;

  if (typeof value === 'string') {
    SPECIAL_CHARACTERS.forEach((item) => {
      const replace = `\\${item.character}`;
      const regex = new RegExp(replace, 'g');

      escapedValue = escapedValue.replace(regex, `${PREPENSION}${item.encoded}${APPENSION}`);
    });
  }

  return escapedValue;
};

const unescapeValue = (value) => {
  let unescapedValue = value;

  if (typeof value === 'string') {
    SPECIAL_CHARACTERS.forEach((item) => {
      const replace = `${PREPENSION}${item.encoded}${APPENSION}`;
      const regex = new RegExp(replace, 'g');

      unescapedValue = unescapedValue.replace(regex, item.character);
    });
  }

  return unescapedValue;
};

export const escapeValuesToBeDangerouslySet = (subject) => {
  let escaped = escapeValue(subject);

  if (isPlainObject(subject)) {
    escaped = mapValues(subject, value => escapeValuesToBeDangerouslySet(value));
  } else if (Array.isArray(subject)) {
    escaped = subject.map(escapeValuesToBeDangerouslySet);
  }

  return escaped;
};

export const unescapeDangerouslySetValues = (subject) => {
  let unescaped = unescapeValue(subject);

  if (isPlainObject(subject)) {
    unescaped = mapValues(subject, value => unescapeDangerouslySetValues(value));
  } else if (Array.isArray(subject)) {
    unescaped = subject.map(unescapeDangerouslySetValues);
  }

  return unescaped;
};
