import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '@redbubble/design-system/react/Text';
import get from 'lodash/get';
import '@redbubble/react-marketing/lib/styles.css';
import MarketingContainer from '@redbubble/react-marketing';
import createTracker from '@redbubble/boom-attribution';
import { useSessionContext } from '@redbubble/boom-session-context';
import DesignSystemProvider from '@redbubble/design-system/react/DesignSystemProvider';
import * as constants from '@redbubble/design-system/react/constants';
import defaultTheme from '@redbubble/design-system/react/themes/default';
import { useSegmentIdentify } from '@redbubble/react-segment';
import 'react-id-swiper/src/styles/css/swiper.css';
/* eslint-disable import/first */
import styles from './App.css';
/* eslint-enable import/first */
import { userInfoPropType } from './containers/apollo/withUserInfo';
import Routing from './components/Routing';
import config from '../config';
import routeConfig from './lib/routing/config';
import { datadogRUM } from './lib/datadogRUM';
import ProductNav from './components/ProductNav';
import ThemeSwitcher from './components/ThemeSwitcher';
import Header from './components/Header';
import Footer from './components/Footer';
import Helmet from './components/Helmet';
import QuickCart from './components/QuickCart';
import { useQuickCartContext } from './components/QuickCart/useQuickCartContext';
import useFeatureFlag from './hooks/useFeatureFlag';
import { inEuropeanUnion } from '../server/middleware/userLocation';

const App = (props) => {
  const [theme, setTheme] = useState(defaultTheme);

  const [showMarketing, setShowMarketing] = useState(true);
  const { userInfo, isServer, profile } = props;
  const locale = get(userInfo, 'locale') || 'en';
  const sessionContext = useSessionContext();
  const { isEnabled: isQuickCartEnabled, openQuickCart } = useQuickCartContext();
  // dd rum rollout
  const featureName = 'dd-rum';
  const [loading, featureEnabled] = useFeatureFlag(featureName);
  const enableDatadogRUM = !loading && featureEnabled && !sessionContext.isBot;

  useSegmentIdentify({
    locale,
    isLoggedIn: get(userInfo, 'isLoggedIn', false),
    userId: get(userInfo, 'federatedId'),
  });

  return (
    <div className={styles.app}>
      <DesignSystemProvider
        className={styles.dsWrapper}
        config={{
          theme,
          useToasts: { profile },
          tracker: {
            track: createTracker(sessionContext, config('attribution.baseUrl')),
          },
        }}
      >
        <Helmet locale={locale}>
          <script> {enableDatadogRUM && datadogRUM()} </script>
        </Helmet>

        <ThemeSwitcher theme={theme.name} onChange={setTheme} />

        <Header
          isServer={isServer}
          locale={locale}
          onCartClick={(e) => {
            if (isQuickCartEnabled) {
              e.preventDefault();
              openQuickCart();
            }
          }}
        />

        {isQuickCartEnabled && (
          <QuickCart profile={profile} isServer={isServer} />
        )}

        {profile === constants.DESKTOP && (
          <div data-product-nav>
            <ProductNav />
          </div>
        )}

        <Routing
          key="routing"
          routeConfig={routeConfig}
          staticContext={props.staticContext}
          isBot={props.isBot}
          browser={props.browser}
        />

        { showMarketing &&
          <MarketingContainer
            collapse
            showLoader
            timeout={15000}
            onFailure={() => setShowMarketing(false)}
            contentId="digioh-footer-signup"
            loaderStyles={{
              backgroundColor: 'transparent',
            }}
            containerStyles={{
              height: 210,
              position: 'relative',
              backgroundColor: 'var(--ds-color-white)',
              borderTop: '2px solid var(--ds-color-neutral-100)',
              borderBottom: '2px solid var(--ds-color-neutral-100)',
            }}
          />
        }

        <Footer
          baseUrl={config('rbmBaseWebUrl')}
          showCookiePolicyLink={inEuropeanUnion(get(userInfo, 'country', ''))}
        />
      </DesignSystemProvider>
    </div>
  );
};

App.propTypes = {
  userInfo: userInfoPropType,
  staticContext: PropTypes.shape({}),
  isServer: PropTypes.bool,
  isBot: PropTypes.bool,
  browser: PropTypes.shape({}).isRequired,
  profile: PropTypes.string,
  userLocation: PropTypes.shape({}),
};

App.defaultProps = {
  userInfo: {},
  staticContext: null,
  isServer: false,
  isBot: false,
  profile: '',
  userLocation: {},
};

export default App;
