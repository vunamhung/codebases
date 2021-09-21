export { default as CONSTANTS } from "./constants";
export { default as warning } from "warning";
export { default as shallowEqual } from "shallowequal";
export { default as config } from "./config"; // Taken from https://github.com/reduxjs/redux/blob/v4.0.0/src/compose.js

export function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}
//# sourceMappingURL=common.js.map