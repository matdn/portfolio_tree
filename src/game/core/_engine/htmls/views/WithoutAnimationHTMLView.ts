import { HTMLViewBase } from "./bases/HTMLViewBase";

export class WithoutAnimationHTMLView extends HTMLViewBase {

    public override playIntro(): void {
        super.playIntro();
        this._introFinish();
    }

    public override playOutro(): void {
        super.playOutro();
        this._outroFinish();
    }
}