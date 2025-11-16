import {
    isNullishValue, isPlainObject,
    throwIfIsNotDivisibleNumber, throwIfIsNotComparableNumber, throwIfIsNotExpectedValue,
    throwIfIsNotFunction, throwIfIsNotPlainObject, throwIfIsNotString, throwIfSomeKeysMissing,
    throwIfIsNotNonNegativeFiniteNumber,
    throwIfIsNotNonEmptyArray
} from "./guard.js"
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
export function createEventEmitter() {
    let currentEvent = null;
    const defaultTarget = Symbol(null);
    /**
     * @type {WeakMap<object,Map<string,Listener[]>>}
     */
    const targetListenerMap = new WeakMap([[defaultTarget, new Map()]]);
    const getOrCreateTargetMap = (target) => {
        target ??= defaultTarget
        let map = targetListenerMap.get(target);
        if (!map) {
            map = new Map();
            targetListenerMap.set(target, map);
        }
        return map;
    }

    const getListeners = (target, event, phase) => {
        target ??= defaultTarget
        const map = targetListenerMap.get(target);
        if (!map) return [];
        const listenerList = map.get(`${event}:${phase}`);
        if (!listenerList) return [];
        return listenerList;
    }
    const deleteListener = (target, targetMap, eventName, list, index) => {
        throwIfIsNotNonNegativeFiniteNumber(index);
        list.splice(index, 1)
        if (list.length === 0) {
            targetMap.delete(eventName);
        }
        if (targetMap.size === 0) {
            targetListenerMap.delete(target)
        }
    }

    const on = (target, event, phase, listener = {}) => {
        throwIfIsNotString(event, "event");
        event === "error" ?
            throwIfIsNotExpectedValue(phase, "phase", "before", "ing", "begin", "end", "after", "all")
            : throwIfIsNotExpectedValue(phase, "phase", "before", "begin", "end", "after");
        throwIfSomeKeysMissing(listener, ["name", "callback"], "listener");
        let { priority } = listener
        if (isNullishValue(priority)) {
            priority = 0;
        } else {
            throwIfIsNotComparableNumber(priority, "listener.priority")
        }
        target ??= defaultTarget
        const eventName = `${event}:${phase}`;
        const targetMap = getOrCreateTargetMap(target);
        const list = targetMap.get(eventName) || [];
        let i = 0;
        while (i < list.length && (list[i].priority ?? 0) > priority) {
            i++
        }
        list.splice(i, 0, listener);
        targetMap.set(eventName, list);
        return () => {
            const index = list.findIndex(l => l === listener);
            if (index !== -1) deleteListener(target, targetMap, eventName, list, index)
        }
    };

    const off = (target, event, phase, name) => {
        throwIfIsNotString(event, "event");
        event === "error" ?
            throwIfIsNotExpectedValue(phase, "phase", "before", "ing", "begin", "end", "after", "all")
            : throwIfIsNotExpectedValue(phase, "phase", "before", "begin", "end", "after");
        throwIfIsNotString(name, "name");
        target ??= defaultTarget
        const eventName = `${event}:${phase}`;
        const targetMap = targetListenerMap.get(target);
        if (!targetMap) return;
        const list = targetMap.get(eventName);
        if (!list) return;
        const index = list.findIndex(l => l.name === name);
        if (index !== -1) deleteListener(target, targetMap, eventName, list, index)
    };
    const dispatchSync = (event, ing = () => { }, options = {}) => {
        throwIfIsNotString(event, "event");
        throwIfIsNotFunction(ing, "ing");
        throwIfIsNotPlainObject(options, "options");
        let _phase = null;
        const {
            id = randomString(36),
            type = null,
            target = null,
            status = { cancellable: true },
            preData,
            context = {},
            ...meta
        } = options;
        const eventInfo = {
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
            get phase() {
                return _phase
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
            },
            parentEvent: currentEvent
        }
        currentEvent = eventInfo;
        const phaseManager = {
            before: () => {
                _phase = "before"
                const beforeListenerList = getListeners(target, event, "before");
                for (const { name, filter, callback, once } of beforeListenerList.slice()) {
                    if (filter?.(eventInfo) === false) continue;
                    const toCancel = callback(eventInfo);
                    if (once) off(target, event, "before", name)
                    if (toCancel === false && eventInfo.status.cancellable) return false;
                }
                const beforeGlobalListenerList = getListeners(null, event, "before");
                for (const { name, filter, callback, once } of beforeGlobalListenerList.slice()) {
                    if (filter?.(eventInfo) === false) continue;
                    const toCancel = callback(eventInfo);
                    if (once) off(null, event, "before", name)
                    if (toCancel === false && eventInfo.status.cancellable) return false;
                }
            },
            begin: () => {
                _phase = "begin"
                const beginListenerList = getListeners(target, event, "begin");
                for (const { name, callback, filter, once } of beginListenerList.slice()) {
                    if (filter?.(eventInfo) === false) continue;
                    callback(eventInfo);
                    if (once) off(target, event, "begin", name);
                }
                const beginGlobalListenerList = getListeners(null, event, "begin");
                for (const { name, filter, callback, once } of beginGlobalListenerList.slice()) {
                    if (filter?.(eventInfo) === false) continue;
                    callback(eventInfo);
                    if (once) off(null, event, "begin", name)
                }
            },
            ing: () => {
                _phase = "ing"
                const currentData = ing(eventInfo);
                assignWithDescriptors(eventInfo, {
                    get currentData() {
                        return currentData
                    }
                })
            },
            end: () => {
                _phase = "end"
                const endListenerList = getListeners(target, event, "end");
                for (const { name, callback, filter, once } of endListenerList.slice()) {
                    if (filter?.(eventInfo) === false) continue;
                    callback(eventInfo);
                    if (once) off(target, event, "end", name);
                }
                const endGlobalListenerList = getListeners(null, event, "end");
                for (const { name, filter, callback, once } of endGlobalListenerList.slice()) {
                    if (filter?.(eventInfo) === false) continue;
                    callback(eventInfo);
                    if (once) off(null, event, "end", name)
                }
            },
            after: () => {
                _phase = "after"
                const afterListenerList = getListeners(target, event, "after");
                for (const { name, callback, filter, once } of afterListenerList.slice()) {
                    if (filter?.(eventInfo) === false) continue;
                    const result = callback(eventInfo)
                    if (once) off(target, event, "after", name)
                    if (!isPlainObject(result)) continue;
                    const { event, ing, options } = result;
                    if (typeof event !== "string") continue;
                    dispatchSync(event, ing, options);
                }
                const afterGlobalListenerList = getListeners(null, event, "after");
                for (const { name, filter, callback, once } of afterGlobalListenerList.slice()) {
                    if (filter?.(eventInfo) === false) continue;
                    const result = callback(eventInfo)
                    if (once) off(target, event, "after", name)
                    if (!isPlainObject(result)) continue;
                    const { event, ing, options } = result;
                    if (typeof event !== "string") continue;
                    dispatchSync(event, ing, options);
                }
            },
            error: (err) => {
                const errorListenerList = getListeners(target, "error", _phase);
                for (const { name, callback, filter, once } of errorListenerList.slice()) {
                    if (filter?.(eventInfo) === false) continue;
                    callback(eventInfo, err);
                    if (once) off(target, "error", _phase, name);
                }
                const allErrorListenerList = getListeners(target, "error", "all");
                for (const { name, callback, filter, once } of allErrorListenerList.slice()) {
                    if (filter?.(eventInfo) === false) continue;
                    callback(eventInfo, err);
                    if (once) off(target, "error", "all", name);
                }
                const errorGlobalListenerList = getListeners(null, "error", _phase);
                for (const { name, filter, callback, once } of errorGlobalListenerList.slice()) {
                    if (filter?.(eventInfo) === false) continue;
                    callback(eventInfo, err);
                    if (once) off(target, "error", _phase, name);
                }
                const allErrorGlobalListenerList = getListeners(null, "error", "all");
                for (const { name, filter, callback, once } of allErrorGlobalListenerList.slice()) {
                    if (filter?.(eventInfo) === false) continue;
                    callback(eventInfo, err);
                    if (once) off(target, "error", "all", name);
                }
            }
        }
        // 触发before阶段监听器，如果返回false且事件可取消则中断执行
        try {
            if (phaseManager.before() === false) {
                currentEvent = currentEvent.parentEvent;
                return;
            }
            phaseManager.begin();
            phaseManager.ing();
            phaseManager.end();
            phaseManager.after();
            currentEvent = currentEvent.parentEvent;
        } catch (err) {
            phaseManager.error(err);
            currentEvent = currentEvent.parentEvent
        }
    }
    return {
        dispatchSync,
        on,
        off
    }
}
const EVENT_ATTRIBUTE_SYMBOL = Symbol();
const EVENT_COLLECTION_ATTRIBUTE_TYPE = ["NULL_COLLECTTION", "NUMBER_COLLECTION", "STRING_COLLECTION"]
/**
 * 创建一个只读的普通属性对象
 * @param {ReturnType<createEventEmitter>} emitter - 事件发射器（当前未使用，保留扩展性）
 * @param {string} name - 属性名称（只读）
 * @param {Object} [options] - 配置选项
 * @param {any} [options.value=null] - 属性初始值
 * @param {any} [options.owner=null] - 属性所属对象
 * @returns {{ name: string, value: any, owner: any }}
 */
export function createEventAttribute(name, options = {}) {
    throwIfIsNotString(name, "name");
    throwIfIsNotPlainObject(options, "options");
    const { value = null, owner = null } = options;
    const attributeObj = {
        name,
        value,
        get() {
            return attributeObj.value;
        },
        valueOf() {
            return attributeObj.value;
        },
        [EVENT_ATTRIBUTE_SYMBOL]: "NULL",
        owner
    }
    makePropertyReadOnly(attributeObj, "name");
    return attributeObj;
}
export function isEventAttribute(variable) {
    return isPlainObject(variable) && variable[EVENT_ATTRIBUTE_SYMBOL];
}
export function isEventCollectionAttribute(variable) {
    return isEventAttribute(variable) && EVENT_COLLECTION_ATTRIBUTE_TYPE.includes(getEventAttributeType(variable));
}
export function getEventAttributeType(variable) {
    throwIfIsNotEventAttribute(variable, "variable");
    return variable[EVENT_ATTRIBUTE_SYMBOL];
}
export function throwIfIsNotEventAttribute(variable, name = "variable") {
    if (!isEventAttribute(variable)) throw new TypeError(`Expected ${name} to be a event attribute, but got ${variable}.`);
}
export function throwIfIsNotExpectedTypeEventAttribute(variable, expectedType, name = "variable") {
    throwIfIsNotEventAttribute(variable, name)
    const type = getEventAttributeType(variable);
    if (type !== expectedType) throw new TypeError(`Expected ${name} to be a null event attribute, but got a ${type} event attribute.`);
}
export function throwIfIsNotEventNullAttribute(variable, name = "variable") {
    throwIfIsNotExpectedTypeEventAttribute(variable, "NULL", name);
}
export function throwIfIsNotEventCollectionAttribute(variable, name = "variable") {
    if (!isEventAttribute(variable)) throw new TypeError(`Expected ${name} to be a event collection attribute, but got ${variable}.`);
}
export function throwIfIsNotEventNullCollectionAttribute(variable, name = "variable") {
    throwIfIsNotExpectedTypeEventAttribute(variable, "NULL_COLLECTION", name);
}
const numberAttrMethods = [
    "add",
    "subtract",
    "multiply",
    "divide",
    "pow",
    "set"
];
const getIntegerStrategy = (integerStrategy) => {
    switch (integerStrategy) {
        case "floor":
            return v => Math.floor(v);
        case "ceil":
            return v => Math.ceil(v);
        case "round":
            return v => Math.round(v);
        case "trunc":
            return v => Math.trunc(v);
        default:
            return v => v;
    }
}
const getClampStrategy = (min, max) => {
    if (typeof min === "number" && typeof max === "number") {
        return v => clamp(v, min, max)
    }
    if (typeof min === "number" && typeof max === "function") {
        return v => {
            let M = Number(max()) || 0, m = min;
            return clamp(v, m, M)
        }
    }
    if (typeof min === "function" && typeof max === "number") {
        return v => {
            let M = max, m = Number(min()) || 0;
            return clamp(v, m, M)
        }
    }
    if (typeof min === "function" && typeof max === "function") {
        return v => {
            let M = Number(max()) || 0, m = Number(min()) || 0;
            return clamp(v, m, M)
        }
    }
    return v => v;
}
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
export function withNumberAction(emitter, attr, options = {}) {
    throwIfIsNotPlainObject(emitter);
    throwIfIsNotEventAttribute(attr, "attr");
    throwIfIsNotPlainObject(options);
    let { min = -Infinity, max = Infinity, integerStrategy = null } = options;
    const toClamped = getClampStrategy(min, max);
    const toInteger = getIntegerStrategy(integerStrategy);
    let constrain = (v) => toInteger(toClamped(v));
    let _value = isNaN(attr.value) ? 0 : Number(attr.value);
    const numberAction = {
        get value() {
            return _value;
        },
        get() {
            return _value;
        },
        add(num = 1) {
            throwIfIsNotComparableNumber(num)
            emitter.dispatchSync(
                "changeValue",
                ({ context: { num } }) => {
                    _value += num;
                    _value = constrain(_value);
                    return _value;
                },
                { target: attr, type: "add", preData: _value, context: { num } }
            )
        },
        subtract(num = 1) {
            throwIfIsNotComparableNumber(num)
            emitter.dispatchSync(
                "changeValue",
                ({ context: { num } }) => {
                    _value -= num
                    _value = constrain(_value);
                    return _value;
                },
                { target: attr, type: "subtract", preData: _value, context: { num } }
            )
        },
        multiply(num) {
            throwIfIsNotComparableNumber(num);
            emitter.dispatchSync(
                "changeValue",
                ({ context: { num } }) => {
                    _value *= num
                    _value = constrain(_value);
                    return _value;
                },
                { target: attr, type: "multiply", preData: _value, context: { num } }
            )
        },
        divide(num) {
            throwIfIsNotDivisibleNumber(num);
            emitter.dispatchSync(
                "changeValue",
                ({ context: { num } }) => {
                    _value /= num
                    _value = constrain(_value);
                    return _value;
                },
                { target: attr, type: "divide", preData: _value, context: { num } }
            )
        },
        pow(num) {
            throwIfIsNotComparableNumber(num);
            emitter.dispatchSync(
                "changeValue",
                ({ context: { num } }) => {
                    _value = Math.pow(_value, num)
                    _value = constrain(_value);
                    return _value;
                },
                { target: attr, type: "pow", preData: _value, context: { num } }
            )
        },
        set(num) {
            throwIfIsNotComparableNumber(num);
            emitter.dispatchSync(
                "changeValue",
                ({ context: { num } }) => {
                    _value = num
                    _value = constrain(_value);
                    return _value;
                },
                { target: attr, type: "set", preData: _value, context: { num } }
            )
        },
        changeConstrain(min = -Infinity, max = Infinity, integerStrategy = null) {
            const toClamped = getClampStrategy(min, max);
            const toInteger = getIntegerStrategy(integerStrategy);
            constrain = (v) => toInteger(toClamped(v));
        },
        [EVENT_ATTRIBUTE_SYMBOL]: "NUMBER",
    }
    if (Array.isArray(options.exclude)) {
        const excludeKeyList = options.exclude.filter(k => numberAttrMethods.includes(k))
        for (const key of excludeKeyList) {
            delete numberAction[key];
        }
    }
    return assignWithDescriptors(attr, numberAction)
}
export function withStringAction(emitter, attr, options = {}) {
    throwIfIsNotPlainObject(emitter);
    throwIfIsNotEventAttribute(attr, "attr");
    throwIfIsNotPlainObject(options);
    let { validate: _validate } = options;
    let _value = String(attr.value);
    const stringAction = {
        get value() {
            return _value;
        },
        get() {
            return _value;
        },
        toString() {
            return _value;
        },
        set(str) {
            if (typeof _validate === "function") {
                const { ok, error } = _validate(str);
                if (!ok) {
                    if (error instanceof Error) throw error;
                    throw new Error(error || "Validation error")
                };
            }
            emitter.dispatchSync(
                "changeValue",
                ({ context: { str } }) => {
                    _value = str
                    return _value;
                },
                { target: attr, type: "set", preData: _value, context: { str } }
            )
        },
        changeValidate(validate) {
            _validate = validate;
        },
        [EVENT_ATTRIBUTE_SYMBOL]: "STRING",
    }
    return assignWithDescriptors(attr, stringAction)
}
const statusAttrMethods = [
    "changeStatus",
    "changeToNextStatus",
    "changeToLastStatus"
]
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
export function withStatusAction(emitter, attr, options = {}) {
    throwIfIsNotPlainObject(emitter);
    throwIfIsNotEventAttribute(attr);
    throwIfSomeKeysMissing(options, ["statusList"], "options");
    throwIfIsNotNonEmptyArray(options.statusList, "options.statusList")
    const { preStatus, statusList } = options;
    let _status = preStatus || statusList[0];
    const statusAction = {
        get status() {
            return _status;
        },
        changeStatus(toStatus) {
            throwIfIsNotExpectedValue(toStatus, "status", ...statusList);
            emitter.dispatchSync(
                "changeStatus",
                ({ context: { toStatus } }) => {
                    _status = toStatus;
                    return _status;
                },
                { target: attr, type: "to", preData: _status, context: { toStatus } }
            )
        },
        changeToNextStatus() {
            emitter.dispatchSync(
                "changeStatus",
                () => {
                    const index = statusList.indexOf(_status);
                    if (index === -1) _status = statusList[0];
                    else _status = statusList[index + 1] || statusList[0];
                    return _status;
                },
                { target: attr, type: "next", preData: _status, context: {} }
            )
        },
        changeToLastStatus() {
            emitter.dispatchSync(
                "changeStatus",
                () => {
                    const index = statusList.indexOf(_status);
                    if (index === -1) _status = statusList[0];
                    else _status = statusList[index - 1] || statusList[statusList.length - 1];
                    return _status;
                },
                { target: attr, type: "last", preData: _status, context: {} }
            )
        },
    }
    if (Array.isArray(options.exclude)) {
        const excludeKeyList = options.exclude.filter(k => statusAttrMethods.includes(k))
        for (const key of excludeKeyList) {
            delete statusAction[key];
        }
    }
    return assignWithDescriptors(attr, statusAction)
}
export function withCollectionAction(emitter, attr, options = {}) {
    throwIfIsNotPlainObject(emitter);
    throwIfIsNotEventAttribute(attr, "attr");
    throwIfIsNotPlainObject(options);
    const _value = [];
    let { validate: _validate } = options;
    const collectionAction = {
        add(...elements) {
            const toAddElements = [];
            for (const e of elements) {
                if (!isEventAttribute(e)) throw new Error(`All elements must be event attribute!`);
                if (typeof _validate === "function") {
                    const { ok, error } = _validate(e);
                    if (!ok) {
                        if (error instanceof Error) throw error;
                        throw new Error(error || "Validation error")
                    };
                }
                if (!_value.includes(e)) toAddElements.push(e);
            }
            emitter.dispatchSync(
                "changeCollection",
                ({ context: { elements } }) => {
                    _value.push(...elements);
                    return _value.slice();
                },
                { target: attr, type: "add", preData: _value.slice(), context: { elements: toAddElements } }
            )
        },
        remove(...elements) {
            for (const e of elements) {
                if (!isEventAttribute(e)) throw new Error(`All elements must be event attribute!`);
                if (typeof _validate === "function") {
                    const { ok, error } = _validate(e);
                    if (!ok) {
                        if (error instanceof Error) throw error;
                        throw new Error(error || "Validation error")
                    };
                }
            }
            emitter.dispatchSync(
                "changeCollection",
                ({ context: { elements } }) => {
                    for (const e of elements) {
                        const i = _value.indexOf(e);
                        if (i !== -1) _value.splice(i, 1);
                    }
                    return _value.slice();
                },
                { target: attr, type: "remove", preData: _value.slice(), context: { elements } }
            )
        },
        replace(...elements) {
            for (const e of elements) {
                if (!isEventAttribute(e)) throw new Error(`All elements must be event attribute!`);
                if (typeof _validate === "function") {
                    const { ok, error } = _validate(e);
                    if (!ok) {
                        if (error instanceof Error) throw error;
                        throw new Error(error || "Validation error")
                    };
                }
            }
            emitter.dispatchSync(
                "changeCollection",
                ({ context: { elements } }) => {
                    _value.splice(0, _value.length, ...elements);
                    return _value.slice();
                },
                { target: attr, type: "replace", preData: _value.slice(), context: { elements: Array.from(new Set(elements)) } }
            )
        },
        issue(order, filter, ...orderInfo) {
            const targets = typeof filter === "function" ? _value.filter(filter) : _value.slice();
            if (typeof filter === "function")
                emitter.dispatchSync(
                    "issueOrder",
                    ({ context: { order, targets, orderInfo } }) => {
                        targets.forEach(t => {
                            t?.[order]?.(...orderInfo);
                        })
                    },
                    { target: attr, type: "collection", context: { order, targets, orderInfo } }
                )
        },
        values() {
            return _value.map(v => v.value);
        },
        get() {
            return _value.slice();
        },
        get value() {
            return _value.slice();
        },
        get length() {
            return _value.length;
        },
        *[Symbol.iterator]() {
            for (const e of _value) {
                yield e;
            }
        },
        [EVENT_ATTRIBUTE_SYMBOL]: "NULL_COLLECTION",
    }
    return assignWithDescriptors(attr, collectionAction);
}
export function withNumberCollectionAction(emitter, attr, options = {}) {
    throwIfIsNotPlainObject(emitter);
    throwIfIsNotEventNullCollectionAttribute(attr, "attr")
    throwIfIsNotPlainObject(options);
    const changeValidatePre = attr.changeValidate;
    const numberCollectionAction = {
        sum() {
            return attr.values().reduce((p, c) => p + c, 0);
        },
        changeValidate(validate) {
            changeValidatePre((e) => {
                if (getEventAttributeType(e) !== "NUMBER") return { ok: false, error: new Error("All elements must be number event attribute!") }
                return validate(e);
            })
        },
        [EVENT_ATTRIBUTE_SYMBOL]: "NUMBER_COLLECTION",
    }
    return assignWithDescriptors(attr, numberCollectionAction);
}
export function withStringCollectionAction(emitter, attr, options = {}) {
    throwIfIsNotPlainObject(emitter);
    throwIfIsNotEventNullCollectionAttribute(attr, "attr")
    throwIfIsNotPlainObject(options);
    const changeValidatePre = attr.changeValidate;
    const stringCollectionAction = {
        count(str) {
            return attr.values().reduce((p, c) => p + (c === str), 0);
        },
        changeValidate(validate) {
            changeValidatePre((e) => {
                if (getEventAttributeType(e) !== "STRING") return { ok: false, error: new Error("All elements must be string event attribute!") }
                return validate(e);
            })
        },
        [EVENT_ATTRIBUTE_SYMBOL]: "STRING_COLLECTION",
    }
    return assignWithDescriptors(attr, stringCollectionAction);
}
export function withStatusCollectionAction(emitter, attr, options = {}) {
    throwIfIsNotPlainObject(emitter);
    throwIfIsNotEventCollectionAttribute(attr, "attr")
    throwIfIsNotPlainObject(options);
    const stringCollectionAction = {
        countSatus(status) {
            return attr.values().reduce((p, c) => p + (c === status), 0);
        },
        [EVENT_ATTRIBUTE_SYMBOL]: "STRING_COLLECTION",
    }
    return assignWithDescriptors(attr, stringCollectionAction);
}
export function withEmitterAttributeGenerator(emitter) {
    return {
        withNumberAction: withNumberAction.bind(null, emitter),
        withStatusAction: withStatusAction.bind(null, emitter),
        withStringAction: withStringAction.bind(null, emitter),
        withCollectionAction: withCollectionAction.bind(null, emitter),
        withNumberCollectionAction: withNumberCollectionAction.bind(null, emitter),
        withStringCollectionAction: withStringCollectionAction.bind(null, emitter),
        withStatusCollectionAction: withStatusCollectionAction.bind(null, emitter),
    }
}