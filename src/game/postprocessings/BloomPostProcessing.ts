import { Camera, Scene, Vector2, WebGLRenderer } from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ThreePostProcessingBase } from "../core/_engine/threejs/postprocessings/bases/ThreePostProcessingBase";
// import { DayCycleManager } from "../managers/DayCycleManager";
import { PostProcessingId } from "../constants/games/PostProcessingId";


export class BloomPostProcessing extends ThreePostProcessingBase {

    private readonly _bloomPass: UnrealBloomPass;

    constructor() {
        super(PostProcessingId.BLOOM);
        const strength: number = 0.2;
        const radius: number = .5;
        const threshold: number = 0.1;
        this._bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), strength, radius, threshold);
    }

    public override init(scene: Scene, camera: Camera, renderer: WebGLRenderer): void {
        if (this._isInit) return;
        super.init(scene, camera, renderer);
        this._effectComposer.addPass(this._bloomPass);

    }

    public override render(): void {
        super.render();
        // const p = Math.abs(Math.cos(DayCycleManager.Progression * Math.PI));
        this._bloomPass.strength = 0.05 * 0.15;
    }


    public override resize(width: number, height: number): void {
        super.resize(width, height);
        this._bloomPass.setSize(width, height);

    }

}
