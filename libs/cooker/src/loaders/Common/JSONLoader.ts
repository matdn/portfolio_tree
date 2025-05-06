import { LoaderBase } from "../bases/LoaderBase";


export class JSONLoader extends LoaderBase {

    private _path: string;
    private _json: any;

    constructor(id: string, path: string) {
        super(id);
        this._path = path;
    }

    public override async load(): Promise<void> {
        return window.fetch(this._path).then(response => {
            return response.json();
        }).then(json => {
            this._json = json;
        });
    }

    public get json() { return this._json; }
}