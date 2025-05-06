import { ViewId } from "../../../../src/game/constants/views/ViewId";
import { ViewState } from "../constants/ViewState";
import { ViewsProxy } from "../proxies/ViewsProxy";
import { ViewBase } from "../views/ViewBase";

export class ViewsManager {
    public static readonly OnShowView = new Set<(view: ViewBase) => void>();
    public static readonly OnRemoveView = new Set<(view: ViewBase) => void>();
    private static _CurrentViewsList = new Array<ViewBase>();
    private static _DisplayedViewsList = new Set<ViewBase>();

    public static Init() {
        this._CurrentViewsList.length = 0;
        this._DisplayedViewsList.clear();
    }

    public static ShowById(viewId: string) {
        const view = ViewsProxy.GetView(viewId);
        this.Show(view);
    }

    public static Show(view: ViewBase) {
        if (this._CurrentViewsList.indexOf(view) > -1) return;

        for (let oldView of this._CurrentViewsList) {
            if (oldView.placementId == view.placementId && oldView.placementId > -1) this.Hide(oldView);
        }
        view.init();
        this._DisplayedViewsList.add(view);
        this._CurrentViewsList.push(view);
        this._CurrentViewsList.sort(this._SortViewByPlacementId);
        for (let func of this.OnShowView) {
            func(view);
        }
        view.playIntro();
    }

    private static _SortViewByPlacementId(a: ViewBase, b: ViewBase) {
        if (a.placementId < b.placementId) return -1;
        if (a.placementId > b.placementId) return 1;
        return 0;
    }

    public static HideById(viewId: string) {
        const view = ViewsProxy.GetView(viewId);
        this.Hide(view);

    }

    public static Hide(view: ViewBase) {
        this._RemoveViewFromList(view);
        if (view.viewState != ViewState.OFF) {
            view.playOutro();
        }
    }

    public static RemoveAll(): void {
        for (let i = this._CurrentViewsList.length - 1; i >= 0; i--) {
            this.Remove(this._CurrentViewsList[i]);
        }
    }

    public static Remove(view: ViewBase): void {
        if (view.viewState != ViewState.OFF) {
            view.outroFinish();
            return;
        }
        this._RemoveViewFromList(view);
        this._DisplayedViewsList.delete(view);
        for (let func of this.OnRemoveView) {
            func(view);
        }
    }

    private static _RemoveViewFromList(view: ViewBase): void {
        const index = this._CurrentViewsList.indexOf(view);
        if (index > -1) this._CurrentViewsList.splice(this._CurrentViewsList.indexOf(view), 1);
    }

    public static IsInCurrentView(id: string) {
        if (!ViewsProxy.IsViewInstanced(id)) return false;
        const view = ViewsProxy.GetView(id);
        return this._CurrentViewsList.indexOf(view) > -1;
    }

    //#region getter/setter
    public static get CurrentViewsList() { return this._CurrentViewsList; };
    public static get DisplayedViewsList() { return this._DisplayedViewsList; };
    public GetViewById(viewId: ViewId) { return ViewsProxy.GetView(viewId); };
    //#endregion

}