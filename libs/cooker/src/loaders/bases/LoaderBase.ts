export abstract class LoaderBase {

    protected _id: string;

    constructor(id: string) {
        this._id = id;
    }

    public async load(): Promise<void> {
        // 
    }

    public get id(): string { return this._id; }
}