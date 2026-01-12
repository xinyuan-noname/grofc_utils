"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isExpired = isExpired;
var _guard = require("./guard");
function isExpired(time, tolerance = 0, unit = "ms") {
  time = time instanceof Date ? time : new Date(time);
  (0, _guard.throwIfIsInvalidDate)(time, "time");
  const now = new Date();
  const delta = now.getTime() - time.getTime();
  switch (unit) {
    case "ms":
      return delta > tolerance;
    case "s":
      return delta > tolerance * 1e3;
    case "min":
      return delta > tolerance * 60e3;
    case "h":
      return delta > tolerance * 60e3 * 60;
    case "d":
      return delta > tolerance * 60e3 * 60 * 24;
  }
}