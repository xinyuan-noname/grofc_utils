/**
 * 本函数用于生成指定范围内的随机整数。包含边界。
 * @param {number} a
 * @param {number} b
 * @returns {number} 属于 [min,max]
 */
export function randomInt(a: number, b: number): number;
/**
 * 本函数用于生成指定范围内的随机整数数组。
 * @param {Iterable<number>} range
 * @param {number} len
 * @returns {number[]} 每个元素属于[min,max]
 */
export function randomInts(range: Iterable<number>, len?: number): number[];
/**
 * 本函数用于生成指定范围内的随机浮点数。
 * @param {number} a
 * @param {number} b
 * @returns {number} 属于 [min,max)
 */
export function randomFloat(a: number, b: number): number;
/**
 * 本函数用于生成指定范围内的随机实数数组。
 * @param {Iterable<number>} range
 * @param {number} len
 * @returns {number[]} 每个元素属于[min,max)
 */
export function randomFloats(range: Iterable<number>, len?: number): number[];
/**
 * 利用box-muller变换生成标准正态分布随机数
 * @returns {number} 服从标准正态分布的随机数
 */
export function randomGaussian(): number;
/**
 * 生成标准正态分布随机数数组
 * @param {number} len 数组长度
 * @param {()=>number} generator 标准正态分布随机数生成器
 * @returns
 */
export function randomGaussians(len: number, generator?: () => number): number[];
/**
 * 生成指定均值和标准差的正态分布随机数
 * @param {number} mu 正态分布的均值
 * @param {number} sigma 正态分布的标准差
 * @param {()=>number} generator 标准正态分布随机数生成器
 * @returns
 */
export function randomNormal(mu?: number, sigma?: number, generator?: () => number): number;
/**
 * 生成指定均值和标准差的正态分布随机数数组
 * @param {number} len 数组长度
 * @param {number} mu 正态分布的均值
 * @param {number} sigma 正态分布的标准差
 * @param {()=>number} generator 标准正态分布随机数生成器
 * @returns {number[]}
 */
export function randomNormals(len: number, mu?: number, sigma?: number, generator?: () => number): number[];
/**
 * 生成指定维度和模长的随机向量
 * @param {number} dim 生成向量的维度
 * @param {number} mod 生成向量的模长
 * @param {()=>number} generator 标准正态分布随机数生成器
 * @returns {number[]}
 */
export function randomVector(dim: number, mod: number, generator?: () => number): number[];
/**
 * 传入高斯随机数生成器，并生成对应的函数对象
 * @param {()=>number} generator
 * @returns {}
 */
export function withGaussianGenerator(generator: () => number): any;
/**
 *
 * @param {Iterable<T>} inputFlow
 * @returns {T[]}
 */
export function randomSort(inputFlow: Iterable<T>): T[];
/**
 * 简单随机选取一个样本
 * @template T
 * @param {Iterable<T>} inputFlow
 * @returns {T}
 */
export function randomPick<T>(inputFlow: Iterable<T>): T;
/**
 * 简单放回抽样
 * @template T
 * @param {Iterable<T>} inputList
 * @param {number} len
 * @returns {T[]}
 */
export function randomPicks<T>(inputList: Iterable<T>, len?: number): T[];
/**
 * 带权重的随机选取一个样本
 * @template T
 * @param {Map<T,number>} inputMap
 * @returns {T}
 */
export function randomChoice<T>(inputMap: Map<T, number>): T;
/**
 * 带权重的放回抽样
 * @template T
 * @param {Map<T,number>} inputMap
 * @param {number} len
 * @returns {T[]}
 */
export function randomChoices<T>(inputMap: Map<T, number>, len?: number): T[];
/**
 * 随机抽取样本，由于采用了蓄水池抽样，数据输出的顺序与原顺序相关联
 * @template T
 * @param {Iterable<T>} inputFlow
 * @param {number} len
 * @returns {T[]}
 */
export function randomSample<T>(inputFlow: Iterable<T>, len?: number): T[];
/**
 *
 * @param {Iterable<T>} inputFlow
 * @returns {T[]}
 */
export function shuffle(inputFlow: Iterable<T>): T[];
