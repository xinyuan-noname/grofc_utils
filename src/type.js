/**
 * 获取变量的类型字符串表示
 * @param {*} v - 要检查类型的变量
 * @returns {string} 变量的类型字符串
 */
export function getType(v) {
    if (v === null) return "null";
    if (typeof v === "object") {
        return Object.prototype.toString.call(v).slice(8, -1).toLocaleLowerCase();
    }
    return typeof v;
}
/**
 * 检查给定对象是否为普通对象
 * 普通对象是指通过对象字面量 {} 或 new Object() 创建的对象，
 * 不包括数组、函数以及其他自定义构造函数创建的实例
 * @param {*} variable - 需要检查的对象
 * @returns {boolean} 如果是普通对象返回 true，否则返回 false
 */
export function isPlainObject(variable) {
    if (Object.prototype.toString.call(variable) !== "[object Object]") return false;
    const prototype = Object.getPrototypeOf(variable);
    if (prototype !== Object.prototype && prototype !== null) return false;
    return true
}
export function isRegExp(variable) {
    return Object.prototype.toString.call(variable) === "[object RegExp]"
}

export function stringify(v, visited = new WeakSet()) {
    if (v === null) return "null";
    if (typeof v === "object") {
        if (visited.has(v)) return "[Circular]";
        visited.add(v)
        if (Array.isArray(v)) {
            if (v.length > 10) return `Array(${v.length})`
            return `[${v.map(v => stringify(v, visited)).join(", ")}]`
        }
        if (v instanceof Set) {
            if (v.size > 10) return `Set(${v.size})`;
            return `Set {${Array.from(v).map(item => stringify(item, visited)).join(", ")}}`;
        }
        if (v instanceof Map) {
            if (v.size > 10) return `Map(${v.size})`;
            return `Map {${Array.from(v).map(([key, value]) => `${stringify(key, visited)} => ${stringify(value, visited)}`).join(", ")}}`
        }
        if (v instanceof Date) {
            return `[Date ${v.toISOString()}]`;
        }
        if (v instanceof Error) {
            return `[${String(v)}]`;
        }
        if (v instanceof RegExp) {
            return String(v);
        }
        const type = Object.prototype.toString.call(v).slice(8, -1);
        if (type === "Object") {
            const entries = Object.entries(v);
            if (entries.length > 10) return `[Object]`;
            return `{${entries.map(([key, value]) => `${stringify(key, visited)}: ${stringify(value, visited)}`).join(", ")}}`
        } else if (typeof v[Symbol.iterator] === "function") {
            const list = [];
            for (const k of v) {
                if (list.length > 10) return `[${type}]`
                list.push(stringify(k, visited))
            }
            return `${type} {${list.join(", ")}}`
        } else {
            return `[${type}]`
        }
    }
    if (typeof v === "string") return JSON.stringify(v);
    if (typeof v === "bigint") return v.toString() + "n";
    return String(v);
}