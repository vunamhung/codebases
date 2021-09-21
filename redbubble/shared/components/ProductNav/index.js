import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { withAnalytics } from '@redbubble/boom-analytics';
import ProductNav from '@redbubble/design-system/react/ProductNav';
import withUserInfo from '../../containers/apollo/withUserInfo';
import withGlobalNavigation from '../../containers/apollo/withGlobalNavigation';
import { withPropsAndFragment as withProps } from '../../containers/wecompose';

const ComposedProductNav = compose(
  injectIntl,
  withAnalytics,
  withUserInfo,
  withGlobalNavigation,
  withProps(({ globalNavigation, browser, ...ownProps }) => ({
    ...ownProps,
    items: globalNavigation,
    isClientSideRoutingEnabled: true,
  })),
)(ProductNav);

export default ComposedProductNav;
