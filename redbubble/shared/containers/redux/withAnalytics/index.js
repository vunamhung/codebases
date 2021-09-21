// TODO: This should actually live in js-packages/boom-analytics
// Then we can remove this code from here and Explore.
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { actions } from '@redbubble/boom-analytics';

export const useAnalyticsActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => bindActionCreators(actions, dispatch), [dispatch]);
};
