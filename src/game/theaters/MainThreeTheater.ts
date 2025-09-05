import { Fog } from "three";
import { MainInitCommand } from "../commands/inits/project/MainInitCommand";
import { AssetId } from "../constants/games/AssetId";
import { CameraId } from "../constants/games/CameraId";
import { TheaterId } from "../constants/theaters/TheaterId";
import { TheaterPlacementId } from "../constants/theaters/TheaterPlacementId";
import { ViewId } from "../constants/views/ViewId";
import ThreeTheaterBase from "../core/theaters/ThreeTheaterBase";
import { MainThree } from "../core/_engine/threejs/MainThree";

export class MainTheater extends ThreeTheaterBase {

    private readonly _fog: Fog;
    private _fogScale: number = 250;

    constructor() {
        super(TheaterId.MAIN, TheaterPlacementId.MAIN);

        this._initCommandsList.push(new MainInitCommand());


        // this._siblingViewsList.add(ViewId.ABOUT_REACT);
        this._viewsList.add(ViewId.PROJECT_REACT);
        // this._viewsList.add(ViewId.THREE_MAIN);
        // this._viewsList.add(ViewId.THREE_CINEMA);
        // this._viewsList.add(ViewId.ENTRY_REACT);
        // this._siblingViewsList.add(ViewId.MAIN_REACT);
        this._fog = new Fog(0x000000, 60, 250);
        // this._viewsList.add(ViewId.TEST_REACT);
        this._viewsList.add(ViewId.TEST_THREE);
        this._cameraId = CameraId.MAIN;
        // this._threePostProcessingId = PostProcessingId.LEO;

        this._environment = {
            background: 0xffffff,
            environmentMapId: null,
            // environmentMapId: AssetId.HDR_STUDIO,
        };
        MainThree.Scene.fog = this._fog;
    }




}