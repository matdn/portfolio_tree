import { HowlOptions } from 'howler';
import { Sound, SoundOption } from '../components/Sound';
import { ImageLoader } from '../loaders/Common/ImageLoader';
import { JSONLoader } from '../loaders/Common/JSONLoader';
import { SoundLoader } from '../loaders/Common/SoundLoader';
import { VideoLoader } from '../loaders/Common/VideoLoader';
import { LoaderBase } from '../loaders/bases/LoaderBase';

export default class CommonAssetsManager {
	private static _Loaders = new Map<string, LoaderBase>();

	private static _SoundLoaders = new Map<string, SoundLoader>();
	private static _JSONLoaders = new Map<string, JSONLoader>();
	private static _ImageLoaders = new Map<string, ImageLoader>();
	private static _VideoLoaders = new Map<string, VideoLoader>();

	private static _LoadingQueue = Array<LoaderBase>();

	private static _CurrentLoadIndex: number = 0;
	private static _NumToLoad: number = 0;

	private static _IsLoading: boolean = false;

	public static Init() {
		this._Loaders.clear();
		this._SoundLoaders.clear();
		this._ImageLoaders.clear();
		this._JSONLoaders.clear();
		this._LoadingQueue.length = 0;
		this._CurrentLoadIndex = 0;
	}

	//
	// ADD
	//
	public static AddSound(id: string, options: HowlOptions,  soundOption: SoundOption = null) {
		if (this._SoundLoaders.has(id)) return
		const loader = new SoundLoader(id, options, soundOption);
		this._SoundLoaders.set(id, loader);

		this._AddLoader(loader);
	}

	public static UpdateSound(id: string, options: HowlOptions) {
		if (this._SoundLoaders.has(id)) {
			this._SoundLoaders.delete(id);
		}
		const loader = new SoundLoader(id, options);
		this._SoundLoaders.set(id, loader);

		this._AddLoader(loader);
	}

	public static AddJSON(id: string, path: string) {
		if (this._JSONLoaders.has(id)) return
		const loader = new JSONLoader(id, path);
		this._JSONLoaders.set(id, loader);

		this._AddLoader(loader);
	}

	public static AddImage(id: string, path: string) {
		if (this._ImageLoaders.has(id)) return
		const loader = new ImageLoader(id, path);
		this._ImageLoaders.set(id, loader);

		this._AddLoader(loader);
	}

	public static AddVideo(id: string, path: string) {
		const loader = new VideoLoader(id, path);
		this._VideoLoaders.set(id, loader);

		this._AddLoader(loader);
	}

	private static _AddLoader(loader: LoaderBase): void {
		this._LoadingQueue.push(loader);
		this._NumToLoad = this._LoadingQueue.length;
	}

	//
	// Load
	//
	public static async Load(): Promise<void> {
		if (this._IsLoading) {
			throw new Error('CommonAssetsManager is already loading');
		}
		this._IsLoading = true;
		this._CurrentLoadIndex = 0;
		this._NumToLoad = this._LoadingQueue.length;
		if (this._LoadingQueue.length > 0) {
			await Promise.all(
				this._LoadingQueue.map((queue) =>
					queue.load().then(() => {
						this._Loaders.set(queue.id, queue);
						this._CurrentLoadIndex++;
					}),
				),
			);
		}
		this._CurrentLoadIndex = 0;
		this._LoadingQueue.length = 0;
		this._IsLoading = false;
	}

	//
	// Get
	//
	public static GetSound(id: string): Sound | undefined {
		if (this._SoundLoaders.has(id)) return this._SoundLoaders.get(id)?.sound as Sound;
		else throw new Error(`Sound with id: ${id} does not exist.`);
	}

	public static GetAllSounds(): Sound[] {
		const sounds: Sound[] = [];
		this._SoundLoaders.forEach((loader) => {
			sounds.push(loader.sound as Sound);
		});
		return sounds;
	}

	public static GetJSON(id: string): any | undefined {
		if (this._JSONLoaders.has(id)) return this._JSONLoaders.get(id)?.json;
		else throw new Error(`Sound with id: ${id} does not exist.`);
	}

	public static GetImage(id: string): HTMLImageElement | undefined {
		if (this._ImageLoaders.has(id)) return this._ImageLoaders.get(id)?.image;
		else throw new Error(`Image with id: ${id} does not exist.`);
	}

	public static GetVideo(id: string): HTMLVideoElement | undefined {
		if (this._VideoLoaders.has(id)) return this._VideoLoaders.get(id)?.video;
		else throw new Error(`Video with id: ${id} does not exist.`);
	}

	//
	// Has
	//
	public static HasAsset(id: string): boolean {
		if (this._Loaders.has(id)) return true;
		return false;
	}

	//#region getter/setter
	public static get CurrentLoadIndex(): number {
		return this._CurrentLoadIndex;
	}
	public static get NumToLoad(): number {
		return this._NumToLoad;
	}
	//#endregion
}
