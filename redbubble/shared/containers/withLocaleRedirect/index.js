import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import config from '../../../config';
import { historyPropType } from '../../lib/propTypes';
import { userInfoPropType } from '../../containers/apollo/withUserInfo';

const defaultLocale = 'en';

const localeConfig = config('availableLocales');

const removeLocalePrefix = (path, locale) => {
  let newPath = path;

  if (path.startsWith(`/${locale}/`)) {
    newPath = path.replace(`/${locale}`, '');
  }

  return newPath;
};

const historyFunc = (staticContext, path, userInfoLocaleEnabled, history) => {
  if (!userInfoLocaleEnabled) {
    staticContext.url = path; // eslint-disable-line no-param-reassign
  } else if (typeof window !== 'undefined') {
    history.replace(path);
  }
};

export default (Component) => {
  class Redirector extends React.Component {
    componentDidMount() {
      const {
        staticContext,
        userInfoLoading,
        enabledLocales,
        history,
        userInfo,
        match: {
          params: {
            locale,
          },
        },
        historyFunction,
      } = this.props;

      const isUserInfoLocaleAvailable = !!localeConfig[userInfo.locale];

      const path = `${get(history, 'location.pathname', '')}${get(history, 'location.search', '')}`;

      const localeInUrl = locale || defaultLocale;
      const redirectDisabled = new RegExp(/[?&]noLocaleRedirect=true/g).test(path);

      if (!isUserInfoLocaleAvailable) return;
      if (userInfoLoading) return;
      if (userInfo.locale !== 'en' && redirectDisabled) return;

      const localesDontMatch = localeInUrl !== userInfo.locale;
      const userInfoLocaleEnabled = (enabledLocales
        && enabledLocales.find(lokale => lokale.name === userInfo.locale)
        && localeInUrl !== userInfo.locale);

      if (localesDontMatch || userInfoLocaleEnabled) {
        const localeConfigValue = get(localeConfig, userInfo.locale, localeConfig[defaultLocale]);
        const cleanedPath = `${localeConfigValue.urlSegment}${removeLocalePrefix(path, localeInUrl)}`;

        historyFunction(staticContext, cleanedPath, userInfoLocaleEnabled, history);
      }
    }

    render() {
      return (<Component {...this.props} />);
    }
  }

  Redirector.displayName = 'Redirector';

  Redirector.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    staticContext: PropTypes.object,
    url: PropTypes.string,
    userInfoLoading: PropTypes.bool.isRequired,
    userInfo: userInfoPropType,
    match: PropTypes.shape({
      params: PropTypes.shape({
        locale: PropTypes.string,
      }),
    }),
    enabledLocales: PropTypes.arrayOf(PropTypes.shape(
      { name: PropTypes.string.isRequired,
        urlSegment: PropTypes.string.isRequired },
    )).isRequired,
    history: historyPropType.isRequired,
    historyFunction: PropTypes.func,
  };

  Redirector.defaultProps = {
    url: '',
    userInfo: {},
    match: { params: { locale: '' } },
    historyFunction: historyFunc,
    staticContext: {},
  };

  return Redirector;
};
