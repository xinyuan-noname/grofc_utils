const checkValidRegExps = {
    isInteger: /^-?\d+$/,
    isUnsignedInteger: /^\d+$/,
    isCnName: /^[\u4e00-\u9fff]+(?:\u00b7[\u4e00-\u9fff]+)*$/
}
export function isIntegerString(str) {
    return typeof str === "string" && checkValidRegExps.isInteger.test(str)
}
export function isUnsignedIntegerString(str) {
    return typeof str === "string" && checkValidRegExps.isUnsignedInteger.test(str)
}
export function isCnNameString(str) {
    return typeof str === "string" && checkValidRegExps.isCnName.test(str)
}