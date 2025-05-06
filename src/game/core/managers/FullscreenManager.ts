import { Action } from "cookware";
import { DomEvent } from "spices";

export class FullscreenManager {

    public static readonly OnChange = new Action();

    public static Init(): void {
        document.addEventListener(DomEvent.FULLSCREENCHANGE, this._OnFullscreenChange);
    }

    private static _OnFullscreenChange = (): void => {
        this.OnChange.execute();
    }

    public static ExitFullscreen(): void {
        document.exitFullscreen();
    }

    public static Fullscreen(): void {
        document.documentElement.requestFullscreen();
    }

    public static IsFullscreen(): boolean {
        if (document.fullscreenElement) return true
        return false;
    }


}