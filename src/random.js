/**
 * 本函数用于生成指定范围内的随机整数。包含边界。
 * @param {number} a 
 * @param {number} b 
 * @returns {number} 属于 [min,max]
 */
export function randomInt(a, b) {
    a = Number(a), b = Number(b);
    if (Number.isNaN(a) || Number.isNaN(b)) throw new TypeError(`Both arguments must be numbers. Received: a=${a}, b=${b}`);
    const [l, r] = a > b ? [b, a] : [a, b];
    return Math.floor(Math.random() * (r - l + 1)) + l;
}

/**
 * 本函数用于生成指定范围内的随机整数数组。
 * @param {Iterable<number>} range 
 * @param {number} len 
 * @returns {number[]} 每个元素属于[min,max]
 */
export function randomInts(range, len = 0) {
    if (!Number.isInteger(len) || len < 0) throw new TypeError("len must be a non-negative integer.");
    let a, b;
    try {
        [a, b] = range
    } catch (err) {
        throw new TypeError("range must be iterable.")
    }
    return Array.from({ length: len }, () => randomInt(a, b));
}
/**
 * 本函数用于生成指定范围内的随机浮点数。
 * @param {number} a 
 * @param {number} b 
 * @returns {number} 属于 [min,max)
 */
export function randomFloat(a, b) {
    a = Number(a), b = Number(b);
    if (Number.isNaN(a) || Number.isNaN(b)) throw new TypeError(`Both arguments must be numbers. Received: a=${a}, b=${b}`);
    const [l, r] = a > b ? [b, a] : [a, b];
    return Math.random() * (r - l) + l;
}
/**
 * 本函数用于生成指定范围内的随机实数数组。
 * @param {Iterable<number>} range 
 * @param {number} len 
 * @returns {number[]} 每个元素属于[min,max)
 */
export function randomFloats(range, len = 0) {
    if (!Number.isInteger(len) || len < 0) throw new TypeError("len must be a non-negative integer.");
    let a, b
    try {
        [a, b] = range
    } catch (err) {
        throw new TypeError("range must be iterable.")
    }
    return Array.from({ length: len }, () => randomFloat(a, b));
}
/**
 * 利用box-muller变换生成标准正态分布随机数
 * @returns {number} 服从标准正态分布的随机数
 */
export function randomGaussian() {
    const u = Math.random(), v = Math.random();
    const mod = Math.sqrt(-2.0 * Math.log(u));
    const arg = 2.0 * Math.PI * v;
    return mod * Math.cos(arg);
}
/**
 * 生成标准正态分布随机数数组
 * @param {number} len 数组长度
 * @param {()=>number} generator 标准正态分布随机数生成器
 * @returns 
 */
export function randomGaussians(len, generator = randomGaussian) {
    if (!Number.isInteger(len) || len < 0) throw new TypeError("len must be a non-negative integer.");
    return Array.from({ length: len }, () => generator());
}
/**
 * 生成指定均值和标准差的正态分布随机数
 * @param {number} mu 正态分布的均值
 * @param {number} sigma 正态分布的标准差
 * @param {()=>number} generator 标准正态分布随机数生成器
 * @returns 
 */
export function randomNormal(mu = 0, sigma = 1, generator = randomGaussian) {
    if (typeof mu !== 'number' || typeof sigma !== 'number' || Number.isNaN(mu) || Number.isNaN(sigma) || sigma <= 0) {
        throw new TypeError("mu must be a number and sigma must be a positive number.");
    }
    return mu + sigma * generator();
}
/**
 * 生成指定均值和标准差的正态分布随机数数组
 * @param {number} len 数组长度
 * @param {number} mu 正态分布的均值
 * @param {number} sigma 正态分布的标准差
 * @param {()=>number} generator 标准正态分布随机数生成器
 * @returns {number[]}
 */
export function randomNormals(len, mu = 0, sigma = 1, generator = randomGaussian) {
    if (!Number.isInteger(len) || len < 0) throw new TypeError("len must be a non-negative integer.");
    return Array.from({ length: len }, () => randomNormal(mu, sigma, generator));
}
/**
 * 生成指定维度和模长的随机向量
 * @param {number} dim 生成向量的维度
 * @param {number} mod 生成向量的模长
 * @param {()=>number} generator 标准正态分布随机数生成器 
 * @returns {number[]}
 */
export function randomVector(dim, mod, generator = randomGaussian) {
    if (!Number.isInteger(dim) || dim <= 0) throw new TypeError("dim must be a positive integer.");
    if (typeof mod !== 'number' || Number.isNaN(mod) || mod <= 0) throw new TypeError("mod must be a positive number.");
    const vec = Array.from({ length: dim }, () => generator());
    const length = Math.hypot(...vec);
    return vec.map(v => v / length * mod);
}
/**
 * 传入高斯随机数生成器，并生成对应的函数对象
 * @param {()=>number} generator 
 * @returns {}
 */
export function withGaussianGenerator(generator) {
    if (typeof generator !== "function") throw TypeError("generator must be a function that returns a standard normal random number.")
    return {
        randomGaussian: () => generator(),
        randomGaussians: (len) => randomGaussians(len, generator),
        randomNormal: (mu, sigma) => randomNormal(mu, sigma, generator),
        randomNormals: (len, mu, sigma) => randomNormals(len, mu, sigma, generator),
        randomVector: (dim, mod) => randomVector(dim, mod, generator)
    }
}
/**
 * 
 * @param {Iterable<T>} inputFlow 
 * @returns {T[]}
 */
export function randomSort(inputFlow) {
    if (typeof inputFlow?.[Symbol.iterator] !== 'function') throw new TypeError("inputFlow must be an iterable.");
    const result = Array.from(inputFlow);
    let lastIndex = result.length - 1;
    while (lastIndex > 0) {
        const randomIndex = randomInt(0, lastIndex)
        const temp = result[randomIndex];
        result[randomIndex] = result[lastIndex];
        result[lastIndex] = temp;
        lastIndex--;
    }
    return result;
}

export const shuffle = randomSort;

/**
 * 简单随机选取一个样本
 * @template T
 * @param {Iterable<T>} inputFlow 
 * @returns {T}
 */
export function randomPick(inputFlow) {
    if (typeof inputFlow?.[Symbol.iterator] !== 'function') throw new TypeError("inputFlow must be an iterable.");
    const dataList = Array.from(inputFlow);
    return dataList[randomInt(0, dataList.length - 1)]
}

/**
 * 简单放回抽样
 * @template T
 * @param {Iterable<T>} inputList 
 * @param {number} len 
 * @returns {T[]}
 */
export function randomPicks(inputList, len = 0) {
    if (!Number.isInteger(len) || len < 0) throw new TypeError("len must be a non-negative integer.");
    if (typeof inputList?.[Symbol.iterator] !== 'function') throw new TypeError("inputList must be an iterable.");
    const dataList = Array.from(inputList);
    return dataList.length ? Array.from({ length: len }, () => dataList[randomInt(0, dataList.length - 1)]) :
        Array.from({ length: len })
}
/**
 * 带权重的随机选取一个样本
 * @template T
 * @param {Map<T,number>} inputMap 
 * @returns {T}
 */
export function randomChoice(inputMap) {
    if (!(inputMap instanceof Map)) {
        if (inputMap == null) throw new TypeError("inputMap must be a Map or can be seen as a object.");
        inputMap = new Map(Object.entries(inputMap));
    }
    const samples = [];
    const weights = [];
    for (const [k, v] of inputMap) {
        samples.push(k);
        weights.push(Number(v));
    }
    if (weights.some(w => w < 0 || Number.isNaN(w))) {
        throw new TypeError("All weights must be non-negative numbers.");
    }
    const cum_weights = weights.slice();
    for (let i = 1; i < cum_weights.length; i++) {
        cum_weights[i] += cum_weights[i - 1];
    }
    const totalWeight = cum_weights[cum_weights.length - 1];
    if (totalWeight === 0) {
        throw new RangeError("At least one weight must be positive.");
    }
    const r = randomFloat(0, totalWeight);
    let left = 0, right = cum_weights.length;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (r > cum_weights[mid]) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return samples[left];
}

/**
 * 带权重的放回抽样
 * @template T
 * @param {Map<T,number>} inputMap 
 * @param {number} len 
 * @returns {T[]}
 */
export function randomChoices(inputMap, len = 0) {
    if (!Number.isInteger(len) || len < 0) throw new TypeError("len must be a non-negative integer.");
    if (!(inputMap instanceof Map)) {
        if (inputMap == null) throw new TypeError("inputMap must be a Map or can be seen as a object.");
        inputMap = new Map(Object.entries(inputMap));
    }
    const samples = [];
    const weights = [];
    for (const [k, v] of inputMap) {
        samples.push(k);
        weights.push(Number(v));
    }
    if (weights.some(w => w < 0 || Number.isNaN(w))) {
        throw new TypeError("All weights must be non-negative numbers.");
    }
    const cum_weights = weights.slice();
    for (let i = 1; i < cum_weights.length; i++) {
        cum_weights[i] += cum_weights[i - 1];
    }
    const totalWeight = cum_weights[cum_weights.length - 1];
    if (totalWeight === 0) {
        throw new RangeError("At least one weight must be positive.");
    }
    const result = [];
    for (let i = 0; i < len; i++) {
        const r = randomFloat(0, totalWeight);
        let left = 0, right = cum_weights.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (r > cum_weights[mid]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        result.push(samples[left]);
    }
    return result;
}

/**
 * 随机抽取样本，由于采用了蓄水池抽样，数据输出的顺序与原顺序相关联
 * @template T
 * @param {Iterable<T>} inputFlow 
 * @param {number} len 
 * @returns {T[]}
 */
export function randomSample(inputFlow, len = 0) {
    if (!Number.isInteger(len) || len < 0) throw new TypeError("len must be a non-negative integer.");
    if (typeof inputFlow?.[Symbol.iterator] !== 'function') throw new TypeError("inputFlow must be an iterable.");
    const result = [];
    let index = 0;
    for (const input of inputFlow) {
        if (index < len) result.push(input);
        else {
            const r = randomInt(0, index);
            if (r < len) result[r] = input;
        }
        index++;
    }
    return result
}