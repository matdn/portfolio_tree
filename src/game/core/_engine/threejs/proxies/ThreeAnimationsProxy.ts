import { AnimationClip } from "three";

export class ThreeAnimationsProxy {

    private static _AnimationClipMap = new Map<string, AnimationClip>()

    public static Init() {
        this._AnimationClipMap.clear();
    }

    public static AddAnimationClip(clip: AnimationClip): void {
        this._AnimationClipMap.set(clip.name, clip);
    }

    public static GetAnimationClip(id: string): AnimationClip {
        return this._AnimationClipMap.get(id) as AnimationClip;
    }
}