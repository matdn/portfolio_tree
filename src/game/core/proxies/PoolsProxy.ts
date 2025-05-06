import { PoolObject } from "cookware";

export class PoolsProxy {
    private static _PoolsMap = new Map<Function, PoolObject<any>>();

    public static Init(): void {
        //
    }

    public static AddPool<T>(creator: new () => T): void {
        if (!this._PoolsMap.has(creator)) {
            this._PoolsMap.set(creator, new PoolObject(creator));
        }
    }

    public static Get<T>(creator: new () => T): T {
        const pool = this._PoolsMap.get(creator);
        if (!pool) {
            throw new Error(`PoolObject for the given type not found`);
        }
        const obj = pool.get() as T;
        if(obj['init']) obj['init']();
        return obj;
    }

    public static Release<T>(obj: T): void {
        const constructor = obj.constructor as new () => T;
        const pool = this._PoolsMap.get(constructor);
        if (!pool) {
            throw new Error(`PoolObject for the given type not found`);
        }
        if(obj['reset']) obj['reset']();
        pool.release(obj);
    }
}
