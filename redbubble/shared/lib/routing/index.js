import queryString from 'query-string';
import URL from 'url-parse';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';
import config from '../../../config';

const defaultLocale = config('defaultLocale');
export const EXPERIENCE_SRP = 'srp';
export const EXPERIENCE_ARTIST_SHOP = 'artist-shop';
export const EXPERIENCE_ARTISTS_OWN_SHOP = 'artists-own-shop';
export const SHOP_PAGE_BASE_PATH = '/shop';
const SEARCH_CATEGORY_PAGE_BASE_PATH = '/g';
const SRP_PAGE_KEYWORD_DELIMITER = '+';
const PARSED_QUERY_TO_URL_PARAM = {
  new_ia_code: 'iaCode',
  medium: 'medium',
  sort_order: 'sortOrder',
};
export const CATEGORY_TEMPLATE_SUPPORTED_IA = new Set(['u-tees']);
const CATEGORY_TEMPLATE_SUPPORTED_IA_CANONICAL_FORM = new Set(['t-shirts']);
const GIFT_TAGS = ['gift', 'gifts'];
const GIFTS_SLUG = 'gifts';

export const ARTISTS_OWN_SHOP_QUERY_PARAM = { asc: 'u' };

export const mergeUniqueAttributes = (...attrSets) => {
  return attrSets.reduce((accum, current) => {
    return accum.filter(
      ({ name: leftName }) => !current.some(({ name: rightName }) => leftName === rightName),
    ).concat(current);
  }, []);
};

export const localizedPath = (locale, path) => {
  const localeData = config('availableLocales');

  const prefix = get(localeData, [locale, 'urlSegment']) || '';

  return `${prefix}${path}`;
};

export const shopBasePathWithLocale = locale => localizedPath(locale, SHOP_PAGE_BASE_PATH);

export const publicAssetPath = filename => `/boom/public/${filename}`;

export const tagLocation = (tag) => {
  if (!tag) return null;
  const pathname = localizedPath(tag.locale, `${SHOP_PAGE_BASE_PATH}/${tag.slug}`);

  return { pathname };
};

export const giftTagLocation = (tags, locale) => {
  if (!Array.isArray(tags) || !tags.length) return null;
  for (let i = 0; i < tags.length; i += 1) {
    for (let j = 0; j < GIFT_TAGS.length; j += 1) {
      if (tags[i].includes(GIFT_TAGS[j])) {
        return localizedPath(locale, `${SEARCH_CATEGORY_PAGE_BASE_PATH}/${GIFTS_SLUG}`);
      }
    }
  }
  return null;
};

export const categoryPagePath = (canonicalForm, locale) => {
  return CATEGORY_TEMPLATE_SUPPORTED_IA_CANONICAL_FORM.has(canonicalForm)
    ? localizedPath(
      locale,
      `${SEARCH_CATEGORY_PAGE_BASE_PATH}/${canonicalForm}`,
    )
    : localizedPath(locale, `${SHOP_PAGE_BASE_PATH}/${canonicalForm}`);
};

export const urlWithRef = (url, ref) => {
  if (!ref) return url;
  const newUrl = new URL(url, {}, true);
  newUrl.query.ref = ref;
  return newUrl.toString();
};

const generateSearchPath = (
  basePath,
  keywords = [],
  params = {},
  locale = defaultLocale,
) => {
  const pathSegments = [localizedPath(locale, basePath)];
  const searchKeywords = keywords.map(encodeURIComponent).join(SRP_PAGE_KEYWORD_DELIMITER);
  pathSegments.push(searchKeywords);
  let pathname = pathSegments.join('/');
  const search = queryString.stringify(pickBy(params));

  if (search !== '') pathname += `?${search}`;

  return pathname;
};

export const artistShopPagePath = (
  artistName,
  keywords = [],
  params = {},
  locale = defaultLocale,
) => {
  const userName = artistName ? artistName.toLowerCase() : artistName;
  const basePath = `/people/${userName}/shop`;
  const pathSegments = [localizedPath(locale, basePath)];
  const searchKeywords = keywords.map(s => s && s.trim())
    .map(encodeURIComponent)
    .filter(Boolean)
    .join(SRP_PAGE_KEYWORD_DELIMITER);
  if (searchKeywords !== '' && searchKeywords !== '*') { pathSegments.push(searchKeywords); }
  let pathname = pathSegments.join('/');
  const search = queryString.stringify(pickBy(params));

  if (search !== '') pathname += `?${search}`;

  return pathname;
};

export const searchResultPagePath = (
  keywords = [],
  params = {},
  locale = defaultLocale,
  experience = EXPERIENCE_SRP,
) => {
  if (experience === EXPERIENCE_ARTIST_SHOP) {
    return artistShopPagePath(params.artistUserName, keywords, params, locale);
  } else if (experience === EXPERIENCE_ARTISTS_OWN_SHOP) {
    return artistShopPagePath(params.artistUserName, keywords,
      { ...params, ...ARTISTS_OWN_SHOP_QUERY_PARAM }, locale);
  }
  return generateSearchPath(SHOP_PAGE_BASE_PATH, keywords, params, locale);
};

export const manualSearchResultPagePath = (
  keywords = [],
  params = {},
  locale = defaultLocale,
  experience = EXPERIENCE_SRP,
) => {
  if (experience === EXPERIENCE_ARTIST_SHOP) {
    return artistShopPagePath(params.artistUserName, keywords, params, locale);
  } else if (experience === EXPERIENCE_ARTISTS_OWN_SHOP) {
    return artistShopPagePath(params.artistUserName, keywords,
      { ...params, ...ARTISTS_OWN_SHOP_QUERY_PARAM }, locale);
  }
  return generateSearchPath(SHOP_PAGE_BASE_PATH, [], { ...params, query: keywords.join(' ') }, locale);
};

export const searchCategoryPagePath = (keywords, params, locale) =>
  generateSearchPath(SEARCH_CATEGORY_PAGE_BASE_PATH, keywords, params, locale);

export const hasFilterContextApplied = (history) => {
  const locationSearch = get(history, 'location.search', '');
  if (locationSearch) {
    return locationSearch.includes('iaCode=');
  }
  return false;
};

export const hasFilterContextAppliedForQueryParams = (queryParams) => {
  return !!queryParams.iaCode;
};

export const searchQueryParams = (parsedQuery, filters = []) => {
  const filterParams = filters
    .filter(({ applied }) => applied.length)
    .reduce((acc, { type, applied }) => ({ ...acc, [type]: applied }), {});

  const parsedQueryParams = Object.keys(parsedQuery)
    .filter(key => Object.keys(PARSED_QUERY_TO_URL_PARAM).includes(key))
    .reduce((accum, key) => ({ ...accum, [PARSED_QUERY_TO_URL_PARAM[key]]: parsedQuery[key] }), {});

  return { ...filterParams, ...parsedQueryParams };
};

const GOOGLE_HOST = 'www.google.';

export const getGoogleTrafficSource = (referer, location) => {
  const search = get(location, 'search', null);
  let googleReferer = false;

  if (referer) {
    const refererURL = new URL(referer);
    googleReferer = refererURL.hostname.lastIndexOf(GOOGLE_HOST) === 0 && refererURL.protocol === 'https:';
  }

  if (!search) {
    return {
      organic: !!(googleReferer),
      paidChannel: false,
      shopping: false,
    };
  }

  const parsedParams = queryString.parse(search);
  const countryCode = parsedParams.country_code;
  const { gclid } = parsedParams;
  const hasUtmParam = Object.keys(parsedParams).find(p => p.startsWith('utm_'));
  return {
    organic: !!(googleReferer),
    paidChannel: !!(gclid || hasUtmParam),
    shopping: !!(countryCode && (gclid || hasUtmParam)),
  };
};
