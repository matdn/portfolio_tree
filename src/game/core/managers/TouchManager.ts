import { Action } from 'cookware';
import { DomEvent } from 'spices';

export class TouchManager {
    public static SwipeSensitivity: number = 35;

    private static readonly _TouchStartsMap = new Map<number, { x: number, y: number }>();
    private static readonly _VerticalSwipeMap = new Map<number, boolean>();
    private static readonly _HorizontalSwipeMap = new Map<number, boolean>();

    public static readonly OnTouchStart = new Action<[TouchEvent]>();
    public static readonly OnTouchEnd = new Action<[TouchEvent]>();
    public static readonly OnToucheMove = new Action<[TouchEvent]>();
    public static readonly OnVerticalSwipe = new Action<[number]>();
    public static readonly OnHorizontalSwipe = new Action<[number]>();


    public static Init(): void {
        //
    }

    public static Start(): void {
        TouchManager._AddCallbacks();
    }

    public static Stop(): void {
        TouchManager._RemoveCallbacks();
    }

    private static _AddCallbacks() {
        TouchManager._RemoveCallbacks();
        window.addEventListener(DomEvent.TOUCH_START, TouchManager._OnTouchStart);
        window.addEventListener(DomEvent.TOUCH_END, TouchManager._OnTouchEnd);
        window.addEventListener(DomEvent.TOUCH_MOVE, TouchManager._OnTouchMove);
    }

    private static _RemoveCallbacks() {
        window.removeEventListener(DomEvent.TOUCH_START, TouchManager._OnTouchStart);
        window.removeEventListener(DomEvent.TOUCH_END, TouchManager._OnTouchEnd);
        window.removeEventListener(DomEvent.TOUCH_MOVE, TouchManager._OnTouchMove);
    }

    private static _OnTouchStart(e: TouchEvent) {
        for (const touch of e.touches) {
            TouchManager._TouchStartsMap.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
            if (TouchManager._VerticalSwipeMap.has(touch.identifier)) return;
            TouchManager._VerticalSwipeMap.set(touch.identifier, false);
            TouchManager._HorizontalSwipeMap.set(touch.identifier, false);
        }
        TouchManager.OnTouchStart.execute(e)
    }

    private static _OnTouchEnd(e: TouchEvent) {
        TouchManager.OnTouchEnd.execute(e);

        for (const touch of e.changedTouches) {
            TouchManager._TouchStartsMap.delete(touch.identifier);
            TouchManager._VerticalSwipeMap.delete(touch.identifier);
            TouchManager._HorizontalSwipeMap.delete(touch.identifier);
        }
    }

    private static _OnTouchMove(e: TouchEvent) {
        TouchManager.OnToucheMove.execute(e);
        for (const touch of e.touches) TouchManager._OnSwipe(touch);
    }

    private static _OnSwipe(touch: Touch) {
        const id = touch.identifier;

        if (!TouchManager._TouchStartsMap.has(id)) return;
        const startX = TouchManager._TouchStartsMap.get(id).x;
        const startY = TouchManager._TouchStartsMap.get(id).y;
        const currentX = touch.clientX;
        const currentY = touch.clientY;

        const dx = currentX - startX;
        const dy = currentY - startY;

        TouchManager._OnVerticalSwipe(id, dx);
        TouchManager._OnHorizontalSwipe(id, dy);
    }

    private static _OnVerticalSwipe(id: number, dx: number) {
        if (TouchManager._VerticalSwipeMap.get(id)) return;
        let v: number = 0;

        if (dx >= TouchManager.SwipeSensitivity) v++
        if (dx <= TouchManager.SwipeSensitivity * -1) v--
        if (v !== 0) TouchManager._VerticalSwipeMap.set(id, true);

        TouchManager.OnVerticalSwipe.execute(v);
    }

    private static _OnHorizontalSwipe(id: number, dy: number) {
        if (TouchManager._HorizontalSwipeMap.get(id)) return;
        let v: number = 0;

        if (dy >= TouchManager.SwipeSensitivity) v++;
        if (dy <= TouchManager.SwipeSensitivity * -1) v--;
        if (v !== 0) TouchManager._HorizontalSwipeMap.set(id, true);

        TouchManager.OnHorizontalSwipe.execute(v);
    }
}
