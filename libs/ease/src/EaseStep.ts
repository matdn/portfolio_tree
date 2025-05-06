import { EaseFunction } from "./EaseFunction";
import { EaseManager } from "./EaseManager";
import { EaseStepType } from "./EaseStepType";

export class EaseStep {

    private static _Compteur: number = 0;
    public uid: string = 'EaseStep-' + (EaseStep._Compteur++);

    public startTimems: number;
    public startValue: number;
    public endValue: number;
    public deltaValue: number;
    public timems: number;
    public easeFunction: (t: number) => number;
    public type: EaseStepType;
    public callback?: (v: number) => void;
    public compteurInit:number = 0;


    constructor() {
        // 
    }

    init(type: EaseStepType, endValue: number, timems: number = 0, easeFunction: (t: number) => number = EaseFunction.Linear, callback?: (v: number) => void) {
        this.clear();
        this.endValue = endValue;
        this.timems = timems;
        this.type = type;
        this.easeFunction = easeFunction;
        this.callback = callback;
    }

    public clear() {
        this.startValue = 0;
        this.endValue = 0;
        this.timems = 0;
        this.startTimems = 0;
        this.easeFunction = EaseFunction.Linear;
        this.callback = undefined;
        this.deltaValue = 0;
        this.type = EaseStepType.NONE;

    }

    public start(startValue: number, decal: number = 0) {
        this.startValue = startValue;
        this.startTimems = EaseManager.GetTime() - decal;
        this.deltaValue = this.endValue - this.startValue;
    }

    public getValue(t: number) {
        if (t < 0) t = 0;
        if (t > 1) t = 1;
        t = this.easeFunction(t);
        return this.startValue + t * this.deltaValue;
    }

    //#region Pool
    private static _Pool: Array<EaseStep> = new Array<EaseStep>();
    public static Get() {
        let step: EaseStep;
        if (this._Pool.length > 0) step = this._Pool.pop() as EaseStep;
        else step = new EaseStep();
        step.clear();
        step.compteurInit++;
        return step;

    }

    public static Release(step?: EaseStep) {
        if (step) {
            if (this._Pool.indexOf(step) < 0) {
                step.clear();
                this._Pool.push(step);
            }
        }
    }
    //#endregion

}