import { ViewBase } from "pancake";

export class SuperViewBase extends ViewBase {

    public static TransitionDuration: number = 1000;

    constructor(viewId: string, placementId: number) {
        super(viewId, placementId);
    }
}