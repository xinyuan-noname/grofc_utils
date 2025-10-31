declare module "grofc_utils" {
    /**
     * @param {string|any[]} input
     * @param {number} step
     * @returns
     */
    export function chunk<T>(input: T[], step: number): T[][];
    /**
     * 前向填充（forward-fill）输入数据，直到达到指定次数。
     *
     * 默认将 `undefined` 视为“无效值”并跳过；一旦遇到有效值（或提供了 defaultValue），
     * 后续输出将持续填充该最新有效值，直至达到 `times` 次。
     *
     * - 若输入为字符串且 `stringSplit` 非 null，则先按该步长切分为块（调用 `chunk`）；
     * - 若从未遇到有效值且未提供 `defaultValue`，返回空数组；
     * - **不校验 `times` 是否过大**：调用者需确保其合理性；
     * - **`stringSplit` 的合法性由 `chunk` 校验**（如为 0 会抛错）；
     * - 默认无效值为 `undefined`，可通过 `invalidityChecker` 自定义（支持值、数组或函数）。
     *
     * @template T
     * @param {T | Iterable<T>} inputData - 输入数据（值、数组、字符串、可迭代对象等）
     * @param {{
     *   times: number,                      // 必填：期望输出的元素总数（非负整数，过大可能导致内存问题）
     *   stringSplit?: number | null,        // 字符串切分步长，传给 `chunk`；若为 null 或未传，整个字符串视为一项
     *   invalidityChecker?: T | T[] | ((value: T) => boolean), // 默认: (v) => v === undefined
     *   defaultValue?: T                    // 若提供，则作为初始有效值（即使为 undefined 也视为显式设定）
     * }} options
     * @returns {T[]} 填充后的结果数组，长度不超过 `times`
     *
     * @example
     * forwardFillUntil([1, undefined, 3], { times: 5 })
     * // → [1, 1, 3, 3, 3]
     *
     * forwardFillUntil("abcde", { times: 3, stringSplit: 2 })
     * // → ["ab", "cd", "cd"]  // chunk("abcde", 2) → ["ab","cd","e"] → 填充至 3 项
     *
     * forwardFillUntil(null, { times: 2, invalidityChecker: null, defaultValue: 0 })
     * // → [0, 0]
     */
    export function forwardFillUntil<T>(
        inputData: T | Iterator<T>,
        options: {
            times: number;
            stringSplit?: number | null;
            invalidityChecker?: any | any[] | ((value: any) => boolean);
            defaultValue?: any;
        },
    ): T[];
}
