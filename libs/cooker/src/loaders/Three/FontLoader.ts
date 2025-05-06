import { Font } from 'three/examples/jsm/loaders/FontLoader';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
import { LoaderBase } from "../bases/LoaderBase";

export default class FontLoader extends LoaderBase {
    private _path: string;
    private _font: Font | undefined;

    private _loader: TTFLoader = new TTFLoader();

    constructor(id: string, path: string) {
        super(id);
        this._path = path;
    }


    public async load(): Promise<void> {
        const json = await this._loader.loadAsync(this._path);
        this._font = new Font(json);
    }

    public get font(): Font { return this._font; }
}
