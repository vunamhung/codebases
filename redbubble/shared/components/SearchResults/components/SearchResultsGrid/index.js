import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import cnames from 'classnames';
import styles from './styles.css';
import { searchResultsPropType } from '../../../../containers/apollo/withSearchResults';
import { userInfoPropType } from '../../../../containers/apollo/withUserInfo';
import { listManagerShape } from '../../../../components/Lists';
import SearchResultsGridCard from '../ProductCard';
import SimilarProductsCarousel from '../SimilarProductsCarousel';
import LoadingProductCard from '../LoadingProductCard';

// Note: Row count starts from 0
const INTERSTITIAL_1_ROW = 2;
const INTERSTITIAL_2_ROW = 5;
const INTERSTITIAL_3_ROW = 14;

const getInterstitialIndex = (row, col) => ((row * col) - 1);

const useGridColumns = (gridRef) => {
  const [numberOfColumns, setNumberOfColumns] = useState(2);
  const [showInterstitials, setShowInterstitials] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      const firstChild = get(gridRef, 'current.children[0]');
      if (firstChild) {
        const columns = gridRef.current.offsetWidth / firstChild.offsetWidth;
        setNumberOfColumns(Math.round(columns));
      }
      setShowInterstitials(true);
    };

    const debouncedHandleResize = debounce(handleResize, 500);
    handleResize();

    window.addEventListener('resize', debouncedHandleResize);
    return () => window.removeEventListener('resize', debouncedHandleResize);
  }, []);

  return { numberOfColumns, showInterstitials };
};

const MemoizedSearchResultsGridCard = React.memo(SearchResultsGridCard);
const SearchResultsGrid = ({
  singleColumnGrid,
  isArtworkPreview,
  results,
  userInfo,
  intl,
  accumulateImpression,
  sendImpressions,
  impressionListName,
  searchResultPageLoading,
  listManager,
  openLoginSignupModal,
  largeBrowser,
  cardAttrOverrides,
  updateLastClickedProduct,
  lastClickedInventoryItem,
  onNavigateToProductPage,
  interstitialSlot1,
  interstitialSlot2,
  interstitialSlot3,
  onProductTagsDisplayed,
  searchUUID,
  showArtworkPageLink,
  searchType,
}) => {
  const locale = get(userInfo, 'locale', null);
  const showMatureContent = get(userInfo, 'showMatureContent', false);
  const isLoggedIn = get(userInfo, 'isLoggedIn');
  const shippingCountry = get(userInfo, 'country');
  const currency = get(userInfo, 'currency');

  const filteredInventoryItems = results.filter(item => item.inventoryItem);

  const gridStyle = cnames(styles.grid, {
    [styles.singleColumnGrid]: singleColumnGrid,
  });

  const gridRef = React.useRef(null);
  const { numberOfColumns } = useGridColumns(gridRef);

  const showInterstitialSlot1 = interstitialSlot1 &&
    !searchResultPageLoading &&
    filteredInventoryItems.length > INTERSTITIAL_1_ROW * numberOfColumns;

  const showInterstitialSlot2 = interstitialSlot2 &&
    !searchResultPageLoading &&
    filteredInventoryItems.length > INTERSTITIAL_2_ROW * numberOfColumns;

  const showInterstitialSlot3 = interstitialSlot3 &&
    !searchResultPageLoading &&
    filteredInventoryItems.length > INTERSTITIAL_3_ROW * numberOfColumns;

  const interstitialClasses = cnames(styles.interstitial, {
    [styles.singleColumnInterstitial]: singleColumnGrid,
  });

  useEffect(() => {
    return () => {
      sendImpressions();
    };
  }, [results, sendImpressions]);

  return (
    <div className={gridStyle} id="SearchResultsGrid" ref={gridRef}>
      {
        filteredInventoryItems.map(({
          inventoryItem,
          work,
          defaultPreviewTypeId,
          rank,
        }, resultIndex) => {
          return searchResultPageLoading ? (
            <LoadingProductCard
              key={`loading-card-${inventoryItem.id}`}
              intl={intl}
            />
          ) : (
            <React.Fragment key={inventoryItem.id}>
              <MemoizedSearchResultsGridCard
                key={inventoryItem.id}
                isArtworkPreview={isArtworkPreview}
                inventoryItem={inventoryItem}
                work={work}
                defaultPreviewTypeId={defaultPreviewTypeId}
                rank={rank}
                resultIndex={resultIndex}
                intl={intl}
                listManager={listManager}
                openLoginSignupModal={openLoginSignupModal}
                largeBrowser={largeBrowser}
                cardAttrOverrides={cardAttrOverrides}
                locale={locale}
                showMatureContent={showMatureContent}
                isLoggedIn={isLoggedIn}
                accumulateImpression={accumulateImpression}
                impressionListName={impressionListName}
                updateLastClickedProduct={updateLastClickedProduct}
                lastClickedInventoryItem={lastClickedInventoryItem}
                onNavigateToProductPage={onNavigateToProductPage}
                onProductTagsDisplayed={onProductTagsDisplayed}
                shippingCountry={shippingCountry}
                currency={currency}
                showArtworkPageLink={showArtworkPageLink}
              />
              {
                lastClickedInventoryItem &&
                (inventoryItem.id === lastClickedInventoryItem.id) && (
                  <SimilarProductsCarousel
                    intl={intl}
                    listManager={listManager}
                    openLoginSignupModal={openLoginSignupModal}
                    originalInventoryItemId={lastClickedInventoryItem.id}
                    productTitle={lastClickedInventoryItem.title}
                    iconUrl={lastClickedInventoryItem.imageSrc}
                    searchUUID={searchUUID}
                    searchType={searchType}
                  />
                )
              }
              {
                showInterstitialSlot1 &&
                resultIndex === getInterstitialIndex(INTERSTITIAL_1_ROW, numberOfColumns) &&
                React.cloneElement(interstitialSlot1, {
                  classes: interstitialClasses,
                })
              }
              {
                showInterstitialSlot2 &&
                resultIndex === getInterstitialIndex(INTERSTITIAL_2_ROW, numberOfColumns) &&
                React.cloneElement(interstitialSlot2, {
                  classes: interstitialClasses,
                })
              }
              {
                showInterstitialSlot3 &&
                resultIndex === getInterstitialIndex(INTERSTITIAL_3_ROW, numberOfColumns) &&
                React.cloneElement(interstitialSlot3, {
                  classes: interstitialClasses,
                })
              }
            </React.Fragment>
          );
        })
      }
    </div>
  );
};

SearchResultsGrid.propTypes = {
  singleColumnGrid: PropTypes.bool.isRequired,
  isArtworkPreview: PropTypes.bool.isRequired,
  results: searchResultsPropType.isRequired,
  userInfo: userInfoPropType.isRequired,
  intl: intlShape.isRequired,
  accumulateImpression: PropTypes.func,
  sendImpressions: PropTypes.func,
  impressionListName: PropTypes.string.isRequired,
  searchResultPageLoading: PropTypes.bool.isRequired,
  listManager: listManagerShape.isRequired,
  openLoginSignupModal: PropTypes.func,
  largeBrowser: PropTypes.bool.isRequired,
  cardAttrOverrides: PropTypes.shape({
    title: PropTypes.func,
    caption: PropTypes.func,
  }),
  updateLastClickedProduct: PropTypes.func,
  lastClickedInventoryItem: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    imageSrc: PropTypes.string,
  }),
  onNavigateToProductPage: PropTypes.func,
  interstitialSlot1: PropTypes.node,
  interstitialSlot2: PropTypes.node,
  interstitialSlot3: PropTypes.node,
  onProductTagsDisplayed: PropTypes.func,
  searchUUID: PropTypes.string,
  showArtworkPageLink: PropTypes.bool,
  searchType: PropTypes.string,
};

SearchResultsGrid.defaultProps = {
  cardAttrOverrides: null,
  accumulateImpression: () => null,
  sendImpressions: () => null,
  openLoginSignupModal: null,
  updateLastClickedProduct: () => null,
  lastClickedInventoryItem: null,
  onNavigateToProductPage: () => null,
  interstitialSlot1: null,
  interstitialSlot2: null,
  interstitialSlot3: null,
  onProductTagsDisplayed: () => null,
  searchUUID: null,
  showArtworkPageLink: false,
  searchType: null,
};

export default SearchResultsGrid;
