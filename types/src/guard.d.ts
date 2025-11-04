/**
 * 检查函数调用时是否缺少必要参数
 * @param {IArguments|Array} args - 实际传入的参数列表
 * @param {number} expectedCount - 期望的参数数量
 * @throws {Error} 当实际参数少于期望参数时抛出错误
 */
export function throwIfArgumentsMissing(args: IArguments | any[], expectedCount: number): void;
/**
 * 检查变量是否为有效值（不为 null 或 undefined）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量为 null 或 undefined 时抛出类型错误
 */
export function throwIfIsInvalidValue(variable: any, name?: string): void;
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
 * 检查变量是否为有限数字（排除 Infinity 和 -Infinity，但允许 NaN）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是有限数字时抛出类型错误
 */
export function throwIfIsNotFiniteNumber(variable: any, name?: string): void;
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
/**
 * 检查变量是否为普通对象（非 null，非数组）
 * @param {*} variable - 要检查的变量
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当变量不是普通对象时抛出类型错误
 */
export function throwIfIsNotPlainObject(variable: any, name?: string): void;
/**
 * 检查对象是否缺少所有指定的键
 * @param {*} variable - 要检查的对象
 * @param {string|string[]} keys - 要检查的键名或键名数组
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当 variable 不是普通对象时抛出类型错误
 * @throws {GuardError} 当 keys 不是字符串或字符串数组时抛出守卫错误
 * @throws {Error} 当对象缺少所有指定键时抛出错误
 */
export function throwIfAllKeysMissing(variable: any, keys: string | string[], name?: string): void;
/**
 * 检查对象是否缺少任意指定的键
 * @param {*} variable - 要检查的对象
 * @param {string|string[]} keys - 要检查的键名或键名数组
 * @param {string} name - 变量名称（用于错误消息）
 * @throws {TypeError} 当 variable 不是普通对象时抛出类型错误
 * @throws {GuardError} 当 keys 不是字符串或字符串数组时抛出守卫错误
 * @throws {Error} 当对象缺少任何一个指定键时抛出错误
 */
export function throwIfSomeKeysMissing(variable: any, keys: string | string[], name?: string): void;
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
export function throwIfIsNotArray(variable: any, name?: string): void;
export function throwIfIsNotNonEmptyArray(variable: any, name?: string): void;
/**
 * 校验变量是否为仅包含有限数（有限 number）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、-Infinity
 */
export function throwIfIsNotFiniteNumberArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 校验变量是否为仅包含正有限数（> 0 的有限 number）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、负数、零
 */
export function throwIfIsNotPositiveFiniteNumberArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 校验变量是否为仅包含非负有限数（>= 0 的有限 number）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、负数
 */
export function throwIfIsNotNonNegativeFiniteNumberArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 校验变量是否为仅包含负有限数（< 0 的有限 number）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、正数、零
 */
export function throwIfIsNotNegativeFiniteNumberArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 校验变量是否为仅包含整数的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、小数
 */
export function throwIfIsNotIntegerArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 校验变量是否为仅包含正整数（> 0 的整数）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、负数、零、小数
 */
export function throwIfIsNotPositiveIntegerArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 校验变量是否为仅包含非负整数（>= 0 的整数）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、负数、小数
 */
export function throwIfIsNotNonNegativeIntegerArray(variable: any, name?: string, generalTerm?: string): void;
/**
 * 校验变量是否为仅包含负整数（< 0 的整数）的数组。
 * @param {*} variable - 待校验的变量
 * @param {string} [name="variable"] - 变量名称，用于错误消息上下文
 * @param {string} [generalTerm=`all elements of ${name}`] - 元素合称，用于错误消息上下文
 * @throws {TypeError} 若 variable 不是数组，或包含非数字、NaN、Infinity、正数、零、小数
 */
export function throwIfIsNotNegativeIntegerArray(variable: any, name?: string, generalTerm?: string): void;
