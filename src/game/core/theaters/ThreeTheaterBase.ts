import { MainThree } from "../_engine/threejs/MainThree";
import { DebugOrbitThreeCameraController } from "../_engine/threejs/cameras/DebugOrbitThreeCameraController";
import { SuperTheaterBase } from "./SuperTheaterBase";

export type EnvironmentType = {
    environmentMapId: string | null,
    background: number | string | null
} | null;
export default class ThreeTheaterBase extends SuperTheaterBase { 
    protected _threePostProcessingId: string | null = null;
    protected _environment: EnvironmentType = null;
    protected _cameraId: string = DebugOrbitThreeCameraController.CAMERA_ID;

    constructor(theaterId: string, placementId: number) {
        super(theaterId, placementId);

        this._viewsList.add(MainThree.VIEW_ID);
    }

    //#region getter/setter
    public get threePostProcessingId(): string | null { return this._threePostProcessingId; }
    public get environment(): EnvironmentType { return this._environment; }
    //#endregion

}