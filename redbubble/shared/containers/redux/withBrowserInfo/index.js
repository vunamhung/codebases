import { connect, useSelector } from 'react-redux';
import * as constants from '@redbubble/design-system/react/constants';
import get from 'lodash/get';
import PropTypes from 'prop-types';

const withBrowserInfo = connect(s => ({
  browser: s.browser,
  profile: get(s, 'browser.is.large') ? constants.DESKTOP : constants.MOBILE,
}));

export const useBrowserInfo = () => useSelector(s => s.browser);
export const useBrowserProfileInfo = () => {
  return useSelector((s) => {
    return get(s, 'browser.is.large') ? constants.DESKTOP : constants.MOBILE;
  });
};

export const browserPropType = PropTypes.shape({
  is: PropTypes.shape({
    small: PropTypes.bool,
    medium: PropTypes.bool,
    large: PropTypes.bool,
  }),
});


export default withBrowserInfo;
