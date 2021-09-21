import get from 'lodash/get';
import {
  completeHydrationFailure,
  pricingHydrationFailure,
  previewsHydrationFailure,
  productPageUrlsHydrationFailure,
} from '../../lib/ihsValidator';

const errorParser = (
  searchResults,
  searchResultsLoading,
  staticContext,
) => {
  // This is VERY hacky, and was done because of time and people constraints.
  // Ideally, our BFF and IHS would return apollo errors and matching codes
  // that we then inspect from searchResultsError to infer this kind of error.
  const searchFailed = !searchResultsLoading && !Array.isArray(get(searchResults, 'results', null));
  const requested = get(searchResults, 'results') || [];
  const received = requested.filter(i => i && i.inventoryItem && i.inventoryItem.id)
    .map(i => i.inventoryItem);

  const hydrationFailed = !searchFailed && (
    completeHydrationFailure(requested, received) ||
    pricingHydrationFailure(received) > 1 ||
    previewsHydrationFailure(received) > 1 ||
    productPageUrlsHydrationFailure(received) > 0
  );

  // StaticContext is only available when SSR
  /* eslint-disable no-param-reassign */
  if ((searchFailed || hydrationFailed) && staticContext) {
    staticContext.errorStatus = 500;
    staticContext.useCustomErrorPage = true;

    const code = searchFailed ? 'SRP_SEARCH_FAILURE' : 'SRP_HYDRATION_FAILURE';
    const message = searchFailed ?
      'Failed to get search results for the SRP' :
      'Failed to properly hydrate the SRP';

    staticContext.errorData = {
      datadog: { code, message },
    };
  }
  /* eslint-enable no-param-reassign */

  return {
    searchFailed,
    hydrationFailed,
  };
};

export default errorParser;
