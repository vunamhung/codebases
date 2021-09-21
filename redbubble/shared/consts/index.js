const SHOP_IMAGE_RATIO = 230 / 210;
const SHOP_IMAGE_CONTAINER_RATIO_PERCENT = Math.floor(SHOP_IMAGE_RATIO * 100);
const UNIT = 16;
const BREAK_POINTS = {
  small: 640,
  medium: 768,
  large: 960,
};

const ITEMS_PER_ROW = [
  {
    breakpoint: BREAK_POINTS.small,
    value: 2,
  },
  {
    breakpoint: BREAK_POINTS.large,
    value: 3,
  },
];

const MAX_ITEMS_PER_ROW = 4;

const WINDOW_SIZES = [
  {
    breakpoint: BREAK_POINTS.small,
    value: 'small',
  },
  {
    breakpoint: BREAK_POINTS.large,
    value: 'medium',
  },
];

const MAX_WINDOW_SIZE = 'large';

export const SEARCH_FILTER_SCROLL_ANIMATION_DURATION = 300;

export const AppConsts = {
  SHOP_IMAGE_RATIO,
  SHOP_IMAGE_CONTAINER_RATIO_PERCENT,
  UNIT,
  BREAK_POINTS,
  WINDOW_SIZES,
  MAX_WINDOW_SIZE,
  ITEMS_PER_ROW,
  MAX_ITEMS_PER_ROW,
};

export const SegmentPages = {
  LIST: 'List',
  WORK: 'Work',
  ORDERS: 'Orders',
  ARTIST_SHOP: 'Artist Shop',
  SEARCH_RESULTS: 'Search Results',
  ARTIST_EXPLORE: 'Artist Explore',
};
