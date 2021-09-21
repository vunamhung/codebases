import PropTypes from 'prop-types';
import { isValidElementType } from 'react-is';

import { hasAttribute, getAttributeValue } from '../../lib/inventory';

const VariableComponent = ({
  experienceName,
  experiences,
  map,
  children,
  fallback,
}) => {
  if (!children) return null;

  if (!hasAttribute(experiences, experienceName)) {
    if (!fallback) return null;
    return children(fallback);
  }

  const experienceValue = getAttributeValue(experiences, experienceName);
  if (experienceValue === false) return null;

  const Component = map[experienceValue];
  return children(Component);
};

VariableComponent.displayName = 'VariableComponent';

export const attributeShape = PropTypes.shape({
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
});

VariableComponent.propTypes = {
  experiences: PropTypes.arrayOf(attributeShape).isRequired,
  experienceName: PropTypes.string.isRequired,
  /* eslint-disable react/forbid-prop-types */
  map: PropTypes.object,
  /* eslint-enable react/forbid-prop-types */
  children: PropTypes.func,
  fallback: (props, propName) => {
    if (props[propName] && !isValidElementType(props[propName])) {
      return new Error(
        'Invalid prop \'fallback\' supplied to \'VariableComponent\': the prop is not a valid React component',
      );
    }

    return undefined;
  },
};

VariableComponent.defaultProps = {
  children: null,
  map: {},
  fallback: null,
};

export default VariableComponent;
