import { Ticker } from "cookware";
import { Ease, EaseFunction } from "ease";
import { AnimationAction } from "three";

export class Mouvement {

    private _action: AnimationAction;
    private _ease: Ease;
    private _speed: number = 1;
    private _randomiseStart: boolean = false;
    private _offsetTime: number = 0;
    private _fps: number = -1;
    private _movementTransitionDuration: number = 100;

    constructor(action: AnimationAction, speed: number = 1, randomiseStart: boolean = false) {
        this._action = action;
        action.timeScale = 0.001;
        this._ease = new Ease();
        this._ease.onChange = this._onChangeEase;
        this._speed = speed;
        this._randomiseStart = randomiseStart;
    }

    public setMovementTransitionDuration(duration: number): void {
        this._movementTransitionDuration = duration;
    }

    public setFrp(fps: number): void {
        this._fps = fps;
    }

    public start(): void {
        this._action.play();
        if (this._randomiseStart) {
            this._offsetTime = Math.random() * this._action.getClip().duration * 1000;
        }
        this._ease.clear().to(1, this._movementTransitionDuration, EaseFunction.EaseOutQuad).call(this._onFinishEaseStart);
    }

    public stop(): void {
        this._ease.clear().to(0, this._movementTransitionDuration, EaseFunction.EaseOutQuad).call(this._onFinishEaseStop);
    }

    private _onChangeEase = (value: number): void => {
        this._action.setEffectiveWeight(value);
    }

    private _onFinishEaseStart = (value: number): void => {
        this._action.setEffectiveWeight(1);
    }

    private _onFinishEaseStop = (value: number): void => {
        this._action.stop();
        this._action.setEffectiveWeight(0);
    }

    public update(dt: number): void {
        let d = (Ticker.ElapsedTime + this._offsetTime) * 0.001 * this._speed;
        if (this._fps > 0) {
            let r = this._fps / this._speed;
            d = Math.round(d * r) / r;
        }
        this._action.time = d;
    }
}