import { Ticker } from 'cookware';
import { Mixin } from 'ts-mixer';
import { Object3DBase } from '../components/Object3DBase';
import { SuperViewBase } from '../../../../views/bases/SuperViewBase';

export class ThreeViewBase extends Mixin(SuperViewBase, Object3DBase) {
    constructor(viewId: string, placementId: number) {
        super(viewId, placementId);
    }


    public override init() {
        super.init();
        Ticker.Add(this._update);
    }


    protected override  _outroFinish(): void {
        super._outroFinish();
        Ticker.Remove(this._update);
        this.reset();
    }

    private _update = (dt: number): void => {
        this.update(dt);
    }
}
