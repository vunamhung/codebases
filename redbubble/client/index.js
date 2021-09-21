/* eslint-disable global-require */
import React from 'react';
import { hydrate } from 'react-dom';
import get from 'lodash/get';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Loadable from 'react-loadable';
import { compose } from 'redux';
import { ApolloProvider } from '@apollo/react-common';
import { SessionContextProvider, SessionContextConsumer } from '@redbubble/boom-session-context';
import { createGaClient, DataLayer } from '@redbubble/boom-analytics';
import { IntlProvider } from 'react-intl';
import SegmentProvider from '@redbubble/react-segment/SegmentProvider';
import config from '../config';
import configureStore from '../shared/redux/configureStore';
import createApolloClient from '../shared/apollo';
import { unescapeDangerouslySetValues } from '../shared/lib/security/dangerouslySetting';
import ReactHotLoader from './components/ReactHotLoader';
import App from '../shared/App';
import withUserInfo from '../shared/containers/apollo/withUserInfo';
import withUserLocation from '../shared/containers/redux/withUserLocation';
import withBrowserInfo from '../shared/containers/redux/withBrowserInfo';
import { clientError } from '../shared/lib/errorReporting';
import { QuickCartContextProvider } from '../shared/components/QuickCart/useQuickCartContext';
import { BNPLPaypalContextProvider } from '../shared/components/BNPLMessaging/useBNPLPaypalContext';

// react-intl locale for supported languages
import './i18n/supportedLanguages';

// Set Webpack's publicPath based on CDN_BASE_URL
// This is done at runtime to avoid hard-coding environment specifics
// into our assets.
// For more information see https://webpack.js.org/guides/public-path/#on-the-fly.
if (config('environment') !== 'development') {
  // eslint-disable-next-line no-underscore-dangle, camelcase, no-undef
  __webpack_public_path__ = config('publicClientBundleUrl');
}

// Get the DOM Element that will host our React application.
const container = document.querySelector('#app');

// Does the user's browser support the HTML5 history API?
// If the user's browser doesn't support the HTML5 history API then we
// will force full page refreshes on each page change.
const supportsHistory = 'pushState' in window.history;

// eslint-disable-next-line no-underscore-dangle
const reduxState = unescapeDangerouslySetValues(window.__REDUX_STATE__);
// eslint-disable-next-line no-underscore-dangle
const apolloState = unescapeDangerouslySetValues(window.__APOLLO_STATE__);
// eslint-disable-next-line no-underscore-dangle
const localizedMessages = window.__LOCALIZED_MESSAGES__;
// eslint-disable-next-line no-underscore-dangle
const locale = window.__CURRENT_LOCALE__;

const apolloClient = createApolloClient({
  ssrForceFetchDelay: 100,
}, apolloState);

const gaAccountId = config('gaAccount');
const storeConfig = {};

if (gaAccountId) {
  const analyticsClient = createGaClient(gaAccountId);
  analyticsClient.require('ec');

  storeConfig.analyticsClient = analyticsClient;
  storeConfig.dataLayer = new DataLayer(window.dataLayer);
}

const store = configureStore(reduxState, storeConfig);

/**
 * Renders the given React Application component.
 */
function renderApp(TheApp, theStore) {
  const ComposedApp = compose(
    withBrowserInfo,
    withUserInfo,
    withUserLocation,
  )(TheApp);

  // Firstly, define our full application component, wrapping the given
  // component app with a browser based version of react router.
  const app = (
    <ReactHotLoader>
      <ReduxProvider store={theStore}>
        <CookiesProvider>
          <ApolloProvider client={apolloClient}>
            <SessionContextProvider isServer={false}>
              <IntlProvider locale={locale} messages={localizedMessages}>
                <BrowserRouter forceRefresh={!supportsHistory}>
                  <QuickCartContextProvider>
                    <BNPLPaypalContextProvider>
                      <SessionContextConsumer>
                        {(sessionContext) => {
                          const segmentFeatureEnabled = get(sessionContext, 'features', []).includes('segment');
                          const isBot = get(sessionContext, 'isBot', false);
                          const segmentEnabled = segmentFeatureEnabled && !isBot;

                          return (
                            <SegmentProvider
                              writeKey={config('segmentWriteKey')}
                              cdnSourceDomain={config('segmentCdnSourceDomain')}
                              enabled={segmentEnabled}
                              onError={clientError}
                            >
                              <ComposedApp />
                            </SegmentProvider>
                          );
                        }}
                      </SessionContextConsumer>
                    </BNPLPaypalContextProvider>
                  </QuickCartContextProvider>
                </BrowserRouter>
              </IntlProvider>
            </SessionContextProvider>
          </ApolloProvider>
        </CookiesProvider>
      </ReduxProvider>
    </ReactHotLoader>
  );

  Loadable.preloadReady().then(() => {
    hydrate(app, container);
  });
}

// Execute the first render of our app.
renderApp(App, store);

// The following is needed so that we can support hot reloading our application.
if (process.env.BUILD_FLAG_IS_DEV === 'true' && module.hot) {
  // Accept changes to this file for hot reloading.
  module.hot.accept('./index.js');
  // Any changes to our App will cause a hotload re-render.
  module.hot.accept('../shared/App', () => {
    renderApp(require('../shared/App').default, store);
  });
}
