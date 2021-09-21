import { compose } from 'redux';
import { withPropsAndFragment as withProps } from '../wecompose';
import withToggleList from '../apollo/withToggleList';
import withListPicker from '../withListPicker';
import withListNotifications from '../withListNotifications';

const withListManagerContainer = (Component) => {
  const withListManager = compose(
    withToggleList,
    withListPicker,
    withListNotifications,
    withProps(({
      openListNotification,
      openListPicker,
      addItemToList,
      removeItemFromList,
      addItemToDefaultList,
      ...rest
    }) => {
      return {
        listManager: {
          openListNotification,
          openListPicker,
          addItemToList,
          removeItemFromList,
          addItemToDefaultList,
        },
        ...rest,
      };
    }),
  )(Component);

  withListManager.displayName = Component.displayName;
  withListManager.fragment = Component.fragment;

  return withListManager;
};

export default withListManagerContainer;
