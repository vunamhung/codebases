import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import cnames from 'classnames';
import { defineMessages, intlShape } from 'react-intl';
import get from 'lodash/get';
import { useInView } from 'react-intersection-observer';
import { MOBILE, DESKTOP, ELEVATION_MEDIUM } from '@redbubble/design-system/react/constants';
import Carousel, { Slide } from '@redbubble/design-system/react/Carousel';
import Card from '@redbubble/design-system/react/Card';
import Text from '@redbubble/design-system/react/Text';
import Box from '@redbubble/design-system/react/Box';
import { useBrowserInfo } from '../../../../containers/redux/withBrowserInfo';
import { useAnalyticsActions } from '../../../../containers/redux/withAnalytics';
import { useUserInfo } from '../../../../containers/apollo/withUserInfo';
import { useListInclusions } from '../../../../containers/apollo/withListInclusions';
import { listManagerShape } from '../../../../components/Lists';
import searchUUIDStorage from '../../../../lib/searchUUIDStorage';
import ProductCard from '../../../SearchResults/components/ProductCard';
import styles from './styles.css';
import { searchResultsPropType } from '../../../../containers/apollo/withSearchResults';
import {
  analyticsPayload,
  TRENDING_CAROUSEL_SHOWED,
  TRENDING_CAROUSEL,
} from '../../../../lib/analytics';

const messages = defineMessages({
  heading: 'Trending {trendingItemName}',
});

const IMPRESSION_LIST_NAME = 'trending_products_carousel';

const productClicked = ({
  logEvent,
  searchUUID,
  pageUrl,
  inventoryItemId,
  rank,
}) => {
  searchUUIDStorage.set(pageUrl, searchUUID);
  logEvent({
    analytics: analyticsPayload.SrpTrendingCarouselProductClicked({
      pageUrl,
      inventoryItemId,
      searchUUID,
      rank,
    }),
  });
};

const TrendingProductsCarousel = ({
  trendingResults,
  intl,
  listManager,
  openLoginSignupModal,
  searchUUID,
  classes,
  title,
  positionStyles,
}) => {
  const browser = useBrowserInfo();
  const { userInfo } = useUserInfo();
  const locale = get(userInfo, 'locale', null);
  const isLoggedIn = get(userInfo, 'isLoggedIn', null);
  const { logEvent } = useAnalyticsActions();

  const filteredProducts = trendingResults.filter(p => p && p.inventoryItem && p.inventoryItem.id);
  // Lists check
  const entities = filteredProducts.map(p => ({
    entityType: 'INVENTORY_ITEM',
    entityId: get(p, 'inventoryItem.id'),
  }));
  useListInclusions(userInfo, entities, false);

  // Determine if the Carousel is within the viewport, for analytics reasons
  const [ref, inView] = useInView({ triggerOnce: true });
  useEffect(() => {
    const analytics = analyticsPayload.searchPageComponentShowed(
      TRENDING_CAROUSEL_SHOWED,
      TRENDING_CAROUSEL,
    );

    if (inView) {
      logEvent({ analytics });
    }
  }, [inView, logEvent]);

  const showCarousel = filteredProducts.length > 0;

  return (
    <div className={cnames(styles.wrapper, classes)} ref={ref} style={positionStyles}>
      {
        showCarousel ? (
          <Card elevation={ELEVATION_MEDIUM} className={styles.container}>
            <Box paddingBottom="m">
              <Text type="display3">
                {intl.formatMessage(messages.heading, { trendingItemName: title })}
              </Text>
            </Box>
            <Carousel
              slidesPerView="auto"
              profile={browser.is.large ? DESKTOP : MOBILE}
            >
              {
                filteredProducts.map((p, index) => (
                  <Slide key={`trending-product-${p.inventoryItem.id}`}>
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
                        inCarousel
                        impressionListName={IMPRESSION_LIST_NAME}
                        onNavigateToProductPage={({ pageUrl, inventoryItemId, rank }) =>
                          productClicked({
                            logEvent,
                            searchUUID,
                            pageUrl,
                            inventoryItemId,
                            rank,
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
        ) : null
      }
    </div>

  );
};

TrendingProductsCarousel.propTypes = {
  trendingResults: searchResultsPropType.isRequired,
  intl: intlShape.isRequired,
  listManager: listManagerShape,
  openLoginSignupModal: PropTypes.func,
  searchUUID: PropTypes.string,
  classes: PropTypes.string,
  title: PropTypes.string,
  positionStyles: PropTypes.shape({
    gridRowStart: PropTypes.string,
    gridRowEnd: PropTypes.string,
  }),
};

TrendingProductsCarousel.defaultProps = {
  listManager: null,
  openLoginSignupModal: () => null,
  searchUUID: null,
  classes: '',
  title: '',
  positionStyles: null,
};

export default TrendingProductsCarousel;

