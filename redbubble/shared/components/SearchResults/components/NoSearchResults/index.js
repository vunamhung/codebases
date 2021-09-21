import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages, intlShape } from 'react-intl';
import get from 'lodash/get';
import range from 'lodash/range';
import Box from '@redbubble/design-system/react/Box';
import Text from '@redbubble/design-system/react/Text';
import Carousel, { Slide } from '@redbubble/design-system/react/Carousel';
import { MOBILE, DESKTOP } from '@redbubble/design-system/react/constants';
import styles from './styles.css';
import { artistShopPagePath } from '../../../../lib/routing';
import { analyticsPayload } from '../../../../lib/analytics';
import { listManagerShape } from '../../../../components/Lists';
import { userInfoPropType } from '../../../../containers/apollo/withUserInfo';
import { useArtistShopArtistInfo } from '../../../../containers/apollo/withArtistShopArtistInfo';
import { useSearchResults } from '../../../../containers/apollo/withSearchResults';
import { useBrowserInfo } from '../../../../containers/redux/withBrowserInfo';
import { useListInclusions } from '../../../../containers/apollo/withListInclusions';
import { useAnalyticsActions } from '../../../../containers/redux/withAnalytics';
import searchUUIDStorage from '../../../../lib/searchUUIDStorage';
import ArtistDetails from '../ArtistDetails';
import ProductCard from '../ProductCard';
import LoadingProductCard from '../LoadingProductCard';

const IMPRESSION_LIST_NAME = 'no_search_results_product_carousel';
const NUM_LOADING_PRODUCTS = 10;

const messages = defineMessages({
  heading: { defaultMessage: 'Nothing matches your search for "{search}".' },
  subText: { defaultMessage: 'Don\'t give up! Check your spelling, clear some filters or try something new.' },
  suggestionsHeading: { defaultMessage: 'Suggested for you' },
  tryAgain: { defaultMessage: 'Something went wrong, try again later.' },
});

const productSelectedOnGrid = ({ logEvent, searchUUID, pageUrl, inventoryItemId, rank }) => {
  searchUUIDStorage.set(pageUrl, searchUUID);
  logEvent({
    analytics: analyticsPayload.SrpNoResultsProductClickedEvent({
      pageUrl,
      inventoryItemId,
      searchUUID,
      rank,
    }),
  });
};

const NoSearchResults = ({
  search,
  artistName,
  locale,
  listManager,
  productConfigurator,
  openLoginSignupModal,
  intl,
  userInfo,
  searchParams,
  searchUUID,
}) => {
  const browser = useBrowserInfo();
  const { logEvent } = useAnalyticsActions();

  // Try finding an Artist
  const { artistInfo } = useArtistShopArtistInfo(artistName, locale);
  const artistUsername = get(artistInfo, 'username', null);
  const artistAvatar = get(artistInfo, 'avatar', null);
  const artistShopUrl = artistUsername ? artistShopPagePath(artistUsername, [], {}, locale) : null;
  const artistDisplayName = get(artistInfo, 'displayName', null);
  const artistSecondaryText = get(artistInfo, 'additionalInfo', null);
  const artistAccountState = get(artistInfo, 'accountState', null);
  const showArtistCard = (artistUsername && artistShopUrl && artistAccountState === 'ACTIVE');

  // Load a Search Carousel
  const querylessSearchParams = {
    ...searchParams,
    query: '*',
  };
  const { searchResults, searchResultsLoading } = useSearchResults(querylessSearchParams);
  const products = get(searchResults, 'results') || [];
  const filteredProducts = products.filter(p => p && p.inventoryItem && p.inventoryItem.id);

  // Lists check
  const entities = filteredProducts.map(p => ({
    entityType: 'INVENTORY_ITEM',
    entityId: get(p, 'inventoryItem.id'),
  }));
  useListInclusions(userInfo, entities, false);

  // Aliases for readability of different states
  const carouselLoading = searchResultsLoading;
  const carouselFailedToLoad = !carouselLoading && filteredProducts.length === 0;
  const carouselLoaded = !carouselLoading && filteredProducts.length > 0;

  return (
    <React.Fragment>
      {
        showArtistCard ? (
          <ArtistDetails
            avatar={artistAvatar}
            shopUrl={artistShopUrl}
            name={artistDisplayName}
            secondary={artistSecondaryText}
          />
        ) : (
          <Box id="NoSearchResultsHeading">
            <Text type="display3" display="block">
              <FormattedMessage {...messages.heading} values={{ search }} />
            </Text>
            <Box marginBottom="m" marginTop="m">
              <Text type="body">
                <FormattedMessage {...messages.subText} />
              </Text>
            </Box>
          </Box>
        )
      }
      <Box
        id="NoSearchResultsCarousel"
        className={styles.suggestions}
        marginTop="xl"
        paddingBottom="xl"
        paddingTop="xl"
      >
        <Box marginBottom="m">
          <Text type="display5" loading={searchResultsLoading}>
            <FormattedMessage {...messages.suggestionsHeading} />
          </Text>
        </Box>
        <div className={styles.carouselWrapper}>
          {
            carouselFailedToLoad && (
              <Box paddingTop="xl">
                <Text type="display5"> <FormattedMessage {...messages.tryAgain} /> </Text>
              </Box>
            )
          }
          {
            carouselLoading && (
              <Carousel
                slidesPerView="auto"
                profile={browser.is.large ? DESKTOP : MOBILE}
              >
                {
                  range(NUM_LOADING_PRODUCTS).map(index => (
                    <Slide key={`loading-product-card-${index}`}>
                      <div className={styles.productCardWrapper}>
                        <LoadingProductCard
                          intl={intl}
                        />
                      </div>
                    </Slide>
                  ))
                }
              </Carousel>
            )
          }
          {
            carouselLoaded && (
              <Carousel
                slidesPerView="auto"
                profile={browser.is.large ? DESKTOP : MOBILE}
              >
                {
                  filteredProducts.map((product, index) => (
                    <Slide key={`product-${product.inventoryItem.id}`}>
                      <div className={styles.productCardWrapper}>
                        <ProductCard
                          userInfo={userInfo}
                          isLoggedIn={get(userInfo, 'isLoggedIn', false)}
                          intl={intl}
                          listManager={listManager}
                          productConfigurator={productConfigurator}
                          openLoginSignupModal={openLoginSignupModal}
                          isArtworkPreview={false}
                          resultIndex={index}
                          impressionListName={IMPRESSION_LIST_NAME}
                          largeBrowser={browser.is.large}
                          locale={locale}
                          rank={index}
                          onNavigateToProductPage={({ pageUrl, inventoryItemId, rank }) =>
                            productSelectedOnGrid(
                              { logEvent, searchUUID, pageUrl, inventoryItemId, rank },
                            )
                          }
                          {...product}
                        />
                      </div>
                    </Slide>
                  ))
                }
              </Carousel>
            )
          }
        </div>
      </Box>
    </React.Fragment>
  );
};

NoSearchResults.propTypes = {
  search: PropTypes.string.isRequired,
  locale: PropTypes.string,
  listManager: listManagerShape,
  openLoginSignupModal: PropTypes.func,
  intl: intlShape.isRequired,
  userInfo: userInfoPropType.isRequired,
  searchParams: PropTypes.shape({}),
  searchUUID: PropTypes.string,
};

NoSearchResults.defaultProps = {
  locale: 'en',
  listManager: null,
  openLoginSignupModal: () => {},
  searchParams: {},
  searchUUID: null,
};

export default NoSearchResults;
