import { throwIfIsNotComparableNumber } from "./guard.js"
export function clamp(value, min, max) {
    throwIfIsNotComparableNumber(value, "value");
    throwIfIsNotComparableNumber(min, "min");
    throwIfIsNotComparableNumber(max, "max");
    return Math.max(Math.min(value, max), min);
}