import { SuperViewBase } from "../../../../views/bases/SuperViewBase";

export class HTMLViewBase extends SuperViewBase {

    protected _html: HTMLElement | null = null;

    public setHTMLElement(html: HTMLElement | null): void {
        this._html = html;
    }

    public get html(): HTMLElement | null { return this._html; }
}