import { throwIfIsInvalidDate } from "./guard";

export function isExpired(time, tolerance = 0, unit = "ms") {
    time = time instanceof Date ? time : new Date(time);
    throwIfIsInvalidDate(time,"time")
    const now = new Date();
    const delta = now.getTime() - time.getTime();
    switch (unit) {
        case "ms": return delta > tolerance;
        case "s": return delta > tolerance * 1e3;
        case "min": return delta > tolerance * 60e3;
        case "h": return delta > tolerance * 60e3 * 60;
        case "d": return delta > tolerance * 60e3 * 60 * 24;
    }
}