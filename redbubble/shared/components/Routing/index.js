import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import get from 'lodash/get';
import styles from './Routing.css';

const Routing = ({ routeConfig, staticContext, isBot, browser }) => {
  const history = useHistory();
  const location = useLocation();

  /**
    * Whenever the location changes
    *
    * Scroll the page to the top if it wasn't a user hitting the back button
    * and we're not deliberately maintaining scroll
    */
  useEffect(() => {
    const isPageBack = get(history, 'action') === 'POP';
    const maintainScrollPosition = get(location, 'state.maintainScrollPosition', false);

    if (!isPageBack && !maintainScrollPosition) {
      window.scrollTo(0, 0);
    }
  }, [location, history]);

  return (
    <main className={styles.main}>
      <Switch>
        {routeConfig.map(route => (
          <Route
            key={`${route.path}_route`}
            {...route}
            render={routeProps =>
              route.render({ ...routeProps, isBot, staticContext, browser })
            }
          />
        ))}
      </Switch>
    </main>
  );
};

Routing.propTypes = {
  routeConfig: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    component: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]),
    render: PropTypes.func,
  })),
  staticContext: PropTypes.shape({}).isRequired,
  isBot: PropTypes.bool.isRequired,
  browser: PropTypes.shape({}).isRequired,
};

Routing.defaultProps = {
  routeConfig: [],
};

Routing.displayName = 'Routing';

export default Routing;
