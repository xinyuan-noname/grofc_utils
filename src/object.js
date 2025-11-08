import { throwIfIsNotPlainObject, throwIfKeyMissing } from "./guard";

export function setReadOnlyProperty(obj, name) {
    throwIfIsNotPlainObject(obj);
    throwIfKeyMissing(obj, name, "obj");
    const descriptor = Object.getOwnPropertyDescriptor(obj, name);
    Object.defineProperty(obj, name, {
        value: descriptor.value,
        writable: false,
        configurable: false,
        enumerable: descriptor.enumerable ?? true
    })
}