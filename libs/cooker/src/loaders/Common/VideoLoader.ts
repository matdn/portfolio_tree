import { LoaderBase } from "../bases/LoaderBase";

export class VideoLoader extends LoaderBase {

	private _path: string;
	private _video: HTMLVideoElement;

	constructor(id: string, path: string) {
		super(id);
		this._path = path;
	}

	public override async load(): Promise<void> {
		return new Promise((resolve, reject) => {
			const video = document.createElement('video');
			video.src = this._path;
			video.load();
			video.onloadeddata = () => {
				this._video = video;
				resolve();
			};
		});

	}

	public get video(): HTMLVideoElement { return this._video; }
}