import { throwIfIsInvalidDate, throwIfIsNotPositiveFiniteNumber, throwIfIsNotString } from "./guard.js";

/**
 * 
 * @param {Date|string|number} time 
 * @param {`${number}${"ms"|"s"|"min"|"h"|"d"}`} expire 
 * @returns 
 */
export function isExpired(time, expire) {
    throwIfIsNotString(expire);
    const match = expire.match(/^(\d+)(ms|s|min|h|d)$/);
    if (!match) throw new TypeError(`Expected ${expire} to be a string like "1ms", "1s", "1min", "1h" or "1d", but got ${JSON.stringify(expire)}`)
    const [, toleranceStr, unit] = match;
    const tolerance = Number(toleranceStr);
    throwIfIsNotPositiveFiniteNumber(tolerance);
    time = time instanceof Date ? time : new Date(time);
    throwIfIsInvalidDate(time, "time")
    const now = new Date();
    const delta = now.getTime() - time.getTime();
    console.log(delta/1000);
    switch (unit) {
        case "ms": return delta > tolerance;
        case "s": return delta > tolerance * 1_000;
        case "min": return delta > tolerance * 60_000;
        case "h": return delta > tolerance * 3600_000;
        case "d": return delta > tolerance * 86400_000;
        default: throw new Error(`Unexpected unit: ${unit}`);
    }
}
