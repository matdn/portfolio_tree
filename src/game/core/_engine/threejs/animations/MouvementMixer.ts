import { AnimationClip, AnimationMixer, Object3D } from "three";
import { Mouvement } from "./Mouvement";

export class MouvementMixer {

    private _currentMouvementName: string = "";
    private _mixer: AnimationMixer;
    private _mouseventsMap = new Map<string, Mouvement>();


    constructor(target: Object3D) {
        this._mixer = new AnimationMixer(target);
    }

    public init(): void {
        this.reset();
    }

    public reset(): void {
        this._mixer.stopAllAction();
        this._currentMouvementName = "";
    }

    public addAnimationCLip(name: string, clip: AnimationClip, speed: number = 1, randomizeStart: boolean = false): void {
        const action = this._mixer.clipAction(clip);
        const mouvement = new Mouvement(action, speed, randomizeStart);
        this._mouseventsMap.set(name, mouvement);
    }

    public getMouvement(name: string): Mouvement {
        return this._mouseventsMap.get(name);
    }


    public update(dt: number): void {
        this._mixer.update(dt);
        for (const mvt of this._mouseventsMap.values()) {
            mvt.update(dt);
        }
    }

    public setAllMouvementTransitionDuration(duration: number): void {
        for (const movement of this._mouseventsMap.values()) {
            movement.setMovementTransitionDuration(duration);
        }
    }

    public setAllFrp(fps: number): void {
        for (const movement of this._mouseventsMap.values()) {
            movement.setFrp(fps);
        }
    }

    public play(name: string): void {
        if (this._currentMouvementName == name) return;
        for (const mvt of this._mouseventsMap.values()) {
            mvt.stop();
        }
        if (this._mouseventsMap.has(name)) {
            this._mouseventsMap.get(name).start();
            this._currentMouvementName = name;
        }
    }
}