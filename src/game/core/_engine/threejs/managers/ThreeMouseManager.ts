import { Action, DeviceUtils } from "cookware";
import { DomEvent } from "spices";

// Core
import { MainThree } from "../MainThree";

export class ThreeMouseManager {

    private static _RelativeMouseX: number = 0;
    private static _RelativeMouseY: number = 0;
    private static _MouseX: number = 0;
    private static _MouseY: number = 0;
    private static _IsStart: boolean = false;

    private static _IsMouseEnter: boolean = false;

    public static readonly OnMouseDown = new Action();
    public static readonly OnMouseUp = new Action();
    public static readonly OnMouseMove = new Action();
    public static readonly OnMouseEnter = new Action();
    public static readonly OnMouseLeave = new Action();

    public static Init() {
        DeviceUtils.Init();
    }

    public static Start(): void {
        this._AddCallbacks();
        this._IsStart = true;
    }

    public static Stop(): void {
        this._RemoveCallbacks();
        this._IsStart = false;
    }

    private static _AddCallbacks(): void {
        this._RemoveCallbacks();
        if (MainThree.DomElementContainer) {
            if (DeviceUtils.IsMobile) {
                MainThree.DomElementContainer.addEventListener(DomEvent.TOUCH_START, this._OnMouseDown, { passive: false });
                MainThree.DomElementContainer.addEventListener(DomEvent.TOUCH_END, this._OnMouseUp, { passive: false });
                MainThree.DomElementContainer.addEventListener(DomEvent.TOUCH_MOVE, this._OnMouseMove, { passive: false });
            } else {
                MainThree.DomElementContainer.addEventListener(DomEvent.MOUSE_DOWN, this._OnMouseDown);
                MainThree.DomElementContainer.addEventListener(DomEvent.MOUSE_UP, this._OnMouseUp);
                MainThree.DomElementContainer.addEventListener(DomEvent.MOUSE_MOVE, this._OnMouseMove);
                MainThree.DomElementContainer.addEventListener(DomEvent.MOUSE_ENTER, this._OnMouseEnter);
                MainThree.DomElementContainer.addEventListener(DomEvent.MOUSE_LEAVE, this._OnMouseLeave);
            }
        }
    }

    private static _RemoveCallbacks(): void {
        if (MainThree.DomElementContainer) {
            MainThree.DomElementContainer.removeEventListener(DomEvent.TOUCH_END, this._OnMouseUp);
            MainThree.DomElementContainer.removeEventListener(DomEvent.TOUCH_START, this._OnMouseDown);
            MainThree.DomElementContainer.removeEventListener(DomEvent.MOUSE_MOVE, this._OnMouseMove);
            MainThree.DomElementContainer.removeEventListener(DomEvent.TOUCH_MOVE, this._OnMouseMove);
            MainThree.DomElementContainer.removeEventListener(DomEvent.MOUSE_DOWN, this._OnMouseDown);
            MainThree.DomElementContainer.removeEventListener(DomEvent.MOUSE_UP, this._OnMouseUp);
            MainThree.DomElementContainer.removeEventListener(DomEvent.MOUSE_ENTER, this._OnMouseEnter);
            MainThree.DomElementContainer.removeEventListener(DomEvent.MOUSE_LEAVE, this._OnMouseLeave);
        }
    }

    private static _OnMouseEnter = (e: Event): void => {
        this._IsMouseEnter = true;
        this._UpdateMousePosition(e);
        this.OnMouseEnter.execute();
    }

    private static _OnMouseLeave = (e: Event): void => {
        this._IsMouseEnter = false;
        this._UpdateMousePosition(e);
        this.OnMouseLeave.execute();
    }

    private static _OnMouseDown = (e: Event): void => {
        this._UpdateMousePosition(e);
        this._OnMouseMove(e);
        this.OnMouseDown.execute();
    }

    private static _OnMouseUp = (): void => {
        this.OnMouseUp.execute();
    }

    private static _OnMouseMove = (e: Event): void => {
        this._IsMouseEnter = true;
        this._UpdateMousePosition(e);
        this.OnMouseMove.execute();
    }

    private static _UpdateMousePosition(e: Event): void {
        const { x, y } = this._GetMousePosition(e);
        this._MouseX = x;
        this._MouseY = y;
        this._RelativeMouseX = this._MouseX / MainThree.DomRect.width * 2 - 1;
        if (this._RelativeMouseX < -1) this._RelativeMouseX = -1;
        if (this._RelativeMouseX > 1) this._RelativeMouseX = 1;

        this._RelativeMouseY = -this._MouseY / MainThree.DomRect.height * 2 + 1;
        if (this._RelativeMouseY < -1) this._RelativeMouseY = -1;
        if (this._RelativeMouseY > 1) this._RelativeMouseY = 1;

    }


    private static _GetMousePosition(e: Event): { x: number, y: number } {
        if (e instanceof MouseEvent) {
            return { x: e.clientX, y: e.clientY };
        }
        if (window.TouchEvent && e instanceof TouchEvent) {
            if (e.touches.length > 0) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        }

        return { x: 0, y: 0 };
    }

    //#region getter/setter
    public static get MouseX(): number { return this._MouseX; }
    public static get MouseY(): number { return this._MouseY; }
    public static get RelativeMouseX(): number { return this._RelativeMouseX; }
    public static get RelativeMouseY(): number { return this._RelativeMouseY; }
    public static get IsStart(): boolean { return this._IsStart; }
    public static get IsMouseEnter(): boolean { return this._IsMouseEnter; }
    //#endregion

}