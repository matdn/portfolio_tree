import { ThreeCameraControllerBase } from "../cameras/bases/ThreeCameraControllerBase";

export class ThreeCamerasProxy {

    private static _CamerasMap = new Map<string, ThreeCameraControllerBase>();

    public static Init() {
        this._CamerasMap.clear();
    }

    public static AddCamera(camera: ThreeCameraControllerBase): void {
        this._CamerasMap.set(camera.cameraId, camera);
    }

    public static GetCamera<T extends ThreeCameraControllerBase>(cameraId: string): T {
        if (this._CamerasMap.has(cameraId)) {
            return this._CamerasMap.get(cameraId) as T;
        }
        throw new Error(`The ThreeCameraControllerBase ${cameraId} do not exist in the proxy`);
    }

    //#region getter/setter
    public static get CamerasMap(): ReadonlyMap<string, ThreeCameraControllerBase> { return this._CamerasMap; }
    //#endregion

}