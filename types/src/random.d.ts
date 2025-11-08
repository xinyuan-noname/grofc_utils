/**
 * 本函数用于生成指定范围内的随机整数。包含边界。
 * @param {number} a
 * @param {number} b
 * @returns {number} 属于 [min,max]
 */
export function randomInt(a: number, b: number): number;
/**
 * 本函数用于生成指定范围内的随机整数数组。
 * @param {number} len
 * @param {Iterable<number>} range 默认为[0,100]
 * @returns {number[]} 每个元素属于[min,max]
 */
export function randomInts(len: number, range?: Iterable<number>): number[];
/**
 * 本函数用于生成指定范围内的随机浮点数。
 * @param {number} a
 * @param {number} b
 * @returns {number} 属于 [min,max)
 */
export function randomFloat(a: number, b: number): number;
/**
 * 本函数用于生成指定范围内的随机浮点数数组。
 * @param {number} len
 * @param {Iterable<number>} range 默认为[0,1]
 * @returns {number[]} 每个元素属于[min,max)
 */
export function randomFloats(len: number, range?: Iterable<number>): number[];
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
export function randomVector(dim?: number, mod?: number, generator?: () => number): number[];
/**
 * 生成指定数量的随机向量数组
 * @param {number} len 需要生成的向量数量
 * @param {number} dim 向量的维度，默认为2
 * @param {number} mod 向量的模长，默认为1
 * @param {()=>number} generator 随机数生成器函数，默认为randomGaussian
 * @returns {number[][]} 包含len个随机向量的数组，每个向量都是指定维度和模长的数组
 */
export function randomVectors(len: number, dim?: number, mod?: number, generator?: () => number): number[][];
/**
 * 生成一个指定行列数的随机矩阵
 * @param {number} rows 矩阵的行数，默认为2
 * @param {number} cols 矩阵的列数，默认等于行数
 * @param {(r: number, c: number) => number} generator 用于生成矩阵元素的函数，接收行列索引作为参数，默认生成0-10的随机整数
 * @returns {number[][]} 二维数组表示的矩阵，大小为rows×cols
 */
export function randomMatrix(rows?: number, cols?: number, generator?: (r: number, c: number) => number): number[][];
/**
 * 生成指定数量的随机矩阵数组
 * @param {number} len 需要生成的矩阵数量
 * @param {number} rows 每个矩阵的行数
 * @param {number} cols 每个矩阵的列数，默认等于行数
 * @param {(r: number, c: number) => number} generator 用于生成矩阵元素的函数，接收行列索引作为参数，默认生成0-10的随机整数
 * @returns {number[][][]} 包含len个矩阵的数组，每个矩阵都是二维数组
 */
export function randomMatrices(len: number, rows?: number, cols?: number, generator?: (r: number, c: number) => number): number[][][];
/**
 * 传入高斯随机数生成器，并生成对应的函数对象
 * @param {()=>number} generator
 * @returns {{
 *  randomGaussian: ()=>number,
 *  randomGaussians: (len:number)=>number[],
 *  randomNormal: (mu:number,sigma:number)=>number,
 *  randomNormals: (len:number,mu:number,sigma:number)=>number[],
 *  randomVector: (dim:number,mod:number)=>number[]
 * }}
 */
export function withGaussianGenerator(generator: () => number): {
    randomGaussian: () => number;
    randomGaussians: (len: number) => number[];
    randomNormal: (mu: number, sigma: number) => number;
    randomNormals: (len: number, mu: number, sigma: number) => number[];
    randomVector: (dim: number, mod: number) => number[];
};
/**
 * 传入矩阵元素生成器，并生成对应的矩阵操作函数对象
 * @param {(r: number, c: number) => number} generator 用于生成矩阵元素的函数，接收行列索引作为参数
 * @returns {{
 *   randomMatrix: (rows: number, cols: number) => number[][],
 *   randomMatrices: (len: number, rows: number, cols: number) => number[][][]
 * }} 返回包含随机矩阵生成函数的对象
 */
export function withMatrixGenerator(generator: (r: number, c: number) => number): {
    randomMatrix: (rows: number, cols: number) => number[][];
    randomMatrices: (len: number, rows: number, cols: number) => number[][][];
};
export function randomColor(): string;
export function randomColors(len: any): string[];
/**
 * @template T
 * @param {Iterable<T>} inputFlow
 * @returns {T[]}
 */
export function randomSort<T>(inputFlow: Iterable<T>): T[];
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
export function randomPicks<T>(inputList: Iterable<T>, len: number): T[];
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
export function randomChoices<T>(inputMap: Map<T, number>, len: number): T[];
/**
 * 随机抽取样本，由于采用了蓄水池抽样，数据输出的顺序与原顺序相关联
 * @template T
 * @param {Iterable<T>} inputFlow
 * @param {number} len
 * @returns {T[]}
 */
export function randomSample<T>(inputFlow: Iterable<T>, len: number): T[];
/**
 * @template T
 * @param {Iterable<T>} inputFlow
 * @returns {T[]}
 */
export function shuffle<T>(inputFlow: Iterable<T>): T[];
