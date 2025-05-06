import * as THREE from "three";
import { LoaderBase } from "../bases/LoaderBase";

export default class TextureLoader extends LoaderBase {
    private _path: string;
    private _texture: THREE.Texture | undefined;

    private _loader: THREE.TextureLoader = new THREE.TextureLoader();

    constructor(id: string, path: string) {
        super(id);
        this._path = path;
    }


    public async load(): Promise<void> {
        this._texture = await this._loader.loadAsync(this._path);
        this._texture.flipY = false;
        this._texture.colorSpace = THREE.SRGBColorSpace;
    }

    public get texture(): THREE.Texture {
        if (this._texture instanceof THREE.Texture) {
            return this._texture;
        } else {
            throw new Error(`Couldn't load the following Texture: ${this._id}`);
        }
    }
}
