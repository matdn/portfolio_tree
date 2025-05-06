import { Action, Ticker } from "cookware";
import { TheatersProxy, ViewState } from "pancake";
import LoadingCommand from "../../../commands/LoadingCommand";
import { SuperTheaterBase } from "../../../theaters/SuperTheaterBase";
import ReactHTMLView from "./ReactHTMLView";

export class TheaterPreloadReactHTMLView extends ReactHTMLView {

    public static readonly ViewId: string = 'theaterPreloadReactView';
    public static readonly PlacementId: number = 99999;

    public readonly onPercentChange = new Action<[number]>();

    private _percent: number = 0;
    private _nextTheaterId: string | null = null;

    private _isLoaded: boolean = false;

    public readonly onFinishTransition = new Action();

    public setNextTheaterId(theaterId: string): void {
        this._nextTheaterId = theaterId;
    }

    public override init(): void {
        super.init();
        this._isLoaded = false;
        Ticker.Add(this._update);
    }

    public override playOutro(): void {
        super.playOutro();
        Ticker.Remove(this._update);
    }

    protected override _outroFinish(): void {
        super._outroFinish();
        Ticker.Remove(this._update);
        this._nextTheaterId = null;
        this._percent = 0;
    }

    private _update = (dt: number) => {
        this._percent = LoadingCommand.GetLoadingPercentage();
        const theater = TheatersProxy.GetTheater<SuperTheaterBase>(this._nextTheaterId);
        if (theater.isLoaded) this._percent = 100;

        if (theater.isLoaded && !this._isLoaded && this._viewState == ViewState.LIVE) {
            this._isLoaded = true;
            this._percent = 100;
            this._onFinishPreloadThetaer();
        }
        this.onPercentChange.execute(this._percent);
    };

    protected _onFinishPreloadThetaer(): void {
        this.onFinishTransition.execute();
    }


}