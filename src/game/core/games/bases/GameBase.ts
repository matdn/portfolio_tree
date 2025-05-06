import { Action } from "cookware";
import { DomEvent, KeyboardConstant } from "spices";
import { DebugManager } from "../../debugs/DebugManager";

export class GameBase {

    protected _gameId: string;

    protected _isInit: boolean = false;
    protected _isStart: boolean = false;

    public readonly onReset = new Action<[GameBase]>();
    public readonly onInit = new Action<[GameBase]>();
    public readonly onStart = new Action<[GameBase]>();
    public readonly onStop = new Action<[GameBase]>();

    constructor(gameId: string) {
        this._gameId = gameId;
    }

    public init(): void {
        this._isInit = true;
        this.onInit.execute(this);
        if (DebugManager.IsDev) {
            window.removeEventListener(DomEvent.KEY_UP, this._onKeyUp);
            window.addEventListener(DomEvent.KEY_UP, this._onKeyUp);
        }

    }

    public reset(): void {
        this._isInit = false;
        this._isStart = false;
        this.onReset.execute(this);
        if (DebugManager.IsDev) {
            window.removeEventListener(DomEvent.KEY_UP, this._onKeyUp);
        }
    }

    public start(): void {
        this._isStart = true;
        this.onStart.execute(this);
    }

    public stop(): void {
        this._isStart = false;
        this.onStop.execute(this);
    }

    public update(dt: number): void {
        // 
    }

    protected _onKeyUp = (e: KeyboardEvent) => {
        if (DebugManager.IsDev) {
            if (e.shiftKey && e.code == KeyboardConstant.Codes.KeyR) {
                this._debugRestart();
            }
        }
    }

    protected _debugRestart(): void {
        this.init();
    }


    //#region getter/setter
    public get gameId(): string { return this._gameId; }
    public get isInit(): boolean { return this._isInit; }
    //#endregion

}