function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from "react";
import Measure, { withContentRect } from "react-measure";
import constructUrl from "./constructUrl";
import targetWidths from "./targetWidths";
import findClosest from "./findClosest";
var PACKAGE_VERSION = "8.6.1";

var noop = function noop() {};

var findNearestWidth = function findNearestWidth(actualWidth) {
  return findClosest(actualWidth, targetWidths);
};

var toFixed = function toFixed(dp, value) {
  return +value.toFixed(dp);
};

var BackgroundImpl = function BackgroundImpl(props) {
  var measureRef = props.measureRef,
      measure = props.measure,
      contentRect = props.contentRect,
      _props$imgixParams = props.imgixParams,
      imgixParams = _props$imgixParams === void 0 ? {} : _props$imgixParams,
      onLoad = props.onLoad,
      disableLibraryParam = props.disableLibraryParam,
      src = props.src,
      children = props.children,
      _props$className = props.className,
      className = _props$className === void 0 ? "" : _props$className;
  var forcedWidth = imgixParams.w,
      forcedHeight = imgixParams.h;
  var hasDOMDimensions = contentRect.bounds.top != null;
  var htmlAttributes = props.htmlAttributes || {};
  var dpr = toFixed(2, imgixParams.dpr || global.devicePixelRatio || 1);
  var ref = htmlAttributes.ref;

  var onRef = function onRef(el) {
    measureRef(el);

    if (typeof ref === "function") {
      ref(el);
    }
  };

  var _ref = function () {
    var bothWidthAndHeightPassed = forcedWidth != null && forcedHeight != null;

    if (bothWidthAndHeightPassed) {
      return {
        width: forcedWidth,
        height: forcedHeight
      };
    }

    if (!hasDOMDimensions) {
      return {
        width: undefined,
        height: undefined
      };
    }

    var ar = contentRect.bounds.width / contentRect.bounds.height;
    var neitherWidthNorHeightPassed = forcedWidth == null && forcedHeight == null;

    if (neitherWidthNorHeightPassed) {
      var _width = findNearestWidth(contentRect.bounds.width);

      var _height = Math.ceil(_width / ar);

      return {
        width: _width,
        height: _height
      };
    }

    if (forcedWidth != null) {
      var _height2 = Math.ceil(forcedWidth / ar);

      return {
        width: forcedWidth,
        height: _height2
      };
    } else if (forcedHeight != null) {
      var _width2 = Math.ceil(forcedHeight * ar);

      return {
        width: _width2,
        height: forcedHeight
      };
    }
  }(),
      width = _ref.width,
      height = _ref.height;

  var isReady = width != null && height != null;

  var commonProps = _objectSpread({}, htmlAttributes);

  if (!isReady) {
    return React.createElement("div", _extends({}, commonProps, {
      className: "react-imgix-bg-loading ".concat(className),
      ref: onRef
    }), children);
  }

  var renderedSrc = function () {
    var srcOptions = _objectSpread({
      fit: "crop"
    }, imgixParams, disableLibraryParam ? {} : {
      ixlib: "react-".concat(PACKAGE_VERSION)
    }, {
      width: width,
      height: height,
      dpr: dpr
    });

    return constructUrl(src, srcOptions);
  }();

  var style = _objectSpread({}, htmlAttributes.style, {
    backgroundImage: "url(".concat(renderedSrc, ")"),
    backgroundSize: (htmlAttributes.style || {}).backgroundSize !== undefined ? htmlAttributes.style.backgroundSize : "cover"
  });

  return React.createElement("div", _extends({}, commonProps, {
    className: className,
    ref: onRef,
    style: style
  }), children);
};

var Background = withContentRect("bounds")(BackgroundImpl);
export { Background, BackgroundImpl as __BackgroundImpl };
//# sourceMappingURL=react-imgix-bg.js.map