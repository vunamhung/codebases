import React from "react"
import "highline/lib/polyfills/ie11"
import PropTypes from "prop-types"
import Router from "next/router"
import Head from "next/head"
import dynamic from "next/dynamic"
import { connect } from "react-redux"
import BrowserCompatibilityModalContainer from "highline/containers/browser_compatibility_modal_container"
import CustomError from "highline/components/error_page/custom_error"
import getConfig from "highline/config/application"
import ABTasty from "highline/components/ab_tasty"
import Footer from "highline/components/application/footer"
import HeaderV2Container from "highline/containers/header_v2_container"
import TippyTopContainer from "highline/containers/tippy_top_container"
import ToastContainer from "highline/containers/toast_container"
import initAnalytics from "highline/utils/segment/analytics"
import initHotjar from "highline/utils/hotjar"
import initSalesforceLiveAgent from "highline/utils/salesforce_live_agent"
import { registerInputEvents } from "highline/utils/input_events"
import LoadingCurtain from "highline/components/loading_curtain"
import ApplePayLoadingContainer from "highline/containers/apple_pay_loading_container"
import { showLoading, hideLoading } from "react-redux-loading-bar"
import { onSalesforceChatClicked, onSalesforceChatEstablished } from "highline/utils/salesforce_tracking_helper"
import {
  browserHistoryNavigated,
  pageLoaded,
  routeChangedAsync,
  routeChangeStarted,
} from "highline/redux/actions/application_layout_actions"
import { triggerNewCustomerModalByPageVisitAsync } from "highline/redux/actions/new_customer_modal_actions"
import { loadCartItemCountAsync } from "highline/redux/actions/cart_actions"
import { reduxWrapper } from "highline/redux/store"
import { getAnyPageProps } from "highline/utils/app_data_fetch"
import classNames from "classnames"
import styles from "highline/styles/layouts/with_application_layout.module.css"
import Script from "next/script"

const mapStateToProps = (state) => {
  return {
    isLeftDrawerOpen: state.getIn(["leftDrawer", "isOpen"]),
    isLoading: state.getIn(["navigation", "isLoading"]),
    isMinified: state.getIn(["header", "isMinified"]),
    isRightDrawerOpen: state.getIn(["rightDrawer", "isOpen"]),
    isModalActive: !(state.getIn(["contentful", "activeModal"]).isEmpty()) && !(state.getIn(["contentful", "activeModal", "isOnPageLoadModal"])),
    isNewCustomerModalActive: state.getIn(["newCustomerModal", "showModal"]),
  }
}

const DynamicContentfulModalContainer = dynamic(() => 
  import("highline/containers/contentful_modal_container"),
)

const DynamicRightDrawerContainer = dynamic(() =>
  import("highline/containers/right_drawer_container"),
)

const DynamicLeftDrawerContainer = dynamic(() =>
  import("highline/containers/left_drawer_container"),
)

const DynamicNewCustomerModalContainer = dynamic(() => 
  import("highline/containers/new_customer_modal_container"),
)

function wrapPageWithLayout(WrappedComponent) {
  class ApplicationLayout extends React.PureComponent {
    static propTypes = {
      canonicalPath: PropTypes.string.isRequired,
      dispatch: PropTypes.func,
      errorStatusCode: PropTypes.number,
      isLeftDrawerOpen: PropTypes.bool,
      isLoading: PropTypes.bool,
      isMinified: PropTypes.bool,
      isRightDrawerOpen: PropTypes.bool,
      lastModified: PropTypes.string,
      metaDescription: PropTypes.string,
      metaImageLinkOg: PropTypes.string,
      metaImageLinkTwitter: PropTypes.string,
      noIndexTag: PropTypes.bool,
      pageCategory: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      isModalActive: PropTypes.bool,
      isNewCustomerModalActive: PropTypes.bool,
    }

    static defaultProps = {
      dispatch: () => {},
      isLeftDrawerOpen: false,
      isRightDrawerOpen: false,
      metaDescription: "Free shipping and returns. Bonobos, home of better-fitting menswear and an easier shopping experience.",
      noIndexTag: false,
    }

    // eslint-disable-next-line react/sort-comp
    static getInitialProps = WrappedComponent.getInitialProps === undefined
      ? undefined
      : reduxWrapper.getInitialPageProps((store) => (
        async (getInitalPropsCtx) => await getAnyPageProps(store, getInitalPropsCtx, undefined, WrappedComponent.getInitialProps)
      ))

    componentDidMount() {
      const { hotjarId, hotjarSv, segmentKey } = getConfig()

      registerInputEvents()
      initAnalytics(segmentKey)

      if (hotjarId && hotjarSv)
        initHotjar(hotjarId, hotjarSv)

      initSalesforceLiveAgent(
        onSalesforceChatClicked(this.props.dispatch),
        onSalesforceChatEstablished(this.props.dispatch),
      )

      this.props.dispatch(pageLoaded(
        this.props.pageCategory,
        this.props.title,
      ))

      this.props.dispatch(loadCartItemCountAsync())

      Router.onRouteChangeStart = (url) => {
        this.props.dispatch(showLoading())
        this.props.dispatch(routeChangeStarted(url))
      }

      Router.onRouteChangeComplete = (url) => {
        this.props.dispatch(hideLoading())
        this.props.dispatch(routeChangedAsync(
          this.props.pageCategory,
          this.props.title,
          url,
        ))
      }

      this.props.dispatch(triggerNewCustomerModalByPageVisitAsync())
      window.addEventListener("popstate", this.onPopState)
    }

    componentDidUpdate(prevProps) {
      if (prevProps.canonicalPath !== this.props.canonicalPath) {
        this.props.dispatch(triggerNewCustomerModalByPageVisitAsync())
      }
    }

    componentWillUnmount() {
      Router.onRouteChangeComplete = null
      Router.onRouteChangeStart = null
      window.removeEventListener("popstate", this.onPopState)
    }

    onPopState = (e) => {
      this.props.dispatch(browserHistoryNavigated(e))
    }

    render() {
      const {
        canonicalPath,
        errorStatusCode,
        metaDescription,
        metaImageLinkOg,
        metaImageLinkTwitter,
        lastModifiedTime,
        noIndexTag,
        pageCategory,
        publishedTime,
        title,
        isLoading,
        isMinified,
        isLeftDrawerOpen,
        isRightDrawerOpen,
        isModalActive,
        isNewCustomerModalActive,
      } = this.props

      if (errorStatusCode) {
        return <CustomError statusCode={ errorStatusCode } />
      }

      const { googleReCaptchaSiteKey } = getConfig()
      return (
        <div
          id="layout-wrapper"
          className={ classNames(
            styles.applicationLayout,
            isMinified && styles.minified,
          ) }
          data-page-category={ pageCategory }
        >
          <Head>
            <title key="title">{ title }</title>
            <link key="canonical" href={ `https://bonobos.com${ canonicalPath }` } rel="canonical" />
            <meta key="meta-description" content={ metaDescription } name="description" property="og:description" />
            <meta name="google-site-verification" content="0KjUdlypIBCci3KHlZBP-ucr2I8TdFt1QSXFN90_QLg" />
            { noIndexTag && <meta name="robots" content="noindex" /> }
            <meta property="og:type" content="website" />
            <meta property="og:title" content={ title } />
            <meta property="og:description" content= { metaDescription } />
            <meta property="og:site_name" content="https://bonobos.com/" />
            <meta property="og:url" content={ `https://bonobos.com${ canonicalPath }` } />
            { metaImageLinkOg && <meta property="og:image" content={ metaImageLinkOg } /> }
            { lastModifiedTime && <meta property="article:modified_time" content={ lastModifiedTime } /> }
            { publishedTime && <meta property="article:published_time" content={ publishedTime } /> }
            <meta property="article:author" content="Bonobos" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@Bonobos" />
            <meta name="twitter:title" content={ title } />
            <meta name="twitter:description" content= { metaDescription } />
            { metaImageLinkTwitter && <meta name="twitter:image" content={ metaImageLinkTwitter } /> }
            <ABTasty />
          </Head>

          <ApplePayLoadingContainer />

          {isNewCustomerModalActive && <DynamicNewCustomerModalContainer />}

          {isModalActive && <DynamicContentfulModalContainer />}

          <TippyTopContainer />

          <HeaderV2Container />

          <ToastContainer />

          <div className={ styles.pageContent }>
            <LoadingCurtain
              delay={ 0 }
              show={ isLoading }
              layout={ "dark" }
            />

            {isLeftDrawerOpen && <DynamicLeftDrawerContainer />}

            {isRightDrawerOpen && <DynamicRightDrawerContainer />}

            <div className={ styles.mainContentContainer }>
              <div className={ styles.topContent }></div>

              { /* Page Content */ }
              <div className={ styles.mainContent } id="main-content">
                <WrappedComponent { ...this.props } />
              </div>

              <BrowserCompatibilityModalContainer />

              <div className={ styles.bottomContent }>
                <Footer />
              </div>
            </div>
          </div>

          <Script src="https://cnstrc.com/js/cust/bonobos_ui_Ue9o-Y.js" strategy="lazyOnload" />
          <Script
            src={ `https://www.google.com/recaptcha/api.js?render=${ googleReCaptchaSiteKey }` }
            strategy="lazyOnload"
          />
        </div>
      )
    }
  }

  return connect(
    mapStateToProps,
    (dispatch) => ({ dispatch }),
  )(ApplicationLayout)
}

export default function withLayout(WrappedComponent) {
  return reduxWrapper.withRedux(wrapPageWithLayout(WrappedComponent))
}
