import { BoxGeometry, CameraHelper, Fog, Mesh, MeshBasicMaterial } from "three";
import { CameraId } from "../constants/games/CameraId";
import { FollowCameraControllerBase } from "./bases/FollowCameraControllerBase";

export class CinemaCameraController extends FollowCameraControllerBase {

    constructor() {
        super(CameraId.CINEMA);
        this.position.set(0, 1.2, -4.5);
        this.rotation.x = 0.1;
        this.add(new CameraHelper(this.camera));
    }

    public override start(): void {
        super.start();
    }

    public stop(): void {
        super.stop();
    }

    protected override _update(dt: number): void {
        super._update(dt);
    }
}
