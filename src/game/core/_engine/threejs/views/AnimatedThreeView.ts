import { Action } from "cookware";
import { Ease, EaseFunction } from "ease";
import { SuperViewBase } from "../../../views/bases/SuperViewBase";
import { ThreeViewBase } from "./bases/ThreeViewBase";

export class AnimatedThreeView extends ThreeViewBase {

    protected _ease: Ease;
    protected _animationDuration: number = SuperViewBase.TransitionDuration;
    protected _animationEasing = EaseFunction.EaseOutQuad;
    protected _value: number = 0;
    public onTransitionChangeAction = new Action<[number]>();

    constructor(viewId: string, placementId: number) {
        super(viewId, placementId);
        this._ease = new Ease();
        this._ease.onChange = this.__onChangeEase;
    }

    public override init(): void {
        super.init();
        this._onChangeEase(0);
    }

    public override playIntro(): void {
        super.playIntro();
        this._ease.clear().to(1, this._animationDuration, this._animationEasing).call(this._onFinishEaseIntro);
    }

    protected _onFinishEaseIntro = (): void => {
        this._introFinish();
    }

    public override playOutro(): void {
        super.playOutro();
        this._ease.clear().to(0, this._animationDuration, this._animationEasing).call(this._onFinishEaseOutro);
    }

    protected _onFinishEaseOutro = (): void => {
        this._outroFinish();
    }

    protected override _outroFinish(): void {
        this._ease.setValue(0);
        super._outroFinish();
    }

    protected __onChangeEase = (value: number): void => {
        this._onChangeEase(value);
    }

    protected _onChangeEase(value: number): void {
        this._value = value;
        this.onTransitionChangeAction.execute(value);
    }

    //#region getter/setter
    public get value() { return this._value; }
    //#endregion
}