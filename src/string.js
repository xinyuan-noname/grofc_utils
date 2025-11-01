/**
 * 将字符串按照指定步长进行分块处理
 * @param {string} input - 需要分块的输入字符串
 * @param {number} step - 分块步长，必须为非零整数。正数表示从左到右分块，负数表示从右到左分块
 * @returns {string[]} 返回分块后的字符串数组
 * @throws {TypeError} 当input不是字符串或step不是整数时抛出
 * @throws {RangeError} 当step为0时抛出
 */
export function chunkString(input, step) {
    if (typeof input !== "string") throw new TypeError(`${input} must be string.`);
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