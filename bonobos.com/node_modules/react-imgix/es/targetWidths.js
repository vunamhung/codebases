function targetWidths() {
  var resolutions = [];
  var prev = 100;
  var INCREMENT_PERCENTAGE = 8;
  var MAX_SIZE = 8192;

  var ensureEven = function ensureEven(n) {
    return 2 * Math.round(n / 2);
  };

  resolutions.push(prev);

  while (prev <= MAX_SIZE) {
    prev *= 1 + INCREMENT_PERCENTAGE / 100 * 2;
    resolutions.push(ensureEven(prev));
  }

  return resolutions;
}

export default targetWidths();
//# sourceMappingURL=targetWidths.js.map