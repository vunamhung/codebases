import PropTypes from 'prop-types';

export const historyPropType = PropTypes.shape({
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    state: PropTypes.object,
  }),
  replace: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
});
