import { Object3D } from "three";
import { Object3DBase } from "../views/components/Object3DBase";
import { Object3DsProxy } from "./Object3DsProxy";

export class SwapableObject3DsProxy {

    private static _Map = new Map<string, new () => Object3DBase>();

    public static Init(): void {

    }

    public static AddSwapableObject3D(name: string, factory: new () => Object3DBase): void {
        SwapableObject3DsProxy._Map.set(name, factory);
    }

    public static TestForSwapableObject3D(child: Object3D): void {
        const factory = SwapableObject3DsProxy._FindFactory(child);
        if (factory) {
            const o = new factory();
            o.position.copy(child.position);
            o.rotation.copy(child.rotation);
            o.scale.copy(child.scale);
            o.userData = child.userData;
            o.name = child.name;
            child.name += "_original";
            child.parent?.add(o);
            child.position.set(0, 0, 0);
            child.rotation.set(0, 0, 0);
            child.scale.set(1, 1, 1);
            child.userData = {};
            o.add(child);
            o.initValues();
            Object3DsProxy.UpdateObject3D(o, child);
            // const o = Object.setPrototypeOf(child, factory.prototype);
            // o.initValues();
            SwapableObject3DsProxy._AddObject3DBasePrototype(child.parent);
        }
    }

    private static _AddObject3DBasePrototype(target: Object3D | null): void {
        if (!target) return;
        if (!(target instanceof Object3DBase)) {
            Object.setPrototypeOf(target, Object3DBase.prototype);
        }
        if (target.parent) {
            SwapableObject3DsProxy._AddObject3DBasePrototype(target.parent);
        }
    }

    private static _FindFactory(child: Object3D): new () => Object3DBase | null {
        for (let [key, value] of SwapableObject3DsProxy._Map) {
            if (SwapableObject3DsProxy._IsSameName(child, key)) {
                return value;
            }
        }
        return null;
    }

    private static _IsSameName(child: Object3D, name: string): boolean {
        return (child.name.toLowerCase().includes(name.toLowerCase()));
    }
}