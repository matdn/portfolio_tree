export class PoolObject<T>{

    private _availablesList = new Array<T>();
    private _constructor: new () => T;

    constructor(creator: new () => T) {
        this._constructor = creator;
    }

    public get(): T {
        let o: T;
        if (this._availablesList.length) {
            o = this._availablesList.pop() as T;
        } else {
            o = new this._constructor() as T;
        }
        return o as T;
    }

    public release(o: T): void {
        if (this._availablesList.indexOf(o) < 0) {
            this._availablesList.push(o);
        }
    }
}