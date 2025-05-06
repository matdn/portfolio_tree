import { Camera, Scene, WebGLRenderer } from "three";
import { PostProcessingId } from "../constants/games/PostProcessingId";
import { ThreeCamerasManager } from "../core/_engine/threejs/managers/ThreeCamerasManager";
import { ThreePostProcessingBase } from "../core/_engine/threejs/postprocessings/bases/ThreePostProcessingBase";
// import { UniversManager } from "../managers/UniversManager";
import { BlurPass } from "./passses/BlurPass";

export class BlurPostProcessing extends ThreePostProcessingBase {


    private readonly _blurPass: BlurPass;

    constructor() {
        super(PostProcessingId.BLUR);
        this._blurPass = new BlurPass();
    }

    public override init(scene: Scene, camera: Camera, renderer: WebGLRenderer): void {
        if (this._isInit) return;
        super.init(scene, camera, renderer);

        this._effectComposer.addPass(this._blurPass);

    }


    public override resize(width: number, height: number): void {
        super.resize(width, height);
    }

    public override render(): void {
        // const playerPos = UniversManager.GetCurrentGame()?.player?.getGroundPosition();
        const cameraPos = ThreeCamerasManager.ActivCamera?.position;
        // if (!playerPos || !cameraPos) return;
        // const d = playerPos.distanceTo(cameraPos);

        this._blurPass.setDepthTexture(this._depthTexture);
        super.render();
    }
}