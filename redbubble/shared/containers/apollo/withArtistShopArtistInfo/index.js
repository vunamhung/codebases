import React from 'react';
import PropTypes from 'prop-types';

import get from 'lodash/get';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const noSpacesInName = artistName => !artistName.includes(' ');

const ARTIST_SHOP_ARTIST_INFO_QUERY = gql`
  query withArtistShopArtistInfo($artistName: ID!, $locale: String!){
    artistShopArtistInfo(artistName: $artistName, locale: $locale){
      id
      username
      avatar
      displayName: name
      bio
      additionalInfo
      artistFederatedId: federatedId
      worksCount
      bannerUrls {
        url
        size
      }
      accountState
      externalSites {
        label
        site
        url
      }
      metrics {
        followerCount
        followingCount
        favoriteReceivedCount
      }
      isArtist
      featuredCollection
      acceptPrivateMessages
    }
  }
`;

export const useArtistShopArtistInfo = (artistName, locale) => {
  const variables = {
    artistName: encodeURIComponent(artistName),
    locale,
  };

  const { data, loading, refetch, error } = useQuery(ARTIST_SHOP_ARTIST_INFO_QUERY, {
    variables,
    skip: !(artistName && locale && noSpacesInName(artistName)),
  });

  const artistInfo = get(data, 'artistShopArtistInfo');
  return {
    artistInfo,
    artistInfoLoading: loading,
    refetchArtistShopArtistInfo: refetch,
    artistFetchError: error,
  };
};


const withArtistShopArtistInfo = (Component) => {
  const WrappedComponent = (props) => {
    const { artistName, locale } = props;
    const {
      artistInfo,
      artistInfoLoading,
      refetchArtistShopArtistInfo,
      artistFetchError,
    } = useArtistShopArtistInfo(artistName, locale);

    return (
      <Component
        artistInfo={artistInfo}
        artistInfoLoading={artistInfoLoading}
        refetchArtistShopArtistInfo={refetchArtistShopArtistInfo}
        artistFetchError={artistFetchError}
        {...props}
      />
    );
  };

  WrappedComponent.propTypes = {
    artistName: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
  };

  return WrappedComponent;
};

withArtistShopArtistInfo.displayName = 'withArtistShopArtistInfo';

export default withArtistShopArtistInfo;
