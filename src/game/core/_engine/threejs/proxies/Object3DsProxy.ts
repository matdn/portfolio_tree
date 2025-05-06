import { Object3D } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";

export class Object3DsProxy {

    private static _Object3DsMap = new Map<string, Object3D>();

    public static Init(): void {
        this._Object3DsMap.clear();
    }

    public static UpdateObject3D(newObject: Object3D, lastObject: Object3D): void {
        for (const key of this._Object3DsMap.keys()) {
            const object = this._Object3DsMap.get(key);
            if (object === lastObject) {
                this._Object3DsMap.set(key, newObject);
            }
        }
    }

    public static AddObject3D(id: string, object3D: Object3D): void {
        this._Object3DsMap.set(id, object3D);
    }

    public static GetObject3D<T extends Object3D>(id: string): T {
        if (this._Object3DsMap.has(id)) {
            return this._Object3DsMap.get(id) as T;
        }
        throw new Error(`The Object3D ${id} do not exist in the proxy`);
    }

    public static GetClone<T extends Object3D>(id: string, recursive: boolean = true): T {
        if (this._Object3DsMap.has(id)) {
            return this.Clone<T>(this.GetObject3D<T>(id), recursive);
        }
        throw new Error(`The Object3D ${id} do not exist in the proxy`);
    }

    public static Clone<T extends Object3D>(object3D: Object3D, recursive: boolean = true): T {
        // const clone = object3D.clone(recursive);
        const clone = SkeletonUtils.clone(object3D)
        clone.position.set(0, 0, 0);
        clone.rotation.set(0, 0, 0);
        clone.scale.set(1, 1, 1);
        return clone as T;
    }
}