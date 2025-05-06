import { ViewsManager } from "../managers/ViewsManager";

export abstract class TheaterBase {

    protected _theaterId: string;
    protected _placcementId: number;
    protected _viewsList = new Set<string>();
    protected _siblingViewsList = new Set<string>();

    constructor(theaterId: string, placementId: number) {
        this._theaterId = theaterId;
        this._placcementId = placementId;
    }

    public init(): void {
        // 
    }

    public reset(): void {
        // 
    }

    public showViews(viewIds: string[]): void {
        for (const viewId of this._viewsList) {
            if (!viewIds.includes(viewId)) ViewsManager.HideById(viewId);
        }
        for (const viewId of this._siblingViewsList) {
            if (!viewIds.includes(viewId)) ViewsManager.HideById(viewId);
        }
        for (const viewId of viewIds) {
            ViewsManager.ShowById(viewId);
        }
    }

    public containsViewId(id: string): boolean {
        if (this._viewsList.has(id)) return true;
        if (this._siblingViewsList.has(id)) return true;
        return false;
    }

    //#region getter/setter
    public get theaterId(): string { return this._theaterId; }
    public get placementId(): number { return this._placcementId; }
    public get viewsList(): Set<string> { return this._viewsList; }
    public get siblingViewsList(): Set<string> { return this._siblingViewsList; }
    //#endregion

}
