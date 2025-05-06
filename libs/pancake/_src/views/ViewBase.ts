import { ViewState } from "../constants/ViewState";
import { ViewsManager } from "../managers/ViewsManager";

export abstract class ViewBase {

    protected _viewId: string;
    protected _placementId: number;
    protected _viewState: ViewState;

    public readonly onStateChangeAction = new Set<(view : ViewBase, state : ViewState) => void>();

    constructor(viewId: string, placementId: number) {
        this._viewState = ViewState.OFF;
        this._viewId = viewId;
        this._placementId = placementId;
    }

    public init(): void {
        this._setViewState(ViewState.INIT);
    }

    public playIntro(): void {
        this._setViewState(ViewState.PLAYING_INTRO);
    }

    protected _introFinish(): void {
        this._setViewState(ViewState.LIVE);
    }

    public playOutro(): void {
        this._setViewState(ViewState.PLAYING_OUTRO);
    }

    public outroFinish() {
        this._outroFinish();
    }

    protected _outroFinish(): void {
        this._setViewState(ViewState.OFF);
        ViewsManager.Remove(this);
    }

    private _setViewState(state: ViewState): void {
        this._viewState = state;

        for (let func of this.onStateChangeAction) {
            func(this, state);
        }
    }

    //#region  getter/setter
    public get viewId(): string { return this._viewId; }
    public get placementId(): number { return this._placementId; }
    public get viewState(): ViewState { return this._viewState; }
    //#endregion

}
