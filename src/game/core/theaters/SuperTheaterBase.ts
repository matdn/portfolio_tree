import { Action } from "cookware";
import { TheaterBase } from "pancake";
import InitCommand from "../commands/inits/InitCommand";
import InitCommandBase from "../commands/inits/initcommands/bases/InitCommandBase";
import { SoundsManager } from "../managers/SoundsManager";

export class SuperTheaterBase extends TheaterBase {

    protected _virtualGamePadConfigId: string | null = null;
    protected _cameraId: string | null = null;
    protected _loopSoundsList = new Set<string>();
    protected _siblingSoundsList = new Set<string>();

    protected _initCommandsList = new Array<InitCommandBase>();
    protected _isLoaded: boolean = false;
    public readonly onFinishLoad = new Action<[SuperTheaterBase]>();


    public async load(): Promise<void> {
        if (!this._isLoaded && this._initCommandsList.length > 0) {
            await InitCommand.Execute(this._initCommandsList);
        }
        this._endLoad();
    }

    public setLoopList(soundsList: Array<string>): void {
        for (const soundId of this._loopSoundsList) {
            SoundsManager.FadeOut(soundId);
        }
        this._loopSoundsList.clear();
        for (const soundId of soundsList) {
            this._loopSoundsList.add(soundId);
        }
        SoundsManager.RefreshTheatersSound();
    }

    public setCameraId(cameraId: string): void {
        this._cameraId = cameraId;
    }

    protected _endLoad(): void {
        this._isLoaded = true;
        this.onFinishLoad.execute(this);
    }

    //#region getter/setter
    public get cameraId(): string | null { return this._cameraId; }
    public get isLoaded(): boolean { return this._isLoaded; }
    public get loopSoundsList(): Set<string> { return this._loopSoundsList; }
    public get siblingSoundsList(): Set<string> { return this._siblingSoundsList; }
    public get virtualGamePadConfigId(): string | null { return this._virtualGamePadConfigId; }
    //#endregion
}
