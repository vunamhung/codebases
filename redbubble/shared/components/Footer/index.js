import Footer from '@redbubble/design-system/react/Footer';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';
import { withAnalytics } from '@redbubble/boom-analytics';
import withToggleMatureContent from '../../containers/apollo/withToggleMatureContent';
import withUserInfo from '../../containers/apollo/withUserInfo';
import { withPropsAndFragment as withProps } from '../../containers/wecompose';

const ComposedFooter = compose(
  injectIntl,
  withToggleMatureContent,
  withAnalytics,
  withUserInfo,
  withProps(({ userInfo, userInfoLoading }) => {
    if (!userInfoLoading) return {};

    return {
      userInfo: {
        country: '',
        currency: '',
        ...userInfo,
      },
    };
  }),
)(Footer);

export default ComposedFooter;
