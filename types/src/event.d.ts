/**
 * 表示一个只读的事件对象，包含事件的基本信息。
 * 所有字段均为 getter，返回副本以防止外部修改。
 *
 * @typedef {Object} BaseEvent
 * @property {string} id - 本次事件分发的唯一标识符
 * @property {any} target - 触发事件的目标对象（可为 null）
 * @property {string} name - 事件名称（即 dispatchSync 的第一个参数）
 * @property {string|null} type - 事件类型（如 "add", "set" 等，由 options.type 指定）
 * @property {any} preData - 事件触发前的数据快照
 * @property {Object} context - 贯穿事件始终的数据
 * @property {Object} meta - 用户传入的一般是不变的数据（除预定义字段外的所有 options 属性）
 * @property {Object} status - 事件状态对象，至少包含 { cancellable: boolean }
 */
/**
 * 表示 before 阶段的事件对象。
 * 此阶段可用于取消整个事件流程。
 *
 * @typedef {BaseEvent & { phase: "before" }} BeforeEvent
 */
/**
 * 表示 begin 阶段的事件对象。
 *
 * @typedef {BaseEvent & { phase: "begin" }} BeginEvent
 */
/**
 * 表示 ing 阶段的事件对象。
 * 此阶段由用户提供的 ing 函数处理，用于执行核心逻辑并返回新数据。
 *
 * @typedef {BaseEvent & { phase: "ing" }} IngEvent
 */
/**
 * 表示 end 阶段的事件对象。
 * 包含 ing 阶段返回的 currentData。
 *
 * @typedef {BaseEvent & { phase: "end", currentData: Object }} EndEvent
 */
/**
 * 表示 after 阶段的事件对象。
 * 此阶段支持通过返回特定结构触发新的同步事件（递归 dispatch）。
 *
 * @typedef {BaseEvent & { phase: "after", currentData: Object }} AfterEvent
 */
/**
 * 事件监听器配置对象
 *
 * @typedef {Object} Listener
 * @property {string} name - 监听器的唯一名称，用于 off 移除
 * @property {function(BaseEvent): boolean} [filter] - 过滤函数，返回 false 则跳过此监听器
 * @property {function(BeforeEvent|BeginEvent|EndEvent|AfterEvent): void | RecursiveDispatchResult} callback - 回调函数
 * @property {boolean} [once=false] - 是否仅触发一次，触发后自动移除
 * @property {number} [priority=0] - 触发的优先级，默认为0，默认按顺序执行
 */
/**
 * 在 after 阶段，callback 可返回此结构以触发新的同步事件
 *
 * @typedef {Object} RecursiveDispatchResult
 * @property {string} event - 要分发的新事件名
 * @property {function(IngEvent): Object} [ing] - 新事件的 ing 函数（可选，默认为空函数）
 * @property {Object} options - 新事件的选项（将传递给 dispatchSync 的 options）
 */
/**
 * 创建一个事件发射器对象，用于管理和触发自定义事件。
 * 事件分五个阶段执行：before → begin → ing → end → after。
 * - **before**: 可取消事件（若返回 false 且 status.cancellable 为 true）
 * - **begin**: 初始化阶段，不可取消
 * - **ing**: 核心逻辑执行，由用户传入的 ing 函数处理
 * - **end**: 处理 ing 结果
 * - **after**: 清理或触发后续事件，支持递归 dispatch
 * @returns {{
 *   dispatchSync: (
 *     event: string,
 *     ing: (event: IngEvent) => Object,
 *     options: {
 *       target?: any,
 *       type?: string | null,
 *       preData?: any,
 *       context:object,
 *       status?: { cancellable?: boolean },
 *       [key: string]: any
 *     }
 *   ) => void,
 *   on: (
 *     target:object,
 *     event: string,
 *     phase: "before" | "begin" | "end" | "after",
 *     listener: Listener
 *   ) => void,
 *   off: (
 *     target:object,
 *     event: string,
 *     phase: "before" | "begin" | "end" | "after",
 *     name: string
 *   ) => void
 * }}
 */
export function createEventEmitter(): {
    dispatchSync: (event: string, ing: (event: IngEvent) => Object, options: {
        target?: any;
        type?: string | null;
        preData?: any;
        context: object;
        status?: {
            cancellable?: boolean;
        };
        [key: string]: any;
    }) => void;
    on: (target: object, event: string, phase: "before" | "begin" | "end" | "after", listener: Listener) => void;
    off: (target: object, event: string, phase: "before" | "begin" | "end" | "after", name: string) => void;
};
/**
 * 创建一个只读的普通属性对象
 * @param {ReturnType<createEventEmitter>} emitter - 事件发射器（当前未使用，保留扩展性）
 * @param {string} name - 属性名称（只读）
 * @param {Object} [options] - 配置选项
 * @param {any} [options.value=null] - 属性初始值
 * @param {any} [options.owner=null] - 属性所属对象
 * @returns {{ name: string, value: any, owner: any }}
 */
export function createEventAttribute(name: string, options?: {
    value?: any;
    owner?: any;
}): {
    name: string;
    value: any;
    owner: any;
};
export function isEventAttribute(variable: any): any;
export function isEventCollectionAttribute(variable: any): any;
export function getEventAttributeType(variable: any): any;
export function throwIfIsNotEventAttribute(variable: any, name?: string): void;
export function throwIfIsNotExpectedTypeEventAttribute(variable: any, expectedType: any, name?: string): void;
export function throwIfIsNotEventNullAttribute(variable: any, name?: string): void;
export function throwIfIsNotEventCollectionAttribute(variable: any, name?: string): void;
export function throwIfIsNotEventNullCollectionAttribute(variable: any, name?: string): void;
/**
 * 为事件属性添加数值操作功能，使其能够进行加减乘除、幂运算等数学操作，并支持数值约束
 * @param {ReturnType<createEventEmitter>} emitter - 事件发射器，用于派发数值变更事件
 * @param {*} attr - 事件属性对象，必须是有效的事件属性
 * @param {Object} [options={}] - 配置选项
 * @param {number} [options.min=-Infinity] - 最小值限制
 * @param {number} [options.max=Infinity] - 最大值限制
 * @param {"floor"|"ceil"|"round"|"trunc"|null} [options.integerStrategy=null] - 整数化策略，可选 "floor"、"ceil"、"round"、"trunc" 或 null
 * @param {string[]} [options.exclude] - 要排除的方法列表
 * @returns {*} 返回扩展了数值操作功能的属性对象
 */
export function withNumberAction(emitter: ReturnType<typeof createEventEmitter>, attr: any, options?: {
    min?: number | undefined;
    max?: number | undefined;
    integerStrategy?: "floor" | "ceil" | "round" | "trunc" | null | undefined;
    exclude?: string[] | undefined;
}): any;
export function withStringAction(emitter: any, attr: any, options?: {}): void;
/**
 * @template T
 * @param {*} emitter
 * @param {*} attr
 * @param {{
 *  preStatus:T
 *  statusList:T[]
 * }} options
 * @returns
 */
export function withStatusAction<T>(emitter: any, attr: any, options?: {
    preStatus: T;
    statusList: T[];
}): void;
export function withCollectionAction(emitter: any, attr: any, options?: {}): void;
export function withNumberCollectionAction(emitter: any, attr: any, options?: {}): void;
export function withStringCollectionAction(emitter: any, attr: any, options?: {}): void;
export function withStatusCollectionAction(emitter: any, attr: any, options?: {}): void;
export function withEmitterAttributeGenerator(emitter: any): {
    withNumberAction: (attr: any, options?: {
        min?: number | undefined;
        max?: number | undefined;
        integerStrategy?: "floor" | "ceil" | "round" | "trunc" | null | undefined;
        exclude?: string[] | undefined;
    } | undefined) => any;
    withStatusAction: (attr: any, options?: {
        preStatus: unknown;
        statusList: unknown[];
    } | undefined) => void;
    withStringAction: (attr?: any, options?: {} | undefined) => void;
    withCollectionAction: (attr?: any, options?: {} | undefined) => void;
    withNumberCollectionAction: (attr?: any, options?: {} | undefined) => void;
    withStringCollectionAction: (attr?: any, options?: {} | undefined) => void;
    withStatusCollectionAction: (attr?: any, options?: {} | undefined) => void;
};
/**
 * 表示一个只读的事件对象，包含事件的基本信息。
 * 所有字段均为 getter，返回副本以防止外部修改。
 */
export type BaseEvent = {
    /**
     * - 本次事件分发的唯一标识符
     */
    id: string;
    /**
     * - 触发事件的目标对象（可为 null）
     */
    target: any;
    /**
     * - 事件名称（即 dispatchSync 的第一个参数）
     */
    name: string;
    /**
     * - 事件类型（如 "add", "set" 等，由 options.type 指定）
     */
    type: string | null;
    /**
     * - 事件触发前的数据快照
     */
    preData: any;
    /**
     * - 贯穿事件始终的数据
     */
    context: Object;
    /**
     * - 用户传入的一般是不变的数据（除预定义字段外的所有 options 属性）
     */
    meta: Object;
    /**
     * - 事件状态对象，至少包含 { cancellable: boolean }
     */
    status: Object;
};
/**
 * 表示 before 阶段的事件对象。
 * 此阶段可用于取消整个事件流程。
 */
export type BeforeEvent = BaseEvent & {
    phase: "before";
};
/**
 * 表示 begin 阶段的事件对象。
 */
export type BeginEvent = BaseEvent & {
    phase: "begin";
};
/**
 * 表示 ing 阶段的事件对象。
 * 此阶段由用户提供的 ing 函数处理，用于执行核心逻辑并返回新数据。
 */
export type IngEvent = BaseEvent & {
    phase: "ing";
};
/**
 * 表示 end 阶段的事件对象。
 * 包含 ing 阶段返回的 currentData。
 */
export type EndEvent = BaseEvent & {
    phase: "end";
    currentData: Object;
};
/**
 * 表示 after 阶段的事件对象。
 * 此阶段支持通过返回特定结构触发新的同步事件（递归 dispatch）。
 */
export type AfterEvent = BaseEvent & {
    phase: "after";
    currentData: Object;
};
/**
 * 事件监听器配置对象
 */
export type Listener = {
    /**
     * - 监听器的唯一名称，用于 off 移除
     */
    name: string;
    /**
     * - 过滤函数，返回 false 则跳过此监听器
     */
    filter?: ((arg0: BaseEvent) => boolean) | undefined;
    /**
     * - 回调函数
     */
    callback: (arg0: BeforeEvent | BeginEvent | EndEvent | AfterEvent) => void | RecursiveDispatchResult;
    /**
     * - 是否仅触发一次，触发后自动移除
     */
    once?: boolean | undefined;
    /**
     * - 触发的优先级，默认为0，默认按顺序执行
     */
    priority?: number | undefined;
};
/**
 * 在 after 阶段，callback 可返回此结构以触发新的同步事件
 */
export type RecursiveDispatchResult = {
    /**
     * - 要分发的新事件名
     */
    event: string;
    /**
     * - 新事件的 ing 函数（可选，默认为空函数）
     */
    ing?: ((arg0: IngEvent) => Object) | undefined;
    /**
     * - 新事件的选项（将传递给 dispatchSync 的 options）
     */
    options: Object;
};
