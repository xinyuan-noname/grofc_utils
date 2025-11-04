/**
 * 获取变量的类型字符串表示
 * @param {*} v - 要检查类型的变量
 * @returns {string} 变量的类型字符串
 */
const getType = v => v === null ? "null" : typeof v


class GuardError extends Error {
    /**
     * 
     * @param {string|Error} cause
     */
    constructor(cause) {
        if (cause instanceof Error) {
            super(`Guard execution failed: ${cause.message}`);
            this.originalError = cause;
            this.stack = cause.stack;
        } else {
            super(`Guard execution failed: ${cause || "Unknown error"}`);
            this.originalError = null;
        }
        this.name = "GuardError";
    }
}
const safeGuardExecute = (guardFunc, ...args) => {
    try {
        guardFunc(...args)
    } catch (err) {
        throw new GuardError(err);
    }
}
const throwTypeErrorGiveType = (variable, name = "variable", ...acceptableTypes) => {
    if (acceptableTypes.length === 1) throw TypeError(`Expected ${name} to be ${acceptableTypes}, but got ${getType(variable)}.`)
    else if (acceptableTypes.length > 1) throw TypeError(`Expected ${name} to be ${acceptableTypes.slice(0, -1).join(" ,")} or ${acceptableTypes[acceptableTypes.length - 1]}, but got ${getType(variable)}.`)
}
const throwTypeErrorGiveValue = (variable, name = "variable", ...acceptableValues) => {
    if (acceptableValues.length === 1) throw TypeError(`Expected ${name} to be ${acceptableValues}, but got ${variable}.`)
    else if (acceptableValues.length > 1) throw TypeError(`Expected ${name} to be ${acceptableValues.slice(0, -1).join(" ,")} or ${acceptableValues[acceptableValues.length - 1]}, but got ${variable}.`)
}
const throwRangeErrorGiveValue = (variable, name = "variable", ...acceptableRanges) => {
    if (acceptableRanges.length === 1) throw RangeError(`Expected ${name} to be ${acceptableRanges}, but got ${variable}.`)
    else if (acceptableRanges.length > 1) throw RangeError(`Expected ${name} to be ${acceptableRanges.slice(0, -1).join(" ,")} or ${acceptableRanges[acceptableRanges.length - 1]}, but got ${variable}.`)
}
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
        // throw new TypeError(`Expected ${name} to be not null or undefined, but got ${variable}.`)
        throwTypeErrorGiveValue(variable, name, "not null or undefined")
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
        // throw new TypeError(`Expected ${name} to be a truthy value, but got ${variable}.`)
        throwTypeErrorGiveValue(variable, name, "a truthy value")
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
        // throw new TypeError(`Expected ${name} to be a number, but got ${getType(variable)}.`)
        throwTypeErrorGiveType(variable, name, "a number")
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
    if (!Number.isFinite(variable) || Number.isNaN(variable)) {
        // throw new TypeError(`Expected ${name} to be a finite number, but got ${variable}.`)
        throwTypeErrorGiveValue(variable, name, "a finite number")
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
        // throw new RangeError(`Expected ${name} to be a positive finite number, but got ${variable}.`);
        throwRangeErrorGiveValue(variable, name, "a positive finite number");
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
        // throw new RangeError(`Expected ${name} to be a negative finite number, but got ${variable}.`);
        throwRangeErrorGiveValue(variable, name, "a negative finite number");
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
        // throw new RangeError(`Expected ${name} to be a non-negative finite number, but got ${variable}.`);
        throwRangeErrorGiveValue(variable, name, "a non-negative finite number");
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
        // throw new TypeError(`Expected ${name} to be an integer, but got ${variable}.`)
        throwTypeErrorGiveValue(variable, name, "an integer");
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
        // throw new RangeError(`Expected ${name} to be a positive integer, but got ${variable}.`);
        throwRangeErrorGiveValue(variable, name, "a positive integer");
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
        // throw new RangeError(`Expected ${name} to be a negative integer, but got ${variable}.`);
        throwRangeErrorGiveValue(variable, name, "a negative integer");
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
        // throw new RangeError(`Expected ${name} to be a non-negative integer, but got ${variable}.`);
        throwRangeErrorGiveValue(variable, name, "a non-negative integer");
    }
}
// ------------------------------------------------
// 对象类型守卫函数
// ------------------------------------------------
/**
 * 检查变量是否为普通对象（非 null，非数组）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是普通对象时抛出类型错误
 */
export function throwIfIsNotPlainObject(variable, name = "variable") {
    if (typeof variable !== 'object' || variable === null || Array.isArray(variable)) {
        // throw new TypeError(`Expected ${name} to be a plain object, but got ${getType(variable)}.`);
        throwTypeErrorGiveType(variable, name, "a plain object");
    }
}
/**
 * 检查对象是否缺少所有指定的键
 * @param {*} variable - 要检查的对象
 * @param {string|string[]} keys - 要检查的键名或键名数组
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当 variable 不是普通对象时抛出类型错误
 * @throws {GuardError} 当 keys 不是字符串或字符串数组时抛出守卫错误
 * @throws {Error} 当对象缺少所有指定键时抛出错误
 */
export function throwIfAllKeysMissing(variable, keys, name = "variable") {
    throwIfIsNotPlainObject(variable);
    if (!Array.isArray(keys)) {
        if (typeof keys === "string") keys = [keys];
        // throw new GuardError(new TypeError(`Expected ${name} to be string or array of string, but got ${getType(variable)}`))
        safeGuardExecute(throwTypeErrorGiveType, keys, name, "string", "an array of string");
    }
    if (keys.every(key => !(key in variable))) {
        throw new Error(`Expected ${name} to have at least one attribute of [${keys.map(k => `'${k}'`).join(" ,")}], but cannot find.`)
    }
}
/**
 * 检查对象是否缺少任意指定的键
 * @param {*} variable - 要检查的对象
 * @param {string|string[]} keys - 要检查的键名或键名数组
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当 variable 不是普通对象时抛出类型错误
 * @throws {GuardError} 当 keys 不是字符串或字符串数组时抛出守卫错误
 * @throws {Error} 当对象缺少任何一个指定键时抛出错误
 */
export function throwIfSomeKeysMissing(variable, keys, name = "variable") {
    throwIfIsNotPlainObject(variable);
    if (!Array.isArray(keys)) {
        if (typeof keys === "string") keys = [keys];
        // throw new GuardError(new TypeError(`Expected ${name} to be string or array of string, but got ${getType(variable)}`))
        safeGuardExecute(throwTypeErrorGiveType, keys, name, "string", "an array of string");
    }
    const l = keys.filter(key => !(key in variable))
    if (l.length) {
        throw new Error(`Expected ${name} to have at all attributes of [${keys.map(k => `'${k}'`).join(" ,")}], but missing [${l.map(k => `'${k}'`).join(" ,")}].`)
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
        // throw new TypeError(`Expected ${name} to be an iterable, but got ${getType(variable)}.`)
        throwTypeErrorGiveType(variable, name, "an iterable");
    }
}
/**
 * 检查变量是否为可迭代对象，如果不是则抛出类型错误
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是可迭代对象时抛出类型错误
 */
export function throwIfIsNotIterableObject(variable, name = "") {
    if (typeof variable !== 'object' || variable === null || typeof variable[Symbol.iterator] !== 'function') {
        // throw new TypeError(`Expected ${name} to be an iterable object, but got ${getType(variable)}.`);
        throwTypeErrorGiveType(variable, name, "an iterable object");
    }
}