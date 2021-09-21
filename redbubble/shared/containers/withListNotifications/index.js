import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { openToast, updateToast } from '@redbubble/design-system/react/Toast';
import Button from '@redbubble/design-system/react/Button';
import * as constants from '@redbubble/design-system/react/constants';

import Notification from '../../components/Lists/Notification';

const withListNotificationsContainer = (Component) => {
  class withListNotifications extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        toastId: null,
      };

      this.openNotification = this.openNotification.bind(this);
    }

    openNotification({ item, listName, listId }) {
      const view = (
        <Notification previewImage={item.preview} listName={listName} listId={listId} />
      );
      const options = {
        action: ({ closeToast }) => (
          <Button
            data-testid="choose-list"
            onClick={() => {
              closeToast();
              this.props.openListPicker(item);
            }}
            intent={constants.PRIMARY}
            size={constants.SMALL}
          >
            <FormattedMessage defaultMessage="Choose list" />
          </Button>
        ),
        onClose: () => this.setState({ toastId: null }),
      };

      if (!this.state.toastId) {
        const id = openToast(view, options);
        this.setState({ toastId: id });
      } else {
        updateToast(this.state.toastId, { render: view, ...options });
      }
    }

    render() {
      return (
        <Component {...this.props} openListNotification={this.openNotification} />
      );
    }
  }

  withListNotifications.propTypes = {
    openListPicker: PropTypes.func.isRequired,
  };

  return withListNotifications;
};

export default withListNotificationsContainer;
