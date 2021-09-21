import React, { useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { compose } from 'redux';
import { withAnalytics } from '@redbubble/boom-analytics';

import { analyticsPayload } from '../../lib/analytics';
import withBrowserInfo, { browserPropType as browserInfoShape } from '../redux/withBrowserInfo';

import Picker from '../../components/Lists/Picker';

const withListPickerContainer = (Component) => {
  const ListPicker = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [item, setItem] = useState(null);
    const profile = get(props, 'profile');
    const logEvent = get(props, 'logEvent');

    const closeListPicker = () => {
      setItem(null);
      setIsOpen(false);
    };

    const openListPicker = (activeItem) => {
      setItem(activeItem);
      logEvent({ analytics: analyticsPayload.openListPicker() });
      setIsOpen(true);
    };

    return (
      <React.Fragment>
        <Component {...props} openListPicker={openListPicker} />
        <Picker
          isOpen={isOpen}
          onCloseRequested={closeListPicker}
          item={item}
          profile={profile}
        />
      </React.Fragment>
    );
  };

  ListPicker.propTypes = {
    addItemToList: PropTypes.func.isRequired,
    removeItemFromList: PropTypes.func.isRequired,
    browser: browserInfoShape,
    logEvent: PropTypes.func,
  };

  ListPicker.defaultProps = {
    browser: null,
    logEvent: () => null,
  };

  return compose(
    withBrowserInfo,
    withAnalytics,
  )(ListPicker);
};

export default withListPickerContainer;
