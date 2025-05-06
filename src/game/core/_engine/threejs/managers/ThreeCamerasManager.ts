import { TheatersManager } from "pancake";
import { DomEvent, KeyboardConstant } from "spices";
import { MainThree } from "../MainThree";
import { DebugOrbitThreeCameraController } from "../cameras/DebugOrbitThreeCameraController";
import { ThreeCameraControllerBase } from "../cameras/bases/ThreeCameraControllerBase";
import { ThreeCamerasProxy } from "../proxies/ThreeCamerasProxy";
import { SuperTheaterBase } from "../../../theaters/SuperTheaterBase";
import { Action } from "cookware";


export class ThreeCamerasManager {

    private static _ActivCamera: ThreeCameraControllerBase | null = null;

    public static readonly OnChangeActivCamera = new Action();

    public static Init() {
        this.SetActivCamera(DebugOrbitThreeCameraController.CAMERA_ID);
        window.addEventListener(DomEvent.KEY_UP, this._OnKeyUp);
        TheatersManager.OnShowTheater.add(this._OnShowTheater);
    }

    private static _OnShowTheater = (): void => {
        const cameraId = this.GetTopTheaterCameraId();
        if(cameraId) this.SetActivCamera(cameraId);
    }


    private static _OnKeyUp = (e: KeyboardEvent): void => {
        if (e.shiftKey && (e.code == KeyboardConstant.Codes.KeyC)) {
            if (this._ActivCamera) {
                if (this._ActivCamera.cameraId == DebugOrbitThreeCameraController.CAMERA_ID) {
                    this.SetActivCamera(this.GetTopTheaterCameraId());
                } else {
                    this.SetActivCamera(DebugOrbitThreeCameraController.CAMERA_ID);
                }
            }
        }
    }

    public static SetDomElement(dom: HTMLElement): void {
        ThreeCamerasProxy.CamerasMap.forEach((camera: ThreeCameraControllerBase) => {
            camera.setDomElement(dom);
        });
    }


    public static SetActivCamera(id: string | null): void {
        if (this._ActivCamera && this._ActivCamera.cameraId == id && this._ActivCamera?.parent) {
            if (!this._ActivCamera.isActiv) this._ActivCamera.start();
            return;
        }
        ThreeCamerasProxy.CamerasMap.forEach((camera: ThreeCameraControllerBase) => {
            if (camera.cameraId != id) camera.stop();
        });

        if (id) {
            this._ActivCamera = ThreeCamerasProxy.GetCamera(id);
            this._ActivCamera.start();
            MainThree.SetCameraController(this._ActivCamera);
        }
        this.OnChangeActivCamera.execute();
    }


    public static GetTopTheaterCameraId(): string | null {
        let cameraId: string | null = null;
        for (let i = TheatersManager.CurrentTheatersList.length - 1; i >= 0; i--) {
            const theater = TheatersManager.CurrentTheatersList[i];
            if (theater instanceof SuperTheaterBase) {
                if (theater.cameraId) {
                    cameraId = theater.cameraId;
                }
            }
        }
        return cameraId;
    }

    //#region getter/setter
    public static get ActivCamera(): ThreeCameraControllerBase { return this._ActivCamera as ThreeCameraControllerBase; }
    //#endregion
}