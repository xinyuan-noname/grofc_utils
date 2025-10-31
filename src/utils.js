/**
 * @param {string|any[]} input 
 * @param {number} step 
 * @returns 
 */
export function chunk(input, step) {
    if (typeof input !== "string" && !Array.isArray(input)) throw new TypeError(`${input} must be string or array.`);
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
/**
 * @template T
 * @param {T | Iterable<T>} inputData 
 * @param {{
 *   times: number,                      
 *   stringSplit?: number | null,        
 *   invalidityChecker?: any | any[] | ((value: any) => boolean), 
 *   defaultValue?: any
 * }} options
 * @returns {T[]} 
 */
export function forwardFillUntil(inputData, options = {}) {
    const result = []
    const checkInvalidity = typeof options.invalidityChecker === "function" ? options.invalidityChecker
        : Array.isArray(options.invalidityChecker) ? (v) => options.invalidityChecker.includes(v)
            : (v) => v === options.invalidityChecker;
    let dataList;
    if (typeof inputData === "string") {
        if (options.stringSplit != null) {
            dataList = chunk(inputData, options.stringSplit);
        } else {
            dataList = [inputData];
        }
    } else {
        dataList = typeof inputData?.[Symbol.iterator] === 'function' ? inputData : [inputData]
    }
    let currentValue, hasValidValue;
    if ("defaultValue" in options) {
        currentValue = options.defaultValue;
        hasValidValue = !checkInvalidity(currentValue);
    }
    let count = 0;
    for (const gottenValue of dataList) {
        if (!checkInvalidity(gottenValue)) {
            currentValue = gottenValue;
            hasValidValue = true;
        }
        if (!hasValidValue) continue;
        count++;
        result.push(currentValue)
        if (count >= options.times) return result;
    }
    if (!hasValidValue) return result;
    while (count < options.times) {
        result.push(currentValue)
        count++;
    }
    return result;
}
export default{
    chunk,
    forwardFillUntil
}