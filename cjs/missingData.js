"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forwardFill = forwardFill;
var _guard = require("./guard.js");
/**
 * 前向填充（forward-fill）输入数据，向前填充无效值。
 *
 * - 若输入为可迭代对象，将展开为迭代序列；若输入为非可迭代的对象，将包装为一个数组
 * - 函数默认舍弃先导无效值，除非设置了`defaultValue`
 * - 函数将以最近的上一次有效值填充无效值，无效值默认为 `undefined`
 * - 函数默认使用`Object.is`进行判断无效值，因此可传入`NaN`，也请注意区分`-0`和`+0`
 * - 对于传入的对象，函数不会进行拷贝，而是直接引用
 *
 * @template T
 * @param {T | Iterable<T>} inputData - 输入数据（一个值或可迭代对象等）
 * @param {{
 *   len?: number,
 *   invalidityChecker?: T | T[] | ((value: T) => boolean), 
 *   defaultValue?: T
 *   checkDefaultValue?: boolean
 * }} options
 * @param options.len - 期望输出的元素总数，当 `len` 未提供时，输出长度 = 从第一个有效值开始到输入结束的长度，且不会自动扩展。
 * @param options.invalidityChecker - 用于判断无效值的标准(默认: `undefined`)
 * @param options.defaultValue - 若提供，则用以填充前导无效值，默认开启有效性检查。
 * @param options.checkDefaultValue - 是否对 defaultValue 进行有效性检查（默认: `true`）
 * @returns {T[]} 填充后的结果数组，长度不超过 `len`
 *
 * @example
 * forwardFill("abc",{len:2}) //=> ["abc", "abc"]
 * forwardFill(new String("abc")) // => ["a", "b", "c"]
 * forwardFill([1, undefined, 3], { len: 5 }) // => [1, 1, 3, 3, 3]
 * forwardFill(null, { len: 2, invalidityChecker: null, defaultValue: 0 }) // => [0, 0]
 * forwardFill(new Map([[1,2],['a',2]])) // => [[1,2],['a',2]]
 * const obj = {};forwardFill(obj,{len:2}) // => [obj, obj]
 */
function forwardFill(inputData, options = {
  checkDefaultValue: true
}) {
  if ("len" in options) {
    (0, _guard.throwIfIsNotNonNegativeInteger)(options.len, "options.len");
    if (options.len === 0) return [];
  }
  const result = [];
  const dataList = typeof inputData === "object" && typeof inputData?.[Symbol.iterator] === 'function' ? inputData : [inputData];
  const checkInvalidity = typeof options.invalidityChecker === "function" ? options.invalidityChecker : Array.isArray(options.invalidityChecker) ? v => options.invalidityChecker.some(w => Object.is(v, w)) : v => Object.is(v, options.invalidityChecker);
  let currentValue,
    hasValidValue = false;
  if ("defaultValue" in options) {
    currentValue = options.defaultValue;
    hasValidValue = options.checkDefaultValue ? !checkInvalidity(options.defaultValue) : true;
  }
  for (const gottenValue of dataList) {
    if (!checkInvalidity(gottenValue)) {
      currentValue = gottenValue;
      hasValidValue = true;
    }
    if (!hasValidValue) continue;
    result.push(currentValue);
    if (result.length >= options.len) return result;
  }
  if (!hasValidValue) return result;
  while (result.length < options.len) {
    result.push(currentValue);
  }
  return result;
}