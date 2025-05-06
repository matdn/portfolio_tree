import { Ticker } from "cookware";
import { ViewsManager } from "pancake";
import { Vector3 } from "three";
import { ViewId } from "../../constants/views/ViewId";
import { ThreeCameraControllerBase } from "../../core/_engine/threejs/cameras/bases/ThreeCameraControllerBase";


export class FollowCameraControllerBase extends ThreeCameraControllerBase {


    protected _zoomToActor: boolean = false;

    protected _lookAt = new Vector3();

    protected _targetPosition: Vector3 | null = null;
    protected _targetLookAt: Vector3 | null = null;

    constructor(cameraId: string) {
        super(cameraId);
        // this.debug = true;
        this._camera.near = 1;
        this._camera.far = 500;
        this._camera.fov = 55;
        this._camera.rotation.y = Math.PI;
    }


    public override start(): void {
        super.start();
        Ticker.Add(this.__update);
    }

    public override stop(): void {
        super.stop();
        if (!this.debug) Ticker.Remove(this.__update);
        this._targetLookAt = null;
        this._targetPosition = null;
    }

    private readonly __update = (dt: number): void => {
        this._update(dt);
    }

    protected _update(dt: number): void {
        // 
    }



   

}