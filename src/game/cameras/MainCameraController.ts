import { BoxGeometry, CameraHelper, Fog, Mesh, MeshBasicMaterial } from "three";
import { CameraId } from "../constants/games/CameraId";
import { FollowCameraControllerBase } from "./bases/FollowCameraControllerBase";

export class MainCameraController extends FollowCameraControllerBase {

    constructor() {
        super(CameraId.MAIN);
        this.position.set(0, 0, 120);
        this.lookAt(0, 0, 0);
        // this.add(new CameraHelper(this.camera));
    }

    public override start(): void {
        super.start();
    }

    public stop(): void {
        super.stop();
    }

    protected override _update(dt: number): void {
        super._update(dt);
        // this.position.z += -0.02;
    }
}
