function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from "react";
import { warning, shallowEqual } from "../common";

var ShouldComponentUpdateHOC = function ShouldComponentUpdateHOC(WrappedComponent) {
  var ShouldComponentUpdateHOC =
  /*#__PURE__*/
  function (_Component) {
    _inherits(ShouldComponentUpdateHOC, _Component);

    function ShouldComponentUpdateHOC() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, ShouldComponentUpdateHOC);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ShouldComponentUpdateHOC)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "shouldComponentUpdate", function (nextProps) {
        var props = _this.props;
        warning(nextProps.onMounted == _this.props.onMounted, "props.onMounted() is changing between renders. This is probably not intended. Ensure that a class method is being passed to Imgix rather than a function that is created every render. If this is intended, ignore this warning.");

        var customizer = function customizer(oldProp, newProp, key) {
          if (key === "children") {
            return shallowEqual(oldProp, newProp);
          }

          if (key === "imgixParams") {
            return shallowEqual(oldProp, newProp, function (a, b) {
              if (Array.isArray(a)) {
                return shallowEqual(a, b);
              }

              return undefined;
            });
          }

          if (key === "htmlAttributes") {
            return shallowEqual(oldProp, newProp);
          }

          if (key === "attributeConfig") {
            return shallowEqual(oldProp, newProp);
          }

          return undefined; // handled by shallowEqual
        };

        var propsAreEqual = shallowEqual(props, nextProps, customizer);
        return !propsAreEqual;
      });

      return _this;
    }

    _createClass(ShouldComponentUpdateHOC, [{
      key: "render",
      value: function render() {
        return React.createElement(WrappedComponent, this.props);
      }
    }]);

    return ShouldComponentUpdateHOC;
  }(Component);

  ShouldComponentUpdateHOC.displayName = "ShouldComponentUpdateHOC(".concat(WrappedComponent.displayName, ")");
  return ShouldComponentUpdateHOC;
};

export { ShouldComponentUpdateHOC };
//# sourceMappingURL=shouldComponentUpdateHOC.js.map