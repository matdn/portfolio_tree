import { MainInitCommand } from "../commands/inits/project/MainInitCommand";
import { AssetId } from "../constants/games/AssetId";
import { CameraId } from "../constants/games/CameraId";
import { TheaterId } from "../constants/theaters/TheaterId";
import { TheaterPlacementId } from "../constants/theaters/TheaterPlacementId";
import { ViewId } from "../constants/views/ViewId";
import ThreeTheaterBase from "../core/theaters/ThreeTheaterBase";

export class MainTheater extends ThreeTheaterBase {


    constructor() {
        super(TheaterId.MAIN, TheaterPlacementId.MAIN);

        this._initCommandsList.push(new MainInitCommand());

        this._viewsList.add(ViewId.THREE_MAIN);
        this._viewsList.add(ViewId.MAIN_REACT);
        this._viewsList.add(ViewId.ENTRY_REACT);
        // this._viewsList.add(ViewId.PROJECT_REACT);
        this._cameraId = CameraId.MAIN;
        // this._threePostProcessingId = PostProcessingId.LEO;

        // this._environment = {
        //     background: 0x000000,
        //     environmentMapId: AssetId.HDR_STUDIO,
        // };

    }


}