import { EaseFunction } from "./EaseFunction";
import { EaseManager } from "./EaseManager";
import { EaseStep } from "./EaseStep";
import { EaseStepType } from "./EaseStepType";

export class Ease {

    private static _Compteur = 0;
    private _uid: string = 'Ease-' + (Ease._Compteur++);


    private _currentStep?: EaseStep;
    private _currentValue: number;
    private _currentStepTime: number;
    private _currentStepProgression: number = 0;

    private _stepsList: Array<EaseStep>;
    private _easeLate: number = 0;

    public onChange?: (v: number, ease: Ease) => void;

    constructor(startValue: number = 0) {
        this._currentValue = startValue;
        this._stepsList = new Array<EaseStep>();

    }

    public from(value: number, callback?: (n: number) => void): Ease {
        const step: EaseStep = EaseStep.Get();
        step.init(EaseStepType.FROM, value, 0, undefined, callback);
        this._addStep(step);
        return this;
    }

    public to(value: number, timems: number = 1000, easeFunction: (t: number) => number = EaseFunction.Linear, callback?: (n: number) => void): Ease {
        const step: EaseStep = EaseStep.Get();
        step.init(EaseStepType.TO, value, timems, easeFunction, callback);
        this._addStep(step);
        return this;
    }

    public wait(timems: number, callback?: (n: number) => void): Ease {
        const step: EaseStep = EaseStep.Get();
        step.init(EaseStepType.WAIT, 0, timems, EaseFunction.Linear, callback);
        this._addStep(step);
        return this;
    }

    public call(callback: (n: number) => void): Ease {
        const step: EaseStep = EaseStep.Get();
        step.init(EaseStepType.CALL, 0, 0, EaseFunction.Linear, callback);
        this._addStep(step);
        return this;
    }

    private _addStep(step: EaseStep): void {
        if (this._stepsList.indexOf(step) < 0) {
            this._stepsList.push(step);
            this._nextStep();
        }
    }

    public clear(): Ease {
        for (let step of this._stepsList) {
            EaseStep.Release(step);
        }
        this._stepsList.length = 0;
        this._easeLate = 0;
        this._currentStep = undefined;
        this._currentStepProgression = 0;
        EaseManager.Remove(this);

        return this;
    }

    public setValue(value: number): Ease {
        this._currentValue = value;
        return this;
    }

    private _nextStep(): void {

        if (this._currentStep) return;

        if (this._stepsList.length == 0) {
            // if(this.debug) {console.log("nextStep CLEARING ! ===============");}
            this.clear();
            return;
        }

        this._currentStep = this._stepsList.shift() as EaseStep;
        this._currentStep.start(this._currentValue, this._easeLate);
        this._easeLate = 0;
        this._currentStepTime = 0;
        EaseManager.Add(this);
    }

    public render(dt: number): void {
        this._currentStepTime += dt;
        this._currentStepProgression = 0;
        if (!this._currentStep) return;
        if (this._currentStep.type === EaseStepType.FROM) {
            this._currentValue = this._currentStep.endValue;
            const canContinue = this._onChange();
            if (!canContinue) return;
            this._endStep();
            return;
        }
        if (this._currentStep.type === EaseStepType.CALL) {
            const canContinue = this._onChange();
            if (!canContinue) return;
            this._endStep();
            return;
        }
        const now = EaseManager.GetTime();
        const ellapse = now - this._currentStep.startTimems;
        // const ellapse = this._currentStepTime;

        if (this._currentStep.type === EaseStepType.TO) {
            let t = ellapse / this._currentStep.timems;
            if (this._currentStep.timems == 0) t = 1;
            if (t < 0) t = 0;
            if (t > 1) t = 1;
            this._currentStepProgression = t;
            this._currentValue = this._currentStep.getValue(t);
            const canContinue = this._onChange();
            if (!canContinue) return;
            if (ellapse > this._currentStep.timems) {
                // this._easeLate = now - (this._currentStep.startTimems + this._currentStep.timems);
                this._easeLate = ellapse - this._currentStep.timems;
                this._endStep();
            }
            return;
        }
        if (this._currentStep.type === EaseStepType.WAIT) {
            if (ellapse > this._currentStep.timems) {
                this._easeLate = ellapse - this._currentStep.timems;
                this._endStep();
            }
            return;
        }

    }

    private _onChange(): boolean {
        if (!this._currentStep) return false;
        const uid = this._currentStep.uid;
        const compteurInit = this._currentStep.compteurInit;

        this.onChange?.(this._currentValue, this);
        if (this._currentStep.callback) {
            let n: number = 0;
            if (this._currentValue) { n = this._currentValue; }
            this._currentStep.callback?.(n);
        }
        return (this._currentStep && this._currentStep.uid == uid && this._currentStep.compteurInit == compteurInit);
    }

    private _endStep(): void {
        EaseStep.Release(this._currentStep);
        this._currentStep = undefined;
        this._nextStep();
    }

    //#region getter/setter
    public get uid() { return this._uid; }
    public get currentStepProgression(): number { return this._currentStepProgression; }
    public get currentValue(): number { return this._currentValue; }
    //#endregion

}











