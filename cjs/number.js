"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clamp = clamp;
var _guard = require("./guard.js");
function clamp(value, min, max) {
  (0, _guard.throwIfIsNotComparableNumber)(value, "value");
  (0, _guard.throwIfIsNotComparableNumber)(min, "min");
  (0, _guard.throwIfIsNotComparableNumber)(max, "max");
  return Math.max(Math.min(value, max), min);
}