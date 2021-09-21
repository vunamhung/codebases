const COUNTRY_CODE_REQUEST_HEADER_NAME = 'CF-IPCountry';

const EUROPEAN_UNION_COUNTRY_CODES = [
  'AT', 'IT', 'BE', 'LV', 'BG', 'LT', 'HR', 'LU', 'CY', 'MT', 'CZ', 'NL', 'DK',
  'PL', 'EE', 'PT', 'FI', 'RO', 'FR', 'SK', 'DE', 'SI', 'EL', 'ES', 'HU', 'SE',
  'IE', 'UK', 'GB',
];

const UNDETERMINED_COUNTRY_CODE = 'XX';

export const inEuropeanUnion = countryCode =>
  countryCode === UNDETERMINED_COUNTRY_CODE || EUROPEAN_UNION_COUNTRY_CODES.includes(countryCode);

export default function userLocation(req, _, next) {
  const countryCode =
         req.headers[COUNTRY_CODE_REQUEST_HEADER_NAME]
      || req.headers[COUNTRY_CODE_REQUEST_HEADER_NAME.toLowerCase()]
      || req.headers[COUNTRY_CODE_REQUEST_HEADER_NAME.toUpperCase()]
      || UNDETERMINED_COUNTRY_CODE;

  req.userLocation = {
    countryCode,
    inEuropeanUnion: inEuropeanUnion(countryCode),
  };

  next();
}
