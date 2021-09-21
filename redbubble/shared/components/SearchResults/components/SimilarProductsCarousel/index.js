import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, intlShape } from 'react-intl';
import get from 'lodash/get';
import range from 'lodash/range';
import { MOBILE, DESKTOP, ELEVATION_MEDIUM } from '@redbubble/design-system/react/constants';
import Carousel, { Slide } from '@redbubble/design-system/react/Carousel';
import Text from '@redbubble/design-system/react/Text';
import Image from '@redbubble/design-system/react/Image';
import Card from '@redbubble/design-system/react/Card';
import { useBrowserInfo } from '../../../../containers/redux/withBrowserInfo';
import { useAnalyticsActions } from '../../../../containers/redux/withAnalytics';
import { useUserInfo } from '../../../../containers/apollo/withUserInfo';
import { useRecommendedInventoryItems } from '../../../../containers/apollo/withRecommendedInventoryItems';
import { useListInclusions } from '../../../../containers/apollo/withListInclusions';
import { listManagerShape } from '../../../../components/Lists';
import searchUUIDStorage from '../../../../lib/searchUUIDStorage';
import { analyticsPayload } from '../../../../lib/analytics';
import ProductCard from '../ProductCard';
import LoadingProductCard from '../LoadingProductCard';
import styles from './styles.css';

const IMPRESSION_LIST_NAME = 'similar_products_carousel';

const messages = defineMessages({
  title: 'Suggested for you',
});

const NUM_CAROUSEL_PRODUCTS = 12;

const generateRecommendationParams = (inventoryItemId, userInfo, searchType) => {
  const locale = get(userInfo, 'locale', null);
  const currency = get(userInfo, 'currency', null);
  const country = get(userInfo, 'country', null);
  const ssr = false;

  return {
    inventoryItemId,
    locale,
    country,
    currency,
    ssr,
    searchType,
  };
};

const productClicked = ({
  logEvent,
  searchUUID,
  pageUrl,
  inventoryItemId,
  rank,
  originalInventoryItemId,
}) => {
  searchUUIDStorage.set(pageUrl, searchUUID);
  logEvent({
    analytics: analyticsPayload.SrpRecommendCarouselProductClicked({
      pageUrl,
      inventoryItemId,
      searchUUID,
      rank,
      originalInventoryItemId,
    }),
  });
};

const SimilarProductsCarousel = ({
  intl,
  listManager,
  openLoginSignupModal,
  originalInventoryItemId,
  productTitle,
  iconUrl,
  searchUUID,
  searchType,
}) => {
  const browser = useBrowserInfo();
  const { userInfo } = useUserInfo();
  const locale = get(userInfo, 'locale', null);
  const isLoggedIn = get(userInfo, 'isLoggedIn', null);

  const { logEvent } = useAnalyticsActions();

  // Fetch Recommendations
  const recParams =
    generateRecommendationParams(originalInventoryItemId, userInfo, searchType);
  const {
    recommendedInventoryItems,
    recommendedInventoryItemsLoading,
  } = useRecommendedInventoryItems(recParams);
  const products = (get(recommendedInventoryItems, 'results') || []);
  const filteredProducts = products.filter(p => p && p.inventoryItem && p.inventoryItem.id);

  // Lists check
  const entities = filteredProducts.map(p => ({
    entityType: 'INVENTORY_ITEM',
    entityId: get(p, 'inventoryItem.id'),
  }));
  const ssr = false;
  useListInclusions(userInfo, entities, ssr);

  useEffect(() => {
    if (!recommendedInventoryItemsLoading) {
      logEvent({
        analytics: analyticsPayload.recommendCarouselResultsShowed(originalInventoryItemId),
      });
    }
  }, [originalInventoryItemId, logEvent, recommendedInventoryItemsLoading]);

  if (!recommendedInventoryItemsLoading && filteredProducts.length < 1) {
    logEvent({
      analytics: analyticsPayload.recommendCarouselInitialResultsFetchErrored(),
    });
    return null;
  }

  return (
    <Card className={styles.container} elevation={ELEVATION_MEDIUM}>
      <div className={styles.originalItem} data-testid="SimilarProductsCarousel">
        <Image src={iconUrl} className={styles.originalItemIcon} />
        <Text display="block"> { intl.formatMessage(messages.title) } </Text>
        <Text display="block" type="display5" className={styles.originalItemTitle}>
          {productTitle}
        </Text>
      </div>
      <Carousel
        slidesPerView="auto"
        profile={browser.is.large ? DESKTOP : MOBILE}
      >
        {
          recommendedInventoryItemsLoading ?
            range(NUM_CAROUSEL_PRODUCTS).map(i => (
              <Slide key={`similar-carousel-loading-${i}`}>
                <div className={styles.productCardWrapper}>
                  <LoadingProductCard intl={intl} />
                </div>
              </Slide>
            )) : filteredProducts.map((p, index) => (
              <Slide key={`topics-${p.inventoryItem.id}`}>
                <div className={styles.productCardWrapper}>
                  <ProductCard
                    intl={intl}
                    listManager={listManager}
                    openLoginSignupModal={openLoginSignupModal}
                    locale={locale}
                    isLoggedIn={isLoggedIn}
                    largeBrowser={browser.is.large}
                    resultIndex={index}
                    rank={index}
                    impressionListName={IMPRESSION_LIST_NAME}
                    inCarousel
                    onNavigateToProductPage={({ pageUrl, inventoryItemId, rank }) =>
                      productClicked({
                        logEvent,
                        searchUUID,
                        pageUrl,
                        inventoryItemId,
                        rank,
                        originalInventoryItemId,
                      })
                    }
                    {...p}
                  />
                </div>
              </Slide>
          ))
        }
      </Carousel>
    </Card>
  );
};

SimilarProductsCarousel.propTypes = {
  originalInventoryItemId: PropTypes.string.isRequired,
  productTitle: PropTypes.string.isRequired,
  iconUrl: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  listManager: listManagerShape,
  openLoginSignupModal: PropTypes.func,
  searchUUID: PropTypes.string,
  searchType: PropTypes.string,
};

SimilarProductsCarousel.defaultProps = {
  listManager: null,
  openLoginSignupModal: () => null,
  searchUUID: null,
  searchType: null,
};

export default SimilarProductsCarousel;
