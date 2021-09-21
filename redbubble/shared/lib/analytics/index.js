const LIST_CATEGORY = 'Lists';
export const WORK_PAGE_CATEGORY = 'Work Page';
export const ARTIST_WORK_PAGE_CATEGORY = 'Artist Work Page';
export const LIST_PAGE_CATEGORY = 'List Page';
export const PRODUCT_PAGE_CATEGORY = 'Product Page';
const ARTIST_SHOP_CATEGORY = 'Artist Shop Page';
const ARTIST_EXPLORE__DESIGNS_CATEGORY = 'Artist Explore Designs Page';
const IMPRESSION_CATEGORY = 'Impressions';
const FEATURED_COLLECTION_CATEGORY = 'Featured Collection';
const SOCIAL_CATEGORY = 'Social';
const SIZE_GUIDE_OPENED = 'size-guide-opened';
const REVIEWS_SUMMARY_CLICKED = 'review-summary-clicked';
const REVIEWS_VIEW_ALL_CLICKED = 'review-view-all-clicked';
export const SEARCH_CATEGORY = 'Search';
export const SEARCH_NO_RESULTS_CATEGORY = 'No Search Results Page';
export const CONFIGURED_LANDING_PAGE_CATEGORY = 'landing-page';
const SUBSCRIBE_BANNER = 'subscribe-banner';
const SUBSCRIBE_SHOWED = 'subscribe-showed';
const SUBSCRIBE_FAILED = 'subscribe-failed';
const SUBSCRIBE_SUCCEED = 'subscribe-succeed';
const SUBSCRIBE_DISMISSED = 'subscribe-dismissed';
export const TRENDING_CAROUSEL = 'trending-carousel';
export const TRENDING_CAROUSEL_SHOWED = 'trending-carousel-showed';
export const ADD_TO_CART_ACTION = 'product-add-to-cart';
export const PRODUCT_VIEW_ACTION = 'product-view';
export const PRODUCT_CONFIGURATOR_CATEGORY = 'Product Configurator';
const PRODUCT_CONFIGURATOR_VIEW_ACTION = 'product-configurator-view';
const PRODUCT_CONFIGURATOR_SIZE_GUIDE_CLICKED = 'size-guide-clicked';
const PRODUCT_CONFIGURATOR_CHANGE_CLICKED = 'change-clicked';
const PRODUCT_CONFIGURATOR_PREVIEW_CLICKED = 'preview-clicked';
const PRODUCT_CONFIGURATOR_SIZE_CHANGED = 'size-changed';
const PRODUCT_CONFIGURATOR_ADD_TO_CART_BLOCKED = 'add-to-cart-blocked';
const RECOMMEND_CAROUSEL_RESULTS_SHOWED = 'results-showed';
const RECOMMEND_CAROUSEL_NO_RESULTS_SHOWED = 'no-results-showed';
const RECOMMEND_CAROUSEL_INITIAL_RESULTS_FETCH_ERRORED = 'initial-results-fetch-errored';
const RECOMMEND_CAROUSEL_FURTHER_RESULTS_FETCH_ERRORED = 'further-results-fetch-errored';
const RECOMMEND_CAROUSEL_ITEM_CLICKED = 'item-clicked';
const CLICK_ON_PRODUCT_ACTION = 'product-clicked';
const CLICK_ON_DESIGN_ACTION = 'design-clicked';
const PRODUCT_TAGS_DISPLAYED = 'product-tags-displayed';
const CAROUSEL_LEFT_NAVIGATED = 'left-navigated';
const CAROUSEL_RIGHT_NAVIGATED = 'right-navigated';
const CAROUSEL_END_REACHED = 'end-reached';
const CAROUSEL_CHANGED = 'carousel-changed';
const HERO_BANNER_SCROLL_BUTTON = 'hero-banner-scroll-button-click';
const RECOMMEND_CAROUSEL_FURTHER_RESULTS_FETCH_SUCCEEDED = 'further-results-fetch-succeded';
const PRODUCT_PAGE_COMPONENT_SHOWED = 'component-showed';
const PREVIEW_CLICKED = 'preview-clicked';
const PRODUCT_CONFIG_CHANGED = 'product-config-changed';
const COLOR_PICKER_PICKED = 'color-picker-picked';
const DESCRIPTION_CLICKED = 'description-clicked';
const AVAILABLE_PRODUCTS_OPENED = 'available-products-opened';
const FOLLOW_ACTION = 'Add';
const UNFOLLOW_ACTION = 'Remove';
const CONFIGURED_LANDING_PAGE_TOPIC_TOGGLED_ACTION = 'topic-toggled';
const SEARCH_MOBILE_FILTER_OPEN = 'Open';
const SRP_LINK_CLICKED = 'Click';
const VALUE_PROP_CAROUSEL_SWIPED = 'value-prop-carousel:swiped';
const VALUE_PROP_CAROUSEL_CLICKED = 'value-prop-carousel:clicked';
const SIGNUP_CATEGORY = 'Signup';
const LOGIN_CATEGORY = 'Login';
const PREVIEW_SWIPED = 'preview-swiped';
const TAG_CLICKED = 'tag-clicked';
const YOTPO_WIDGET_INTERACTION = 'yotpo-reviews';
const LIST_SHARED = 'list-shared';
const ADD_ALL_TO_CART = 'add-all-to-cart';
const COMPONENT_SHOWED = 'component-showed';
const COMPONENT_SHOWED_LOADING = 'component-showed-loading';
const TOAST_VIEW_CART_CLICKED = 'atc-toast:view-cart';
const TOAST_VIEW_PRODUCT_CLICKED = 'atc-toast:view-product';
export const TOPIC_CAROUSEL_SHOWED = 'topic-carousel-showed';
export const TOPIC_CAROUSEL_CLICKED = 'topic-carousel-clicked';
export const BUBBLE_CAROUSEL_CLICKED = 'bubble-carousel-clicked';
const DELIVERY_INFO_SRP_DISPLAYED = 'delvery-info-srp-displayed';

const SEARCH_GRID_COMPONENT = 'search-grid';
const EXPLORE_DESIGNS_GRID_COMPONENT = 'explore-designs-grid';

const productCodeLabel = productCode => `product:${productCode}`;

const SEARCH_UUID_DIMENSION = 'dimension16';
const DESTINATION_DIMENSION = 'dimension29';
const COMPONENT_NAME_DIMENSION = 'dimension30';
const SOURCE_ID_DIMENSION = 'dimension32';

const GIFT_LANDING_PAGE_CATEGORY = 'Gift Landing Page';
const GIFT_LANDING_PAGE_OPEN_MESSAGE = 'opened-message';
const GIFT_LANDING_PAGE_CLOSE_MESSAGE = 'close-message';
const GIFT_LANDING_PAGE_EDIT_ADDRESS = 'edit-address';
const GIFT_LANDING_PAGE_CLICKED_TRACKING = 'clicked-tracking';
const GIFT_LANDING_PAGE_TRACKING_INFO_AVAILABLE = 'tracking-info-available';

export const SIMILAR_PRODUCTS_COMPONENT = 'similar-products';
export const ARTIST_DETAILS_COMPONENT = 'artist-details';
export const SIMILAR_DESIGNS_COMPONENT = 'similar-designs';
export const LICENSED_PRODUCT_RECOMMENDATIONS_COMPONENT = 'licensed-works';
export const STYLE_BROWSER_COMPONENT = 'style-browser';
export const AVAILABLE_PRODUCTS_COMPONENT = 'available_products';
export const DELIVERY_INFORMATION_CARD = 'delivery_information_card';

const ORDER_MODIFICATION_CATEGORY = 'OrderModification';
const ORDER_MODIFICATION_CANCEL_ORDER_ABORTED = 'cancelOrderAborted';
const ORDER_MODIFICATION_CANCEL_ORDER_VIEW_SUMMARY = 'cancelOrderViewOrderSummary';

const QUICK_CART_CATEGORY = 'QuickCart';
const QUICK_CART_ITEM_REMOVED = 'itemRemoved';
const QUICK_CART_QUANTITY_UPDATED = 'quantityUpdated';

const BNPL_CATEGORY = 'BNPLv2';
const BNPL_MESSAGE_IN_VIEW = 'MessageInView';

export const analyticsPayload = {
  artistShopLinkClicked: destinationUrl => ({
    category: PRODUCT_PAGE_CATEGORY,
    action: 'artist-shop-link-clicked',
    [DESTINATION_DIMENSION]: destinationUrl,
  }),
  artistShopShareClicked: () => ({
    category: ARTIST_SHOP_CATEGORY,
    action: 'share-button-clicked',
  }),
  artistShopPrivateMessage: () => ({
    category: ARTIST_SHOP_CATEGORY,
    action: 'message-button-clicked',
  }),
  artistWorkShareClicked: () => ({
    category: ARTIST_WORK_PAGE_CATEGORY,
    action: 'share-button-clicked',
  }),
  artistWorkAddComment: eventLabel => ({
    category: ARTIST_WORK_PAGE_CATEGORY,
    action: 'add-comment',
    label: eventLabel,
  }),
  artistWorkClickBackToExplore: (workId, destinationUrl) => ({
    category: ARTIST_WORK_PAGE_CATEGORY,
    action: 'back-to-explore-clicked',
    [DESTINATION_DIMENSION]: destinationUrl,
    label: workId,
  }),
  artistWorkReplyToComment: eventLabel => ({
    category: ARTIST_WORK_PAGE_CATEGORY,
    action: 'reply-comment',
    label: eventLabel,
  }),
  previewClicked: gaCode => ({
    category: WORK_PAGE_CATEGORY,
    action: PREVIEW_CLICKED,
    label: productCodeLabel(gaCode),
  }),
  availableProductsOpened: gaCode => ({
    category: WORK_PAGE_CATEGORY,
    action: AVAILABLE_PRODUCTS_OPENED,
    label: productCodeLabel(gaCode),
  }),
  productConfigChanged: (gaCode, eventCategory = WORK_PAGE_CATEGORY) => ({
    category: eventCategory,
    action: PRODUCT_CONFIG_CHANGED,
    label: productCodeLabel(gaCode),
  }),
  colorPickerPicked: gaCode => ({
    category: WORK_PAGE_CATEGORY,
    action: COLOR_PICKER_PICKED,
    label: productCodeLabel(gaCode),
  }),
  descriptionClicked: gaCode => ({
    category: WORK_PAGE_CATEGORY,
    action: DESCRIPTION_CLICKED,
    label: productCodeLabel(gaCode),
  }),
  toastViewCartClicked: inventoryItemId => ({
    category: SEARCH_CATEGORY,
    action: TOAST_VIEW_CART_CLICKED,
    label: inventoryItemId,
  }),
  toastProductClicked: inventoryItemId => ({
    category: SEARCH_CATEGORY,
    action: TOAST_VIEW_PRODUCT_CLICKED,
    label: inventoryItemId,
  }),
  addToCart: (gaCode, buttonType, eventCategory) => ({
    category: eventCategory,
    action: ADD_TO_CART_ACTION,
    label: productCodeLabel(gaCode),
    value: buttonType,
  }),
  openSizeGuide: gaCode => ({
    category: WORK_PAGE_CATEGORY,
    action: SIZE_GUIDE_OPENED,
    label: productCodeLabel(gaCode),
  }),
  reviewsSummaryClicked: inventoryItemId => ({
    category: WORK_PAGE_CATEGORY,
    action: REVIEWS_SUMMARY_CLICKED,
    label: inventoryItemId,
  }),
  reviewsViewAllClicked: inventoryItemId => ({
    category: WORK_PAGE_CATEGORY,
    action: REVIEWS_VIEW_ALL_CLICKED,
    label: inventoryItemId,
  }),
  addItemToDefaultList: label => ({
    category: LIST_CATEGORY,
    action: 'add-item-to-default-list',
    label,
  }),
  addItemToList: label => ({
    category: LIST_CATEGORY,
    action: 'add-item-to-list',
    label,
  }),
  removeItemFromList: label => ({
    category: LIST_CATEGORY,
    action: 'remove-item-from-list',
    label,
  }),
  openListPicker: () => ({
    category: LIST_CATEGORY,
    action: 'view-list-picker',
  }),
  createList: label => ({
    category: LIST_CATEGORY,
    action: 'create-list',
    label,
  }),
  updateList: label => ({
    category: LIST_CATEGORY,
    action: 'update-list',
    label,
  }),
  deleteList: () => ({
    category: LIST_CATEGORY,
    action: 'delete-list',
  }),
  listsComponentShowed: (componentName, loading) => ({
    category: LIST_CATEGORY,
    action: loading ? COMPONENT_SHOWED_LOADING : COMPONENT_SHOWED,
    label: componentName,
    nonInteraction: true,
  }),
  impression: (list, id, position) => ({
    id,
    list,
    position,
  }),
  impressions: () => ({
    category: IMPRESSION_CATEGORY,
    action: 'Load',
    label: 'shop',
    nonInteraction: true,
  }),
  signup: (action, label) => ({
    category: SIGNUP_CATEGORY,
    action,
    label,
  }),
  login: (action, label) => ({
    category: LOGIN_CATEGORY,
    action,
    label,
  }),
  follow: newState => ({
    category: SOCIAL_CATEGORY,
    action: newState === true ? FOLLOW_ACTION : UNFOLLOW_ACTION,
    label: 'Follow',
  }),
  yotpoWidget: (gaCode, eventType) => ({
    category: WORK_PAGE_CATEGORY,
    action: `${YOTPO_WIDGET_INTERACTION}:${eventType}`,
    label: productCodeLabel(gaCode),
  }),
  productView: (gaCode, eventValue, eventCategory) => ({
    category: eventCategory,
    action: PRODUCT_VIEW_ACTION,
    label: productCodeLabel(gaCode),
    value: eventValue,
    nonInteraction: true,
  }),
  enhancedEcommerceProduct: (
    inventoryItemId,
    work,
    gaCode,
    gaCategory,
    priceAmount,
    quantity,
    actionType,
    currencyCode,
  ) => ({
    id: inventoryItemId,
    name: work ? `${work.id} ${work.title}` : '',
    category: gaCategory,
    price: priceAmount,
    currencyCode,
    quantity,
    action: actionType,
  }),
  productConfiguratorView: (gaCode, priceAmount) => ({
    category: PRODUCT_CONFIGURATOR_CATEGORY,
    action: PRODUCT_CONFIGURATOR_VIEW_ACTION,
    value: Math.round(priceAmount * 100),
    label: productCodeLabel(gaCode),
  }),
  productConfiguratorSizeGuideClicked: gaCode => ({
    category: PRODUCT_CONFIGURATOR_CATEGORY,
    action: PRODUCT_CONFIGURATOR_SIZE_GUIDE_CLICKED,
    label: productCodeLabel(gaCode),
  }),
  productConfiguratorChangeClicked: gaCode => ({
    category: PRODUCT_CONFIGURATOR_CATEGORY,
    action: PRODUCT_CONFIGURATOR_CHANGE_CLICKED,
    label: productCodeLabel(gaCode),
  }),
  productConfiguratorPreviewClicked: gaCode => ({
    category: PRODUCT_CONFIGURATOR_CATEGORY,
    action: PRODUCT_CONFIGURATOR_PREVIEW_CLICKED,
    label: productCodeLabel(gaCode),
  }),
  productConfiguratorAddToCartBlocked: gaCode => ({
    category: PRODUCT_CONFIGURATOR_CATEGORY,
    action: PRODUCT_CONFIGURATOR_ADD_TO_CART_BLOCKED,
    label: productCodeLabel(gaCode),
  }),
  productConfiguratorSizeChanged: gaCode => ({
    category: PRODUCT_CONFIGURATOR_CATEGORY,
    action: PRODUCT_CONFIGURATOR_SIZE_CHANGED,
    label: productCodeLabel(gaCode),
  }),
  subscribeFailed: location => ({
    category: location,
    action: SUBSCRIBE_FAILED,
    label: SUBSCRIBE_BANNER,
  }),
  subscribeSucceed: location => ({
    category: location,
    action: SUBSCRIBE_SUCCEED,
    label: SUBSCRIBE_BANNER,
  }),
  subscribeDismissed: location => ({
    category: location,
    action: SUBSCRIBE_DISMISSED,
    label: SUBSCRIBE_BANNER,
  }),
  subscribeShowed: location => ({
    category: location,
    action: SUBSCRIBE_SHOWED,
    label: SUBSCRIBE_BANNER,
    nonInteraction: true,
  }),
  recommendCarouselResultsShowed: originalInventoryItemId => ({
    category: SEARCH_CATEGORY,
    action: RECOMMEND_CAROUSEL_RESULTS_SHOWED,
    label: 'Recommend carousel',
    nonInteraction: true,
    [SOURCE_ID_DIMENSION]: originalInventoryItemId,
  }),
  searchPageComponentShowed: (action, label) => ({
    category: SEARCH_CATEGORY,
    nonInteraction: true,
    action,
    label,
  }),
  linkCarouselClicked: ({ action, label, destination }) => ({
    category: SEARCH_CATEGORY,
    action,
    label,
    transport: 'beacon',
    [DESTINATION_DIMENSION]: destination,
  }),
  topicCarouselClicked: (originalTopic, clickedTopic, position) => ({
    category: SEARCH_CATEGORY,
    action: TOPIC_CAROUSEL_CLICKED,
    label: `${originalTopic}|${clickedTopic}|${position}`,
    transport: 'beacon',
  }),
  recommendCarouselNoResultsShowed: () => ({
    category: SEARCH_CATEGORY,
    action: RECOMMEND_CAROUSEL_NO_RESULTS_SHOWED,
    label: 'Recommend carousel',
    nonInteraction: true,
  }),
  recommendCarouselEndReached: () => ({
    category: SEARCH_CATEGORY,
    action: CAROUSEL_END_REACHED,
    label: 'Recommend carousel',
  }),
  recommendCarouselInitialResultsFetchErrored: () => ({
    category: SEARCH_CATEGORY,
    action: RECOMMEND_CAROUSEL_INITIAL_RESULTS_FETCH_ERRORED,
    label: 'Recommend carousel',
    nonInteraction: true,
  }),
  recommendCarouselFurtherResultsFetchErrored: () => ({
    category: SEARCH_CATEGORY,
    action: RECOMMEND_CAROUSEL_FURTHER_RESULTS_FETCH_ERRORED,
    label: 'Recommend carousel',
    nonInteraction: true,
  }),
  recommendCarouselItemClicked: () => ({
    category: SEARCH_CATEGORY,
    action: RECOMMEND_CAROUSEL_ITEM_CLICKED,
    label: 'Recommend carousel',
  }),
  recommendCarouselLeftNavigated: () => ({
    category: SEARCH_CATEGORY,
    action: CAROUSEL_LEFT_NAVIGATED,
    label: 'Recommend carousel',
  }),
  recommendCarouselRightNavigated: () => ({
    category: SEARCH_CATEGORY,
    action: CAROUSEL_RIGHT_NAVIGATED,
    label: 'Recommend carousel',
  }),
  recommendCarouselFurtherResultsFetchSucceded: () => ({
    category: SEARCH_CATEGORY,
    action: RECOMMEND_CAROUSEL_FURTHER_RESULTS_FETCH_SUCCEEDED,
    label: 'Recommend carousel',
    nonInteraction: true,
  }),
  changeSearchTab: (category, newTopicName) => ({
    category,
    action: CONFIGURED_LANDING_PAGE_TOPIC_TOGGLED_ACTION,
    label: newTopicName,
  }),
  carouselChanged: (category, carouselName) => ({
    category,
    action: CAROUSEL_CHANGED,
    label: carouselName,
  }),
  carouselNavigatedEnd: (category, carouselName) => ({
    category,
    action: CAROUSEL_END_REACHED,
    label: carouselName,
  }),
  heroBannerScrollButtonClick: (category, bannerName) => ({
    category,
    action: HERO_BANNER_SCROLL_BUTTON,
    label: bannerName,
  }),
  searchMobileFilterOpen: () => ({
    category: SEARCH_CATEGORY,
    action: SEARCH_MOBILE_FILTER_OPEN,
    label: 'Search mobile filter',
  }),
  productPageComponentShowed: componentName => ({
    category: WORK_PAGE_CATEGORY,
    action: PRODUCT_PAGE_COMPONENT_SHOWED,
    label: componentName,
    nonInteraction: true,
  }),
  previewSwiped: gaCode => ({
    category: WORK_PAGE_CATEGORY,
    action: PREVIEW_SWIPED,
    label: productCodeLabel(gaCode),
  }),
  tagClicked: gaCode => ({
    category: WORK_PAGE_CATEGORY,
    action: TAG_CLICKED,
    label: productCodeLabel(gaCode),
  }),
  listShared: listName => ({
    category: LIST_PAGE_CATEGORY,
    action: LIST_SHARED,
    label: listName,
  }),
  addAllTocart: ({ category, label }) => ({
    category,
    action: ADD_ALL_TO_CART,
    label,
  }),
  valuePropCarouselClicked: gaCode => ({
    category: WORK_PAGE_CATEGORY,
    action: VALUE_PROP_CAROUSEL_CLICKED,
    label: productCodeLabel(gaCode),
  }),
  valuePropCarouselSwiped: () => ({
    category: WORK_PAGE_CATEGORY,
    action: VALUE_PROP_CAROUSEL_SWIPED,
  }),
  clickOnProductEvent: (
    { category, componentName },
    { inventoryItemId, searchUUID, url, position },
  ) => ({
    category,
    action: CLICK_ON_PRODUCT_ACTION,
    label: inventoryItemId,
    value: position,
    transport: 'beacon',
    [SEARCH_UUID_DIMENSION]: searchUUID,
    [DESTINATION_DIMENSION]: url,
    [COMPONENT_NAME_DIMENSION]: componentName,
  }),
  productTagsDisplayed: ({ inventoryItemId, position }) => ({
    category: SEARCH_CATEGORY,
    action: PRODUCT_TAGS_DISPLAYED,
    label: inventoryItemId,
    value: position,
    transport: 'beacon',
  }),
  featuredCollectionProductTagsDisplayed: ({
    inventoryItemId,
    position,
  }) => ({
    category: FEATURED_COLLECTION_CATEGORY,
    action: PRODUCT_TAGS_DISPLAYED,
    label: inventoryItemId,
    value: position,
    transport: 'beacon',
  }),
  SRPGridClickOnProductEvent: ({
    url,
    inventoryItemId,
    searchUUID,
    position,
  }) => ({
    category: SEARCH_CATEGORY,
    action: CLICK_ON_PRODUCT_ACTION,
    label: inventoryItemId,
    value: position,
    transport: 'beacon',
    [SEARCH_UUID_DIMENSION]: searchUUID,
    [DESTINATION_DIMENSION]: url,
    [COMPONENT_NAME_DIMENSION]: SEARCH_GRID_COMPONENT,
  }),
  artistShopGridClickOnProductEvent: ({
    url,
    inventoryItemId,
    position,
  }) => ({
    category: ARTIST_SHOP_CATEGORY,
    action: CLICK_ON_PRODUCT_ACTION,
    label: inventoryItemId,
    value: position,
    transport: 'beacon',
    [DESTINATION_DIMENSION]: url,
    [COMPONENT_NAME_DIMENSION]: SEARCH_GRID_COMPONENT,
  }),
  featuredCollectionClickOnProductEvent: ({
    inventoryItemId,
    position,
  }) => ({
    category: FEATURED_COLLECTION_CATEGORY,
    action: CLICK_ON_PRODUCT_ACTION,
    label: inventoryItemId,
    value: position,
    transport: 'beacon',
  }),
  SrpRecommendCarouselProductClicked: ({
    pageUrl,
    inventoryItemId,
    searchUUID,
    rank,
    originalInventoryItemId,
  }) => ({
    category: SEARCH_CATEGORY,
    action: CLICK_ON_PRODUCT_ACTION,
    label: inventoryItemId,
    value: rank,
    transport: 'beacon',
    [SEARCH_UUID_DIMENSION]: searchUUID,
    [DESTINATION_DIMENSION]: pageUrl,
    [COMPONENT_NAME_DIMENSION]: 'recommend-carousel',
    [SOURCE_ID_DIMENSION]: originalInventoryItemId,
  }),
  SrpTrendingCarouselProductClicked: ({
    pageUrl,
    inventoryItemId,
    searchUUID,
    rank,
  }) => ({
    category: SEARCH_CATEGORY,
    action: CLICK_ON_PRODUCT_ACTION,
    label: inventoryItemId,
    value: rank,
    transport: 'beacon',
    [SEARCH_UUID_DIMENSION]: searchUUID,
    [DESTINATION_DIMENSION]: pageUrl,
    [COMPONENT_NAME_DIMENSION]: 'trending-carousel',
  }),
  SrpNoResultsProductClickedEvent: ({
    pageUrl,
    inventoryItemId,
    searchUUID,
    rank,
  }) => ({
    category: SEARCH_NO_RESULTS_CATEGORY,
    action: CLICK_ON_PRODUCT_ACTION,
    label: inventoryItemId,
    value: rank,
    transport: 'beacon',
    [SEARCH_UUID_DIMENSION]: searchUUID,
    [DESTINATION_DIMENSION]: pageUrl,
    [COMPONENT_NAME_DIMENSION]: 'recommend-carousel',
  }),
  SRPLinkClicked: (itemUrl, ref) => {
    return {
      category: SEARCH_CATEGORY,
      action: SRP_LINK_CLICKED,
      label: ref,
      transport: 'beacon',
      [DESTINATION_DIMENSION]: itemUrl,
    };
  },
  SRPRetry: inventoryItemCount => ({
    category: SEARCH_CATEGORY,
    action: 'search-result-page-retry',
    label: inventoryItemCount,
  }),
  artistExploreDesignsGridClickOnDesignEvent: ({
    url,
    workId,
  }) => ({
    category: ARTIST_EXPLORE__DESIGNS_CATEGORY,
    action: CLICK_ON_DESIGN_ACTION,
    label: workId,
    transport: 'beacon',
    [DESTINATION_DIMENSION]: url,
    [COMPONENT_NAME_DIMENSION]: EXPLORE_DESIGNS_GRID_COMPONENT,
  }),
  deliveryInfoSrpDisplayed: ({ countryCode, productTypeId, bucket }) => ({
    category: SEARCH_CATEGORY,
    action: DELIVERY_INFO_SRP_DISPLAYED,
    label: `${countryCode}|${productTypeId}|${bucket}`,
    transport: 'beacon',
  }),
  giftLandingPageOpenMessage: () => ({
    category: GIFT_LANDING_PAGE_CATEGORY,
    action: GIFT_LANDING_PAGE_OPEN_MESSAGE,
    transport: 'beacon',
  }),
  giftLandingPageCloseMessage: () => ({
    category: GIFT_LANDING_PAGE_CATEGORY,
    action: GIFT_LANDING_PAGE_CLOSE_MESSAGE,
    transport: 'beacon',
  }),
  giftLandingPageEditAddress: () => ({
    category: GIFT_LANDING_PAGE_CATEGORY,
    action: GIFT_LANDING_PAGE_EDIT_ADDRESS,
    transport: 'beacon',
  }),
  giftLandingPageClickedTracking: () => ({
    category: GIFT_LANDING_PAGE_CATEGORY,
    action: GIFT_LANDING_PAGE_CLICKED_TRACKING,
    transport: 'beacon',
  }),
  giftLandingPageTrackingInfoAvailable: ({ available }) => ({
    category: GIFT_LANDING_PAGE_CATEGORY,
    action: GIFT_LANDING_PAGE_TRACKING_INFO_AVAILABLE,
    transport: 'beacon',
    label: available ? 'available' : 'unavailable',
  }),
  cancelOrderAborted: () => ({
    category: ORDER_MODIFICATION_CATEGORY,
    action: ORDER_MODIFICATION_CANCEL_ORDER_ABORTED,
    transport: 'beacon',
  }),
  cancelOrderViewOrderSummary: () => ({
    category: ORDER_MODIFICATION_CATEGORY,
    action: ORDER_MODIFICATION_CANCEL_ORDER_VIEW_SUMMARY,
    transport: 'beacon',
  }),
  quickCartItemRemoved: () => ({
    category: QUICK_CART_CATEGORY,
    action: QUICK_CART_ITEM_REMOVED,
  }),
  quickCartQuantityUpdated: () => ({
    category: QUICK_CART_CATEGORY,
    action: QUICK_CART_QUANTITY_UPDATED,
  }),
  bnplInView: () => ({
    category: BNPL_CATEGORY,
    action: BNPL_MESSAGE_IN_VIEW,
    label: 'ProductPage',
  }),
};


export const callbackWithTimeout = (callback, timeout = 250) => {
  let called = false;

  const fn = (calledByTimeout = false) => {
    if (!called) {
      called = true;
      callback(calledByTimeout);
    }
  };

  setTimeout(() => fn(true), timeout);

  return fn;
};

export default analyticsPayload;
