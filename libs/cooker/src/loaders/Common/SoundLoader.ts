import { Howl, HowlOptions } from 'howler';
import { Sound, SoundOption } from '../../components/Sound';
import { LoaderBase } from '../bases/LoaderBase';

export class SoundLoader extends LoaderBase {
    private _options: HowlOptions;
    private _soundOption: SoundOption = null;
    private _sound: Sound | null = null;

    constructor(id: string, options: HowlOptions, soundOption: SoundOption = null) {
        super(id);
        this._options = options;
        this._soundOption = soundOption;
    }

    public async load(): Promise<void> {
        return new Promise((resolve) => {
            const howl = new Howl(this._options);
            howl.once('loaderror', () => {
                throw new Error(`SoundLoader: resource not found ${this._id} at ${this._options.src}`)
            });
            howl.once('load', () => {
                this._sound = new Sound(this._id, howl, this._soundOption);
                resolve();
            });

        });

    }

    public get sound(): Sound | null { return this._sound; }

}