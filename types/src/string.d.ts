/**
 * 将字符串按照指定步长进行分块处理
 * @param {string} input - 需要分块的输入字符串
 * @param {number} step - 分块步长，必须为非零整数。正数表示从左到右分块，负数表示从右到左分块
 * @returns {string[]} 返回分块后的字符串数组
 * @throws {TypeError} 当input不是字符串或step不是整数时抛出
 * @throws {RangeError} 当step为0时抛出
 */
export function chunkString(input: string, step: number): string[];
