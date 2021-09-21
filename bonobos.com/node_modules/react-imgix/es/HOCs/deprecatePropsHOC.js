function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import { warning } from "../common";
var DEPRECATED_PROPS = ["auto", "crop", "fit"];

var deprecatePropsHOC = function deprecatePropsHOC(WrappedComponent) {
  var WithDeprecatedProps = function WithDeprecatedProps(props) {
    var imgixParams = _objectSpread({}, props.customParams || {}, props.imgixParams);

    var propsWithOutDeprecated = _objectSpread({}, props, {
      imgixParams: imgixParams
    });

    DEPRECATED_PROPS.forEach(function (deprecatedProp) {
      warning(!(deprecatedProp in props), "The prop '".concat(deprecatedProp, "' has been deprecated and will be removed in v9. Please update the usage to <Imgix imgixParams={{").concat(deprecatedProp, ": value}} />"));

      if (deprecatedProp in props) {
        delete propsWithOutDeprecated[deprecatedProp];
        imgixParams[deprecatedProp] = props[deprecatedProp];
      }
    });
    warning(!("customParams" in props), "The prop 'customParams' has been replaced with 'imgixParams' and will be removed in v9. Please update usage to <Imgix imgixParams={customParams} />");
    delete propsWithOutDeprecated.customParams;

    if (props.faces) {
      warning(false, "The prop 'faces' has been deprecated and will be removed in v9. Please update the usage to <Imgix imgixParams={{crop: 'faces'}} />");
      delete propsWithOutDeprecated.faces;

      if (!imgixParams.crop) {
        imgixParams.crop = "faces";
      }
    }

    if (props.entropy) {
      warning(false, "The prop 'entropy' has been deprecated and will be removed in v9. Please update the usage to <Imgix imgixParams={{crop: 'entropy'}} />");
      delete propsWithOutDeprecated.entropy;

      if (!imgixParams.crop) {
        imgixParams.crop = "entropy";
      }
    }

    return React.createElement(WrappedComponent, propsWithOutDeprecated);
  };

  WithDeprecatedProps.propTypes = _objectSpread({}, WrappedComponent.propTypes, {
    auto: PropTypes.array,
    customParams: PropTypes.object,
    crop: PropTypes.string,
    entropy: PropTypes.bool,
    faces: PropTypes.bool,
    fit: PropTypes.string
  });
  WithDeprecatedProps.defaultProps = {
    imgixParams: {}
  };
  WithDeprecatedProps.displayName = "WithDeprecatedProps(".concat(WrappedComponent.displayName, ")");
  return WithDeprecatedProps;
};

export { deprecatePropsHOC };
//# sourceMappingURL=deprecatePropsHOC.js.map