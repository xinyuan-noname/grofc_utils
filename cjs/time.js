"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isExpired = isExpired;
var _guard = require("./guard");
/**
 * 
 * @param {Date|string|number} time 
 * @param {`${number}${"ms"|"s"|"min"|"h"|"d"}`} expire 
 * @returns 
 */
function isExpired(time, expire) {
  (0, _guard.throwIfIsNotString)(expire);
  const match = expire.match(/^(\d+)(ms|s|min|h|d)$/);
  if (!match) throw new TypeError(`Expected ${expire} to be a string like "1ms", "1s", "1min", "1h" or "1d", but got ${JSON.stringify(expire)}`);
  const [, toleranceStr, unit] = match;
  const tolerance = Number(toleranceStr);
  (0, _guard.throwIfIsNotPositiveFiniteNumber)(tolerance);
  time = time instanceof Date ? time : new Date(time);
  (0, _guard.throwIfIsInvalidDate)(time, "time");
  const now = new Date();
  const delta = now.getTime() - time.getTime();
  switch (unit) {
    case "ms":
      return delta > tolerance;
    case "s":
      return delta > tolerance * 1_000;
    case "min":
      return delta > tolerance * 60_000;
    case "h":
      return delta > tolerance * 3600_000;
    case "d":
      return delta > tolerance * 86400_000;
    default:
      throw new Error(`Unexpected unit: ${unit}`);
  }
}