import { ViewBase } from "../views/ViewBase";

type ViewConstructor = new () => ViewBase;


export class ViewsProxy {

    private static _ViewConstructorsMap = new Map<string, ViewConstructor>();
    private static _ViewsMap = new Map<string, ViewBase>();

    public static Init() {
        this._ViewsMap.clear();
        this._ViewConstructorsMap.clear();
    }


    public static AddViewConstructor(viewId: string, viewConstructor: ViewConstructor) {
        this._ViewConstructorsMap.set(viewId, viewConstructor);
    }

    public static AddView(view: ViewBase) {
        this._ViewsMap.set(view.viewId, view);
    }


    public static GetView<T extends ViewBase>(viewId: string) {
        let view: ViewBase;
        if (this._ViewsMap.has(viewId)) {
            view = this._ViewsMap.get(viewId) as T;
        } else {
            if (!this._ViewConstructorsMap.has(viewId)) {
                throw new Error(`ViewsProxy: id ${viewId} not declared`);
            }
            const viewConstructor = this._ViewConstructorsMap.get(viewId) as ViewConstructor;
            view = new viewConstructor();
            // this.AddView(view);
            this._ViewsMap.set(viewId, view);
            view = this._ViewsMap.get(viewId) as T;
        }
        return view as T;
    }

    public static GetViewByPlacementId(placement: number) {
        const tab = new Array<ViewBase>();
        for (let view of this._ViewsMap.values()) {
            if (view.placementId == placement) {
                tab.push(view);
            }
        }
        return tab;
    }

    public static IsViewInstanced(id: string) {
        return this._ViewsMap.has(id);
    }


}