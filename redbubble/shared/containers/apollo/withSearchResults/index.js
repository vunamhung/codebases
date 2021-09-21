import { useMemo } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import get from 'lodash/get';
import { SEARCH_RESULT_PREVIEWS } from '../../../lib/previews';

export {
  artistCollectionsPropType,
  searchResultsMetadataPropType,
  searchResultsPaginationPropType,
  searchResultsFiltersPropType,
  searchResultsPropType,
  artistCollectionsDefaultProps,
} from './proptypes';

export const METADATA = {
  name: 'Metadata',
  fragment: gql`
    fragment Metadata on SearchResults {
      metadata {
        title
        searchContext {
          category
        }
        resultCount
        topic
        searchBar {
          iaCode
          pillLabel
          keywords
        }
      }
    }
  `,
};

export const LANDING_PAGE = {
  name: 'LandingPage',
  fragment: gql`
    fragment LandingPage on SearchResults {
      metadata {
        formattedQuery
        landingPage {
          hero {
            pitch
            title
            image
            color
          }
          bubbles {
            title
            items {
              title
              image
              realisticImage
              url
              isExternal
            }
            hasImages
          }
          seoMetadata {
            pageDescription
            robots
            canonicalURL
            searchTitle
            seoImage
            alternatePageVersions {
              href
              locale
            }
            relatedTagLinks {
              title
              href
              text
            }
          }
          footer {
            text
            readMoreText
            breadcrumbs {
              name
              url
            }
          }
        }

        relatedTopics {
          title
          url
        }

        relatedProducts {
          id
          url
          productTitle
          fullTitle
        }

        searchPageType
        resultCount
        searchUUID
      }
    }
  `,
};

const RESULTS = {
  name: 'Results',
  fragment: gql`
    fragment Results on SearchResults {
      results {
        inventoryItem(locale: $locale, country: $country, currency: $currency, previewTypeIds: $previewTypeIds) {
          id
          marketingProductTypeId
          description
          productTypeId
          productPageUrl
          blankItemId
          prominentMessage
          price {
            id
            amount
            currency
          }
          previewSet {
            id
            previews {
              previewTypeId
              url
            }
          }
          gaCode
          gaCategory
          attributes {
            name
            value
            attributes {
              name
              value
            }
          }
          volumeDiscount {
            id
            thresholds {
              percentOff
              quantity
            }
          }
          experiencesProductCard {
            name
            value
          }
        }
        work(locale: $locale) {
          id
          title
          artistName
          isMatureContent
          tags
        }
        defaultPreviewTypeId
        groupId
        rank
      }
    }
  `,
};

export const TRENDING_RESULTS = {
  name: 'TrendingResults',
  fragment: gql`
    fragment TrendingResults on SearchResults {
      trendingResults {
        inventoryItem(locale: $locale, country: $country, currency: $currency, previewTypeIds: $previewTypeIds) {
          id
          marketingProductTypeId
          description
          productPageUrl
          productTypeId
          price {
            id
            amount
            currency
          }
          previewSet {
            id
            previews {
              previewTypeId
              url
            }
          }
          volumeDiscount {
            id
            thresholds {
              percentOff
              quantity
            }
          }
          gaCode
          gaCategory
          attributes {
            name
            value
            attributes {
              name
              value
            }
          }
          experiencesProductCard {
            name
            value
          }
        }
        work(locale: $locale) {
          id
          title
          artistName
          isMatureContent
          tags
        }
        defaultPreviewTypeId
        groupId
        rank
      }
    }
  `,
};

export const FILTERS = {
  name: 'Filters',
  fragment: gql`
    fragment Filters on SearchResults {
      filters {
        resetUrl
        staticFilters {
          type
          label
          options {
            name
            label
            applied
            url
            options {
              name
              label
              applied
              url
            }
          }
        }
        filters {
          type
          label
          experiences {
            name
            value
          }
          options {
            name
            label
            applied
            disabled
            url
            hexColor
            imageUrl
          }
        }
        appliedCount
        appliedPath
        resets {
          label
          url
        }
      }
    }
  `,
};

export const PAGINATION = {
  name: 'Pagination',
  fragment: gql`
    fragment Pagination on SearchResults {
      pagination {
        currentPage
        perPage
        showPreviousPageLink
        showNextPageLink
        paginationLinks {
          namedLinks {
            previousPage {
              rel
              url
            }
            nextPage {
              rel
              url
            }
          }
        }
        fromNumber
        toNumber
        total
      }
    }
  `,
};

export const ARTIST_COLLECTIONS = {
  name: 'ArtistCollections',
  fragment: gql`
    fragment ArtistCollections on SearchResults {
      artistCollections {
        applied
        options {
          id
          name
          label
          description
          url
          imageUrl
          applied
        }
        reset {
          label
          description
          url
        }
        type
        label
      }
    }
  `,
};

const searchQuery = (fragments) => {
  const names = fragments.map(fragment => (
    `...${fragment.name}`
  )).join('\n');

  const data = fragments.reduce((accumulator, { fragment }) => gql`
    ${accumulator}
    ${fragment}
  `, '');

  return gql`
    query withSearchResults($query: String!, $queryParams: QueryParams, $locale: String!, $country: String!, $currency: String!, $previewTypeIds: [String!], $experience: String) {
      searchResults(query: $query, queryParams: $queryParams, locale: $locale, country: $country, currency: $currency, previewTypeIds: $previewTypeIds, experience: $experience) {
        ${names}
      }
    }
    ${data}
  `;
};

const removeIncomplete = (results) => {
  return results && results.filter(r => get(r, 'inventoryItem.id') && get(r, 'work'));
};

export const useSearchResults = ({
  query,
  queryParams,
  locale,
  country,
  currency,
  ssr,
  fragments = [],
  experience,
  skip,
}) => {
  const previewTypeIds = SEARCH_RESULT_PREVIEWS;

  const variables = {
    query,
    queryParams,
    locale,
    country,
    currency,
    previewTypeIds,
    experience,
    skip,
  };
  const shouldSkipQuery = skip || !(query && locale && country && currency);

  const { loading, data, error, refetch, networkStatus } = useQuery(
    searchQuery([RESULTS, ...fragments]), {
      variables,
      skip: shouldSkipQuery,
      ssr,
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
  );

  // Networkstatus = 4 is when a refetch happens
  const searchResultsLoading = loading || networkStatus === 4;

  const searchResults = useMemo(() => {
    const possiblyIncompleteResults = get(data, 'searchResults', {});
    const results = removeIncomplete(get(possiblyIncompleteResults, 'results'));
    const trendingResults = removeIncomplete(get(possiblyIncompleteResults, 'trendingResults'));
    return { ...possiblyIncompleteResults, results, trendingResults };
  }, [data]);

  return {
    searchResults,
    searchResultsLoading,
    searchResultsError: error,
    refetchSearchResults: refetch,
  };
};
