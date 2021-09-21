import Box from '@redbubble/design-system/react/Box';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Cookies } from 'react-cookie';
import { defineMessages, intlShape } from 'react-intl';
import DesktopSearchFilters from '../DesktopSearchFilters';
import styles from './styles.css';
import Pagination from './components/Pagination';
import SearchResultsGrid from './components/SearchResultsGrid';
import { historyPropType } from '../../lib/propTypes';
import {
  searchResultsMetadataPropType,
  searchResultsPropType,
  searchResultsPaginationPropType,
  searchResultsFiltersPropType,
  artistCollectionsPropType,
  artistCollectionsDefaultProps,
} from '../../containers/apollo/withSearchResults';
import { browserPropType } from '../../containers/redux/withBrowserInfo';
import MobileSearchFilters, { initialSelectedPreview, isArtworkPreviewAndMobile } from '../MobileSearchFilters';
import Header from './components/Header';
import NoSearchResults from './components/NoSearchResults';
import VolumeDiscountBanner from './components/VolumeDiscountBanner';
import SearchContextList from '../SearchContextList';
import Loading from '../Loading';
import { userInfoPropType } from '../../containers/apollo/withUserInfo';
import { listManagerShape } from '../../components/Lists';
import HydrationErrorBanner from '../HydrationErrorBanner';
import useMedia from '../../hooks/useMedia';

const messages = defineMessages({
  searchContextClearAllText: { defaultMessage: 'Clear all' },
  shopTitle: { defaultMessage: 'Shop' },
  results: { defaultMessage: '{ resultCount, number } Results' },
});

const sortFilterToSortOrders = (sortFilter) => {
  const { options } = sortFilter;
  return options.map(({ name, label, applied, url }) => ({
    name: label,
    code: name,
    url,
    selected: applied,
  }));
};

const selectFilter = (filters, type) => {
  return filters.find(filter => filter.type === type);
};

const SmallFilters = ({
  searchResultPageLoading,
  filters,
  intl,
  history,
  category,
  handleSearchGridToggleSelection,
  handleSelectedPreviewType,
  artistCollections,
}) => {
  return (
    <MobileSearchFilters
      searchResultPageLoading={searchResultPageLoading}
      searchFilter={filters}
      intl={intl}
      history={history}
      iaCode={category}
      handleSearchGridToggleSelection={handleSearchGridToggleSelection}
      handleSelectedPreviewType={handleSelectedPreviewType}
      artistCollections={artistCollections}
    />
  );
};

const LargeFilters = ({ filters, intl, artistCollections }) => {
  return (
    <Box className={styles.resultsFilterContainer}>
      <DesktopSearchFilters
        intl={intl}
        searchFilter={filters}
        artistCollections={artistCollections}
      />
    </Box>
  );
};

const SearchResults = ({
  browser,
  cookies,
  intl,
  filters,
  results,
  metadata,
  pagination,
  searchResultPageLoading,
  history,
  userInfo,
  listManager,
  openLoginSignupModal,
  cardAttrOverrides,
  accumulateImpression,
  sendImpressions,
  impressionListName,
  children,
  artistCollections,
  locale,
  searchParams,
  updateLastClickedProduct,
  lastClickedInventoryItem,
  onNavigateToProductPage,
  informationBanner,
  interstitialSlot1,
  interstitialSlot2,
  interstitialSlot3,
  logEvent,
  onProductTagsDisplayed,
  hydrationFailed,
  retryHydration,
  showArtworkPageLink,
}) => {
  const largeBrowser = get(browser, 'is.large', false);
  const [singleColumnGrid, handleSearchGridToggleSelection] = useState(false);
  const [isArtworkPreview, handleSelectedPreviewType] = useState(isArtworkPreviewAndMobile(
    initialSelectedPreview(cookies, metadata.searchContext.category),
    largeBrowser,
  ));
  const sortFilter = selectFilter(filters.filters, 'sortOrder');
  const sortOrders = sortFilterToSortOrders(sortFilter);

  const hasMultiplePages = pagination &&
    (pagination.showPreviousPageLink || pagination.showNextPageLink);

  const currentCollection = get(artistCollections, 'reset');
  const currentCollectionLabel = get(currentCollection, 'label', '');
  let searchGridTitle;
  if (currentCollectionLabel) {
    searchGridTitle = `${currentCollectionLabel} ${metadata.title}`;
  } else {
    searchGridTitle = metadata.title || intl.formatMessage(messages.shopTitle);
  }
  const searchGridDescription = get(currentCollection, 'description');
  const searchGridResultCount = intl.formatMessage(
    messages.results,
    { resultCount: get(metadata, 'resultCount', 0) },
  );

  const isViewportLarge = useMedia(
    ['(min-width: 768px)'],
    [true],
    false,
    get(browser, 'is.large', false),
  );
  const Filters = isViewportLarge ? LargeFilters : SmallFilters;
  const resets = [currentCollection, ...filters.resets].filter(Boolean);
  const hasContextPills = Array.isArray(resets) && !!resets.length;
  const hasResults = Array.isArray(results) && Boolean(results.length) && !hydrationFailed;

  // Propagate search service query parameters (specifically searchType )through to
  // subcomponents that call search-service.
  const searchType = get(searchParams, 'queryParams.searchType', null);

  const showNoResults = Array.isArray(results) &&
    results.length === 0 &&
    !searchResultPageLoading &&
    !hydrationFailed;

  return (
    <Box className={styles.resultsContainer} element="section" aria-label={searchGridResultCount}>
      <Filters
        browser={browser}
        intl={intl}
        history={history}
        filters={filters}
        category={metadata.searchContext.category}
        searchResultPageLoading={searchResultPageLoading}
        handleSearchGridToggleSelection={handleSearchGridToggleSelection}
        handleSelectedPreviewType={handleSelectedPreviewType}
        artistCollections={artistCollections}
      />
      <div className={styles.resultsProductsContainer}>
        {children}
        {
          hasResults && (
            <Box padding="xs">
              <Header
                title={searchGridTitle}
                description={searchGridDescription}
                resultCount={searchGridResultCount}
                sortOrders={sortOrders}
                hasResults={hasResults}
                loading={searchResultPageLoading}
              />
            </Box>
          )
        }
        {isViewportLarge && hasContextPills && (
          <Box padding="xs">
            <SearchContextList
              items={resets}
              history={history}
              resetUrl={filters.resetUrl}
              loading={searchResultPageLoading}
              secondaryButtonText={intl.formatMessage(
                messages.searchContextClearAllText,
              )}
            />
          </Box>
        )}
        {
          showNoResults && (
            <div className={styles.noSearchResults}>
              <NoSearchResults
                search={searchGridTitle}
                artistName={searchParams.query}
                locale={locale}
                browser={browser}
                intl={intl}
                userInfo={userInfo}
                searchParams={searchParams}
                listManager={listManager}
                openLoginSignupModal={openLoginSignupModal}
                searchUUID={get(metadata, 'searchUUID')}
              />
            </div>
          )
        }
        <Box padding="xs">
          {
            searchResultPageLoading && hydrationFailed && <Loading />
          }
          {
            !searchResultPageLoading && hydrationFailed && (
              <HydrationErrorBanner
                formatMessage={intl.formatMessage}
                onRetry={() => retryHydration()}
              />
            )
          }
          {
            hasResults && (
              <React.Fragment>
                <VolumeDiscountBanner
                  results={results}
                  searchResultPageLoading={searchResultPageLoading}
                />
                {informationBanner}
                <SearchResultsGrid
                  singleColumnGrid={singleColumnGrid}
                  isArtworkPreview={isArtworkPreview}
                  results={results}
                  userInfo={userInfo}
                  intl={intl}
                  searchResultPageLoading={searchResultPageLoading}
                  listManager={listManager}
                  openLoginSignupModal={openLoginSignupModal}
                  largeBrowser={largeBrowser}
                  cardAttrOverrides={cardAttrOverrides}
                  accumulateImpression={accumulateImpression}
                  sendImpressions={sendImpressions}
                  impressionListName={impressionListName}
                  updateLastClickedProduct={updateLastClickedProduct}
                  lastClickedInventoryItem={lastClickedInventoryItem}
                  onNavigateToProductPage={onNavigateToProductPage}
                  interstitialSlot1={interstitialSlot1}
                  interstitialSlot2={interstitialSlot2}
                  interstitialSlot3={interstitialSlot3}
                  onProductTagsDisplayed={onProductTagsDisplayed}
                  logEvent={logEvent}
                  searchUUID={get(metadata, 'searchUUID')}
                  showArtworkPageLink={showArtworkPageLink}
                  searchType={searchType}
                  searchContextCategory={get(metadata, 'searchContext.category')}
                  filters={filters}
                  experience={get(searchParams, 'experience')}
                />
              </React.Fragment>
            )
          }
        </Box>
        {
          hasMultiplePages &&
          <Box padding="m">
            <div className={styles.pagination}>
              <div className={styles.paginationContent}>
                <Pagination {...pagination} intl={intl} />
              </div>
            </div>
          </Box>
        }
      </div>
    </Box>
  );
};

SearchResults.propTypes = {
  cookies: PropTypes.instanceOf(Cookies),
  browser: browserPropType,
  searchResultPageLoading: PropTypes.bool,
  pagination: searchResultsPaginationPropType.isRequired,
  metadata: searchResultsMetadataPropType,
  filters: searchResultsFiltersPropType.isRequired,
  intl: intlShape.isRequired,
  history: historyPropType.isRequired,
  results: searchResultsPropType.isRequired,
  userInfo: userInfoPropType.isRequired,
  listManager: listManagerShape.isRequired,
  artistCollections: artistCollectionsPropType,
  openLoginSignupModal: PropTypes.func,
  cardAttrOverrides: PropTypes.shape({
    title: PropTypes.func,
    caption: PropTypes.func,
  }),
  accumulateImpression: PropTypes.func,
  sendImpressions: PropTypes.func,
  impressionListName: PropTypes.string.isRequired,
  searchParams: PropTypes.shape({}),
  lastClickedInventoryItem: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    imageSrc: PropTypes.string,
  }),
  onNavigateToProductPage: PropTypes.func,
  updateLastClickedProduct: PropTypes.func,
  informationBanner: PropTypes.node,
  interstitialSlot1: PropTypes.node,
  interstitialSlot2: PropTypes.node,
  interstitialSlot3: PropTypes.node,
  onProductTagsDisplayed: PropTypes.func,
  hydrationFailed: PropTypes.bool,
  retryHydration: PropTypes.func,
  showArtworkPageLink: PropTypes.bool,
};

SearchResults.defaultProps = {
  cookies: new Cookies(),
  browser: {},
  searchResultPageLoading: false,
  metadata: {
    searchContext: {},
  },
  cardAttrOverrides: null,
  accumulateImpression: () => null,
  sendImpressions: () => null,
  openLoginSignupModal: null,
  artistCollections: artistCollectionsDefaultProps,
  searchParams: {},
  lastClickedInventoryItem: null,
  onNavigateToProductPage: () => null,
  updateLastClickedProduct: () => null,
  informationBanner: null,
  interstitialSlot1: null,
  interstitialSlot2: null,
  interstitialSlot3: null,
  onProductTagsDisplayed: () => null,
  hydrationFailed: false,
  retryHydration: () => window.location.reload(),
  showArtworkPageLink: false,
};

LargeFilters.propTypes = {
  filters: searchResultsFiltersPropType.isRequired,
  artistCollections: artistCollectionsPropType,
  intl: intlShape.isRequired,
};

LargeFilters.defaultProps = {
  artistCollections: artistCollectionsDefaultProps,
};

SmallFilters.propTypes = {
  filters: searchResultsFiltersPropType.isRequired,
  intl: intlShape.isRequired,
  searchResultPageLoading: PropTypes.bool,
  history: historyPropType.isRequired,
  category: PropTypes.string.isRequired,
  handleSearchGridToggleSelection: PropTypes.func.isRequired,
  handleSelectedPreviewType: PropTypes.func.isRequired,
  artistCollections: artistCollectionsPropType,
};

SmallFilters.defaultProps = {
  searchResultPageLoading: false,
  artistCollections: artistCollectionsDefaultProps,
};


export default SearchResults;
