/**
 * 检查变量是否为可比较的数字（不是 NaN）
 * @param {*} variable - 需要检查的变量
 * @returns {boolean} 如果变量是数字且不是 NaN 返回 true，否则返回 false
 */
export function isComparableNumber(variable: any): boolean;
export function isDivisibleNumber(variable: any): boolean;
/**
 * 检查变量是否为 null 或 undefined
 * @param {*} variable - 需要检查的变量
 * @returns {boolean} 如果变量为 null 或 undefined 返回 true，否则返回 false
 */
export function isNullishValue(variable: any): boolean;
/**
 * 检查给定对象是否为普通对象
 * 普通对象是指通过对象字面量 {} 或 new Object() 创建的对象，
 * 不包括数组、函数以及其他自定义构造函数创建的实例
 * @param {*} variable - 需要检查的对象
 * @returns {boolean} 如果是普通对象返回 true，否则返回 false
 */
export function isPlainObject(variable: any): boolean;
export function isRegExp(variable: any): boolean;
/**
 * 检查变量是否为期望值之一，如果不是则抛出类型错误
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息），默认值为"variable"
 * @param {...*} expectedValues - 期望值列表
 * @throws {TypeError} 当变量不是期望值之一时抛出类型错误
 */
export function throwIfIsNotExpectedValue(variable: any, name?: string, ...expectedValues: any[]): void;
/**
 * 检查变量是否为不期望的值之一，如果是则抛出类型错误
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息），默认值为"variable"
 * @param {...*} unexpectedValues - 不期望的值列表
 * @throws {TypeError} 当变量是不期望的值之一时抛出类型错误
 */
export function throwIfIsUnExpectedValue(variable: any, name?: string, ...unexpectedValues: any[]): void;
/**
 * 检查变量是否为空值（不为 null 或 undefined）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量为 null 或 undefined 时抛出类型错误
 */
export function throwIfIsNullishValue(variable: any, name?: string): void;
/**
 * 检查变量是否为真值（truthy）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量为假值（falsy）时抛出类型错误
 */
export function throwIfIsFalsyValue(variable: any, name?: string): void;
/**
 * 检查变量是否为数字类型
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是数字类型时抛出类型错误
 */
export function throwIfIsNotNumber(variable: any, name?: string): void;
/**
 * 检查数字变量是否为 NaN（非数字）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量是 NaN 时抛出类型错误
 */
export function throwIfIsNotComparableNumber(variable: any, name?: string): void;
/**
 * 检查变量是否为有限数字（排除 Infinity 和 -Infinity，但允许 NaN）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是有限数字时抛出类型错误
 */
export function throwIfIsNotFiniteNumber(variable: any, name?: string): void;
export function throwIfIsNotDivisibleNumber(variable: any, name?: string): void;
/**
 * 检查变量是否为正有限数
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是正有限数时抛出范围错误
 */
export function throwIfIsNotPositiveFiniteNumber(variable: any, name?: string): void;
/**
 * 检查变量是否为负有限数
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是负有限数时抛出范围错误
 */
export function throwIfIsNotNegativeFiniteNumber(variable: any, name?: string): void;
/**
 * 检查变量是否为非负有限数（大于等于0的有限数）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是非负有限数时抛出范围错误
 */
export function throwIfIsNotNonNegativeFiniteNumber(variable: any, name?: string): void;
/**
 * 检查变量是否为整数
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是整数时抛出类型错误
 */
export function throwIfIsNotInteger(variable: any, name?: string): void;
/**
 * 检查变量是否为正整数
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是正整数时抛出范围错误
 */
export function throwIfIsNotPositiveInteger(variable: any, name?: string): void;
/**
 * 检查变量是否为负整数
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是负整数时抛出范围错误
 */
export function throwIfIsNotNegativeInteger(variable: any, name?: string): void;
/**
 * 检查变量是否为非负整数（自然数，包括0）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {RangeError} 当变量不是非负整数时抛出范围错误
 */
export function throwIfIsNotNonNegativeInteger(variable: any, name?: string): void;
export function throwIfIsNotString(variable: any, name?: string): void;
export function throwIfIsNotSymbol(variable: any, name?: string): void;
export function throwIfIsNotBigInt(variable: any, name?: string): void;
/**
 * 检查变量是否为普通对象（非 null，非数组）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是普通对象时抛出类型错误
 */
export function throwIfIsNotPlainObject(variable: any, name?: string): void;
/**
 * 检查对象是否包含指定的键
 * @param {*} variable - 要检查的对象
 * @param {string} key - 要检查的键名
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当variable不是普通对象或key不是字符串时抛出类型错误
 * @throws {Error} 当对象中找不到指定键时抛出错误
 */
export function throwIfKeyMissing(variable: any, key: string, name?: string): void;
/**
 * 检查对象是否缺少所有指定的键
 * @param {*} variable - 要检查的对象
 * @param {string[]} keys - 要检查的键名数组
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当 variable 不是普通对象时抛出类型错误
 * @throws {GuardError} 当 keys 不是字符串或字符串数组时抛出守卫错误
 * @throws {Error} 当对象缺少所有指定键时抛出错误
 */
export function throwIfAllKeysMissing(variable: any, keys: string[], name?: string): void;
/**
 * 检查对象是否缺少任意指定的键
 * @param {*} variable - 要检查的对象
 * @param {string[]} keys - 要检查的键名数组
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当 variable 不是普通对象时抛出类型错误
 * @throws {GuardError} 当 keys 不是字符串或字符串数组时抛出守卫错误
 * @throws {Error} 当对象缺少任何一个指定键时抛出错误
 */
export function throwIfSomeKeysMissing(variable: any, keys: string[], name?: string): void;
/**
 * 检查对象是否包含指定的键
 * @param {*} variable - 要检查的对象
 * @param {string} property - 要检查的键名
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当variable不是普通对象或property不是字符串时抛出类型错误
 * @throws {Error} 当对象中找不到指定键时抛出错误
 */
export function throwIfOwnPropertyMissing(variable: any, property: string, name?: string): void;
/**
 * 检查对象是否缺少所有指定的键
 * @param {*} variable - 要检查的对象
 * @param {string[]}properties- 要检查的键名数组
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当 variable 不是普通对象时抛出类型错误
 * @throws {GuardError} 当properties不是字符串或字符串数组时抛出守卫错误
 * @throws {Error} 当对象缺少所有指定键时抛出错误
 */
export function throwIfAllOwnPropertiesMissing(variable: any, properties: any, name?: string): void;
/**
 * 检查对象是否缺少任意指定的键
 * @param {*} variable - 要检查的对象
 * @param {string[]} properties - 要检查的键名数组
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当 variable 不是普通对象时抛出类型错误
 * @throws {GuardError} 当 properties 不是字符串或字符串数组时抛出守卫错误
 * @throws {Error} 当对象缺少任何一个指定键时抛出错误
 */
export function throwIfSomeOwnPropertiesMissing(variable: any, properties: string[], name?: string): void;
/**
 * 检查变量是否为函数类型，如果不是则抛出类型错误
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息），默认值为"variable"
 * @throws {TypeError} 当变量不是函数类型时抛出类型错误
 */
export function throwIfIsNotFunction(variable: any, name?: string): void;
/**
 * 检查变量是否为可迭代对象或字符串
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是可迭代对象或字符串时抛出类型错误
 */
export function throwIfIsNotIterable(variable: any, name?: string): void;
/**
 * 检查变量是否为可迭代对象，如果不是则抛出类型错误
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是可迭代对象时抛出类型错误
 */
export function throwIfIsNotIterableObject(variable: any, name?: string): void;
/**
 * 检查变量是否为数组，如果不是则抛出类型错误
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息），默认值为"variable"
 * @throws {TypeError} 当变量不是数组时抛出类型错误
 */
export function throwIfIsNotArray(variable: any, name?: string): void;
/**
 * 检查变量是否为非空数组，如果不是则抛出错误
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息），默认值为"variable"
 * @throws {TypeError} 当变量不是数组时抛出类型错误
 * @throws {Error} 当变量是空数组时抛出错误
 */
export function throwIfIsNotNonEmptyArray(variable: any, name?: string): void;
/**
 * 检查变量是否为仅包含字符串的数组，如果不是则抛出类型错误
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息），默认值为"variable"
 * @param {string} generalTerm - 通用术语（用于错误消息），默认值为`all elements of ${name || "array"}`
 * @throws {TypeError} 当变量不是数组或包含非字符串元素时抛出类型错误
 */
export function throwIfIsNotStringArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 检查变量是否为仅包含BigInt值的数组，如果不是则抛出类型错误
 * @param {*} variable - 需要检查的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息显示
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 通用术语，用于错误消息显示
 * @throws {TypeError} 当变量不是数组或包含非BigInt元素时抛出类型错误
 */
export function throwIfIsNotBigIntArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 检查变量是否为仅包含Symbol值的数组，如果不是则抛出类型错误
 * @param {*} variable - 需要检查的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息显示
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 通用术语，用于错误消息显示
 * @throws {TypeError} 当变量不是数组或包含非Symbol元素时抛出类型错误
 */
export function throwIfIsNotSymbolArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 检查变量是否为仅包含普通对象的数组，如果不是则抛出类型错误
 * @param {*} variable - 需要检查的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息显示
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 通用术语，用于错误消息显示
 * @throws {TypeError} 当变量不是数组或包含非普通对象元素时抛出类型错误
 */
export function throwIfIsNotPlainObjectArray(variable: any, name?: string, generalTerm?: string): void;
export function throwIfIsNotNumberArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 检查变量是否为仅包含非NaN数字的数组，如果不是则抛出类型错误
 *
 * @param {*} variable - 需要检查的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息显示
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 通用术语，用于错误消息显示
 * @throws {TypeError} 当变量不是数组或数组元素不符合要求时抛出错误
 */
export function throwIfIsNotComparableNumberArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 校验变量是否为仅包含有限数（有限 number）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、-Infinity
 */
export function throwIfIsNotFiniteNumberArray(variable: any, name?: string, generalTerm?: string): void;
export function throwIfIsNotDivisibleNumberArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 校验变量是否为仅包含正有限数（> 0 的有限 number）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、负数、零
 */
export function throwIfIsNotPositiveFiniteNumberArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 校验变量是否为仅包含非负有限数（>= 0 的有限 number）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、负数
 */
export function throwIfIsNotNonNegativeFiniteNumberArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 校验变量是否为仅包含负有限数（< 0 的有限 number）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、正数、零
 */
export function throwIfIsNotNegativeFiniteNumberArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 校验变量是否为仅包含整数的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、小数
 */
export function throwIfIsNotIntegerArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 校验变量是否为仅包含正整数（> 0 的整数）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、负数、零、小数
 */
export function throwIfIsNotPositiveIntegerArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 校验变量是否为仅包含非负整数（>= 0 的整数）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、负数、小数
 */
export function throwIfIsNotNonNegativeIntegerArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 校验变量是否为仅包含负整数（< 0 的整数）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、正数、零、小数
 */
export function throwIfIsNotNegativeIntegerArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 检查数字变量是否为 NaN（非数字）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量是 NaN 时抛出类型错误
 */
export function throwIfIsNotNumberOrIsNaN(variable: any, name?: string): void;
/**
 * 检查变量是否为仅包含非NaN数字的数组，如果不是则抛出类型错误
 *
 * @param {*} variable - 需要检查的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息显示
 * @param {string} [generalTerm=`all elements of ${name || "array"}`] - 通用术语，用于错误消息显示
 * @throws {TypeError} 当变量不是数组或数组元素不符合要求时抛出错误
 */
export function throwIfIsNumberArrayWithoutNaN(variable: any, name?: string, generalTerm?: string): void;
