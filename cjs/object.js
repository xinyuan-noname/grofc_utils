"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assignWithDescriptors = assignWithDescriptors;
exports.makePropertyReadOnly = makePropertyReadOnly;
var _guard = require("./guard.js");
/**
 * 将对象的指定属性设置为只读
 * @param {Object} obj - 需要修改的对象
 * @param {string} name - 需要设为只读的属性名
 * @throws {TypeError} 当obj不是普通对象或name不是字符串时会抛出类型错误
 * @throws {Error} 当对象中找不到指定属性时会抛出错误
 */
function makePropertyReadOnly(obj, name) {
  (0, _guard.throwIfIsNotPlainObject)(obj);
  (0, _guard.throwIfKeyMissing)(obj, name, "obj");
  const descriptor = Object.getOwnPropertyDescriptor(obj, name);
  if ('value' in descriptor) {
    Object.defineProperty(obj, name, {
      value: descriptor.value,
      writable: false,
      configurable: false,
      enumerable: descriptor.enumerable ?? true
    });
  } else {
    Object.defineProperty(obj, name, {
      get: descriptor.get,
      set: undefined,
      configurable: false,
      enumerable: descriptor.enumerable ?? true
    });
  }
}

/**
 * 使用属性描述符将一个或多个源对象的属性分配到目标对象中
 * @param {Object} target - 目标对象，将接收来自其他对象的属性
 * @param {...Object} sources - 源对象列表，其所有可枚举和不可枚举属性都将被复制到目标对象中
 * @throws {TypeError} 当target不是普通对象时抛出类型错误
 * @throws {TypeError} 当sources中的任何一个元素不是普通对象时抛出类型错误
 * @returns {void}
 */
function assignWithDescriptors(target, ...sources) {
  (0, _guard.throwIfIsNotPlainObject)(target);
  (0, _guard.throwIfIsNotPlainObjectArray)(sources);
  for (const obj of sources) {
    Object.defineProperties(target, Object.getOwnPropertyDescriptors(obj));
  }
  return target;
}