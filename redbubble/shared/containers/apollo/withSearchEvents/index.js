import get from 'lodash/get';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const SEND_SEARCH_EVENT = gql`
  mutation sendSearchEvent(
    $searchContext: SearchContextInput!
    $partialResults: [PartialResultsInput!]!
    $federatedId: String!
    $sailthruHid: String
  ) {
    sendSearchEvent(
      searchContext: $searchContext
      partialResults: $partialResults
      federatedId: $federatedId
      sailthruHid: $sailthruHid
    )
  }
`;

const findPrimaryImage = (result) => {
  const previews = get(result, 'inventoryItem.previewSet.previews', []);
  return previews.find(
    item => item.previewTypeId === result.defaultPreviewTypeId,
  ) || null;
};

const useSearchEvents = (
  title,
  category,
  query,
  results,
  federatedId,
) => {
  const variables = {
    partialResults: (results || [])
      .filter(result => Boolean(findPrimaryImage(result)))
      .slice(0, 6)
      .map((result) => {
        const primaryImage = findPrimaryImage(result);

        return {
          inventoryItemId: result.inventoryItem.id,
          artistUserName: result.work.artistName,
          fullTitle: `${result.work.title} ${result.inventoryItem.description}`,
          productUrl: result.inventoryItem.productPageUrl,
          primaryImage: primaryImage.url,
          matureContent: result.work.isMatureContent,
        };
      }),
    searchContext: {
      title,
      category,
      query,
    },
    federatedId,
  };

  const [sendSearchEvent] = useMutation(SEND_SEARCH_EVENT);
  return () => sendSearchEvent({ variables });
};

export default useSearchEvents;
