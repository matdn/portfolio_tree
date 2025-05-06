import { Object3D } from "three";

export class Object3DBase extends Object3D {

    private readonly _isExtendedObject3D: boolean = true;

    public init(): void {
        for (const child of this.children) {
            if (this._isChildObject3DBase(child)) {
                (child as any).init();
            }
        }
    }

    public initValues():void{
        
    }

    public start(): void {
        for (const child of this.children) {
            if (this._isChildObject3DBase(child)) {
                (child as any).start();
            }
        }
    }

    public stop(): void {
        for (const child of this.children) {
            if (this._isChildObject3DBase(child)) {
                (child as any).stop();
            }
        }
    }

    public reset(): void {
        for (const child of this.children) {
            if (this._isChildObject3DBase(child)) {
                (child as any).reset();
            }
        }
    }

    public update(dt: number): void {
        for (const child of this.children) {
            if (this._isChildObject3DBase(child)) {
                (child as any).update(dt);
            }
        }
    }

    public resize(width: number, height: number): void {
        for (const child of this.children) {
            if (this._isChildObject3DBase(child)) {
                (child as any).resize(width, height);
            }
        }
    }

    private _isChildObject3DBase(child: Object3D): boolean {
        if (child instanceof Object3DBase) return true;
        if((child as any)._isExtendedObject3D) return true;
        return false;
    }

}