// Drop-in replacement for recompose, which causes certain
// deprecation warnings. It is unlikely to be fixed as the
// package does not appear to be actively maintained and there
// is an open issue about it. We mostly use compose and withProps
// which are pretty simple functions. The difference amounts to
// the modifications we had in our wrapper for withProps.
// Here we mimic the original, and our wrapper that adds fragment
// and handles displayName in a slightly different way.

import { createElement } from 'react';
import { compose } from 'redux';

const identity = Component => Component;
const createFactory = Type => createElement.bind(null, Type);

export const mapProps = propsMapper => (BaseComponent) => {
  const factory = createFactory(BaseComponent);
  const MapProps = props => factory(propsMapper(props));
  return MapProps;
};

const reWithProps = input => (
  mapProps(props => ({
    ...props,
    ...(typeof input === 'function' ? input(props) : input),
  }))
);

export const withPropsAndFragment = transformFunc => (Component) => {
  const withPropTransform = compose(
    reWithProps(transformFunc),
  )(Component);

  withPropTransform.displayName = Component.displayName;
  withPropTransform.fragment = Component.fragment;

  return withPropTransform;
};

export const withProps = transformFunc => (Component) => {
  const withPropTransform = compose(
    reWithProps(transformFunc),
  )(Component);

  const name = Component.displayName || Component.name || 'Component';
  withPropTransform.displayName = `withProps(${name})`;

  return withPropTransform;
};

export const branch = (test, left, right = identity) => (BaseComponent) => {
  let leftFactory;
  let rightFactory;

  const Branch = (props) => {
    if (test(props)) {
      leftFactory = leftFactory || createFactory(left(BaseComponent));
      return leftFactory(props);
    }
    rightFactory = rightFactory || createFactory(right(BaseComponent));
    return rightFactory(props);
  };

  const name = BaseComponent.displayName || BaseComponent.name || 'Component';
  Branch.displayName = `branch(${name})`;

  return Branch;
};

