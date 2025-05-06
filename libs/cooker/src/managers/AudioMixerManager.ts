import { AudioMixer } from "../components/AudioMixer";

export class AudioMixerManager {

    public static readonly GLOBAL = 'GLOBAL';
    public static readonly MUSIC = 'MUSIC';
    public static readonly FX = 'FX';

    private static _AudioMixersMap = new Map<string, AudioMixer>();
    private static _LastIsMuted: boolean = false;
    private static _LockSaveState: boolean = false;
    private static _IntervalId: ReturnType<typeof setTimeout>;

    public static readonly OnMuteChange = new Set<() => void>();
    public static readonly OnVolumeChange = new Set<() => void>();

    public static DispatchOnMuteChange(): void {
        for (const callback of this.OnMuteChange) callback();
    }

    public static Init(): void {
        this._AudioMixersMap.clear();
        const global = new AudioMixer(this.GLOBAL);
        const music = new AudioMixer(this.MUSIC);
        const fx = new AudioMixer(this.FX);
        global.addChild(music);
        global.addChild(fx);
        this.AddAudioMixer(global);
        this.AddAudioMixer(music);
        this.AddAudioMixer(fx);

        window.addEventListener('blur', this._OnBlur);
        window.addEventListener('focus', this._OnFocus);

        for (let i = 0; i < window.sessionStorage.length; i++) {
            const key = window.sessionStorage.key(i);
            if (this._IsSoundSessionStorageKey(key)) {
                const group = this._GetGroupFromSessionStorageKey(key);
                const value = window.sessionStorage.getItem(key);
                const audioMixer = AudioMixerManager.GetAudioMixer(group);
                audioMixer.isMute = (value == '1');
            }
        }
        if (document.hasFocus()) this._OnFocus();
        else this._OnBlur();
    }

    public static DispatchMuteChange(): void {
        for (const action of this.OnMuteChange) action();
    }

    public static DispatchVolumeChange(): void {
        for (const action of this.OnVolumeChange) action();
    }

    public static GetGlobal(): AudioMixer {
        return this.GetAudioMixer(this.GLOBAL);
    }

    public static GetMusic(): AudioMixer {
        return this.GetAudioMixer(this.MUSIC);
    }

    public static GetFX(): AudioMixer {
        return this.GetAudioMixer(this.FX);
    }

    public static AddAudioMixer(audioMixer: AudioMixer): void {
        this._AudioMixersMap.set(audioMixer.audioMixerId, audioMixer);
    }

    public static GetAudioMixer(audioMixerId: string): AudioMixer {
        return this._AudioMixersMap.get(audioMixerId);
    }

    //
    //
    //
    private static _GetSessionStorageKeyFromGroup(group: string): string {
        return `sound_${group}`;
    }

    private static _GetGroupFromSessionStorageKey(key: string): string {
        return key.substring(6, key.length);
    }

    private static _IsSoundSessionStorageKey(key: string): boolean {
        return key.startsWith('sound_');
    }

    private static _OnBlur = (): void => {
        this._LockSaveState = true;
        const audioMixers = this.GetGlobal();
        this._LastIsMuted = audioMixers.isMute;
        audioMixers.isMute = true;
        this._LockSaveState = false;
        clearTimeout(this._IntervalId);
    };

    private static _OnFocus = (): void => {
        this._LockSaveState = true;
        const audioMixers = this.GetGlobal();
        audioMixers.isMute = this._LastIsMuted;
        this._LockSaveState = false;
        clearTimeout(this._IntervalId);
        this._IntervalId = setTimeout(this._ResumeHowler, 200);
        this._IntervalId = setTimeout(this._ResumeHowler, 1000);
    };

    private static _ResumeHowler = (): void => {
        Howler?.ctx?.resume();
    };

    public static SaveAudioMixerState(audioMixer: AudioMixer): void {
        if (audioMixer.audioMixerId === this.GLOBAL) return;
        if (this._LockSaveState) return;
        window.sessionStorage.setItem(this._GetSessionStorageKeyFromGroup(audioMixer.audioMixerId), audioMixer.isMute ? '1' : '0');
    }

}

AudioMixerManager.Init();
