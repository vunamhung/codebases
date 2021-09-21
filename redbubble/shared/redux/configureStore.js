import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { middleware as analyticsMiddleware } from '@redbubble/boom-analytics';
import getReducers from './reducers';

/* eslint-disable no-underscore-dangle */
const devToolsEnabled =
  process.env.NODE_ENV === 'development' &&
  typeof window !== 'undefined' &&
  typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined';

const devTools = devToolsEnabled ?
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() :
  f => f;
/* eslint-enable */

function configureStore(initialState, config = {}) {
  const { analyticsClient, dataLayer } = config;

  const middlewares = [];

  if (typeof window !== 'undefined') {
    middlewares.push(
      thunk.withExtraArgument({ analytics: analyticsClient }),
      analyticsMiddleware(analyticsClient, dataLayer),
    );
  }

  const enhancers = [devTools];

  const composedEnhancers = compose(
    applyMiddleware(...middlewares),
    ...enhancers,
  );

  const store = createStore(getReducers(), initialState || {}, composedEnhancers);

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default; // eslint-disable-line global-require

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

export default configureStore;
