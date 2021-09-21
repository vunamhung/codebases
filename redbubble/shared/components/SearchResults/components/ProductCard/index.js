import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { InView } from 'react-intersection-observer';
import { defineMessages, intlShape } from 'react-intl';
import get from 'lodash/get';
import MediaCard from '@redbubble/design-system/react/MediaCard';
import Box from '@redbubble/design-system/react/Box';
import Image from '@redbubble/design-system/react/Image';
import ChevronRightIcon from '@redbubble/design-system/react/Icons/ChevronRight';
import Text from '@redbubble/design-system/react/Text';
import { RATIO_SQUARE, SMALL } from '@redbubble/design-system/react/constants';
import { ARTWORK } from '../../../../lib/previews';
import { SEARCH_CATEGORY } from '../../../../lib/analytics';
import Heart from '../../../Lists/Heart';
import AddToCartButton, { EMBEDDED } from '../../../AddToCartButton';
import { nsfwImageByLocale } from '../../../../lib/nsfw';
import { listManagerShape } from '../../../Lists';
import styles from './styles.css';
import TagsOverlay from '../TagsOverlay';
import ProductPrice from '../../../ProductPrice';
import { localizedPath } from '../../../../lib/routing';

const MOBILE_IMAGES_TO_LOAD = 2;
const DESKTOP_IMAGES_TO_LOAD = 16;
const encodedImageShim = 'data:image/gif;base64,R0lGODdhFQAXAPAAANba3wAAACwAAAAAFQAXAAACFISPqcvtD6OctNqLs968+w+GolUAADs=';

const imagesToInitiallyLoad = (largeBrowser) => {
  return largeBrowser
    ? DESKTOP_IMAGES_TO_LOAD
    : MOBILE_IMAGES_TO_LOAD;
};

const messages = defineMessages({
  artistCaption: 'By {artist}',
  shopAllProducts: 'Shop all products',
});

const SearchResultsGridCard = ({
  isArtworkPreview,
  inventoryItem,
  work,
  defaultPreviewTypeId,
  rank,
  resultIndex,
  intl,
  accumulateImpression,
  impressionListName,
  listManager,
  openLoginSignupModal,
  largeBrowser,
  cardAttrOverrides,
  locale,
  showMatureContent,
  isLoggedIn,
  updateLastClickedProduct,
  onNavigateToProductPage,
  onProductTagsDisplayed,
  showArtworkPageLink,
  showTags,
}) => {
  // Image handling
  const shouldLoad = resultIndex < imagesToInitiallyLoad(largeBrowser);
  const showNsfwImage = work.isMatureContent && !showMatureContent;
  const getImageSrc = () => {
    const previews = get(inventoryItem, 'previewSet.previews', []);
    const previewTypeId = isArtworkPreview ? ARTWORK : defaultPreviewTypeId;
    const preview = previews.find(p => p.previewTypeId === previewTypeId);
    return preview && preview.url ? preview.url : null;
  };
  const imageSrc = showNsfwImage ?
    nsfwImageByLocale(locale) : getImageSrc();

  // Impression tracking
  const { id } = inventoryItem;
  const handleInView = useCallback((inView) => {
    if (inView) {
      accumulateImpression({
        key: id,
        impression: {
          id,
          list: impressionListName,
          position: rank,
        },
      });
    }
  }, [
    accumulateImpression,
    id,
    impressionListName,
    rank,
  ]);

  const title = `${work.title} ${inventoryItem.description}`;

  const artistName = work.artistName ? work.artistName : work.artist.username;

  // Card attribute overrides
  const caption = get(cardAttrOverrides, 'caption') ?
    cardAttrOverrides.caption(inventoryItem) :
    intl.formatMessage(messages.artistCaption, { artist: artistName });

  const pageUrl = get(cardAttrOverrides, 'params') ?
    `${inventoryItem.productPageUrl}?${get(cardAttrOverrides, 'params')}` :
    inventoryItem.productPageUrl;

  const { tags } = work;
  const showQuickAddToCart = get(inventoryItem, 'experiencesProductCard', []).find(({ value }) => value === 'quickAddToCart');

  return (
    <MediaCard
      transparent
      href={pageUrl}
      title={title}
      caption={caption}
      onMouseDown={(e) => {
        onNavigateToProductPage(
          { pageUrl, rank, inventoryItemId: inventoryItem.id },
        );
        updateLastClickedProduct(e, { id, title, imageSrc });
      }}
      imageRender={
      ({ imageProps }) => (
        <InView as="div" onChange={handleInView} className={styles.imageDiv} triggerOnce>
          {showTags && Array.isArray(tags) && <TagsOverlay
            inventoryItemId={id}
            rank={rank}
            tags={tags}
            onProductTagsDisplayed={onProductTagsDisplayed}
          />}
          <Image
            {...imageProps}
            className={styles.productImage}
            src={imageSrc}
            ratio={RATIO_SQUARE}
            alt={title}
            loadOnVisible={shouldLoad ? false : { placeholder: encodedImageShim }}
          />
        </InView>
      )}
      primaryActionSlot={(
        <Heart
          item={{
            entityType: 'INVENTORY_ITEM',
            entityId: inventoryItem.id,
            preview: imageSrc,
          }}
          isLoggedIn={isLoggedIn}
          locale={locale}
          listManager={listManager}
          openLoginSignupModal={openLoginSignupModal}
        />
      )}
    >
      <Box className={styles.container}>
        <ProductPrice inventoryItem={inventoryItem} />
        {
          showQuickAddToCart && <AddToCartButton
            inventoryItem={inventoryItem}
            work={work}
            gaMetadata={{
              productCode: inventoryItem.gaCode,
              eventCategory: SEARCH_CATEGORY,
              ecommerceCategory: inventoryItem.gaCode,
            }}
            variant={EMBEDDED}
          />
        }
      </Box>
      {showArtworkPageLink && (
        <Box
          display="inline-flex"
          alignItems="center"
          onClick={(e) => { e.preventDefault(); window.location = localizedPath(locale, `/shop/ap/${work.id}`); }}
          className={styles.externalLink}
        >
          <Text type="caption" muted>
            {intl.formatMessage(messages.shopAllProducts)}
          </Text>
          <Text type="caption" muted>
            <ChevronRightIcon size={SMALL} />
          </Text>
        </Box>
      )}
    </MediaCard>
  );
};

SearchResultsGridCard.propTypes = {
  isArtworkPreview: PropTypes.bool.isRequired,
  inventoryItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired,
    }),
    productTypeId: PropTypes.string,
    productPageUrl: PropTypes.string.isRequired,
    gaCode: PropTypes.string,
    gaCategory: PropTypes.string,
  }),
  work: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    isMatureContent: PropTypes.bool,
    artistName: PropTypes.string,
  }),
  defaultPreviewTypeId: PropTypes.string.isRequired,
  rank: PropTypes.number.isRequired,
  resultIndex: PropTypes.number.isRequired,
  intl: intlShape.isRequired,
  accumulateImpression: PropTypes.func,
  impressionListName: PropTypes.string.isRequired,
  listManager: listManagerShape.isRequired,
  openLoginSignupModal: PropTypes.func,
  largeBrowser: PropTypes.bool.isRequired,
  cardAttrOverrides: PropTypes.shape({
    caption: PropTypes.func,
    params: PropTypes.string,
  }),
  locale: PropTypes.string.isRequired,
  showMatureContent: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  updateLastClickedProduct: PropTypes.func,
  onNavigateToProductPage: PropTypes.func,
  onProductTagsDisplayed: PropTypes.func,
  showArtworkPageLink: PropTypes.bool,
  showTags: PropTypes.bool,
};

SearchResultsGridCard.defaultProps = {
  inventoryItem: {},
  work: {},
  accumulateImpression: () => {},
  showMatureContent: false,
  isLoggedIn: false,
  updateLastClickedProduct: () => null,
  onNavigateToProductPage: () => null,
  cardAttrOverrides: null,
  openLoginSignupModal: null,
  onProductTagsDisplayed: () => null,
  showArtworkPageLink: false,
  showTags: true,
};

export default SearchResultsGridCard;
