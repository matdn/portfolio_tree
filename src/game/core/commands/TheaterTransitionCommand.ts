import { TheatersManager, TheatersProxy, ViewBase, ViewState, ViewsManager, ViewsProxy } from "pancake";
import { TheaterPreloadReactHTMLView } from "../_engine/htmls/views/TheaterPreloadReactHTMLView";
import { SuperTheaterBase } from "../theaters/SuperTheaterBase";

export class TheaterTransitionCommand {

    private static _NextTheaterId: string;
    private static _IntervalId: ReturnType<typeof setTimeout>;
    private static _TransitionViewId: string;

    private static _IsFinishViewTransition: boolean = false;
    private static _IsFinishLoadTheater: boolean = false;

    public static DefaultTransitionViewId: string = TheaterPreloadReactHTMLView.ViewId;

    public static async Show(theaterId: string, transitionId: string | null = null): Promise<void> {
        if (transitionId == null) transitionId = this.DefaultTransitionViewId;
        if (TheatersManager.IsInCurrentTheater(theaterId)) return;
        clearTimeout(this._IntervalId);
        this._IsFinishViewTransition = false;
        this._IsFinishLoadTheater = false;
        this._TransitionViewId = transitionId;
        this._NextTheaterId = theaterId;
        const view = ViewsProxy.GetView<TheaterPreloadReactHTMLView>(this._TransitionViewId);
        view.setNextTheaterId(theaterId);
        view.onStateChangeAction.add(this._OnChangeStateTransitionView);
        view.onFinishTransition.add(this._OnFinishViewTransition);
        ViewsManager.Show(view);
    }

    private static _OnChangeStateTransitionView = (view: ViewBase, state: ViewState): void => {
        if (state == ViewState.LIVE) {
            const theater = TheatersProxy.GetTheater(this._NextTheaterId) as SuperTheaterBase;
            theater.onFinishLoad.add(this._OnFinishLoadNextTheater);
            theater.load();
            view.onStateChangeAction.delete(this._OnChangeStateTransitionView);
        }
    };

    private static _OnFinishLoadNextTheater = (theater: SuperTheaterBase): void => {
        this._IsFinishLoadTheater = true;
        this._CheckForShowNextTheater();
    };

    private static _OnFinishViewTransition = (): void => {
        this._IsFinishViewTransition = true;
        this._CheckForShowNextTheater();
    };

    private static _CheckForShowNextTheater(): void {
        if (!this._IsFinishLoadTheater) return;
        if (!this._IsFinishViewTransition) return;

        TheatersManager.ShowById(this._NextTheaterId);
        clearTimeout(this._IntervalId);
        this._IntervalId = setTimeout(this._HideTansitionView, 0);

    }

    private static _HideTansitionView = (): void => {
        ViewsManager.HideById(this._TransitionViewId);
    };

    //#region getter
    public static get TransitionViewId(): string { return this._TransitionViewId; }
    //#endregion

}