"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getType = getType;
/**
 * 获取变量的类型字符串表示
 * @param {*} v - 要检查类型的变量
 * @returns {string} 变量的类型字符串
 */
function getType(v) {
  if (v === null) return "null";
  if (typeof v === "object") {
    return Object.prototype.toString.call(v).slice(8, -1).toLowerCase();
  }
  return typeof v;
}