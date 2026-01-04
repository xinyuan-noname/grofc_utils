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

const throwTypeErrorGiveType = (variable, name = "variable", ...acceptableTypeDescs) => {
    if (acceptableTypeDescs.length === 1) throw TypeError(`Expected ${name} to be ${acceptableTypeDescs}, but got ${getType(variable)}.`)
    else if (acceptableTypeDescs.length > 1) throw TypeError(`Expected ${name} to be ${acceptableTypeDescs.slice(0, -1).join(" ,")} or ${acceptableTypeDescs[acceptableTypeDescs.length - 1]}, but got ${getType(variable)}.`)
}
const throwTypeErrorGiveValue = (variable, name = "variable", ...acceptableValueDescs) => {
    if (acceptableValueDescs.length === 1) throw TypeError(`Expected ${name} to be ${acceptableValueDescs}, but got ${variable}.`)
    else if (acceptableValueDescs.length > 1) throw TypeError(`Expected ${name} to be ${acceptableValueDescs.slice(0, -1).join(" ,")} or ${acceptableValueDescs[acceptableValueDescs.length - 1]}, but got ${variable}.`)
}
const throwTypeErrorForUnexpectedValue = (variable, name, ...unexpectedValues) => {
    if (unexpectedValues.length === 1) throw TypeError(`Expected ${name} not to be ${unexpectedValues}, but got ${variable}.`)
    else if (unexpectedValues.length > 1) throw new TypeError(`Expected ${name} not to be ${unexpectedValues.slice(0, -1).join(" ,")} or ${unexpectedValues[unexpectedValues.length - 1]},, but got ${variable}.`);
};
const throwTypeErrorForArray = (name = "variable", acceptableTypeDesc, unexpectedElementDesc) => {
    throw TypeError(`Expected all elements of ${name} to be ${acceptableTypeDesc}, but found ${unexpectedElementDesc}.`)
}
const throwRangeErrorGiveValue = (variable, name = "variable", ...acceptableRangeDescs) => {
    if (acceptableRangeDescs.length === 1) throw RangeError(`Expected ${name} to be ${acceptableRangeDescs}, but got ${variable}.`)
    else if (acceptableRangeDescs.length > 1) throw RangeError(`Expected ${name} to be ${acceptableRangeDescs.slice(0, -1).join(" ,")} or ${acceptableRangeDescs[acceptableRangeDescs.length - 1]}, but got ${variable}.`)
}
/**
 * 检查变量是否为 null 或 undefined
 * @param {*} variable - 需要检查的变量
 * @returns {boolean} 如果变量为 null 或 undefined 返回 true，否则返回 false
 */
export function isNullishValue(variable) {
    return variable == null
}

/**
 * 检查变量是否为可比较的数字（不是 NaN）
 * @param {*} variable - 需要检查的变量
 * @returns {boolean} 如果变量是数字且不是 NaN 返回 true，否则返回 false
 */
export function isComparableNumber(variable) {
    return typeof variable === "number" && !Number.isNaN(variable)
}
export function isDivisibleNumber(variable) {
    return typeof variable === "number" && Number.isFinite(variable) && variable !== 0
}
/**
 * 检查给定对象是否为普通对象
 * 普通对象是指通过对象字面量 {} 或 new Object() 创建的对象，
 * 不包括数组、函数以及其他自定义构造函数创建的实例
 * @param {*} variable - 需要检查的对象
 * @returns {boolean} 如果是普通对象返回 true，否则返回 false
 */
export function isPlainObject(variable) {
    if (Object.prototype.toString.call(variable) !== "[object Object]") return false;
    const prototype = Object.getPrototypeOf(variable);
    if (prototype !== Object.prototype && prototype !== null) return false;
    return true
}
export function isRegExp(variable) {
    return Object.prototype.toString.call(variable) === "[object RegExp]"
}

// ------------------------------------------------
// 值校验守卫函数
// ------------------------------------------------
/**
 * 检查变量是否为期望值之一，如果不是则抛出类型错误
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息），默认值为"variable"
 * @param {...*} expectedValues - 期望值列表
 * @throws {TypeError} 当变量不是期望值之一时抛出类型错误
 */
export function throwIfIsNotExpectedValue(variable, name = "variable", ...expectedValues) {
    safeGuardExecute(throwIfIsNotNonEmptyArray, expectedValues)
    if (!expectedValues.includes(variable)) {
        throwTypeErrorGiveValue(variable, name, ...expectedValues);
    }
}
/**
 * 检查变量是否为不期望的值之一，如果是则抛出类型错误
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息），默认值为"variable"
 * @param {...*} unexpectedValues - 不期望的值列表
 * @throws {TypeError} 当变量是不期望的值之一时抛出类型错误
 */
export function throwIfIsUnExpectedValue(variable, name = "variable", ...unexpectedValues) {
    safeGuardExecute(throwIfIsNotNonEmptyArray, unexpectedValues)
    if (unexpectedValues.includes(variable)) {
        throwTypeErrorForUnexpectedValue(variable, name, unexpectedValues);
    }
}
/**
 * 检查变量是否为空值（不为 null 或 undefined）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量为 null 或 undefined 时抛出类型错误
 */
export function throwIfIsNullishValue(variable, name = "variable") {
    if (variable == null) {
        throwTypeErrorGiveValue(variable, name, null, undefined)
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
        throwTypeErrorGiveType(variable, name, "a number")
    }
}
/**
 * 检查数字变量是否为 NaN（非数字）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量是 NaN 时抛出类型错误
 */
export function throwIfIsNotComparableNumber(variable, name = "variable") {
    throwIfIsNotNumber(variable, name)
    if (Number.isNaN(variable)) {
        throwTypeErrorGiveValue(variable, name, "comparable number(not NaN)")
    }
}
export const throwIfIsNotNumberOrIsNaN = throwIfIsNotComparableNumber;
/**
 * 检查变量是否为有限数字（排除 Infinity 和 -Infinity，但允许 NaN）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是有限数字时抛出类型错误
 */
export function throwIfIsNotFiniteNumber(variable, name = "variable") {
    throwIfIsNotNumber(variable, name)
    if (!Number.isFinite(variable)) {
        throwTypeErrorGiveValue(variable, name, "a finite number")
    }
}
export function throwIfIsNotDivisibleNumber(variable, name = "variable") {
    throwIfIsNotFiniteNumber(variable, name)
    if (variable === 0) {
        throwRangeErrorGiveValue(variable, name, "a divisible number");
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
        throwRangeErrorGiveValue(variable, name, "a non-negative integer");
    }
}
//
// 字符串类型守卫函数
//
export function throwIfIsNotString(variable, name = "variable") {
    if (typeof variable !== "string") {
        throwTypeErrorGiveType(variable, name, "string")
    }
}
//
// symbol类型守卫函数
//
export function throwIfIsNotSymbol(variable, name = "variable") {
    if (typeof variable !== "symbol") {
        throwTypeErrorGiveType(variable, name, "symbol")
    }
}
//
// bigint类型守卫函数
//
export function throwIfIsNotBigInt(variable, name = "variable") {
    if (typeof variable !== "bigint") {
        throwTypeErrorGiveType(variable, name, "bigint")
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
    if (!isPlainObject(variable)) {
        throwTypeErrorGiveType(variable, name, "a plain object");
    }
}
/**
 * 检查对象是否包含指定的键
 * @param {*} variable - 要检查的对象
 * @param {string} key - 要检查的键名
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当variable不是普通对象或key不是字符串时抛出类型错误
 * @throws {Error} 当对象中找不到指定键时抛出错误
 */
export function throwIfKeyMissing(variable, key, name = "variable") {
    throwIfIsNotPlainObject(variable);
    throwIfIsNotString(key);
    if (!(key in variable)) {
        throw new Error(`Expected ${name} to have key : "${key}", but cannot find.`)
    }
}
/**
 * 检查对象是否缺少所有指定的键
 * @param {*} variable - 要检查的对象
 * @param {string[]} keys - 要检查的键名数组
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当 variable 不是普通对象时抛出类型错误
 * @throws {GuardError} 当 keys 不是字符串或字符串数组时抛出守卫错误
 * @throws {Error} 当对象缺少所有指定键时抛出错误
 */
export function throwIfAllKeysMissing(variable, keys, name = "variable") {
    throwIfIsNotPlainObject(variable);
    safeGuardExecute(throwIfIsNotStringArray, keys, name, "an array of string");
    if (keys.every(key => !(key in variable))) {
        throw new Error(`Expected ${name} to have at least one keys of [${keys.map(k => `'${k}'`).join(" ,")}], but cannot find.`)
    }
}
/**
 * 检查对象是否缺少任意指定的键
 * @param {*} variable - 要检查的对象
 * @param {string[]} keys - 要检查的键名数组
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当 variable 不是普通对象时抛出类型错误
 * @throws {GuardError} 当 keys 不是字符串或字符串数组时抛出守卫错误
 * @throws {Error} 当对象缺少任何一个指定键时抛出错误
 */
export function throwIfSomeKeysMissing(variable, keys, name = "variable") {
    throwIfIsNotPlainObject(variable);
    safeGuardExecute(throwIfIsNotStringArray, keys, name, "an array of string");
    const l = keys.filter(key => !(key in variable))
    if (l.length) {
        throw new Error(`Expected ${name} to have at all keys of [${keys.map(k => `'${k}'`).join(" ,")}], but missing [${l.map(k => `'${k}'`).join(" ,")}].`)
    }
}
/**
 * 检查对象是否包含指定的键
 * @param {*} variable - 要检查的对象
 * @param {string} property - 要检查的键名
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当variable不是普通对象或property不是字符串时抛出类型错误
 * @throws {Error} 当对象中找不到指定键时抛出错误
 */
export function throwIfOwnPropertyMissing(variable, property, name = "variable") {
    throwIfIsNotPlainObject(variable);
    throwIfIsNotString(property);
    if (Object.hasOwn(variable, property)) {
        throw new Error(`Expected ${name} to have own property : "${property}", but cannot find.`)
    }
}
/**
 * 检查对象是否缺少所有指定的键
 * @param {*} variable - 要检查的对象
 * @param {string[]}properties- 要检查的键名数组
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当 variable 不是普通对象时抛出类型错误
 * @throws {GuardError} 当properties不是字符串或字符串数组时抛出守卫错误
 * @throws {Error} 当对象缺少所有指定键时抛出错误
 */
export function throwIfAllOwnPropertiesMissing(variable, properties, name = "variable") {
    throwIfIsNotPlainObject(variable);
    safeGuardExecute(throwIfIsNotStringArray, properties, name, "an array of string");
    if (properties.every(p => !Object.hasOwn(variable, p))) {
        throw new Error(`Expected ${name} to have at least one own property of [${properties.map(k => `'${k}'`).join(" ,")}], but cannot find.`)
    }
}
/**
 * 检查对象是否缺少任意指定的键
 * @param {*} variable - 要检查的对象
 * @param {string[]} properties - 要检查的键名数组
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当 variable 不是普通对象时抛出类型错误
 * @throws {GuardError} 当 properties 不是字符串或字符串数组时抛出守卫错误
 * @throws {Error} 当对象缺少任何一个指定键时抛出错误
 */
export function throwIfSomeOwnPropertiesMissing(variable, properties, name = "variable") {
    throwIfIsNotPlainObject(variable);
    safeGuardExecute(throwIfIsNotStringArray, properties, name, "an array of string");
    const l = properties.filter(p => !Object.hasOwn(variable, p))
    if (l.length) {
        throw new Error(`Expected ${name} to have at all own properties of [${properties.map(k => `'${k}'`).join(" ,")}], but missing [${l.map(k => `'${k}'`).join(" ,")}].`)
    }
}
// ------------------------------------------------
// 函数类型守卫函数
// ------------------------------------------------
/**
 * 检查变量是否为函数类型，如果不是则抛出类型错误
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息），默认值为"variable"
 * @throws {TypeError} 当变量不是函数类型时抛出类型错误
 */
export function throwIfIsNotFunction(variable, name = "variable") {
    if (typeof variable !== "function") {
        throwTypeErrorGiveType(variable, name, "a function")
    }
}
// ------------------------------------------------
// 可迭代守卫函数
// ------------------------------------------------
/**
 * 检查变量是否为可迭代对象或字符串
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是可迭代对象或字符串时抛出类型错误
 */
export function throwIfIsNotIterable(variable, name = "variable") {
    if (variable == null || typeof variable[Symbol.iterator] !== "function") {
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
        throwTypeErrorGiveType(variable, name, "an iterable object");
    }
}

//------------------------------------------------
// 数组类型守卫函数
// ------------------------------------------------
/**
 * 检查变量是否为数组，如果不是则抛出类型错误
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息），默认值为"variable"
 * @throws {TypeError} 当变量不是数组时抛出类型错误
 */
export function throwIfIsNotArray(variable, name = "variable") {
    if (!Array.isArray(variable)) {
        throwTypeErrorGiveType(variable, name, "an array");
    }
}

/**
 * 检查变量是否为非空数组，如果不是则抛出错误
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息），默认值为"variable"
 * @throws {TypeError} 当变量不是数组时抛出类型错误
 * @throws {Error} 当变量是空数组时抛出错误
 */
export function throwIfIsNotNonEmptyArray(variable, name = "variable") {
    throwIfIsNotArray(variable, name);
    if (variable.length === 0) {
        throw new Error(`Expected ${name} to have at least one item, but got zero.`)
    }
}

/**
 * 检查变量是否为仅包含字符串的数组，如果不是则抛出类型错误
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息），默认值为"variable"
 * @param {string} generalTerm - 通用术语（用于错误消息），默认值为`all elements of ${name || "array"}`
 * @throws {TypeError} 当变量不是数组或包含非字符串元素时抛出类型错误
 */
export function throwIfIsNotStringArray(variable, name = "variable", generalTerm = `all elements of ${name || "array"}`) {
    throwIfIsNotArray(variable, name);
    const acceptType = "strings";
    for (const e of variable) {
        if (typeof e !== "string") {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-string value of type ${getType(e)}`)
        }
    }
}
/**
 * 检查变量是否为仅包含BigInt值的数组，如果不是则抛出类型错误
 * @param {*} variable - 需要检查的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息显示
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 通用术语，用于错误消息显示
 * @throws {TypeError} 当变量不是数组或包含非BigInt元素时抛出类型错误
 */
export function throwIfIsNotBigIntArray(variable, name = "variable", generalTerm = `all elements of ${name || "array"}`) {
    throwIfIsNotArray(variable, name);
    const acceptType = "bigints";
    for (const e of variable) {
        if (typeof e !== "bigint") {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-bigint value of type ${getType(e)}`)
        }
    }
}
/**
 * 检查变量是否为仅包含Symbol值的数组，如果不是则抛出类型错误
 * @param {*} variable - 需要检查的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息显示
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 通用术语，用于错误消息显示
 * @throws {TypeError} 当变量不是数组或包含非Symbol元素时抛出类型错误
 */
export function throwIfIsNotSymbolArray(variable, name = "variable", generalTerm = `all elements of ${name || "array"}`) {
    throwIfIsNotArray(variable, name);
    const acceptType = "symbols";
    for (const e of variable) {
        if (typeof e !== "symbol") {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-symbol value of type ${getType(e)}`)
        }
    }
}
/**
 * 检查变量是否为仅包含普通对象的数组，如果不是则抛出类型错误
 * @param {*} variable - 需要检查的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息显示
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 通用术语，用于错误消息显示
 * @throws {TypeError} 当变量不是数组或包含非普通对象元素时抛出类型错误
 */
export function throwIfIsNotPlainObjectArray(variable, name = "variable", generalTerm = `all elements of ${name || "array"}`) {
    throwIfIsNotArray(variable, name);
    const acceptType = "plain objects";
    for (const e of variable) {
        if (!isPlainObject(variable)) {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-plain object value of type ${e}`)
        }
    }
}
export function throwIfIsNotNumberArray(variable, name = "variable", generalTerm = `all elements of ${name || "array"}`) {
    throwIfIsNotArray(variable, name);
    const acceptType = "numbers";
    for (const e of variable) {
        if (typeof e !== "number") {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`)
        }
    }
}
/**
 * 检查变量是否为仅包含非NaN数字的数组，如果不是则抛出类型错误
 * 
 * @param {*} variable - 需要检查的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息显示
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 通用术语，用于错误消息显示
 * @throws {TypeError} 当变量不是数组或数组元素不符合要求时抛出错误
 */
export function throwIfIsNotComparableNumberArray(variable, name = "variable", generalTerm = `all elements of ${name || "array"}`) {
    throwIfIsNotArray(variable, name);
    const acceptType = "comparable numbers(not NaN)";
    // 验证数组中的每个元素都是非NaN的数字
    for (const e of variable) {
        if (typeof e !== "number") {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
        }
        if (Number.isNaN(e)) {
            throwTypeErrorForArray(generalTerm, acceptType, "NaN");
        }
    }
}

export const throwIfIsNumberArrayWithoutNaN = throwIfIsNotComparableNumberArray;

/**
 * 校验变量是否为仅包含有限数（有限 number）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、-Infinity
 */
export function throwIfIsNotFiniteNumberArray(variable, name = "variable", generalTerm = `all elements of ${name || "array"}`) {
    throwIfIsNotArray(variable, name);
    const acceptType = "finite numbers";
    for (const e of variable) {
        if (typeof e !== "number") {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
        }
        if (Number.isNaN(e)) {
            throwTypeErrorForArray(generalTerm, acceptType, "NaN");
        }
        if (!Number.isFinite(e)) {
            const desc = e > 0 ? "Infinity" : "-Infinity";
            throwTypeErrorForArray(generalTerm, acceptType, desc);
        }
    }
}
export function throwIfIsNotDivisibleNumberArray(variable, name = "variable", generalTerm = `all elements of ${name || "array"}`) {
    throwIfIsNotArray(variable, name);
    const acceptType = "disvisible numbers";
    for (const e of variable) {
        if (typeof e !== "number") {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
        }
        if (Number.isNaN(e)) {
            throwTypeErrorForArray(generalTerm, acceptType, "NaN");
        }
        if (!Number.isFinite(e)) {
            const desc = e > 0 ? "Infinity" : "-Infinity";
            throwTypeErrorForArray(generalTerm, acceptType, desc);
        }
        if (e === 0) {
            throwTypeErrorForArray(generalTerm, acceptType, "zero");
        }
    }
}

/**
 * 校验变量是否为仅包含正有限数（> 0 的有限 number）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、负数、零
 */
export function throwIfIsNotPositiveFiniteNumberArray(variable, name = "variable", generalTerm = `all elements of ${name || "array"}`) {
    throwIfIsNotArray(variable, name);
    const acceptType = "positive finite numbers";
    for (const e of variable) {
        if (typeof e !== "number") {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
        }
        if (Number.isNaN(e)) {
            throwTypeErrorForArray(generalTerm, acceptType, "NaN");
        }
        if (!Number.isFinite(e)) {
            const desc = e > 0 ? "Infinity" : "-Infinity";
            throwTypeErrorForArray(generalTerm, acceptType, desc);
        }
        if (e <= 0) {
            const desc = e === 0 ? "zero" : `a negative number (${e})`;
            throwTypeErrorForArray(generalTerm, acceptType, desc);
        }
    }
}

/**
 * 校验变量是否为仅包含非负有限数（>= 0 的有限 number）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、负数
 */
export function throwIfIsNotNonNegativeFiniteNumberArray(variable, name = "variable", generalTerm = `all elements of ${name || "array"}`) {
    throwIfIsNotArray(variable, name);
    const acceptType = "non-negative finite numbers";
    for (const e of variable) {
        if (typeof e !== "number") {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
        }
        if (Number.isNaN(e)) {
            throwTypeErrorForArray(generalTerm, acceptType, "NaN");
        }
        if (!Number.isFinite(e)) {
            const desc = e > 0 ? "Infinity" : "-Infinity";
            throwTypeErrorForArray(generalTerm, acceptType, desc);
        }
        if (e < 0) {
            const desc = `a negative number (${e})`;
            throwTypeErrorForArray(generalTerm, acceptType, desc);
        }
    }
}

/**
 * 校验变量是否为仅包含负有限数（< 0 的有限 number）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、正数、零
 */
export function throwIfIsNotNegativeFiniteNumberArray(variable, name = "variable", generalTerm = `all elements of ${name || "array"}`) {
    throwIfIsNotArray(variable, name);
    const acceptType = "negative finite numbers";
    for (const e of variable) {
        if (typeof e !== "number") {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
        }
        if (Number.isNaN(e)) {
            throwTypeErrorForArray(generalTerm, acceptType, "NaN");
        }
        if (!Number.isFinite(e)) {
            const desc = e > 0 ? "Infinity" : "-Infinity";
            throwTypeErrorForArray(generalTerm, acceptType, desc);
        }
        if (e >= 0) {
            const desc = e === 0 ? "zero" : `a positive number (${e})`;
            throwTypeErrorForArray(generalTerm, acceptType, desc);
        }
    }
}

/**
 * 校验变量是否为仅包含整数的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、小数
 */
export function throwIfIsNotIntegerArray(variable, name = "variable", generalTerm = `all elements of ${name || "array"}`) {
    throwIfIsNotArray(variable, name);
    const acceptType = "integers";
    for (const e of variable) {
        if (typeof e !== "number") {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
        }
        if (Number.isNaN(e)) {
            throwTypeErrorForArray(generalTerm, acceptType, "NaN");
        }
        if (!Number.isFinite(e)) {
            const desc = e > 0 ? "Infinity" : "-Infinity";
            throwTypeErrorForArray(generalTerm, acceptType, desc);
        }
        if (!Number.isInteger(e)) {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-integer value (${e})`);
        }
    }
}

/**
 * 校验变量是否为仅包含正整数（> 0 的整数）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、负数、零、小数
 */
export function throwIfIsNotPositiveIntegerArray(variable, name = "variable", generalTerm = `all elements of ${name || "array"}`) {
    throwIfIsNotArray(variable, name);
    const acceptType = "positive integers";
    for (const e of variable) {
        if (typeof e !== "number") {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
        }
        if (Number.isNaN(e)) {
            throwTypeErrorForArray(generalTerm, acceptType, "NaN");
        }
        if (!Number.isFinite(e)) {
            const desc = e > 0 ? "Infinity" : "-Infinity";
            throwTypeErrorForArray(generalTerm, acceptType, desc);
        }
        if (!Number.isInteger(e)) {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-integer value (${e})`);
        }
        if (e <= 0) {
            const desc = e === 0 ? "zero" : `a negative number (${e})`;
            throwTypeErrorForArray(generalTerm, acceptType, desc);
        }
    }
}

/**
 * 校验变量是否为仅包含非负整数（>= 0 的整数）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、负数、小数
 */
export function throwIfIsNotNonNegativeIntegerArray(variable, name = "variable", generalTerm = `all elements of ${name || "array"}`) {
    throwIfIsNotArray(variable, name);
    const acceptType = "non-negative integers";
    for (const e of variable) {
        if (typeof e !== "number") {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
        }
        if (Number.isNaN(e)) {
            throwTypeErrorForArray(generalTerm, acceptType, "NaN");
        }
        if (!Number.isFinite(e)) {
            const desc = e > 0 ? "Infinity" : "-Infinity";
            throwTypeErrorForArray(generalTerm, acceptType, desc);
        }
        if (!Number.isInteger(e)) {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-integer value (${e})`);
        }
        if (e < 0) {
            const desc = `a negative number (${e})`;
            throwTypeErrorForArray(generalTerm, acceptType, desc);
        }
    }
}

/**
 * 校验变量是否为仅包含负整数（< 0 的整数）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、正数、零、小数
 */
export function throwIfIsNotNegativeIntegerArray(variable, name = "variable", generalTerm = `all elements of ${name || "array"}`) {
    throwIfIsNotArray(variable, name);
    const acceptType = "negative integers";
    for (const e of variable) {
        if (typeof e !== "number") {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
        }
        if (Number.isNaN(e)) {
            throwTypeErrorForArray(generalTerm, acceptType, "NaN");
        }
        if (!Number.isFinite(e)) {
            const desc = e > 0 ? "Infinity" : "-Infinity";
            throwTypeErrorForArray(generalTerm, acceptType, desc);
        }
        if (!Number.isInteger(e)) {
            throwTypeErrorForArray(generalTerm, acceptType, `a non-integer value (${e})`);
        }
        if (e >= 0) {
            const desc = e === 0 ? "zero" : `a positive number (${e})`;
            throwTypeErrorForArray(generalTerm, acceptType, desc);
        }
    }
}