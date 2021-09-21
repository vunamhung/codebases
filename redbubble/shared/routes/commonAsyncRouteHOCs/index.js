import { withAnalytics } from '@redbubble/boom-analytics';
import { withCookies } from 'react-cookie';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';

import withUserInfo from '../../containers/apollo/withUserInfo';
import withUserAccount from '../../containers/apollo/withUserAccount';
import withBrowserInfo from '../../containers/redux/withBrowserInfo';
import withLocaleRedirect from '../../containers/withLocaleRedirect';

export default compose(
  injectIntl,
  withCookies,
  withBrowserInfo,
  withUserInfo,
  withUserAccount,
  withAnalytics,
  withLocaleRedirect,
);

