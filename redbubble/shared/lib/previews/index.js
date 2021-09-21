import get from 'lodash/get';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
  primaryPreviewTitle: '{artworkName} {productName}',
  supplementaryPreviewTitle: 'Alternate view of {artworkName} {productName}',
  artworkPreviewTitle: '{artworkName} by {artistUsername}',
});

export const SUPPLEMENTARY = 'supplementary';
export const SUPPLEMENTARY_2 = 'supplementary2';
export const SUPPLEMENTARY_3 = 'supplementary3';
export const SUPPLEMENTARY_4 = 'supplementary4';
export const SUPPLEMENTARY_5 = 'supplementary5';
export const ARTWORK = 'artwork';
export const PRIMARY = 'primary';
export const PRIMARY_SQUARE = 'primary_square';
export const PRODUCT_CLOSE_PREVIEW = 'product_close';
export const DEFAULT_PREVIEW = 'default';
export const ALTERNATE_PRODUCT_CLOSE_PREVIEW = 'alternate_product_close';
export const ALTERNATE_SUPPLEMENTARY = 'alternate_supplementary';
export const ALTERNATE_PRIMARY = 'alternate_primary';

export const DEFAULT_SEARCH_RESULT_PREVIEW = PRODUCT_CLOSE_PREVIEW;
export const ALTERNATE_SEARCH_RESULT_PREVIEW = ALTERNATE_PRODUCT_CLOSE_PREVIEW;


const getPreviewTitle = (inventoryItem, message, intl) => {
  const productName = get(inventoryItem, 'description');
  const artworkName = get(inventoryItem, 'work.title');

  return intl.formatMessage(message, { artworkName, productName });
};

const getArtworkPreviewTitle = (inventoryItem, intl) => {
  const artworkName = get(inventoryItem, 'work.title');
  const artistUsername = get(inventoryItem, 'work.artist.username');

  return intl.formatMessage(messages.artworkPreviewTitle, { artworkName, artistUsername });
};

export const getPreviewTitleForTag = (tag, inventoryItem, intl) => {
  if (tag === 'primary') {
    return getPreviewTitle(inventoryItem, messages.primaryPreviewTitle, intl);
  }
  if (tag === 'supplementary') {
    return getPreviewTitle(inventoryItem, messages.supplementaryPreviewTitle, intl);
  }
  if (tag === 'artwork') {
    return getArtworkPreviewTitle(inventoryItem, intl);
  }

  return undefined;
};

// TODO tag is deprecated
export const getPreviewImage = (previews, tag) => {
  if (!Array.isArray(previews)) return null;
  const preview = previews.find(p => p.tag === tag);
  return get(preview, 'url', '');
};

export const getPreviewURL = (previews, previewTypeId) => {
  if (!Array.isArray(previews)) return null;

  const preview = previews.find(p => p.previewTypeId === previewTypeId);

  return get(preview, 'url', '');
};

export const SEARCH_RESULT_PREVIEWS =
  [DEFAULT_SEARCH_RESULT_PREVIEW, ALTERNATE_SEARCH_RESULT_PREVIEW, ARTWORK];
