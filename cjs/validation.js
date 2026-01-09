"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCnNameString = isCnNameString;
exports.isIntegerString = isIntegerString;
exports.isUnsignedIntegerString = isUnsignedIntegerString;
const checkValidRegExps = {
  isInteger: /^-?\d+$/,
  isUnsignedInteger: /^\d+$/,
  isCnName: /^[\u4e00-\u9fff]+(?:\u00b7[\u4e00-\u9fff]+)*$/
};
function isIntegerString(str) {
  return typeof str === "string" && checkValidRegExps.isInteger.test(str);
}
function isUnsignedIntegerString(str) {
  return typeof str === "string" && checkValidRegExps.isUnsignedInteger.test(str);
}
function isCnNameString(str) {
  return typeof str === "string" && checkValidRegExps.isCnName.test(str);
}