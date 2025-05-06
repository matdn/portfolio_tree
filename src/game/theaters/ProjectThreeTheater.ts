import { MainInitCommand } from "../commands/inits/project/MainInitCommand";
import { ProjectInitCommand } from "../commands/inits/project/ProjectInitCommand";
import { AssetId } from "../constants/games/AssetId";
import { CameraId } from "../constants/games/CameraId";
import { TheaterId } from "../constants/theaters/TheaterId";
import { TheaterPlacementId } from "../constants/theaters/TheaterPlacementId";
import { ViewId } from "../constants/views/ViewId";
import ThreeTheaterBase from "../core/theaters/ThreeTheaterBase";

export class ProjectThreeTheater extends ThreeTheaterBase {


    constructor() {
        super(TheaterId.PROJECT, TheaterPlacementId.MAIN);
        this._initCommandsList.push(new ProjectInitCommand());

        this._viewsList.add(ViewId.PROJECT_REACT);
        this._cameraId = CameraId.MAIN;
    }


}