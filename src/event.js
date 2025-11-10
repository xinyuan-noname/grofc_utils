import { isPlainObject, throwIfIsNotComparableNumber, throwIfIsNotExpectedValue, throwIfIsNotFunction, throwIfIsNotPlainObject, throwIfIsNotString, throwIfSomeKeysMissing } from "./guard.js"
import { clamp } from "./number.js";
import { assignWithDescriptors, makePropertyReadOnly } from "./object.js";
import { randomString } from "./random.js";

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
 *
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
export function createEventEmitter() {
    const globalSymbol = Symbol(null);
    /**
     * @type {WeakMap<object,Map<string,Listener>>}
     */
    const targetListenerMap = new WeakMap([[globalSymbol, new Map()]])
    const getOrCreateTargetMap = (target = globalSymbol) => {
        let map = targetListenerMap.get(target);
        if (!map) {
            map = new Map();
            targetListenerMap.set(target, map);
        }
        return map;
    }

    // 辅助函数：获取指定 target 上的监听器列表
    const getListeners = (target = globalSymbol, event, phase) => {
        const map = targetListenerMap.get(target);
        if (!map) return [];
        return map.get(`${event}:${phase}`) || [];
    }

    const on = (target = globalSymbol, event, phase, listener = {}) => {
        throwIfIsNotString(event, "event");
        throwIfIsNotExpectedValue(phase, "phase", "before", "begin", "end", "after");
        throwIfSomeKeysMissing(listener, ["name", "callback"], "listener");
        const eventName = `${event}:${phase}`;
        const targetMap = getOrCreateTargetMap(target);
        const list = targetMap.get(eventName) || [];
        list.push(listener);
        targetMap.set(eventName, list);
    };

    const off = (target = globalSymbol, event, phase, name) => {
        throwIfIsNotString(event, "event");
        throwIfIsNotExpectedValue(phase, "phase", "before", "begin", "end", "after");
        throwIfIsNotString(name, "name");
        const eventName = `${event}:${phase}`;
        const targetMap = targetListenerMap.get(target);
        if (!targetMap) return;
        const list = targetMap.get(eventName);
        if (!list) return;
        const index = list.findIndex(l => l.name === name);
        if (index !== -1) {
            list.splice(index, 1);
            if (list.length === 0) {
                targetMap.delete(eventName);
            }
        }
    };
    const dispatchSync = (event, ing = () => { }, options = {}) => {
        throwIfIsNotString(event, "event");
        throwIfIsNotFunction(ing, "ing");
        throwIfIsNotPlainObject(options, "options");
        const {
            id = randomString(36),
            type = null,
            target = null,
            status = { cancellable: true },
            preData,
            context = {},
            ...meta
        } = options;
        const baseEvent = {
            get id() {
                return id
            },
            get target() {
                return target
            },

            get name() {
                return event
            },
            get type() {
                return type
            },
            get preData() {
                return preData
            },
            get context() {
                return { ...context }
            },
            get meta() {
                return { ...meta }
            },
            get status() {
                return { ...status }
            }
        }
        // 触发before阶段监听器，如果返回false且事件可取消则中断执行
        const beforeEvent = assignWithDescriptors({
            get phase() {
                return "before"
            }
        }, baseEvent)
        const beforeListenerList = getListeners(target, event, "before");
        for (const { name, filter, callback, once } of beforeListenerList.slice()) {
            if (filter?.(beforeEvent) === false) continue;
            const toCancel = callback(beforeEvent);
            if (once) off(target, event, "before", name)
            if (toCancel === false && beforeEvent.status.cancellable) return;
        }
        // 触发begin阶段监听器
        const beginEvent = assignWithDescriptors({
            get phase() {
                return "begin"
            }
        }, baseEvent);
        const beginListenerList = getListeners(target, event, "begin");
        for (const { name, callback, filter, once } of beginListenerList.slice()) {
            if (filter?.(beginEvent) === false) continue;
            callback(beginEvent);
            if (once) off(target, event, "begin", name);
        }
        // 执行ing阶段函数并获取当前数据
        const ingEvent = assignWithDescriptors({
            get phase() {
                return "ing"
            }
        }, baseEvent)
        const currentData = ing(ingEvent);
        // 触发end阶段监听器
        const endEvent = assignWithDescriptors({
            get phase() {
                return "end"
            },
            get currentData() {
                return currentData
            }
        }, baseEvent)
        const endListenerList = getListeners(target, event, "end");
        for (const { name, callback, filter, once } of endListenerList.slice()) {
            if (filter?.(endEvent) === false) continue;
            callback(endEvent);
            if (once) off(target, event, "end", name);
        }
        // 触发after阶段监听器，并处理可能的递归事件调用
        const afterEvent = assignWithDescriptors({
            get phase() {
                return "after"
            },
            get currentData() {
                return currentData
            }
        }, baseEvent);
        const afterListenerList = getListeners(target, event, "after");
        for (const { name, callback, filter, once } of afterListenerList.slice()) {
            if (filter?.(afterEvent) === false) continue;
            const result = callback(afterEvent)
            if (once) off(target, event, "after", name)
            if (!isPlainObject(result)) continue;
            const { event, ing, options } = result;
            if (typeof event !== "string") continue;
            dispatchSync(event, ing, options);
        }
    }
    return {
        dispatchSync,
        on,
        off
    }
}
/**
 * 创建一个只读的普通属性对象
 * @param {ReturnType<createEventEmitter>} emitter - 事件发射器（当前未使用，保留扩展性）
 * @param {string} name - 属性名称（只读）
 * @param {Object} [options] - 配置选项
 * @param {any} [options.value=null] - 属性初始值
 * @param {any} [options.owner=null] - 属性所属对象
 * @returns {{ name: string, value: any, owner: any }}
 */
export function createAttribute(emitter, name, options = {}) {
    throwIfIsNotString(name, "name");
    throwIfIsNotPlainObject(options, "options");
    const { value = null, owner = null } = options;
    const attributeObj = {
        name,
        value,
        owner
    }
    makePropertyReadOnly(attributeObj, "name");
    return attributeObj;
}
/**
 * 创建一个数值型属性，支持 add/subtract/set 操作，并自动触发 changeValue 事件
 * @param {ReturnType<createEventEmitter>} emitter - 事件发射器
 * @param {string} name - 属性名称
 * @param {Object} [options] - 配置选项
 * @param {number} [options.value=0] - 初始值（非数字将被设为 0）
 * @param {number} [options.min=-Infinity] - 最小值
 * @param {number} [options.max=Infinity] - 最大值
 * @param {any} [options.owner=null] - 所属对象
 * @returns {{
 *   name: string,
 *   owner: any,
 *   value: number,
 *   get(): number,
 *   add(num: number): void,
 *   subtract(num: number): void,
 *   set(num: number): void
 * }}
 */
export function createNumberAttribute(emitter, name, options = {}) {
    throwIfIsNotString(name, "name");
    throwIfIsNotPlainObject(options, "options");
    let { value, min, max } = options;
    if (Number.isNaN(value)) value = 0;
    if (Number.isNaN(min)) min = -Infinity;
    if (Number.isNaN(max)) max = Infinity;
    const attr = createAttribute(emitter, name, options);
    let _value = clamp(value, min, max);
    return assignWithDescriptors(attr, {
        get value() {
            return _value
        },
        get() {
            return _value
        },
        add(num) {
            throwIfIsNotComparableNumber(num)
            emitter.dispatchSync(
                "changeValue",
                ({ preData, context: { num } }) => {
                    _value = clamp(preData + num, min, max)
                    return _value
                },
                { target: attr, type: "add", preData: _value, context: { num } }
            )
        },
        subtract(num) {
            throwIfIsNotComparableNumber(num)
            emitter.dispatchSync(
                "changeValue",
                ({ preData, context: { num } }) => {
                    _value = clamp(preData - num, min, max)
                    return _value
                },
                { target: attr, type: "subtract", preData: _value, context: { num } }
            )
        },
        set(num) {
            throwIfIsNotComparableNumber(num)
            emitter.dispatchSync(
                "changeValue",
                ({ context: { num } }) => {
                    _value = clamp(num, min, max)
                    return _value
                },
                { target: attr, type: "set", preData: _value, context: { num } }
            )
        }
    })
}
/**
 * 创建一个求和型属性，其值为多个数值属性的总和（受 min/max 限制）
 * 自动监听依赖属性的 changeValue 事件，并在变化时触发自身的 changeValue 事件
 * 注意：依赖属性的 changeValue 事件不应被取消，否则可能导致状态不一致
 *
 * @param {ReturnType<createEventEmitter>} emitter - 事件发射器
 * @param {string} name - 属性名称
 * @param {Object} options - 配置选项
 * @param {Array<{ get(): number }>} [options.attrs=[]] - 依赖的属性列表（需有 get 方法）
 * @param {number} [options.min=0] - 总和最小值
 * @param {number} [options.max=0] - 总和最大值
 * @param {any} [options.owner=null] - 所属对象
 * @returns {{
 *   name: string,
 *   owner: any,
 *   value: number,
 *   get(): number
 * }}
 */
export function createSumAttribute(emitter, name, options = {}) {
    throwIfIsNotString(name, "name");
    throwIfIsNotPlainObject(options, "options");
    let { attrs, min, max } = options;
    if (!Array.isArray(attrs)) attrs = [];
    if (Number.isNaN(min)) min = -Infinity;
    if (Number.isNaN(max)) max = Infinity;
    const attr = createAttribute(emitter, name, options);
    let sumRecord = new Map();
    for (const a of attrs) {
        const listenerName = `${name}:${a.name}:sum:default`
        emitter.on(a, "changeValue", "before", {
            name: listenerName,
            callback: ({ id }) => {
                sumRecord.set(id, attr.get())
            }
        });
        emitter.on(a, "changeValue", "after", {
            name: listenerName,
            filter: ({ id }) => sumRecord.has(id),
            callback: ({ id }) => {
                const from = sumRecord.get(id);
                const to = attr.get();
                sumRecord.delete(id);
                return {
                    event: "changeValue",
                    options: {
                        target: attr,
                        status: {
                            cancellable: false
                        },
                        context: {
                            from,
                            to,
                        }
                    },
                }
            }
        })
    }
    return assignWithDescriptors(attr, {
        get value() {
            return clamp(attrs.reduce((s, a) => s + a.get(), 0), min, max)
        },
        get() {
            return clamp(attrs.reduce((s, a) => s + a.get(), 0), min, max)
        }
    })
}
/**
 * 创建一个属性生成器对象，绑定了指定的事件发射器
 * 该生成器提供了创建不同类型属性的方法，所有创建的属性都会与给定的事件发射器关联
 * 
 * @param {ReturnType<createEventEmitter>} emitter - 事件发射器，用于与创建的属性进行关联
 * @returns {Object} 返回一个包含属性创建方法的对象
 * @returns {Function} return.createAttribute - 创建基本属性的函数
 * @returns {Function} return.createNumberAttribute - 创建数值属性的函数
 * @returns {Function} return.createSumAttribute - 创建求和属性的函数
 */
export function withEmitterAttributeGenerator(emitter) {
    return {
        createAttribute: createAttribute.bind(null, emitter),
        createNumberAttribute: createNumberAttribute.bind(null, emitter),
        createSumAttribute: createSumAttribute.bind(null, emitter)
    }
}