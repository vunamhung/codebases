import { actions as analytics } from '@redbubble/boom-analytics';
import { manualSearchResultPagePath, searchQueryParams } from '../../../lib/routing';

const {
  addImpression,
  logEvent,
} = analytics;

export const DO_SEARCH = 'DO_SEARCH';
export const UPDATE_SEARCH_TERM = 'UPDATE_SEARCH_TERM';
export const ACCUMULATE_IMPRESSION = 'ACCUMULATE_IMPRESSION';
export const CLEAR_IMPRESSIONS = 'CLEAR_IMPRESSIONS';
export const UPDATE_PARSED_QUERY = 'UPDATE_PARSED_QUERY';
export const UPDATE_FILTER = 'UPDATE_FILTER';
export const UPDATE_PRODUCT_CONTEXT = 'UPDATE_PRODUCT_CONTEXT';
export const RESET_SEARCH_STATE = 'RESET_SEARCH_STATE';

const initialState = {
  searchTerm: '',
  impressions: {},
  parsedQuery: {},
  filter: [],
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case DO_SEARCH:
      return {
        ...state,
        searchTerm: action.searchTerm,
      };
    case UPDATE_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.searchTerm,
      };
    case ACCUMULATE_IMPRESSION: {
      const { impressions } = state;
      impressions[action.key] = action.impression;
      return {
        ...state,
        impressions,
      };
    }
    case CLEAR_IMPRESSIONS:
      return {
        ...state,
        impressions: {},
      };
    case UPDATE_PARSED_QUERY:
      return {
        ...state,
        parsedQuery: action.parsedQuery,
      };
    case UPDATE_FILTER:
      return {
        ...state,
        filter: action.filter,
      };
    case UPDATE_PRODUCT_CONTEXT:
      return {
        ...state,
        productContext: action.productContext,
      };
    case RESET_SEARCH_STATE:
      return initialState;
    default:
      return state;
  }
};

export const extractKeywords = searchTerm => searchTerm.split(/[.\s]+/).filter(Boolean);

export const doSearch = (history, searchTerm = '', parsedQuery = {}, filter = [], locale = 'en', productContext = {}) => {
  const newParsedQuery = {
    ...parsedQuery,
    new_ia_code: productContext.id,
    sort_order: parsedQuery.sortOrder,
  };

  const keywords = extractKeywords(searchTerm);

  if (history && typeof history.push === 'function') {
    history.push(
      manualSearchResultPagePath(
        keywords,
        {
          ...searchQueryParams(newParsedQuery, filter),
          ref: 'search_box',
        },
        locale,
      ),
    );
  }

  return {
    type: DO_SEARCH,
    searchTerm,
  };
};

export const updateSearchTerm = searchTerm => ({
  type: UPDATE_SEARCH_TERM,
  searchTerm,
});

export const accumulateImpression = ({ key, impression }) => ({
  type: ACCUMULATE_IMPRESSION,
  key,
  impression,
});

export const clearImpressions = () => ({
  type: CLEAR_IMPRESSIONS,
});

export const updateParsedQuery = parsedQuery => ({
  type: UPDATE_PARSED_QUERY,
  parsedQuery,
});

export const updateFilter = filter => ({
  type: UPDATE_FILTER,
  filter,
});

export const updateProductContext = productContext => ({
  type: UPDATE_PRODUCT_CONTEXT,
  productContext,
});

export const resetSearchState = () => ({
  type: RESET_SEARCH_STATE,
});

export const sendImpressions = () => (dispatch, getState) => {
  const impressions = Object.values(getState().search.impressions);

  if (impressions.length !== 0) {
    impressions.forEach(impression => dispatch(addImpression(impression)));

    dispatch(logEvent({
      analytics: {
        category: 'Shop',
        action: 'Load',
        label: 'Impression',
        nonInteraction: true,
      },
    }));
  }
  dispatch(clearImpressions());
};
