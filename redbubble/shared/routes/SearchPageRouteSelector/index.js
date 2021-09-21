import get from 'lodash/get';
import React from 'react';
import { compose } from 'redux';
import { isConfiguredLandingPageSlug } from './configuredLandingPageOverrides';
import AsyncLandingPageRoute from '../AsyncLandingPageRoute';
import AsyncSearchResultPageRoute from '../AsyncSearchResultPageRoute';

const routeWithEdgeCache = ({ ttl }) => Component => (props) => {
  if (props.staticContext) {
    // eslint-disable-next-line no-param-reassign
    props.staticContext.cacheTtl = ttl;
  }
  return <Component {...props} />;
};

const ShopSearchPageSelector = (props) => {
  if (isConfiguredLandingPageSlug(get(props, 'match.params.query'))) {
    const landingPageParams = {
      configureLandingPageSlug: get(props, 'match.params.query', null),
      pagePathPrefix: '/shop',
    };
    const updatedProps = { ...props, ...landingPageParams };
    const LandingPageRoute =
      compose(
        routeWithEdgeCache({ ttl: 10800 }),
      )(AsyncLandingPageRoute);
    return <LandingPageRoute {...updatedProps} />;
  }
  return <AsyncSearchResultPageRoute {...props} />;
};

export default ShopSearchPageSelector;
