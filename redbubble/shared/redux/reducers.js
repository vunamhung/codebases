import { combineReducers } from 'redux';
import { reducer as analytics } from '@redbubble/boom-analytics';
import { reducer as browser } from './ducks/browser';
import { reducer as referer } from './ducks/referer';
import { reducer as search } from './ducks/search';
import { reducer as user } from './ducks/user';
import { reducer as userLocation } from './ducks/userLocation';

const noop = (state = {}) => state;

export default function getReducers() {
  return combineReducers({
    browser,
    referer,
    search,
    analytics: typeof window === 'undefined' ? noop : analytics,
    user,
    userLocation,
  });
}
