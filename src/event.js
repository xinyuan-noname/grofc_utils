import { throwIfIsNotExpectedValue, throwIfIsNotFunction, throwIfIsNotPlainObject, throwIfIsNotString } from "./guard.js"
import { assignWithDescriptors } from "./object.js";

export function createEventEmitter() {
    const listenerMap = new Map()
    const dispatchSync = (event, ing = () => { }, options = {}) => {
        throwIfIsNotString(event, "event");
        throwIfIsNotFunction(ing, "ing");
        throwIfIsNotPlainObject(options, "options");
        const { type = null, data = {}, ...customData } = options;
        const baseEvent = {

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
        }
        //
        const beforeEvent = assignWithDescriptors({
            get phase() {
                return "before"
            }
        }, baseEvent)
        const beforeCallbackList = listenerMap.get(event + ":before") ?? [];
        for (const callback of beforeCallbackList) { 
            if (callback(beforeEvent)) return;
        }
        //
        const beginEvent = assignWithDescriptors({
            get phase() {
                return "begin"
            }
        }, baseEvent);
        const beginCallbackList = listenerMap.get(event + ":begin") ?? [];
        for (const callback of beginCallbackList) {
            callback(beginEvent)
        }
        //
        const ingEvent = assignWithDescriptors({
            get phase() {
                return "ing"
            }
        }, baseEvent) 
        const currentData = ing(ingEvent) ?? {};
        //
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
        //
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
            if (typeof result === "object" && result !== null) {
                const { event, ing, options } = result;
                if (typeof event === "string") dispatchSync(event, ing, options)
            }
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
    return {
        dispatchSync,
        on
    }
}