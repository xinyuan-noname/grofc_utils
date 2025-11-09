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
export function createEventEmitter(): {
    dispatchSync: (event: string, ing: (ingEvent: {
        target: any;
        name: string;
        type: string | null;
        preData: object;
        phase: "ing";
        data: object;
    }) => void, options: {
        target: any;
        name: string;
        type: string | null;
        status: object;
        data: object;
    }) => object;
    on: (event: string, phase: "before" | "begin" | "end" | "after", callback: (event: {
        target: any;
        name: string;
        type: string | null;
        preData: object;
        data: object;
    }) => void) => void;
    off: (event: string, phase: "before" | "begin" | "end" | "after", callback: (event: {
        target: any;
        name: string;
        type: string | null;
        preData: object;
        data: object;
    }) => void) => void;
};
