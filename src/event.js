import { isPlainObject, throwIfIsNotExpectedValue, throwIfIsNotFunction, throwIfIsNotPlainObject, throwIfIsNotString } from "./guard.js"
import { assignWithDescriptors } from "./object.js";

/**
 * 创建一个事件发射器对象，用于管理和触发自定义事件
 * @returns {{
 *  dispatchSync:(
 *      event:string,
 *      ing:(
 *          ingEvent:{
 *              target,name:string,type:string|null,preData:object,phase:"ing",data:object
 *          })=>void,
 *      options:{target,name:string,type:string|null,status:object,data:object}
 *  )=>object
 *  on:(event:string,phase:"before"|"begin"|"end"|"after",callback:(event:{
 *      target,name:string,type:string|null,preData:object,data:object
 * })=>void)=>void
 *  off:(event:string,phase:"before"|"begin"|"end"|"after",callback:(event:{
 *      target,name:string,type:string|null,preData:object,data:object
 * })=>void)=>void
 * }} 包含dispatchSync, on, off方法的对象
 */
export function createEventEmitter() {
    const listenerMap = new Map()
    const dispatchSync = (event, ing = () => { }, options = {}) => {
        throwIfIsNotString(event, "event");
        throwIfIsNotFunction(ing, "ing");
        throwIfIsNotPlainObject(options, "options");
        const { type = null, target = null, data = {}, status = { cancellable: true }, ...customData } = options;
        const baseEvent = {
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
                return { ...data }
            },
            get customData() {
                return { ...customData }
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
        const beforeCallbackList = listenerMap.get(event + ":before") ?? [];
        for (const callback of beforeCallbackList) {
            if (callback(beforeEvent) === false && beforeEvent.status.cancellable) return;
        }
        // 触发begin阶段监听器
        const beginEvent = assignWithDescriptors({
            get phase() {
                return "begin"
            }
        }, baseEvent);
        const beginCallbackList = listenerMap.get(event + ":begin") ?? [];
        for (const callback of beginCallbackList) {
            callback(beginEvent)
        }
        // 执行ing阶段函数并获取当前数据
        const ingEvent = assignWithDescriptors({
            get phase() {
                return "ing"
            }
        }, baseEvent)
        const rawCurrentData = ing(ingEvent);
        const currentData = typeof rawCurrentData === "object" && rawCurrentData !== null ? { ...rawCurrentData } : {};
        // 触发end阶段监听器
        const endEvent = assignWithDescriptors({
            get phase() {
                return "end"
            },
            get currentData() {
                return { ...currentData }
            }
        }, baseEvent)
        const endCallbackList = listenerMap.get(event + ":end") ?? []
        for (const callback of endCallbackList) {
            callback(endEvent)
        }
        // 触发after阶段监听器，并处理可能的递归事件调用
        const afterEvent = assignWithDescriptors({
            get phase() {
                return "after"
            },
            get currentData() {
                return { ...currentData }
            }
        }, baseEvent);
        const afterCallbackList = listenerMap.get(event + ":after") ?? [];
        for (const callback of afterCallbackList) {
            const result = callback(afterEvent)
            if (!isPlainObject(result)) continue;
            const { event, ing, options } = result;
            if (typeof event !== "string") continue;
            dispatchSync(event, ing, options)
        }
    }
    const on = (event, phase, callback) => {
        throwIfIsNotString(event, "event");
        throwIfIsNotExpectedValue(phase, "phase", "before", "begin", "end", "after");
        throwIfIsNotFunction(callback, "callback");
        const eventName = event + ":" + phase;
        const funcList = listenerMap.get(eventName)
        if (Array.isArray(funcList)) {
            funcList.push(callback)
        } else {
            listenerMap.set(eventName, [callback]);
        }
    }
    const off = (event, phase, callback) => {
        throwIfIsNotString(event, "event");
        throwIfIsNotExpectedValue(phase, "phase", "before", "begin", "end", "after");
        throwIfIsNotFunction(callback, "callback");
        const eventName = event + ":" + phase;
        const list = listenerMap.get(eventName);
        if (list) {
            const index = list.indexOf(callback);
            if (index !== -1) list.splice(index, 1);
            if (list.length === 0) listenerMap.delete(eventName);
        }
    };
    return {
        dispatchSync,
        on,
        off
    }
}