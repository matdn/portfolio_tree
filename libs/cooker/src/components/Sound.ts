import { AudioMixerManager } from "../managers/AudioMixerManager";
import { Howl } from "howler";
import { AudioMixer } from "./AudioMixer";

export type SpriteType = string | number | undefined;
export type SoundOption = {
	audioMixerId: string | null;
}

export class Sound {
	private _id: string;
	private _howl: Howl;
	private _volume: number = 1;
	private _initVolume: number = 1;
	private _startTime: number = 0;
	private _fadeDuration: number = 1000;
	private _raf: number = -1;
	private _startAnimationValue = 0;
	private _endAnimationValue = 0;
	private _currentAnimationValue = 0;
	private _soundOption: SoundOption = null;
	private _isPlaying: boolean = false;
	private _audioMixer: AudioMixer;
	private _isMute: boolean = false;

	constructor(id: string, howl: Howl, option: SoundOption = null) {
		option = {
			audioMixerId: AudioMixerManager.GLOBAL,
			...option
		};

		this._id = id;
		this._soundOption = option;
		this._howl = howl;
		if (!howl) throw new Error(`Try to create the sound ${id} with an undefined howl object`);
		this.setAudioMixer(AudioMixerManager.GetAudioMixer(option.audioMixerId));
		this._initVolume = this._howl.volume();
		this.setVolume(0);
	}

	public setAudioMixer(audioMixer: AudioMixer) {
		if (this._audioMixer) {
			this._audioMixer.onMuteChange.delete(this._onChangeAudioMixerMute);
			this._audioMixer.onVolumeChange.delete(this._onChangeAudioMixerVolume);
		}
		this._audioMixer = audioMixer;
		this._audioMixer.onMuteChange.add(this._onChangeAudioMixerMute);
		this._audioMixer.onVolumeChange.add(this._onChangeAudioMixerVolume);
		this._onChangeAudioMixerMute(audioMixer);
	}

	private _onChangeAudioMixerMute = (audioMixer: AudioMixer): void => {
		this.mute(this._isMute);
	}

	private _onChangeAudioMixerVolume = (audioMixer: AudioMixer): void => {
		this.setVolume(this._volume);
	}

	public setVolume(volume: number) {
		this._volume = volume;
		const vol = this._initVolume * this._volume * this._audioMixer.globalVolume;
		this._howl.volume(vol);
	}

	public play(sprite?: SpriteType) {
		this._isPlaying = true;
		this.setVolume(1);
		this._howl.stop();
		this._howl.play(sprite);
	}

	public stop() {
		this._isPlaying = false;
		this._howl.stop();
		cancelAnimationFrame(this._raf);
	}

	public fadeIn(duration: number, sprite?: SpriteType) {
		this._isPlaying = true;
		const volume = this._volume;
		this.play(sprite);
		this.setVolume(volume);
		this._startAnimation(1, duration);
	}

	private _startAnimation(value: number, duration: number): void {
		this._startAnimationValue = this._currentAnimationValue;
		this._endAnimationValue = value;
		this._startTime = Date.now();
		this._fadeDuration = duration;
		cancelAnimationFrame(this._raf);
		this._render();
	}

	private _render = () => {
		let p = (Date.now() - this._startTime) / this._fadeDuration;
		if (p < 0) p = 0;
		if (p > 1) p = 1;
		this._currentAnimationValue = this._startAnimationValue + p * (this._endAnimationValue - this._startAnimationValue);
		this.setVolume(this._currentAnimationValue);
		if (p < 1) {
			cancelAnimationFrame(this._raf);
			this._raf = requestAnimationFrame(this._render);
		} else {
			if (this._currentAnimationValue == 0) this.stop();
		}
	}

	public fadeOut(duration: number) {
		this._isPlaying = false;
		this._startAnimation(0, duration);
	}

	public getSprites(): Array<{ string: Array<number> }> {
		return (this._howl as any)._sprite;
	}

	public mute(muted: boolean): void {
		this._isMute = muted;
		this._howl.mute(muted || this._audioMixer.globalIsMute);
	}

	//#region getter/setter
	public get id(): string { return this._id; }
	public get howl(): Howl { return this._howl; }
	public get isPlaying(): boolean { return this._isPlaying; }
	public get soundOption(): SoundOption { return this._soundOption; }
	public get audioMixer(): AudioMixer { return this._audioMixer; }
	//#endregions
}