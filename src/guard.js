/**
 * 获取变量的类型字符串表示
 * @param {*} v - 要检查类型的变量
 * @returns {string} 变量的类型字符串
 */
const getType = v => v === null ? "null" : typeof v

/**
 * 检查函数调用时是否缺少必要参数
 * @param {IArguments|Array} args - 实际传入的参数列表
 * @param {number} expectedCount - 期望的参数数量
 * @throws {Error} 当实际参数少于期望参数时抛出错误
 */
export function throwIfArgumentsMissing(args, expectedCount) {
    if (args.length < expectedCount) {
        throw new Error(`Expected to receive ${expectedCount} arguments, but got ${args.length}.`)
    }
}

/**
 * 检查变量是否为可迭代对象或字符串
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是可迭代对象或字符串时抛出类型错误
 */
export function throwIfIsNotIterable(variable, name = "variable") {
    if (variable == null || typeof variable[Symbol.iterator] !== "function") {
        throw new TypeError(`Expected ${name} to be an iterable, but got ${getType(variable)}.`)
    }
}
export function throwIfIsNotIterableObject(variable, name = "") {
    if (typeof variable !== 'object' || variable === null || typeof variable[Symbol.iterator] !== 'function') {
        throw new TypeError(`Expected ${name} to be an iterable object, but got ${getType(variable)}.`);
    }
}
// ------------------------------------------------
// 通用守卫函数
// ------------------------------------------------

/**
 * 检查变量是否为有效值（不为 null 或 undefined）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量为 null 或 undefined 时抛出类型错误
 */
export function throwIfIsInvalidValue(variable, name = "variable") {
    if (variable == null) {
        throw new TypeError(`Expected ${name} to be not null or undefined, but got ${variable}.`)
    }
}

/**
 * 检查变量是否为真值（truthy）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量为假值（falsy）时抛出类型错误
 */
export function throwIfIsFalsyValue(variable, name = "variable") {
    if (!variable) {
        throw new TypeError(`Expected ${name} to be a truthy value, but got ${variable}.`)
    }
}

// ------------------------------------------------
// 数字类型守卫函数
// ------------------------------------------------

/**
 * 检查变量是否为数字类型
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是数字类型时抛出类型错误
 */
export function throwIfIsNotNumber(variable, name = "variable") {
    if (typeof variable !== "number") {
        throw new TypeError(`Expected ${name} to be a number, but got ${getType(variable)}.`)
    }
}

/**
 * 检查变量是否为有限数字（排除 Infinity 和 -Infinity，但允许 NaN）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是有限数字时抛出类型错误
 */
export function throwIfIsNotFiniteNumber(variable, name = "variable") {
    throwIfIsNotNumber(variable, name)
    if (!Number.isFinite(variable) && !Number.isNaN(variable)) {
        throw new TypeError(`Expected ${name} to be a finite number, but got ${variable}.`)
    }
}

/**
 * 检查变量是否为正有限数
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是正有限数时抛出范围错误
 */
export function throwIfIsNotPositiveFiniteNumber(variable, name = "variable") {
    throwIfIsNotFiniteNumber(variable, name)
    if (variable <= 0) {
        throw new RangeError(`Expected ${name} to be a positive finite number, but got ${variable}.`);
    }
}

/**
 * 检查变量是否为负有限数
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是负有限数时抛出范围错误
 */
export function throwIfIsNotNegativeFiniteNumber(variable, name = "variable") {
    throwIfIsNotFiniteNumber(variable, name)
    if (variable >= 0) {
        throw new RangeError(`Expected ${name} to be a negative finite number, but got ${variable}.`);
    }
}

/**
 * 检查变量是否为非负有限数（大于等于0的有限数）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是非负有限数时抛出范围错误
 */
export function throwIfIsNotNonNegativeFiniteNumber(variable, name = "variable") {
    throwIfIsNotFiniteNumber(variable, name)
    if (variable < 0) {
        throw new RangeError(`Expected ${name} to be a non-negative finite number, but got ${variable}.`);
    }
}

/**
 * 检查变量是否为整数
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是整数时抛出类型错误
 */
export function throwIfIsNotInteger(variable, name = "variable") {
    throwIfIsNotNumber(variable, name)
    if (!Number.isInteger(variable)) {
        throw new TypeError(`Expected ${name} to be an integer, but got ${variable}.`)
    }
}

/**
 * 检查变量是否为正整数
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是正整数时抛出范围错误
 */
export function throwIfIsNotPositiveInteger(variable, name = "variable") {
    throwIfIsNotInteger(variable, name)
    if (variable <= 0) {
        throw new RangeError(`Expected ${name} to be a positive integer, but got ${variable}.`);
    }
}

/**
 * 检查变量是否为负整数
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是负整数时抛出范围错误
 */
export function throwIfIsNotNegativeInteger(variable, name = "variable") {
    throwIfIsNotInteger(variable, name)
    if (variable >= 0) {
        throw new RangeError(`Expected ${name} to be a negative integer, but got ${variable}.`);
    }
}

/**
 * 检查变量是否为非负整数（自然数，包括0）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是非负整数时抛出范围错误
 */
export function throwIfIsNotNonNegativeInteger(variable, name = "variable") {
    throwIfIsNotInteger(variable, name)
    if (variable < 0) {
        throw new RangeError(`Expected ${name} to be a non-negative integer, but got ${variable}.`);
    }
}