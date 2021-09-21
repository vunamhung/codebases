import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import get from 'lodash/get';
import { SEARCH_RESULT_PREVIEWS } from '../../../lib/previews';

const RECOMMENDED_QUERY = gql`
  query withRecommendedInventoryItems($inventoryItemId: String!, $locale: String!, $currency: String!, $country: String!, $previewTypeIds: [String!], $searchType: String) {
    recommendedInventoryItems(inventoryItemId: $inventoryItemId, locale: $locale, currency: $currency, country: $country, previewTypeIds: $previewTypeIds, searchType: $searchType) {
      results {
        inventoryItem(locale: $locale, country: $country, currency: $currency, previewTypeIds: $previewTypeIds) {
          id
          marketingProductTypeId
          description
          productPageUrl
          productTypeId
          price {
            amount
            currency
          }
          previewSet {
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
      }
    }
  }
`;

export const recommendedInventoryItemsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    inventoryItem: PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      productPageUrl: PropTypes.string,
      price: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired,
      }),
      previewSet: PropTypes.shape({
        previews: PropTypes.arrayOf(
          PropTypes.shape({
            previewTypeId: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
          }),
        ),
      }),
    }),
    work: PropTypes.shape({
      title: PropTypes.string,
      isMatureContent: PropTypes.bool,
      artistName: PropTypes.string,
    }),
  }),
);

export const useRecommendedInventoryItems = ({
  inventoryItemId,
  locale,
  currency,
  country,
  ssr,
  searchType,
}) => {
  const previewTypeIds = SEARCH_RESULT_PREVIEWS;

  const variables = {
    inventoryItemId,
    locale,
    currency,
    country,
    previewTypeIds,
    searchType,
  };
  const skip = !(inventoryItemId && locale && country && currency);

  const { loading, data, error } = useQuery(RECOMMENDED_QUERY, { variables, skip, ssr });

  return {
    recommendedInventoryItems: get(data, 'recommendedInventoryItems', {}),
    recommendedInventoryItemsLoading: loading,
    recommendedInventoryItemsError: error,
  };
};
