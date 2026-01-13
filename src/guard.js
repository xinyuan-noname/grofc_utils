import { getType, isPlainObject, stringify } from "./type.js";
class GuardError extends Error {
    /**
     * 
     * @param {string|Error} cause
     */
    constructor(cause) {
        if (cause instanceof Error) {
            super(`Guard execution failed: ${cause.message}`);
            this.stack = cause.stack;
        } else {
            super(`Guard execution failed: ${cause || "Unknown error"}`);
        }
        this.name = "GuardError";
        Error?.captureStackTrace?.(this, GuardError);
    }
}
const safeGuardExecute = (guardFunc, ...args) => {
    try {
        guardFunc(...args)
    } catch (err) {
        const error = new GuardError(err);
        Error?.captureStackTrace(error, safeGuardExecute);
        throw error
    }
}
const genTypeErrorGiveType = (variable, name = "variable", ...acceptableTypeDescs) => {
    if (acceptableTypeDescs?.length < 1) return;
    return acceptableTypeDescs.length === 1 ?
        new TypeError(`Expected ${name} to be ${acceptableTypeDescs}, but got ${getType(variable)}.`) :
        new TypeError(`Expected ${name} to be ${acceptableTypeDescs.slice(0, -1).join(" ,")} or ${acceptableTypeDescs[acceptableTypeDescs.length - 1]}, but got ${getType(variable)}.`)
}


const genTypeErrorGiveValue = (variable, name = "variable", ...acceptableValueDescs) => {
    if (acceptableValueDescs.length < 1) return;
    console.log(acceptableValueDescs.slice(0, -1).join(" ,"))
    return acceptableValueDescs.length === 1 ?
        new TypeError(`Expected ${name} to be ${acceptableValueDescs}, but got ${stringify(variable)}.`) :
        new TypeError(`Expected ${name} to be ${acceptableValueDescs.slice(0, -1).join(" ,")} or ${acceptableValueDescs[acceptableValueDescs.length - 1]}, but got ${stringify(variable)}.`)
}


const genTypeErrorForUnexpectedValue = (variable, name, ...unexpectedValues) => {
    if (unexpectedValues.length < 1) return;
    return unexpectedValues.length === 1 ?
        new TypeError(`Expected ${name} not to be ${unexpectedValues}, but got ${variable}.`) :
        new TypeError(`Expected ${name} not to be ${unexpectedValues.slice(0, -1).join(" ,")} or ${unexpectedValues[unexpectedValues.length - 1]}, but got ${variable}.`);
};

const genTypeErrorForArray = (name = "variable", acceptableTypeDesc, unexpectedElementDesc) => {
    return new TypeError(`Expected all elements of ${name} to be ${acceptableTypeDesc}, but found ${unexpectedElementDesc}.`)
}


const genRangeErrorGiveValue = (variable, name = "variable", ...acceptableRangeDescs) => {
    if (acceptableRangeDescs.length < 1) return;
    return acceptableRangeDescs.length === 1 ?
        new RangeError(`Expected ${name} to be ${acceptableRangeDescs}, but got ${variable}.`) :
        new RangeError(`Expected ${name} to be ${acceptableRangeDescs.slice(0, -1).join(" ,")} or ${acceptableRangeDescs[acceptableRangeDescs.length - 1]}, but got ${variable}.`)
}
// ------------------------------------------------
// 数字判断函数
// ------------------------------------------------
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
// ------------------------------------------------
// 类型判断函数
// ------------------------------------------------
/**
 * 检查变量是否为 null 或 undefined
 * @param {*} variable - 需要检查的变量
 * @returns {boolean} 如果变量为 null 或 undefined 返回 true，否则返回 false
 */
export function isNullishValue(variable) {
    return variable == null
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
        const expectedValuesDescs = expectedValues.map(v => stringify(v));
        const error = genTypeErrorGiveValue(variable, name, ...expectedValuesDescs);
        Error?.captureStackTrace?.(error, throwIfIsNotExpectedValue);
        throw error;
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
    safeGuardExecute(throwIfIsNotNonEmptyArray, unexpectedValues, "unexpectedValues")
    if (unexpectedValues.includes(variable)) {
        const error = genTypeErrorForUnexpectedValue(variable, name, ...unexpectedValues);
        Error?.captureStackTrace?.(error, throwIfIsUnExpectedValue);
        throw error;
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
        const error = genTypeErrorForUnexpectedValue(variable, name, "null", "undefined");
        Error?.captureStackTrace?.(error, throwIfIsNullishValue);
        throw error;
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
        const error = genTypeErrorGiveValue(variable, name, "a truthy value");
        Error?.captureStackTrace?.(error, throwIfIsFalsyValue);
        throw error;
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
        const error = genTypeErrorGiveValue(variable, name, "a number");
        Error?.captureStackTrace?.(error, throwIfIsNotNumber);
        throw error;
    }
}
/**
 * 检查数字变量是否为 NaN（非数字）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量是 NaN 时抛出类型错误
 */
export function throwIfIsNotComparableNumber(variable, name = "variable") {
    let error;
    switch (true) {
        case (typeof variable !== "number"): {
            error = genTypeErrorGiveType(variable, name, "a number")
        }; break;
        case (Number.isNaN(variable)): {
            error = genTypeErrorGiveValue(variable, name, "a comparable number")
        }; break;
        default: return;
    }
    Error?.captureStackTrace?.(error, throwIfIsNotComparableNumber);
    throw error;
}
export const throwIfIsNotNumberOrIsNaN = throwIfIsNotComparableNumber;
/**
 * 检查变量是否为有限数字（排除 Infinity 和 -Infinity，但允许 NaN）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是有限数字时抛出类型错误
 */
export function throwIfIsNotFiniteNumber(variable, name = "variable") {
    let error;
    switch (true) {
        case (typeof variable !== "number"): {
            error = genTypeErrorGiveType(variable, name, "a number")
        }; break;
        case (!Number.isFinite(variable)): {
            error = genTypeErrorGiveValue(variable, name, "a finite number")
        }; break;
        default: return;
    }
    Error?.captureStackTrace?.(error, throwIfIsNotFiniteNumber);
    throw error;
}
export function throwIfIsNotNonZeroFiniteNumber(variable, name = "variable") {
    let error;
    switch (true) {
        case (typeof variable !== "number"): {
            error = genTypeErrorGiveType(variable, name, "a number")
        }; break;
        case (!Number.isFinite(variable)): {
            error = genRangeErrorGiveValue(variable, name, "a non-zero finite number")
        }; break;
        case (variable === 0): {
            error = genRangeErrorGiveValue(variable, name, "a non-zero finite number");
        }; break;
        default: return;
    }
    Error?.captureStackTrace?.(error, throwIfIsNotNonZeroFiniteNumber);
    throw error;
}
/**
 * 检查变量是否为正有限数
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是正有限数时抛出范围错误
 */
export function throwIfIsNotPositiveFiniteNumber(variable, name = "variable") {
    let error;
    switch (true) {
        case (typeof variable !== "number"): error = genTypeErrorGiveType(variable, name, "a number"); break;
        case (!Number.isFinite(variable)): error = genTypeErrorGiveValue(variable, name, "a postive finite number"); break;
        case (variable <= 0): error = genRangeErrorGiveValue(variable, name, "a positive finite number"); break;
        default: return;
    }
    Error?.captureStackTrace?.(error, throwIfIsNotPositiveFiniteNumber);
    throw error;
}

/**
 * 检查变量是否为负有限数
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是负有限数时抛出范围错误
 */
export function throwIfIsNotNegativeFiniteNumber(variable, name = "variable") {
    let error;
    switch (true) {
        case (typeof variable !== "number"):
            error = genTypeErrorGiveType(variable, name, "a number");
            break;
        case (!Number.isFinite(variable)):
            error = genTypeErrorGiveValue(variable, name, "a negative finite number");
            break;
        case (variable >= 0):
            error = genRangeErrorGiveValue(variable, name, "a negative finite number");
            break;
        default:
            return;
    }
    Error?.captureStackTrace?.(error, throwIfIsNotNegativeFiniteNumber);
    throw error;
}

/**
 * 检查变量是否为非负有限数（大于等于0的有限数）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是非负有限数时抛出范围错误
 */
export function throwIfIsNotNonNegativeFiniteNumber(variable, name = "variable") {
    let error;
    switch (true) {
        case (typeof variable !== "number"):
            error = genTypeErrorGiveType(variable, name, "a number");
            break;
        case (!Number.isFinite(variable)):
            error = genTypeErrorGiveValue(variable, name, "a non-negative finite number");
            break;
        case (variable < 0):
            error = genRangeErrorGiveValue(variable, name, "a non-negative finite number");
            break;
        default:
            return;
    }
    Error?.captureStackTrace?.(error, throwIfIsNotNonNegativeFiniteNumber);
    throw error;
}

/**
 * 检查变量是否为整数
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是整数时抛出类型错误
 */
export function throwIfIsNotInteger(variable, name = "variable") {
    let error;
    switch (true) {
        case (typeof variable !== "number"):
            error = genTypeErrorGiveType(variable, name, "a number");
            break;
        case (!Number.isInteger(variable)):
            error = genTypeErrorGiveValue(variable, name, "an integer");
            break;
        default:
            return;
    }
    Error?.captureStackTrace?.(error, throwIfIsNotInteger);
    throw error;
}
/**
 * 检查变量是否为正整数
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是正整数时抛出范围错误
 */
export function throwIfIsNotPositiveInteger(variable, name = "variable") {
    let error;
    switch (true) {
        case (typeof variable !== "number"):
            error = genTypeErrorGiveType(variable, name, "a number");
            break;
        case (!Number.isInteger(variable)):
            error = genTypeErrorGiveValue(variable, name, "a positive integer");
            break;
        case (variable <= 0):
            error = genRangeErrorGiveValue(variable, name, "a positive integer");
            break;
        default:
            return;
    }
    Error?.captureStackTrace?.(error, throwIfIsNotPositiveInteger);
    throw error;
}

/**
 * 检查变量是否为负整数
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是负整数时抛出范围错误
 */
export function throwIfIsNotNegativeInteger(variable, name = "variable") {
    let error;
    switch (true) {
        case (typeof variable !== "number"):
            error = genTypeErrorGiveType(variable, name, "a number");
            break;
        case (!Number.isInteger(variable)):
            error = genTypeErrorGiveValue(variable, name, "a negative integer");
            break;
        case (variable >= 0):
            error = genRangeErrorGiveValue(variable, name, "a negative integer");
            break;
        default:
            return;
    }
    Error?.captureStackTrace?.(error, throwIfIsNotNegativeInteger);
    throw error;
}

/**
 * 检查变量是否为非负整数（自然数，包括0）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是非负整数时抛出范围错误
 */
export function throwIfIsNotNonNegativeInteger(variable, name = "variable") {
    let error;
    switch (true) {
        case (typeof variable !== "number"):
            error = genTypeErrorGiveType(variable, name, "a number");
            break;
        case (!Number.isInteger(variable)):
            error = genTypeErrorGiveValue(variable, name, "a non-negative integer");
            break;
        case (variable < 0):
            error = genRangeErrorGiveValue(variable, name, "a non-negative integer");
            break;
        default:
            return;
    }
    Error?.captureStackTrace?.(error, throwIfIsNotNonNegativeInteger);
    throw error;
}
//
// 字符串类型守卫函数
//

/**
 * 检查传入的变量是否为字符串类型，如果不是则抛出类型错误
 * 
 * @param {*} variable - 要检查类型的变量
 * @param {string} [name="variable"] - 变量的名称，默认为"variable"
 * @throws {Error} 如果variable不是字符串类型，则会调用throwTypeErrorGiveType函数抛出错误
 */
export function throwIfIsNotString(variable, name = "variable") {
    let error;
    switch (true) {
        case (typeof variable !== "string"):
            error = genTypeErrorGiveType(variable, name, "string");
            break;
        default:
            return;
    }
    Error?.captureStackTrace?.(error, throwIfIsNotString);
    throw error;
}
//
// symbol类型守卫函数
//
/**
 * 检查传入的变量是否为符号类型，如果不是则抛出类型错误
 * 
 * @param {*} variable - 要检查类型的变量
 * @param {string} [name="variable"] - 变量的名称，默认为"variable"
 * @throws {Error} 如果variable不是符号类型，则会调用throwTypeErrorGiveType函数抛出错误
 */
export function throwIfIsNotSymbol(variable, name = "variable") {
    let error;
    switch (true) {
        case (typeof variable !== "symbol"):
            error = genTypeErrorGiveType(variable, name, "symbol");
            break;
        default:
            return;
    }
    Error?.captureStackTrace?.(error, throwIfIsNotSymbol);
    throw error;
}
//
// bigint类型守卫函数
//
/**
 * 检查传入的变量是否为 BigInt 类型，如果不是则抛出类型错误
 * 
 * @param {*} variable - 要检查类型的变量
 * @param {string} [name="variable"] - 变量的名称，默认为"variable"
 * @throws {Error} 如果variable不是BigInt类型，则会调用throwTypeErrorGiveType函数抛出错误
 */
export function throwIfIsNotBigInt(variable, name = "variable") {
    let error;
    switch (true) {
        case (typeof variable !== "bigint"):
            error = genTypeErrorGiveType(variable, name, "bigint");
            break;
        default:
            return;
    }
    Error?.captureStackTrace?.(error, throwIfIsNotBigInt);
    throw error;
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
    let error;
    switch (true) {
        case (!isPlainObject(variable)):
            error = genTypeErrorGiveType(variable, name, "a plain object");
            break;
        default:
            return;
    }
    Error?.captureStackTrace?.(error, throwIfIsNotPlainObject);
    throw error;
}
/**
 * 检查对象是否包含指定的键
 * @param {*} variable - 要检查的对象
 * @param {string} key - 要检查的键名
 * @param {string|Symbol} name - 变量名称（用于错误消息）
 * @throws {Error} 当对象中找不到指定键时抛出错误
 */
export function throwIfKeyMissing(variable, key, name = "variable") {
    let error;
    if (variable !== null && typeof variable !== "object") {
        error = genTypeErrorGiveType(variable, name, "a object");
    } else {
        key = typeof key === "symbol" ? key : String(key);
        if (!(key in variable)) {
            error = new Error(`Expected ${name} to have key : ${stringify(key)}, but cannot find.`);
        }
    }
    if (error) {
        Error?.captureStackTrace?.(error, throwIfKeyMissing);
        throw error;
    }
}
/**
 * 检查对象是否缺少所有指定的键
 * @param {*} variable - 要检查的对象
 * @param {string[]} keys - 要检查的键名数组
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当 variable 不是普通对象时抛出类型错误
 * @throws {GuardError} 当 keys 不是非空数组时抛出守卫错误
 * @throws {Error} 当对象缺少所有指定键时抛出错误
 */
export function throwIfAllKeysMissing(variable, keys, name = "variable") {
    safeGuardExecute(throwIfIsNotNonEmptyArray, keys, name, "an array of string");
    let error;
    if (variable !== null && typeof variable !== "object") {
        error = genTypeErrorGiveType(variable, name, "a object");
    } else {
        keys = keys.map(k => typeof k === "symbol" ? k : String(k));
        if (keys.every(key => !(key in variable))) {
            error = new Error(`Expected ${name} to have at least one keys of ${stringify(keys)}, but cannot find.`);
        }
    }
    if (error) {
        Error?.captureStackTrace?.(error, throwIfAllKeysMissing);
        throw error;
    }
}
/**
 * 检查对象是否缺少任意指定的键
 * @param {*} variable - 要检查的对象
 * @param {string[]} keys - 要检查的键名数组
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当 variable 不是普通对象时抛出类型错误
 * @throws {GuardError} 当 keys 不是非空数组时抛出守卫错误
 * @throws {Error} 当对象缺少任何一个指定键时抛出错误
 */
export function throwIfSomeKeysMissing(variable, keys, name = "variable") {
    safeGuardExecute(throwIfIsNotNonEmptyArray, keys, name, "an array of string");
    let error;
    if (variable !== null && typeof variable !== "object") {
        error = genTypeErrorGiveType(variable, name, "a object");
    } else {
        keys = keys.map(k => typeof k === "symbol" ? k : String(k));
        const ls = keys.filter(key => !(key in variable))
        if (ls.length) {
            error = new Error(`Expected ${name} to have at all keys of ${stringify(keys)}, but missing ${ls.map(l => stringify(l)).join(", ")}.`)
        }
    }
    if (error) {
        Error?.captureStackTrace?.(error, throwIfSomeKeysMissing);
        throw error;
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
    let error;
    if (variable !== null && typeof variable !== "object") {
        error = genTypeErrorGiveType(variable, name, "a plain object");
    } else {
        property = typeof property === "symbol" ? property : String(property)
        if (!Object.hasOwn(variable, property)) {
            error = new Error(`Expected ${name} to have own property : ${stringify(property)}, but cannot find.`);
        }
    }
    if (error) {
        Error?.captureStackTrace?.(error, throwIfOwnPropertyMissing);
        throw error;
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
    safeGuardExecute(throwIfIsNotNonEmptyArray, properties, name, "an array of string");
    let error;
    if (variable !== null && typeof variable !== "object") {
        error = genTypeErrorGiveType(variable, name, "a plain object");
    } else {
        properties = properties.map(p => typeof p === "symbol" ? p : String(p));
        if (properties.every(p => !Object.hasOwn(variable, p))) {
            error = new Error(`Expected ${name} to have at least one own property of ${stringify(properties)}, but cannot find.`);
        }
    }
    if (error) {
        Error?.captureStackTrace?.(error, throwIfAllOwnPropertiesMissing);
        throw error;
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
    safeGuardExecute(throwIfIsNotNonEmptyArray, properties, name, "an array of string");
    let error;
    if (variable !== null && typeof variable !== "object") {
        error = genTypeErrorGiveType(variable, name, "a plain object");
    } else {
        properties = properties.map(p => typeof p === "symbol" ? p : String(p));
        const ls = properties.filter(p => !Object.hasOwn(variable, p))
        if (ls.length) {
            error = new Error(`Expected ${name} to have at all own properties of ${stringify(properties)}, but missing ${ls.map(l => stringify(l)).join(", ")}.`)
        }
    }
    if (error) throw error;
}
// ------------------------------------------------
// 正则类型守卫函数
// ------------------------------------------------
/**
 * 检查传入的变量是否为正则表达式类型，如果不是则抛出类型错误
 * 
 * @param {*} variable - 要检查类型的变量
 * @param {string} [name="variable"] - 变量的名称，默认为"variable"
 * @throws {Error} 如果variable不是正则表达式类型，则会调用throwTypeErrorGiveType函数抛出错误
 */
export function throwIfIsNotRegExp(variable, name = "variable") {
    if (!(variable instanceof RegExp)) {
        const error = genTypeErrorGiveType(variable, name, "a regexp");
        Error?.captureStackTrace?.(error, throwIfIsNotRegExp);
        throw error;
    }
}
// ------------------------------------------------
// 日期类型守卫函数
// ------------------------------------------------
/**
 * 检查传入的变量是否为日期类型，如果不是则抛出类型错误
 * 
 * @param {*} variable - 要检查类型的变量
 * @param {string} [name="variable"] - 变量的名称，默认为"variable"
 * @throws {Error} 如果variable不是日期类型，则会调用throwTypeErrorGiveType函数抛出错误
 */
export function throwIfIsNotDate(variable, name = "variable") {
    if (!(variable instanceof Date)) {
        const error = genTypeErrorGiveType(variable, name, "a date");
        Error?.captureStackTrace?.(error, throwIfIsNotDate);
        throw error;
    }
}

/**
 * 检查传入的变量是否为有效的日期类型，如果不是或无效则抛出类型错误
 * 
 * @param {*} variable - 要检查类型的变量
 * @param {string} [name="variable"] - 变量的名称，默认为"variable"
 * @throws {Error} 如果variable不是日期类型或不是一个有效日期，则会抛出错误
 */
export function throwIfIsInvalidDate(variable, name = "variable") {
    let error;
    switch (true) {
        case (!(variable instanceof Date)):
            error = genTypeErrorGiveType(variable, name, "a valid date");
            break;
        case (Number.isNaN(variable.getTime())):
            error = genTypeErrorForUnexpectedValue(variable, name, "a valid date");
            break;
        default:
            return;
    }
    Error?.captureStackTrace?.(error, throwIfIsInvalidDate);
    throw error;
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
        const error = genTypeErrorGiveType(variable, name, "a function")
        Error?.captureStackTrace?.(error, throwIfIsNotFunction);
        throw error;
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
        const error = genTypeErrorGiveType(variable, name, "an iterable");
        Error?.captureStackTrace?.(error, throwIfIsNotIterable);
        throw error;
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
        const error = genTypeErrorGiveType(variable, name, "an iterable object");
        Error?.captureStackTrace?.(error, throwIfIsNotIterableObject);
        throw error;
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
        const error = genTypeErrorGiveType(variable, name, "an array");
        Error?.captureStackTrace?.(error, throwIfIsNotArray);
        throw error;
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
    let error;
    if (!Array.isArray(variable)) {
        error = genTypeErrorGiveType(variable, name, "an array");
    } else if (variable.length === 0) {
        error = new Error(`Expected ${name} to have at least one item, but got zero.`)
    }
    if (error) {
        Error?.captureStackTrace?.(error, throwIfIsNotNonEmptyArray);
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
    let error;
    if (!Array.isArray(variable)) {
        error = genTypeErrorGiveType(variable, name, "an array");
    } else {
        // 数组类型正确，现在检查每个元素
        const acceptType = "strings";
        for (const e of variable) {
            if (typeof e !== "string") {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-string value of type ${getType(e)}`);
                break;
            }
        }
    }

    if (error) {
        Error?.captureStackTrace?.(error, throwIfIsNotStringArray);
        throw error;
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
    let error;
    if (!Array.isArray(variable)) {
        error = genTypeErrorGiveType(variable, name, "an array");
    } else {
        // 数组类型正确，现在检查每个元素
        const acceptType = "bigints";
        for (const e of variable) {
            if (typeof e !== "bigint") {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-bigint value of type ${getType(e)}`);
                break;
            }
        }
    }

    if (error) {
        Error?.captureStackTrace?.(error, throwIfIsNotBigIntArray);
        throw error;
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
    let error;
    if (!Array.isArray(variable)) {
        error = genTypeErrorGiveType(variable, name, "an array");
    } else {
        // 数组类型正确，现在检查每个元素
        const acceptType = "symbols";
        for (const e of variable) {
            if (typeof e !== "symbol") {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-symbol value of type ${getType(e)}`);
                break;
            }
        }
    }

    if (error) {
        Error?.captureStackTrace?.(error, throwIfIsNotSymbolArray);
        throw error;
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
    let error;
    if (!Array.isArray(variable)) {
        error = genTypeErrorGiveType(variable, name, "an array");
    } else {
        // 数组类型正确，现在检查每个元素
        const acceptType = "plain objects";
        for (const e of variable) {
            if (!isPlainObject(e)) {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-plain object value of type ${getType(e)}`);
                break;
            }
        }
    }

    if (error) {
        Error?.captureStackTrace?.(error, throwIfIsNotPlainObjectArray);
        throw error;
    }
}
export function throwIfIsNotNumberArray(variable, name = "variable", generalTerm = `all elements of ${name || "array"}`) {
    let error;
    if (!Array.isArray(variable)) {
        error = genTypeErrorGiveType(variable, name, "an array");
    } else {
        // 数组类型正确，现在检查每个元素
        const acceptType = "numbers";
        for (const e of variable) {
            if (typeof e !== "number") {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
                break;
            }
        }
    }

    if (error) {
        Error?.captureStackTrace?.(error, throwIfIsNotNumberArray);
        throw error;
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
    let error;
    if (!Array.isArray(variable)) {
        error = genTypeErrorGiveType(variable, name, "an array");
    } else {
        // 数组类型正确，现在检查每个元素
        const acceptType = "comparable numbers(not NaN)";
        // 验证数组中的每个元素都是非NaN的数字
        for (const e of variable) {
            if (typeof e !== "number") {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
                break;
            }
            if (Number.isNaN(e)) {
                error = genTypeErrorForArray(generalTerm, acceptType, "NaN");
                break;
            }
        }
    }

    if (error) {
        Error?.captureStackTrace?.(error, throwIfIsNotComparableNumberArray);
        throw error;
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
    let error;
    if (!Array.isArray(variable)) {
        error = genTypeErrorGiveType(variable, name, "an array");
    } else {
        // 数组类型正确，现在检查每个元素
        const acceptType = "finite numbers";
        for (const e of variable) {
            if (typeof e !== "number") {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
                break;
            }
            if (Number.isNaN(e)) {
                error = genTypeErrorForArray(generalTerm, acceptType, "NaN");
                break;
            }
            if (!Number.isFinite(e)) {
                const desc = e > 0 ? "Infinity" : "-Infinity";
                error = genTypeErrorForArray(generalTerm, acceptType, desc);
                break;
            }
        }
    }

    if (error) {
        Error?.captureStackTrace?.(error, throwIfIsNotFiniteNumberArray);
        throw error;
    }
}
export function throwIfIsNotDivisibleNumberArray(variable, name = "variable", generalTerm = `all elements of ${name || "array"}`) {
    let error;
    if (!Array.isArray(variable)) {
        error = genTypeErrorGiveType(variable, name, "an array");
    } else {
        // 数组类型正确，现在检查每个元素
        const acceptType = "disvisible numbers";
        for (const e of variable) {
            if (typeof e !== "number") {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
                break;
            }
            if (Number.isNaN(e)) {
                error = genTypeErrorForArray(generalTerm, acceptType, "NaN");
                break;
            }
            if (!Number.isFinite(e)) {
                const desc = e > 0 ? "Infinity" : "-Infinity";
                error = genTypeErrorForArray(generalTerm, acceptType, desc);
                break;
            }
            if (e === 0) {
                error = genTypeErrorForArray(generalTerm, acceptType, "zero");
                break;
            }
        }
    }

    if (error) {
        Error?.captureStackTrace?.(error, throwIfIsNotDivisibleNumberArray);
        throw error;
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
    let error;
    if (!Array.isArray(variable)) {
        error = genTypeErrorGiveType(variable, name, "an array");
    } else {
        // 数组类型正确，现在检查每个元素
        const acceptType = "positive finite numbers";
        for (const e of variable) {
            if (typeof e !== "number") {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
                break;
            }
            if (Number.isNaN(e)) {
                error = genTypeErrorForArray(generalTerm, acceptType, "NaN");
                break;
            }
            if (!Number.isFinite(e)) {
                const desc = e > 0 ? "Infinity" : "-Infinity";
                error = genTypeErrorForArray(generalTerm, acceptType, desc);
                break;
            }
            if (e <= 0) {
                const desc = e === 0 ? "zero" : `a negative number (${e})`;
                error = genTypeErrorForArray(generalTerm, acceptType, desc);
                break;
            }
        }
    }

    if (error) {
        Error?.captureStackTrace?.(error, throwIfIsNotPositiveFiniteNumberArray);
        throw error;
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
    let error;
    if (!Array.isArray(variable)) {
        error = genTypeErrorGiveType(variable, name, "an array");
    } else {
        // 数组类型正确，现在检查每个元素
        const acceptType = "non-negative finite numbers";
        for (const e of variable) {
            if (typeof e !== "number") {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
                break;
            }
            if (Number.isNaN(e)) {
                error = genTypeErrorForArray(generalTerm, acceptType, "NaN");
                break;
            }
            if (!Number.isFinite(e)) {
                const desc = e > 0 ? "Infinity" : "-Infinity";
                error = genTypeErrorForArray(generalTerm, acceptType, desc);
                break;
            }
            if (e < 0) {
                const desc = `a negative number (${e})`;
                error = genTypeErrorForArray(generalTerm, acceptType, desc);
                break;
            }
        }
    }

    if (error) {
        Error?.captureStackTrace?.(error, throwIfIsNotNonNegativeFiniteNumberArray);
        throw error;
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
    let error;
    if (!Array.isArray(variable)) {
        error = genTypeErrorGiveType(variable, name, "an array");
    } else {
        // 数组类型正确，现在检查每个元素
        const acceptType = "negative finite numbers";
        for (const e of variable) {
            if (typeof e !== "number") {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
                break;
            }
            if (Number.isNaN(e)) {
                error = genTypeErrorForArray(generalTerm, acceptType, "NaN");
                break;
            }
            if (!Number.isFinite(e)) {
                const desc = e > 0 ? "Infinity" : "-Infinity";
                error = genTypeErrorForArray(generalTerm, acceptType, desc);
                break;
            }
            if (e >= 0) {
                const desc = e === 0 ? "zero" : `a positive number (${e})`;
                error = genTypeErrorForArray(generalTerm, acceptType, desc);
                break;
            }
        }
    }

    if (error) {
        Error?.captureStackTrace?.(error, throwIfIsNotNegativeFiniteNumberArray);
        throw error;
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
    let error;
    if (!Array.isArray(variable)) {
        error = genTypeErrorGiveType(variable, name, "an array");
    } else {
        // 数组类型正确，现在检查每个元素
        const acceptType = "integers";
        for (const e of variable) {
            if (typeof e !== "number") {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
                break;
            }
            if (Number.isNaN(e)) {
                error = genTypeErrorForArray(generalTerm, acceptType, "NaN");
                break;
            }
            if (!Number.isFinite(e)) {
                const desc = e > 0 ? "Infinity" : "-Infinity";
                error = genTypeErrorForArray(generalTerm, acceptType, desc);
                break;
            }
            if (!Number.isInteger(e)) {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-integer value (${e})`);
                break;
            }
        }
    }

    if (error) {
        Error?.captureStackTrace?.(error, throwIfIsNotIntegerArray);
        throw error;
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
    let error;
    if (!Array.isArray(variable)) {
        error = genTypeErrorGiveType(variable, name, "an array");
    } else {
        // 数组类型正确，现在检查每个元素
        const acceptType = "positive integers";
        for (const e of variable) {
            if (typeof e !== "number") {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
                break;
            }
            if (Number.isNaN(e)) {
                error = genTypeErrorForArray(generalTerm, acceptType, "NaN");
                break;
            }
            if (!Number.isFinite(e)) {
                const desc = e > 0 ? "Infinity" : "-Infinity";
                error = genTypeErrorForArray(generalTerm, acceptType, desc);
                break;
            }
            if (!Number.isInteger(e)) {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-integer value (${e})`);
                break;
            }
            if (e <= 0) {
                const desc = e === 0 ? "zero" : `a negative number (${e})`;
                error = genTypeErrorForArray(generalTerm, acceptType, desc);
                break;
            }
        }
    }

    if (error) {
        Error?.captureStackTrace?.(error, throwIfIsNotPositiveIntegerArray);
        throw error;
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
    let error;
    if (!Array.isArray(variable)) {
        error = genTypeErrorGiveType(variable, name, "an array");
    } else {
        // 数组类型正确，现在检查每个元素
        const acceptType = "non-negative integers";
        for (const e of variable) {
            if (typeof e !== "number") {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
                break;
            }
            if (Number.isNaN(e)) {
                error = genTypeErrorForArray(generalTerm, acceptType, "NaN");
                break;
            }
            if (!Number.isFinite(e)) {
                const desc = e > 0 ? "Infinity" : "-Infinity";
                error = genTypeErrorForArray(generalTerm, acceptType, desc);
                break;
            }
            if (!Number.isInteger(e)) {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-integer value (${e})`);
                break;
            }
            if (e < 0) {
                const desc = `a negative number (${e})`;
                error = genTypeErrorForArray(generalTerm, acceptType, desc);
                break;
            }
        }
    }

    if (error) {
        Error?.captureStackTrace?.(error, throwIfIsNotNonNegativeIntegerArray);
        throw error;
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
    let error;
    if (!Array.isArray(variable)) {
        error = genTypeErrorGiveType(variable, name, "an array");
    } else {
        // 数组类型正确，现在检查每个元素
        const acceptType = "negative integers";
        for (const e of variable) {
            if (typeof e !== "number") {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-number value of type ${getType(e)}`);
                break;
            }
            if (Number.isNaN(e)) {
                error = genTypeErrorForArray(generalTerm, acceptType, "NaN");
                break;
            }
            if (!Number.isFinite(e)) {
                const desc = e > 0 ? "Infinity" : "-Infinity";
                error = genTypeErrorForArray(generalTerm, acceptType, desc);
                break;
            }
            if (!Number.isInteger(e)) {
                error = genTypeErrorForArray(generalTerm, acceptType, `a non-integer value (${e})`);
                break;
            }
            if (e >= 0) {
                const desc = e === 0 ? "zero" : `a positive number (${e})`;
                error = genTypeErrorForArray(generalTerm, acceptType, desc);
                break;
            }
        }
    }

    if (error) {
        Error?.captureStackTrace?.(error, throwIfIsNotNegativeIntegerArray);
        throw error;
    }
}