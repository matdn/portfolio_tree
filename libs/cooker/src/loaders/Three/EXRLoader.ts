import * as THREE from "three";
import { EXRLoader as THREEEXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import { LoaderBase } from "../bases/LoaderBase";

export default class EXRLoader extends LoaderBase {

    private _path: string;
    private _dataTexture: THREE.DataTexture;

    constructor(id: string, path: string) {
        super(id);
        this._path = path;
    }

    public load(): Promise<void> {
        return new Promise((resolve) => {
            const loader = new THREEEXRLoader();
            loader.load(this._path, (texture: THREE.DataTexture) => {
                this._dataTexture = texture;
                this._dataTexture.wrapS = THREE.RepeatWrapping;
                this._dataTexture.wrapT = THREE.RepeatWrapping;
                this._dataTexture.flipY = false;
                resolve();
            });
        });
    }

    public get dataTexture(): THREE.DataTexture { return this._dataTexture; }

} 