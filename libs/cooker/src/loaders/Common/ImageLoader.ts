import { LoaderBase } from "../bases/LoaderBase";

export class ImageLoader extends LoaderBase {

    private _path: string;
    private _image: HTMLImageElement;

    constructor(id: string, path: string) {
        super(id);
        this._path = path;
    }

    public override async load(): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = document.createElement('img') as HTMLImageElement;
            img.onload = () => {
                resolve();
                this._image = img;
            }
            img.src = this._path;
        });
    }

    public get image(): HTMLImageElement { return this._image; }
}