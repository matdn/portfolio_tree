import { TheatersProxy } from "../proxies/TheatersProxy";
import { ViewsProxy } from "../proxies/ViewsProxy";
import { TheaterBase } from "../theaters/TheatherBase";
import { ViewsManager } from "./ViewsManager";

export class TheatersManager {

    private static _CurrentTheatersList = new Array<TheaterBase>();

    public static readonly OnShowTheater = new Set<(view: TheaterBase) => void>();
    public static readonly OnHideTheater = new Set<(view: TheaterBase) => void>();


    public static Init() {
        this._CurrentTheatersList.length = 0;
    }

    public static ShowById(id: string): void {
        const theater = TheatersProxy.GetTheater(id);
        this.Show(theater);
    }

    public static Show(theater: TheaterBase): void {
        for (let i = this._CurrentTheatersList.length - 1; i >= 0; i--) {
            const oldTheater = this._CurrentTheatersList[i];
            if (oldTheater.placementId == theater.placementId) {
                for (const id of oldTheater.viewsList) {
                    if (!theater.viewsList.has(id)) {
                        const view = ViewsProxy.GetView(id);
                        ViewsManager.Hide(view);
                    }
                }
                for (const id of oldTheater.siblingViewsList) {
                    if (!theater.viewsList.has(id)) {
                        const view = ViewsProxy.GetView(id);
                        ViewsManager.Hide(view);
                    }
                }
                const index = this._CurrentTheatersList.indexOf(oldTheater);
                if (index > -1) {
                    this._CurrentTheatersList.splice(index, 1);
                }
                oldTheater.reset();
            }
        }
        theater.init();
        this._CurrentTheatersList.push(theater);
        this._CurrentTheatersList.sort(this._SortTheaterByPlacementId);

        for (const id of theater.viewsList) {
            const view = ViewsProxy.GetView(id);
            ViewsManager.Show(view);
        }
        for (let func of this.OnShowTheater) {
            func(theater);
        }
    }


    private static _SortTheaterByPlacementId(a: TheaterBase, b: TheaterBase) {
        if (a.placementId < b.placementId) return -1;
        if (a.placementId > b.placementId) return 1;
        return 0;
    }


    public static GetTheaterByPlacementId(placementId: number): TheaterBase | null {
        for (let theater of this._CurrentTheatersList) {
            if (theater.placementId == placementId) return theater;
        }
        return null;
    }

    public static HideById(id: string): void {
        const theater = TheatersProxy.GetTheater(id);
        this.Hide(theater);
    }

    public static Hide(theater: TheaterBase): void {
        for (const id of theater.viewsList) {
            const view = ViewsProxy.GetView(id);
            let hide: boolean = true;
            for (const displayedTheater of this._CurrentTheatersList) {
                if (displayedTheater != theater) {
                    if (displayedTheater.containsViewId(view.viewId)) hide = false;
                }

            }
            if (hide) ViewsManager.Hide(view);
        }
        for (const id of theater.siblingViewsList) {
            const view = ViewsProxy.GetView(id);
            let hide: boolean = true;
            for (const displayedTheater of this._CurrentTheatersList) {
                if (displayedTheater != theater) {
                    if (displayedTheater.containsViewId(view.viewId)) hide = false;
                }

            }
            if (hide) ViewsManager.Hide(view);
        }
        const index = this._CurrentTheatersList.indexOf(theater);
        if (index > -1) {
            this._CurrentTheatersList.splice(index, 1);
        }
        theater.reset();
        for (let func of this.OnHideTheater) {
            func(theater);
        }
    }

    public static IsInCurrentTheater(theaterId: string): boolean {
        return this._CurrentTheatersList.includes(TheatersProxy.GetTheater(theaterId));
    }

    //#region getter/setter
    public static get CurrentTheatersList(): ReadonlyArray<TheaterBase> { return this._CurrentTheatersList; }
    //#endregion

}