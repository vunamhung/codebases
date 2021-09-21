import React from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import get from 'lodash/get';
import { withAnalytics } from '@redbubble/boom-analytics';
/* eslint-disable import/first */
import Header, { PromoMessage } from '@redbubble/design-system/react/Header';
/* eslint-enable import/first */
import withUserInfo from '../../containers/apollo/withUserInfo';
import withBannerMessages from '../../containers/apollo/withBannerMessages';
import withUserAccount from '../../containers/apollo/withUserAccount';
import withCart from '../../containers/apollo/withCart';
import withReferer from '../../containers/redux/withReferer';
import withBrowserInfo from '../../containers/redux/withBrowserInfo';
import withSearch from '../../containers/redux/withSearch';
import { withPropsAndFragment as withProps } from '../../containers/wecompose';
import withGlobalNavigation from '../../containers/apollo/withGlobalNavigation';
import withLoginSignupModal from '../../containers/withLoginSignupModal';
import { LOGIN, SIGNUP } from '../LoginSignup';

const NO_BANNERS_WHITELIST = ['/shop/picks/'];


const HeaderWithBanner = (props) => {
  const { banners, profile, ...rest } = props;
  return (
    <React.Fragment>
      <PromoMessage banners={banners} profile={profile} />
      <Header {...rest} profile={profile} />
    </React.Fragment>
  );
};

const ComposedHeader = compose(
  injectIntl,
  withSearch,
  withRouter,
  withAnalytics,
  withUserInfo,
  withCart,
  withProps(({ userInfo, ...ownProps }) => ({
    ...ownProps,
    locale: userInfo.locale,
    countryCode: userInfo.country,
  })),
  withUserAccount,
  withReferer,
  withBrowserInfo,
  withBannerMessages,
  withLoginSignupModal,
  withProps(({
    browser,
    profile,
    userInfo,
    messages,
    cart,
    busy,
    count,
    history,
    doSearch,
    parsedQuery,
    filter,
    productContext,
    openLoginSignupModal,
    ...ownProps
  }) => {
    const pathname = get(history, 'location.pathname', '');
    const locale = get(userInfo, 'locale');
    const isLoggedIn = get(userInfo, 'isLoggedIn');

    const banners = NO_BANNERS_WHITELIST.some(p => pathname.includes(p)) ? null : ownProps.banners;

    return {
      ...ownProps,
      cart: {
        ...cart,
        busy,
        itemsCount: count || get(cart, 'totalItems'),
      },
      searchProductContext: productContext,
      doSearch: (newTerm, newProductContext) => {
        if ((!newProductContext && !productContext) || (productContext && !newProductContext)) {
          doSearch(history, newTerm);
        } else {
          doSearch(
            history,
            newTerm,
            parsedQuery,
            filter,
            locale,
            newProductContext || productContext,
          );
        }
      },
      banners,
      doLogin: (e) => {
        e.preventDefault();
        openLoginSignupModal({ initialForm: LOGIN, analyticsLabel: 'toolbar' });
      },
      doSignup: (e) => {
        e.preventDefault();
        openLoginSignupModal({ initialForm: SIGNUP, analyticsLabel: 'toolbar' });
      },
      onHeartClick: isLoggedIn ? undefined : (e) => {
        e.preventDefault();
        openLoginSignupModal({ initialForm: SIGNUP, analyticsLabel: 'heart-header' });
      },
    };
  }),
  withGlobalNavigation,
)(HeaderWithBanner);


export default ComposedHeader;
