import { useEffect, useMemo } from 'react';
import get from 'lodash/get';
import qs from 'qs';

const parseUrlParams = (params) => {
  if (typeof params !== 'string') {
    return {};
  }
  let sanitizedParams = params;
  if (params[0] === '?') {
    sanitizedParams = params.substr(1);
  }

  return qs.parse(sanitizedParams);
};

const usePageViewAnalytics = (
  setGAClientOptions,
  logPageView,
  totalProducts,
  searchPageType,
  searchBar,
  browser,
) => {
  // Memoized, because searchBar and browser are objects that can change frequently.
  const location = useMemo(() => {
    const path = typeof (window) !== 'undefined' ? get(window, 'location.pathname') : null;
    const initialParams = typeof (window) !== 'undefined' ? get(window, 'location.search') : null;

    // Params used for Google Analytics
    const sc = get(searchBar, 'iaCode');

    const keywords = get(searchBar, 'keywords') || [];
    const query = keywords.length > 0 ? keywords.join(' ') : '(not set)';

    let deviceType = 'mobile';
    if (browser.is.large) { deviceType = 'desktop'; }
    if (browser.is.medium) { deviceType = 'tablet'; }

    const analyticsParams = {
      sc,
      query,
      deviceType,
    };

    // We explicitly don't want to use shared/lib/urlHelpers/index.js#stringifyParams
    // As we want %20 in the url, not +.
    const finalParams = qs.stringify({
      ...parseUrlParams(initialParams),
      ...analyticsParams,
    });

    return `${path}?${finalParams}`;
  }, [searchBar, browser]);

  useEffect(() => {
    setGAClientOptions({ metric2: totalProducts });
    logPageView(location, { searchPageType });
  }, [setGAClientOptions, logPageView, location, totalProducts, searchPageType]);
};

export default usePageViewAnalytics;
