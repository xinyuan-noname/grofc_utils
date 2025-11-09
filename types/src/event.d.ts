export function createEventEmitter(): {
    dispatchSync: (event: any, ing?: () => void, options?: {}) => void;
    on: (event: any, phase: any, callback: any) => void;
};
