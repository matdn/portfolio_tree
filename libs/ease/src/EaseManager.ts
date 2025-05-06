import { Ease } from "./Ease";

export class EaseManager {
    private static _EasesList: Array<Ease> = new Array<Ease>();
    private static _LastTime: number;

    private static _isRendering: boolean = false;

    public static GetTime() {
        return Date.now();
    }

    public static Add(ease: Ease) {
        if (this._EasesList.indexOf(ease) < 0) {

            if (this._EasesList.length == 0) {

                this._LastTime = this.GetTime();
            }
            this._EasesList.push(ease);
            if (!this._isRendering) { this._Render(); }
        }
    }

    public static Remove(ease: Ease) {
        const index = this._EasesList.indexOf(ease);

        if (index > -1) { this._EasesList.splice(index, 1); }
    }

    private static _Render = () => {
        const now = this.GetTime();
        const dt = now - this._LastTime;
        this._LastTime = now;
        const num = this._EasesList.length;

        this._isRendering = true;
        for (let i = num - 1; i >= 0; i--) {

            const ease = this._EasesList[i];
            ease?.render(dt);
        }
        
        if (this._EasesList.length > 0) {
            requestAnimationFrame(this._Render);
        }else{
            this._isRendering = false;
        }
    }
}