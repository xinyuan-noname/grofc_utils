"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chunk = chunk;
/**
 * @template T
 * @param {T[]} input 
 * @param {number} step 
 * @returns {T[][]}
 */
function chunk(input, step) {
  if (!Array.isArray(input)) throw new TypeError(`${input} must be string or array.`);
  if (!Number.isInteger(step)) throw new TypeError(`${step} must be an integer.`);
  if (step === 0) throw new RangeError(`step must not be zero.`);
  const result = [];
  if (step > 0) {
    for (let i = 0; i < input.length; i += step) {
      result.push(input.slice(i, i + step));
    }
  } else if (step < 0) {
    for (let i = input.length; i > 0; i += step) {
      result.push(input.slice(Math.max(0, i + step), i));
    }
  }
  return result;
}