import React, { Fragment } from "react"
import ImmutablePropTypes from "react-immutable-proptypes"
import PropTypes from "prop-types"
import classNames from "classnames"
import { List, Map } from "immutable"
import { categoryGroupOffset } from "highline/redux/helpers/category_helper"
import debounce from "lodash.debounce"
import { detectSmartphoneWidth, detectTabletWidth } from "highline/utils/viewport"
import CategoryHead from "highline/components/category/category_head"
import CategoryExpandedLayout from "highline/components/category/category_expanded_layout"
import CategoryHybridLayout from "highline/components/category/category_hybrid_layout"
import Breadcrumbs from "highline/components/breadcrumbs"
import EmptyResults from "highline/components/category/empty_results"
import FiltersContainer from "highline/containers/filters_container"
import MobileFiltersContainer from "highline/containers/mobile_filters_container"
import CategoryNavigationV2Container from "highline/containers/category_navigation_v2_container"
import AppliedFilters from "highline/components/category/applied_filters"
import Markdown from "highline/components/markdown"
import { ChevronIcons } from "highline/components/icons"
import { camelize } from "humps"
import SortContainer from "highline/containers/sort_container"
import NavigationPillsSlider from "highline/components/category/navigation_pills_slider"
import { getField, getBundlePromoTileData } from "highline/utils/contentful/contentful_helper"
import BackToTopButton from "highline/components/back_to_top_button.js"
import Hero from "highline/components/homepage/hero"
import { ContentfulSitewidePromo } from "highline/components/contentful/contentful_sitewide_promo_component"
import { renderContentfulComponent } from "highline/utils/contentful/component_helper"
import styles from "highline/styles/components/category/category.module.css"

const RESIZE_DEBOUNCE_TIMEOUT = 200

class Category extends React.PureComponent {
  state = { isSmartphone: true, isTablet: true }

  componentDidMount() {
    const {
      getOptionValueIds,
      optionTypes,
    } = this.props

    if (window.location.hash) {
      setTimeout(() => {
        window.scrollBy(0, -categoryGroupOffset)
      }, 200)
    }

    window.addEventListener("resize", this.handleResize)
    this.setState({
      isSmartphone: detectSmartphoneWidth(),
      isTablet: detectTabletWidth(),
    })

    if (optionTypes.isEmpty()) getOptionValueIds()
  }

  componentDidUpdate(prevProps) {
    const {
      loadCategory,
      pageLoaded,
    } = prevProps

    const pageJustFinishedLoading = (!pageLoaded && this.props.pageLoaded)
    const hasQueryParams = !!window.location.search

    // Need to do category fetch client side for constructor personalization (stored via cookie)
    // Waiting until the page is loaded also allows us to wait for auth token
    if (pageJustFinishedLoading) loadCategory(hasQueryParams)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
  }

  handleResize = () => {
    debounce(() => {
      this.setState({
        isSmartphone: detectSmartphoneWidth(),
        isTablet: detectTabletWidth(),
      })
    }, RESIZE_DEBOUNCE_TIMEOUT)()
  }

  renderHeader = () => {
    const {
      isTablet,
    } = this.state

    const {
      breadcrumbs,
      editorial,
      isFeaturedShop,
      handleBreadcrumbClick,
      name,
      expandedItem,
      activeItem,
      trackNavPillItemClick,
      handleSaveToMyFitClick,
      heroImageDesktop,
      heroImageMobile,
      slug,
      plpContentBlocks,
      userHasFitPreferences,
      contentfulAnalyticCallbackFn,
    } = this.props

    const isBundleFeaturedShop = isFeaturedShop && slug.includes("bundles")
    const shouldShowFilters = !isBundleFeaturedShop
    const upperPlpContentBlocks = getField(plpContentBlocks.find((contentBlock) => getField(contentBlock, "isAbove")), "content")

    return (
      <Fragment>
        { upperPlpContentBlocks && !upperPlpContentBlocks.isEmpty() && upperPlpContentBlocks.map(
          (component, index) => renderContentfulComponent(component, contentfulAnalyticCallbackFn, `plp-content-block-${index}`))
        }
        { isTablet &&
          <div className={ styles.breadCrumbWrapper }>
            <Breadcrumbs
              disableLastItem
              layout="header"
              items={ breadcrumbs }
              onClick={ handleBreadcrumbClick }
            />
          </div>
        }
        { (heroImageDesktop && !isTablet) &&
         <Hero
           className={ styles.heroImage }
           altText={ `Header showing products for the ${name} category` }
           landscapeSrc={ heroImageDesktop }
         >
         </Hero>
        }
        { (heroImageMobile && isTablet) &&
          <Hero
            className={ styles.heroImage }
            altText={ `Header showing products for the ${name} category` }
            portraitSrc={ heroImageMobile }
          >
          </Hero>
        }
        { !isTablet &&
          <div className={ styles.breadCrumbWrapper }>
            <Breadcrumbs
              disableLastItem
              layout="header"
              items={ breadcrumbs }
              onClick={ handleBreadcrumbClick }
            />
          </div>
        }
        { (isTablet && heroImageMobile || !isTablet) &&
          <div className={ styles.header }>
            <h1>{ name }</h1>
            { editorial && editorial.get("description") && <h2> { editorial.get("description") }</h2> }
            { editorial && editorial.get("subDescription") && <h3> { editorial.get("subDescription") }</h3> }
          </div>
        }
        <div className={ classNames([styles.navigationWrapper]) }>
          { isTablet &&
              <Fragment>
                <CategoryNavigationV2Container showForSmartPhoneAndTablet />
                { shouldShowFilters &&
                  <MobileFiltersContainer
                    handleSaveToMyFitClick={ handleSaveToMyFitClick }
                    userHasFitPreferences={ userHasFitPreferences }
                  />
                }
              </Fragment>
          }
        </div>
        { expandedItem && expandedItem.get("children") && ( expandedItem.get("children").size >= 1 ) &&
          <div className={ styles.scrollArea }>
            <NavigationPillsSlider
              activePath={ activeItem.get("path") }
              expandedItem={ expandedItem }
              onClick={ trackNavPillItemClick }
            />
          </div>
        }
        <SortContainer responsiveLayout="hideOnDesktop" />
      </Fragment>
    )
  }

  renderStandardLayout() {
    const {
      isTablet,
    } = this.state

    const {
      appliedFilters,
      bundlePromoTiles,
      groups,
      handleProductImageHover,
      handleQuickAddClick,
      name,
      onSavedItemCtaClick,
      savedItems,
      selectedFilters,
      slug,
    } = this.props

    const promoTiles = bundlePromoTiles.get(camelize(slug)) // TODO: Not sure this works. Investigate and fix if broken

    return (
      <CategoryExpandedLayout
        bundlePromoTileData={ promoTiles && promoTiles.get(0) }
        name={ name }
        groups={ groups }
        appliedFilters={ appliedFilters }
        handleProductImageHover={ handleProductImageHover }
        handleQuickAddClick={ handleQuickAddClick }
        isTablet={ isTablet }
        onSavedItemCtaClick= { onSavedItemCtaClick }
        savedItems={ savedItems }
        selectedFilters={ selectedFilters }
      />
    )
  }

  renderSwatchLayout()  {
    const {
      isSmartphone,
      isTablet,
    } = this.state

    const {
      bundlePromoTiles,
      handleProductTileClick,
      handlePromoTileClick,
      handleQuickAddClick,
      handleSwatchMouseEnter,
      handleSwatchMouseLeave,
      handleSwatchClick,
      items,
      itemsDetails,
      name,
      onSavedItemCtaClick,
      sharedProductsData,
      selectedFilters,
      slug,
      hasNextPage,
      loadMore,
      isLoadingMore,
    } = this.props

    return (
      <CategoryHybridLayout
        bundlePromoTileData={ getField(getBundlePromoTileData(bundlePromoTiles, selectedFilters, slug), "content") }
        isMobile={ isSmartphone }
        isTablet={ isTablet }
        selectedFilters={ selectedFilters }
        handlePromoTileClick= { handlePromoTileClick }
        handleQuickAddClick={ handleQuickAddClick }
        items={ items }
        itemsDetails={ itemsDetails }
        name={ name }
        sharedProductsData={ sharedProductsData }
        slug={ slug }
        onSavedItemCtaClick= { onSavedItemCtaClick }
        handleProductTileClick= { handleProductTileClick }
        handleSwatchClick={ handleSwatchClick }
        handleSwatchMouseEnter={ handleSwatchMouseEnter }
        handleSwatchMouseLeave={ handleSwatchMouseLeave }
        hasNextPage={ hasNextPage }
        loadMore={ loadMore }
        isLoadingMore={ isLoadingMore }
      />
    )
  }

  renderContent() {
    const {
      isTablet,
    } = this.state

    const {
      appliedFilters,
      availableFilters,
      groups,
      handleClearFiltersClick,
      handleNarrativeClick,
      handleSaveToMyFitClick,
      isFeaturedShop,
      isLoggedIn,
      isNarrativeCollapsed,
      items,
      myFitEnabled,
      narrative,
      plpContentBlocks,
      slug,
      userHasFitPreferences,
      contentfulAnalyticCallbackFn,
    } = this.props

    const { isSmartphone } = this.state
    const lowerPlpContentBlocks = getField(plpContentBlocks.find((contentBlock) => !getField(contentBlock, "isAbove")), "content")

    const isStandardLayout = isFeaturedShop
    const isSwatchLayout = !isStandardLayout

    if (
      (isStandardLayout && groups.isEmpty()) ||
      (isSwatchLayout && items.isEmpty())
    ) {
      // If there are available filters and there are no items, assume all item have been filtered out (as opposed to an empty category)
      const areAllItemsFilteredOut = !availableFilters.isEmpty()
      return <EmptyResults onClick={ handleClearFiltersClick } areAllItemsFilteredOut={ areAllItemsFilteredOut } />
    }

    const isBundleFeaturedShop = isFeaturedShop && slug.includes("bundles")
    const shouldShowFilters = !isBundleFeaturedShop

    return (
      <div className={ styles.categoryGroupContainer }>
        { !isTablet && <CategoryNavigationV2Container  /> }
        <div className={ styles.productWrapper }>
          <ContentfulSitewidePromo page={ "plp" } />
          { lowerPlpContentBlocks && !lowerPlpContentBlocks.isEmpty() && lowerPlpContentBlocks.map(
            (component, index) => renderContentfulComponent(component, contentfulAnalyticCallbackFn, `plp-content-block-${index}`))
          }
          { shouldShowFilters &&
            <div className={ styles.navigationWrapper }>
              { !isTablet &&  <FiltersContainer /> }
            </div>
          }
          { !appliedFilters.isEmpty() &&
            <AppliedFilters
              appliedFilters={ appliedFilters }
              handleSaveToMyFitClick={ handleSaveToMyFitClick }
              isLoggedIn={ isLoggedIn }
              myFitEnabled={ myFitEnabled }
              onClearClick={ handleClearFiltersClick }
              userHasFitPreferences={ userHasFitPreferences }
            />
          }
          { isStandardLayout && this.renderStandardLayout() }
          { isSwatchLayout && this.renderSwatchLayout() }
          { narrative &&
            <Markdown
              align="center"
              source={ narrative }
              className={
                classNames(
                  styles.narrative,
                  isSmartphone && isNarrativeCollapsed && styles.collapsed,
                )
              }
            />
          }
        </div>

        { narrative && isSmartphone &&
          <button
            className={ styles.chevronButton }
            aria-label={ `${isNarrativeCollapsed ? "Expand" : "Collapse"} narrative` }
            onClick={ handleNarrativeClick }
          >
            <div
              className={
                classNames(
                  styles.chevron,
                  !isNarrativeCollapsed && styles.chevronUp,
                )
              }
            >
              <ChevronIcons.Left />
            </div>
          </button>
        }
      </div>
    )
  }

  render() {
    const {
      breadcrumbs,
      categoryId,
      handleBackToTopClick,
      metaCanonicalPath,
      metaDescription,
      metaTitle,
      name,
    } = this.props

    const { isSmartphone } = this.state

    return (
      <div
        className={
          classNames(
            "component",
            "category-component",
            styles.component,
          )
        }
        data-category-id={ categoryId }
      >
        <CategoryHead
          breadcrumbs={ breadcrumbs }
          metaCanonicalPath={ metaCanonicalPath }
          metaDescription={ metaDescription }
          metaTitle={ metaTitle }
          name={ name }
        />

        { this.renderHeader() }

        { this.renderContent() }

        { !isSmartphone &&
          <BackToTopButton onClick={ handleBackToTopClick } />
        }
      </div>
    )
  }
}

Category.propTypes = {
  activeItem: ImmutablePropTypes.map,
  appliedFilters: ImmutablePropTypes.listOf(
    ImmutablePropTypes.map,
  ),
  availableFilters: ImmutablePropTypes.listOf(
    ImmutablePropTypes.map,
  ),
  breadcrumbs: ImmutablePropTypes.listOf(
    ImmutablePropTypes.map,
  ),
  bundlePromoTiles: ImmutablePropTypes.list,
  categoryId: PropTypes.number,
  editorial: ImmutablePropTypes.map,
  expandedItem: ImmutablePropTypes.map,
  getOptionValueIds: PropTypes.func,
  groups: ImmutablePropTypes.listOf(
    ImmutablePropTypes.map,
  ),
  handleBackToTopClick: PropTypes.func,
  handleBreadcrumbClick: PropTypes.func,
  handleClearFiltersClick: PropTypes.func,
  handleNarrativeClick: PropTypes.func,
  handleNavClick: PropTypes.func,
  handleProductImageHover: PropTypes.func,
  handleProductTileClick: PropTypes.func,
  handlePromoTileClick: PropTypes.func,
  handleQuickAddClick: PropTypes.func,
  handleSaveToMyFitClick: PropTypes.func,
  handleSwatchClick: PropTypes.func,
  handleSwatchMouseEnter: PropTypes.func,
  handleSwatchMouseLeave: PropTypes.func,
  heroImageDesktop: PropTypes.string,
  heroImageMobile: PropTypes.string,
  isFeaturedShop: PropTypes.bool,
  isHeaderMinified: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  isNarrativeCollapsed: PropTypes.bool,
  items: ImmutablePropTypes.list,
  itemsDetails: ImmutablePropTypes.map,
  loadCategory: PropTypes.func,
  metaCanonicalPath: PropTypes.string,
  metaDescription: PropTypes.string,
  metaTitle: PropTypes.string,
  myFitEnabled: PropTypes.bool,
  name: PropTypes.string,
  narrative: PropTypes.string,
  navigationItems: ImmutablePropTypes.list,
  onSavedItemCtaClick: PropTypes.func,
  onCategoryChanged: PropTypes.func,
  optionTypes: ImmutablePropTypes.map,
  pageLoaded: PropTypes.bool,
  plpContentBlocks: ImmutablePropTypes.list,
  savedItems: ImmutablePropTypes.listOf(
    ImmutablePropTypes.map,
  ),
  selectedFilters: ImmutablePropTypes.map,
  sharedProductsData: ImmutablePropTypes.map,
  slug: PropTypes.string,
  trackNavPillItemClick: PropTypes.func,
  hasNextPage: PropTypes.bool,
  loadMore: PropTypes.func,
  isLoadingMore: PropTypes.bool,
  userHasFitPreferences: PropTypes.bool,
  contentfulAnalyticCallbackFn: PropTypes.func,
}

Category.defaultProps = {
  appliedFilters: List(),
  availableFilters: List(),
  breadcrumbs: List(),
  bundlePromoTiles: List(),
  getOptionValueIds: () => {},
  groups: List(),
  handleNarrativeClick: () => {},
  handleSaveToMyFitClick: () => {},
  isFeaturedShop: false,
  isHeaderMinified: false,
  isLoggedIn: false,
  isNarrativeCollapsed: true,
  loadCategory: () => {},
  metaCanonicalPath: "",
  metaDescription: "",
  metaTitle: "",
  myFitEnabled: false,
  narrative: "",
  optionTypes: Map(),
  plpContentBlocks: List(),
  savedItems: List(),
  selectedFilters: Map(),
  slug: "",
  hasNextPage: false,
  userHasFitPreferences: false,
  contentfulAnalyticCallbackFn: () => {},
}

export default Category
