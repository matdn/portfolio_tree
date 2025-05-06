import { AudioMixerManager } from "../managers/AudioMixerManager";

export class AudioMixer {

    private _audioMixerId: string;
    private _children = new Set<AudioMixer>();
    private _parent: AudioMixer | null = null;
    private _volume: number = 1;
    private _isMute: boolean = false;
    private _globalVolume: number = 1;
    private _globalIsMute: boolean = false;

    public readonly onMuteChange = new Set<(audioMixer: AudioMixer) => void>();
    public readonly onVolumeChange = new Set<(audioMixer: AudioMixer) => void>();

    constructor(audioMixerId: string) {
        this._audioMixerId = audioMixerId;
    }

    public addChild(child: AudioMixer): void {
        if (child._parent) child._parent.removeChild(child);
        this._children.add(child);
        child._parent = this;
    }

    public removeChild(child: AudioMixer): void {
        this._children.delete(child);
        child._parent = null;
    }

    private _setVolume(volume: number): void {
        this._volume = volume;
        this._refresh();
    }

    private _setIsMute(isMute: boolean): void {
        if (window['Howler']) {
            if (this._audioMixerId === AudioMixerManager.GLOBAL) Howler.mute(isMute);
            else Howler.mute(false);
        }
        this._isMute = isMute;
        this._refresh();
        AudioMixerManager.SaveAudioMixerState(this);
        this._dispatchOnMuteChange();
        AudioMixerManager.DispatchOnMuteChange();
    }

    private _dispatchOnMuteChange(): void {
        for (const callback of this.onMuteChange) callback(this);
        AudioMixerManager.DispatchMuteChange();
    }

    private _dispatchOnVolumeChange(): void {
        for (const callback of this.onVolumeChange){
            callback(this);
        } 
        AudioMixerManager.DispatchVolumeChange();
    }

    private _refresh(): void {
        let volume = this._volume;
        let parent = this._parent;
        this._globalIsMute = this._isMute;
        while (parent) {
            volume *= parent._volume;
            if (parent._isMute) this._globalIsMute = true;
            parent = parent._parent;

        }
        this._globalVolume = volume;
        for (const child of this._children) child._refresh();
        this._dispatchOnMuteChange();
        this._dispatchOnVolumeChange();
    }


    //#region Getters and Setters
    public get audioMixerId(): string { return this._audioMixerId; }

    public get volume(): number { return this._volume; }
    public set volume(value: number) { this._setVolume(value); }


    public get isMute(): boolean { return this._isMute; }
    public set isMute(value: boolean) { this._setIsMute(value); }

    public get globalVolume(): number { return this._globalVolume; }
    public get globalIsMute(): boolean { return this._globalIsMute; }

    public get children(): ReadonlySet<AudioMixer> { return this._children; }
    //#endregion
}