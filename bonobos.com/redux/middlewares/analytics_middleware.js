import ActionTypes from "highline/redux/action_types"
import { alias, identify, identifyAnonymous, trackEvent, trackPage } from "highline/utils/segment/segment_helper"
import { Map } from "immutable"
import { decamelize } from "humps"
import { toDecamelizedJSON } from "highline/utils/immutable_helper"
import { getLineItem } from "highline/redux/helpers/line_item_helper"
import * as UserAuthStorage from "highline/storage/user_auth_storage"
import * as UserStorage from "highline/storage/user_storage"
import * as FitPreferenceStorage from "highline/storage/fit_preference_storage"
import * as OrderStorage from "highline/storage/order_storage"
import * as Cookies from "highline/utils/cookies"
import { productDetailSegmentProperties, productNameAndIdDetails } from "highline/redux/helpers/product_detail_helper"
import { buildBundleDetailSegmentProperties } from "highline/redux/helpers/bundle_detail_helper"
import { funnelPageCategories } from "highline/config/pages"
import { findGiftCardPayment  } from "highline/utils/order_helper"
import { isServer } from "highline/utils/client.js"
import getConfig from "highline/config/application"

const getNavPlacement = (state) => (
  state.getIn(["navigation_v2", "placement"]) === "desktop" ? "top nav" : "hamburger"
)

const trackSession = (store) => {
  const { bonobosSessionCookieKey, sessionDuration } = getConfig()
  if (isServer || !window.analytics) return

  const now = (new Date()).getTime()
  const activeSession = Cookies.get(bonobosSessionCookieKey)
  const sessionStart = activeSession ? activeSession.get("start") : now
  const sessionExpiry = now + sessionDuration

  const opts = { expires: new Date(sessionExpiry).toUTCString() }
  const cookie_value = {
    start: sessionStart,
    expiry: sessionExpiry,
  }
  Cookies.set(bonobosSessionCookieKey, cookie_value, opts)

  // Explicit declaration of a session start to help tracking in Amplitude
  if (store && !activeSession) {
    trackEvent("Bonobos Session Start", {
      current_path: store.getState().getIn(["currentPage", "path"]),
    })
  }
}

const analyticsMiddleware = (store) => (next) => (action) => {
  trackSession(store)

  switch (action.type) {
    case ActionTypes.AUTH_FAILED: {
      trackEvent("Login Failed", {
        status: action.status,
        message: action.message,
        error: action.error && (action.error.toJS ? action.error.toJS() : action.error),
      })
      break
    }

    case ActionTypes.AUTH_OPENED: {
      trackEvent("Login Step Viewed", {
        step: "email",
        location: store.getState().getIn(["cart", "isOpen"]) ? "cart" : null,
      })
      break
    }

    case ActionTypes.TOGGLE_EXISTING_USER_LOGIN: {
      const location = store.getState().getIn(["cart", "isOpen"]) ? "cart" : null
      const useSignInForm = store.getState().getIn(["auth", "useSignInForm"])

      /**
       * checking reversed condition here becuase this action will toggle between one
       * form and another.  when `useSignInForm` is `true` it means the user is switching
       * to the Sign Up form and `useSignInForm` will flip to `false` once the auth reducer
       * handles it
       */
      if (!useSignInForm){
        trackEvent("Viewing sign in form", {
          step: "email",
          location,
        })
      } else {
        trackEvent("Viewing sign up form", {
          step: "email",
          is_new_account: true,
          location,
        })
      }

      break
    }

    case ActionTypes.BUNDLE_DETAIL_PRODUCT_INFO_MODAL:
      trackEvent("Bundle Detail More Info Modal Opened",{
        bundleName: action.bundleName,
        bundleSlug: action.bundleSlug,
        productName: action.productName,
        productSlug: action.productSlug,
      })
      break

    case ActionTypes.BUNDLE_DETAIL_MODAL_VIEW_PRODUCT_CLICKED:
      trackEvent("Bundle Detail Modal View Full Product Details Clicked",{
        bundleName: action.bundleName,
        bundleSlug: action.bundleSlug,
        productName: action.productName,
        productSlug: action.productSlug,
      })
      break

    case ActionTypes.BUNDLE_DISCOUNT_BUNDLE_PURCHASED: {
      const products = action.order.get("items")
      const bundleDiscountProducts = products.filter((product) => product.get("bundleDiscount"))
      const bundleDiscountProductData = bundleDiscountProducts.map((product) => ({
        color: product.getIn(["options", "color"]),
        discounted_price: product.get("discountedTotal"),
        name: product.get("name"),
        quantity: product.get("quantity"),
      }))
      trackEvent("Bundle Purchased", {
        total_bundle_discount: action.order.get("bundleDiscountTotalNumeric"),
        products: toDecamelizedJSON(bundleDiscountProductData),
      })
      break
    }

    case ActionTypes.BUNDLE_DISCOUNT_CROSS_CATEGORY_BUNDLE_PURCHASED: {
      const crossCategoryBundleProductsData = action.crossCategoryBundleProducts.map((product) => ({
        color: product.getIn(["options", "color"]),
        bundles: product.get("discountedBundles").toJS(),
        discounted_price: product.get("discountedTotal"),
        name: product.get("name"),
        quantity: product.get("quantity"),
      }))
      trackEvent("Cross Category Bundle Purchased", {
        products: toDecamelizedJSON(crossCategoryBundleProductsData),
      })
      break
    }

    case ActionTypes.UNSUPPORTED_BROWSER_VERSION_DETECTED:
      trackEvent("Browser Incompatible Popup Viewed", {
        upgradeUrl: action.upgradeUrl,
      })
      break

    case ActionTypes.CAMPAIGN_PAGE_LINK_CLICKED:
      trackEvent("Campaign Link Clicked", {
        campaign_name: action.campaign,
        link_name: action.linkTitle,
        location: "campaign",
        url: action.url,
      })
      break

    case ActionTypes.CAMPAIGN_PAGE_VIEWED:
      trackEvent("Campaign Page Viewed", {
        campaign_name: action.campaign,
      })
      break

    case ActionTypes.CAROUSEL_CLICKED: {
      trackEvent("Carousel Clicked", {
        name: action.name,
        position: action.position + 1,
        destination: action.destination,
        image_url: action.imageURL,
      })
      break
    }

    case ActionTypes.CAROUSEL_SCROLLED: {
      trackEvent("Carousel Scrolled", {
        name: action.name,
        position: action.position + 1,
        image_url: action.imageURL,
      })
      break
    }

    case ActionTypes.CART_CLOSE_CLICKED: {
      trackEvent("Cart closed")
      break
    }

    case ActionTypes.CART_ADD_LINE_ITEMS_FAILED: {
      const location = store.getState().getIn(["rightDrawer", "contents"]) === "quickShop" ? "quick shop" : null

      trackEvent("Product Added Failed", {
        status: action.status,
        message: action.message,
        error: action.error && action.error.toJS(),
        location,
      })
      break
    }

    case ActionTypes.CART_ADD_LINE_ITEMS_STARTED: {
      if (action.lineItems.first().get("location") === "product")
        trackEvent("Cart Viewed", {
          cart_id: action.orderNumber,
          products: action.lineItems.map((item) => {
            return Map({
              quantity: item.get("quantity"),
              sku: item.get("sku"),
            })
          }).toJS(),
        })
      break
    }

    case ActionTypes.CART_NOTIFICATION_CLICKED: {
      trackEvent("Cart Message Clicked", {
        notificationId: action.notificationId,
      })
      break
    }

    case ActionTypes.CART_NOTIFICATION_DISMISSED: {
      trackEvent("Cart Message Dismissed", {
        notificationId: action.notificationId,
      })
      break
    }

    case ActionTypes.CART_NOTIFICATIONS_LOADED: {
      trackEvent("Cart Message loaded", {
        notificationId: action.notifications,
      })
      break
    }

    case ActionTypes.CATEGORY_IMAGE_HOVERED: {
      trackEvent("Category Image Hovered")
      break
    }

    case ActionTypes.CATEGORY_PRODUCT_VARIANT_SELECTED: {
      trackEvent("Product Variant Selected", {
        option_type: action.optionName,
        option_value: action.optionValue,
        location: action.location,
      })
      break
    }

    case ActionTypes.CATEGORY_PROMO_TILE_CLICKED: {
      trackEvent("Category Promo Tile Clicked", {
        title: action.title,
        position: action.position,
        slug: action.slug,
      })
      break
    }

    case ActionTypes.CATEGORY_NAVIGATION_V2_ITEM_CLICKED: {
      trackEvent("Category Navigation V2 Item Clicked", {
        link: action.item.get("link"),
      })
      break
    }

    case ActionTypes.CATEGORY_NAVIGATION_V2_ITEM_COLLAPSED: {
      trackEvent("Category Navigation V2 Item Collapsed", {
        link: action.item.get("link"),
      })
      break
    }

    case ActionTypes.CATEGORY_NAVIGATION_V2_ITEM_EXPANDED: {
      trackEvent("Category Navigation V2 Item Expanded", {
        link: action.item.get("link"),
      })
      break
    }

    case ActionTypes.CATEGORY_BACK_TO_TOP_CLICKED: {
      const slug = store.getState().getIn(["category", "slug"])

      trackEvent("Category Back to Top Clicked", {
        slug,
      })
      break
    }

    case ActionTypes.CATEGORY_FETCH_SUCCEEDED:
    case ActionTypes.CATEGORY_PLP_FETCH_SUCCEEDED: {
      const isStandardLayout = action.type === "CATEGORY_FETCH_SUCCEEDED"
      const isSwatchLayout = action.type === "CATEGORY_PLP_FETCH_SUCCEEDED"

      if (
        (isStandardLayout && action.data.get("groups").isEmpty()) ||
        (isSwatchLayout && action.data.get("items").isEmpty())
      ) {
        const categorySlug = action.data.get("slug")

        trackEvent("Product List Filtered No Product Match", {
          category: categorySlug && categorySlug.split("/")[0],
          filters: action.data.get("providedFilters"),
          has_my_fit: store.getState().getIn(["filters", "myFitEnabled"]),
          list_id: categorySlug,
        })
      }

      break
    }

    case ActionTypes.CATEGORY_CONSTRUCTOR_FETCH_MORE_STARTED: {
      const state = store.getState().get("category")
      trackEvent("Show More in PLP", {
        category: state.get("slug"),
        pageNumber: state.get("pageNumber"),
        pageSize: state.get("pageSize"),
        totalResults: store.getState().getIn(["sort", "numItems"]),
      })
      break
    }

    case ActionTypes.SEARCH_FETCH_SUCCEEDED: {
      const isFromConstructor = !action.data.get("products")
      const pageType = store.getState().getIn(["filters", "currentPage"])
      const isEmpty = isFromConstructor
        ? action.data.get("items").isEmpty()
        : action.data.get("products").isEmpty()
      if (isEmpty) {
        trackEvent("Product List Filtered No Product Match", {
          category: pageType,
          filters: action.data.get("providedFilters"),
          has_my_fit: store.getState().getIn(["filters", "myFitEnabled"]),
          list_id: pageType,
        })
      }

      const filters = store.getState().getIn(["filters", "selectedFilters"])

      // `term` field used by amplitude and maybe by other integrations
      // `query` field used by Moveable Ink and appropriate field name according to segment ecom spec:
      // https://segment.com/docs/connections/spec/ecommerce/v2/#products-searched
      trackEvent("Search Completed", {
        filtered: !filters.isEmpty(),
        num_results: isFromConstructor ? action.data.get("items").size : action.data.get("products").size,
        query: store.getState().getIn(["search", "searchTerm"]),
        term: store.getState().getIn(["search", "searchTerm"]),
      })

      break
    }

    case ActionTypes.CONTENTFUL_CAROUSEL_CLICKED: {
      trackEvent("Contentful Carousel Clicked", {
        position: action.position + 1,
        destination: action.destination,
        image_url: action.image_url,
        location: action.location,
      })
      break
    }

    case ActionTypes.CONTENTFUL_CAROUSEL_SCROLLED: {
      trackEvent("Contentful Carousel Scrolled", {
        position: action.position + 1,
        image_url: action.image_url,
        location: action.location,
      })
      break
    }

    case ActionTypes.CONTENTFUL_FLYOUT_OPEN_CLICKED: {
      trackEvent("Contentful flyout opened", {
        flyoutName: action.flyoutId,
        location: action.location,
        path: store.getState().getIn(["currentPage", "path"]),
      })
      break
    }

    case ActionTypes.CONTENTFUL_MODAL_OPEN_CLICKED: {
      trackEvent("Contentful modal opened", {
        location: action.location,
        modalId: action.modalId,
        path: store.getState().getIn(["currentPage", "path"]),
      })
      break
    }

    case ActionTypes.CONTENTFUL_ON_PAGE_LOAD_MODAL_OPENED: {
      trackEvent("Contentful on page load modal opened", {
        location: action.location,
        modalId: action.modalId,
        path: store.getState().getIn(["currentPage", "path"]),
      })
      break
    }


    case ActionTypes.CONTENTFUL_HERO_IMAGE_CLICKED: {
      trackEvent("Contentful hero image clicked", {
        contentfulId: action.contentfulId,
        destination: action.destination,
        location: action.location,
      })
      break
    }

    case ActionTypes.CONTENTFUL_STORY_POD_CLICKED: {
      trackEvent("Contentful story pod clicked", {
        contentfulId: action.contentfulId,
        destination: action.destination,
        location: action.location,
      })
      break
    }

    case ActionTypes.CONTENTFUL_PRODUCT_TILE_CLICKED: {
      trackEvent("Contentful product tile clicked", {
        contentfulId: action.contentfulId,
        destination: action.destination,
        location: action.location,
      })
      break
    }

    case ActionTypes.CONTENTFUL_TAB_GROUP_TAB_CLICKED: {
      trackEvent("Contentful tab group tab clicked", {
        location: action.location,
        tabGroupTitle: action.tabGroupTitle,
        tabTitle: action.tabTitle,
      })
      break
    }

    case ActionTypes.CONTENTFUL_PRODUCT_PREVIEW_CLICKED: {
      trackEvent("Contentful product preview clicked", {
        currentPath: store.getState().getIn(["currentPage", "path"]),
        location: action.location,
        isRightDrawerOpen: store.getState().getIn(["rightDrawer", "isOpen"]),
        slug: action.slug,
      })
      break
    }

    case ActionTypes.CONTENTFUL_VIDEO_PLAYED: {
      trackEvent("Contentful video played", {
        contentfulId: action.contentfulId,
        destination: action.destination,
        location: action.location,
      })
      break
    }

    case ActionTypes.CONTENTFUL_CTA_CLICKED: {
      trackEvent("Contentful cta clicked", {
        contentfulId: action.contentfulId,
        destination: action.destination,
        location: action.location,
      })
      break
    }

    case ActionTypes.CONTENTFUL_LOAD_QUIZ: {
      trackEvent("Contentful quiz opened", {
        quizName: action.quizName,
        location: action.location,
      })
      break
    }

    case ActionTypes.CONTENTFUL_QUIZ_ANSWER_CLICKED:
    case ActionTypes.CONTENTFUL_QUIZ_SINGLE_ANSWER_CLICKED:{
      trackEvent("Contentful quiz answer clicked", {
        quizName: action.quizName,
        question: action.question,
        answer: action.answer,
      })
      break
    }

    case ActionTypes.CONTENTFUL_CHAT_TRIGGER_CLICKED: {
      trackEvent("Contentful Chat Trigger Clicked", {
        contentfulId: action.contentfulId,
        location: action.location,
      })
      break
    }

    case ActionTypes.FILTERS_UPDATED: {//ActionTypes.FILTERS_CLOSED: {
      const pageType = store.getState().getIn(["filters", "currentPage"])
      const categorySlug = store.getState().getIn(["category", "slug"])

      trackEvent("Product List Filtered", {
        category: pageType === "Category" && categorySlug ? categorySlug.split("/")[0] : pageType,
        filters: store.getState().getIn(["filters", "appliedFilters"]),
        has_my_fit: store.getState().getIn(["filters", "myFitEnabled"]),
        list_id: pageType === "Category" ? categorySlug : pageType,
      })
      break
    }

    case ActionTypes.FILTERS_CLEARED: {
      const pageType = store.getState().getIn(["filters", "currentPage"])
      const categorySlug = store.getState().getIn(["category", "slug"])

      trackEvent("Filters Cleared", {
        category: pageType === "Category" ? categorySlug : pageType,
        filters: store.getState().getIn(["filters", "appliedFilters"]),
        list_id: pageType === "Category" ? categorySlug : pageType,
      })
      break
    }

    case ActionTypes.FILTERS_OPENED: {
      const pageType = store.getState().getIn(["filters", "currentPage"])
      const categorySlug = store.getState().getIn(["category", "slug"]) || ""
      const rootCategorySlug = categorySlug.split("/")[0]

      trackEvent("Filter Dropdown Opened", {
        category: pageType === "Category" ? rootCategorySlug : pageType,
        filterName: action.filterName,
        list_id: pageType === "Category" ? categorySlug : pageType,
      })
      break
    }

    case ActionTypes.FILTERS_OPTION_VALUE_CLICKED: {
      const pageType = store.getState().getIn(["filters", "currentPage"])
      const categorySlug = store.getState().getIn(["category", "slug"]) || ""
      const rootCategorySlug = categorySlug.split("/")[0]

      trackEvent("Filter Option Value Clicked", {
        category: pageType === "Category" ? rootCategorySlug : pageType,
        filterAdded: action.filterAdded,
        list_id: pageType === "Category" ? categorySlug : pageType,
        optionType: action.optionValue.get("type"),
        optionValue: action.optionValue.get("value"),
      })
      break
    }

    case ActionTypes.EDIT_MY_FIT_CLICKED: {
      trackEvent("Edit My Fit Clicked", {
        category: store.getState().getIn(["category", "slug"]),
        list_id: store.getState().getIn(["category", "slug"]),
      })
      break
    }

    case ActionTypes.CATEGORY_NAV_ITEM_CLICK: {
      trackEvent("Horizontal Navigation Item Clicked", {
        category_name: action.name,
        level: 3,
      })
      break
    }

    case ActionTypes.CATEGORY_BREADCRUMB_CLICKED: {
      trackEvent("Breadcrumb Clicked", {
        breadcrumb_path: action.path,
      })
      break
    }

    case ActionTypes.TRACK_MY_FIT_TOGGLED: {
      trackEvent("My Fit Toggled", {
        selected_option_values: action.filters,
      })
      break
    }

    case ActionTypes.EMAIL_CAPTURED: {
      identify(action.externalID, { spree_user_id: action.externalID, email: action.email })

      trackEvent("Email Subscription Created", {
        location: action.location,
        email: action.email,
        source: action.list,
      })
      break
    }

    case ActionTypes.FOOTER_LINK_CLICKED: {
      trackEvent("Foot Link Clicked", {
        destination_url: action.url,
        link_name: action.name,
      })
      break
    }

    case ActionTypes.USER_LOGGED_IN: {
      const location = store.getState().getIn(["cart", "isOpen"]) ? "cart" : null

      alias(action.externalId)
      identify(action.externalId, { spree_user_id: action.userId, email: action.email })

      trackEvent("Logged In", {
        location,
      })

      trackEvent("Login Step Completed", {
        step: "password",
        is_new_account: false,
        location,
      })
      break
    }

    case ActionTypes.USER_REGISTERED: {
      alias(action.externalId)

      identify(action.externalId, {
        spree_user_id: action.userId,
        email: action.email,
      })

      const isFromCart = store.getState().getIn(["cart", "isOpen"])
      const isFromConfirmation = store.getState().getIn(["currentPage", "path"]) === "/checkout/confirmation"

      let location = null
      if (isFromCart) {
        location = "cart"
      }
      if (isFromConfirmation) {
        location = "post order account creation form"
      }

      trackEvent("Account Created", {
        is_logged_in: true,
        location,
      })

      if (!isFromConfirmation) {
        trackEvent("Login Step Completed", {
          step: "password",
          is_logged_in: true,
          is_new_account: true,
          location,
        })
      }

      trackEvent("Email Subscription Created", {
        location: isFromConfirmation ? location : "sign-up form",
        is_logged_in: true,
        email: action.email,
      })
      break
    }

    case ActionTypes.HOMEPAGE_NAV_SLIDER_ITEM_CLICKED: {
      trackEvent("Homepage Slider Item Clicked", {
        position: action.position,
        destination: action.url,
      })
      break
    }

    case ActionTypes.USER_LOGOUT_STARTED: {
      trackEvent("Left Navigation Item Clicked", {
        destination_url: action.link,
        level: action.level,
        nav_item_label: action.categoryName,
        placement: "hamburger",
      })
      break
    }

    case ActionTypes.HEADER_NAVIGATION_MOUSE_LEFT: {
      trackEvent("Left Navigation Closed", {
        placement: "top nav",
      })
      break
    }

    case ActionTypes.HEADER_NAVIGATION_ITEM_MOUSE_ENTERED: {
      trackEvent("Left Navigation Opened", {
        placement: "top nav",
        header_nav_item_label: action.itemLabel,
      })
      break
    }

    case ActionTypes.HEADER_NAVIGATION_STATIC_LINK_CLICKED: {
      trackEvent("Left Navigation Item Clicked", {
        destination_url: action.link,
        level: action.level,
        nav_item_label: action.linkName,
        placement: action.placement,
      })
      break
    }

    case ActionTypes.HEADER_NAVIGATION_ITEM_CLICKED: {
      trackEvent("Left Navigation Item Clicked", {
        placement: "top nav",
        nav_item_label: action.itemLabel,
        destination_url: action.itemPath,
      })
      break
    }

    case ActionTypes.TIPPY_TOP_DISMISSED:{
      trackEvent("Global Marketing Banner Dismissed", {
        app: "highline",
        is_logged_in: store.getState().getIn(["auth", "isLoggedIn"]),
        location: action.url,
      })
      break
    }

    // Mobile Navigion

    case ActionTypes.LEFT_DRAWER_OPEN_CLICKED: {
      if ( action.contents === "navigation") {
        trackEvent("Left Navigation Opened", {
          placement: "hamburger",
        })
      }
      break
    }

    case ActionTypes.LEFT_DRAWER_CLOSE_STARTED: {
      const contents = store.getState().getIn(["leftDrawer", "contents"])
      if (contents === "navigation") {
        trackEvent("Left Navigation Closed", {
          placement: "hamburger",
        })
      }
      break
    }

    case ActionTypes.LEFT_DRAWER_LEFT_CTA_CLICKED: {
      const contents = store.getState().getIn(["leftDrawer", "contents"])
      if (contents === "navigation") {
        trackEvent("Left Navigation Back Clicked", {
          level: 2,
          placement: "hamburger",
        })
      }
      break
    }

    case ActionTypes.NAVIGATION_PARENT_TILE_CLICKED: {
      trackEvent("Left Navigation Item Clicked", {
        destination_url: action.itemPath,
        level: action.level,
        nav_item_label: action.itemLabel,
        placement: "hamburger",
      })
      break
    }

    case ActionTypes.NAVIGATION_SUBNAV_TILE_CLICKED: {
      trackEvent("Left Navigation Item Clicked", {
        placement: "hamburger",
        level: action.level,
        nav_item_label: action.label,
        destination_url: action.link.get("as"),
      })
      break
    }

    case ActionTypes.NAVIGATION_ITEM_CLICKED: {
      trackEvent("Left Navigation Item Clicked", {
        placement: getNavPlacement(store.getState()),
        nav_item_label: action.itemLabel,
        destination_url: action.link.get("as"),
      })
      break
    }

    case ActionTypes.NAVIGATION_IMAGE_CLICKED: {
      trackEvent("Navigation Image Clicked", {
        ...toDecamelizedJSON(action.metadata),
        placement: "top nav",
        alt_text: action.altText,
        destination_url: action.link.get("as"),
        image_url: action.imageUrl,
      })
      break
    }

    case ActionTypes.NAVIGATION_IMAGE_TITLE_CLICKED: {
      trackEvent("Navigation Image Title Clicked", {
        ...toDecamelizedJSON(action.metadata),
        placement: "top nav",
        destination_url: action.link.get("as"),
        image_title: action.imageTitle,
      })
      break
    }

    case ActionTypes.NAV_PILL_ITEM_CLICKED: {
      trackEvent("Navigation Pill Item Clicked", {
        nav_item_label: action.name,
        destination_url: action.path,
      })
      break
    }

    case ActionTypes.NEW_CUSTOMER_MODAL_LOADED:
      trackEvent("New Customer Modal Viewed")
      break

    case ActionTypes.PAGE_LOADED: {
      const { signifydSessionId } = OrderStorage.load()

      trackPage(action.pageCategory, action.title, { signifydSessionId })

      const { authenticationToken, userId } = UserAuthStorage.load()
      const { externalId, email } = UserStorage.load()
      if (authenticationToken) {
        identify(
          externalId,
          {
            spree_user_id: userId,
            email,
          },
        )
      } else {
        identifyAnonymous()
      }

      if (!funnelPageCategories.includes(action.pageCategory)) {
        trackEvent("Page Viewed", {
          location: (action.pageCategory || "").toLowerCase(),
        })
      }

      switch (action.pageCategory) {
        case "Homepage": {
          trackEvent("Homepage Viewed")
          break
        }

        case "Sign-in": {
          trackEvent("Login Step Viewed", {
            step: "email",
            location: store.getState().getIn(["cart", "isOpen"]) ? "cart" : null,
          })
          break
        }

        case "GiftCard":
        case "Product": {
          const productDetails = productDetailSegmentProperties(store.getState().get("productDetail"))
          trackEvent("Product Viewed", {
            ...productDetails,
            is_logged_in: store.getState().getIn(["auth", "isLoggedIn"]),
          })
          break
        }

        case "Category": {
          const hasFilters = store.getState().getIn(["filters", "selectedFilters"]).size > 0 || !!window.location.search
          const { isEnabled } = FitPreferenceStorage.load()
          const slug = store.getState().getIn(["category", "slug"]) || ""
          const rootCategory = slug.split("/")[0]
          const subcategory = store.getState().getIn(["category", "name"]) || ""

          trackEvent("Product List Viewed", {
            category: rootCategory,
            has_my_fit: isEnabled,
            is_pre_filtered: hasFilters,
            list_id: slug,
            subcategory: subcategory.toLowerCase().replace(" ", "-"),
          })
          break
        }

        case "Bundle": {
          const bundleDetail = store.getState().get("bundleDetail")
          const bundleSegmentProperties = buildBundleDetailSegmentProperties(
            bundleDetail.get("name"),
            bundleDetail.get("bundleOptions"),
            bundleDetail.get("price"),
          )

          trackEvent("Product Viewed", {
            ...bundleSegmentProperties,
            is_logged_in: store.getState().getIn(["auth", "isLoggedIn"]),
          })
          break
        }
      }
      break
    }

    case ActionTypes.CART_LOADED: {
      trackEvent("Cart Viewed", {
        cart_id: action.cart.get("number"),
        products: action.cart.get("items").map((item) => {
          return Map({
            quantity: item.get("quantity"),
            sku: item.get("sku"),
          })
        }).toJS(),
      })
      break
    }

    case ActionTypes.CART_NOT_FETCHED: {
      trackEvent("Cart Viewed", {
        products: Map(),
      })
      break
    }

    case ActionTypes.LINE_ITEMS_ADDED_TO_CART: {
      action.lineItems.forEach((actionItem) => {
        const lineItem = getLineItem(actionItem, action.cart)
        trackEvent("Product Added", {
          cart_id: action.cart.get("number"),
          currency: "USD",
          from_wishlist: false,
          is_bundle: lineItem.get("isBundle"),
          is_markdown: lineItem.get("isMarkdown"),
          location: lineItem.get("location"),
          name: lineItem.get("name"),
          original_price: lineItem.get("onSale") ? lineItem.get("fullPriceNumeric") : null,
          price: lineItem.get("priceNumeric"),
          product_id: lineItem.get("productSku"),
          quantity: lineItem.get("quantity"),
          sku: lineItem.get("sku"),
          value: lineItem.get("subtotalNumeric"),
          variant: lineItem.get("description"),
        })
      })
      break
    }

    case ActionTypes.LINE_ITEMS_REMOVED_FROM_CART: {
      action.lineItems.forEach((lineItem) => {
        trackEvent("Product Removed", {
          cart_id: action.cart.get("number"),
          quantity: lineItem.get("quantity"),
          sku: lineItem.get("sku"),
        })
      })
      break
    }

    case ActionTypes.OUT_OF_STOCK_SUBSCRIPTION_SUBMIT_SUCCEEDED: {
      trackEvent("Out of Stock Notification Completed", {
        is_bundle: false,
        name: action.productName,
        option_values: action.selectedOptions.toJS(),
        status: action.status,
      })
      break
    }

    // PDP Events

    case ActionTypes.PRODUCT_DETAIL_ZOOM_OPEN_CLICKED:
      trackEvent("Zoom Started", {
        name: store.getState().getIn(["productDetail", "productName"]),
        price: store.getState().getIn(["productDetail", "price", "price"]),
        product_id: store.getState().getIn(["productDetail", "masterSku"]),
        sku: store.getState().getIn(["productDetail", "sku"]),
        variant: action.variant, // TODO: figure out what this is
      })
      break

    case ActionTypes.PRODUCT_DETAIL_ZOOM_CLICKED:
      trackEvent("Product Zoomed", {
        direction: action.direction,
        name: store.getState().getIn(["productDetail", "name"]),
      })
      break

    case ActionTypes.PRODUCT_DETAIL_NEXT_IMAGE_CLICKED:
      trackEvent("Product Next Image", {
        name: store.getState().getIn(["productDetail", "name"]),
      })
      break

    case ActionTypes.PRODUCT_DETAIL_PREV_IMAGE_CLICKED:
      trackEvent("Product Previous Image", {
        name: store.getState().getIn(["productDetail", "name"]),
      })
      break

    case ActionTypes.PRODUCT_DETAIL_OPTIONS_CHANGED: {
      const location = store.getState().getIn(["rightDrawer", "contents"]) === "quickShop" ? "quick shop" : null
      const isGiftCard = store.getState().getIn(["productDetail", "isGiftCard"])

      trackEvent("Product Variant Selected", {
        location: isGiftCard? "gift card" : location,
        option_type: action.optionName,
        option_value: action.optionValue,
      })
      break
    }

    case ActionTypes.PRODUCT_DETAIL_OPTION_LOADED: {
      const product = store.getState().get("productDetail")
      const productDetails = productDetailSegmentProperties(product)
      const isSoldOut = product.get("variant") ? !product.getIn(["variant", "inStock"]) : null

      trackEvent("Product Variant Viewed", {
        ...productDetails,
        is_sold_out: isSoldOut,
        is_logged_in: store.getState().getIn(["auth", "isLoggedIn"]),
      })
      break
    }

    case ActionTypes.PRODUCT_DETAIL_HELP_LINK_CLICKED:
      trackEvent("Product Help Icons Clicked", {
        name: action.helpLink,
      })
      break

    case ActionTypes.PRODUCT_DETAIL_THUMBNAIL_CLICKED:
      trackEvent("Image Thumbnail Clicked", {
        image_id: action.url,
        location: "product",
      })
      break

    case ActionTypes.OUT_OF_STOCK_SUBSCRIPTION_SUBMIT_STARTED: {
      trackEvent("Out of Stock Notification Started", {
        name: store.getState().getIn(["productDetail", "name"]),
      })
      break
    }

    case ActionTypes.PRODUCT_DETAIL_EDUCATION_CTA_CLICKED:
      trackEvent("Education Modal Opened", {
        classification_id: store.getState().getIn(["sizeAndFit", "id"]),
        classification_name: store.getState().getIn(["sizeAndFit", "name"]),
        option_type: decamelize(action.optionTypeName, { separator: "-" }),
        ...productNameAndIdDetails(store.getState().get("productDetail")),
      })
      break

    case ActionTypes.PRODUCT_DETAIL_PRODUCT_PROPERTIES_ACCORDION_CLICKED:
    case ActionTypes.BUNDLE_DETAIL_PRODUCT_PROPERTIES_ACCORDION_CLICKED:
      trackEvent("Product Properties Accordion Clicked", {
        accordionHeader: action.accordionHeader,
        location: action.location,
        productName: action.productName,
        productSlug: action.productSlug,
      })
      break

    case ActionTypes.PRODUCT_SHARE_TO_EMAIL_CLICKED:
      trackEvent("Product Shared", {
        is_logged_in: store.getState().getIn(["auth", "isLoggedIn"]),
        path: store.getState().getIn(["currentPage", "path"]),
        platform: "email",
        productName: store.getState().getIn(["productDetail", "name"]),
        type: "product",
      })
      break

    case ActionTypes.PRODUCT_SHARE_TO_TEXT_CLICKED:
      trackEvent("Product Shared", {
        is_logged_in: store.getState().getIn(["auth", "isLoggedIn"]),
        path: store.getState().getIn(["currentPage", "path"]),
        platform: "text",
        productName: store.getState().getIn(["productDetail", "name"]),
        type: "product",
      })
      break

    case ActionTypes.GIFTCARD_SHARE_TO_EMAIL_CLICKED:
      trackEvent("Product Shared", {
        is_logged_in: store.getState().getIn(["auth", "isLoggedIn"]),
        path: store.getState().getIn(["currentPage", "path"]),
        platform: "email",
        productName: store.getState().getIn(["productDetail", "name"]),
        type: "giftcard",
      })
      break
    case ActionTypes.GIFTCARD_SHARE_TO_TEXT_CLICKED:
      trackEvent("Product Shared", {
        is_logged_in: store.getState().getIn(["auth", "isLoggedIn"]),
        path: store.getState().getIn(["currentPage", "path"]),
        platform: "text",
        productName: store.getState().getIn(["productDetail", "name"]),
        type: "giftcard",
      })
      break

    case ActionTypes.PRODUCT_DETAIL_ON_MODEL_PRODUCT_CLICKED: {
      trackEvent("Bundle Separate Clicked", {
        currency: action.product.get("currency"),
        is_markdown: action.product.get("isMarkDown"),
        location: "On Model Test",
        name: action.product.get("name"),
        original_price: action.product.get("fullPrice"),
        price: action.product.get("price"),
        product_id: action.product.get("productId"),
        sku: action.product.get("sku"),
        variant: action.product.get("variant"),
      })
      break
    }

    case ActionTypes.FIT_EDUCATOR_CLOSED: {
      trackEvent("Fit Educator Closed", {
        productName: action.productName,
      })
      break
    }

    // Product Preview Events (copied from Product Detail temporarily)

    case ActionTypes.PRODUCT_PREVIEW_OPTIONS_CHANGED: {
      const location = store.getState().getIn(["rightDrawer", "contents"]) === "quickShop" ? "quick shop" : null

      trackEvent("Product Variant Selected", {
        option_type: action.optionName,
        option_value: action.optionValue,
        location,
      })
      break
    }

    case ActionTypes.PRODUCT_PREVIEW_HELP_LINK_CLICKED:
      trackEvent("Product Help Icons Clicked", {
        name: action.helpLink,
      })
      break

    case ActionTypes.PRODUCT_PREVIEW_THUMBNAIL_CLICKED:
      trackEvent("Image Thumbnail Clicked", {
        image_id: action.url,
        location: "product",
      })
      break

    case ActionTypes.PRODUCT_PREVIEW_SOLD_OUT_CLICKED: {
      trackEvent("Out of Stock Notification Started", {
        name: store.getState().getIn(["productDetail", "name"]),
      })
      break
    }

    case ActionTypes.PRODUCT_PREVIEW_EDUCATION_CTA_CLICKED:
      trackEvent("Education Modal Opened", {
        classification_id: store.getState().getIn(["sizeAndFit", "id"]),
        classification_name: store.getState().getIn(["sizeAndFit", "name"]),
        option_type: decamelize(action.optionTypeName, { separator: "-" }),
        ...productNameAndIdDetails(store.getState().get("productDetail")),
      })
      break

    // Account Events
    case ActionTypes.SAVED_ITEMS_PUBLIC_LINK_CLICKED: {
      trackEvent("Public saved items list link clicked")
      break
    }

    case ActionTypes.SAVED_ITEMS_EMPTY_LIST_LINK_CLICKED: {
      trackEvent("Empty saved items list link clicked")
      break
    }

    case ActionTypes.SAVED_ITEMS_REMOVE_PRODUCT_SUCCEEDED: {
      const options = action.item.get("options") || Map()
      trackEvent("Item removed from saved items list", {
        location: action.location,
        slug: action.item.get("productSlug"),
        sku: action.item.get("sku"),
        ...options.toJS(),
      })
      break
    }

    case ActionTypes.SAVED_ITEMS_ADD_PRODUCT_SUCCEEDED: {
      const options = action.item.get("options") || Map()
      trackEvent("Item added to saved items list", {
        location: action.location,
        slug: action.item.get("productSlug"),
        sku: action.item.get("sku"),
        ...options.toJS(),
      })
      break
    }

    // Quick Shop
    case ActionTypes.PRODUCT_PREVIEW_CLICKED:
      trackEvent("Product Preview Clicked", {
        slug: action.slug,
        ...action.selectedOptions.toJS(),
      })
      break

    case ActionTypes.SEARCH_PRODUCT_PREVIEW_CLICKED: {
      trackEvent("Search Product Preview Clicked", {
        slug: action.slug,
        term: store.getState().getIn(["search", "searchTerm"]),
        ...action.selectedOptions.toJS(),
      })
      break
    }

    case ActionTypes.PRODUCT_PREVIEW_VIEW_DETAILS_CLICKED:
      trackEvent("View Details Clicked", {
        location: "quick shop",
        subcategory: store.getState().getIn(["category", "name"]) ? store.getState().getIn(["category", "name"]).toLowerCase().replace(" ", "-") : "",
        ...productNameAndIdDetails(store.getState().get("productDetail")),
      })
      break

    case ActionTypes.PRODUCT_PREVIEW_VIEWED: {
      const filters = store.getState().getIn(["filters", "selectedFilters"])
      const { isEnabled } = FitPreferenceStorage.load()
      trackEvent("Quick Shop Viewed", {
        category: store.getState().getIn(["category", "slug"]),
        has_my_fit: isEnabled,
        is_pre_filtered: filters.size > 0,
        list_id: store.getState().getIn(["category", "slug"]),
        location: "quick shop",
        original_price: action.product.getIn(["price", "fullPrice"]),
        subcategory: store.getState().getIn(["category", "name"]) ? store.getState().getIn(["category", "name"]).toLowerCase().replace(" ", "-") : "",
        ...productDetailSegmentProperties(action.product),
      })
      break
    }

    // Size And Fit Events
    case ActionTypes.SIZE_AND_FIT_EDUCATION_ITEM_SCROLLED:
      trackEvent("Education Tile Scrolled", {
        classification_id: store.getState().getIn(["sizeAndFit", "id"]),
        classification_name: store.getState().getIn(["sizeAndFit", "name"]),
        option_type: decamelize(store.getState().getIn(["sizeAndFit", "currentOptionType"]), { separator: "-" }),
        product_id: store.getState().getIn(["productDetail", "masterSku"]),
        product_name: store.getState().getIn(["productDetail", "productName"]),
      })
      break

    case ActionTypes.SIZE_AND_FIT_EDUCATION_MODAL_CLOSED:
      trackEvent("Education Modal Closed", {
        classification_id: store.getState().getIn(["sizeAndFit", "id"]),
        classification_name: store.getState().getIn(["sizeAndFit", "name"]),
        option_type: decamelize(store.getState().getIn(["sizeAndFit", "currentOptionType"]), { separator: "-" }),
        ...productNameAndIdDetails(store.getState().get("productDetail")),
      })
      break

    case ActionTypes.SIZE_AND_FIT_EDUCATION_TAB_CLICKED:
      trackEvent("Education Tab Clicked", {
        classification_id: store.getState().getIn(["sizeAndFit", "id"]),
        classification_name: store.getState().getIn(["sizeAndFit", "name"]),
        ...productNameAndIdDetails(store.getState().get("productDetail")),
        tab_name: action.tabName,
      })
      break

    case ActionTypes.SIZE_AND_FIT_POINT_OF_MEASUREMENT_CLICKED:
      trackEvent("Point of Measure Tooltip Clicked", {
        classification_id: store.getState().getIn(["sizeAndFit", "id"]),
        classification_name: store.getState().getIn(["sizeAndFit", "name"]),
        option_type: decamelize(store.getState().getIn(["sizeAndFit", "currentOptionType"]), { separator: "-" }),
        point_of_measure: action.pomName,
        ...productNameAndIdDetails(store.getState().get("productDetail")),
      })
      break

    case ActionTypes.SIZE_AND_FIT_SIZE_CHART_TABLE_CHANGED:
      trackEvent("Size Chart Fit Clicked", {
        classification_id: store.getState().getIn(["sizeAndFit", "id"]),
        classification_name: store.getState().getIn(["sizeAndFit", "name"]),
        fit_name: action.tableName,
        option_type: decamelize(store.getState().getIn(["sizeAndFit", "currentOptionType"]), { separator: "-" }),
        product_id: store.getState().getIn(["productDetail", "masterSku"]),
        product_name: store.getState().getIn(["productDetail", "productName"]),
      })
      break

    // BUNDLE
    case ActionTypes.BUNDLE_DETAIL_THUMBNAIL_CLICKED:
      trackEvent("Image Thumbnail Clicked", {
        image_id: action.url,
        is_bundle: true,
      })
      break

    case ActionTypes.BUNDLE_DETAIL_ZOOM_OPEN_CLICKED:
      trackEvent("Zoom Started", {
        is_bundle: true,
        name: store.getState().getIn(["bundleDetail", "name"]),
        price: store.getState().getIn(["bundleDetail", "price", "price"]),
      })
      break

    case ActionTypes.BUNDLE_DETAIL_ZOOM_CLICKED:
      trackEvent("Product Zoomed", {
        direction: action.direction,
        is_bundle: true,
        name: store.getState().getIn(["bundleDetail", "name"]),
      })
      break

    case ActionTypes.BUNDLE_DETAIL_NEXT_IMAGE_CLICKED:
      trackEvent("Bundle Next Image", {
        name: store.getState().getIn(["bundleDetail", "name"]),
      })
      break

    case ActionTypes.BUNDLE_DETAIL_PREV_IMAGE_CLICKED:
      trackEvent("Bundle Previous Image", {
        name: store.getState().getIn(["bundleDetail", "name"]),
      })
      break

    case ActionTypes.BUNDLE_DETAIL_HELP_LINK_CLICKED:
      trackEvent("Product Help Icons Clicked", {
        is_bundle: true,
        name: action.helpLink,
      })
      break

    case ActionTypes.BUNDLE_DETAIL_OPTIONS_CHANGED: {
      trackEvent("Product Variant Selected", {
        is_bundle: true,
        option_type: action.optionName,
        option_value: action.optionValue,
      })
      break
    }

    case ActionTypes.BUNDLE_DETAIL_SIZE_AND_FIT_CTA_CLICKED:
      trackEvent("Education Modal Opened", {
        classification_id: action.classification.get("id"),
        classification_name: action.classification.get("name"),
        is_bundle: true,
        option_type: decamelize(action.optionTypeName, { separator: "-" }),
        product_name: store.getState().getIn(["bundleDetail", "name"]),
      })
      break

    case ActionTypes.BUNDLE_PRODUCT_SEPARATE_CLICKED:
      trackEvent("Bundle Separate Clicked", {
        currency: action.product.get("currency"),
        is_markdown: action.product.get("isMarkDown"),
        name: action.product.get("name"),
        original_price: action.product.get("fullPrice"),
        price: action.product.get("price"),
        product_id: action.product.get("productId"),
        sku: action.product.get("sku"),
        variant: action.product.get("variant"),
      })
      break

    case ActionTypes.BUNDLE_SHARE_TO_EMAIL_CLICKED:
      trackEvent("Product Shared", {
        is_logged_in: store.getState().getIn(["auth", "isLoggedIn"]),
        path: store.getState().getIn(["currentPage", "path"]),
        platform: "email",
        productName: store.getState().getIn(["bundleDetail", "name"]),
        type: "bundle",
      })
      break
    case ActionTypes.BUNDLE_SHARE_TO_TEXT_CLICKED:
      trackEvent("Product Shared", {
        is_logged_in: store.getState().getIn(["auth", "isLoggedIn"]),
        path: store.getState().getIn(["currentPage", "path"]),
        platform: "text",
        productName: store.getState().getIn(["bundleDetail", "name"]),
        type: "bundle",
      })
      break

    case ActionTypes.SEARCH_FETCH_FAILED: {
      trackEvent("Search Failed", {
        reason: action.error.toJS(),
        term: store.getState().getIn(["search", "searchTerm"]),
      })
      break
    }

    case ActionTypes.CATEGORY_FETCH_FAILED: {
      trackEvent("Category Fetch Failed", {
        reason: action.error,
        categorySlug: store.getState().getIn(["category", "slug"]),
      })
      break
    }

    case ActionTypes.SEARCH_FOCUSED: {
      trackEvent("Search Focused", {
        is_logged_in: store.getState().getIn(["auth", "isLoggedIn"]),
      })
      break
    }

    case ActionTypes.SEARCH_PRODUCT_LINK_CLICKED: {
      trackEvent("Search Product Link Clicked", {
        slug: action.slug,
        color: action.color,
        term: store.getState().getIn(["search", "searchTerm"]),
      })
      break
    }

    // Checkout
    case ActionTypes.SHIPPING_INFORMATION_ADD_SUCCEEDED: {
      if (action.isUserlessOrder) {
        trackEvent("Order Review Step Completed", {
          step: "2",
          step_name: "shipping-address",
          location: "checkout",
        })
      } else {
        trackEvent("Shipping Address Saved", {
          country_code: store.getState().getIn(["shippingInformation", "country", "code"]),
          is_default: store.getState().getIn(["shippingInformation", "default"]),
          is_logged_in: true,
          location: "checkout",
        })
      }
      break
    }

    case ActionTypes.ORDER_DELETE_LINE_ITEM_SUCCEEDED: {
      const step = Number(store.getState().getIn(["order", "currentStep"])) + 1
      const lineItem = action.lineItem
      trackEvent("Product Removed", {
        cart_id: action.order.get("number"),
        is_logged_in: "true",
        location: "checkout",
        quantity: lineItem.get("quantity"),
        step,
        sku: lineItem.get("sku"),
        sold_out: lineItem.get("inStock"),
      })
      break
    }

    case ActionTypes.BILLING_INFORMATION_ADD_SUCCEEDED: {
      const isGiftCard = action.paymentMethodType === "giftCard"
      if (isGiftCard){
        trackEvent("Gift Card Added", {
          location: "checkout",
          step: store.getState().getIn(["order", "currentStep"]) + 1,
        })
      } else {
        trackEvent("Card Saved", {
          card_type: action.order.getIn(["creditCard", "type"]),
          is_default: action.order.getIn(["creditCard", "default"]),
          is_logged_in: true,
          is_saved_for_future_use: store.getState().getIn(["billingInformation", "isInWallet"]),
          location: "checkout",
          payment_method_type: action.paymentMethodType,
          shipping_method: action.order.getIn(["shippingRate", "name"]),
        })
      }
      break
    }

    case ActionTypes.ADDRESS_BOOK_ACTION_DIALOG_NEW_CLICKED: {
      trackEvent("Shipping Address Started", {
        is_logged_in: true,
      })
      break
    }

    case ActionTypes.BILLING_INFORMATION_ADD_FAILED: {
      trackEvent("Billing Failed", {
        error: action.error.toJS(),
        is_logged_in: true,
      })
      break
    }

    case ActionTypes.BILLING_INFORMATION_PAYMENT_TYPE_CHANGED: {
      trackEvent("Billing Information payment type changed", {
        paymentType: action.value,
      })
      break
    }

    case ActionTypes.CHECKOUT_CLICKED: {
      trackEvent("Checkout Clicked", {
        is_logged_in: action.isLoggedIn,
      })
      break
    }

    case ActionTypes.CHECKOUT_STARTED: {
      trackEvent("Checkout Started", {
        currency: "USD",
        discount: store.getState().getIn(["order", "promotion", "totalNumeric"], 0),
        is_logged_in: true,
        location: "checkout",
        order_id: store.getState().getIn(["order", "number"]),
        products: store.getState().getIn(["order", "items"], {}).toJS(),
        shipping: store.getState().getIn(["order", "shippingRate", "totalNumeric"], 0),
        step: store.getState().getIn(["order", "currentStep"]) + 1,
        tax: store.getState().getIn(["order", "taxTotalNumeric"]),
      })
      break
    }

    case ActionTypes.CHECKOUT_STEP_VIEWED: {
      trackEvent("Checkout Step Viewed", {
        is_logged_in: true,
        location: "checkout",
        order_id: store.getState().getIn(["order", "number"]),
        shipping_method: store.getState().getIn(["order", "shippingRate", "name"], ""),
        step: store.getState().getIn(["order", "currentStep"]) + 1,
      })
      break
    }

    case ActionTypes.CHECKOUT_STEP_COMPLETED: {
      trackEvent("Checkout Step Completed", {
        is_logged_in: true,
        location: "checkout",
        order_id: store.getState().getIn(["order", "number"]),
        shipping_method: store.getState().getIn(["order", "shippingRate", "name"]),
        step: store.getState().getIn(["order", "currentStep"]),
      })
      break
    }

    case ActionTypes.PAYPAL_BUTTON_CLICKED: {
      trackEvent("Clicked Paypal", {
        is_logged_in: true,
        location: "checkout",
        order_number: store.getState().getIn(["order", "number"]),
      })
      break
    }

    case ActionTypes.ORDER_SUBMIT_PROMO_CODE_SUCCEEDED: {
      const willApplyPromoCode = !store.getState().getIn(["order", "promoCodeDetails", "isPromoCodeApplied"])
      if (willApplyPromoCode) {
        trackEvent("Coupon Applied", {
          coupon_id: action.order.getIn(["promotion", "code"]),
          discount: action.order.getIn(["promotion", "totalNumeric"]),
          is_logged_in: true,
          location: "checkout",
          order_id: action.order.get("number"),
        })
      }
      break
    }

    case ActionTypes.ORDER_SUBMIT_PROMO_CODE_FAILED: {
      trackEvent("Coupon Denied", {
        coupon_id: store.getState().getIn(["order", "promoCodeDetails", "code"]),
        is_logged_in: true,
        location: "checkout",
        order_id: store.getState().getIn(["order", "number"]),
        reason: action.error.toJS(),
      })
      break
    }

    case ActionTypes.CART_PAYPAL_BUTTON_CLICKED: {
      trackEvent("Payment Method Selected", {
        location: "cart",
        type: "paypal",
      })
      break
    }

    case ActionTypes.APPLE_PAY_BUTTON_CLICKED: {
      trackEvent("Payment Method Selected", {
        location: "cart",
        type: "apple pay",
      })
      break
    }

    case ActionTypes.ORDER_EMAIL_UPDATE_SUCCEEDED: {
      trackEvent("Order Review Step Completed", {
        location: "checkout",
        step: "1",
        step_name: "contact-info",
      })
      break
    }

    case ActionTypes.ORDER_EDIT_BILLING_CTA_CLICKED: {
      trackEvent("Edit Billing Selected", {
        location: "checkout",
      })
      break
    }

    case ActionTypes.PROMO_CODE_ENTERED: {
      trackEvent("Coupon Entered", {
        coupon_id: store.getState().getIn(["order", "promoCodeDetails", "code"]),
        is_logged_in: true,
        location: "checkout",
        order_id: store.getState().getIn(["order", "number"]),
      })
      break
    }

    case ActionTypes.APPLE_PAY_ORDER_SUBMIT_COMPLETE_SUCCEEDED:
    case ActionTypes.ORDER_SUBMIT_COMPLETE_SUCCEEDED: {
      const order = action.order
      const paymentTypes = []
      if (order.get("paidWithAffirm")) {
        paymentTypes.push("affirm")
      }
      if (order.getIn(["creditCard", "type"])){
        paymentTypes.push(order.getIn(["creditCard", "type"]))
      }
      if (findGiftCardPayment(order.get("payments"))){
        paymentTypes.push("gift card")
      }
      trackEvent("Order Completed", {
        coupon: order.getIn(["promotion", "code"]),
        currency: "USD",
        discount: order.getIn(["promotion", "totalNumeric"], 0),
        is_logged_in: true,
        location: "checkout",
        order_id: order.get("number"),
        payment_source: action.type === "APPLE_PAY_ORDER_SUBMIT_COMPLETE_SUCCEEDED" ? "apple pay" : null,
        payment_type: paymentTypes.join(" & "),
        products: toDecamelizedJSON(order.get("items", {})),
        quantity: order.get("itemCount"),
        repeat: order.get("isFirstCompletedOrder"),
        revenue: order.get("revenue"),
        shipping: order.getIn(["shippingRate", "totalNumeric"], 0),
        shipping_country: order.getIn(["address", "country", "code"]),
        source: "website",
        tax: order.get("taxTotalNumeric"),
        total: order.get("totalNumeric"),
      })
      break
    }

    case ActionTypes.ADDRESS_BOOK_UPDATE_SUCCEEDED: {
      trackEvent("Shipping Address Saved", {
        country_code: action.newAddress.get("countryCode"),
        is_default: action.newAddress.get("default"),
        is_logged_in: true,
      })
      break
    }

    case ActionTypes.ADDRESS_BOOK_DELETE_SUCCEEDED: {
      const step = Number(store.getState().getIn(["order", "currentStep"])) + 1
      trackEvent("Shipping Address Deleted", {
        id: action.addressId,
        is_logged_in: true,
        step,
      })
      break
    }

    case ActionTypes.UPDATE_ORDER_ADDRESS_SUCCEEDED: {
      const step = Number(store.getState().getIn(["order", "currentStep"])) + 1
      trackEvent("Shipping Address Selected", {
        id: action.addressId,
        is_logged_in: true,
        location: "checkout",
        step,
      })
      break
    }

    case ActionTypes.VISA_CHECKOUT_STARTED:
    case ActionTypes.WALLET_OPEN_CLICKED:
    case ActionTypes.WALLET_ADD_NEW_PAYMENT_CLICKED: {
      trackEvent("Card Started", {
        is_logged_in: true,
        payment_method_type: action.paymentMethodType,
      })
      break
    }

    case ActionTypes.WALLET_ADD_PAYMENT_SUCCEEDED: {
      trackEvent("Card Saved", {
        is_default: action.newPayment.get("isDefault"),
        is_logged_in: true,
        is_saved_for_future_use: action.newPayment.get("isInWallet"),
        payment_method_type: action.paymentMethodType,
      })
      break
    }

    case ActionTypes.WALLET_DELETE_PAYMENT_SUCCEEDED: {
      const step = Number(store.getState().getIn(["order", "currentStep"])) + 1
      trackEvent("Card Deleted", {
        id: action.paymentId,
        is_logged_in: true,
        step,
      })
      break
    }

    case ActionTypes.ORDER_UPDATE_SUCCEEDED: {
      const step = Number(store.getState().getIn(["order", "currentStep"])) + 1
      trackEvent("Card Selected", {
        id: action.paymentId,
        is_logged_in: true,
        location: "checkout",
        step,
      })
      break
    }

    case ActionTypes.ORDER_FATAL_ERROR_RECEIVED:
    case ActionTypes.ORDER_NOT_FOUND: {
      const step = Number(store.getState().getIn(["order", "currentStep"])) + 1
      trackEvent("Fatal Error in Checkout", {
        error: action.error.toJS(),
        is_logged_in: true,
        location: "checkout",
        step,
      })
      break
    }

    case ActionTypes.SUGGESTED_ITEM_ADDED_TO_CART: {
      trackEvent("Suggested Item Added To Cart", {
        color: action.suggestedItem.getIn(["color", "name"]),
        sku: action.suggestedItem.get("productSku"),
        slug: action.suggestedItem.get("productSlug"),
      })
      break
    }

    case ActionTypes.SUGGESTED_ITEM_DISMISSED: {
      trackEvent("Suggested Item Dismissed", {
        color: action.suggestedItem.getIn(["color", "name"]),
        sku: action.suggestedItem.get("productSku"),
        slug: action.suggestedItem.get("productSlug"),
      })
      break
    }

    case ActionTypes.SUGGESTED_ITEM_FETCH_SUCCEEDED: {
      trackEvent("Suggested Item Displayed In Cart", {
        color: action.suggestedItem.getIn(["color", "name"]),
        sku: action.suggestedItem.get("productSku"),
        slug: action.suggestedItem.get("productSlug"),
      })
      break
    }

    case ActionTypes.SUGGESTED_ITEM_PRODUCT_PREVIEW_CLICKED: {
      trackEvent("Suggested Item Product Preview Clicked", {
        sku: action.sku,
        slug: action.slug,
        ...action.selectedOptions,
      })
      break
    }

    case ActionTypes.GUIDESHOP_APPOINTMENT_WINDOW_OPENED: {
      trackEvent("Brickwork Appointment Started", {
        location: "guideshop",
        position: action.position,
      })
      break
    }

    case ActionTypes.GUIDESHOP_APPOINTMENT_CREATED: {
      trackEvent("Brickwork Appointment Completed", {
        location: "guideshop",
        appointment_id: action.appointment_id,
        store_id: action.store_id,
      })
      break
    }

    case ActionTypes.ACCOUNT_ORDER_CANCEL_CLICKED: {
      trackEvent("Order Cancel Clicked", {
        shipmentNumber: action.shipmentNumber,
      })
      break
    }

    case ActionTypes.ACCOUNT_ORDER_DETAIL_TOGGLED: {
      trackEvent("Order Details Viewed", {
        toggleState: action.toggleState,
      })
      break
    }

    case ActionTypes.ACCOUNT_ORDER_RETURN_TOGGLED: {
      trackEvent("Return Viewed", {
        toggleState: action.toggleState,
      })
      break
    }

    case ActionTypes.ACCOUNT_ORDER_EXCHANGE_CLICKED: {
      trackEvent("Exchange Clicked", {
        hasFinalSaleItem: action.hasFinalSaleItem,
      })
      break
    }

    case ActionTypes.ACCOUNT_ORDER_TRACK_CLICKED: {
      trackEvent("Order Tracked")
      break
    }

    case ActionTypes.ACCOUNT_ORDER_PRINT_RETURN_LABEL_CLICKED: {
      trackEvent("Return Label Printed")
      break
    }

    case ActionTypes.EXCHANGE_START_CLICKED: {
      const { description, isMarkdown, name, originalPrice, price, masterSku, sku } = action.segmentInfo
      trackEvent("Exchange Started", {
        location: "exchanges",
        is_markdown: isMarkdown,
        name,
        original_price: originalPrice,
        price,
        product_id: masterSku,
        sku,
        variant: description,
      })
      break
    }

    case ActionTypes.EXCHANGE_ITEM_COMPLETED: {
      const { name, optionsText, masterSku, sku } = action.segmentInfo
      trackEvent("Exchange Completed", {
        location: "exchanges",
        name,
        product_id: masterSku,
        sku,
        variant: optionsText,
      })
      break
    }

    case ActionTypes.FIT_PREFERENCES_OPTION_TOGGLED: {
      trackEvent("Fit Preferences Options Clicked", { ...action.data })
      break
    }

    case ActionTypes.SORT_MOUSE_ENTERED: {
      const pageType = store.getState().getIn(["filters", "currentPage"])
      const categorySlug = store.getState().getIn(["category", "slug"])

      trackEvent("Sort Menu Opened", {
        category: pageType === "Category" && categorySlug ? categorySlug.split("/")[0] : pageType,
        list_id: pageType === "Category" ? categorySlug : pageType,
        location: pageType.toLowerCase(),
      })
      break
    }

    case ActionTypes.SORT_DROPDOWN_CLICKED: {
      const pageType = store.getState().getIn(["filters", "currentPage"])
      const categorySlug = store.getState().getIn(["category", "slug"])
      if (!store.getState().getIn(["sort", "isOpen"])) {
        trackEvent("Sort Menu Opened", {
          category: pageType === "Category" && categorySlug ? categorySlug.split("/")[0] : pageType,
          list_id: pageType === "Category" ? categorySlug : pageType,
          location: pageType.toLowerCase(),
        })
      }
      break
    }

    case ActionTypes.SORT_DROPDOWN_VALUE_CLICKED: {
      const pageType = store.getState().getIn(["filters", "currentPage"])
      const categorySlug = store.getState().getIn(["category", "slug"])
      trackEvent("Product List Sorted", {
        category: pageType === "Category" && categorySlug ? categorySlug.split("/")[0] : pageType,
        list_id: pageType === "Category" ? categorySlug : pageType,
        location: pageType.toLowerCase(),
        sort_order_value: action.sortOption.get("name"),
      })
      break
    }

    case ActionTypes.SEARCH_AUTOSUGGEST_CLICKED: {
      const { target, suggestion } = action
      trackEvent("Search Autosuggest Clicked", {
        suggestion,
        target,
      })
      break
    }

    case ActionTypes.CART_IS_GIFT_INPUT_TOGGLED: {
      trackEvent("Cart isGift Input Toggled", {
        cart_id: store.getState().getIn(["cart", "number"]),
        is_gift: store.getState().getIn(["cart", "isGift"]),
      })
      break
    }

    case ActionTypes.SEARCH_REDIRECT_TRIGGERED: {
      const { term } = action
      trackEvent("Search Redirect Triggered", {
        term,
      })
      break
    }

    case ActionTypes.SALESFORCE_CHAT_CLICKED: {
      trackEvent("Salesforce Chat Button Clicked")
      break
    }

    case ActionTypes.SALESFORCE_CHAT_ESTABLISHED: {
      const { liveAgentChatSessionKey } = action
      trackEvent("Salesforce Chat Established", { liveAgentChatSessionKey })
      break
    }

    case ActionTypes.PRODUCT_RECOMMENDATION_CLICKED: {
      const { color, sku, slug } = action
      trackEvent("Product Recommendation Clicked", {
        color,
        path: store.getState().getIn(["currentPage", "path"]),
        sku,
        slug,
      })
      break
    }

    case ActionTypes.PRODUCT_RECOMMENDATIONS_DISPLAYED: {
      trackEvent("Product Recommendations Displayed", { path: store.getState().getIn(["currentPage", "path"]) })
      break
    }

    case ActionTypes.PRODUCT_DETAIL_POWER_REVIEWS_DISPLAYED: {
      trackEvent("Product Reviews Displayed", {
        averageRating: action.averageRating,
        path: store.getState().getIn(["currentPage", "path"]),
        reviewsCount: action.reviewsCount,
      })
      break
    }

    case ActionTypes.PRODUCT_TILE_CLICKED: {
      trackEvent("Product Tile Clicked", {
        path: store.getState().getIn(["currentPage", "path"]),
        product: action.product,
      })
      break
    }

    case ActionTypes.AFFIRM_CHECKOUT_MODAL_CLOSED: {
      trackEvent("Affirm Checkout Modal Closed", {
        location: "checkout",
        orderNumber: store.getState().getIn(["order", "number"]),
      })
      break
    }

    case ActionTypes.AFFIRM_CHECKOUT_MODAL_OPENED: {
      trackEvent("Affirm Checkout Modal Opened", {
        location: "checkout",
        orderNumber: store.getState().getIn(["order", "number"]),
      })
      break
    }

    case ActionTypes.AFFIRM_CHECKOUT_FAILED: {
      trackEvent("Affirm Checkout Failed", {
        location: "checkout",
        orderNumber: store.getState().getIn(["order", "number"]),
      })
      break
    }

    case ActionTypes.AFFIRM_CHECKOUT_SUCCEEDED: {
      trackEvent("Affirm Checkout Succeeded", {
        location: "checkout",
        orderNumber: store.getState().getIn(["order", "number"]),
      })
      break
    }

    case ActionTypes.AFFIRM_ESTIMATE_CLICKED: {
      trackEvent("Affirm Estimate Clicked", {
        product: action.product,
        source: action.source,
        totalAmount: action.totalAmount,
      })
      break
    }

    case ActionTypes.GIFT_CARD_BALANCE_CHECKED: {
      const properties = {}
      if (store.getState().getIn(["currentPage", "path"]).includes("account")){
        properties.location = "account"

      } else {
        properties.location = "checkout"
        properties.step = store.getState().getIn(["order","currentStep"]) + 1
      }

      trackEvent("Gift Card Balance Checked", {
        ...properties,
      })
      break
    }

    case ActionTypes.REMOVE_GIFT_CARD_REQUEST_SUCCEEDED: {
      trackEvent("Gift Card Removed", {
        location: "checkout",
        step: store.getState().getIn(["order","currentStep"]) + 1,
      })
      break
    }

    case ActionTypes.SECURITY_CODE_VALIDATION_FORM_SHOWN: {
      trackEvent("CVV Revalidation Displayed", {
        email: store.getState().getIn(["auth","email"]),
        location: "checkout",
      })
      break
    }

    case ActionTypes.SECURITY_CODE_VALIDATION_ATTEMPTED: {
      trackEvent("CVV Revalidation Verify Attempted", {
        email: store.getState().getIn(["auth","email"]),
        location: "checkout",
        success: action.wasSuccess,
      })
      break
    }
  }

  return next(action)
}

export default analyticsMiddleware
