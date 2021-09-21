import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import cnames from 'classnames';
import qs from 'query-string';
import { intlShape } from 'react-intl';
import Box from '@redbubble/design-system/react/Box';
import { Cookies } from 'react-cookie';
import { useSegmentClient } from '@redbubble/react-segment';
import styles from './SearchResultPage.css';
import SearchResults from '../SearchResults';
import useUnmountOrUnload from '../../hooks/useUnmountOrUnload';
import { browserPropType } from '../../containers/redux/withBrowserInfo';
import { useSearchActions } from '../../containers/redux/withSearch';
import { userInfoPropType } from '../../containers/apollo/withUserInfo';
import { useListInclusions } from '../../containers/apollo/withListInclusions';
import { historyPropType } from '../../lib/propTypes';
import { EXPERIENCE_SRP } from '../../lib/routing';
import {
  useSearchResults,
  TRENDING_RESULTS,
  METADATA,
  FILTERS,
  PAGINATION,
  LANDING_PAGE,
} from '../../containers/apollo/withSearchResults';
import { listManagerShape } from '../../components/Lists';
import TrustSignals from '../TrustSignals';
import Loading from '../Loading';
import HeroBanner from './components/HeroBanner';
import PageMetadata from './components/PageMetadata';
import Bubbles from './components/Bubbles';
import Footer from './components/Footer';
import RelatedTags from './components/RelatedTags';
import LinksCarousel from './components/LinksCarousel';
import ProductsCarousel from './components/ProductsCarousel';
import HydrationErrorBanner from '../HydrationErrorBanner';
import SubscribeBanner from './components/SubscribeBanner';
import TrendingProductsCarousel from './components/TrendingProductsCarousel';
import searchUUIDStorage from '../../lib/searchUUIDStorage';
import errorParser from './errorParser';
import useAnalyticsSetup from './hooks/useAnalyticsSetup';
import usePageViewAnalytics from './hooks/usePageViewAnalytics';
import useSearchBar from './hooks/useSearchBar';
import useSearchPill from './hooks/useSearchPill';
import useSearchEvents from '../../containers/apollo/withSearchEvents';
import {
  analyticsPayload,
  TOPIC_CAROUSEL_CLICKED,
  TOPIC_CAROUSEL_SHOWED,
} from '../../lib/analytics';
import { SegmentPages } from '../../consts';

const IMPRESSION_LIST_NAME = 'Shop';

const productSelectedOnGrid = ({
  logEvent,
  searchUUID,
  pageUrl,
  inventoryItemId,
  formattedQuery,
  rank,
}) => {
  searchUUIDStorage.set(pageUrl, searchUUID);
  logEvent({
    analytics: analyticsPayload.SRPGridClickOnProductEvent({
      pageName: 'Search Results Page',
      url: pageUrl,
      inventoryItemId,
      searchUUID,
      searchTerm: formattedQuery,
      position: rank,
    }),
  });
};

const productTagsDisplayed = logEvent => ({ inventoryItemId, rank }) => {
  logEvent({
    analytics: analyticsPayload.productTagsDisplayed({
      inventoryItemId,
      position: rank,
    }),
  });
};

export const generateSearchParams = (props) => {
  const requestQueryParams = qs.parse(get(props, 'location.search', null));

  // The "query" query parameter is only set for "manual" searches
  // (via the search box, or the search filters, or paginations from
  // such a search).
  const manualSearchQuery = get(requestQueryParams, 'query');

  // The query comes in the path for "tag pages"; these are the ones
  // you can reach by following links (and what search engine crawlers
  // will visit).
  const pathSearchQuery = get(props, 'match.params.query');

  // We should never get both a manual and a path query.
  // In any case, the priority is:
  //   The path query
  //   The manual query
  //   Otherwise, "*" representing a search for "everything"
  const query = pathSearchQuery || manualSearchQuery || '*';

  const locale = get(props, 'userInfo.locale', null);
  const country = get(props, 'userInfo.country', null);
  const currency = get(props, 'userInfo.currency', null);

  // We copy the props.queryParams because we are going to modify it.
  const queryParams = { ...get(props, 'queryParams', {}) };

  // Append the searchType parameter according to the manual/path
  // nature of the query.
  if (manualSearchQuery && !pathSearchQuery) {
    queryParams.searchType = 'find';
  } else {
    queryParams.searchType = 'browse';
  }

  const ssr = true;
  const fragments = [TRENDING_RESULTS, METADATA, FILTERS, PAGINATION, LANDING_PAGE];

  return {
    query,
    queryParams,
    locale,
    country,
    currency,
    ssr,
    fragments,
    experience: EXPERIENCE_SRP,
  };
};

export const MemoizedSearchResults = React.memo((props) => {
  return <SearchResults {...props}>{props.children}</SearchResults>;
}, (prevProps, nextProps) => {
  return (
    isEqual(prevProps.searchParams, nextProps.searchParams) &&
    prevProps.searchResultPageLoading === nextProps.searchResultPageLoading &&
    prevProps.hydrationFailed === nextProps.hydrationFailed &&
    prevProps.results === nextProps.results &&
    prevProps.listInclusions === nextProps.listInclusions &&
    prevProps.userInfo === nextProps.userInfo &&
    isEqual(prevProps.lastClickedInventoryItem, nextProps.lastClickedInventoryItem)
  );
});

MemoizedSearchResults.displayName = 'MemoizedSearchResults';

const SearchResultPage = (props) => {
  const {
    cookies,
    browser,
    intl,
    userInfo,
    history,
    listManager,
    openLoginSignupModal,
    validateAndSetDimensions,
    setGAClientOptions,
    logPageView,
    logEvent,
    accumulateImpression,
    sendImpressions,
    staticContext,
  } = props;

  const locale = get(userInfo, 'locale', null);

  // Fetch Search Results
  const searchParams = generateSearchParams(props);
  const {
    searchResults,
    searchResultsLoading,
    refetchSearchResults,
  } = useSearchResults(searchParams);
  const metadata = get(searchResults, 'metadata', null);
  const filters = get(searchResults, 'filters', null);
  const results = get(searchResults, 'results', null);
  const trendingResults = get(searchResults, 'trendingResults', null);
  const pagination = get(searchResults, 'pagination', null);
  const searchUUID = get(metadata, 'searchUUID', null);
  const totalProducts = get(metadata, 'resultCount', null);
  const searchPageType = get(metadata, 'searchPageType', null);
  const federatedId = get(userInfo, 'federatedId', '') || '';
  const title = get(metadata, 'title', '') || '';
  const category = get(metadata, 'searchBar.pillLabel', '') || '';
  const query = get(metadata, 'formattedQuery', '') || '';

  const { searchFailed, hydrationFailed } = errorParser(
    searchResults,
    searchResultsLoading,
    staticContext,
  );

  const segmentClient = useSegmentClient();
  const searchTerm = get(metadata, 'formattedQuery', null);
  const categoryName = get(metadata, 'searchContext.category', null);

  useEffect(() => {
    const { currency, country } = userInfo;

    // we don't want to send a page call when empty search
    if (searchTerm === '*' && (!categoryName || categoryName === 'all-departments')) return;

    segmentClient.page(SegmentPages.SEARCH_RESULTS, {
      currency,
      locale,
      country,
      search_term: searchTerm,
      category_name: categoryName,
    });
  }, [searchTerm, filters]);

  // Emitting search events
  const sendSearchEvents = useSearchEvents(
    title,
    category,
    query,
    results,
    federatedId,
  );
  useEffect(() => {
    if (federatedId && Array.isArray(results)) sendSearchEvents();
  }, [federatedId, results]);

  // Lists check
  const entities = results && results.map(p => ({
    entityType: 'INVENTORY_ITEM',
    entityId: p.inventoryItem.id,
  }));
  const { listInclusions } = useListInclusions(userInfo, entities, true);

  // FLP config
  const hero = get(metadata, 'landingPage.hero', null);
  const seoMetadata = get(metadata, 'landingPage.seoMetadata', null);
  const bubbles = get(metadata, 'landingPage.bubbles', null);
  const breadcrumbs = get(metadata, 'landingPage.footer.breadcrumbs', []);
  const productSpecificDescription = get(metadata, 'landingPage.footer.text', null);
  const readMoreProductSpecificDescription = get(metadata, 'landingPage.footer.readMoreText', null);
  const relatedTagLinks = get(metadata, 'landingPage.seoMetadata.relatedTagLinks', []);
  const topics = get(metadata, 'relatedTopics') || [];
  const originalTopic = get(metadata, 'topic', '');
  const relatedProducts = get(metadata, 'relatedProducts') || [];
  const formattedQuery = get(metadata, 'formattedQuery', null);

  // Search Bar things
  const {
    updateProductContext,
    updateParsedQuery,
    updateSearchTerm,
  } = useSearchActions();
  const searchBar = get(metadata, 'searchBar') || {};
  useSearchBar(updateParsedQuery, updateSearchTerm, searchBar);
  useSearchPill(updateProductContext, searchBar);


  // Analytics things
  useAnalyticsSetup(validateAndSetDimensions, searchUUID, formattedQuery);
  usePageViewAnalytics(
    setGAClientOptions, logPageView, totalProducts, searchPageType, searchBar, browser,
  );
  useUnmountOrUnload(() => sendImpressions());

  // Display config
  const showRelatedProducts = relatedProducts.length > 0;
  const showTopics = !bubbles && topics.length > 0;
  const showFooter = results && results.length > 0;
  const showRelatedTags = relatedTagLinks.length > 0;
  const showTrendingCarousel = get(trendingResults, 'length', 0) > 1;

  // Back injection logic
  const historyLastClickedItem = (
    typeof window !== 'undefined' && get(window, 'history.state.lastClickedItem')
  ) || null;

  const [lastClickedItem, setLastClickedItem] = useState(
    historyLastClickedItem || null,
  );

  // Handler functions.
  // TODO: Move these out of the render path if we can.
  const updateLastClickedProduct = (e, inventoryItem) => {
    if (typeof window !== 'undefined') {
      const path = `${history.location.pathname}${history.location.search}`;
      const updateHistory = () => (window.history.replaceState(
        { lastClickedItem: inventoryItem }, path, path,
      ));

      window.addEventListener('beforeunload', updateHistory, { once: true });

      document.addEventListener('visibilitychange', () => {
        updateHistory();
        setLastClickedItem(inventoryItem);
      }, { once: true });
    }
  };

  const retryQueryWithAnalytics = () => {
    const resultCount = results && results.length > 0 ? results.length : null;

    logEvent({
      analytics: analyticsPayload.SRPRetry(resultCount),
    });
    refetchSearchResults();
  };

  const onNavigateToProductPage = useCallback(
    ({ pageUrl, inventoryItemId, rank }) => productSelectedOnGrid(
      { logEvent, searchUUID, pageUrl, inventoryItemId, formattedQuery, rank },
    ),
    [formattedQuery, logEvent, searchUUID],
  );

  if (searchFailed) {
    return (
      <div className={styles.errorPage}>
        <HydrationErrorBanner
          formatMessage={intl.formatMessage}
          onRetry={() => retryQueryWithAnalytics()}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {
        searchResultsLoading && !results && (
          <Loading />
        )
      }
      {!searchResultsLoading && (
        <PageMetadata
          seoMetadata={seoMetadata}
          userInfo={userInfo}
          cookies={cookies}
          products={results}
        />
      )}
      { hero && (
        <div className={cnames(styles.heroContainer, styles.showMobile)}>
          <HeroBanner
            {...hero}
            loading={searchResultsLoading}
          />
        </div>
      )}
      {
        results && (
          <MemoizedSearchResults
            listInclusions={listInclusions}
            browser={browser}
            cookies={cookies}
            searchResultPageLoading={searchResultsLoading}
            intl={intl}
            filters={filters}
            results={results}
            pagination={pagination}
            history={history}
            metadata={metadata}
            userInfo={userInfo}
            listManager={listManager}
            openLoginSignupModal={openLoginSignupModal}
            accumulateImpression={accumulateImpression}
            sendImpressions={sendImpressions}
            impressionListName={IMPRESSION_LIST_NAME}
            locale={locale}
            searchParams={searchParams}
            updateLastClickedProduct={updateLastClickedProduct}
            lastClickedInventoryItem={lastClickedItem}
            onNavigateToProductPage={onNavigateToProductPage}
            hydrationFailed={hydrationFailed}
            retryHydration={retryQueryWithAnalytics}
            interstitialSlot1={
              showTrendingCarousel && (
                <TrendingProductsCarousel
                  trendingResults={trendingResults}
                  intl={intl}
                  listManager={listManager}
                  openLoginSignupModal={openLoginSignupModal}
                  searchUUID={searchUUID}
                  title={get(metadata, 'title')}
                />
              )
            }
            interstitialSlot2={<SubscribeBanner />}
            interstitialSlot3={
              showRelatedProducts && (
                <ProductsCarousel
                  products={relatedProducts}
                  loading={searchResultsLoading}
                  intl={intl}
                  logEvent={logEvent}
                />
              )
            }
            onProductTagsDisplayed={productTagsDisplayed(logEvent)}
            logEvent={logEvent}
          >
            { hero && (
              <div className={cnames(styles.heroContainer, styles.showDesktop)}>
                <HeroBanner
                  {...hero}
                  loading={searchResultsLoading}
                />
              </div>
            )}
            {
              bubbles && (
                <Bubbles
                  bubbles={bubbles}
                  loading={searchResultsLoading}
                  logEvent={logEvent}
                />
              )
            }
            {
              showTopics &&
              <div id="TopicsCarousel">
                <LinksCarousel
                  links={topics}
                  refLabel={originalTopic}
                  loading={searchResultsLoading}
                  intl={intl}
                  locale={locale}
                  history={history}
                  logEvent={logEvent}
                  showEventAction={TOPIC_CAROUSEL_SHOWED}
                  showEventLabel={originalTopic}
                  clickEventAction={TOPIC_CAROUSEL_CLICKED}
                  makeClickEventLabel={({ refLabel, clickedLabel, position }) => `${refLabel}|${clickedLabel}|${position}`}
                />
              </div>
            }
          </MemoizedSearchResults>
        )
      }
      {
        results && (
          <Box className={styles.trustSignalsContainer}>
            <TrustSignals
              intl={intl}
              locale={locale}
            />
          </Box>
        )
      }
      { showFooter && (
        <Footer
          intl={intl}
          breadcrumbs={breadcrumbs}
          productSpecificDescription={productSpecificDescription}
          readMoreProductSpecificDescription={readMoreProductSpecificDescription}
          logEvent={logEvent}
        />
      )}
      { showRelatedTags && (
        <RelatedTags
          relatedTagLinks={relatedTagLinks}
          logEvent={logEvent}
        />
      )}
    </div>
  );
};

SearchResultPage.propTypes = {
  browser: browserPropType,
  userInfo: userInfoPropType.isRequired,
  intl: intlShape.isRequired,
  accumulateImpression: PropTypes.func,
  sendImpressions: PropTypes.func,
  validateAndSetDimensions: PropTypes.func,
  setGAClientOptions: PropTypes.func,
  logPageView: PropTypes.func,
  logEvent: PropTypes.func,
  cookies: PropTypes.instanceOf(Cookies),
  history: historyPropType,
  listManager: listManagerShape,
  openLoginSignupModal: PropTypes.func,
};

SearchResultPage.defaultProps = {
  browser: {
    is: {
      small: true,
    },
  },
  accumulateImpression: () => null,
  sendImpressions: () => null,
  validateAndSetDimensions: () => null,
  setGAClientOptions: () => null,
  logPageView: () => null,
  logEvent: () => null,
  cookies: new Cookies(),
  history: null,
  listManager: null,
  openLoginSignupModal: null,
};

export default SearchResultPage;
