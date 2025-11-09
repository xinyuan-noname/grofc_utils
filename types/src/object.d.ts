/**
 * 将对象的指定属性设置为只读
 * @param {Object} obj - 需要修改的对象
 * @param {string} name - 需要设为只读的属性名
 * @throws {TypeError} 当obj不是普通对象或name不是字符串时会抛出类型错误
 * @throws {Error} 当对象中找不到指定属性时会抛出错误
 */
export function makePropertyReadOnly(obj: Object, name: string): void;
/**
 * 使用属性描述符将一个或多个源对象的属性分配到目标对象中
 * @param {Object} target - 目标对象，将接收来自其他对象的属性
 * @param {...Object} sources - 源对象列表，其所有可枚举和不可枚举属性都将被复制到目标对象中
 * @throws {TypeError} 当target不是普通对象时抛出类型错误
 * @throws {TypeError} 当sources中的任何一个元素不是普通对象时抛出类型错误
 * @returns {void}
 */
export function assignWithDescriptors(target: Object, ...sources: Object[]): void;
