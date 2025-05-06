import { Mesh, Object3D } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Object3DsProxy } from "../../core/_engine/threejs/proxies/Object3DsProxy";
import { ThreeAnimationsProxy } from "../../core/_engine/threejs/proxies/ThreeAnimationsProxy";
import { Object3DId } from "../../constants/games/Object3DId";


export class AnalyseGLTFCommand {

    public static Analyse(gltf: GLTF, prefrix: string = '', debug: boolean = false): void {
        const enumIds = Object.values(Object3DId);
        gltf.scene.traverse((child: Object3D) => {
            child.name = prefrix + child.name;
            enumIds.forEach((id: string) => {
                this._TestName(id, child);
            });

            if (child instanceof Mesh) {
                child.castShadow = this.TestForCastShadow(child);
                child.receiveShadow = this.TestForReciveShadow(child);
            }
        });

        for (const animationClip of gltf.animations) {
            // if(debug) console.log(animationClip)
            animationClip.name = prefrix + animationClip.name;
            for (const track of animationClip.tracks) {
                track.name = prefrix + track.name;
            }
            ThreeAnimationsProxy.AddAnimationClip(animationClip);
        }

    }

    public static TestForCastShadow(child: Object3D): boolean {
        let parent: Object3D | null = child;
        while (parent) {
            if (parent.name.toLowerCase().includes('cast_shadow')) return true;
            parent = parent.parent;
        }
        return false;
    }

    public static TestForReciveShadow(child: Object3D): boolean {
        let parent: Object3D | null = child;
        while (parent) {
            if (parent.name.toLowerCase().includes('receive_shadow')) return true;
            parent = parent.parent;
        }
        return false;
    }

    private static _TestName(name: string, child: Object3D): void {
        if (this.IsSameName(child, name)) {
            Object3DsProxy.AddObject3D(name, child);
        }
    }



    public static IsSameName(child: Object3D, name: string): boolean {
        return (child.name.toLowerCase().startsWith(name.toLowerCase()));
    }

    public static ContainsName(child: Object3D, name: string): boolean {
        return (child.name.toLowerCase().includes(name.toLowerCase()));
    }
}